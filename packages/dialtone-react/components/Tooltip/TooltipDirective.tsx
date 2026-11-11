import { useEffect, useId, useRef, useSyncExternalStore, type RefObject } from 'react';
import { createRoot } from 'react-dom/client';
import deepEqual from 'deep-equal';
import type { ContentMode } from '../../common/mode_constants';
import { DtTooltip, type DtTooltipProps } from './Tooltip';
import type { TooltipDirection } from './TooltipConstants';

const DEFAULT_PLACEMENT: TooltipDirection = 'top';

/** DtTooltip's props, as the directive's object value takes them: the anchor is the element the hook is given. */
export type DtTooltipDirectiveProps = Omit<DtTooltipProps, 'ref' | 'anchor' | 'children' | 'externalAnchorElement'>;

/** What `v-dt-tooltip` takes: a message, or DtTooltip's props. `null` and `undefined` remove the tooltip. */
export type DtTooltipDirectiveValue = string | DtTooltipDirectiveProps | null | undefined;

/** The directive's arg and modifiers. */
export interface DtTooltipDirectiveOptions {
  /** The directive's arg and placement modifier. Wins over `placement` in an object value. */
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
      {entries.map(({ id, anchorElement, props }) => (
        <DtTooltip
          key={id}
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

/** The directive's setupTooltip: the props for DtTooltip, or null for a value that has no tooltip. */
function resolveProps (value: DtTooltipDirectiveValue, options: DtTooltipDirectiveOptions) {
  if (value === null || value === undefined) return null;

  let props: DtTooltipDirectiveProps;
  if (typeof value === 'string') {
    props = { message: value, placement: options.placement ?? DEFAULT_PLACEMENT };
  } else if (typeof value === 'object') {
    props = { ...value, placement: options.placement ?? value.placement ?? DEFAULT_PLACEMENT };
  } else {
    console.error('DtTooltipDirective: binding value must be string, object, null or undefined');
    return null;
  }

  if (options.inverted) props.inverted = true;
  if (options.noDelay) props.delay = false;
  if (options.noTransition) props.transition = false;
  if (options.contentMode) props.contentMode = options.contentMode;
  return props;
}

/**
 * dialtone-vue's `v-dt-tooltip` directive, as a hook that takes the anchor's ref. The anchor stays where it is, with
 * no wrapper, and gets a `data-dt-tooltip-id` that stays the same across updates. The tooltip renders in a container
 * appended to `document.body`, as a DtTooltip with `externalAnchorElement`. A string value is the tooltip's message;
 * an object is DtTooltip's props; `null` or `undefined` removes the tooltip.
 *
 * `v-dt-tooltip:top-end.no-delay="'Message'"` is `useTooltipDirective(ref, 'Message', { placement: 'top-end',
 * noDelay: true })`.
 * @see https://dialtone.dialpad.com/directives/tooltip.html
 */
export function useTooltipDirective (
  ref: RefObject<HTMLElement | null>,
  value: DtTooltipDirectiveValue,
  options: DtTooltipDirectiveOptions = {},
) {
  const id = useId();
  // What was last given to the tooltip store. Vue's `updated` hook sets up the tooltip again only when the value
  // changed (deep-equal); here that includes the options and the anchor element, which the hook reads on every render.
  const applied = useRef<{ anchor: HTMLElement; props: DtTooltipDirectiveProps | null } | null>(null);

  const props = resolveProps(value, options);

  // Runs after every render: the anchor can change without any dependency changing, and the comparison is by value.
  useEffect(() => {
    const anchor = ref.current;
    if (!anchor) return;
    const previous = applied.current;
    if (previous && previous.anchor === anchor && deepEqual(previous.props, props)) return;
    applied.current = { anchor, props };
    if (!props) {
      // As in Vue: the anchor keeps its id, so the next tooltip it gets reuses it.
      removeTooltip(id);
      return;
    }
    anchor.setAttribute('data-dt-tooltip-id', id);
    addOrUpdateTooltip({ id, anchorElement: anchor, props });
  });

  useEffect(() => () => {
    applied.current = null;
    removeTooltip(id);
  }, [id, applied]);
}
