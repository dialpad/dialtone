import { parseChannelMessage } from './frames';
import type { Side } from './frames';
import {
  HANDSHAKE_TIMEOUT,
  SYNC_KEY,
  createSyncRelay,
  frameOffset,
  mapPoint,
  parseAgentMessage,
  syncChip,
} from './sync';
import type { Box, HostMessage, RelayStatus, SyncEvent } from './sync';

const VIEWPORT = { width: 600, height: 700 };
const ready = { key: SYNC_KEY, type: 'ready', viewport: VIEWPORT };
const input = (events: SyncEvent[], viewport = VIEWPORT) => ({ key: SYNC_KEY, type: 'input', viewport, events });

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
        { kind: 'move', x: 10, y: 20 },
        { kind: 'down', x: 10, y: 20 },
        { kind: 'up', x: 10, y: 20 },
        { kind: 'click', x: 10, y: 20 },
      ]);
      expect(replays('vue')).toEqual([]);
      expect(relay.getStatus().source).toBe('vue');
      expect(relay.getCursor()).toEqual({ over: 'react', mirrors: 'vue', x: 10, y: 20, pressed: false });
    });

    it('maps points into a frame of another size', () => {
      const { relay, replays } = relayWithFrames();
      relay.start();
      relay.receive('vue', ready);
      relay.receive('react', { ...ready, viewport: { width: 300, height: 350 } });

      relay.receive('vue', input([{ kind: 'move', x: 100, y: 200 }]));

      expect(replays('react')).toEqual([{ kind: 'move', x: 50, y: 100 }]);
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
      expect(replays('react')).toEqual([{ kind: 'move', x: 590, y: 20 }, { kind: 'leave' }]);
      expect(replays('vue')).toEqual([{ kind: 'move', x: 5, y: 20 }]);
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

    it('hides the cursor and waits for a new answer when a frame reloads', () => {
      const { relay, posts, connectBoth } = relayWithFrames();
      connectBoth();
      relay.receive('vue', input([{ kind: 'move', x: 1, y: 1 }]));
      posts.length = 0;

      relay.frameLoaded('react');
      relay.receive('vue', input([{ kind: 'move', x: 2, y: 2 }]));

      expect(relay.getCursor()).toBeNull();
      expect(relay.getStatus().frames.react).toBe('connecting');
      expect(posts).toEqual([['react', { key: SYNC_KEY, type: 'connect' }]]);
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
