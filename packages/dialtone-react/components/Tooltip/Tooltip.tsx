import {
  Children,
  isValidElement,
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import type { Instance, Placement, Props as TippyProps, ReferenceElement } from 'tippy.js';
import { cx, type ClassValue } from '../../common/cx';
import { useMode } from '../../common/mode';
import type { ContentMode } from '../../common/mode_constants';
import { hasContent } from '../../common/slots';
import type { PopoverAppendTo } from '../Popover/PopoverConstants';
import { createTippy, getAnchor, getPopperOptions } from '../Popover/TippyUtils';
import { TOOLTIP_DELAY_MS, TOOLTIP_KIND_MODIFIERS, type TooltipDirection, type TooltipSticky } from './TooltipConstants';

const TOOLTIP_ARROW_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="7"><path d="M 14.5,7 8,0 1.5,7 Z"/></svg>';

const OPEN_MODAL_SELECTOR = '.d-modal[aria-hidden="false"], .d-modal--transparent[aria-hidden="false"], .d-modal[open], .d-modal--transparent[open]';

const DEFAULT_OFFSET: [number, number] = [0, 12];
const DEFAULT_FALLBACK_PLACEMENTS: Placement[] = ['auto'];

/** Popover's appendTo values except 'root': Vue's Tooltip hands 'root' to tippy as is, and tippy throws when it mounts. */
export type TooltipAppendTo = Exclude<PopoverAppendTo, 'root'> | HTMLElement;

export interface DtTooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'children'> {
  /** The tooltip's root element. */
  ref?: Ref<HTMLDivElement>;

  /** The id of the tooltip. Generated when unset. */
  id?: string;

  /**
   * If the tooltip does not fit in the direction described by "placement", it will attempt to change its direction to
   * the "fallbackPlacements" if defined, otherwise it will automatically position to a new location as it sees best fit.
   * See https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements
   */
  fallbackPlacements?: Placement[];

  /** @deprecated Use contentMode="invert" */
  inverted?: boolean;

  /**
   * Displaces the tooltip from its reference element by the specified number of pixels.
   * See https://atomiks.github.io/tippyjs/v6/all-props/#offset
   */
  offset?: [number, number];

  /** Whether to show the arrow between the tooltip and its anchor. */
  showArrow?: boolean;

  /** The direction the tooltip displays relative to the anchor. See https://atomiks.github.io/tippyjs/v6/all-props/#placement */
  placement?: TooltipDirection;

  /**
   * If the tooltip sticks to the anchor. This is usually not needed, but can be needed if the reference element's
   * position is animating, or to automatically update the tooltip position in those cases the DOM layout changes the
   * reference element's position. `true` enables it, `reference` only checks the "reference" rect for changes and
   * `popper` only checks the "popper" rect for changes. See https://atomiks.github.io/tippyjs/v6/all-props/#sticky
   */
  sticky?: TooltipSticky;

  /**
   * Sets the element to which the tooltip is going to append to. 'body' appends to the nearest ancestor <dialog>
   * element when inside one (keeping the tooltip in the browser's top layer), or to the nearest body otherwise.
   * To always append to body regardless of dialog context, pass document.body as an HTMLElement.
   * Read when tippy is updated, so changes apply the next time the tooltip shows.
   */
  appendTo?: TooltipAppendTo;

  /** Additional class names for the tooltip content element. */
  contentClass?: ClassValue;

  /** Additional class names for the anchor wrapper element. */
  anchorClass?: ClassValue;

  /** A provided message for the tooltip content, used when there are no children. */
  message?: string;

  /**
   * Controls whether hover/focus causes the tooltip to appear. Cannot be combined with the open prop: open is ignored
   * while this is false. If you set it to false, the tooltip will never show up.
   */
  enabled?: boolean;

  /**
   * Controls whether the tooltip is shown. Leaving this null (or unset) has the tooltip trigger on hover and focus.
   * If you set it, the hover and focus behaviour is disabled and you control the tooltip.
   */
  open?: boolean | null;

  /** Whether the tooltip starts shown when `open` isn't set. Hover and focus take it from there. */
  defaultOpen?: boolean;

  /** Whether the tooltip should have a transition effect (fade). */
  transition?: boolean;

  /** Whether the tooltip will have a delay when being focused or moused over. */
  delay?: boolean;

  /** Set a custom theme on the tooltip. See https://atomiks.github.io/tippyjs/v6/themes/ */
  theme?: string | null;

  /**
   * External anchor element, for when the anchor can't be passed as `anchor`: for instance, a combobox's input.
   * The tooltip then renders no anchor wrapper, and follows this element's focus, hover and Escape key instead.
   */
  externalAnchorElement?: HTMLElement | null;

  /**
   * Applies a color mode to the tooltip content. `light` and `dark` are explicit overrides; `invert` is the opposite of
   * the anchor's nearest ancestor mode, and stays reactive.
   */
  contentMode?: ContentMode | null;

  /** The anchor element. Text is wrapped in a <span>, since tippy needs an element to attach to. */
  anchor?: ReactNode;

  /** The tooltip content. Defaults to `message`. */
  children?: ReactNode;

  /** Called when the tooltip is shown (true) or hidden (false). With a transition, once the transition has finished. */
  onShown?: (shown: boolean) => void;

  /** Called alongside onShown while `open` is set (controlled), with the same value: Vue's update:open. */
  onOpenChange?: (open: boolean) => void;
}

const isParentNode = (node: Node): node is Node & ParentNode => 'querySelector' in node;

function setOrRemoveAttribute (element: Element, name: string, value: string | undefined) {
  if (value === undefined) element.removeAttribute(name);
  else element.setAttribute(name, value);
}

/** An enter waiting out the delay. Each enter gets its own, so a leave and a new enter restart the timer. */
interface PendingDelay {
  /** What triggered it: focusin or mouseenter. */
  type: string;
}

/** Vue's internalShow and inTimer. */
interface TriggerState {
  /** Whether hover and focus have the tooltip shown. Used while `open` isn't set. */
  show: boolean;
  /** The enter that started the delay, from then until the next leave. */
  pendingDelay: PendingDelay | null;
}

/**
 * A tooltip is a floating label that briefly explains an action, function, or an element.
 * Its content is exclusively text and shouldn't be vital information for users.
 * If richer media is desired, consider using a popover instead.
 * @see https://dialtone.dialpad.com/components/tooltip.html
 */
export function DtTooltip ({
  ref,
  id,
  fallbackPlacements = DEFAULT_FALLBACK_PLACEMENTS,
  inverted = false,
  offset = DEFAULT_OFFSET,
  showArrow = true,
  placement = 'top',
  sticky = true,
  appendTo = 'body',
  contentClass,
  anchorClass,
  message = '',
  enabled = true,
  open = null,
  defaultOpen = false,
  transition = true,
  delay = true,
  theme = null,
  externalAnchorElement = null,
  contentMode = null,
  anchor,
  children,
  onShown,
  onOpenChange,
  ...rest
}: DtTooltipProps) {
  const generatedId = useId();
  const tooltipId = id ?? generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorWrapperRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<Instance | null>(null);
  // What tippy was last given, so the effects below only pass on changes (Vue's watchers don't run on mount).
  const appliedShow = useRef<boolean | null>(null);
  const appliedTippyProps = useRef<string | null>(null);

  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

  // tippy moves its content element into its popper, so React mustn't own that element. This is it: the .d-tooltip
  // element, created once outside React's tree and handed to tippy as `content`. The children are portalled into it and
  // its attributes are set in an effect, so the DOM is Vue's: .tippy-content > .d-tooltip > content, no wrapper.
  const [contentEl] = useState(() => (typeof document === 'undefined' ? null : document.createElement('div')));

  // With `open` set the tooltip is controlled, and hover and focus don't change it; Vue ignores `open` while disabled.
  const isControlled = open !== null;
  // Hover and focus. One state, and every change decided in an update: like Vue's fields, it then sees every enter and
  // leave handled so far, even one not rendered yet. So a timer firing after such a leave can't show the tooltip.
  const [trigger, setTrigger] = useState<TriggerState>(() => ({ show: enabled && defaultOpen, pendingDelay: null }));
  const show = enabled && (isControlled ? open : trigger.show);

  // Everything tippy is given through setProps, compared by value: an array prop mutated in place still reaches tippy on
  // the next render (Vue watches those deeply), and a new array with the same values doesn't call setProps again.
  const tippyPropsKey = JSON.stringify([
    showArrow, offset, delay, placement, sticky, inverted, theme, transition, fallbackPlacements,
  ]);

  // Props are read from the render's scope. tippy's callbacks, the external anchor's listeners and the delay's timer
  // outlive the render that set them up, and some effects read props without reacting to them: those go through Effect
  // Events, which always run with the latest render's props.

  function resolveAnchor (): Element | undefined {
    return externalAnchorElement ?? getAnchor(anchorWrapperRef.current);
  }

  const { 'data-dt-mode': dtMode, 'data-dt-contrast': dtContrast } = useMode(contentMode, resolveAnchor, externalAnchorElement);

  function resolveAppendTo (): TippyProps['appendTo'] | undefined {
    if (appendTo !== 'body') return appendTo;
    // When inside a native <dialog>, append there to stay in the browser's top layer.
    const anchorEl = resolveAnchor();
    const dialog = anchorEl?.closest('dialog');
    if (dialog) return dialog;
    // Otherwise the anchor's own body. Where it has none, tippy's default (document.body); Vue hands tippy null there.
    const root = anchorEl?.getRootNode();
    return (root && isParentNode(root) && root.querySelector('body')) || undefined;
  }

  function calculateAnchorZindex (): number {
    // If a modal is currently active render at modal-element z-index, otherwise at tooltip z-index. Drawers have no
    // Dialtone component yet: render at 651 too when the tooltip is within one.
    const container = containerRef.current;
    const root = container?.getRootNode();
    if ((root && isParentNode(root) && root.querySelector(OPEN_MODAL_SELECTOR)) || container?.closest('.d-zi-drawer')) {
      return 651;
    }
    return 400;
  }

  function hasVisibleFocus (): boolean {
    return resolveAnchor()?.matches(':focus-visible') ?? false;
  }

  // Vue's triggerShow, as a check.
  function canTriggerShow (type: string): boolean {
    if (isControlled || !enabled) return false;
    // Only show on visible focus when triggered by focus. A mouse user only wants tooltips on hover: closing a popover
    // with the mouse focuses its anchor, and that shouldn't show the anchor's tooltip.
    return type !== 'focusin' || hasVisibleFocus();
  }

  function onEnterAnchor (type: string) {
    if (!enabled) return;
    const canShow = canTriggerShow(type);
    const enter: PendingDelay = { type };
    // As in Vue: with `delay`, the first enter starts it, and any other enter until the next leave shows the tooltip at
    // once. Without `delay`, every enter does.
    setTrigger((current) => {
      if (delay && !current.pendingDelay) return { ...current, pendingDelay: enter };
      return canShow && !current.show ? { ...current, show: true } : current;
    });
  }

  function onLeaveAnchor (type: string, code?: string) {
    if (type === 'keydown' && code !== 'Escape') return;
    // Clearing the pending delay clears its timer, in the effect's cleanup.
    setTrigger((current) => {
      const nextShow = isControlled && current.show;
      return current.pendingDelay || current.show !== nextShow ? { show: nextShow, pendingDelay: null } : current;
    });
  }

  // tippy's onShow and onShown.
  const onShow = useEffectEvent((callingMethod: 'onShow' | 'onShown'): false | undefined => {
    // Don't show a tooltip without content.
    if (!contentEl?.textContent?.trim()) return false;
    if (transition && callingMethod === 'onShow') return undefined;
    onShown?.(true);
    if (isControlled) onOpenChange?.(true);
    return undefined;
  });

  // tippy's onHidden.
  const onHide = useEffectEvent(() => {
    onShown?.(false);
    if (isControlled) onOpenChange?.(false);
  });

  // Vue's setProps, with its tippyProps inlined. Called when tippy mounts, and by the watchers below.
  const setTippyProps = useEffectEvent(() => {
    const tip = tipRef.current;
    if (!tip) return;
    tip.setProps({
      arrow: showArrow ? TOOLTIP_ARROW_SVG : false,
      offset,
      // Vue passes false and null below; tippy's types want 0 and '', which tippy treats the same way.
      delay: delay ? TOOLTIP_DELAY_MS : 0,
      placement,
      sticky,
      theme: inverted ? 'inverted' : (theme ?? ''),
      animation: transition ? 'fade' : false,
      // onShown only fires with a transition, once it has finished.
      onShown: () => { onShow('onShown'); },
      // onShow always fires, but before the transition completes.
      onShow: () => onShow('onShow'),
      onHidden: onHide,
      popperOptions: getPopperOptions({
        fallbackPlacements,
        hasHideModifierEnabled: true,
      }),
      // Not reactive: resolved whenever tippy is updated.
      appendTo: resolveAppendTo(),
      zIndex: calculateAnchorZindex(),
    });
  });

  const contentClassName = cx('d-tooltip', { [TOOLTIP_KIND_MODIFIERS.inverted]: inverted }, contentClass);

  useLayoutEffect(() => {
    if (!contentEl) return;
    contentEl.id = tooltipId;
    contentEl.className = contentClassName;
    contentEl.setAttribute('data-qa', 'dt-tooltip');
    setOrRemoveAttribute(contentEl, 'data-dt-mode', dtMode);
    setOrRemoveAttribute(contentEl, 'data-dt-contrast', dtContrast);
  }, [contentEl, tooltipId, contentClassName, dtMode, dtContrast]);

  // Vue checks once, when it mounts.
  const warnIfOpenIgnored = useEffectEvent(() => {
    if (!enabled && open !== null) {
      console.warn('Tooltip: You cannot use both the enabled and open props at the same time.');
      console.warn('The open prop will be ignored.');
    }
  });
  useEffect(() => {
    warnIfOpenIgnored();
  }, []);

  // Vue's initOptions: read when the effect below creates the instance, so changing them doesn't create another. The
  // other options arrive through setTippyProps when tippy mounts. arrow is duplicated because tippy renders its default
  // arrow while mounting synchronously for showOnCreate, before onMount runs.
  const createTip = useEffectEvent((anchorEl: Element, content: HTMLElement): Instance => {
    const tip = createTippy(anchorEl, {
      content,
      arrow: showArrow ? TOOLTIP_ARROW_SVG : false,
      // transition duration - same as our custom fade delay in dialtone-globals.less
      duration: 180,
      interactive: false,
      trigger: 'manual',
      hideOnClick: false,
      // disable tooltip from displaying on touch devices
      touch: false,
      onMount: setTippyProps,
      showOnCreate: show,
      appendTo: resolveAppendTo(),
      popperOptions: getPopperOptions({
        hasHideModifierEnabled: true,
      }),
    });
    appliedShow.current = show;
    appliedTippyProps.current = tippyPropsKey;
    return tip;
  });

  // One tippy instance per anchor element, created once the anchor is in the DOM.
  useLayoutEffect(() => {
    const anchorEl = resolveAnchor();
    if (!anchorEl || !contentEl) return undefined;
    const tip = createTip(anchorEl, contentEl);
    tipRef.current = tip;
    return () => {
      tipRef.current = null;
      if ((anchorEl as ReferenceElement)._tippy) tip.destroy();
    };
  }, [externalAnchorElement, contentEl]);

  // Vue's tippyProps watcher.
  useLayoutEffect(() => {
    if (appliedTippyProps.current === tippyPropsKey) return;
    appliedTippyProps.current = tippyPropsKey;
    setTippyProps();
  }, [tippyPropsKey]);

  // Vue's internalShow watcher.
  useLayoutEffect(() => {
    if (appliedShow.current === show) return;
    appliedShow.current = show;
    const tip = tipRef.current;
    if (!tip) return;
    if (show) {
      setTippyProps();
      tip.show();
    } else {
      tip.hide();
    }
  }, [show]);

  // An external anchor isn't rendered here, so it gets native listeners: the same events the anchor wrapper handles, and
  // the same handlers, as Effect Events.
  const onExternalAnchorEnter = useEffectEvent(onEnterAnchor);
  const onExternalAnchorLeave = useEffectEvent(onLeaveAnchor);
  useEffect(() => {
    const anchorEl = externalAnchorElement;
    if (!anchorEl) return undefined;
    const onEnter = (event: Event) => onExternalAnchorEnter(event.type);
    // Not `instanceof KeyboardEvent`: an anchor in another realm (an iframe) has its own KeyboardEvent constructor.
    const onLeave = (event: Event) =>
      onExternalAnchorLeave(event.type, 'code' in event ? (event as KeyboardEvent).code : undefined);
    const enterEvents = ['focusin', 'mouseenter'];
    const leaveEvents = ['focusout', 'mouseleave', 'keydown'];
    enterEvents.forEach(type => anchorEl.addEventListener(type, onEnter));
    leaveEvents.forEach(type => anchorEl.addEventListener(type, onLeave));
    return () => {
      enterEvents.forEach(type => anchorEl.removeEventListener(type, onEnter));
      leaveEvents.forEach(type => anchorEl.removeEventListener(type, onLeave));
    };
  }, [externalAnchorElement]);

  // When the delay ends, the props are read as they are then, as Vue's triggerShow does, not as they were on enter. The
  // tooltip shows only if that enter is still pending: a leave may have been handled and not rendered yet.
  const showAfterDelay = useEffectEvent((delayed: PendingDelay) => {
    if (!canTriggerShow(delayed.type)) return;
    setTrigger(current => (current.pendingDelay === delayed && !current.show ? { ...current, show: true } : current));
  });

  // The delay's timer, for the pending enter. A leave clears that, and so the timer.
  useEffect(() => {
    const delayed = trigger.pendingDelay;
    if (!delayed) return undefined;
    const timer = setTimeout(() => showAfterDelay(delayed), TOOLTIP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [trigger.pendingDelay]);

  // Vue wraps a text-only anchor in a <span> by mutating the DOM, so tippy has an element to attach to. Here the span
  // is rendered: an anchor with no element at its top level gets one.
  const anchorIsText = !Children.toArray(anchor).some(isValidElement);

  return (
    <>
      <div ref={containerRef} data-qa="dt-tooltip-container" {...rest}>
        {!externalAnchorElement && (
          // The handlers catch events from the interactive element inside the span, not from the span itself.
          <span
            ref={anchorWrapperRef}
            className={cx(anchorClass) || undefined}
            data-qa="dt-tooltip-anchor"
            onFocus={() => onEnterAnchor('focusin')}
            onBlur={() => onLeaveAnchor('focusout')}
            onMouseEnter={() => onEnterAnchor('mouseenter')}
            onMouseLeave={() => onLeaveAnchor('mouseleave')}
            onKeyDown={(event) => {
              if (event.key === 'Escape' || event.key === 'Esc') onLeaveAnchor('keydown', event.code);
            }}
          >
            {anchorIsText ? <span>{anchor}</span> : anchor}
          </span>
        )}
      </div>
      {contentEl && createPortal(hasContent(children) ? children : message, contentEl)}
    </>
  );
}
