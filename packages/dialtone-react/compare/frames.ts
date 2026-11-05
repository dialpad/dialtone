// URLs and messages for the two framed Storybooks (Vue and React).
import { buildArgsParam } from 'storybook/internal/router';
import ports from './ports.json';

export type Side = 'vue' | 'react';
export type Args = Record<string, unknown>;

export const origin = (side: Side) => `http://localhost:${ports[side]}`;

// Storybook's own URL encoding (the manager's), which drops values it deems
// unsafe: strings other than letters, digits, spaces, `_` and `-`, numbers or
// colours, plus anything not serialisable.
export const argsParam = (initialArgs: Args, args: Args) => buildArgsParam(initialArgs, args);

export const isUrlSafe = (key: string, value: unknown) =>
  value === undefined || buildArgsParam({}, { [key]: value }) !== '';

const globalsParam = (globals: Args) => buildArgsParam({}, {
  theme: globals.theme ?? 'dp',
  contrast: globals.contrast ?? 'default',
});

/** The story alone, as its own Storybook's preview iframe renders it. */
export const iframeUrl = (side: Side, storyId: string, args: string, globals: Args) =>
  `${origin(side)}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story` +
  `&args=${args}&globals=${globalsParam(globals)}`;

/** The same story in that Storybook's full UI. */
export const storybookUrl = (side: Side, storyId: string, args: string, globals: Args) =>
  `${origin(side)}/?path=/story/${encodeURIComponent(storyId)}` +
  `&args=${args}&globals=${globalsParam(globals)}`;

/** What a framed preview posts to its parent, once parsed. */
export interface ChannelEvent {
  type: string;
  args: unknown[];
}

const KEY = 'storybook-channel';

// Storybook encodes messages with telejson, which writes undefined as this
// string. Read it back as an absent property, or as null inside an array (an
// `options` list), which the controls show as "(unset)".
const TELEJSON_UNDEFINED = '_undefined_';

function revive (this: unknown, _key: string, value: unknown) {
  if (value !== TELEJSON_UNDEFINED) return value;
  return Array.isArray(this) ? null : undefined;
}

export function parseChannelMessage (data: unknown): ChannelEvent | null {
  if (typeof data !== 'string' || !data.startsWith('{')) return null;
  try {
    const message = JSON.parse(data, revive);
    return message?.key === KEY ? message.event : null;
  } catch {
    return null;
  }
}

/** Sends an event into a framed preview's channel, as its manager would. */
export function postChannelEvent (target: Window | null | undefined, type: string, args: unknown[]) {
  target?.postMessage(JSON.stringify({ key: KEY, event: { type, args } }), '*');
}

/** A story in a Storybook's index. */
export interface IndexedStory {
  id: string;
  title: string;
  importPath: string;
}

/** The stories in a Storybook's index, by id, or null when it isn't reachable. */
export async function fetchStories (side: Side): Promise<Map<string, IndexedStory> | null> {
  try {
    const response = await fetch(`${origin(side)}/index.json`);
    if (!response.ok) return null;
    const index = await response.json();
    const entries = Object.values(index.entries ?? {}) as (IndexedStory & { type?: string })[];
    return new Map(entries.filter(entry => entry.type === 'story').map(entry => [entry.id, entry]));
  } catch {
    return null;
  }
}
