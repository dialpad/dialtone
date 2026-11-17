import {
  useCallback,
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import type { Instance, Placement, Props as TippyProps } from 'tippy.js';
import { cx, type ClassValue } from '../../common/cx';
import { useFocusTrap } from '../../common/focustrap';
import { useModal } from '../../common/modal';
import { useMode, type ModeProps } from '../../common/mode';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import { DtTransition } from '../../common/transition';
import { SrOnlyCloseButton } from '../Button/sr_only_close_button';
import {
  POPOVER_HEADER_FOOTER_PADDING_CLASSES,
  POPOVER_PADDING_CLASSES,
  type PopoverAppendTo,
  type PopoverBoundary,
  type PopoverContentWidth,
  type PopoverDirection,
  type PopoverInitialFocusString,
  type PopoverPadding,
  type PopoverRole,
  type PopoverSticky,
} from './PopoverConstants';
import { PopoverHeaderFooter, type PopoverHeaderFooterHandle } from './PopoverHeaderFooter';
import { createTippyPopover, getPopperOptions } from './TippyUtils';

const OPEN_MODAL_SELECTOR = '.d-modal[aria-hidden="false"], .d-modal--transparent[aria-hidden="false"], ' +
  '.d-modal[open], .d-modal--transparent[open]';

const DEFAULT_OFFSET: [number, number] = [0, 4];
const DEFAULT_FALLBACK_PLACEMENTS: Placement[] = ['auto'];
const ZERO_RECT = { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0 };

/** What the anchor slot gets to bind on the element that opens the popover. */
export interface DtPopoverAnchorAttrs {
  'aria-expanded': string;
  'aria-controls': string;
  'aria-haspopup': PopoverRole;
}

export interface DtPopoverAnchorScope {
  attrs: DtPopoverAnchorAttrs;
}

export interface DtPopoverCloseScope {
  /** Closes the popover. */
  close: () => void;
}

type NativeAttributes = Omit<HTMLAttributes<HTMLDivElement>,
  'id' | 'role' | 'children' | 'content' | 'onKeyDown' | 'aria-label' | 'aria-labelledby'>;

export interface DtPopoverProps extends ModeProps, NativeAttributes {
  /** The root element. */
  ref?: Ref<HTMLDivElement>;

  /**
   * Controls whether the popover is shown. When null (default), the popover toggles on click. When set to true or false,
   * the default trigger is disabled and the parent controls visibility, through `onOpenChange`.
   */
  open?: boolean | null;

  /** Whether the popover starts open when `open` isn't set. Clicks on the anchor take it from there. */
  defaultOpen?: boolean;

  /** Opens the popover on right click (context menu). If you set this value to `true`, the default trigger behavior will be disabled. */
  openOnContext?: boolean;

  /** Element type (tag name) of the root element of the component. */
  elementType?: ElementType;

  /** Named transition when the content display is toggled. See DtLazyShow. */
  transition?: string;

  /** ARIA role for the content of the popover. Defaults to "dialog". See https://www.w3.org/TR/wai-aria/#aria-haspopup */
  role?: PopoverRole;

  /**
   * ID of the element that serves as the label for the popover content. Defaults to the "anchor" element; this exists to
   * provide a different ID of the label element if, for example, the anchor slot contains other items that do not serve
   * as a label. You should provide this or ariaLabel, but not both.
   */
  ariaLabelledby?: string | null;

  /** Descriptive label for the popover content. You should provide this or ariaLabelledby, but not both. */
  ariaLabel?: string | null;

  /** Padding size class for the popover content. */
  padding?: PopoverPadding;

  /** Additional class name for the content wrapper element. */
  contentClass?: ClassValue;

  /** Width configuration for the popover content. When its value is 'anchor', the popover content will have the same width as the anchor. */
  contentWidth?: PopoverContentWidth | null;

  /** Whether to apply transition on initial render in the content lazy show component. */
  contentAppear?: boolean | null;

  /** Tabindex value for the content. Passing null, no tabindex attribute will be set. */
  contentTabindex?: number | null;

  /**
   * External anchor id to use in those cases the anchor can't be provided via the slot. For instance, using the
   * combobox's input as the anchor for the popover.
   * @deprecated Use externalAnchorElement instead for Shadow DOM compatibility.
   */
  externalAnchor?: string;

  /**
   * External anchor element reference. Use this instead of externalAnchor when the anchor may be inside a Shadow DOM,
   * as querySelector cannot pierce shadow boundaries.
   */
  externalAnchorElement?: HTMLElement | null;

  /** The id of the popover content. Generated when unset. */
  id?: string;

  /**
   * Displaces the content box from its anchor element by the specified number of pixels.
   * See https://atomiks.github.io/tippyjs/v6/all-props/#offset
   */
  offset?: [number, number];

  /** Closes the popover when clicking the anchor or outside the content box. */
  closeOnClick?: boolean;

  /**
   * Determines modal state. If enabled popover has a modal overlay preventing interaction with elements below it, but it
   * is invisible.
   */
  modal?: boolean;

  /**
   * When true, traps Tab/Shift+Tab focus within the popover dialog. Use this to enable focus trapping independently of
   * modal state — e.g. a non-modal popover whose content still requires keyboard containment. When `modal` is true, the
   * trap is already active; this prop has no additional effect.
   */
  focustrap?: boolean;

  /**
   * If the popover does not fit in the direction described by "placement", it will attempt to change its direction to
   * the "fallbackPlacements". See https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements
   */
  fallbackPlacements?: Placement[];

  /**
   * The element used to determine overflow boundaries for the popover.
   * See https://popper.js.org/docs/v2/utils/detect-overflow/#boundary
   */
  boundary?: PopoverBoundary | HTMLElement;

  /** The direction the popover displays relative to the anchor. See https://atomiks.github.io/tippyjs/v6/all-props/#placement */
  placement?: PopoverDirection;

  /**
   * If set to false the dialog will display over top of the anchor when there is insufficient space. If set to true it
   * will never move from its position relative to the anchor and will clip instead.
   * See https://popper.js.org/docs/v2/modifiers/prevent-overflow/#tether
   */
  tether?: boolean;

  /**
   * If the popover sticks to the anchor. This is usually not needed, but can be needed if the reference element's
   * position is animating, or to automatically update the popover position in those cases the DOM layout changes the
   * reference element's position. `true` enables it, `reference` only checks the "reference" rect for changes and
   * `popper` only checks the "popper" rect for changes. See https://atomiks.github.io/tippyjs/v6/all-props/#sticky
   */
  sticky?: PopoverSticky;

  /** Determines maximum height for the popover before overflow. Possible units rem|px|em */
  maxHeight?: string;

  /** Determines maximum width for the popover before overflow. Possible units rem|px|%|em */
  maxWidth?: string;

  /** Determines visibility for close button */
  showCloseButton?: boolean;

  /** Additional class name for the anchor wrapper element. */
  anchorClass?: ClassValue;

  /** Additional class name for the header element (d-popover__header). */
  headerWrapperClass?: ClassValue;

  /** Additional class name for the header content wrapper element. */
  headerClass?: ClassValue;

  /** Additional class name for the footer element (d-popover__footer). */
  footerWrapperClass?: ClassValue;

  /** Additional class name for the footer content wrapper element. */
  footerClass?: ClassValue;

  /** Additional class name for the dialog element. */
  dialogClass?: ClassValue;

  /**
   * The element that is focused when the popover is opened. This can be an HTMLElement within the popover, a string
   * starting with '#' which will find the element by ID. 'first' which will automatically focus the first element, or
   * 'dialog' which will focus the dialog window itself. If the dialog is modal this prop cannot be 'none'.
   */
  initialFocusElement?: PopoverInitialFocusString | `#${string}` | HTMLElement;

  /** If the popover should open pressing up or down arrow key on the anchor element. This can be set when not passing open prop. */
  openWithArrowKeys?: boolean;

  /**
   * Sets the element to which the popover is going to append to. 'body' will append to the nearest ancestor <dialog>
   * element when inside one (keeping the popover in the browser's top layer), or to the nearest body otherwise. To always
   * append to body regardless of dialog context, pass document.body as an HTMLElement. 'root' will try append to the
   * iFrame's parent body if it is contained in an iFrame and has permissions to access it, else, it'd default to 'parent'.
   */
  appendTo?: PopoverAppendTo | HTMLElement;

  /** Anchor element that activates the popover. Usually a button: bind `attrs` on it. */
  anchor?: SlotProp<DtPopoverAnchorScope>;

  /** The content that is displayed in the popover when it is open. */
  content?: SlotProp<DtPopoverCloseScope>;

  /** Popover header content. */
  headerContent?: SlotProp<DtPopoverCloseScope>;

  /** Footer content. */
  footerContent?: SlotProp<DtPopoverCloseScope>;

  /**
   * Keydown on the content (every key), and Enter, Space, ArrowUp and ArrowDown on the anchor. The native event, as in
   * Vue: the content isn't rendered by React.
   */
  onKeyDown?: (event: KeyboardEvent) => void;

  /** Called alongside onOpened while `open` is set (controlled), with the same value: Vue's update:open. */
  onOpenChange?: (open: boolean) => void;

  /** Called when the popover is shown (with the content element) or hidden, once its transition has finished. */
  onOpened?: (opened: boolean, contentElement?: HTMLElement) => void;

  /** Called when the mouse enters the anchor wrapper. (Vue's names for these four are swapped.) */
  onMouseenterPopover?: () => void;

  /** Called when the mouse leaves the anchor wrapper. */
  onMouseleavePopover?: () => void;

  /** Called when the mouse enters the content. */
  onMouseenterPopoverAnchor?: () => void;

  /** Called when the mouse leaves the content. */
  onMouseleavePopoverAnchor?: () => void;
}

/** Vue's `$nextTick`: resolves once the render React has queued has been committed to the DOM. */
const nextTick = () => Promise.resolve();

function isOutOfViewPort (element: Element) {
  const bounding = element.getBoundingClientRect();
  return {
    top: bounding.top < 0,
    bottom: bounding.bottom > (window.innerHeight || document.documentElement.clientHeight),
  };
}

const isDtScrollbarInUse = (rootElement: Element) => rootElement.hasAttribute('data-overlayscrollbars');

/** Disables scrolling on the root element, whether or not dt-scrollbar is in use. */
function disableRootScrolling (rootElement: Element = document.documentElement) {
  rootElement.classList.add(isDtScrollbarInUse(rootElement) ? 'd-scrollbar-disabled' : 'd-of-hidden');
}

/** Enables scrolling on the root element, whether or not dt-scrollbar is in use. */
function enableRootScrolling (rootElement: Element = document.documentElement) {
  rootElement.classList.remove(isDtScrollbarInUse(rootElement) ? 'd-scrollbar-disabled' : 'd-of-hidden');
}

/** The shadow host an element lives in, or undefined in a document (the root scrolling helpers' default). */
const shadowHostOf = (el: Element): Element | undefined => (el.getRootNode() as Partial<ShadowRoot>).host;

const isParentNode = (node: Node): node is Node & ParentNode => 'querySelector' in node;

const toKebab = (name: string) => name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);

interface PopoverDialogProps {
  element: HTMLElement;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLElement>;
  attributes: Record<string, string | undefined>;
  children: ReactNode;
}

/**
 * The content element (Vue's DtLazyShow root, `.d-popover__dialog`). tippy moves it into its popper, so React can't own
 * it: DtPopover creates it once, this keeps its attributes, class and style in sync the way React would for a host
 * element (DtTransition merges its classes into `className`, and sets `display` as v-show does), and portals the content
 * into it.
 */
function PopoverDialog ({ element, className, style, ref, attributes, children }: PopoverDialogProps) {
  const appliedStyle = useRef<CSSProperties>({});
  const appliedAttributes = useRef<Record<string, string | undefined>>({});

  useImperativeHandle(ref, () => element, [element]);

  useLayoutEffect(() => {
    if (className) element.setAttribute('class', className);
    else element.removeAttribute('class');
  }, [element, className]);

  const styleKey = JSON.stringify(style ?? {});
  useLayoutEffect(() => {
    const previous = appliedStyle.current;
    const next = (style ?? {}) as Record<string, string | number | undefined>;
    Object.keys(previous).forEach((key) => {
      if (!(key in next)) element.style.removeProperty(toKebab(key));
    });
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') element.style.removeProperty(toKebab(key));
      else element.style.setProperty(toKebab(key), String(value));
    });
    appliedStyle.current = { ...next };
    // `style` is compared by value, through styleKey.
  }, [element, styleKey]);

  const attributesKey = JSON.stringify(attributes);
  useLayoutEffect(() => {
    const previous = appliedAttributes.current;
    Object.keys(previous).forEach((name) => {
      if (attributes[name] === undefined) element.removeAttribute(name);
    });
    Object.entries(attributes).forEach(([name, value]) => {
      if (value === undefined) element.removeAttribute(name);
      else element.setAttribute(name, value);
    });
    appliedAttributes.current = { ...attributes };
    // `attributes` is compared by value, through attributesKey.
  }, [element, attributesKey]);

  return createPortal(children, element);
}

/**
 * A Popover displays a content overlay when its anchor element is activated.
 * @see https://dialtone.dialpad.com/components/popover.html
 */
export function DtPopover ({
  ref,
  open = null,
  defaultOpen = false,
  openOnContext = false,
  elementType: ElementTag = 'div',
  transition = 'fade',
  role = 'dialog',
  ariaLabelledby = null,
  ariaLabel = null,
  padding = 'large',
  contentClass,
  contentWidth = '',
  contentAppear = null,
  contentTabindex = -1,
  externalAnchor = '',
  externalAnchorElement = null,
  id,
  offset = DEFAULT_OFFSET,
  closeOnClick = true,
  modal = true,
  focustrap = false,
  fallbackPlacements = DEFAULT_FALLBACK_PLACEMENTS,
  boundary = 'clippingParents',
  placement = 'bottom-end',
  tether = true,
  sticky = false,
  maxHeight = '',
  maxWidth = '',
  showCloseButton = false,
  anchorClass,
  headerWrapperClass,
  headerClass,
  footerWrapperClass,
  footerClass,
  dialogClass,
  initialFocusElement = 'first',
  openWithArrowKeys = false,
  appendTo = 'body',
  contentMode = null,
  anchor,
  content,
  headerContent,
  footerContent,
  onKeyDown,
  onOpenChange,
  onOpened,
  onMouseenterPopover,
  onMouseleavePopover,
  onMouseenterPopoverAnchor,
  onMouseleavePopoverAnchor,
  ...rest
}: DtPopoverProps) {
  const generatedId = useId();
  const popoverId = id ?? generatedId;
  const anchorLabelId = `DtPopover__anchor${useId()}`;
  const dataQa = (rest as Record<string, unknown>)['data-qa'] as string | undefined;

  const rootRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const anchorWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<PopoverHeaderFooterHandle>(null);
  // Vue's anchorEl: null until resolved, undefined when the wrapper has no element.
  const anchorElRef = useRef<Element | null | undefined>(null);
  const tipRef = useRef<Instance | null>(null);
  const isUnmountingRef = useRef(false);

  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, []);

  // tippy moves the content element into its popper, so it's created here, once, outside React's tree.
  const [dialogEl] = useState(() => (typeof document === 'undefined' ? null : document.createElement('div')));

  // Vue's isOpen. `open` is synced into it whenever it changes (Vue's immediate watcher), but closing from inside (Escape,
  // a click outside, the close button) changes it too, controlled or not, and reports through onOpenChange.
  const [isOpen, setIsOpen] = useState<boolean>(open ?? defaultOpen);
  const [toAppear, setToAppear] = useState(open === true || (open === null && defaultOpen));
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open !== null) setIsOpen(open);
    if (open === true) setToAppear(true);
  }
  // Not immediate in Vue: only a change applies.
  const [prevContentAppear, setPrevContentAppear] = useState(contentAppear);
  if (contentAppear !== prevContentAppear) {
    setPrevContentAppear(contentAppear);
    if (contentAppear !== null) setToAppear(contentAppear);
  }
  // Only true once the leave transition (and any focus restoration in onLeaveTransitionComplete) has finished, so
  // aria-hidden is never applied while the dialog still holds focus or is still visible. As in Vue, it's cleared when
  // isOpen turns true, which an initial `open` doesn't count as.
  const [isDialogAriaHidden, setIsDialogAriaHidden] = useState(true);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setIsDialogAriaHidden(false);
  }
  // DtLazyShow's latch: the content renders from the first time the popover is shown.
  const [initialized, setInitialized] = useState(isOpen);
  if (isOpen && !initialized) setInitialized(true);

  const [isOutsideViewport, setIsOutsideViewport] = useState(false);
  // Resolved in initTippyInstance(), the same moment the content's own target is resolved, so the scrim can't drift
  // from the content if appendTo changes while open. 'body' until then, as Vue's Teleport target.
  const [scrimTarget, setScrimTarget] = useState<'body' | Element>('body');
  const [contextPoint, setContextPoint] = useState<{ x: number; y: number } | null>(null);

  const modeAttrs = useMode(contentMode, () => anchorWrapperRef.current);
  const { focusFirstElement, getFirstFocusableElement } = useModal();

  useFocusTrap(dialogEl, {
    active: (modal || focustrap) && isOpen,
    initialFocus: false,
    restoreFocus: !modal && focustrap,
  });

  const calculatedMaxHeight = isOutsideViewport && modal ? 'calc(100vh - var(--dt-spacing-50))' : maxHeight;

  // aria-labelledby should be set only if aria-labelledby is passed as a prop, or if there is no aria-label and the
  // labelledby should point to the anchor. Vue renders `false` as the string "false", on both attributes.
  const labelledBy: string | false = ariaLabelledby || (!ariaLabel && anchorLabelId);
  const anchorId = String(!ariaLabelledby && labelledBy);

  const closePopover = useCallback(() => setIsOpen(false), []);

  function calculateAnchorZindex (): number {
    // if a modal is currently active render at modal-element z-index, otherwise at popover z-index
    const root = rootRef.current?.getRootNode();
    if ((root && isParentNode(root) && root.querySelector(OPEN_MODAL_SELECTOR)) ||
      // Special case because we don't have any dialtone drawer component yet. Render at 650 when anchor of popover is
      // within a drawer.
      anchorElRef.current?.closest('.d-zi-drawer')) {
      return 650;
    }
    return 300;
  }

  function popperOptions () {
    return getPopperOptions({
      fallbackPlacements,
      tether,
      hasHideModifierEnabled: true,
      boundary,
    });
  }

  // window listeners, the same functions every time, as Vue's methods are.
  function addEventListeners () {
    window.addEventListener('dt-popover-close', closePopover);
    // align popover content width when contentWidth is 'anchor'
    if (contentWidth === 'anchor') window.addEventListener('resize', closePopover);
  }

  function removeEventListeners () {
    window.removeEventListener('dt-popover-close', closePopover);
    if (contentWidth === 'anchor') window.removeEventListener('resize', closePopover);
  }

  function resolveParentScrimTarget (): Element {
    return anchorElRef.current?.parentElement ?? document.body;
  }

  function resolveRootScrimTarget (): Element {
    try {
      return window.parent.document.body;
    } catch {
      // Matches the content's own fallback: when the parent frame is cross-origin, initTippyInstance falls back to
      // Tippy's 'parent' sentinel (the anchor's own parentElement) rather than document.body.
      return resolveParentScrimTarget();
    }
  }

  function resolveBodyScrimTarget (): Element {
    const anchorEl = anchorElRef.current;
    const root = anchorEl?.getRootNode();
    return anchorEl?.closest('dialog') ?? (root && isParentNode(root) ? root.querySelector('body') : null) ?? document.body;
  }

  // The scrim must land in the same top-layer context as the popover's own content (the nearest ancestor <dialog> when
  // nested in one). Otherwise, inside a native <dialog>-based DtModal, a plain document.body scrim can't block clicks on
  // the rest of the dialog, since top-layer content always paints above it regardless of z-index.
  function resolveScrimTarget (): Element {
    if (appendTo instanceof HTMLElement) return appendTo;
    switch (appendTo) {
      case 'parent':
        return resolveParentScrimTarget();
      case 'root':
        return resolveRootScrimTarget();
      default:
        return resolveBodyScrimTarget();
    }
  }

  // Returns the anchor ClientRect object relative to the window. Popper can call it for the lifetime of the tippy
  // instance, including after the anchor has gone, so it falls back to a zero rect.
  // See https://atomiks.github.io/tippyjs/v6/all-props/#getreferenceclientrect
  const getReferenceClientRect = useEffectEvent((error: boolean): DOMRect => {
    const anchorEl = anchorElRef.current;
    const anchorReferenceRect = anchorEl?.getBoundingClientRect() ?? (ZERO_RECT as DOMRect);

    if (appendTo !== 'root' || error) return anchorReferenceRect;

    const anchorParentWindow = anchorEl?.ownerDocument?.defaultView;
    const anchorIframe = anchorParentWindow?.frameElement;

    if (!anchorIframe) return anchorReferenceRect;

    const iframeReferenceRect = anchorIframe.getBoundingClientRect();

    return {
      width: anchorReferenceRect?.width,
      height: anchorReferenceRect?.height,
      top: iframeReferenceRect?.top + anchorReferenceRect?.top,
      left: iframeReferenceRect?.left + anchorReferenceRect?.left,
      right: iframeReferenceRect?.right + anchorReferenceRect?.right,
      bottom: iframeReferenceRect?.bottom + anchorReferenceRect?.bottom,
    } as DOMRect;
  });

  const onClickOutside = useEffectEvent(() => {
    if (!closeOnClick) return;
    // If a popover is opened inside of this one, do not hide on click out
    const innerModals = dialogEl?.querySelector('.d-popover__anchor--opened');
    if (!innerModals) closePopover();
  });

  const onShow = useEffectEvent(async () => {
    if (contentWidth === 'anchor') {
      await nextTick();
      if (isUnmountingRef.current) return;
      if (dialogEl) dialogEl.style.width = `${anchorElRef.current?.clientWidth}px`;
    }
    if (contentWidth === null && dialogEl) dialogEl.style.width = 'auto';
    addEventListeners();
  });

  const initTippyInstance = useEffectEvent(() => {
    const anchorEl = anchorElRef.current;
    if (!anchorEl || !dialogEl) return;
    setScrimTarget(resolveScrimTarget());

    let internalAppendTo: TippyProps['appendTo'] | undefined;
    let iFrameError = false;

    if (appendTo === 'body') {
      // When inside a native <dialog> (e.g. DtModal in Dialtone Next), append to the dialog so the popover stays in the
      // browser's top layer. Otherwise the anchor's own body: where it has none, tippy's default (document.body).
      const root = anchorEl.getRootNode();
      internalAppendTo = anchorEl.closest('dialog') ?? ((isParentNode(root) && root.querySelector('body')) || undefined);
    } else if (appendTo === 'root') {
      // Try to attach the popover to root document, fallback to parent is fail
      try {
        internalAppendTo = window.parent.document.body;
      } catch (err) {
        console.error('Could not attach the popover to iframe parent window: ', err);
        internalAppendTo = 'parent';
        iFrameError = true;
      }
    } else {
      internalAppendTo = appendTo;
    }

    tipRef.current?.destroy();

    tipRef.current = createTippyPopover(anchorEl, {
      popperOptions: popperOptions(),
      contentElement: dialogEl,
      placement,
      offset,
      sticky,
      appendTo: internalAppendTo,
      interactive: true,
      trigger: 'manual',
      getReferenceClientRect: () => getReferenceClientRect(iFrameError),
      // We have to manage hideOnClick functionality manually to handle popover within popover situations.
      hideOnClick: false,
      zIndex: modal ? 650 : calculateAnchorZindex(),
      onClickOutside: () => onClickOutside(),
      onShow: () => { onShow(); },
    });
  });

  const updateAnchorEl = useEffectEvent(() => {
    const wrapper = anchorWrapperRef.current;
    if (!wrapper) return;
    const root = wrapper.getRootNode();
    const externalAnchorEl = externalAnchorElement ||
      (externalAnchor && isParentNode(root) ? root.querySelector(`#${externalAnchor}`) : null);
    const anchorEl = externalAnchorEl ?? wrapper.children[0];
    if (anchorEl === anchorElRef.current) return;
    anchorElRef.current = anchorEl;

    tipRef.current?.destroy();
    tipRef.current = null;

    if (!anchorEl) {
      console.warn('No anchor found for popover');
      return;
    }

    if (isOpen) {
      initTippyInstance();
      tipRef.current?.show();
    }
  });

  // Vue checks [modal, initialFocusElement] on creation and whenever either changes: once each, StrictMode or not.
  const validated = useRef<[boolean, unknown] | null>(null);
  useEffect(() => {
    const last = validated.current;
    if (last && last[0] === modal && last[1] === initialFocusElement) return;
    validated.current = [modal, initialFocusElement];
    if (modal && initialFocusElement === 'none') {
      console.error('If the popover is modal you must set the ' +
        'initialFocusElement prop. Possible values: "dialog", "first", HTMLElement');
    }
  }, [modal, initialFocusElement]);

  // The content element starts in the root element, where Vue renders it, until tippy moves it into its popper.
  useLayoutEffect(() => {
    if (!container || !dialogEl) return;
    if (!dialogEl.parentElement?.classList.contains('tippy-box')) container.appendChild(dialogEl);
  }, [container, dialogEl]);

  // Vue's mounted and beforeUnmount.
  useLayoutEffect(() => {
    const wrapper = anchorWrapperRef.current;
    if (!wrapper || !dialogEl) return undefined;
    isUnmountingRef.current = false;
    dialogEl.style.removeProperty('transition');

    updateAnchorEl();

    const mutationObserver = new MutationObserver(() => updateAnchorEl());
    mutationObserver.observe(wrapper, { childList: true });

    // rootMargin here must be greater than the margin of the height we are setting in calculatedMaxHeight, which
    // currently is var(--dt-spacing-50) (4px). If not the intersectionObserver will continually trigger in an infinite
    // loop.
    const intersectionObserver = new IntersectionObserver((entries) => {
      const dialog = entries?.[0]?.target;
      if (!dialog) return;
      const isOut = isOutOfViewPort(dialog);
      setIsOutsideViewport(isOut.bottom || isOut.top);
    });
    intersectionObserver.observe(dialogEl);

    return () => {
      isUnmountingRef.current = true;
      // Cancel any in-progress CSS transitions so transitionend cannot fire after this component is torn down.
      dialogEl.style.transition = 'none';
      tipRef.current?.destroy();
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
      anchorElRef.current = null;
      tipRef.current = null;
      window.removeEventListener('dt-popover-close', closePopover);
      window.removeEventListener('resize', closePopover);
    };
  }, [dialogEl, closePopover]);

  // Vue's watchers, which don't run on mount: each compares against what it last saw.
  const appliedModal = useRef(modal);
  useLayoutEffect(() => {
    if (appliedModal.current === modal) return;
    appliedModal.current = modal;
    tipRef.current?.setProps({ zIndex: modal ? 650 : calculateAnchorZindex() });
    // calculateAnchorZindex reads the DOM, not props.
  }, [modal]);

  // Deep watchers: arrays mutated in place still reach tippy on the next render.
  const offsetKey = JSON.stringify(offset);
  const appliedOffset = useRef(offsetKey);
  useLayoutEffect(() => {
    if (appliedOffset.current === offsetKey) return;
    appliedOffset.current = offsetKey;
    tipRef.current?.setProps({ offset });
    // offset is compared by value, through offsetKey.
  }, [offsetKey]);

  const appliedSticky = useRef(sticky);
  useLayoutEffect(() => {
    if (appliedSticky.current === sticky) return;
    appliedSticky.current = sticky;
    tipRef.current?.setProps({ sticky });
  }, [sticky]);

  const fallbackPlacementsKey = JSON.stringify(fallbackPlacements);
  const appliedFallbackPlacements = useRef(fallbackPlacementsKey);
  const appliedTether = useRef(tether);
  const appliedBoundary = useRef(boundary);
  const setPopperOptions = useEffectEvent(() => tipRef.current?.setProps({ popperOptions: popperOptions() }));
  useLayoutEffect(() => {
    if (appliedFallbackPlacements.current === fallbackPlacementsKey) return;
    appliedFallbackPlacements.current = fallbackPlacementsKey;
    setPopperOptions();
  }, [fallbackPlacementsKey]);
  useLayoutEffect(() => {
    if (appliedTether.current === tether) return;
    appliedTether.current = tether;
    setPopperOptions();
  }, [tether]);
  useLayoutEffect(() => {
    if (appliedBoundary.current === boundary) return;
    appliedBoundary.current = boundary;
    setPopperOptions();
  }, [boundary]);

  const appliedExternalAnchorElement = useRef(externalAnchorElement);
  useLayoutEffect(() => {
    if (appliedExternalAnchorElement.current === externalAnchorElement) return;
    appliedExternalAnchorElement.current = externalAnchorElement;
    updateAnchorEl();
  }, [externalAnchorElement]);

  const appliedPlacement = useRef(placement);
  useLayoutEffect(() => {
    if (appliedPlacement.current === placement) return;
    appliedPlacement.current = placement;
    tipRef.current?.setProps({ placement });
  }, [placement]);

  // Vue's isOpen watcher.
  const appliedIsOpen = useRef(isOpen);
  const showTip = useEffectEvent(() => {
    // Guard against isOpen turning true before an anchor element has been resolved: creating a tippy instance with no
    // anchor leaves a stale getReferenceClientRect wired up.
    if (!anchorElRef.current) return;
    initTippyInstance();
    tipRef.current?.show();
  });
  const hideTip = useEffectEvent(() => {
    removeEventListeners();
    tipRef.current?.hide();
  });
  useLayoutEffect(() => {
    if (appliedIsOpen.current === isOpen) return;
    appliedIsOpen.current = isOpen;
    if (isOpen) showTip();
    else hideTip();
  }, [isOpen]);

  // A right click opens the popover at the pointer, once tippy has shown it.
  useLayoutEffect(() => {
    if (!contextPoint) return;
    const { x, y } = contextPoint;
    tipRef.current?.setProps({
      placement: 'right-start',
      getReferenceClientRect: () => ({ width: 0, height: 0, top: y, bottom: y, left: x, right: x }) as DOMRect,
    });
  }, [contextPoint]);

  // Native listeners: React doesn't render the content element. Vue's v-on and @mouseenter/@mouseleave on DtLazyShow.
  const onDialogKeydown = useEffectEvent((event: KeyboardEvent) => {
    // Tab focus trapping (when modal or focustrap) is handled by useFocusTrap on the content.
    if (event.key === 'Escape') closePopover();
    onKeyDown?.(event);
  });
  const onDialogMouseEnter = useEffectEvent(() => onMouseenterPopoverAnchor?.());
  const onDialogMouseLeave = useEffectEvent(() => onMouseleavePopoverAnchor?.());
  useEffect(() => {
    if (!dialogEl) return undefined;
    const keydown = (event: KeyboardEvent) => onDialogKeydown(event);
    const mouseenter = () => onDialogMouseEnter();
    const mouseleave = () => onDialogMouseLeave();
    dialogEl.addEventListener('keydown', keydown);
    dialogEl.addEventListener('mouseenter', mouseenter);
    dialogEl.addEventListener('mouseleave', mouseleave);
    return () => {
      dialogEl.removeEventListener('keydown', keydown);
      dialogEl.removeEventListener('mouseenter', mouseenter);
      dialogEl.removeEventListener('mouseleave', mouseleave);
    };
  }, [dialogEl]);

  // Prevents scrolling outside of the currently opened modal popover by:
  //   - when anchor is not within another popover: setting the body to overflow: hidden
  //   - when anchor is within another popover: set the popover dialog container to its non-modal z-index since it is no
  //     longer the active modal. This puts it underneath the overlay and prevents scrolling.
  function preventScrolling () {
    if (!modal) return;
    const anchorEl = anchorElRef.current;
    const element = anchorEl?.closest('body, .tippy-box');
    if (!anchorEl || !element) return;
    if (element.tagName?.toLowerCase() === 'body') {
      disableRootScrolling(shadowHostOf(anchorEl));
      tipRef.current?.setProps({ offset });
    } else {
      element.classList.add('d-zi-popover');
    }
  }

  // Resets the prevent scrolling properties set in preventScrolling() back to normal.
  function enableScrolling () {
    const anchorEl = anchorElRef.current;
    const element = anchorEl?.closest('body, .tippy-box');
    if (!anchorEl || !element) return;
    if (element.tagName?.toLowerCase() === 'body') {
      enableRootScrolling(shadowHostOf(anchorEl));
      tipRef.current?.setProps({ offset });
    } else {
      element.classList.remove('d-zi-popover');
    }
  }

  async function focusFirstElementIfNeeded (domEl: HTMLElement | null) {
    const firstFocusable = await getFirstFocusableElement(domEl);
    if (firstFocusable) {
      firstFocusable.focus({ preventScroll: true });
    } else if (showCloseButton) {
      headerRef.current?.focusCloseButton();
    } else {
      // if there are no focusable elements at all focus the dialog itself
      dialogEl?.focus();
    }
  }

  function focusInitialElementById (selector: string) {
    const result = dialogEl?.querySelector<HTMLElement>(selector);
    if (result) {
      result.focus();
    } else {
      console.warn('Could not find the element specified in dt-popover prop "initialFocusElement". ' +
        'Defaulting to focusing the dialog.');
      dialogEl?.focus();
    }
  }

  function focusInitialElement () {
    if (initialFocusElement instanceof HTMLElement) {
      initialFocusElement.focus();
    } else if (initialFocusElement === 'dialog') {
      dialogEl?.focus();
    } else if (initialFocusElement.startsWith('#')) {
      // find by ID
      focusInitialElementById(initialFocusElement);
    } else if (initialFocusElement === 'first') {
      focusFirstElementIfNeeded(contentRef.current);
    }
  }

  // What follows an await reads the props then, as Vue's `this` does.
  const finishEnter = useEffectEvent(() => {
    if (isUnmountingRef.current) return;
    preventScrolling();
    onOpened?.(true, contentRef.current ?? undefined);
    if (open !== null) onOpenChange?.(true);
  });

  const restoreScrolling = useEffectEvent(() => enableScrolling());

  const finishLeave = useEffectEvent(() => {
    if (isUnmountingRef.current) return;
    // Focus has been moved off the dialog (or was never trapped in it) by this point, so it's now safe to hide it from
    // assistive technology without triggering a focused-descendant violation.
    setIsDialogAriaHidden(true);
    tipRef.current?.unmount();
    onOpened?.(false);
    if (open !== null) onOpenChange?.(false);
  });

  async function onEnterTransitionComplete () {
    if (isUnmountingRef.current) return;
    focusInitialElement();
    // await next tick in case the user wants to change focus themselves.
    await nextTick();
    finishEnter();
  }

  async function onLeaveTransitionComplete () {
    if (isUnmountingRef.current) return;
    if (modal) {
      await focusFirstElement(anchorWrapperRef.current);
      if (isUnmountingRef.current) return;
      // await next tick in case the user wants to change focus themselves.
      await nextTick();
      if (isUnmountingRef.current) return;
      restoreScrolling();
    }
    finishLeave();
  }

  function defaultToggleOpen (event: ReactMouseEvent<HTMLDivElement>) {
    if (openOnContext) return;

    // Only use default toggle behaviour if the user has not set the open prop. Check that the anchor element
    // specifically was clicked.
    if (open === null) {
      const anchorEl = anchorElRef.current;
      const target = event.target as Node;
      if ((!anchorEl?.contains(target) && !anchorEl?.isEqualNode(target)) || (anchorEl as HTMLButtonElement)?.disabled) {
        return;
      }
      setIsOpen(current => !current);
    }
  }

  function onContext (event: ReactMouseEvent<HTMLDivElement>) {
    if (!openOnContext) return;
    event.preventDefault();
    setIsOpen(true);
    setContextPoint({ x: event.clientX, y: event.clientY });
  }

  function onArrowKeyPress (event: ReactKeyboardEvent<HTMLDivElement>) {
    if (open !== null) return;
    if (openWithArrowKeys && anchorElRef.current?.contains(event.target as Node)) {
      if (!isOpen) setIsOpen(true);
    }
    onKeyDown?.(event.nativeEvent);
  }

  // Vue's @keydown.up.prevent, @keydown.down.prevent, @keydown.enter and @keydown.space on the anchor wrapper.
  function onAnchorKeyDown (event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      onArrowKeyPress(event);
    } else if (event.key === 'Enter' || event.key === ' ') {
      onKeyDown?.(event.nativeEvent);
    }
  }

  const closeScope: DtPopoverCloseScope = { close: closePopover };
  const anchorScope: DtPopoverAnchorScope = {
    attrs: {
      'aria-expanded': isOpen.toString(),
      'aria-controls': popoverId,
      'aria-haspopup': role,
    },
  };
  const headerNode = renderSlot(headerContent, closeScope);
  const footerNode = renderSlot(footerContent, closeScope);

  const scrimContainer = scrimTarget === 'body'
    ? (typeof document === 'undefined' ? null : document.body)
    : scrimTarget;

  return (
    <div ref={rootRef} {...rest}>
      {modal && isOpen && scrimContainer && createPortal(
        <div
          className="d-modal--transparent"
          data-qa="dt-popover-scrim"
          aria-hidden="false"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        />,
        scrimContainer,
      )}
      <ElementTag
        ref={setContainer}
        className={cx('d-popover', { 'd-popover__anchor--opened': isOpen })}
        data-qa="dt-popover-container"
      >
        {/* The handlers catch events from the anchor inside the wrapper. */}
        <div
          id={anchorId}
          ref={anchorWrapperRef}
          className={cx(anchorClass) || undefined}
          data-qa={dataQa ? `${dataQa}-anchor` : 'dt-popover-anchor'}
          tabIndex={openOnContext ? 0 : undefined}
          onClickCapture={defaultToggleOpen}
          onContextMenu={onContext}
          onKeyDown={onAnchorKeyDown}
          onKeyDownCapture={(event) => {
            if (event.key === 'Escape') closePopover();
          }}
          onMouseEnter={() => onMouseenterPopover?.()}
          onMouseLeave={() => onMouseleavePopover?.()}
        >
          {renderSlot(anchor, anchorScope)}
        </div>
        {dialogEl && (
          <DtTransition
            show={isOpen}
            name={transition}
            appear={toAppear}
            onAfterEnter={() => { onEnterTransitionComplete(); }}
            onAfterLeave={() => { onLeaveTransitionComplete(); }}
          >
            <PopoverDialog
              element={dialogEl}
              className={cx('d-popover__dialog', { 'd-popover__dialog--modal': modal }, dialogClass)}
              style={{ maxHeight: calculatedMaxHeight, maxWidth }}
              attributes={{
                id: popoverId,
                role,
                'data-qa': dataQa ? `${dataQa}__dialog` : 'dt-popover',
                'aria-hidden': String(isDialogAriaHidden),
                'aria-labelledby': String(labelledBy),
                'aria-label': ariaLabel ?? undefined,
                'aria-modal': String(!modal),
                tabindex: contentTabindex === null ? undefined : String(contentTabindex),
                ...modeAttrs,
              }}
            >
              {initialized && (
                <>
                  {(hasContent(headerNode) || showCloseButton) && (
                    <PopoverHeaderFooter
                      ref={headerRef}
                      className={cx(POPOVER_HEADER_FOOTER_PADDING_CLASSES[padding], headerWrapperClass)}
                      contentClass={headerClass}
                      type="header"
                      showCloseButton={showCloseButton}
                      onClose={closePopover}
                      content={headerNode}
                    />
                  )}
                  <div
                    ref={contentRef}
                    data-qa={dataQa ? `${dataQa}-content` : 'dt-popover-content'}
                    className={cx('d-popover__content', POPOVER_PADDING_CLASSES[padding], contentClass)}
                  >
                    {renderSlot(content, closeScope)}
                  </div>
                  {hasContent(footerNode) && (
                    <PopoverHeaderFooter
                      type="footer"
                      className={cx(POPOVER_HEADER_FOOTER_PADDING_CLASSES[padding], footerWrapperClass)}
                      contentClass={footerClass}
                      content={footerNode}
                    />
                  )}
                  {!showCloseButton && <SrOnlyCloseButton onClose={closePopover} />}
                </>
              )}
            </PopoverDialog>
          </DtTransition>
        )}
      </ElementTag>
    </div>
  );
}
