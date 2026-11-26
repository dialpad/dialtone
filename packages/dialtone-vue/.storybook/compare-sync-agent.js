// The sync agent of dialtone-react's comparison Storybook (packages/dialtone-react/compare/). The comparison frames
// this preview next to the other framework's; with its sync setting on, each preview's agent reports the real pointer
// and page scroll to the comparison page, and replays what the other preview reported, so both stories react to the
// same input. Vue's preview (preview.js) and React's (dialtone-react/.storybook/preview.tsx) both install it.
//
// It stays inert until the comparison page's handshake: until then it only listens for that message, adds nothing to
// the DOM and attaches no input listeners. Everything goes through postMessage, so it works for the published
// previews (one origin) and the local dev servers (one origin each) alike. Only a page it trusts can switch it on:
// one of its own origin (the published bundle) or a local comparison (see trustedOrigins).
//
// It mirrors pointer movement, presses of the primary button (so drags) with the modifier keys held, clicks, page
// scroll and the scroll of elements inside the story, named keys (Escape, the arrows, Enter in a text field), the
// values of text fields, selects and range inputs, and where focus is. Hover styles too: the browser's :hover follows
// only the real pointer, so the elements under the replayed pointer get an attribute that copies of the page's :hover
// rules apply to (compare-sync-hover.js).
//
// Real keyboard focus stays in the source: the frame the last real press, key or typing happened in. The other frame,
// the mirror, never takes it: while it's the mirror, its `focus()` does nothing but show where focus would have gone,
// as a ring the comparison page draws over the frame. So a component that focuses itself on a replayed click (Dropdown
// opening its menu) can't take focus from the frame you're typing in.

import { createHoverEmulation } from './compare-sync-hover.js';

/** Marks this agent's messages, so neither side mistakes them for Storybook's channel (`storybook-channel`). */
export const COMPARE_SYNC_KEY = 'dialtone-compare-sync';

// One agent per window, also when a hot update runs preview.js again.
const INSTANCE = Symbol.for('dialtone.compareSyncAgent');

// The comparison Storybook's local port (packages/dialtone-react/compare/ports.json, `compare`; a test there keeps the
// two the same), which the local comparison page is served from under both names of this machine.
export const COMPARE_PORT = 9013;
export const DEFAULT_COMPARE_HOSTS = [`http://localhost:${COMPARE_PORT}`, `http://127.0.0.1:${COMPARE_PORT}`];

/**
 * The origins in a comma-separated list (STORYBOOK_COMPARE_SYNC_HOSTS), each as an origin: `http://localhost:9500/`
 * is `http://localhost:9500`. An entry that isn't a URL, or whose origin is opaque, is left out.
 * @param {string} text
 * @returns {string[]}
 */
export function parseHosts (text) {
  return text.split(',').map(entry => entry.trim()).filter(Boolean).map((entry) => {
    try {
      return new URL(entry).origin;
    } catch {
      return 'null';
    }
  }).filter(origin => origin !== 'null');
}

/**
 * The origins whose page may frame this preview as the comparison: its own (the published bundle serves the
 * comparison and the previews from one origin), and the local comparison's, which STORYBOOK_COMPARE_SYNC_HOSTS
 * replaces for one on another port. Never an opaque origin ('null'), which any sandboxed page has.
 * @param {Window} win
 * @param {string} [hosts] STORYBOOK_COMPARE_SYNC_HOSTS, when it's set.
 * @returns {Set<string>}
 */
export function trustedOrigins (win, hosts) {
  const origins = new Set(hosts ? parseHosts(hosts) : DEFAULT_COMPARE_HOSTS);
  if (win.origin && win.origin !== 'null') origins.add(win.origin);
  return origins;
}

const POINTER_KINDS = { pointermove: 'move', pointerdown: 'down', pointerup: 'up' };
// Only the last position of a run of moves, or of scrolls, has to travel.
const COALESCED = new Set(['move', 'scroll']);
const POINT_KINDS = new Set(['move', 'down', 'up', 'click', 'scroll', 'scroller']);
// What the user does, as opposed to where the pointer is: a frame replaying any of these is the mirror.
const INTERACTIONS = new Set(['down', 'up', 'click', 'keydown', 'keyup', 'value']);

// A text longer than this isn't copied: the comparison's stories don't hold one, and a message shouldn't carry it.
export const MAX_TEXT = 10000;

const isFiniteNumber = value => typeof value === 'number' && Number.isFinite(value);
const isPoint = value => isFiniteNumber(value?.x) && isFiniteNumber(value?.y);
const isShortString = (value, max) => typeof value === 'string' && value.length <= max;

// The modifier keys held, as they travel with a key or a pointer event, and as a replayed event's init takes them.
const FLAGS = ['alt', 'ctrl', 'meta', 'shift'];
const flagsOf = event => ({ alt: event.altKey, ctrl: event.ctrlKey, meta: event.metaKey, shift: event.shiftKey });
const modifiersOf = event => ({
  altKey: event.alt === true,
  ctrlKey: event.ctrl === true,
  metaKey: event.meta === true,
  shiftKey: event.shift === true,
});
// A pointer event's flags may be missing (an agent from before they travelled), but not anything else.
const hasFlags = event => FLAGS.every(flag => event[flag] === undefined || typeof event[flag] === 'boolean');
const isRank = value => Array.isArray(value) && value.length === 2 &&
  value.every(number => Number.isInteger(number) && number >= -1);

// Where an element is, in terms that survive the other framework's markup (see locatorOf).
const isLocator = value => isShortString(value?.role, 64) && isShortString(value.qa, 200) &&
  isShortString(value.name, 80) && isPoint(value.at) && Array.isArray(value.ranks) && value.ranks.length === 3 &&
  value.ranks.every(isRank);

const isKey = event => isShortString(event.key, 32) && isShortString(event.code, 32) &&
  isFiniteNumber(event.keyCode) && [...FLAGS, 'repeat'].every(flag => typeof event[flag] === 'boolean') &&
  (event.target === null || isLocator(event.target));

const isSelection = value => value === null || (Number.isInteger(value?.start) && Number.isInteger(value?.end));

// What each kind of replayed event needs, all of the expected types. Pointer kinds need a point.
const VALID = {
  leave: () => true,
  cancel: () => true,
  blur: () => true,
  keydown: isKey,
  keyup: isKey,
  value: event => isShortString(event.value, MAX_TEXT) && isSelection(event.selection) && isLocator(event.target),
  focus: event => isLocator(event.target),
  scroller: event => isPoint(event) && isPoint(event.at),
};

// A replayed event the agent can act on.
const isReplayEvent = (event) => {
  const kind = event?.kind;
  if (Object.prototype.hasOwnProperty.call(VALID, kind)) return VALID[kind](event);
  return POINT_KINDS.has(kind) && isPoint(event) && hasFlags(event);
};

// Keys. A synthetic key event runs a component's key handlers, and nothing else: no typed character, no Tab moving
// focus, no Enter or Space activating a button. So only named keys travel (Escape, ArrowDown, Home, Backspace…), never
// a character, which arrives as the field's new value instead (see onInput). Not Tab, nor a modifier alone, nor an
// IME's keys; Enter only in a text field, where a component handles it (Combobox selects), never on a button, whose
// Enter is the browser's own activation. Nothing from a password field.
const NAMED_KEY = /^[A-Z][A-Za-z0-9]+$/;
const UNRELAYED_KEYS = new Set([
  'Tab', 'Shift', 'Control', 'Alt', 'AltGraph', 'Meta', 'OS', 'Fn', 'FnLock', 'Hyper', 'Super', 'Symbol', 'SymbolLock',
  'CapsLock', 'NumLock', 'ScrollLock', 'Process', 'Dead', 'Compose', 'Unidentified', 'Spacebar',
]);
// Input types a person types text into, and those whose value is copied: those but the password, and a range, whose
// arrow keys change it natively, which a replayed key can't.
const TEXT_TYPES = new Set(['text', 'search', 'email', 'url', 'tel', 'number', 'password']);
const VALUE_TYPES = new Set(['text', 'search', 'email', 'url', 'tel', 'number', 'range']);

const isEditable = element => element.isContentEditable === true ||
  (element.isContentEditable === undefined && Boolean(element.closest?.('[contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"]')));

const isPassword = element => element?.localName === 'input' && element.type === 'password';

const isTextField = element => Boolean(element) && ((element.localName === 'input' && TEXT_TYPES.has(element.type)) ||
  element.localName === 'textarea' || isEditable(element));

/** Whether a key on an element (null: nothing focused) is mirrored. The same test runs on both sides. */
export function isRelayedKey (key, element) {
  return NAMED_KEY.test(key) && !UNRELAYED_KEYS.has(key) && !isPassword(element) &&
    (key !== 'Enter' || isTextField(element));
}

// Finding an element in the other frame. The two frameworks render different wrappers, ids and classes, but the same
// focusable elements, with the same role, data-qa and accessible name, in the same order. So an element is told by
// its place among the focusable elements like it: same role, then also the same data-qa, then also the same name. In
// the other frame, the most specific of those lists that is as long as the source's gives the element by its index;
// failing that, the one of them nearest the point where it was; failing that, the focusable element at that point.
const FOCUSABLE = 'a[href], area[href], button, input, select, textarea, iframe, summary, [tabindex], ' +
  '[contenteditable]:not([contenteditable="false"])';

const clean = text => (text ?? '').replace(/\s+/g, ' ').trim().slice(0, 80);

const roleOf = element => element.getAttribute('role') ||
  (element.localName === 'input' ? `input:${element.type}` : element.localName);

// The text of the elements that label one: aria-labelledby's, else a field's <label>s.
const labelsOf = (element) => {
  const ids = element.getAttribute('aria-labelledby');
  const labels = ids
    ? ids.split(/\s+/).map(id => element.ownerDocument.getElementById(id))
    : [...(element.labels ?? [])];
  return clean(labels.map(label => label?.textContent ?? '').join(' '));
};

const isField = element => /^(input|textarea|select)$/.test(element.localName) || isEditable(element);

// An approximation of the accessible name, from the attributes and labels both frameworks set. Never a field's own
// text, which is what a person typed.
const nameOf = element => clean(element.getAttribute('aria-label') || labelsOf(element) ||
  element.getAttribute('placeholder') || element.getAttribute('title') || (isField(element) ? '' : element.textContent));

const SIGNATURE = [roleOf, element => element.getAttribute('data-qa') ?? '', nameOf];

// checkVisibility leaves out what doesn't render (display: none, also an ancestor's): a closed menu one framework
// keeps in the page and the other doesn't.
const focusables = doc => [...doc.querySelectorAll(FOCUSABLE)]
  .filter(element => (typeof element.checkVisibility === 'function' ? element.checkVisibility() : true));

const sameRect = (a, b) => a === b ||
  Boolean(a && b && ['x', 'y', 'width', 'height'].every(side => Math.abs(a[side] - b[side]) < 0.5));

const centerOf = (element) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

/** Where an element is, for the other frame to find its counterpart (findByLocator). */
export function locatorOf (element) {
  const keys = SIGNATURE.map(read => read(element));
  let pool = focusables(element.ownerDocument);
  const ranks = keys.map((key, level) => {
    pool = pool.filter(candidate => SIGNATURE[level](candidate) === key);
    return [pool.indexOf(element), pool.length];
  });
  const [role, qa, name] = keys;
  return { role, qa, name, at: centerOf(element), ranks };
}

/**
 * The counterpart of the other frame's element in this document, or null.
 * @param {Document} doc
 * @param {object} locator The other frame's locatorOf.
 * @param {object} [options]
 * @param {boolean} [options.exact] Only the element with the same role, data-qa and name, at the same place among as
 *   many like it: never one found by its role or position alone, which may be another field (a value written there
 *   would overwrite it).
 */
export function findByLocator (doc, { role, qa, name, at, ranks }, { exact = false } = {}) {
  const keys = [role, qa, name];
  let pool = focusables(doc);
  const pools = keys.map((key, level) => (pool = pool.filter(candidate => SIGNATURE[level](candidate) === key)));
  for (let level = pools.length - 1; level >= (exact ? pools.length - 1 : 0); level--) {
    const [index, count] = ranks[level];
    if (index >= 0 && pools[level].length === count) return pools[level][index];
  }
  if (exact) return null;
  const nearest = [...pools].reverse().find(candidates => candidates.length);
  if (nearest) {
    const distance = (element) => {
      const center = centerOf(element);
      return Math.hypot(center.x - at.x, center.y - at.y);
    };
    return nearest.reduce((best, element) => (distance(element) < distance(best) ? element : best));
  }
  return doc.elementFromPoint(at.x, at.y)?.closest(FOCUSABLE) ?? null;
}

// The value a field's change copies, or null for one that isn't copied: a password, a checkbox (whose click is
// replayed instead), a multiple select, a rich text editor (an editable with markup, which a framework's editor owns).
const valueOf = (element) => {
  if (element.localName === 'input') return VALUE_TYPES.has(element.type) ? element.value : null;
  if (element.localName === 'textarea') return element.value;
  if (element.localName === 'select') return element.multiple ? null : element.value;
  if (isEditable(element)) return element.childElementCount ? null : element.textContent;
  return null;
};

// The prototype whose native value setter sets each kind of field. An editable has none: its text is set instead.
const FIELDS = { input: 'HTMLInputElement', textarea: 'HTMLTextAreaElement', select: 'HTMLSelectElement' };

// A real key, as it travels.
const keyOf = (event, target) => ({
  kind: event.type,
  key: event.key,
  code: event.code,
  keyCode: event.keyCode,
  ...flagsOf(event),
  repeat: event.repeat,
  target,
});

const selectionOf = (element) => {
  try {
    const { selectionStart: start, selectionEnd: end } = element;
    return Number.isInteger(start) && Number.isInteger(end) ? { start, end } : null;
  } catch {
    return null;
  }
};

// Scroll positions can be fractional; within half a pixel is the same position.
const samePosition = (a, b) => Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5;

const pathOf = (element) => {
  const path = [];
  for (let node = element; node; node = node.parentElement) path.push(node);
  return path;
};

// The closest common ancestor of two elements, where a browser fires the click of a press that ended elsewhere.
const commonAncestor = (a, b) => {
  const inA = new Set(pathOf(a));
  return pathOf(b).find(node => inA.has(node)) ?? a;
};

const SCROLLING = /auto|scroll|overlay/;

// Whether an element scrolls on its own, which a script can't tell from its `overflow` alone: it has to have
// something to scroll to.
const isScrollable = (element) => {
  const style = element.ownerDocument.defaultView.getComputedStyle(element);
  return (SCROLLING.test(style.overflowY) && element.scrollHeight - element.clientHeight > 1) ||
    (SCROLLING.test(style.overflowX) && element.scrollWidth - element.clientWidth > 1);
};

// The closest scrolling element at or above a node, short of the page itself (which has its own scroll event).
const scrollerAbove = (node) => {
  for (let element = node; element; element = element.parentElement) {
    if (element === element.ownerDocument.documentElement || element === element.ownerDocument.body) return null;
    if (isScrollable(element)) return element;
  }
  return null;
};

/**
 * Installs the agent in a preview window. Returns null outside a frame, where no comparison can host it.
 * @param {object} [options]
 * @param {Window} [options.win] The preview's window.
 * @param {(event: Event) => boolean} [options.isReal] Whether an event is real input: `isTrusted`, so replayed
 *   events never travel back. Tests stand in for it, since a script can't make a trusted event.
 * @param {(callback: () => void) => void} [options.requestFrame] Schedules the once-per-frame flush.
 * @param {(callback: (deadline: IdleDeadline) => void) => () => void} [options.requestIdle] Schedules a slice of the
 *   hover styles' build in idle time, returning a cancel function (see createHoverEmulation).
 * @param {string} [options.hosts] The local comparison's origins, comma-separated, instead of DEFAULT_COMPARE_HOSTS:
 *   STORYBOOK_COMPARE_SYNC_HOSTS, when the Storybook was started with it.
 * @returns {{ uninstall: () => void } | null}
 */
export function installCompareSyncAgent ({
  win = window,
  isReal = event => event.isTrusted,
  requestFrame = callback => win.requestAnimationFrame(callback),
  requestIdle,
  hosts = import.meta.env.STORYBOOK_COMPARE_SYNC_HOSTS,
} = {}) {
  if (win.parent === win) return null;
  win[INSTANCE]?.uninstall();

  const doc = win.document;
  const trusted = trustedOrigins(win, hosts);
  // Hover styles for the replayed pointer, from the handshake to the goodbye.
  const hoverStyles = createHoverEmulation({ win, requestIdle });
  // The comparison page's origin, from its handshake. Null while inert.
  let host = null;
  let queue = [];
  let flushRequested = false;
  // A real press ended and its click hasn't gone yet (see onClick).
  let clickDue = false;
  // A real press that isn't sent, from its pointerdown to its release (see onPointer).
  let ignoredPress = false;
  // Where the last replayed scroll left the page, until its own scroll event has gone by (see applyScroll).
  let applied = null;
  // The same for the elements inside the page: element -> the position a replayed scroll left it at.
  const appliedInner = new Map();
  // Elements that scrolled for real since the last flush; their position and locator are read when it goes out.
  const scrolledInner = new Set();
  // Where the real pointer last was, which is the best point to find a scrolled element by: wherever the user is
  // scrolling, it's in there.
  let realPoint = null;
  // The replayed pointer's element and its ancestors, innermost first, where it was, and the modifier keys held with it.
  let hovered = [];
  let lastPoint = { x: 0, y: 0 };
  let held = modifiersOf({});
  // The replayed button, while it's down: whether its pointerdown was cancelled, which suppresses the mouse events of
  // the press (not the click), the element it went down on, and the element holding pointer capture (see
  // capturePointer).
  let press = null;
  // The element the click that follows a press goes to: where a browser fires it (see releaseAt).
  let clickTarget = null;
  // Whether a replayed event is being dispatched right now, which is the only time pointer capture is emulated.
  let replaying = false;
  let restoreCapture = null;
  // 'source' after real input here (a press, a key, typing), 'mirror' after replaying the other frame's, null before
  // either. Only the mirror's focus() is shimmed (see shimFocus).
  let role = null;
  let restoreFocus = null;
  // Real focus moved since the last flush: where it is now goes out with the batch.
  let focusMoved = false;
  // The element whose value event is last in the queue, so a run of typing sends only its latest value.
  let typedIn = null;
  // The mirror's fake focus ring: the element it's on, and the rect last sent for it (undefined until measured).
  let ring = null;
  let ringScheduled = false;
  // Whether the comparison page draws a ring for this frame now, from the last rect sent.
  let ringShown = false;

  const post = message => win.parent.postMessage({ key: COMPARE_SYNC_KEY, ...message }, host);
  const viewport = () => ({ width: win.innerWidth, height: win.innerHeight });
  const scroller = () => doc.scrollingElement ?? doc.documentElement;
  const scrollPosition = () => ({ x: scroller().scrollLeft, y: scroller().scrollTop });

  // Sending: real input, batched once per animation frame. Every batch carries the viewport's size, so the
  // comparison can map a point to the other frame.

  // Where to find an element in the other frame: a point inside it that leads back to it, since the two frames hold
  // different elements (Vue may wrap what React doesn't). The real pointer when it's in there, else the middle, then
  // the corners; the first whose closest scroller is the element itself, so a scroller nested in it doesn't take
  // the point.
  const locate = (element) => {
    const rect = element.getBoundingClientRect();
    const inset = 4;
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const candidates = [
      realPoint,
      center,
      { x: rect.left + inset, y: rect.top + inset },
      { x: rect.right - inset, y: rect.top + inset },
      { x: rect.left + inset, y: rect.bottom - inset },
      { x: rect.right - inset, y: rect.bottom - inset },
    ].filter(Boolean);
    const at = candidates.find(point => scrollerAbove(doc.elementFromPoint(point.x, point.y)) === element);
    return at ?? center;
  };

  // Where real focus is now: the focused element, or nothing when the page doesn't have focus (it went to the other
  // frame, or the comparison) or nothing in it is focused.
  const focusNow = () => {
    const element = doc.hasFocus() ? doc.activeElement : null;
    return element && element !== doc.body && element !== doc.documentElement
      ? { kind: 'focus', target: locatorOf(element) }
      : { kind: 'blur' };
  };

  const flush = () => {
    flushRequested = false;
    if (!host) return;
    const scrollers = [...scrolledInner].filter(element => element.isConnected).map(element => ({
      kind: 'scroller',
      x: element.scrollLeft,
      y: element.scrollTop,
      at: locate(element),
    }));
    scrolledInner.clear();
    const focus = focusMoved ? [focusNow()] : [];
    focusMoved = false;
    post({ type: 'input', viewport: viewport(), events: [...queue, ...scrollers, ...focus] });
    queue = [];
    typedIn = null;
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

  // Real input here: this frame is the source, and its own focus() works again.
  const becomeSource = () => {
    if (role === 'source') return;
    role = 'source';
    shimFocus(false);
    hideRing();
  };

  // Replaying the other frame's input: this frame is the mirror, and its focus() is shimmed.
  const becomeMirror = () => {
    if (role === 'mirror') return;
    role = 'mirror';
    shimFocus(true);
  };

  // The real pointer, with the modifier keys held. Only the primary button's presses travel, and only the primary
  // pointer's: the other frame replays every press as the primary button's, so a right or middle press (which a
  // Slider ignores), or a second finger, would turn into a left one there. Nor do the moves and the release of such a
  // press, or the click after it.
  const onPointer = (event) => {
    if (!isReal(event)) return;
    if (event.type === 'pointerdown') becomeSource();
    // The real pointer is here, so the other frame's replayed one isn't: its hover styles go.
    hoverStyles.clear();
    if (event.isPrimary === false) return;
    realPoint = { x: event.clientX, y: event.clientY };
    if (event.type === 'pointerdown' && event.button !== 0) ignoredPress = true;
    const ignored = ignoredPress;
    // A press ends with its last button's release, whichever button that is.
    if (event.type === 'pointerup') ignoredPress = false;
    clickDue = !ignored && event.type === 'pointerup';
    if (!ignored) enqueue({ kind: POINTER_KINDS[event.type], x: event.clientX, y: event.clientY, ...flagsOf(event) });
  };

  // The browser ended a press without a release (it took the pointer for a scroll or a native drag): no click follows.
  const onPointerCancel = (event) => {
    if (!isReal(event) || event.isPrimary === false) return;
    const ignored = ignoredPress;
    ignoredPress = false;
    clickDue = false;
    if (!ignored) enqueue({ kind: 'cancel' });
  };

  // One click per press. A label's click is followed by a trusted click on its control, which the replayed click on
  // the label makes again in the other frame: sending both would toggle a checkbox twice. A keyboard's click (Enter or
  // Space on a button) has no press, and isn't sent: neither are those keys (isRelayedKey).
  const onClick = (event) => {
    if (!isReal(event) || !clickDue) return;
    clickDue = false;
    enqueue({ kind: 'click', x: event.clientX, y: event.clientY, ...flagsOf(event) });
  };

  // A pointerout with no element to go to: the pointer left this document.
  const onPointerOut = (event) => {
    if (isReal(event) && !event.relatedTarget) enqueue({ kind: 'leave' });
  };

  // Scroll events are trusted even when a script scrolled, so a replayed scroll's own event is told apart by the
  // position it left, not by a flag: a flag would also swallow a real scroll when the replayed one moved nothing.
  // Scroll doesn't bubble, so an element inside the page is heard in the capture phase.
  const onInnerScroll = (element) => {
    const mark = appliedInner.get(element);
    const echo = mark && samePosition({ x: element.scrollLeft, y: element.scrollTop }, mark);
    appliedInner.delete(element);
    if (echo) return;
    scrolledInner.add(element);
    enqueue(null);
  };

  const onScroll = (event) => {
    if (!isReal(event)) return;
    if (event.target !== doc) {
      if (event.target.nodeType === 1) onInnerScroll(event.target);
      return;
    }
    const position = scrollPosition();
    const echo = applied && samePosition(position, applied);
    applied = null;
    if (!echo) enqueue({ kind: 'scroll', ...position });
  };

  // A new size goes out with an empty batch.
  const onResize = () => enqueue(null);

  // The element a key event went to, or null for none (the body: nothing is focused).
  const elementOf = ({ target }) =>
    (target?.nodeType === 1 && target !== doc.body && target !== doc.documentElement ? target : null);

  // A real key, on the focused element (or the body). Its target goes as a locator, read now: focus may move on.
  const onKey = (event) => {
    if (!isReal(event)) return;
    if (event.type === 'keydown') becomeSource();
    const element = elementOf(event);
    if (!event.isComposing && isRelayedKey(event.key, element)) enqueue(keyOf(event, element && locatorOf(element)));
  };

  // A field's new value after real typing (or pasting, or picking an option). The value goes, not the keys, so the
  // other frame's framework sees a change of value as it would from typing. A run of typing in one field sends only
  // the latest value in each batch. A replayed input event is untrusted, so it never comes back.
  const onInput = (event) => {
    if (!isReal(event)) return;
    becomeSource();
    const element = elementOf(event);
    const value = element && valueOf(element);
    if (typeof value !== 'string' || value.length > MAX_TEXT) return;
    const change = { kind: 'value', value, selection: selectionOf(element), target: locatorOf(element) };
    if (typedIn === element && queue[queue.length - 1]?.kind === 'value') queue[queue.length - 1] = change;
    else enqueue(change);
    typedIn = element;
  };

  // Real focus moving here, as a person or a component moves it. Where it ended up goes out with the batch. The
  // mirror's focus can only move on its own when the page lost it (focus() is shimmed), which isn't the source's.
  const onFocusChange = (event) => {
    if (!isReal(event) || role === 'mirror') return;
    focusMoved = true;
    enqueue(null);
  };

  // Capture, so a story that stops propagation still reports.
  const listeners = [
    ['pointermove', onPointer, true],
    ['pointerdown', onPointer, true],
    ['pointerup', onPointer, true],
    ['pointercancel', onPointerCancel, true],
    ['click', onClick, true],
    ['pointerout', onPointerOut, true],
    ['scroll', onScroll, true],
    ['resize', onResize, false],
    ['keydown', onKey, true],
    ['keyup', onKey, true],
    ['input', onInput, true],
    ['focusin', onFocusChange, true],
    ['focusout', onFocusChange, true],
  ];

  // Replaying: what the other frame reported. Dispatched events are untrusted, so none of them is sent back.

  const fire = (target, type, init) => {
    const Constructor = type.includes('pointer') && win.PointerEvent ? win.PointerEvent : win.MouseEvent;
    // Enter and leave neither bubble nor cancel; every other pointer and mouse event does both.
    const boundary = /enter|leave/.test(type);
    const wasReplaying = replaying;
    replaying = true;
    try {
      return target.dispatchEvent(new Constructor(type, {
        bubbles: !boundary,
        cancelable: !boundary,
        composed: true,
        view: win,
        clientX: lastPoint.x,
        clientY: lastPoint.y,
        ...held,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        ...init,
      }));
    } finally {
      replaying = wasReplaying;
    }
  };

  // What a browser fires when the pointer goes from one element to another: out on the one it left and over on the
  // one it reached, then leave on each element it left (innermost first) and enter on each it entered (outermost
  // first), stopping at the ancestors both share. Enter and leave don't bubble, and components listen for them on
  // wrappers (Vue's tooltip listens for mouseenter on its anchor's wrapper), so each element gets its own. The hover
  // styles move first, as :hover has by the time a browser fires these.
  const crossBoundary = (to) => {
    hoverStyles.mark(to);
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
    // Back after real input here took them off (onPointer).
    else hoverStyles.mark(hovered);
    return target;
  };

  // Pointer capture, as a real drag uses it (a slider's track takes it on pointerdown so the drag follows the pointer
  // off the track). The replayed pointer isn't one the browser knows, so the real call throws, and the handler that made
  // it stops half way. While an event is being replayed the call is taken as the capture instead: the element that asked
  // gets the rest of the press, as it would. Outside a replayed event the browser's own methods run, so a story's real
  // pointer is never touched; the wrappers go on at the handshake and come off at the goodbye.
  const emulateCapture = (on) => {
    const proto = win.Element?.prototype;
    if (!proto) return;
    if (!on) {
      restoreCapture?.();
      restoreCapture = null;
      return;
    }
    if (restoreCapture) return;
    const originals = {
      setPointerCapture: proto.setPointerCapture,
      releasePointerCapture: proto.releasePointerCapture,
      hasPointerCapture: proto.hasPointerCapture,
    };
    const wrappers = {
      setPointerCapture (...args) {
        if (!replaying) return originals.setPointerCapture.apply(this, args);
        if (press) press.captor = this;
        return undefined;
      },
      releasePointerCapture (...args) {
        if (!replaying) return originals.releasePointerCapture.apply(this, args);
        if (press?.captor === this) press.captor = null;
        return undefined;
      },
      hasPointerCapture (...args) {
        if (!replaying) return originals.hasPointerCapture.apply(this, args);
        return press?.captor === this;
      },
    };
    Object.assign(proto, wrappers);
    restoreCapture = () => {
      // Only what is still ours: a story that replaced a method after this keeps its own.
      for (const name of Object.keys(originals)) {
        if (proto[name] === wrappers[name]) proto[name] = originals[name];
      }
    };
  };

  // While an element holds capture, the pointer's events go to it, wherever the pointer is, with no boundary events.
  // Every pointer event, the boundary events of getting there too, carries the modifier keys held with it.
  const movePointer = (point) => {
    held = modifiersOf(point);
    lastPoint = point;
    const captor = press?.captor;
    const target = captor ?? pointTo(point);
    const buttons = { buttons: press ? 1 : 0 };
    fire(target, 'pointermove', buttons);
    if (!press?.cancelled) fire(target, 'mousemove', buttons);
  };

  // The pointer left the other frame's page. With a button down the press carries on: its release is still to come.
  const releasePointer = () => {
    if (!press && hovered.length) crossBoundary([]);
  };

  // A click replays as the other frame fired it: pointerdown and mousedown when the button goes down, pointerup and
  // mouseup when it comes up, then click. Each part replays when it happens, so a component that acts on the press
  // alone (a popover closing on an outside pointerdown, with no click after it) acts in both frames, and a drag
  // (pointermove between the two) drags in both. These events have no default action, so nothing takes focus.
  // The source sends the primary button's presses only (onPointer), so each is the primary button's here.
  const pressAt = (point) => {
    held = modifiersOf(point);
    const target = pointTo(point);
    const init = { button: 0, buttons: 1 };
    clickTarget = null;
    press = { cancelled: false, target, captor: null };
    press.cancelled = !fire(target, 'pointerdown', init);
    if (!press.cancelled) fire(target, 'mousedown', { ...init, detail: 1 });
  };

  const releaseAt = (point) => {
    held = modifiersOf(point);
    lastPoint = point;
    const captor = press?.captor;
    const target = captor ?? pointTo(point);
    const init = { button: 0, buttons: 0 };
    const cancelled = press?.cancelled;
    // A browser fires the click on the nearest element holding both the press and the release, or on the capturing
    // element, which has both.
    clickTarget = captor ?? (press?.target?.isConnected ? commonAncestor(press.target, target) : target);
    press = null;
    fire(target, 'pointerup', init);
    if (!cancelled) fire(target, 'mouseup', { ...init, detail: 1 });
    if (captor) fire(captor, 'lostpointercapture', init);
    // A capture ends with the press: the pointer's element is the one under it again.
    if (captor) pointTo(point);
  };

  const clickAt = (point) => {
    held = modifiersOf(point);
    const target = clickTarget?.isConnected ? clickTarget : pointTo(point);
    clickTarget = null;
    lastPoint = point;
    fire(target, 'click', { button: 0, buttons: 0, detail: 1 });
  };

  // The other frame's press ended without a release: its browser cancelled it (pointercancel), or that frame reloaded
  // mid-press. As a browser does: pointercancel where the press's events go, then the capture ends, and neither the
  // mouse events of a release nor a click follow. The pointer stays where it is: a leave, which follows a cancel, takes
  // it out.
  const cancelPress = () => {
    clickTarget = null;
    if (!press) return;
    const { captor, target } = press;
    press = null;
    const init = { button: -1, buttons: 0, cancelable: false };
    const under = hovered[0]?.isConnected ? hovered[0] : null;
    fire(captor ?? under ?? (target.isConnected ? target : doc.documentElement), 'pointercancel', init);
    if (captor) fire(captor, 'lostpointercapture', init);
  };

  // Scrolls the page to the other frame's position in pixels. They go to scrollTo as they are, signed, and the browser
  // clamps them to this page: a right-to-left scroller's horizontal offsets are negative. The position it leaves is
  // remembered until the next frame, by when the browser has fired the scroll event for it, so that event isn't sent
  // back (onScroll).
  const applyScroll = ({ x, y }) => {
    const before = scrollPosition();
    if (samePosition(before, { x, y })) return;
    // Instant, even under `scroll-behavior: smooth`: an animated scroll's intermediate events would read as real.
    win.scrollTo({ left: x, top: y, behavior: 'instant' });
    const after = scrollPosition();
    if (samePosition(after, before)) return;
    const mark = after;
    applied = mark;
    requestFrame(() => {
      if (applied === mark) applied = null;
    });
  };

  // Scrolls the element inside the page found at a point (the closest scroller there) to the other frame's offset, as
  // the page's: signed, clamped by the browser, and the position it leaves remembered until its scroll event has gone.
  const applyScroller = ({ x, y, at }) => {
    const element = scrollerAbove(doc.elementFromPoint(at.x, at.y));
    if (!element) return;
    const before = { x: element.scrollLeft, y: element.scrollTop };
    if (samePosition(before, { x, y })) return;
    element.scrollTo({ left: x, top: y, behavior: 'instant' });
    const after = { x: element.scrollLeft, y: element.scrollTop };
    if (samePosition(after, before)) return;
    appliedInner.set(element, after);
    requestFrame(() => {
      if (appliedInner.get(element) === after) appliedInner.delete(element);
    });
  };

  // The fake focus ring. The comparison page draws it over this frame, from the rect this agent sends for the element:
  // measured once per animation frame while the ring shows, since the element can move (a menu sliding open), and
  // sent only when it changed. Nothing is added to the story's page.
  const postRing = (rect) => {
    ringShown = Boolean(rect);
    post({ type: 'ring', viewport: viewport(), rect });
  };

  const measureRing = () => {
    ringScheduled = false;
    if (!ring || !host) return;
    if (!ring.element.isConnected) {
      hideRing();
      return;
    }
    const box = ring.element.getBoundingClientRect();
    // An element that doesn't render (a closed menu's item) has no ring, until it renders again.
    const rect = box.width || box.height ? { x: box.left, y: box.top, width: box.width, height: box.height } : null;
    if (ring.rect === undefined || !sameRect(rect, ring.rect)) postRing(rect);
    ring.rect = rect;
    ringScheduled = true;
    requestFrame(measureRing);
  };

  function showRing (element) {
    if (!element || element === doc.body || element === doc.documentElement) {
      hideRing();
      return;
    }
    if (ring?.element === element) return;
    // A new element: its rect goes out at the next measure, even if it matches the last one's.
    ring = { element, rect: undefined };
    if (!ringScheduled) {
      ringScheduled = true;
      requestFrame(measureRing);
    }
  }

  function hideRing () {
    ring = null;
    if (ringShown && host) postRing(null);
  }

  // The focus shim. While this frame is the mirror, focus() on its elements does nothing but move the fake ring there:
  // a component reacting to a replayed event (Dropdown focusing its menu, Slider its thumb) would otherwise take real
  // focus from the source, and the next key would land here. On every prototype that has its own focus() (HTML, SVG,
  // MathML), put back when this frame becomes the source again or disconnects, except where a story has replaced the
  // shim in between.
  function shimFocus (on) {
    if (!on) {
      restoreFocus?.();
      restoreFocus = null;
      return;
    }
    if (restoreFocus) return;
    const shimmed = ['HTMLElement', 'SVGElement', 'MathMLElement']
      .map(name => win[name]?.prototype)
      .filter(proto => proto && Object.prototype.hasOwnProperty.call(proto, 'focus'))
      .map((proto) => {
        const original = proto.focus;
        const shim = function focus () {
          // Only where real focus could have gone: not a disabled control or an element that can't take focus.
          if (this.isConnected && this.matches(FOCUSABLE) && !this.disabled) showRing(this);
        };
        proto.focus = shim;
        return { proto, original, shim };
      });
    restoreFocus = () => shimmed.forEach(({ proto, original, shim }) => {
      if (proto.focus === shim) proto.focus = original;
    });
  }

  // The element a replayed key goes to: the counterpart of the source's focused element, else the one under the fake
  // ring, else whatever this page has focused, else the body.
  const keyTarget = (locator) => {
    const found = locator && findByLocator(doc, locator);
    if (found) return found;
    if (ring?.element.isConnected) return ring.element;
    const active = doc.activeElement;
    return active && active !== doc.documentElement ? active : doc.body;
  };

  // A key, as the source's element got it. The same test as the source's, against this frame's element: a key that
  // isn't mirrored there isn't here.
  const pressKey = (event) => {
    const target = keyTarget(event.target);
    if (!isRelayedKey(event.key, target === doc.body ? null : target)) return;
    const wasReplaying = replaying;
    replaying = true;
    try {
      target.dispatchEvent(new win.KeyboardEvent(event.kind, {
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
        which: event.keyCode,
        ...modifiersOf(event),
        repeat: event.repeat,
        bubbles: true,
        cancelable: true,
        composed: true,
        view: win,
      }));
    } finally {
      replaying = wasReplaying;
    }
  };

  // A field's value, set as typing sets it: through the native setter, so a framework that wraps the element's own
  // value property (React's value tracker) sees a change, then an input event (and change, for a select, which fires
  // both at once). Only into the same field: one with the same role, data-qa and name (findByLocator's exact match),
  // never another found by its role or position, whose value it would overwrite. A field this frame doesn't have, a
  // password, and a select without the option are skipped: setting a value a select doesn't offer clears it.
  const writeValue = (element, value, selection) => {
    const field = FIELDS[element.localName];
    if (!field) {
      element.textContent = value;
      return;
    }
    Object.getOwnPropertyDescriptor(win[field].prototype, 'value').set.call(element, value);
    // Setting a selection doesn't move focus.
    try {
      if (selection && element.setSelectionRange) element.setSelectionRange(selection.start, selection.end);
    } catch {
      // An input type without a selection (number).
    }
  };

  const setValue = ({ value, selection, target }) => {
    const element = findByLocator(doc, target, { exact: true });
    const current = element && !isPassword(element) ? valueOf(element) : null;
    if (current === null || current === value) return;
    if (element.localName === 'select' && ![...element.options].some(option => option.value === value)) return;
    writeValue(element, value, selection);
    const wasReplaying = replaying;
    replaying = true;
    try {
      const InputEvent = win.InputEvent ?? win.Event;
      element.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertReplacementText' }));
      if (element.localName === 'select') element.dispatchEvent(new win.Event('change', { bubbles: true }));
    } finally {
      replaying = wasReplaying;
    }
  };

  // The source's focus moved: the ring goes to the counterpart. The source itself has no ring: its focus is real.
  const showFocus = ({ target }) => {
    if (role !== 'source') showRing(findByLocator(doc, target));
  };

  const hideFocus = () => {
    if (role !== 'source') hideRing();
  };

  const replayers = {
    move: movePointer,
    down: pressAt,
    up: releaseAt,
    click: clickAt,
    cancel: cancelPress,
    leave: releasePointer,
    scroll: applyScroll,
    scroller: applyScroller,
    keydown: pressKey,
    keyup: pressKey,
    value: setValue,
    focus: showFocus,
    blur: hideFocus,
  };

  // The handshake.

  const listen = (on) => {
    for (const [type, listener, capture] of listeners) {
      if (on) win.addEventListener(type, listener, capture);
      else win.removeEventListener(type, listener, capture);
    }
  };

  // `origin` is a trusted one (onMessage), never '*': everything this agent sends goes to that origin only.
  const connect = (origin) => {
    if (!host) listen(true);
    emulateCapture(true);
    hoverStyles.start();
    host = origin;
    post({ type: 'ready', viewport: viewport() });
  };

  const disconnect = () => {
    if (!host) return;
    listen(false);
    press = null;
    clickTarget = null;
    releasePointer();
    held = modifiersOf({});
    hoverStyles.stop();
    emulateCapture(false);
    shimFocus(false);
    role = null;
    ring = null;
    ringShown = false;
    host = null;
    queue = [];
    applied = null;
    appliedInner.clear();
    scrolledInner.clear();
    realPoint = null;
    clickDue = false;
    ignoredPress = false;
    focusMoved = false;
    typedIn = null;
  };

  // The other frame's input: this frame becomes the mirror first, so its focus() is shimmed before any replayed event
  // can make a component call it. Moves and scrolls don't count: the pointer resting over a frame isn't using it.
  const replay = (events) => {
    if (!host || !Array.isArray(events)) return;
    const valid = events.filter(isReplayEvent);
    if (valid.some(event => INTERACTIONS.has(event.kind))) becomeMirror();
    valid.forEach(event => replayers[event.kind](event));
  };

  // Only the window framing this preview can switch the agent on, only from an origin it trusts, and only with this
  // agent's key. Anything else is ignored before it's read, and never answered: a page that frames the preview from
  // anywhere else would otherwise get what is typed in it and could replay input into it.
  const onMessage = (event) => {
    if (event.source !== win.parent || !trusted.has(event.origin)) return;
    const { data } = event;
    if (data?.key !== COMPARE_SYNC_KEY) return;
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
