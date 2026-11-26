import { DEFAULT_COMPARE_HOSTS } from '../../dialtone-vue/.storybook/compare-sync-agent.js';
import { parseChannelMessage } from './frames';
import type { Side } from './frames';
import ports from './ports.json';
import {
  HANDSHAKE_TIMEOUT,
  KEYS_MS,
  MAX_KEYS,
  RELOAD_RESET,
  SYNC_KEY,
  TYPING,
  createSyncRelay,
  frameOffset,
  keyLabel,
  mapPoint,
  parseAgentMessage,
  syncChip,
} from './sync';
import type { Box, HostMessage, KeyEvent, Locator, RelayStatus, SyncEvent } from './sync';

const VIEWPORT = { width: 600, height: 700 };
// The modifier keys the relay sends with every pointer event, none of them held.
const NO_KEYS = { alt: false, ctrl: false, meta: false, shift: false };
const ready = { key: SYNC_KEY, type: 'ready', viewport: VIEWPORT };
const input = (events: SyncEvent[], viewport = VIEWPORT) => ({ key: SYNC_KEY, type: 'input', viewport, events });
const ring = (rect: unknown) => ({ key: SYNC_KEY, type: 'ring', viewport: VIEWPORT, rect });
const locator = (at = { x: 100, y: 200 }): Locator => ({
  role: 'button', qa: 'dt-button', name: 'Open', at, ranks: [[0, 1], [0, 1], [0, 1]],
});
const key = (name: string, flags: Partial<KeyEvent> = {}): KeyEvent => ({
  kind: 'keydown', key: name, code: name, keyCode: 0, alt: false, ctrl: false, meta: false, shift: false,
  repeat: false, target: locator(), ...flags,
});
const text = (value: string): SyncEvent => ({ kind: 'value', value, selection: null, target: locator() });

function relayWithFrames () {
  const posts: [Side, HostMessage][] = [];
  const statuses: RelayStatus[] = [];
  let time = 0;
  const relay = createSyncRelay({
    post: (side, message) => posts.push([side, message]),
    onStatus: status => statuses.push(status),
    now: () => time,
  });
  const replays = (side: Side) => posts
    .filter(([to, message]) => to === side && message.type === 'replay')
    .flatMap(([, message]) => ('events' in message ? message.events : []));
  return {
    relay,
    posts,
    statuses,
    replays,
    advance: (ms: number) => { time += ms; },
    connectBoth: () => {
      relay.start();
      relay.receive('vue', ready);
      relay.receive('react', ready);
    },
  };
}

describe('Compare sync', () => {
  describe('parseAgentMessage', () => {
    it('reads the agent\'s ready and input messages', () => {
      const events: SyncEvent[] = [{ kind: 'move', x: 1, y: 2 }, { kind: 'leave' }, { kind: 'scroll', x: 0, y: 40 }];

      expect(parseAgentMessage(ready)).toEqual({ type: 'ready', viewport: VIEWPORT });
      expect(parseAgentMessage(input(events))).toEqual({ type: 'input', viewport: VIEWPORT, events });
    });

    it('reads a scroller event only with a point to find it by', () => {
      const scroller = { kind: 'scroller', x: 0, y: 5, at: { x: 1, y: 2 } } as SyncEvent;

      expect(parseAgentMessage(input([scroller]))).toMatchObject({ events: [scroller] });
      expect(parseAgentMessage(input([{ kind: 'scroller', x: 0, y: 5 } as unknown as SyncEvent]))).toBeNull();
      expect(parseAgentMessage(input([{ ...scroller, at: { x: 'a', y: 2 } } as unknown as SyncEvent]))).toBeNull();
    });

    it.each([
      ['another key', { ...ready, key: 'storybook-channel' }],
      ['Storybook\'s channel', JSON.stringify({ key: 'storybook-channel', event: { type: 'storyRendered' } })],
      ['no viewport', { key: SYNC_KEY, type: 'ready' }],
      ['an empty viewport', { ...ready, viewport: { width: 0, height: 700 } }],
      ['an unknown type', { ...ready, type: 'keydown' }],
      ['an unknown event', input([{ kind: 'keydown' } as unknown as SyncEvent])],
      ['a coordinate that isn\'t a finite number', input([{ kind: 'move', x: Infinity, y: 2 }])],
      ['more events than a frame holds', input(Array.from({ length: 65 }, () => ({ kind: 'leave' as const })))],
    ])('rejects a message with %s', (_name, data) => {
      expect(parseAgentMessage(data)).toBeNull();
    });

    it('reads keys, text, focus and the ring', () => {
      const events: SyncEvent[] = [
        key('Escape'), key('ArrowDown', { kind: 'keyup', target: null }), text('hello'),
        { kind: 'focus', target: locator() }, { kind: 'blur' },
      ];

      expect(parseAgentMessage(input(events))).toEqual({ type: 'input', viewport: VIEWPORT, events });
      expect(parseAgentMessage(ring({ x: 1, y: 2, width: 30, height: 40 })))
        .toEqual({ type: 'ring', viewport: VIEWPORT, rect: { x: 1, y: 2, width: 30, height: 40 } });
      expect(parseAgentMessage(ring(null))).toEqual({ type: 'ring', viewport: VIEWPORT, rect: null });
    });

    it.each([
      ['a key that isn\'t a string', key(1 as unknown as string)],
      ['a key without its modifiers', { ...key('Escape'), shift: undefined }],
      ['a key whose locator has no point', key('Escape', { target: { ...locator(), at: null as unknown as Locator['at'] } })],
      ['a locator without its ranks', { kind: 'focus', target: { ...locator(), ranks: [[0, 1]] } }],
      ['a text that isn\'t a string', { ...text(''), value: 5 }],
      ['a text that is too long', text('x'.repeat(10001))],
      ['a text without a locator', { ...text('x'), target: null }],
    ])('rejects %s', (_name, event) => {
      expect(parseAgentMessage(input([event as SyncEvent]))).toBeNull();
    });

    it('reads a pointer event\'s modifier keys, when it has them, and a cancel', () => {
      const events: SyncEvent[] = [
        { kind: 'down', x: 1, y: 2, ...NO_KEYS, shift: true }, { kind: 'cancel' }, { kind: 'move', x: 1, y: 2, ctrl: true },
      ];

      expect(parseAgentMessage(input(events))).toEqual({ type: 'input', viewport: VIEWPORT, events });
      expect(parseAgentMessage(input([{ kind: 'click', x: 1, y: 2, shift: 1 } as unknown as SyncEvent]))).toBeNull();
    });

    it('rejects a ring that isn\'t a rect', () => {
      expect(parseAgentMessage(ring({ x: 1, y: 2, width: -1, height: 4 }))).toBeNull();
      expect(parseAgentMessage(ring(undefined))).toBeNull();
    });

    it('is invisible to the Storybook channel parser', () => {
      expect(parseChannelMessage(ready)).toBeNull();
      expect(parseChannelMessage({ key: SYNC_KEY, type: 'connect' })).toBeNull();
    });
  });

  describe('mapPoint', () => {
    it('keeps the pixels between viewports of the same size', () => {
      expect(mapPoint({ x: 123.5, y: 456 }, VIEWPORT, { width: 600.2, height: 699.8 })).toEqual({ x: 123.5, y: 456 });
    });

    it('maps proportionally between viewports of different sizes', () => {
      expect(mapPoint({ x: 300, y: 70 }, VIEWPORT, { width: 400, height: 350 })).toEqual({ x: 200, y: 35 });
    });
  });

  describe('frameOffset', () => {
    const box = (left: number, top: number, border = 0, padding = 0): Box => ({
      left, top, clientLeft: border, clientTop: border, paddingLeft: padding, paddingTop: padding,
    });

    it('is zero for a frame that fills its container', () => {
      expect(frameOffset(box(601, 33), box(601, 33))).toEqual({ x: 0, y: 0 });
    });

    it('leaves out the container\'s border, since its child is placed from the padding edge', () => {
      // A pane with a 1px border, whose frame sits inside it: the spike's 1px error.
      expect(frameOffset(box(601, 33), box(600, 32, 1))).toEqual({ x: 0, y: 0 });
    });

    it('adds the frame\'s own border and padding', () => {
      expect(frameOffset(box(610, 40, 2, 3), box(600, 32))).toEqual({ x: 15, y: 13 });
    });
  });

  describe('createSyncRelay', () => {
    it('says hello to both frames on start and goodbye on stop', () => {
      const { relay, posts } = relayWithFrames();

      relay.start();
      relay.stop();

      expect(posts).toEqual([
        ['vue', { key: SYNC_KEY, type: 'connect' }],
        ['react', { key: SYNC_KEY, type: 'connect' }],
        ['vue', { key: SYNC_KEY, type: 'disconnect' }],
        ['react', { key: SYNC_KEY, type: 'disconnect' }],
      ]);
    });

    it('sends nothing and takes no input while stopped', () => {
      const { relay, posts } = relayWithFrames();

      relay.connect('vue');
      relay.frameLoaded('react');
      relay.tick();
      const consumed = relay.receive('vue', input([{ kind: 'move', x: 1, y: 1 }]));

      expect(consumed).toBe(true);
      expect(posts).toEqual([]);
      expect(relay.getCursor()).toBeNull();
    });

    it('leaves other messages to the caller', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();

      expect(relay.receive('vue', JSON.stringify({ key: 'storybook-channel', event: {} }))).toBe(false);
      expect(relay.receive('vue', { key: SYNC_KEY, type: 'bogus' })).toBe(true);
    });

    it('marks each frame ready when it answers, and silent when it doesn\'t in time', () => {
      const { relay, advance, posts } = relayWithFrames();
      relay.start();

      relay.receive('vue', ready);
      advance(HANDSHAKE_TIMEOUT);
      relay.tick();

      expect(relay.getStatus().frames).toEqual({ vue: 'ready', react: 'silent' });
      // It keeps asking the silent one.
      expect(posts.at(-1)).toEqual(['react', { key: SYNC_KEY, type: 'connect' }]);
    });

    it('relays only once both frames have answered', () => {
      const { relay, replays } = relayWithFrames();
      relay.start();
      relay.receive('vue', ready);

      relay.receive('vue', input([{ kind: 'move', x: 10, y: 20 }]));

      expect(replays('react')).toEqual([]);
      expect(relay.getCursor()).toBeNull();
    });

    it('replays pointer input in the other frame and draws the cursor over it', () => {
      const { relay, replays, connectBoth } = relayWithFrames();
      connectBoth();

      relay.receive('vue', input([
        { kind: 'move', x: 10, y: 20 },
        { kind: 'down', x: 10, y: 20 },
        { kind: 'up', x: 10, y: 20 },
        { kind: 'click', x: 10, y: 20 },
      ]));

      expect(replays('react')).toEqual([
        { kind: 'move', x: 10, y: 20, ...NO_KEYS },
        { kind: 'down', x: 10, y: 20, ...NO_KEYS },
        { kind: 'up', x: 10, y: 20, ...NO_KEYS },
        { kind: 'click', x: 10, y: 20, ...NO_KEYS },
      ]);
      expect(replays('vue')).toEqual([]);
      expect(relay.getStatus().source).toBe('vue');
      expect(relay.getCursor()).toEqual({ over: 'react', mirrors: 'vue', x: 10, y: 20, pressed: false, click: 1 });
    });

    it('replays the modifier keys held with each pointer event, all four', () => {
      const { relay, replays, connectBoth } = relayWithFrames();
      connectBoth();

      relay.receive('vue', input([
        { kind: 'move', x: 1, y: 2, ...NO_KEYS, ctrl: true },
        { kind: 'down', x: 1, y: 2, ...NO_KEYS, shift: true },
        { kind: 'up', x: 1, y: 2, ...NO_KEYS, shift: true, meta: true },
        { kind: 'click', x: 1, y: 2, shift: true, alt: true },
      ]));

      expect(replays('react')).toEqual([
        { kind: 'move', x: 1, y: 2, ...NO_KEYS, ctrl: true },
        { kind: 'down', x: 1, y: 2, ...NO_KEYS, shift: true },
        { kind: 'up', x: 1, y: 2, ...NO_KEYS, shift: true, meta: true },
        { kind: 'click', x: 1, y: 2, ...NO_KEYS, shift: true, alt: true },
      ]);
    });

    it('relays a cancelled press, which leaves the cursor where it is, no longer pressed', () => {
      const { relay, replays, connectBoth } = relayWithFrames();
      connectBoth();

      relay.receive('vue', input([{ kind: 'down', x: 10, y: 20 }, { kind: 'move', x: 30, y: 20 }]));
      relay.receive('vue', input([{ kind: 'cancel' }]));
      const cancelled = relay.getCursor();
      relay.receive('vue', input([{ kind: 'move', x: 40, y: 20 }]));

      expect(replays('react').map(event => event.kind)).toEqual(['down', 'move', 'cancel', 'move']);
      expect(cancelled).toEqual({ over: 'react', mirrors: 'vue', x: 30, y: 20, pressed: false });
      expect(relay.getCursor()).toMatchObject({ x: 40, pressed: false });
    });

    it('maps points into a frame of another size', () => {
      const { relay, replays } = relayWithFrames();
      relay.start();
      relay.receive('vue', ready);
      relay.receive('react', { ...ready, viewport: { width: 300, height: 350 } });

      relay.receive('vue', input([{ kind: 'move', x: 100, y: 200 }]));

      expect(replays('react')).toEqual([{ kind: 'move', x: 50, y: 100, ...NO_KEYS }]);
      expect(relay.getCursor()).toMatchObject({ x: 50, y: 100 });
    });

    it('presses the cursor while the button is down', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();

      relay.receive('vue', input([{ kind: 'down', x: 10, y: 20 }, { kind: 'move', x: 15, y: 25 }]));
      const held = relay.getCursor();
      relay.receive('vue', input([{ kind: 'up', x: 15, y: 25 }]));

      expect(held).toMatchObject({ pressed: true, x: 15, y: 25 });
      expect(relay.getCursor()).toMatchObject({ pressed: false });
    });

    it('switches the source to the frame the pointer moved into', () => {
      const { relay, replays, connectBoth } = relayWithFrames();
      connectBoth();
      relay.receive('vue', input([{ kind: 'move', x: 590, y: 20 }]));

      relay.receive('vue', input([{ kind: 'leave' }]));
      const between = relay.getCursor();
      relay.receive('react', input([{ kind: 'move', x: 5, y: 20 }]));

      expect(between).toBeNull();
      // A leave is only that, also mid-drag: the press can still end with its release.
      expect(replays('react')).toEqual([{ kind: 'move', x: 590, y: 20, ...NO_KEYS }, { kind: 'leave' }]);
      expect(replays('vue')).toEqual([{ kind: 'move', x: 5, y: 20, ...NO_KEYS }]);
      expect(relay.getStatus().source).toBe('react');
      expect(relay.getCursor()).toEqual({ over: 'vue', mirrors: 'react', x: 5, y: 20, pressed: false });
    });

    it('relays page scroll in pixels without changing the source', () => {
      const { relay, replays, connectBoth } = relayWithFrames();
      connectBoth();
      relay.receive('vue', input([{ kind: 'move', x: 1, y: 1 }]));

      relay.receive('react', input([{ kind: 'scroll', x: 0, y: 480 }], { width: 300, height: 350 }));

      expect(replays('vue')).toEqual([{ kind: 'scroll', x: 0, y: 480 }]);
      expect(relay.getStatus().source).toBe('vue');
    });

    it('relays a scroller\'s offset as it is and maps the point that finds it', () => {
      const { relay, replays, connectBoth } = relayWithFrames();
      connectBoth();

      relay.receive('react', input([{ kind: 'scroller', x: 0, y: 120, at: { x: 150, y: 175 } }], { width: 300, height: 350 }));

      expect(replays('vue')).toEqual([{ kind: 'scroller', x: 0, y: 120, at: { x: 300, y: 350 } }]);
    });

    it('keeps a drag pressed across moves, and ends it with the release', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();
      const pressed = () => relay.getCursor()?.pressed;

      relay.receive('vue', input([{ kind: 'down', x: 5, y: 5 }]));
      const down = pressed();
      relay.receive('vue', input([{ kind: 'move', x: 50, y: 5 }]));
      const dragging = pressed();
      relay.receive('vue', input([{ kind: 'up', x: 50, y: 5 }]));

      expect([down, dragging, pressed()]).toEqual([true, true, false]);
    });

    it('marks the state a click leaves with a new number for each click, and the next move clears it', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();

      relay.receive('vue', input([{ kind: 'click', x: 5, y: 5 }]));
      const first = relay.getCursor()?.click;
      relay.receive('vue', input([{ kind: 'click', x: 5, y: 5 }]));
      const second = relay.getCursor()?.click;
      relay.receive('vue', input([{ kind: 'move', x: 6, y: 5 }]));

      expect(first).toBeDefined();
      expect(second).not.toBe(first);
      expect(relay.getCursor()?.click).toBeUndefined();
    });

    it('cues a replayed scroll in the frame it went to, with its direction once it has one', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();
      const listener = vi.fn();
      relay.subscribeCue(listener);

      relay.receive('vue', input([{ kind: 'scroll', x: 0, y: 100 }]));
      const first = relay.getCue();
      relay.receive('vue', input([{ kind: 'scroll', x: 0, y: 300 }]));
      const second = relay.getCue();
      relay.receive('vue', input([{ kind: 'scroll', x: 0, y: 200 }]));

      expect(first).toMatchObject({ over: 'react', mirrors: 'vue', direction: null });
      expect(second).toMatchObject({ direction: 'down' });
      expect(relay.getCue()).toMatchObject({ direction: 'up' });
      expect(new Set([first?.seq, second?.seq, relay.getCue()?.seq]).size).toBe(3);
      expect(listener).toHaveBeenCalledTimes(3);
    });

    it('cues a scroller by where it is, so two scrollers don\'t share a direction, and not a plain move', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();
      const at = (x: number, y: number) => ({ x, y });

      relay.receive('vue', input([{ kind: 'scroller', x: 0, y: 100, at: at(50, 50) }]));
      relay.receive('vue', input([{ kind: 'scroller', x: 0, y: 10, at: at(400, 300) }]));
      const other = relay.getCue();
      relay.receive('vue', input([{ kind: 'move', x: 1, y: 1 }]));

      expect(other?.direction).toBeNull();
      expect(relay.getCue()).toBe(other);
    });

    it('clears the cue on stop and on a reload', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();
      relay.receive('vue', input([{ kind: 'scroll', x: 0, y: 100 }]));

      relay.frameLoaded('react');
      const reloaded = relay.getCue();
      relay.receive('vue', ready);
      relay.receive('react', ready);
      relay.receive('vue', input([{ kind: 'scroll', x: 0, y: 100 }]));
      relay.stop();

      expect(reloaded).toBeNull();
      expect(relay.getCue()).toBeNull();
    });

    it('hides the cursor and waits for a new answer when a frame reloads, relaying nothing into it meanwhile', () => {
      const { relay, posts, connectBoth } = relayWithFrames();
      connectBoth();
      relay.receive('vue', input([{ kind: 'move', x: 1, y: 1 }]));
      posts.length = 0;

      relay.frameLoaded('react');
      relay.receive('vue', input([{ kind: 'move', x: 2, y: 2 }]));

      expect(relay.getCursor()).toBeNull();
      expect(relay.getStatus().frames.react).toBe('connecting');
      expect(posts.filter(([side]) => side === 'react')).toEqual([['react', { key: SYNC_KEY, type: 'connect' }]]);
    });

    // All the other frame mirrored from the old document goes: a press still down there ends with no click (a plain
    // leave would keep a drag going), the hovered elements and the ring of its focus go. Whatever the cursor: focus can
    // come from the keyboard alone, and the pointer can have left mid-drag.
    it.each([
      ['mid-drag', [{ kind: 'down', x: 1, y: 1 }, { kind: 'move', x: 5, y: 1 }]],
      ['after the pointer left mid-drag', [{ kind: 'down', x: 1, y: 1 }, { kind: 'leave' }]],
      ['after keys alone', [key('ArrowDown'), { kind: 'focus', target: locator() }]],
    ] as [string, SyncEvent[]][])('resets the other frame when a frame reloads %s', (_, events) => {
      const { relay, posts, connectBoth } = relayWithFrames();
      connectBoth();
      relay.receive('vue', input(events));
      posts.length = 0;

      relay.frameLoaded('vue');

      expect(posts).toEqual([
        ['react', { key: SYNC_KEY, type: 'replay', events: [{ kind: 'cancel' }, { kind: 'leave' }, { kind: 'blur' }] }],
        ['vue', { key: SYNC_KEY, type: 'connect' }],
      ]);
      expect(RELOAD_RESET).toEqual([{ kind: 'cancel' }, { kind: 'leave' }, { kind: 'blur' }]);
    });

    it('sends no reset to a frame that hasn\'t answered', () => {
      const { relay, posts } = relayWithFrames();
      relay.start();
      relay.receive('vue', ready);
      posts.length = 0;

      relay.frameLoaded('vue');

      expect(posts).toEqual([['vue', { key: SYNC_KEY, type: 'connect' }]]);
    });

    it('clears the ring mirroring a frame that reloads, with no pointer about', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();
      const rect = { x: 1, y: 2, width: 3, height: 4 };
      // React draws Vue's focus, from Vue's keys.
      relay.receive('vue', input([key('ArrowDown')]));
      relay.receive('react', ring(rect));

      relay.frameLoaded('vue');

      expect(relay.getCursor()).toBeNull();
      expect(relay.getRings()).toEqual({ vue: null, react: null });
    });

    it('tells cursor subscribers about each change', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();
      const listener = vi.fn();
      const unsubscribe = relay.subscribeCursor(listener);

      relay.receive('vue', input([{ kind: 'move', x: 1, y: 1 }]));
      unsubscribe();
      relay.receive('vue', input([{ kind: 'move', x: 2, y: 2 }]));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('replays keys, text and focus in the other frame, with their locators\' points mapped', () => {
      const { relay, replays } = relayWithFrames();
      relay.start();
      relay.receive('vue', ready);
      relay.receive('react', { ...ready, viewport: { width: 300, height: 350 } });

      relay.receive('vue', input([key('Escape'), text('hi'), { kind: 'focus', target: locator() }, { kind: 'blur' }]));

      const mapped = locator({ x: 50, y: 100 });
      expect(replays('react')).toEqual([
        key('Escape', { target: mapped }),
        { kind: 'value', value: 'hi', selection: null, target: mapped },
        { kind: 'focus', target: mapped },
        { kind: 'blur' },
      ]);
    });

    it('makes the frame a key or typing came from the source, but not where its focus went', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();

      relay.receive('react', input([{ kind: 'focus', target: locator() }]));
      const afterFocus = relay.getStatus().source;
      relay.receive('react', input([key('Escape')]));
      const afterKey = relay.getStatus().source;
      relay.receive('vue', input([text('x')]));

      expect([afterFocus, afterKey, relay.getStatus().source]).toEqual([null, 'react', 'vue']);
    });

    it('lists the keys mirrored into a frame for the overlay, with their modifiers, counting repeats', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();

      relay.receive('vue', input([key('ArrowDown'), key('ArrowDown', { kind: 'keyup' })]));
      relay.receive('vue', input([key('ArrowDown', { repeat: true })]));
      relay.receive('vue', input([key('Escape', { shift: true, ctrl: true })]));

      expect(relay.getKeys()).toMatchObject({
        over: 'react',
        mirrors: 'vue',
        entries: [{ label: 'ArrowDown', count: 2 }, { label: 'Ctrl+Shift+Escape', count: 1 }],
      });
    });

    it('shows typed text as one "typing…" line and never the text', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();

      relay.receive('vue', input([text('hunter2')]));
      relay.receive('vue', input([text('hunter22')]));

      expect(relay.getKeys()?.entries).toMatchObject([{ label: TYPING, count: 1 }]);
      expect(JSON.stringify(relay.getKeys())).not.toContain('hunter');
    });

    it('relays a range\'s or a select\'s value without calling it typing', () => {
      const { relay, replays, connectBoth } = relayWithFrames();
      connectBoth();
      const change = (role: string): SyncEvent => ({ kind: 'value', value: '7', selection: null, target: { ...locator(), role } });

      relay.receive('vue', input([change('input:range'), change('select')]));

      expect(replays('react')).toHaveLength(2);
      expect(relay.getKeys()).toBeNull();
    });

    it('drops keys older than KEYS_MS, keeps MAX_KEYS, and starts over in the other frame', () => {
      const { relay, connectBoth, advance } = relayWithFrames();
      connectBoth();

      relay.receive('vue', input([key('Home')]));
      advance(KEYS_MS);
      relay.receive('vue', input([key('Home')]));
      const restarted = relay.getKeys()?.entries;
      ['End', 'PageUp', 'PageDown', 'Escape', 'Backspace'].forEach(name => relay.receive('vue', input([key(name)])));
      const capped = relay.getKeys()?.entries.map(entry => entry.label);
      relay.receive('react', input([key('Delete')]));

      expect(restarted).toMatchObject([{ label: 'Home', count: 1 }]);
      expect(capped).toHaveLength(MAX_KEYS);
      expect(capped).toEqual(['PageUp', 'PageDown', 'Escape', 'Backspace']);
      expect(relay.getKeys()).toMatchObject({ over: 'vue', mirrors: 'react', entries: [{ label: 'Delete' }] });
    });

    it('has no keys until one is mirrored, and none after stop or the frame reloading', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();
      relay.receive('vue', input([{ kind: 'move', x: 1, y: 1 }, { kind: 'focus', target: locator() }]));
      const before = relay.getKeys();

      relay.receive('vue', input([key('Escape')]));
      relay.frameLoaded('react');
      const reloaded = relay.getKeys();
      relay.receive('vue', ready);
      relay.receive('react', ready);
      relay.receive('vue', input([key('Escape')]));
      relay.stop();

      expect([before, reloaded, relay.getKeys()]).toEqual([null, null, null]);
    });

    it('keeps each frame\'s ring, drawn over it, until it says none, reloads or sync stops', () => {
      const { relay, connectBoth } = relayWithFrames();
      connectBoth();
      const listener = vi.fn();
      relay.subscribeRings(listener);
      const rect = { x: 1, y: 2, width: 3, height: 4 };

      relay.receive('react', ring(rect));
      const shown = relay.getRings();
      relay.receive('react', ring(null));
      const hidden = relay.getRings();
      relay.receive('vue', ring(rect));
      relay.frameLoaded('vue');
      const reloaded = relay.getRings();
      relay.receive('react', ring(rect));
      relay.stop();

      expect(shown).toEqual({ vue: null, react: { over: 'react', mirrors: 'vue', rect } });
      expect(hidden).toEqual({ vue: null, react: null });
      expect(reloaded.vue).toBeNull();
      expect(relay.getRings()).toEqual({ vue: null, react: null });
      expect(listener).toHaveBeenCalledTimes(6);
    });
  });

  it('has the agent trust the comparison on its port in ports.json by default', () => {
    expect(DEFAULT_COMPARE_HOSTS).toEqual([`http://localhost:${ports.compare}`, `http://127.0.0.1:${ports.compare}`]);
  });

  describe('keyLabel', () => {
    it('puts the modifiers first, in a fixed order', () => {
      expect(keyLabel(key('ArrowDown'))).toBe('ArrowDown');
      expect(keyLabel(key('Home', { meta: true, shift: true, alt: true, ctrl: true }))).toBe('Ctrl+Alt+Shift+Meta+Home');
    });
  });

  describe('syncChip', () => {
    const status = (frames: RelayStatus['frames'], source: Side | null = null): RelayStatus => ({ frames, source });
    const both = { vue: 'ready', react: 'ready' } as const;

    it.each([
      ['missing', status(both), 'off', 'Sync off: React has no story'],
      ['unreachable', status(both), 'off', 'Sync off: React isn\'t running'],
      ['checking', status(both), 'waiting', 'Sync: checking React'],
      ['ported', status({ vue: 'ready', react: 'connecting' }), 'waiting', 'Sync: connecting'],
      ['ported', status({ vue: 'silent', react: 'ready' }), 'off', 'Sync off: Vue didn\'t answer'],
      ['ported', status(both), 'on', 'Sync on'],
      ['ported', status(both, 'vue'), 'on', 'Mirroring Vue → React'],
      ['ported', status(both, 'react'), 'on', 'Mirroring React → Vue'],
    ] as const)('React %s, frames %j: %s, "%s"', (reactStatus, relayStatus, tone, text) => {
      expect(syncChip(reactStatus, relayStatus)).toMatchObject({ tone, text });
    });
  });
});
