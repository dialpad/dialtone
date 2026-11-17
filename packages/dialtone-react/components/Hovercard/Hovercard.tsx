import {
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react';
import type { Placement } from 'tippy.js';
import type { ClassValue } from '../../common/cx';
import type { ModeProps } from '../../common/mode';
import type { SlotProp } from '../../common/slots';
import {
  DtPopover,
  type DtPopoverAnchorAttrs,
  type DtPopoverProps,
  type PopoverAppendTo,
  type PopoverPadding,
} from '../Popover';
import { TOOLTIP_DELAY_MS, type TooltipDirection } from '../Tooltip';

const DEFAULT_FALLBACK_PLACEMENTS: Placement[] = ['auto'];
const DEFAULT_OFFSET: [number, number] = [0, 16];

/** What `ref` gives: Vue's `defineExpose({ show, hide })`. */
export interface DtHovercardHandle {
  /** Shows the hovercard after the enter delay, as hovering the anchor does. */
  show: () => void;
  /** Hides the hovercard after the leave delay, as leaving the anchor does. */
  hide: () => void;
}

// The attributes Vue lets fall through to DtPopover's root, minus what the hovercard sets itself.
type PopoverAttributes = Omit<DtPopoverProps,
  | 'ref' | 'open' | 'defaultOpen' | 'transition' | 'placement' | 'padding' | 'offset' | 'id' | 'appendTo'
  | 'fallbackPlacements' | 'contentClass' | 'dialogClass' | 'headerClass' | 'footerClass' | 'anchorClass'
  | 'externalAnchorElement' | 'anchor' | 'content' | 'headerContent' | 'footerContent' | 'onOpened'
  | 'onOpenChange' | 'onMouseenterPopover' | 'onMouseleavePopover' | 'onMouseenterPopoverAnchor'
  | 'onMouseleavePopoverAnchor' | keyof ModeProps
  // Props DtPopover has, which the hovercard fixes: it is never modal and doesn't take focus when it opens.
  | 'modal' | 'focustrap' | 'initialFocusElement'>;

export interface DtHovercardProps extends ModeProps, PopoverAttributes {
  /** The hovercard's component instance: `show()` and `hide()`. */
  ref?: Ref<DtHovercardHandle>;

  /** Fade transition when the content display is toggled. */
  transition?: boolean;

  /**
   * Controls whether the hovercard is shown. Leaving this null will have the hovercard trigger on hover by default.
   * If you set this value, the default trigger behavior will be disabled, and you can control it as you need.
   */
  open?: boolean | null;

  /**
   * If the popover does not fit in the direction described by "placement", it will attempt to change its direction to
   * the "fallbackPlacements". See https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements
   */
  fallbackPlacements?: Placement[];

  /** The direction the popover displays relative to the anchor. See https://atomiks.github.io/tippyjs/v6/all-props/#placement */
  placement?: TooltipDirection;

  /** Padding size class for the popover content. */
  padding?: PopoverPadding;

  /**
   * Displaces the content box from its anchor element by the specified number of pixels.
   * See https://atomiks.github.io/tippyjs/v6/all-props/#offset
   */
  offset?: [number, number];

  /** The id of the hovercard. Generated when unset. */
  id?: string;

  /** Additional class name for the anchor wrapper element. */
  anchorClass?: ClassValue;

  /** Additional class name for the header content wrapper element. */
  headerClass?: ClassValue;

  /** Additional class name for the footer content wrapper element. */
  footerClass?: ClassValue;

  /** Additional class name for the dialog element. */
  dialogClass?: ClassValue;

  /** Additional class name for the content wrapper element. */
  contentClass?: ClassValue;

  /**
   * Sets the element to which the popover is going to append to. 'body' will append to the nearest body (supports
   * shadow DOM).
   */
  appendTo?: PopoverAppendTo | HTMLElement;

  /** The enter delay in milliseconds before the hovercard is shown. */
  enterDelay?: number;

  /** The leave delay in milliseconds before the hovercard is hidden. */
  leaveDelay?: number;

  /**
   * External anchor element reference. Use this instead of the anchor slot when the anchor may be inside a Shadow DOM,
   * as querySelector cannot pierce shadow boundaries.
   */
  externalAnchorElement?: HTMLElement | null;

  /** Anchor element that activates the hovercard. Usually a button: bind the attributes it gets on it. */
  anchor?: SlotProp<DtPopoverAnchorAttrs>;

  /** The content that is displayed in the hovercard. */
  content?: ReactNode;

  /** Hovercard header content. */
  headerContent?: ReactNode;

  /** The footer content. */
  footerContent?: ReactNode;

  /** Called when the hovercard is shown or hidden. */
  onOpened?: (opened: boolean) => void;
}

/**
 * A Hovercard displays a content overlay when its anchor element is hovered.
 * @see https://dialtone.dialpad.com/components/hovercard.html
 */
export function DtHovercard ({
  ref,
  contentMode = null,
  transition = false,
  open = null,
  fallbackPlacements = DEFAULT_FALLBACK_PLACEMENTS,
  placement = 'top-start',
  padding = 'large',
  offset = DEFAULT_OFFSET,
  id,
  anchorClass = '',
  headerClass = '',
  footerClass = '',
  dialogClass = '',
  contentClass = '',
  appendTo = 'body',
  enterDelay = TOOLTIP_DELAY_MS,
  leaveDelay = TOOLTIP_DELAY_MS,
  externalAnchorElement = null,
  anchor,
  content,
  headerContent,
  footerContent,
  onOpened,
  ...rest
}: DtHovercardProps) {
  const generatedId = useId();
  const hovercardId = id ?? generatedId;

  // Vue's hovercardOpen: `open` is synced into it whenever it changes (an immediate watcher), and the timers and the
  // anchor's removal change it too.
  const [hovercardOpen, setHovercardOpen] = useState<boolean | null>(open);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    setHovercardOpen(open);
  }

  const popoverRef = useRef<HTMLDivElement>(null);
  const contentFocused = useRef(false);
  const mouseOverHovercard = useRef(false);
  const inTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const outTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Vue's mounted hook: once the popover has rendered, watch for its anchor leaving the document.
  const closeWithoutAnchor = useEffectEvent(() => {
    clearTimeout(inTimer.current);
    clearTimeout(outTimer.current);
    setHovercardOpen(false);
  });
  // The anchor in use now: the supplied external element, else the popover's anchor wrapper (its root holds its
  // container, whose first child is that wrapper). Resolved each time, as React may replace the element.
  const currentAnchor = useEffectEvent(() => (
    externalAnchorElement ?? popoverRef.current?.firstElementChild?.firstElementChild?.firstElementChild ?? null
  ));
  // A pending timer must not open the hovercard against a controlled `open`.
  useEffect(() => {
    if (open !== null) {
      clearTimeout(inTimer.current);
      clearTimeout(outTimer.current);
    }
  }, [open]);
  useEffect(() => {
    let hadAnchor = !!currentAnchor()?.isConnected;
    const observer = new MutationObserver(() => {
      const anchorEl = currentAnchor();
      if (anchorEl?.isConnected) hadAnchor = true;
      else if (hadAnchor) {
        hadAnchor = false;
        closeWithoutAnchor();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      clearTimeout(inTimer.current);
      clearTimeout(outTimer.current);
    };
  }, []);

  function setInTimer () {
    if (open === null) {
      clearTimeout(outTimer.current);
      clearTimeout(inTimer.current);
      inTimer.current = setTimeout(() => setHovercardOpen(true), enterDelay);
    }
  }

  function setOutTimer () {
    if (open === null) {
      clearTimeout(inTimer.current);
      clearTimeout(outTimer.current);
      outTimer.current = setTimeout(() => setHovercardOpen(false), leaveDelay);
    }
  }

  function onMouseEnter () {
    mouseOverHovercard.current = true;
    setInTimer();
  }

  function onMouseLeave () {
    mouseOverHovercard.current = false;
    if (contentFocused.current) return;
    setOutTimer();
  }

  function onContentFocusIn () {
    contentFocused.current = true;
    setInTimer();
  }

  function onContentFocusOut () {
    contentFocused.current = false;
    // If mouse is not over the hovercard, close it
    if (!mouseOverHovercard.current) setOutTimer();
  }

  // The exposed methods read the props of the latest render, as Vue's do.
  const latest = useRef({ onMouseEnter, onMouseLeave });
  useLayoutEffect(() => {
    latest.current = { onMouseEnter, onMouseLeave };
  });
  useImperativeHandle(ref, () => ({
    show: () => latest.current.onMouseEnter(),
    hide: () => latest.current.onMouseLeave(),
  }), []);

  // `enter-delay` and `leave-delay` aren't DtPopover props: Vue's template passes them anyway, and they land on its root
  // element as attributes.
  const delayAttributes = { 'enter-delay': enterDelay, 'leave-delay': leaveDelay };

  return (
    <DtPopover
      data-qa="dt-hovercard"
      {...delayAttributes}
      {...rest}
      ref={popoverRef}
      id={hovercardId}
      open={hovercardOpen}
      placement={placement}
      contentClass={contentClass}
      contentMode={contentMode}
      dialogClass={dialogClass}
      fallbackPlacements={fallbackPlacements}
      padding={padding}
      transition={transition ? 'fade' : ''}
      offset={offset}
      modal={false}
      focustrap={!!hovercardOpen}
      initialFocusElement="none"
      headerClass={headerClass}
      footerClass={footerClass}
      appendTo={appendTo}
      anchorClass={anchorClass}
      externalAnchorElement={externalAnchorElement}
      onOpenChange={setHovercardOpen}
      onOpened={opened => onOpened?.(opened)}
      onMouseenterPopover={onMouseEnter}
      onMouseleavePopover={onMouseLeave}
      onMouseenterPopoverAnchor={onMouseEnter}
      onMouseleavePopoverAnchor={onMouseLeave}
      anchor={({ attrs }) => (typeof anchor === 'function' ? anchor(attrs) : anchor)}
      content={(
        <div onFocus={onContentFocusIn} onBlur={onContentFocusOut}>
          {content}
        </div>
      )}
      headerContent={headerContent}
      footerContent={footerContent}
    />
  );
}
