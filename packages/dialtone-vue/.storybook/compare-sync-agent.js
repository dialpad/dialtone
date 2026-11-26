// The sync agent of dialtone-react's comparison Storybook (packages/dialtone-react/compare/). The comparison frames
// this preview next to the other framework's; with its sync setting on, each preview's agent reports the real pointer
// and page scroll to the comparison page, and replays what the other preview reported, so both stories react to the
// same input. Vue's preview (preview.js) and React's (dialtone-react/.storybook/preview.tsx) both install it.
//
// It stays inert until the comparison page's handshake: until then it only listens for that message, adds nothing to
// the DOM and attaches no input listeners. Everything goes through postMessage, so it works for the published
// previews (one origin) and the local dev servers (one origin each) alike.
//
// Phase 1 mirrors pointer movement, clicks and page scroll. No keyboard, and it never moves focus.

/** Marks this agent's messages, so neither side mistakes them for Storybook's channel (`storybook-channel`). */
export const COMPARE_SYNC_KEY = 'dialtone-compare-sync';

// One agent per window, also when a hot update runs preview.js again.
const INSTANCE = Symbol.for('dialtone.compareSyncAgent');

const POINTER_KINDS = { pointermove: 'move', pointerdown: 'down', pointerup: 'up' };
// Only the last position of a run of moves, or of scrolls, has to travel.
const COALESCED = new Set(['move', 'scroll']);
const REPLAYED_KINDS = new Set(['move', 'down', 'up', 'click', 'leave', 'scroll']);

const isFiniteNumber = value => typeof value === 'number' && Number.isFinite(value);

// A replayed event the agent can act on: one of its kinds, with finite coordinates where it has any.
const isReplayEvent = event => REPLAYED_KINDS.has(event?.kind) &&
  (event.kind === 'leave' || (isFiniteNumber(event.x) && isFiniteNumber(event.y)));

const clamp = (value, max) => Math.min(Math.max(value, 0), Math.max(max, 0));

// Scroll positions can be fractional; within half a pixel is the same position.
const samePosition = (a, b) => Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5;

const pathOf = (element) => {
  const path = [];
  for (let node = element; node; node = node.parentElement) path.push(node);
  return path;
};

/**
 * Installs the agent in a preview window. Returns null outside a frame, where no comparison can host it.
 * @param {object} [options]
 * @param {Window} [options.win] The preview's window.
 * @param {(event: Event) => boolean} [options.isReal] Whether an event is real input: `isTrusted`, so replayed
 *   events never travel back. Tests stand in for it, since a script can't make a trusted event.
 * @param {(callback: () => void) => void} [options.requestFrame] Schedules the once-per-frame flush.
 * @returns {{ uninstall: () => void } | null}
 */
export function installCompareSyncAgent ({
  win = window,
  isReal = event => event.isTrusted,
  requestFrame = callback => win.requestAnimationFrame(callback),
} = {}) {
  if (win.parent === win) return null;
  win[INSTANCE]?.uninstall();

  const doc = win.document;
  // The comparison page's origin, from its handshake. Null while inert.
  let host = null;
  let queue = [];
  let flushRequested = false;
  // A real press ended and its click hasn't gone yet (see onClick).
  let clickDue = false;
  // Where the last replayed scroll left the page, until its own scroll event has gone by (see applyScroll).
  let applied = null;
  // The replayed pointer's element and its ancestors, innermost first, and where it was.
  let hovered = [];
  let lastPoint = { x: 0, y: 0 };
  // The replayed button, while it's down: whether its pointerdown was cancelled, which suppresses the mouse events of
  // the press (not the click).
  let press = null;

  const post = message => win.parent.postMessage({ key: COMPARE_SYNC_KEY, ...message }, host);
  const viewport = () => ({ width: win.innerWidth, height: win.innerHeight });
  const scroller = () => doc.scrollingElement ?? doc.documentElement;
  const scrollPosition = () => ({ x: scroller().scrollLeft, y: scroller().scrollTop });

  // Sending: real input, batched once per animation frame. Every batch carries the viewport's size, so the
  // comparison can map a point to the other frame.

  const flush = () => {
    flushRequested = false;
    if (!host) return;
    post({ type: 'input', viewport: viewport(), events: queue });
    queue = [];
  };

  const enqueue = (event) => {
    const last = queue[queue.length - 1];
    if (event && last?.kind === event.kind && COALESCED.has(event.kind)) queue[queue.length - 1] = event;
    else if (event) queue.push(event);
    if (!flushRequested) {
      flushRequested = true;
      requestFrame(flush);
    }
  };

  const onPointer = (event) => {
    if (!isReal(event)) return;
    clickDue = event.type === 'pointerup';
    enqueue({ kind: POINTER_KINDS[event.type], x: event.clientX, y: event.clientY });
  };

  // One click per press. A label's click is followed by a trusted click on its control, which the replayed click on
  // the label makes again in the other frame: sending both would toggle a checkbox twice. A keyboard's click has no
  // press, and phase 1 mirrors no keyboard.
  const onClick = (event) => {
    if (!isReal(event) || !clickDue) return;
    clickDue = false;
    enqueue({ kind: 'click', x: event.clientX, y: event.clientY });
  };

  // A pointerout with no element to go to: the pointer left this document.
  const onPointerOut = (event) => {
    if (isReal(event) && !event.relatedTarget) enqueue({ kind: 'leave' });
  };

  // Scroll events are trusted even when a script scrolled, so a replayed scroll's own event is told apart by the
  // position it left, not by a flag: a flag would also swallow a real scroll when the replayed one moved nothing.
  const onScroll = (event) => {
    if (event.target !== doc || !isReal(event)) return;
    const position = scrollPosition();
    const echo = applied && samePosition(position, applied);
    applied = null;
    if (!echo) enqueue({ kind: 'scroll', ...position });
  };

  // A new size goes out with an empty batch.
  const onResize = () => enqueue(null);

  // Capture, so a story that stops propagation still reports.
  const listeners = [
    ['pointermove', onPointer, true],
    ['pointerdown', onPointer, true],
    ['pointerup', onPointer, true],
    ['click', onClick, true],
    ['pointerout', onPointerOut, true],
    ['scroll', onScroll, false],
    ['resize', onResize, false],
  ];

  // Replaying: what the other frame reported. Dispatched events are untrusted, so none of them is sent back.

  const fire = (target, type, init) => {
    const Constructor = type.startsWith('pointer') && win.PointerEvent ? win.PointerEvent : win.MouseEvent;
    // Enter and leave neither bubble nor cancel; every other pointer and mouse event does both.
    const boundary = /enter|leave/.test(type);
    return target.dispatchEvent(new Constructor(type, {
      bubbles: !boundary,
      cancelable: !boundary,
      composed: true,
      view: win,
      clientX: lastPoint.x,
      clientY: lastPoint.y,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      ...init,
    }));
  };

  // What a browser fires when the pointer goes from one element to another: out on the one it left and over on the
  // one it reached, then leave on each element it left (innermost first) and enter on each it entered (outermost
  // first), stopping at the ancestors both share. Enter and leave don't bubble, and components listen for them on
  // wrappers (Vue's tooltip listens for mouseenter on its anchor's wrapper), so each element gets its own.
  const crossBoundary = (to) => {
    const [previous = null] = hovered;
    const [next = null] = to;
    const left = hovered.filter(node => !to.includes(node));
    const entered = to.filter(node => !hovered.includes(node)).reverse();
    for (const prefix of ['pointer', 'mouse']) {
      if (previous) fire(previous, `${prefix}out`, { relatedTarget: next });
      left.forEach(node => fire(node, `${prefix}leave`, { relatedTarget: next }));
    }
    for (const prefix of ['pointer', 'mouse']) {
      if (next) fire(next, `${prefix}over`, { relatedTarget: previous });
      entered.forEach(node => fire(node, `${prefix}enter`, { relatedTarget: previous }));
    }
    hovered = to;
  };

  // The element under a point, after the boundary events of getting there.
  const pointTo = ({ x, y }) => {
    lastPoint = { x, y };
    const target = doc.elementFromPoint(x, y) ?? doc.documentElement;
    if (target !== hovered[0]) crossBoundary(pathOf(target));
    return target;
  };

  const movePointer = (point) => {
    const target = pointTo(point);
    const buttons = { buttons: press ? 1 : 0 };
    fire(target, 'pointermove', buttons);
    if (!press?.cancelled) fire(target, 'mousemove', buttons);
  };

  const releasePointer = () => {
    press = null;
    if (hovered.length) crossBoundary([]);
  };

  // A click replays as the other frame fired it: pointerdown and mousedown when the button goes down, pointerup and
  // mouseup when it comes up, then click. Each part replays when it happens, so a component that acts on the press
  // alone (a popover closing on an outside pointerdown, with no click after it) acts in both frames. These events
  // have no default action, so nothing takes focus.
  const pressAt = (point) => {
    const target = pointTo(point);
    const init = { button: 0, buttons: 1 };
    press = { cancelled: !fire(target, 'pointerdown', init) };
    if (!press.cancelled) fire(target, 'mousedown', { ...init, detail: 1 });
  };

  const releaseAt = (point) => {
    const target = pointTo(point);
    const init = { button: 0, buttons: 0 };
    const cancelled = press?.cancelled;
    press = null;
    fire(target, 'pointerup', init);
    if (!cancelled) fire(target, 'mouseup', { ...init, detail: 1 });
  };

  const clickAt = (point) => {
    fire(pointTo(point), 'click', { button: 0, buttons: 0, detail: 1 });
  };

  // Scrolls the page to the other frame's position in pixels, clamped to this page. The position it leaves is
  // remembered until the next frame, by when the browser has fired the scroll event for it, so that event isn't sent
  // back (onScroll).
  const applyScroll = ({ x, y }) => {
    const element = scroller();
    const before = scrollPosition();
    const goal = {
      x: clamp(x, element.scrollWidth - element.clientWidth),
      y: clamp(y, element.scrollHeight - element.clientHeight),
    };
    if (samePosition(before, goal)) return;
    // Instant, even under `scroll-behavior: smooth`: an animated scroll's intermediate events would read as real.
    win.scrollTo({ left: goal.x, top: goal.y, behavior: 'instant' });
    const after = scrollPosition();
    if (samePosition(after, before)) return;
    const mark = after;
    applied = mark;
    requestFrame(() => {
      if (applied === mark) applied = null;
    });
  };

  const replayers = {
    move: movePointer,
    down: pressAt,
    up: releaseAt,
    click: clickAt,
    leave: releasePointer,
    scroll: applyScroll,
  };

  // The handshake.

  const listen = (on) => {
    for (const [type, listener, capture] of listeners) {
      if (on) win.addEventListener(type, listener, capture);
      else win.removeEventListener(type, listener, capture);
    }
  };

  const connect = (origin) => {
    if (!host) listen(true);
    // An opaque origin (a sandboxed comparison) can only be reached with '*'.
    host = origin === 'null' ? '*' : origin;
    post({ type: 'ready', viewport: viewport() });
  };

  const disconnect = () => {
    if (!host) return;
    listen(false);
    releasePointer();
    host = null;
    queue = [];
    applied = null;
    clickDue = false;
  };

  const replay = (events) => {
    if (host && Array.isArray(events)) events.filter(isReplayEvent).forEach(event => replayers[event.kind](event));
  };

  // Only the window framing this preview can switch the agent on, and only with this agent's key.
  const onMessage = (event) => {
    const { data } = event;
    if (event.source !== win.parent || data?.key !== COMPARE_SYNC_KEY) return;
    if (data.type === 'connect') connect(event.origin);
    else if (data.type === 'disconnect') disconnect();
    else if (data.type === 'replay') replay(data.events);
  };

  win.addEventListener('message', onMessage);

  const agent = {
    uninstall () {
      disconnect();
      win.removeEventListener('message', onMessage);
      if (win[INSTANCE] === agent) delete win[INSTANCE];
    },
  };
  win[INSTANCE] = agent;
  return agent;
}
