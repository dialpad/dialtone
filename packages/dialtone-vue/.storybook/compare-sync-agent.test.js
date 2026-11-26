import { HOVER_ATTRIBUTE } from './compare-sync-hover.js';
import {
  COMPARE_SYNC_KEY,
  MAX_TEXT,
  findByLocator,
  installCompareSyncAgent,
  isRelayedKey,
  locatorOf,
  parseHosts,
} from './compare-sync-agent.js';

const HOST = 'http://localhost:9013';
// The modifier keys a pointer event carries, none of them held.
const NO_KEYS = { alt: false, ctrl: false, meta: false, shift: false };
const RECORDED = ['pointerover', 'pointerout', 'pointerenter', 'pointerleave', 'pointermove', 'pointerdown', 'pointerup',
  'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove', 'mousedown', 'mouseup', 'click'];

const PAGE = `
  <div id="outer"><span id="wrap"><button id="target">Target</button></span></div>
  <p id="other">Other</p>
  <div id="track"><div id="thumb"></div></div>
  <div id="list" style="overflow-y: auto"><ol id="inner" style="overflow-y: auto"><li id="item">Item</li></ol></div>
  <input id="field">`;

// The agent in a framed preview: an iframe of this document, whose parent window plays the comparison page. A script
// can't make a trusted event, so the events a test calls real stand in for isTrusted ones. The frame's own origin is
// this document's (an about:blank frame inherits it).
function framedAgent (html = PAGE) {
  const iframe = document.createElement('iframe');
  document.body.append(iframe);
  const win = iframe.contentWindow;
  const doc = win.document;
  doc.body.innerHTML = html;
  const real = new WeakSet();
  const frames = [];
  // jsdom's window proxy, which isn't the test's `window` object.
  const host = win.parent;
  const sent = vi.spyOn(host, 'postMessage').mockImplementation(() => {});
  const listen = vi.spyOn(win, 'addEventListener');
  let pointAt = doc.body;
  doc.elementFromPoint = () => pointAt;
  const idle = [];
  const agent = installCompareSyncAgent({
    win,
    isReal: event => real.has(event),
    requestFrame: callback => frames.push(callback),
    requestIdle: (callback) => {
      idle.push(callback);
      return () => idle.includes(callback) && idle.splice(idle.indexOf(callback), 1);
    },
  });
  const byId = id => doc.getElementById(id);
  const log = [];
  for (const id of ['outer', 'wrap', 'target', 'other', 'track', 'thumb']) {
    for (const type of RECORDED) {
      byId(id)?.addEventListener(type, (event) => {
        if (event.target === event.currentTarget) log.push(`${type}@${id}`);
      });
    }
  }

  return {
    win,
    doc,
    agent,
    log,
    listen,
    byId,
    pointAt: (id) => { pointAt = byId(id); },
    runFrame: () => frames.splice(0).forEach(callback => callback()),
    pendingFrames: () => frames.length,
    idle,
    runIdle: () => {
      while (idle.length) idle.shift()({ didTimeout: false, timeRemaining: () => 50 });
    },
    host,
    fromHost: (data, source = host, origin = HOST) => win.dispatchEvent(new win.MessageEvent('message', {
      data: { key: COMPARE_SYNC_KEY, ...data },
      origin,
      source,
    })),
    realEvent: (target, type, { isPrimary, ...init } = {}) => {
      const event = new win.MouseEvent(type, { bubbles: true, cancelable: true, composed: true, ...init });
      // jsdom has no PointerEvent: a pointer event's own property, on the mouse event standing in for it.
      if (isPrimary !== undefined) Object.defineProperty(event, 'isPrimary', { value: isPrimary });
      real.add(event);
      target.dispatchEvent(event);
    },
    realKey: (target, type, init = {}, trusted = true) => {
      const event = new win.KeyboardEvent(type, { bubbles: true, cancelable: true, composed: true, ...init });
      if (trusted) real.add(event);
      target.dispatchEvent(event);
    },
    // A field's value after typing: what the browser fires once it has changed it.
    realInput: (target, value, trusted = true) => {
      if (value !== undefined) target.value = value;
      const event = new win.InputEvent('input', { bubbles: true, composed: true });
      if (trusted) real.add(event);
      target.dispatchEvent(event);
    },
    realFocus: (target, type = 'focusin') => {
      const event = new win.FocusEvent(type, { bubbles: true });
      real.add(event);
      target.dispatchEvent(event);
    },
    // Messages for the comparison's ring, in order.
    rings: () => sent.mock.calls.map(([message]) => message).filter(message => message.type === 'ring')
      .map(message => message.rect),
    realScroll: () => {
      const event = new win.Event('scroll', { bubbles: true });
      real.add(event);
      doc.dispatchEvent(event);
    },
    realElementScroll: (element) => {
      // Scroll events of elements don't bubble.
      const event = new win.Event('scroll');
      real.add(event);
      element.dispatchEvent(event);
    },
    rect: (element, rect) => {
      const { left, top, width, height } = rect;
      element.getBoundingClientRect = () => ({ left, top, width, height, right: left + width, bottom: top + height });
    },
    sent: () => sent.mock.calls.map(([message, origin]) => ({ ...message, origin })),
    inputs: () => sent.mock.calls.map(([message]) => message).filter(message => message.type === 'input'),
  };
}

// An element's scroll offsets and a scrollTo that jumps as `behavior: 'instant'` does, clamped as a browser clamps
// them: from 0 to the overflow, and horizontally from minus the overflow to 0 when right to left.
function scrollOffsets (element, { scrollWidth, scrollHeight, clientWidth, clientHeight }, { rtl = false } = {}) {
  const position = { x: 0, y: 0 };
  Object.defineProperties(element, {
    scrollLeft: { configurable: true, get: () => position.x },
    scrollTop: { configurable: true, get: () => position.y },
    scrollWidth: { configurable: true, value: scrollWidth },
    scrollHeight: { configurable: true, value: scrollHeight },
    clientWidth: { configurable: true, value: clientWidth },
    clientHeight: { configurable: true, value: clientHeight },
  });
  const across = scrollWidth - clientWidth;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const scrollTo = vi.fn(({ left, top }) => {
    position.x = rtl ? clamp(left, -across, 0) : clamp(left, 0, across);
    position.y = clamp(top, 0, scrollHeight - clientHeight);
  });
  return { position, scrollTo };
}

// A page 1000px taller and 200px wider than its viewport.
function scrollablePage ({ win, doc }, options) {
  const { position, scrollTo } = scrollOffsets(doc.documentElement,
    { scrollWidth: 1200, scrollHeight: 1800, clientWidth: 1000, clientHeight: 800 }, options);
  win.scrollTo = scrollTo;
  return position;
}

// An element that scrolls 500px further down than it shows, and `across` further sideways.
function scrollableElement (element, { across = 0, ...options } = {}) {
  const { position, scrollTo } = scrollOffsets(element,
    { scrollWidth: 100 + across, scrollHeight: 600, clientWidth: 100, clientHeight: 100 }, options);
  element.scrollTo = scrollTo;
  return position;
}

describe('Compare sync agent', () => {
  let frame;

  afterEach(() => {
    frame?.agent?.uninstall();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('does nothing outside a frame', () => {
    expect(installCompareSyncAgent({ win: window })).toBeNull();
  });

  describe('Before the handshake', () => {
    it('only listens for the handshake, adds nothing to the page and sends nothing', () => {
      frame = framedAgent();
      const html = frame.doc.documentElement.outerHTML;
      const focus = frame.win.HTMLElement.prototype.focus;

      frame.realEvent(frame.byId('target'), 'pointermove', { clientX: 5, clientY: 5 });
      frame.realEvent(frame.byId('target'), 'click');
      frame.realKey(frame.byId('field'), 'keydown', { key: 'Escape' });
      frame.realInput(frame.byId('field'));
      frame.realFocus(frame.byId('field'));
      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 1, y: 1 }] });
      frame.runFrame();

      expect(frame.listen.mock.calls.map(([type]) => type)).toEqual(['message']);
      expect(frame.sent()).toEqual([]);
      expect(frame.pendingFrames()).toBe(0);
      expect(frame.doc.documentElement.outerHTML).toBe(html);
      expect(frame.win.HTMLElement.prototype.focus).toBe(focus);
    });

    it('ignores Storybook\'s channel, other keys and windows other than its parent', () => {
      frame = framedAgent();
      const stranger = document.createElement('iframe');
      document.body.append(stranger);

      frame.win.dispatchEvent(new frame.win.MessageEvent('message', {
        data: JSON.stringify({ key: 'storybook-channel', event: { type: 'storyRendered', args: [] } }),
        source: frame.host,
      }));
      frame.win.dispatchEvent(new frame.win.MessageEvent('message', {
        data: { key: 'other', type: 'connect' },
        source: frame.host,
      }));
      frame.fromHost({ type: 'connect' }, stranger.contentWindow);
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 1, y: 1 }] });

      expect(frame.sent()).toEqual([]);
      expect(frame.listen.mock.calls.map(([type]) => type)).toEqual(['message']);
      expect(frame.log).toEqual([]);
    });
  });

  describe('Who it trusts', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    // What a message from an origin did: whether the agent answered, and where; whether it started listening for
    // input, or shimmed focus(); and whether it replayed a move.
    const reaction = (frame) => {
      const html = frame.win.HTMLElement.prototype.focus;
      frame.pointAt('target');
      return () => ({
        replies: frame.sent().map(message => message.origin),
        listening: frame.listen.mock.calls.some(([type]) => type === 'pointermove'),
        replayed: frame.log.length > 0,
        shimmed: frame.win.HTMLElement.prototype.focus !== html,
      });
    };
    const handshake = (frame, origin) => {
      frame.fromHost({ type: 'connect' }, frame.host, origin);
      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 6 }] }, frame.host, origin);
    };

    it.each([
      ['the local comparison', HOST],
      ['the local comparison by address', 'http://127.0.0.1:9013'],
      // The published bundle: the comparison and the previews share one origin.
      ['its own origin', window.location.origin],
    ])('answers %s, to that origin alone', (_, origin) => {
      frame = framedAgent();
      const after = reaction(frame);

      handshake(frame, origin);

      expect(after()).toEqual({ replies: [origin], listening: true, replayed: true, shimmed: true });
    });

    it.each([
      ['another port', 'http://localhost:9099'],
      ['another site', 'https://example.com'],
      ['another scheme', 'https://localhost:9013'],
      ['an opaque origin (a sandboxed page)', 'null'],
      ['no origin', ''],
    ])('ignores a handshake from %s: no answer, no listeners, no replay', (_, origin) => {
      frame = framedAgent();
      const after = reaction(frame);

      handshake(frame, origin);

      expect(after()).toEqual({ replies: [], listening: false, replayed: false, shimmed: false });
    });

    it('ignores an untrusted origin\'s replay and goodbye once connected', () => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      frame.pointAt('target');
      const removed = vi.spyOn(frame.win, 'removeEventListener');

      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] }, frame.host, 'https://example.com');
      frame.fromHost({ type: 'disconnect' }, frame.host, 'https://example.com');

      expect(frame.log).toEqual([]);
      expect(removed).not.toHaveBeenCalled();
    });

    it('trusts the origins STORYBOOK_COMPARE_SYNC_HOSTS lists instead of the default ones', () => {
      vi.stubEnv('STORYBOOK_COMPARE_SYNC_HOSTS', ' http://localhost:9500/ , http://127.0.0.1:9500,not a url');
      frame = framedAgent();

      frame.fromHost({ type: 'connect' }, frame.host, HOST);
      frame.fromHost({ type: 'connect' }, frame.host, 'http://localhost:9500');
      frame.fromHost({ type: 'connect' }, frame.host, 'http://127.0.0.1:9500');
      frame.fromHost({ type: 'connect' }, frame.host, window.location.origin);

      expect(frame.sent().map(message => message.origin))
        .toEqual(['http://localhost:9500', 'http://127.0.0.1:9500', window.location.origin]);
    });

    it('reads a list of hosts as origins, leaving out what isn\'t one', () => {
      expect(parseHosts('http://localhost:9500/, https://a.example/path?q ,, data:text/plain,x, nope'))
        .toEqual(['http://localhost:9500', 'https://a.example']);
    });
  });

  describe('Sending', () => {
    it('answers the handshake with its viewport, to the comparison\'s origin', () => {
      frame = framedAgent();

      frame.fromHost({ type: 'connect' });

      expect(frame.sent()).toEqual([{
        key: COMPARE_SYNC_KEY,
        type: 'ready',
        viewport: { width: frame.win.innerWidth, height: frame.win.innerHeight },
        origin: HOST,
      }]);
    });

    it('batches real pointer input once per frame, keeping only the last of consecutive moves', () => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      const target = frame.byId('target');

      frame.realEvent(target, 'pointermove', { clientX: 10, clientY: 20 });
      frame.realEvent(target, 'pointermove', { clientX: 30, clientY: 40 });
      frame.realEvent(target, 'pointerdown', { clientX: 30, clientY: 40 });
      frame.realEvent(target, 'pointerup', { clientX: 30, clientY: 40 });
      frame.realEvent(target, 'click', { clientX: 30, clientY: 40 });
      frame.realEvent(target, 'pointerout', { relatedTarget: null });
      expect(frame.inputs()).toEqual([]);
      frame.runFrame();

      expect(frame.inputs()).toEqual([{
        key: COMPARE_SYNC_KEY,
        type: 'input',
        viewport: { width: frame.win.innerWidth, height: frame.win.innerHeight },
        events: [
          { kind: 'move', x: 30, y: 40, ...NO_KEYS },
          { kind: 'down', x: 30, y: 40, ...NO_KEYS },
          { kind: 'up', x: 30, y: 40, ...NO_KEYS },
          { kind: 'click', x: 30, y: 40, ...NO_KEYS },
          { kind: 'leave' },
        ],
      }]);
    });

    it('sends the modifier keys held with each pointer event', () => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      const target = frame.byId('target');

      frame.realEvent(target, 'pointermove', { ctrlKey: true });
      frame.realEvent(target, 'pointerdown', { shiftKey: true });
      frame.realEvent(target, 'pointerup', { shiftKey: true, altKey: true });
      frame.realEvent(target, 'click', { shiftKey: true, metaKey: true });
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events)).toEqual([
        { kind: 'move', x: 0, y: 0, ...NO_KEYS, ctrl: true },
        { kind: 'down', x: 0, y: 0, ...NO_KEYS, shift: true },
        { kind: 'up', x: 0, y: 0, ...NO_KEYS, shift: true, alt: true },
        { kind: 'click', x: 0, y: 0, ...NO_KEYS, shift: true, meta: true },
      ]);
    });

    // The other frame replays every press as the primary button's, so only those travel. A press ends with its last
    // button's release, whichever that is (pressing the left button while the right is down fires no pointerdown).
    it.each([
      ['a right press, its moves and its release', [['pointerdown', { button: 2, buttons: 2 }],
        ['pointermove', { buttons: 2 }], ['pointerup', { button: 2 }]], []],
      ['a middle press', [['pointerdown', { button: 1, buttons: 4 }], ['pointerup', { button: 1 }]], []],
      ['a right press ended by the left button', [['pointerdown', { button: 2, buttons: 2 }],
        ['pointermove', { button: 0, buttons: 3 }], ['pointerup', { button: 0 }], ['click', {}]], []],
      ['a second finger\'s touch', [['pointerdown', { isPrimary: false }], ['pointermove', { isPrimary: false }],
        ['pointerup', { isPrimary: false }]], []],
      ['a left press, while a second finger touches', [['pointerdown', {}], ['pointerdown', { isPrimary: false }],
        ['pointerup', { isPrimary: false }], ['pointerup', {}], ['click', {}]], ['down', 'up', 'click']],
      ['a left press, while the right button is pressed too', [['pointerdown', {}],
        ['pointermove', { button: 2, buttons: 3 }], ['pointerup', {}], ['click', {}]], ['down', 'move', 'up', 'click']],
    ])('sends %s as the other frame should see it', (_, sequence, kinds) => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      const target = frame.byId('target');

      sequence.forEach(([type, init]) => frame.realEvent(target, type, init));
      // The pointer moving on afterwards is sent as ever.
      frame.realEvent(target, 'pointermove', {});
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events).map(event => event.kind)).toEqual([...kinds, 'move']);
    });

    it('sends the next primary press after a secondary one that never got a pointerup or pointercancel', () => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      const target = frame.byId('target');

      // A right press that opens the context menu (macOS) can deliver only its pointerdown.
      frame.realEvent(target, 'pointerdown', { button: 2, buttons: 2 });
      frame.realEvent(target, 'pointerdown', {});
      frame.realEvent(target, 'pointermove', {});
      frame.realEvent(target, 'pointerup', {});
      frame.realEvent(target, 'click', {});
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events).map(event => event.kind))
        .toEqual(['down', 'move', 'up', 'click']);
    });

    it('sends hover moves after a secondary press that never got a pointerup or pointercancel', () => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      const target = frame.byId('target');

      frame.realEvent(target, 'pointerdown', { button: 2, buttons: 2 });
      frame.realEvent(target, 'pointermove', { buttons: 0, clientX: 5 });
      frame.realEvent(target, 'pointermove', { buttons: 0, clientX: 9 });
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events).map(event => event.kind)).toEqual(['move']);
    });

    it('sends nothing for a secondary press and its own release, then sends the next primary press', () => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      const target = frame.byId('target');

      frame.realEvent(target, 'pointerdown', { button: 2, buttons: 2 });
      frame.realEvent(target, 'pointerup', { button: 2 });
      frame.runFrame();
      expect(frame.inputs()).toEqual([]);

      frame.realEvent(target, 'pointerdown', {});
      frame.realEvent(target, 'pointerup', {});
      frame.realEvent(target, 'click', {});
      frame.runFrame();
      expect(frame.inputs().flatMap(message => message.events).map(event => event.kind)).toEqual(['down', 'up', 'click']);
    });

    it('lets a second finger\'s press leave the primary press\'s state alone', () => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      const target = frame.byId('target');

      // A second finger touching down mid-press neither ends the primary press nor flags it as ignored.
      frame.realEvent(target, 'pointerdown', {});
      frame.realEvent(target, 'pointerdown', { isPrimary: false, button: 2 });
      frame.realEvent(target, 'pointermove', {});
      frame.realEvent(target, 'pointerup', {});
      frame.realEvent(target, 'click', {});
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events).map(event => event.kind))
        .toEqual(['down', 'move', 'up', 'click']);
    });

    it('sends a press the browser cancelled, which no click follows, and not one it wasn\'t sending', () => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      const target = frame.byId('target');

      frame.realEvent(target, 'pointerdown', {});
      frame.realEvent(target, 'pointermove', {});
      frame.realEvent(target, 'pointercancel', {});
      frame.realEvent(target, 'click', {});
      frame.realEvent(target, 'pointerdown', { button: 2 });
      frame.realEvent(target, 'pointercancel', {});
      frame.realEvent(target, 'pointerdown', {});
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events).map(event => event.kind))
        .toEqual(['down', 'move', 'cancel', 'down']);
    });

    it('sends one click per press: not a label\'s second click on its control, nor a click without a press', () => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      const target = frame.byId('target');

      frame.realEvent(target, 'click', { clientX: 1, clientY: 1 });
      frame.realEvent(target, 'pointerdown', { clientX: 2, clientY: 2 });
      frame.realEvent(target, 'pointerup', { clientX: 2, clientY: 2 });
      frame.realEvent(target, 'click', { clientX: 2, clientY: 2 });
      frame.realEvent(frame.byId('field'), 'click', { clientX: 2, clientY: 2 });
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events).map(event => event.kind)).toEqual(['down', 'up', 'click']);
    });

    it('never sends back what it replays', () => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
      frame.pointAt('target');

      frame.fromHost({
        type: 'replay',
        events: ['move', 'down', 'up', 'click'].map(kind => ({ kind, x: 5, y: 5 })),
      });
      frame.runFrame();

      expect(frame.log).toContain('click@target');
      expect(frame.inputs()).toEqual([]);
    });
  });

  describe('Replaying', () => {
    beforeEach(() => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
    });

    it('enters each element of the chain, outermost first, as a browser does', () => {
      frame.pointAt('target');

      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });

      expect(frame.log).toEqual([
        'pointerover@target', 'pointerenter@outer', 'pointerenter@wrap', 'pointerenter@target',
        'mouseover@target', 'mouseenter@outer', 'mouseenter@wrap', 'mouseenter@target',
        'pointermove@target', 'mousemove@target',
      ]);
    });

    it('leaves the elements the pointer left, innermost first, up to the ancestor it still shares', () => {
      frame.pointAt('target');
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });
      frame.log.length = 0;
      const leaves = [];
      frame.byId('outer').addEventListener('mouseleave', event => leaves.push(event));

      frame.pointAt('other');
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 60 }] });

      expect(frame.log).toEqual([
        'pointerout@target', 'pointerleave@target', 'pointerleave@wrap', 'pointerleave@outer',
        'mouseout@target', 'mouseleave@target', 'mouseleave@wrap', 'mouseleave@outer',
        'pointerover@other', 'pointerenter@other', 'mouseover@other', 'mouseenter@other',
        'pointermove@other', 'mousemove@other',
      ]);
      expect(leaves[0]).toMatchObject({ relatedTarget: frame.byId('other'), clientX: 5, clientY: 60, bubbles: false });
    });

    it('moves within one element without boundary events', () => {
      frame.pointAt('target');
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });
      frame.log.length = 0;

      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 7, y: 8 }] });

      expect(frame.log).toEqual(['pointermove@target', 'mousemove@target']);
    });

    const click = ['down', 'up', 'click'].map(kind => ({ kind, x: 5, y: 6 }));

    it('replays a click as the browser fired it, without moving focus', () => {
      frame.byId('field').focus();
      frame.pointAt('target');
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });
      frame.log.length = 0;

      frame.fromHost({ type: 'replay', events: click });

      expect(frame.log)
        .toEqual(['pointerdown@target', 'mousedown@target', 'pointerup@target', 'mouseup@target', 'click@target']);
      expect(frame.doc.activeElement).toBe(frame.byId('field'));
    });

    it('replays a press as it happens, with the button down for the moves in between', () => {
      frame.pointAt('target');
      const moves = [];
      frame.byId('target').addEventListener('pointermove', event => moves.push(event.buttons));

      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 6 }, { kind: 'move', x: 6, y: 6 }] });
      const pressed = [...frame.log];
      frame.fromHost({ type: 'replay', events: [{ kind: 'up', x: 6, y: 6 }, { kind: 'move', x: 7, y: 6 }] });

      expect(pressed.filter(entry => /down|move/.test(entry)))
        .toEqual(['pointerdown@target', 'mousedown@target', 'pointermove@target', 'mousemove@target']);
      expect(moves).toEqual([1, 0]);
    });

    it('replays the modifier keys held with each pointer event, and on the boundary events of getting there', () => {
      frame.pointAt('target');
      const got = [];
      const record = event => got.push(`${event.type}:${['shift', 'ctrl', 'alt', 'meta'].filter(flag => event[`${flag}Key`]).join('+')}`);
      ['mouseenter', 'pointermove', 'pointerdown', 'mousedown', 'pointerup', 'click']
        .forEach(type => frame.byId('target').addEventListener(type, record));

      frame.fromHost({
        type: 'replay',
        events: [
          { kind: 'move', x: 5, y: 6, ...NO_KEYS, ctrl: true },
          { kind: 'down', x: 5, y: 6, ...NO_KEYS, shift: true },
          { kind: 'up', x: 5, y: 6, ...NO_KEYS, shift: true, alt: true },
          // From an agent from before the keys travelled.
          { kind: 'click', x: 5, y: 6 },
        ],
      });

      expect(got).toEqual([
        'mouseenter:ctrl', 'pointermove:ctrl', 'pointerdown:shift', 'mousedown:shift', 'pointerup:shift+alt', 'click:',
      ]);
    });

    it('ignores a pointer event whose modifier keys aren\'t true or false', () => {
      frame.pointAt('target');

      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 6, shift: 'yes' }] });

      expect(frame.log).toEqual([]);
    });

    it('skips the mouse events of a press whose pointerdown was cancelled, but not the click', () => {
      frame.pointAt('target');
      frame.byId('target').addEventListener('pointerdown', event => event.preventDefault());

      frame.fromHost({ type: 'replay', events: [click[0], { kind: 'move', x: 5, y: 6 }, ...click.slice(1)] });

      expect(frame.log.filter(entry => /down|up|move|click/.test(entry)))
        .toEqual(['pointerdown@target', 'pointermove@target', 'pointerup@target', 'click@target']);
    });

    it('leaves every element when the other frame\'s pointer leaves', () => {
      frame.pointAt('target');
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });
      frame.log.length = 0;

      frame.fromHost({ type: 'replay', events: [{ kind: 'leave' }] });

      expect(frame.log).toEqual([
        'pointerout@target', 'pointerleave@target', 'pointerleave@wrap', 'pointerleave@outer',
        'mouseout@target', 'mouseleave@target', 'mouseleave@wrap', 'mouseleave@outer',
      ]);
    });

    it('ignores replayed events it can\'t act on', () => {
      frame.pointAt('target');

      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 'a', y: 1 }, { kind: 'keydown' }, null] });

      expect(frame.log).toEqual([]);
    });
  });

  describe('Drags', () => {
    // A control that takes pointer capture on pointerdown, as the Slider does, and follows the pointer on moves.
    const captureOnDown = (frame, element) => {
      const log = [];
      element.addEventListener('pointerdown', (event) => {
        element.setPointerCapture(event.pointerId);
        log.push(`down:${element.hasPointerCapture(event.pointerId)}`);
      });
      element.addEventListener('pointermove', event => log.push(`move:${event.buttons}`));
      element.addEventListener('pointerup', () => log.push('up'));
      element.addEventListener('lostpointercapture', () => log.push('lost'));
      return log;
    };

    beforeEach(() => {
      frame = framedAgent();
      // What the browser does for a pointer it doesn't know: throw.
      const refuse = () => {
        throw new frame.win.DOMException('No active pointer', 'NotFoundError');
      };
      Object.assign(frame.win.Element.prototype, {
        setPointerCapture: refuse,
        releasePointerCapture: refuse,
        hasPointerCapture: () => false,
      });
      frame.fromHost({ type: 'connect' });
    });

    it('drags: the moves between a press and its release carry the button, and the release ends it', () => {
      frame.pointAt('target');
      const buttons = [];
      frame.byId('target').addEventListener('pointermove', event => buttons.push(event.buttons));

      frame.fromHost({
        type: 'replay',
        events: [
          { kind: 'down', x: 5, y: 6 }, { kind: 'move', x: 9, y: 6 }, { kind: 'move', x: 20, y: 6 },
          { kind: 'up', x: 20, y: 6 }, { kind: 'move', x: 21, y: 6 },
        ],
      });

      expect(buttons).toEqual([1, 1, 0]);
    });

    it('takes a capture the browser would refuse, and sends the drag to the element that took it', () => {
      const log = captureOnDown(frame, frame.byId('track'));
      frame.pointAt('track');

      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 60 }] });
      // The pointer is over something else: the capture keeps the events on the track.
      frame.pointAt('other');
      frame.log.length = 0;
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 90, y: 400 }, { kind: 'up', x: 90, y: 400 }] });

      expect(log).toEqual(['down:true', 'move:1', 'up', 'lost']);
      expect(frame.log.filter(entry => entry.endsWith('@other'))).not.toContain('pointermove@other');
    });

    it('stops sending events to the capturing element once the press has ended', () => {
      const log = captureOnDown(frame, frame.byId('track'));
      frame.pointAt('track');
      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 60 }, { kind: 'up', x: 5, y: 60 }] });
      log.length = 0;
      frame.pointAt('other');

      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 90, y: 400 }] });

      expect(log).toEqual([]);
    });

    it('doesn\'t touch the browser\'s own capture for anything but a replayed event, and puts it back on disconnect', () => {
      const wrapped = frame.win.Element.prototype.setPointerCapture;
      expect(() => frame.byId('track').setPointerCapture(1)).toThrow('No active pointer');

      frame.fromHost({ type: 'disconnect' });

      expect(frame.win.Element.prototype.setPointerCapture).not.toBe(wrapped);
      expect(() => frame.byId('track').setPointerCapture(1)).toThrow('No active pointer');
    });

    it('leaves a method the story replaced after the handshake alone on disconnect', () => {
      const story = vi.fn();
      frame.win.Element.prototype.hasPointerCapture = story;

      frame.fromHost({ type: 'disconnect' });

      expect(frame.win.Element.prototype.hasPointerCapture).toBe(story);
    });

    it('keeps the press through a leave, which is the pointer going out of the page mid-drag', () => {
      frame.pointAt('target');
      const buttons = [];
      frame.byId('target').addEventListener('pointermove', event => buttons.push(event.buttons));

      frame.fromHost({
        type: 'replay',
        events: [{ kind: 'down', x: 5, y: 6 }, { kind: 'leave' }, { kind: 'move', x: 9, y: 6 }],
      });

      expect(buttons).toEqual([1]);
    });

    it('fires the click of a press that ended elsewhere on the element both share', () => {
      const clicks = [];
      frame.doc.body.addEventListener('click', event => clicks.push(event.target));
      frame.pointAt('target');
      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 6 }] });
      frame.pointAt('other');
      frame.fromHost({ type: 'replay', events: [{ kind: 'up', x: 5, y: 60 }, { kind: 'click', x: 5, y: 60 }] });

      // Target and other meet at the body.
      expect(clicks).toEqual([frame.doc.body]);
    });

    it('ends a drag the other frame\'s browser cancelled: capture released, no release, no click', () => {
      const log = captureOnDown(frame, frame.byId('track'));
      frame.byId('track').addEventListener('pointercancel', event => log.push(`cancel:${event.button}`));
      const clicks = [];
      frame.doc.addEventListener('click', event => clicks.push(event.target));
      const moves = [];
      frame.byId('other').addEventListener('pointermove', event => moves.push(event.buttons));
      frame.pointAt('track');

      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 60 }, { kind: 'move', x: 30, y: 60 }] });
      frame.pointAt('other');
      frame.fromHost({ type: 'replay', events: [{ kind: 'cancel' }, { kind: 'move', x: 90, y: 400 }] });

      expect(log).toEqual(['down:true', 'move:1', 'cancel:-1', 'lost']);
      expect(clicks).toEqual([]);
      // The pointer is over another element now, with no button down.
      expect(moves).toEqual([0]);
    });

    it('fires an uncaptured press\'s cancel where the pointer is, with no release, and forgets its click\'s target', () => {
      const cancels = [];
      frame.doc.addEventListener('pointercancel', event => cancels.push(event.target.id));
      const clicks = [];
      frame.doc.addEventListener('click', event => clicks.push(event.target.id || event.target.localName));
      frame.pointAt('target');
      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 6 }] });
      frame.log.length = 0;

      frame.fromHost({ type: 'replay', events: [{ kind: 'cancel' }] });
      const ended = [...frame.log];
      // A press released elsewhere and cancelled before its click came: a click after all isn't the press's, so it
      // doesn't go to the element the press and the release share (the body).
      frame.pointAt('target');
      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 6 }] });
      frame.pointAt('other');
      frame.fromHost({ type: 'replay', events: [{ kind: 'up', x: 5, y: 60 }, { kind: 'cancel' }, { kind: 'click', x: 5, y: 60 }] });

      expect(cancels).toEqual(['target']);
      expect(ended).toEqual([]);
      expect(clicks).toEqual(['other']);
    });

    it('takes a reload\'s cancel, leave and blur as the end of everything mirrored: press, capture, pointer and ring', () => {
      const log = captureOnDown(frame, frame.byId('track'));
      frame.rect(frame.byId('field'), { left: 10, top: 60, width: 200, height: 30 });
      frame.pointAt('track');
      frame.fromHost({ type: 'replay', events: [{ kind: 'focus', target: locatorOf(frame.byId('field')) }] });
      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 60 }] });
      frame.runFrame();
      frame.log.length = 0;

      frame.fromHost({ type: 'replay', events: [{ kind: 'cancel' }, { kind: 'leave' }, { kind: 'blur' }] });
      frame.runFrame();
      frame.pointAt('track');
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 30, y: 60 }] });

      expect(log).toEqual(['down:true', 'lost', 'move:0']);
      expect(frame.log).toEqual(expect.arrayContaining(['pointerleave@track', 'mouseleave@track']));
      expect(frame.rings()).toEqual([{ x: 10, y: 60, width: 200, height: 30 }, null]);
    });

    it('fires the click of a captured press on the capturing element', () => {
      captureOnDown(frame, frame.byId('track'));
      const clicks = [];
      frame.byId('track').addEventListener('click', () => clicks.push('track'));
      frame.pointAt('track');
      frame.fromHost({ type: 'replay', events: [{ kind: 'down', x: 5, y: 60 }] });
      frame.pointAt('other');

      frame.fromHost({ type: 'replay', events: [{ kind: 'up', x: 90, y: 400 }, { kind: 'click', x: 90, y: 400 }] });

      expect(clicks).toEqual(['track']);
      expect(frame.log).not.toContain('click@other');
    });

    it('sends a real drag as it happens and never what it replays', () => {
      const track = frame.byId('track');

      frame.realEvent(track, 'pointerdown', { clientX: 5, clientY: 60 });
      frame.realEvent(track, 'pointermove', { clientX: 30, clientY: 60 });
      frame.realEvent(track, 'pointermove', { clientX: 50, clientY: 60 });
      frame.realEvent(track, 'pointerup', { clientX: 50, clientY: 60 });
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events).map(event => event.kind))
        .toEqual(['down', 'move', 'up']);
    });
  });

  describe('Inner scroll', () => {
    let list;
    let inner;
    let listPosition;
    let innerPosition;

    beforeEach(() => {
      frame = framedAgent();
      list = frame.byId('list');
      inner = frame.byId('inner');
      listPosition = scrollableElement(list);
      innerPosition = scrollableElement(inner);
      frame.rect(list, { left: 0, top: 100, width: 100, height: 100 });
      frame.rect(inner, { left: 10, top: 110, width: 80, height: 80 });
      frame.fromHost({ type: 'connect' });
    });

    it('sends a scrolled element\'s offset with a point inside it, once per frame', () => {
      // The scroller inside the list covers its middle; the list shows at its edges.
      frame.doc.elementFromPoint = (x, y) => (x > 10 && y > 110 ? inner : list);
      listPosition.y = 10;
      frame.realElementScroll(list);
      listPosition.y = 40;
      frame.realElementScroll(list);
      frame.runFrame();

      // The list's middle is over the scroller inside it, which takes the point; a corner is the list's own.
      expect(frame.inputs().flatMap(message => message.events))
        .toEqual([{ kind: 'scroller', x: 0, y: 40, at: { x: 4, y: 104 } }]);
    });

    it('finds the element by the real pointer when it is inside it', () => {
      frame.pointAt('inner');
      frame.realEvent(frame.byId('item'), 'pointermove', { clientX: 50, clientY: 150 });
      innerPosition.y = 70;
      frame.realElementScroll(inner);
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events)).toEqual([
        { kind: 'move', x: 50, y: 150, ...NO_KEYS },
        { kind: 'scroller', x: 0, y: 70, at: { x: 50, y: 150 } },
      ]);
    });

    it('scrolls the closest scroller at the point, which the browser clamps, and doesn\'t echo it', () => {
      frame.pointAt('item');

      frame.fromHost({ type: 'replay', events: [{ kind: 'scroller', x: 0, y: 5000, at: { x: 50, y: 150 } }] });
      frame.realElementScroll(inner);
      frame.runFrame();

      expect(inner.scrollTo).toHaveBeenCalledWith({ left: 0, top: 5000, behavior: 'instant' });
      expect(list.scrollTo).not.toHaveBeenCalled();
      expect(innerPosition.y).toBe(500);
      expect(frame.inputs()).toEqual([]);
    });

    it('scrolls a right-to-left scroller to the other frame\'s negative offset, and doesn\'t echo it', () => {
      const position = scrollableElement(inner, { across: 300, rtl: true });
      frame.pointAt('item');

      frame.fromHost({ type: 'replay', events: [{ kind: 'scroller', x: -80, y: 40, at: { x: 50, y: 150 } }] });
      frame.realElementScroll(inner);
      frame.runFrame();

      expect(position).toEqual({ x: -80, y: 40 });
      expect(frame.inputs()).toEqual([]);
    });

    it('finds a scroller the other frame doesn\'t have as such by the closest one above the point', () => {
      // Only the outer list scrolls here: the point is over an element inside it.
      Object.defineProperty(inner, 'scrollHeight', { configurable: true, value: 100 });
      frame.pointAt('item');

      frame.fromHost({ type: 'replay', events: [{ kind: 'scroller', x: 0, y: 200, at: { x: 50, y: 150 } }] });

      expect(list.scrollTo).toHaveBeenCalledWith({ left: 0, top: 200, behavior: 'instant' });
    });

    it('sends a real scroll that follows a replayed one, and one after a replayed scroll that moved nothing', () => {
      frame.pointAt('item');
      frame.fromHost({ type: 'replay', events: [{ kind: 'scroller', x: 0, y: 300, at: { x: 50, y: 150 } }] });
      frame.realElementScroll(inner);
      innerPosition.y = 420;
      frame.realElementScroll(inner);
      frame.runFrame();
      expect(frame.inputs().flatMap(message => message.events)).toMatchObject([{ kind: 'scroller', y: 420 }]);

      innerPosition.y = 300;
      frame.fromHost({ type: 'replay', events: [{ kind: 'scroller', x: 0, y: 300, at: { x: 50, y: 150 } }] });
      frame.realElementScroll(inner);
      frame.runFrame();
      expect(frame.inputs().flatMap(message => message.events)).toMatchObject([
        { kind: 'scroller', y: 420 },
        { kind: 'scroller', y: 300 },
      ]);
    });

    it('does nothing when no scroller is at the point', () => {
      frame.pointAt('other');

      frame.fromHost({ type: 'replay', events: [{ kind: 'scroller', x: 0, y: 200, at: { x: 5, y: 5 } }] });

      expect(list.scrollTo).not.toHaveBeenCalled();
      expect(inner.scrollTo).not.toHaveBeenCalled();
    });

    it('ignores a scroller event without a point', () => {
      frame.pointAt('item');

      frame.fromHost({ type: 'replay', events: [{ kind: 'scroller', x: 0, y: 200 }] });

      expect(inner.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('Scroll', () => {
    let position;

    beforeEach(() => {
      frame = framedAgent();
      position = scrollablePage(frame);
      frame.fromHost({ type: 'connect' });
    });

    it('scrolls to the other frame\'s pixels as they are, which the browser clamps to this page, and doesn\'t echo it', () => {
      frame.fromHost({ type: 'replay', events: [{ kind: 'scroll', x: 50, y: 5000 }] });
      frame.realScroll();
      frame.runFrame();

      expect(frame.win.scrollTo).toHaveBeenCalledWith({ left: 50, top: 5000, behavior: 'instant' });
      expect(position).toEqual({ x: 50, y: 1000 });
      expect(frame.inputs()).toEqual([]);
    });

    it.each([
      ['left to right', false, [{ x: 150, y: 300 }, { x: 0, y: 0 }]],
      // Its horizontal offsets go from 0 at the start to minus the overflow.
      ['right to left', true, [{ x: -150, y: 300 }, { x: -200, y: 0 }]],
    ])('scrolls a %s page to each offset the other frame sends, signed, and echoes none', (_, rtl, expected) => {
      const page = scrollablePage(frame, { rtl });
      const at = [];

      // The second is out of range on both sides: the browser clamps it.
      for (const offset of [{ x: rtl ? -150 : 150, y: 300 }, { x: -900, y: -50 }]) {
        frame.fromHost({ type: 'replay', events: [{ kind: 'scroll', ...offset }] });
        frame.realScroll();
        frame.runFrame();
        at.push({ ...page });
      }

      expect(at).toEqual(expected);
      expect(frame.inputs()).toEqual([]);
    });

    it('sends a real scroll that follows a replayed one', () => {
      frame.fromHost({ type: 'replay', events: [{ kind: 'scroll', x: 0, y: 300 }] });
      frame.realScroll();
      position.y = 420;
      frame.realScroll();
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events)).toEqual([{ kind: 'scroll', x: 0, y: 420 }]);
    });

    it('doesn\'t swallow a real scroll after a replayed one that moved nothing', () => {
      position.y = 300;
      frame.fromHost({ type: 'replay', events: [{ kind: 'scroll', x: 0, y: 300 }] });
      frame.realScroll();
      frame.runFrame();

      expect(frame.win.scrollTo).not.toHaveBeenCalled();
      expect(frame.inputs().flatMap(message => message.events)).toEqual([{ kind: 'scroll', x: 0, y: 300 }]);
    });

    it('forgets a replayed position after a frame, so a later real scroll to it is sent', () => {
      frame.fromHost({ type: 'replay', events: [{ kind: 'scroll', x: 0, y: 300 }] });
      frame.runFrame();
      frame.realScroll();
      frame.runFrame();

      expect(frame.inputs().flatMap(message => message.events)).toEqual([{ kind: 'scroll', x: 0, y: 300 }]);
    });
  });

  describe('Locators', () => {
    const page = (html) => {
      const doc = document.implementation.createHTMLDocument('');
      doc.body.innerHTML = html;
      doc.elementFromPoint = () => null;
      return doc;
    };
    const rect = (element, left, top) => {
      element.getBoundingClientRect = () => ({ left, top, width: 20, height: 10, right: left + 20, bottom: top + 10 });
    };

    it('finds the counterpart by its place among the elements like it, whatever wraps them', () => {
      const source = page(`
        <button data-qa="dt-button">Save</button><button data-qa="dt-button">Cancel</button>
        <input aria-label="Name"><a href="#x">Help</a>`);
      const other = page(`
        <div><span><button data-qa="dt-button">Save</button></span></div>
        <p><button data-qa="dt-button">Cancel</button></p><label>Name <input></label><a href="#y">Help</a>`);

      const cancel = locatorOf(source.querySelectorAll('button')[1]);

      expect(cancel).toMatchObject({ role: 'button', qa: 'dt-button', name: 'Cancel', ranks: [[1, 2], [1, 2], [0, 1]] });
      expect(findByLocator(other, cancel)).toBe(other.querySelectorAll('button')[1]);
      expect(findByLocator(other, locatorOf(source.querySelector('input')))).toBe(other.querySelector('input'));
      expect(findByLocator(other, locatorOf(source.querySelector('a')))).toBe(other.querySelector('a'));
    });

    it('falls back to the role and data-qa when the names differ, and to the nearest when the counts do', () => {
      const source = page('<li role="menuitem" tabindex="-1">One</li><li role="menuitem" tabindex="-1">Two</li>');
      const sameCount = page('<li role="menuitem" tabindex="-1">1 One</li><li role="menuitem" tabindex="-1">2 Two</li>');
      const moreItems = page(['A', 'B', 'C'].map(name => `<li role="menuitem" tabindex="-1">${name}</li>`).join(''));
      const items = moreItems.querySelectorAll('li');
      [0, 30, 60].forEach((top, index) => rect(items[index], 0, top));
      const second = source.querySelectorAll('li')[1];
      rect(second, 0, 28);

      expect(findByLocator(sameCount, locatorOf(second))).toBe(sameCount.querySelectorAll('li')[1]);
      expect(findByLocator(moreItems, locatorOf(second))).toBe(items[1]);
    });

    it('takes the focusable element at the point when nothing like it is there', () => {
      const source = page('<button>Go</button>');
      const other = page('<div tabindex="0"><span id="hit">Go</span></div>');
      other.elementFromPoint = () => other.getElementById('hit');

      expect(findByLocator(other, locatorOf(source.querySelector('button')))).toBe(other.querySelector('div'));
      other.elementFromPoint = () => null;
      expect(findByLocator(other, locatorOf(source.querySelector('button')))).toBeNull();
    });

    it('never names a field by what was typed in it', () => {
      const doc = page('<input id="a"><textarea id="b">secret</textarea><div id="c" contenteditable="true">secret</div>');
      doc.getElementById('a').value = 'secret';

      expect(['a', 'b', 'c'].map(id => locatorOf(doc.getElementById(id)).name)).toEqual(['', '', '']);
    });
  });

  describe('Keys', () => {
    beforeEach(() => {
      frame = framedAgent();
      frame.fromHost({ type: 'connect' });
    });

    const events = () => frame.inputs().flatMap(message => message.events);

    it('sends a named key with its modifiers and where the focused element is', () => {
      const target = frame.byId('target');

      frame.realKey(target, 'keydown', { key: 'ArrowDown', code: 'ArrowDown', shiftKey: true, repeat: true });
      frame.realKey(target, 'keyup', { key: 'ArrowDown', code: 'ArrowDown' });
      frame.runFrame();

      expect(events()).toEqual([
        {
          kind: 'keydown',
          key: 'ArrowDown',
          code: 'ArrowDown',
          keyCode: 0,
          alt: false,
          ctrl: false,
          meta: false,
          shift: true,
          repeat: true,
          target: locatorOf(target),
        },
        expect.objectContaining({ kind: 'keyup', key: 'ArrowDown', shift: false, target: locatorOf(target) }),
      ]);
    });

    it('never sends Tab, a character, Space, a modifier alone, an IME key or Enter outside a text field', () => {
      const target = frame.byId('target');
      for (const key of ['Tab', 'a', 'A', ' ', 'é', 'Shift', 'Meta', 'Dead', 'Process', 'Enter']) {
        frame.realKey(target, 'keydown', { key });
      }
      frame.realKey(frame.byId('field'), 'keydown', { key: 'a', ctrlKey: true });
      frame.realKey(frame.byId('field'), 'keydown', { key: 'Escape', isComposing: true });
      frame.realKey(frame.doc.body, 'keydown', { key: 'Enter' });
      frame.runFrame();

      expect(events()).toEqual([]);
    });

    it('sends Enter from a text field, which a component handles (Combobox selects)', () => {
      frame.realKey(frame.byId('field'), 'keydown', { key: 'Enter', code: 'Enter' });
      frame.realKey(frame.doc.body, 'keydown', { key: 'Escape' });
      frame.runFrame();

      expect(events()).toMatchObject([
        { kind: 'keydown', key: 'Enter', target: { role: 'input:text' } },
        { kind: 'keydown', key: 'Escape', target: null },
      ]);
    });

    it('sends nothing from a password field', () => {
      frame.byId('field').type = 'password';

      frame.realKey(frame.byId('field'), 'keydown', { key: 'Backspace' });
      frame.realKey(frame.byId('field'), 'keydown', { key: 'Enter' });
      frame.runFrame();

      expect(events()).toEqual([]);
    });

    it('never sends a key that isn\'t real, so a replayed one doesn\'t come back', () => {
      frame.realKey(frame.byId('target'), 'keydown', { key: 'Escape' }, false);
      frame.fromHost({ type: 'replay', events: [key('keydown', 'Escape', locatorOf(frame.byId('target')))] });
      frame.runFrame();

      expect(events()).toEqual([]);
    });

    function key (kind, name, target = null, flags = {}) {
      return {
        kind, key: name, code: name, keyCode: 0, alt: false, ctrl: false, meta: false, shift: false, repeat: false,
        target, ...flags,
      };
    }

    it('replays a key on the counterpart of the source\'s focused element, with its modifiers', () => {
      const got = [];
      frame.byId('target').addEventListener('keydown', event => got.push(event));
      frame.doc.addEventListener('keyup', event => got.push(event));

      frame.fromHost({
        type: 'replay',
        events: [
          key('keydown', 'ArrowDown', locatorOf(frame.byId('target')), { shift: true, keyCode: 40 }),
          key('keyup', 'ArrowDown', locatorOf(frame.byId('target'))),
        ],
      });

      expect(got.map(event => [event.type, event.target, event.key, event.shiftKey, event.keyCode, event.bubbles]))
        .toEqual([
          ['keydown', frame.byId('target'), 'ArrowDown', true, 40, true],
          ['keyup', frame.byId('target'), 'ArrowDown', false, 0, true],
        ]);
    });

    it('sends a key with no counterpart to the element under the fake ring, else to what this page has focused', () => {
      const targets = [];
      frame.doc.addEventListener('keydown', event => targets.push(event.target.id || event.target.localName));
      const missing = { ...locatorOf(frame.byId('target')), role: 'tab' };
      frame.byId('target').focus();

      frame.fromHost({ type: 'replay', events: [{ kind: 'focus', target: locatorOf(frame.byId('field')) }] });
      frame.fromHost({ type: 'replay', events: [key('keydown', 'Escape', missing)] });
      frame.fromHost({ type: 'replay', events: [{ kind: 'blur' }, key('keydown', 'Escape', null)] });
      frame.byId('target').blur();
      frame.fromHost({ type: 'replay', events: [key('keydown', 'Escape', null)] });

      expect(targets).toEqual(['field', 'target', 'body']);
    });

    it('doesn\'t replay a key the source wouldn\'t have sent, whatever the message says', () => {
      const got = [];
      frame.doc.addEventListener('keydown', event => got.push(event.key));
      const button = locatorOf(frame.byId('target'));

      frame.fromHost({
        type: 'replay',
        events: ['Tab', 'a', ' ', 'Enter'].map(name => key('keydown', name, button)),
      });
      frame.fromHost({ type: 'replay', events: [key('keydown', 'Enter', locatorOf(frame.byId('field')))] });

      expect(got).toEqual(['Enter']);
      expect(isRelayedKey('Enter', frame.byId('field'))).toBe(true);
      expect(isRelayedKey('Enter', frame.byId('target'))).toBe(false);
    });
  });

  describe('Values', () => {
    beforeEach(() => {
      frame = framedAgent(`${PAGE}<textarea id="notes"></textarea>
        <select id="pick"><option value="a">A</option><option value="b">B</option></select>
        <input id="secret" type="password"><input id="check" type="checkbox">
        <div id="rich" contenteditable="true"><p>Rich</p></div><input id="level" type="range">`);
      frame.fromHost({ type: 'connect' });
    });

    const events = () => frame.inputs().flatMap(message => message.events);
    const text = (id, value, selection = null) => ({
      kind: 'value', value, selection, target: locatorOf(frame.byId(id)),
    });

    it('sends a field\'s new value and selection, only the latest of a run of typing', () => {
      const field = frame.byId('field');

      frame.realInput(field, 'a');
      frame.realInput(field, 'ab');
      frame.realInput(frame.byId('notes'), 'n');
      frame.runFrame();

      expect(events()).toEqual([text('field', 'ab', { start: 2, end: 2 }), text('notes', 'n', { start: 1, end: 1 })]);
    });

    it('sends a select\'s and a range\'s value, which their own keys change natively', () => {
      frame.realInput(frame.byId('pick'), 'b');
      frame.realInput(frame.byId('level'), '70');
      frame.runFrame();

      expect(events()).toEqual([text('pick', 'b'), text('level', '70')]);
    });

    it('never sends a password, a checkbox\'s input, a rich editor\'s, or an untrusted change', () => {
      frame.realInput(frame.byId('secret'), 'hunter2');
      frame.realInput(frame.byId('check'));
      frame.realInput(frame.byId('rich'));
      frame.realInput(frame.byId('field'), 'replayed', false);
      frame.runFrame();

      expect(events()).toEqual([]);
      expect(JSON.stringify(frame.sent())).not.toContain('hunter2');
    });

    it('sets the value through the native setter, then fires input, and doesn\'t echo it', () => {
      const field = frame.byId('field');
      // A framework's own value property on the element, as React's value tracker is: a plain assignment would go
      // through it, and React would see no change.
      const tracked = [];
      const native = Object.getOwnPropertyDescriptor(frame.win.HTMLInputElement.prototype, 'value');
      Object.defineProperty(field, 'value', {
        configurable: true,
        get () { return native.get.call(this); },
        set (value) { tracked.push(value); native.set.call(this, value); },
      });
      const inputs = [];
      frame.doc.addEventListener('input', event => inputs.push([event.target, event.bubbles, field.value]));

      frame.fromHost({ type: 'replay', events: [text('field', 'hello', { start: 1, end: 3 })] });
      frame.runFrame();

      expect(tracked).toEqual([]);
      expect(field.value).toBe('hello');
      expect([field.selectionStart, field.selectionEnd]).toEqual([1, 3]);
      expect(inputs).toEqual([[field, true, 'hello']]);
      expect(frame.inputs()).toEqual([]);
    });

    it('fires change after input for a select, as a browser does', () => {
      const fired = [];
      frame.byId('pick').addEventListener('input', () => fired.push('input'));
      frame.byId('pick').addEventListener('change', () => fired.push('change'));

      frame.fromHost({ type: 'replay', events: [text('pick', 'b')] });

      expect(frame.byId('pick').value).toBe('b');
      expect(fired).toEqual(['input', 'change']);
    });

    it('skips a field it can\'t find, a password, and a value it already has', () => {
      const fired = [];
      frame.doc.addEventListener('input', event => fired.push(event.target.id));
      frame.byId('field').value = 'same';

      frame.fromHost({
        type: 'replay',
        events: [
          { ...text('field', 'x'), target: { ...locatorOf(frame.byId('field')), role: 'input:url' } },
          text('secret', 'x'),
          text('field', 'same'),
        ],
      });

      expect(fired).toEqual([]);
      expect(frame.byId('secret').value).toBe('');
    });

    it('ignores a text longer than MAX_TEXT', () => {
      frame.fromHost({ type: 'replay', events: [text('field', 'x'.repeat(MAX_TEXT + 1))] });

      expect(frame.byId('field').value).toBe('');
    });

    it.each([
      ['an option it has: selected, with input and change', 'b', 'b', ['input', 'change']],
      // Setting it would clear the selection.
      ['an option it doesn\'t have: left as it is, with no events', 'z', 'a', []],
    ])('sets a select to %s', (_, value, selected, fired) => {
      const got = [];
      frame.byId('pick').addEventListener('input', () => got.push('input'));
      frame.byId('pick').addEventListener('change', () => got.push('change'));

      frame.fromHost({ type: 'replay', events: [text('pick', value)] });

      expect([frame.byId('pick').value, got]).toEqual([selected, fired]);
    });
  });

  describe('Values only into the same field', () => {
    // The other frame's fields, in a document of their own, and this frame's.
    const sourcePage = (html) => {
      const doc = document.implementation.createHTMLDocument('');
      doc.body.innerHTML = html;
      return doc;
    };

    it.each([
      ['the same field, in other wrappers', '<input aria-label="Billing" data-qa="dt-input">', 0,
        '<div><label>Billing <span><input data-qa="dt-input"></span></label></div>', ['typed']],
      ['the same of two unnamed fields, as many here', '<input><input>', 1, '<p><input></p><p><input></p>', ['', 'typed']],
      ['not a field with another name, found by its role', '<input aria-label="Shipping"><input aria-label="Billing">', 0,
        '<input aria-label="Billing">', ['']],
      ['not one of two unnamed fields when this frame has one', '<input><input>', 0, '<input>', ['']],
      ['not one whose data-qa differs', '<input data-qa="dt-input" aria-label="Name">', 0,
        '<input data-qa="dt-other" aria-label="Name">', ['']],
      ['not a field of another kind at the point', '<textarea aria-label="Notes"></textarea>', 0,
        '<input aria-label="Notes">', ['']],
    ])('writes %s', (_, source, index, mirror, values) => {
      frame = framedAgent(mirror);
      frame.doc.elementFromPoint = () => frame.doc.querySelector('input');
      frame.fromHost({ type: 'connect' });
      const target = locatorOf(sourcePage(source).querySelectorAll('input, textarea')[index]);

      frame.fromHost({ type: 'replay', events: [{ kind: 'value', value: 'typed', selection: null, target }] });

      expect([...frame.doc.querySelectorAll('input')].map(input => input.value)).toEqual(values);
    });
  });

  describe('Focus', () => {
    let original;

    beforeEach(() => {
      frame = framedAgent(`${PAGE}<svg id="shape" tabindex="0"></svg><div id="plain">Plain</div>`);
      original = { html: frame.win.HTMLElement.prototype.focus, svg: frame.win.SVGElement.prototype.focus };
      frame.rect(frame.byId('target'), { left: 10, top: 20, width: 80, height: 30 });
      frame.rect(frame.byId('field'), { left: 10, top: 60, width: 200, height: 30 });
      frame.fromHost({ type: 'connect' });
    });

    const replayClick = () => frame.fromHost({
      type: 'replay',
      events: ['down', 'up', 'click'].map(kind => ({ kind, x: 5, y: 5 })),
    });

    it('becomes the mirror on a replayed press, where focus() takes no focus and moves the fake ring', () => {
      frame.byId('field').focus();
      replayClick();

      frame.byId('target').focus();
      frame.runFrame();

      expect(frame.doc.activeElement).toBe(frame.byId('field'));
      expect(frame.rings()).toEqual([{ x: 10, y: 20, width: 80, height: 30 }]);
    });

    it('shims SVG elements too, and rings only what could take focus', () => {
      frame.rect(frame.byId('shape'), { left: 0, top: 100, width: 24, height: 24 });
      replayClick();

      frame.byId('plain').focus();
      frame.runFrame();
      expect(frame.rings()).toEqual([]);

      frame.byId('shape').focus();
      frame.runFrame();
      expect(frame.rings()).toEqual([{ x: 0, y: 100, width: 24, height: 24 }]);
      expect(frame.win.SVGElement.prototype.focus).not.toBe(original.svg);
    });

    it('takes focus as before while it is the source, and before it is either', () => {
      frame.byId('target').focus();
      expect(frame.doc.activeElement).toBe(frame.byId('target'));

      replayClick();
      frame.realEvent(frame.byId('field'), 'pointerdown');
      frame.byId('field').focus();

      expect(frame.doc.activeElement).toBe(frame.byId('field'));
      expect(frame.win.HTMLElement.prototype.focus).toBe(original.html);
      expect(frame.win.SVGElement.prototype.focus).toBe(original.svg);
    });

    it('doesn\'t become the mirror for the other frame\'s pointer resting over it, or its scroll', () => {
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 1, y: 1 }, { kind: 'scroll', x: 0, y: 0 }] });

      expect(frame.win.HTMLElement.prototype.focus).toBe(original.html);
    });

    it('becomes the source again on a real key or real typing', () => {
      replayClick();
      frame.realKey(frame.byId('target'), 'keydown', { key: 'Tab' });
      expect(frame.win.HTMLElement.prototype.focus).toBe(original.html);

      replayClick();
      frame.realInput(frame.byId('field'), 'x');
      expect(frame.win.HTMLElement.prototype.focus).toBe(original.html);
    });

    it('puts focus() back on disconnect, but leaves one the story replaced in the meantime', () => {
      replayClick();
      frame.fromHost({ type: 'disconnect' });
      expect(frame.win.HTMLElement.prototype.focus).toBe(original.html);

      frame.fromHost({ type: 'connect' });
      replayClick();
      const story = vi.fn();
      frame.win.HTMLElement.prototype.focus = story;
      frame.fromHost({ type: 'disconnect' });

      expect(frame.win.HTMLElement.prototype.focus).toBe(story);
      expect(frame.win.SVGElement.prototype.focus).toBe(original.svg);
      frame.win.HTMLElement.prototype.focus = original.html;
    });

    it('sends where real focus went, once per batch, and that it left the page', () => {
      const field = frame.byId('field');
      field.focus();
      frame.realFocus(frame.byId('target'), 'focusout');
      frame.realFocus(field);
      frame.runFrame();
      field.blur();
      frame.realFocus(field, 'focusout');
      frame.runFrame();

      expect(frame.inputs().map(message => message.events)).toEqual([
        [{ kind: 'focus', target: locatorOf(field) }],
        [{ kind: 'blur' }],
      ]);
    });

    it('doesn\'t send focus moving while it is the mirror: only the page losing it can, which isn\'t the source\'s', () => {
      replayClick();
      frame.realFocus(frame.byId('field'), 'focusout');
      frame.runFrame();

      expect(frame.inputs()).toEqual([]);
    });

    it('rings the counterpart of the source\'s focus, follows it as it moves, and hides it when focus leaves', () => {
      frame.fromHost({ type: 'replay', events: [{ kind: 'focus', target: locatorOf(frame.byId('target')) }] });
      frame.runFrame();
      frame.runFrame();
      frame.rect(frame.byId('target'), { left: 10, top: 120, width: 80, height: 30 });
      frame.runFrame();
      frame.fromHost({ type: 'replay', events: [{ kind: 'blur' }] });
      frame.runFrame();

      expect(frame.rings()).toEqual([
        { x: 10, y: 20, width: 80, height: 30 },
        { x: 10, y: 120, width: 80, height: 30 },
        null,
      ]);
      expect(frame.pendingFrames()).toBe(0);
    });

    it('hides the ring when its element goes, or becomes the source', () => {
      frame.fromHost({ type: 'replay', events: [{ kind: 'focus', target: locatorOf(frame.byId('target')) }] });
      frame.runFrame();
      frame.byId('target').remove();
      frame.runFrame();

      frame.fromHost({ type: 'replay', events: [{ kind: 'focus', target: locatorOf(frame.byId('field')) }] });
      frame.runFrame();
      frame.realEvent(frame.byId('field'), 'pointerdown');

      expect(frame.rings()).toEqual([
        { x: 10, y: 20, width: 80, height: 30 },
        null,
        { x: 10, y: 60, width: 200, height: 30 },
        null,
      ]);
    });

    it('draws no ring for the source\'s focus while it is the source itself', () => {
      frame.realEvent(frame.byId('field'), 'pointerdown');

      frame.fromHost({ type: 'replay', events: [{ kind: 'focus', target: locatorOf(frame.byId('target')) }] });
      frame.runFrame();

      expect(frame.rings()).toEqual([]);
    });
  });

  describe('Hover styles', () => {
    const hovered = () => [...frame.doc.querySelectorAll(`[${HOVER_ATTRIBUTE}]`)].map(element => element.id || element.localName);

    beforeEach(() => {
      frame = framedAgent();
      // Constructable sheets, which jsdom doesn't have: a sheet keeps the text it was given.
      Object.defineProperty(frame.doc, 'adoptedStyleSheets', { configurable: true, writable: true, value: [] });
      frame.win.CSSStyleSheet.prototype.replaceSync = function (text) {
        this.text = text;
      };
      const style = frame.doc.createElement('style');
      style.textContent = '#target:hover { color: red }';
      frame.doc.head.append(style);
    });

    afterEach(() => {
      delete frame.win.CSSStyleSheet.prototype.replaceSync;
    });

    it('copies the hover rules at the handshake, in idle time, and not before', () => {
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });
      expect(frame.idle).toEqual([]);

      frame.fromHost({ type: 'connect' });
      expect(frame.doc.adoptedStyleSheets).toEqual([]);
      frame.runIdle();

      expect(frame.doc.adoptedStyleSheets.map(sheet => sheet.text)).toEqual([`#target[${HOVER_ATTRIBUTE}]{color: red;}`]);
    });

    it('marks the replayed pointer\'s element and its ancestors as it enters, and unmarks what it leaves', () => {
      frame.fromHost({ type: 'connect' });
      frame.pointAt('target');
      const marks = [];
      frame.byId('target').addEventListener('mouseenter', () => marks.push(hovered()));

      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });
      expect(hovered()).toEqual(['html', 'body', 'outer', 'wrap', 'target']);
      // As :hover, already there when the enter events go.
      expect(marks).toEqual([['html', 'body', 'outer', 'wrap', 'target']]);

      frame.pointAt('other');
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 60 }] });
      expect(hovered()).toEqual(['html', 'body', 'other']);
    });

    it('unmarks everything when the pointer leaves, or the real pointer comes in, until the next replayed move', () => {
      frame.fromHost({ type: 'connect' });
      frame.pointAt('target');
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });

      frame.fromHost({ type: 'replay', events: [{ kind: 'leave' }] });
      expect(hovered()).toEqual([]);

      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });
      frame.realEvent(frame.byId('other'), 'pointermove', { clientX: 1, clientY: 1 });
      expect(hovered()).toEqual([]);

      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 6, y: 6 }] });
      expect(hovered()).toEqual(['html', 'body', 'outer', 'wrap', 'target']);
    });

    it('takes the sheet and every mark out on disconnect, leaving the page as it was', () => {
      const html = frame.doc.documentElement.outerHTML;
      frame.fromHost({ type: 'connect' });
      frame.runIdle();
      frame.pointAt('target');
      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });

      frame.fromHost({ type: 'disconnect' });

      expect(frame.doc.documentElement.outerHTML).toBe(html);
      expect(frame.doc.adoptedStyleSheets).toEqual([]);
    });

    it('sends nothing for the marks it sets', () => {
      frame.fromHost({ type: 'connect' });
      frame.runIdle();
      frame.pointAt('target');

      frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }, { kind: 'leave' }] });
      frame.runFrame();

      expect(frame.inputs()).toEqual([]);
    });
  });

  it('goes inert again on disconnect, releasing the replayed pointer', () => {
    frame = framedAgent();
    frame.fromHost({ type: 'connect' });
    frame.pointAt('target');
    frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });
    frame.log.length = 0;
    const removed = vi.spyOn(frame.win, 'removeEventListener');

    frame.fromHost({ type: 'disconnect' });
    frame.realEvent(frame.byId('target'), 'pointermove', { clientX: 1, clientY: 1 });
    frame.fromHost({ type: 'replay', events: [{ kind: 'move', x: 5, y: 6 }] });
    frame.runFrame();

    expect(frame.log).toContain('mouseleave@outer');
    expect(frame.log).not.toContain('mouseenter@outer');
    expect(removed.mock.calls.map(([type]) => type)).toEqual([
      'pointermove', 'pointerdown', 'pointerup', 'pointercancel', 'click', 'pointerout', 'scroll', 'resize',
      'keydown', 'keyup', 'input', 'focusin', 'focusout',
    ]);
    expect(removed.mock.calls.find(([type]) => type === 'scroll')[2]).toBe(true);
    expect(frame.inputs()).toEqual([]);
  });
});
