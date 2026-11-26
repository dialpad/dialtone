import { COMPARE_SYNC_KEY, installCompareSyncAgent } from './compare-sync-agent.js';

const HOST = 'http://localhost:9013';
const RECORDED = ['pointerover', 'pointerout', 'pointerenter', 'pointerleave', 'pointermove', 'pointerdown', 'pointerup',
  'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove', 'mousedown', 'mouseup', 'click'];

// The agent in a framed preview: an iframe of this document, whose parent window plays the comparison page. A script
// can't make a trusted event, so the events a test calls real stand in for isTrusted ones.
function framedAgent () {
  const iframe = document.createElement('iframe');
  document.body.append(iframe);
  const win = iframe.contentWindow;
  const doc = win.document;
  doc.body.innerHTML = `
    <div id="outer"><span id="wrap"><button id="target">Target</button></span></div>
    <p id="other">Other</p>
    <input id="field">`;
  const real = new WeakSet();
  const frames = [];
  // jsdom's window proxy, which isn't the test's `window` object.
  const host = win.parent;
  const sent = vi.spyOn(host, 'postMessage').mockImplementation(() => {});
  const listen = vi.spyOn(win, 'addEventListener');
  let pointAt = doc.body;
  doc.elementFromPoint = () => pointAt;
  const agent = installCompareSyncAgent({
    win,
    isReal: event => real.has(event),
    requestFrame: callback => frames.push(callback),
  });
  const byId = id => doc.getElementById(id);
  const log = [];
  for (const id of ['outer', 'wrap', 'target', 'other']) {
    for (const type of RECORDED) {
      byId(id).addEventListener(type, (event) => {
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
    host,
    fromHost: (data, source = host) => win.dispatchEvent(new win.MessageEvent('message', {
      data: { key: COMPARE_SYNC_KEY, ...data },
      origin: HOST,
      source,
    })),
    realEvent: (target, type, init = {}) => {
      const event = new win.MouseEvent(type, { bubbles: true, cancelable: true, composed: true, ...init });
      real.add(event);
      target.dispatchEvent(event);
    },
    realScroll: () => {
      const event = new win.Event('scroll', { bubbles: true });
      real.add(event);
      doc.dispatchEvent(event);
    },
    sent: () => sent.mock.calls.map(([message, origin]) => ({ ...message, origin })),
    inputs: () => sent.mock.calls.map(([message]) => message).filter(message => message.type === 'input'),
  };
}

// A page 1000px taller and 200px wider than its viewport, whose scrollTo jumps as `behavior: 'instant'` does.
function scrollablePage ({ win, doc }) {
  const position = { x: 0, y: 0 };
  const root = doc.documentElement;
  Object.defineProperties(root, {
    scrollLeft: { configurable: true, get: () => position.x },
    scrollTop: { configurable: true, get: () => position.y },
    scrollWidth: { configurable: true, value: 1200 },
    scrollHeight: { configurable: true, value: 1800 },
    clientWidth: { configurable: true, value: 1000 },
    clientHeight: { configurable: true, value: 800 },
  });
  win.scrollTo = vi.fn(({ left, top }) => {
    position.x = left;
    position.y = top;
  });
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

      frame.realEvent(frame.byId('target'), 'pointermove', { clientX: 5, clientY: 5 });
      frame.realEvent(frame.byId('target'), 'click');
      frame.runFrame();

      expect(frame.listen.mock.calls.map(([type]) => type)).toEqual(['message']);
      expect(frame.sent()).toEqual([]);
      expect(frame.pendingFrames()).toBe(0);
      expect(frame.doc.documentElement.outerHTML).toBe(html);
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
          { kind: 'move', x: 30, y: 40 },
          { kind: 'down', x: 30, y: 40 },
          { kind: 'up', x: 30, y: 40 },
          { kind: 'click', x: 30, y: 40 },
          { kind: 'leave' },
        ],
      }]);
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

  describe('Scroll', () => {
    let position;

    beforeEach(() => {
      frame = framedAgent();
      position = scrollablePage(frame);
      frame.fromHost({ type: 'connect' });
    });

    it('scrolls to the other frame\'s pixels, clamped to this page, and doesn\'t echo it', () => {
      frame.fromHost({ type: 'replay', events: [{ kind: 'scroll', x: 50, y: 5000 }] });
      frame.realScroll();
      frame.runFrame();

      expect(frame.win.scrollTo).toHaveBeenCalledWith({ left: 50, top: 1000, behavior: 'instant' });
      expect(position).toEqual({ x: 50, y: 1000 });
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
    expect(removed.mock.calls.map(([type]) => type))
      .toEqual(['pointermove', 'pointerdown', 'pointerup', 'click', 'pointerout', 'scroll', 'resize']);
    expect(frame.inputs()).toEqual([]);
  });
});
