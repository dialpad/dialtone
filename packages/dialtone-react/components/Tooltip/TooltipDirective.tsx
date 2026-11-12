import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import deepEqual from 'deep-equal';
import type { ContentMode } from '../../common/mode_constants';
import { DtTooltip, type DtTooltipProps } from './Tooltip';
import type { TooltipDirection } from './TooltipConstants';

const DEFAULT_PLACEMENT: TooltipDirection = 'top';

// The store is module-wide, so its ids must be unique across React roots. `useId()` isn't: two roots without distinct
// `identifierPrefix` values can produce the same id.
let nextTooltipId = 0;

/** DtTooltip's props, as the directive's object value takes them: the anchor is the element the hook is given. */
export type DtTooltipDirectiveProps = Omit<DtTooltipProps, 'ref' | 'anchor' | 'children' | 'externalAnchorElement'>;

/** What `v-dt-tooltip` takes: a message, or DtTooltip's props. `null` and `undefined` remove the tooltip. */
export type DtTooltipDirectiveValue = string | DtTooltipDirectiveProps | null | undefined;

/** The directive's arg and modifiers. */
export interface DtTooltipDirectiveOptions {
  /** The directive's arg, the placement in `v-dt-tooltip:top-end`. An object value's own `placement` wins over it. */
  arg?: TooltipDirection;
  /** A placement modifier, as in `v-dt-tooltip.top-end`. Wins over the arg and over an object value's `placement`. */
  placement?: TooltipDirection;
  /** The `inverted` modifier. */
  inverted?: boolean;
  /** The `no-delay` modifier. */
  noDelay?: boolean;
  /** The `no-transition` modifier. */
  noTransition?: boolean;
  /** The `light`, `dark` and `invert` modifiers. */
  contentMode?: ContentMode;
}

interface TooltipEntry {
  id: string;
  // Part of the DtTooltip's key, with the id: how many times the last hook left the element (see `release`).
  mount: number;
  anchorElement: HTMLElement;
  props: DtTooltipDirectiveProps;
}

// Vue keeps the directive's tooltips in one app, mounted once in a div appended to document.body. This is that app: an
// external store the host component reads, rendered by a root created the first time a tooltip is added.
let tooltips: TooltipEntry[] = [];
const listeners = new Set<() => void>();
let hostMounted = false;

function emit () {
  tooltips = [...tooltips];
  listeners.forEach(listener => listener());
}

function subscribe (listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

const getTooltips = () => tooltips;

function TooltipDirectiveHost () {
  const entries = useSyncExternalStore(subscribe, getTooltips, getTooltips);
  return (
    <div>
      {entries.map(({ id, mount, anchorElement, props }) => (
        <DtTooltip
          key={`${id}:${mount}`}
          {...props}
          sticky={props.sticky !== undefined ? props.sticky : true}
          delay={props.delay !== undefined ? props.delay : true}
          externalAnchorElement={anchorElement}
        />
      ))}
    </div>
  );
}

function mountHost () {
  if (hostMounted) return;
  hostMounted = true;
  const mountPoint = document.createElement('div');
  document.body.appendChild(mountPoint);
  createRoot(mountPoint).render(<TooltipDirectiveHost />);
}

function addOrUpdateTooltip (entry: TooltipEntry) {
  mountHost();
  const index = tooltips.findIndex(tooltip => tooltip.id === entry.id);
  if (index !== -1) tooltips[index] = entry;
  else tooltips.push(entry);
  emit();
}

function removeTooltip (id: string) {
  if (!tooltips.some(tooltip => tooltip.id === id)) return;
  tooltips = tooltips.filter(tooltip => tooltip.id !== id);
  emit();
}

const REJECTED = Symbol('rejected');

/**
 * The directive's setupTooltip, up to the store: DtTooltip's props, `null` for a nullish value, or REJECTED, with an
 * error logged, for a value that is neither a string nor an object.
 */
function resolveProps (value: DtTooltipDirectiveValue, options: DtTooltipDirectiveOptions) {
  if (value === null || value === undefined) return null;

  let props: DtTooltipDirectiveProps;
  if (typeof value === 'string') {
    props = { message: value, placement: options.arg ?? DEFAULT_PLACEMENT };
  } else if (typeof value === 'object') {
    // As in Vue, the value is spread last, so its own `placement` wins over the arg.
    props = { placement: options.arg ?? value.placement ?? DEFAULT_PLACEMENT, ...value };
  } else {
    console.error('DtTooltipDirective: binding value must be string, object, null or undefined');
    return REJECTED;
  }

  if (options.placement) props.placement = options.placement;
  if (options.inverted) props.inverted = true;
  if (options.noDelay) props.delay = false;
  if (options.noTransition) props.transition = false;
  if (options.contentMode) props.contentMode = options.contentMode;
  return props;
}

// An object value is copied with its array props (`offset`, `fallbackPlacements`), so a caller who mutates one in
// place and rerenders still compares as changed and the tooltip receives a new array.
function snapshotValue (value: DtTooltipDirectiveValue): DtTooltipDirectiveValue {
  if (value === null || typeof value !== 'object') return value;
  const copy: Record<string, unknown> = { ...value };
  for (const key in copy) {
    const item = copy[key];
    if (Array.isArray(item)) copy[key] = [...item];
  }
  return copy as DtTooltipDirectiveProps;
}

// The directive's setupTooltip, from the store on. As in Vue, the tooltip's id is the element's `data-dt-tooltip-id`,
// given once and kept: directives on one element share its tooltip, and a nullish value removes the tooltip but leaves
// the id.
function setupTooltip (anchor: HTMLElement, props: DtTooltipDirectiveProps | null) {
  const existing = anchor.getAttribute('data-dt-tooltip-id');
  if (!props) {
    if (existing) removeTooltip(existing);
    return;
  }
  const id = existing || `dt-tooltip-${++nextTooltipId}`;
  anchor.setAttribute('data-dt-tooltip-id', id);
  addOrUpdateTooltip({ id, mount: mounts.get(anchor) ?? 0, anchorElement: anchor, props });
}

// The hooks on each element, with the props each one set there, in the order they set them. Vue's directives on one
// element unmount together, but a hook can leave on its own, so the element keeps the tooltip of the hooks still on it.
const holders = new WeakMap<HTMLElement, Map<symbol, DtTooltipDirectiveProps | null>>();

// How many times the last hook left each element. The host keys a DtTooltip by it, so a hook that arrives in the same
// commit as the last one leaves gets a new tooltip, closed: the host may only see the store after both.
const mounts = new WeakMap<HTMLElement, number>();

function hold (anchor: HTMLElement, holder: symbol, props: DtTooltipDirectiveProps | null) {
  let held = holders.get(anchor);
  if (!held) holders.set(anchor, (held = new Map()));
  // Deleted and set again, so the map's order stays the order the values were set in.
  held.delete(holder);
  held.set(holder, props);
  setupTooltip(anchor, props);
}

// A hook leaves the element. If it was the last one there, this is Vue's `unmounted`: the tooltip goes, and the id
// stays. Otherwise the element shows the value set last by a hook still on it.
function release (anchor: HTMLElement, holder: symbol) {
  const held = holders.get(anchor);
  held?.delete(holder);
  if (held?.size) {
    setupTooltip(anchor, Array.from(held.values()).pop() ?? null);
    return;
  }
  holders.delete(anchor);
  mounts.set(anchor, (mounts.get(anchor) ?? 0) + 1);
  const id = anchor.getAttribute('data-dt-tooltip-id');
  if (id) removeTooltip(id);
}

/**
 * dialtone-vue's `v-dt-tooltip` directive, as a hook that takes the anchor element. Keep the element in state with a
 * callback ref, so the hook sees every element the ref lands on, whoever renders it:
 *
 * ```tsx
 * const [anchor, setAnchor] = useState<HTMLElement | null>(null);
 * useTooltipDirective(anchor, 'Message');
 * return <button ref={setAnchor}>…</button>;
 * ```
 *
 * The anchor stays where it is, with no wrapper, and gets a `data-dt-tooltip-id` that it keeps. As in Vue, directives
 * on one element share its tooltip, and the last value set wins. The tooltip renders in a container appended to
 * `document.body`, as a DtTooltip with `externalAnchorElement`. A string value is the tooltip's message; an object is
 * DtTooltip's props; `null` or `undefined` removes the tooltip. Any other value logs an error and leaves the tooltip as
 * it was.
 *
 * A new element is a new mount, as in Vue: it starts with its own tooltip, closed. The element the hook leaves (for
 * another, for `null`, or as the hook unmounts) loses its tooltip, as on Vue's `unmounted`, unless another hook is still
 * on it. Then it shows the value set last by the hooks still there.
 *
 * `v-dt-tooltip:top-end.no-delay="'Message'"` is `useTooltipDirective(anchor, 'Message', { arg: 'top-end', noDelay:
 * true })`. A placement modifier, as in `v-dt-tooltip.top-end`, is `{ placement: 'top-end' }`.
 * @see https://dialtone.dialpad.com/directives/tooltip.html
 */
export function useTooltipDirective (
  anchor: HTMLElement | null | undefined,
  value: DtTooltipDirectiveValue,
  options: DtTooltipDirectiveOptions = {},
) {
  // This hook, among the hooks on its element.
  const [holder] = useState(() => Symbol('useTooltipDirective'));
  // The element the hook set up last, with the value and options it used. The tooltip's id lives on the element.
  const applied = useRef<{
    anchor: HTMLElement;
    value: DtTooltipDirectiveValue;
    options: DtTooltipDirectiveOptions;
  } | null>(null);

  // Runs after every render, since the value is compared by content, not identity. A new anchor comes with a render:
  // it's the caller's state.
  useEffect(() => {
    if (applied.current && applied.current.anchor !== anchor) {
      // Released first, so an open tooltip doesn't carry over to the next element.
      release(applied.current.anchor, holder);
      applied.current = null;
    }
    if (!anchor) return;
    // Vue's `updated` sets up the tooltip again only when the value changed (deep-equal); here that includes the options.
    const last = applied.current;
    if (last && deepEqual(last.value, value) && deepEqual(last.options, options)) return;
    const snapshot = snapshotValue(value);
    applied.current = { anchor, value: snapshot, options: { ...options } };
    const props = resolveProps(snapshot, options);
    // As in Vue, a rejected value leaves the tooltip as it was.
    if (props !== REJECTED) hold(anchor, holder, props);
  });

  useEffect(() => () => {
    if (applied.current) release(applied.current.anchor, holder);
    applied.current = null;
  }, [holder]);
}
