// Sync mode: the comparison relays the real pointer and page scroll from one frame to the other, through the agent
// both previews install (dialtone-vue/.storybook/compare-sync-agent.js). Only postMessage, never the frames'
// documents, so it works for the published previews (same origin) and the local dev servers (cross-origin) alike.
// CompareFrame feeds the relay the frames' messages and posts what it sends; the relay itself has no DOM.
import { COMPARE_SYNC_KEY } from '../../dialtone-vue/.storybook/compare-sync-agent.js';
import type { Side } from './frames';

export const SYNC_KEY: string = COMPARE_SYNC_KEY;

/** A frame's viewport, in its own CSS pixels. */
export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

/** What an agent reports, and what the relay replays in the other frame. Points are in the viewport's CSS pixels. */
export type SyncEvent =
  | { kind: 'move' | 'down' | 'up' | 'click'; x: number; y: number }
  | { kind: 'scroll'; x: number; y: number }
  /** An element inside the page scrolled to (x, y); `at` is a point inside it, which finds it in the other frame. */
  | { kind: 'scroller'; x: number; y: number; at: Point }
  | { kind: 'leave' };

export type AgentMessage =
  | { type: 'ready'; viewport: Size }
  | { type: 'input'; viewport: Size; events: SyncEvent[] };

export type HostMessage =
  | { key: string; type: 'connect' | 'disconnect' }
  | { key: string; type: 'replay'; events: SyncEvent[] };

/** The phantom cursor: drawn over `over`, where the real pointer in `mirrors` is. */
export interface CursorState extends Point {
  over: Side;
  mirrors: Side;
  pressed: boolean;
  /** Set on the state a click leaves, so the cursor can show it; the next event replaces the state without it. */
  click?: number;
}

/** A scroll replayed in `over`, which the comparison shows for a moment at the frame's edge. */
export interface CueState {
  over: Side;
  mirrors: Side;
  /** Changes with every scroll, so a new one restarts the cue. */
  seq: number;
  /** Which way the scroll went, when it can tell. */
  direction: 'up' | 'down' | null;
}

/** Each frame's handshake: sent and not answered yet, answered, or not answered in HANDSHAKE_TIMEOUT. */
export type Handshake = 'connecting' | 'ready' | 'silent';

export interface RelayStatus {
  frames: Record<Side, Handshake>;
  /** The frame the real pointer was last in. */
  source: Side | null;
}

/** Before the first handshake, and after stop(). */
export const IDLE_STATUS: RelayStatus = { frames: { vue: 'connecting', react: 'connecting' }, source: null };

export const HANDSHAKE_TIMEOUT = 5000;
export const SIDES: Side[] = ['vue', 'react'];
const LABELS: Record<Side, string> = { vue: 'Vue', react: 'React' };
// A batch covers one animation frame; anything longer isn't from the agent.
const MAX_EVENTS = 64;

export const otherSide = (side: Side): Side => (side === 'vue' ? 'react' : 'vue');

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const isSize = (value: unknown): value is Size =>
  isObject(value) && isFiniteNumber(value.width) && isFiniteNumber(value.height) &&
  value.width > 0 && value.height > 0;

const POINT_KINDS = new Set(['move', 'down', 'up', 'click', 'scroll']);

const isPoint = (value: unknown): value is Point =>
  isObject(value) && isFiniteNumber(value.x) && isFiniteNumber(value.y);

const isSyncEvent = (value: unknown): value is SyncEvent =>
  isObject(value) && (value.kind === 'leave' || (isPoint(value) &&
    (POINT_KINDS.has(value.kind as string) || (value.kind === 'scroller' && isPoint(value.at)))));

/** Whether a posted message is the sync agent's, valid or not. Storybook's channel posts strings, never this. */
export const isSyncMessage = (data: unknown): boolean => isObject(data) && data.key === SYNC_KEY;

/** A message from an agent, or null when it isn't one or doesn't hold up. */
export function parseAgentMessage (data: unknown): AgentMessage | null {
  if (!isSyncMessage(data)) return null;
  const message = data as Record<string, unknown>;
  if (!isSize(message.viewport)) return null;
  if (message.type === 'ready') return { type: 'ready', viewport: message.viewport };
  if (message.type !== 'input' || !Array.isArray(message.events) || message.events.length > MAX_EVENTS) return null;
  if (!message.events.every(isSyncEvent)) return null;
  return { type: 'input', viewport: message.viewport, events: message.events };
}

/**
 * A point in one frame's viewport, in the other's: the same pixels when the two are the same size (as the two panes
 * are), proportionally otherwise.
 */
export function mapPoint (point: Point, from: Size, to: Size): Point {
  if (Math.abs(from.width - to.width) < 0.5 && Math.abs(from.height - to.height) < 0.5) {
    return { x: point.x, y: point.y };
  }
  return { x: point.x * to.width / from.width, y: point.y * to.height / from.height };
}

/** An element's border-box position and border widths (clientLeft/clientTop), plus its padding. */
export interface Box {
  left: number;
  top: number;
  clientLeft: number;
  clientTop: number;
  paddingLeft: number;
  paddingTop: number;
}

export function boxOf (element: Element): Box {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    left: rect.left,
    top: rect.top,
    clientLeft: element.clientLeft,
    clientTop: element.clientTop,
    paddingLeft: parseFloat(style.paddingLeft) || 0,
    paddingTop: parseFloat(style.paddingTop) || 0,
  };
}

/**
 * Where a frame's viewport starts inside the element the cursor is positioned in: the frame's content box, less the
 * container's border, since an absolutely positioned child is placed from its container's padding edge.
 */
export const frameOffset = (frame: Box, container: Box): Point => ({
  x: frame.left + frame.clientLeft + frame.paddingLeft - (container.left + container.clientLeft),
  y: frame.top + frame.clientTop + frame.paddingTop - (container.top + container.clientTop),
});

export interface SyncRelay {
  /** Says hello to both frames. */
  start: () => void;
  /** Says goodbye to both frames, which go inert again. */
  stop: () => void;
  /**
   * Says hello to one frame again, when it's sure to hear it (its story rendered). Also to a frame that answered: a
   * new document's story can render before the frame's load event says it's new.
   */
  connect: (side: Side) => void;
  /** A frame loaded a new document (an args change reloads both), whose agent hasn't answered yet. */
  frameLoaded: (side: Side) => void;
  /** Says hello again to the frames that haven't answered, and marks those that took too long. */
  tick: () => void;
  /** Handles a message from a frame. False when it isn't the agent's, so the caller handles it. */
  receive: (side: Side, data: unknown) => boolean;
  getStatus: () => RelayStatus;
  /** The cursor, for useSyncExternalStore: it changes on every move, so it's kept out of React state. */
  getCursor: () => CursorState | null;
  subscribeCursor: (listener: () => void) => () => void;
  /** The latest replayed scroll, for the cue. */
  getCue: () => CueState | null;
  subscribeCue: (listener: () => void) => () => void;
}

interface RelayOptions {
  post: (to: Side, message: HostMessage) => void;
  onStatus: (status: RelayStatus) => void;
  now?: () => number;
}

export function createSyncRelay ({ post, onStatus, now = () => Date.now() }: RelayOptions): SyncRelay {
  let enabled = false;
  let status = IDLE_STATUS;
  let cursor: CursorState | null = null;
  let cue: CueState | null = null;
  let clicks = 0;
  let scrolls = 0;
  // The last offset seen per scroller, found by where it is, to tell which way it went.
  const offsets = new Map<string, number>();
  const since: Record<Side, number> = { vue: 0, react: 0 };
  const viewports: Partial<Record<Side, Size>> = {};
  const cursorListeners = new Set<() => void>();
  const cueListeners = new Set<() => void>();

  const setStatus = (next: Partial<RelayStatus>) => {
    const merged = { ...status, ...next };
    if (merged.source === status.source && SIDES.every(side => merged.frames[side] === status.frames[side])) return;
    status = merged;
    onStatus(status);
  };
  const setHandshake = (side: Side, handshake: Handshake) =>
    setStatus({ frames: { ...status.frames, [side]: handshake } });
  const setCursor = (next: CursorState | null) => {
    if (next === cursor) return;
    cursor = next;
    cursorListeners.forEach(listener => listener());
  };
  const setCue = (next: CueState | null) => {
    cue = next;
    cueListeners.forEach(listener => listener());
  };
  const isReady = (side: Side) => status.frames[side] === 'ready';

  const hello = (side: Side) => post(side, { key: SYNC_KEY, type: 'connect' });

  const restart = (side: Side) => {
    since[side] = now();
    setHandshake(side, 'connecting');
    if (cursor && (cursor.over === side || cursor.mirrors === side)) setCursor(null);
    if (cue) setCue(null);
    hello(side);
  };

  // Pointer events move the cursor, make their frame the source and replay in the other frame, mapped.
  const relayInput = (side: Side, events: SyncEvent[]) => {
    const target = otherSide(side);
    const from = viewports[side] as Size;
    const to = viewports[target] ?? from;
    const replay: SyncEvent[] = [];
    let next = cursor;
    let source = status.source;
    const scrolled: CueState[] = [];
    // Which way a scroll went, from the last offset seen at the same place (a scroller is told apart by its point,
    // rounded to a 40px cell).
    const showScroll = (key: string, y: number) => {
      const before = offsets.get(key);
      offsets.set(key, y);
      scrolled.push({
        over: target,
        mirrors: side,
        seq: ++scrolls,
        direction: before === undefined || before === y ? null : y > before ? 'down' : 'up',
      });
    };
    for (const event of events) {
      if (event.kind === 'scroll') {
        // Pixels, as they are: the other page clamps them.
        replay.push(event);
        showScroll('page', event.y);
      } else if (event.kind === 'scroller') {
        // Pixels as they are, and the locating point mapped into the other frame.
        replay.push({ ...event, at: mapPoint(event.at, from, to) });
        showScroll(`${side}:${Math.round(event.at.x / 40)},${Math.round(event.at.y / 40)}`, event.y);
      } else if (event.kind === 'leave') {
        if (next?.mirrors === side) next = null;
        replay.push(event);
      } else {
        source = side;
        const point = mapPoint(event, from, to);
        const pressed = event.kind === 'down' || (event.kind === 'move' && next?.mirrors === side && next.pressed);
        next = { over: target, mirrors: side, ...point, pressed };
        if (event.kind === 'click') next.click = ++clicks;
        replay.push({ kind: event.kind, ...point });
      }
    }
    if (replay.length) post(target, { key: SYNC_KEY, type: 'replay', events: replay });
    setCursor(next);
    if (scrolled.length) setCue(scrolled[scrolled.length - 1]);
    setStatus({ source });
  };

  return {
    start () {
      enabled = true;
      SIDES.forEach(restart);
    },
    stop () {
      if (!enabled) return;
      enabled = false;
      SIDES.forEach(side => post(side, { key: SYNC_KEY, type: 'disconnect' }));
      setCursor(null);
      setCue(null);
      offsets.clear();
      status = IDLE_STATUS;
      onStatus(status);
    },
    connect (side) {
      if (enabled) hello(side);
    },
    frameLoaded (side) {
      if (enabled) restart(side);
    },
    tick () {
      if (!enabled) return;
      for (const side of SIDES) {
        if (isReady(side)) continue;
        hello(side);
        if (now() - since[side] >= HANDSHAKE_TIMEOUT) setHandshake(side, 'silent');
      }
    },
    receive (side, data) {
      if (!isSyncMessage(data)) return false;
      const message = parseAgentMessage(data);
      if (!enabled || !message) return true;
      viewports[side] = message.viewport;
      setHandshake(side, 'ready');
      // Nothing to mirror into a frame that hasn't answered.
      if (message.type === 'input' && isReady(otherSide(side))) relayInput(side, message.events);
      return true;
    },
    getStatus: () => status,
    getCursor: () => cursor,
    subscribeCursor (listener) {
      cursorListeners.add(listener);
      return () => cursorListeners.delete(listener);
    },
    getCue: () => cue,
    subscribeCue (listener) {
      cueListeners.add(listener);
      return () => cueListeners.delete(listener);
    },
  };
}

/** What the chip in the pane header says. */
export interface SyncChip {
  tone: 'on' | 'waiting' | 'off';
  text: string;
  /** More detail, on hover. */
  title: string;
}

/** React's side of the comparison, as CompareFrame tracks it. */
export type ReactStatus = 'checking' | 'ported' | 'missing' | 'unreachable';

const listSides = (sides: Side[]) => sides.map(side => LABELS[side]).join(' and ');

/** The chip for the sync setting: why it's off, whether it's waiting, or which way it mirrors. */
export function syncChip (reactStatus: ReactStatus, status: RelayStatus): SyncChip {
  if (reactStatus === 'checking') {
    return { tone: 'waiting', text: 'Sync: checking React', title: 'Sync starts once React\'s Storybook has this story.' };
  }
  if (reactStatus !== 'ported') {
    const reason = reactStatus === 'missing' ? 'React has no story' : 'React isn\'t running';
    return { tone: 'off', text: `Sync off: ${reason}`, title: 'Sync needs the story on both sides.' };
  }
  const silent = SIDES.filter(side => status.frames[side] === 'silent');
  if (silent.length) {
    return {
      tone: 'off',
      text: `Sync off: ${listSides(silent)} didn't answer`,
      title: 'The preview didn\'t answer the sync handshake. A Storybook built before sync mode has no sync agent ' +
        '(dialtone-vue/.storybook/compare-sync-agent.js); a story that failed to render may not either.',
    };
  }
  const connecting = SIDES.filter(side => status.frames[side] === 'connecting');
  if (connecting.length) {
    return { tone: 'waiting', text: 'Sync: connecting', title: `Waiting for ${listSides(connecting)} to answer.` };
  }
  if (!status.source) {
    return { tone: 'on', text: 'Sync on', title: 'Point at either frame to mirror it in the other.' };
  }
  const from = LABELS[status.source];
  const to = LABELS[otherSide(status.source)];
  return {
    tone: 'on',
    text: `Mirroring ${from} → ${to}`,
    title: `The pointer, drags, clicks and scrolling in ${from} are replayed in ${to}.`,
  };
}
