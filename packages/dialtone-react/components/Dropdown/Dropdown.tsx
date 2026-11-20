import { useId, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import type { Placement } from 'tippy.js';
import { cx, type ClassValue } from '../../common/cx';
import { HighlightIdContext, useKeyboardListNavigation } from '../../common/keyboard-list-navigation';
import { renderSlot, type SlotProp } from '../../common/slots';
import { LIST_ITEM_NAVIGATION_TYPES, type ListItemNavigationType } from '../ListItem';
import {
  DtPopover,
  type DtPopoverAnchorAttrs,
  type DtPopoverCloseScope,
  type DtPopoverProps,
  type PopoverAppendTo,
  type PopoverContentWidth,
  type PopoverDirection,
} from '../Popover';
import { DROPDOWN_PADDING_CLASSES, type DropdownPadding } from './DropdownConstants';

const LIST_ITEM_ROLES = ['menuitem', 'menuitemradio'];
// The keyboard list navigation mixin's `_getListItemNodes` selector, which the hook doesn't expose.
const LIST_ITEM_SELECTOR = [...LIST_ITEM_ROLES.map(role => `[role="${role}"]`), '#sr-only-close-button'].join(', ');
const DEFAULT_FALLBACK_PLACEMENTS: Placement[] = ['auto'];
const ARROW_CODES = ['Up', 'ArrowUp', 'Down', 'ArrowDown'];

// DtListItem's `disabled` modifier. Hand-rolled aria-disabled rows don't carry it and keep the legacy behavior.
const isDisabledRow = (element: Element | null | undefined) =>
  Boolean(element?.classList.contains('d-list-item--disabled'));

const isFocused = (element: Element | null | undefined) =>
  element ? (element.getRootNode() as Document | ShadowRoot).activeElement === element : false;

/** Vue's `$nextTick`: resolves once the render React has queued has been committed to the DOM. */
const nextTick = () => Promise.resolve();

/**
 * What the anchor slot gets to bind on the element that opens the dropdown: the popover's anchor attrs, spread into
 * the scope itself, as Vue's `<slot v-bind="attrs">` does.
 */
export type DtDropdownAnchorScope = DtPopoverAnchorAttrs;

/** Popover props and attributes go to the DtPopover, as Vue's `$attrs` do. */
type PopoverPassThrough = Omit<DtPopoverProps,
  'anchor' | 'content' | 'headerContent' | 'footerContent' | 'padding' | 'onKeyDown' | 'onOpened' | 'openWithArrowKeys'>;

export interface DtDropdownProps extends PopoverPassThrough {
  /**
   * Controls whether the dropdown is shown. When null (default), the dropdown toggles on click. When set to true or
   * false, the default trigger is disabled and the parent controls visibility, through `onOpenChange`.
   */
  open?: boolean | null;

  /**
   * Optional callback receiving the open boolean on logical visibility changes. Includes an initial `true` on the
   * first commit when `open` is true. Does not declare or emit an open-change event. For modal removal, keep
   * modal=true, its anchor and scroll container unchanged until onOpened(false). Changing modal or the anchor's scroll
   * context after opening can retain the original lock. onOpened(false) reports transition completion, not global
   * scroll-lock ownership. A closed modal with no pending transition or retained scroll lock can be removed
   * immediately.
   */
  visibilityChangeCallback?: (open: boolean) => void;

  /**
   * Forwards anchor ArrowUp/ArrowDown through `onKeyDown` with a boolean `open` prop, without toggling. Closed anchor
   * arrows keep their default action and propagation for the consumer. Accept opening synchronously in the `onKeyDown`
   * callback for first-row focus.
   */
  forwardAnchorArrowKeys?: boolean;

  /** Opens the dropdown on right click (context menu). If you set this value to `true`, the default trigger behavior will be disabled. */
  openOnContext?: boolean;

  /** Vertical padding size around the list element. */
  padding?: DropdownPadding;

  /**
   * Determines modal state, dropdown has a modal overlay preventing interaction with elements below it, but it is
   * invisible.
   */
  modal?: boolean;

  /** Width configuration for the popover content. When its value is 'anchor', the popover content will have the same width as the anchor. */
  contentWidth?: PopoverContentWidth | null;

  /** Determines maximum height for the popover before overflow. Possible units rem|px|em */
  maxHeight?: string;

  /** Determines maximum width for the popover before overflow. Possible units rem|px|%|em */
  maxWidth?: string;

  /**
   * Sets an ID on the list element of the component. Used by several aria attributes as well as when deriving the IDs
   * for each item. Generated when unset.
   */
  listId?: string;

  /**
   * The type of navigation that this component should support.
   * - "arrow-keys" for items that are navigated with UP/DOWN keys.
   * - "tab" for items that are navigated using the TAB key.
   * - "none" for static items that are not interactive.
   */
  navigationType?: ListItemNavigationType;

  /**
   * If the dropdown does not fit in the direction described by "placement", it will attempt to change it's direction
   * to the "fallbackPlacements".
   */
  fallbackPlacements?: Placement[];

  /** The direction the dropdown displays relative to the anchor. */
  placement?: PopoverDirection;

  /** A method that will be called when the selection goes past the beginning of the list. */
  onBeginningOfList?: (() => void) | null;

  /** A method that will be called when the selection goes past the end of the list. */
  onEndOfList?: (() => void) | null;

  /** Additional class for the wrapper list element. */
  listClass?: ClassValue;

  /** Additional class for the footer wrapper element. */
  footerClass?: ClassValue;

  /**
   * Sets the element to which the popover is going to append to. 'body' will append to the nearest body (supports
   * shadow DOM).
   */
  appendTo?: PopoverAppendTo | HTMLElement;

  /**
   * If set to false the dialog will display over top of the anchor when there is insufficient space. If set to true it
   * will never move from its position relative to the anchor and will clip instead.
   * See https://popper.js.org/docs/v2/modifiers/prevent-overflow/#tether
   */
  tether?: boolean;

  /** Named transition when the content display is toggled. See DtLazyShow. */
  transition?: string;

  /**
   * Dropdown trigger. Bind the three ARIA scope keys on it: `aria-expanded` ("true" or "false"), `aria-controls` (the
   * id of the popup element with role="menu") and `aria-haspopup` ("menu").
   */
  anchor?: SlotProp<DtDropdownAnchorScope>;

  /** Slot for the list component. */
  list?: SlotProp<DtPopoverCloseScope>;

  /** Slot for the footer content. */
  footer?: SlotProp<DtPopoverCloseScope>;

  /** Native keydown event, from the anchor (Enter, Space, ArrowUp, ArrowDown) and from the open dropdown (every key). */
  onKeyDown?: (event: KeyboardEvent) => void;

  /** Called with the highlighted item's index when the highlight changes. */
  onHighlight?: (index: number) => void;

  /** Called after the current transition and initial focus work complete. */
  onOpened?: (opened: boolean) => void;
}

/**
 * A Dropdown presents a list of options or actions. It's a popover with a list and keyboard navigation.
 * @see https://dialtone.dialpad.com/components/dropdown.html
 */
export function DtDropdown ({
  open = null,
  visibilityChangeCallback,
  forwardAnchorArrowKeys = false,
  openOnContext = false,
  padding = 'small',
  modal = true,
  contentWidth = null,
  maxHeight = '',
  maxWidth = '',
  listId: listIdProp,
  navigationType = LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS,
  fallbackPlacements = DEFAULT_FALLBACK_PLACEMENTS,
  placement = 'bottom',
  onBeginningOfList = null,
  onEndOfList = null,
  listClass = '',
  footerClass = '',
  appendTo = 'body',
  tether = true,
  transition = 'fade',
  dialogClass,
  anchor,
  list,
  footer,
  onKeyDown,
  onHighlight,
  onOpened,
  ...rest
}: DtDropdownProps) {
  const generatedListId = useId();
  const listId = listIdProp ?? generatedListId;
  const listRef = useRef<HTMLUListElement>(null);
  const [openedWithKeyboard, setOpenedWithKeyboard] = useState(false);
  // Vue's isOpen: what the popover last reported through `opened`. Only key handlers read it.
  const isOpenRef = useRef<boolean | null>(null);
  // Vue's isLogicallyOpen: what the popover last reported through its visibility callback.
  const isLogicallyOpenRef = useRef(false);
  // Vue's pendingArrowOpening: the latest forwarded anchor arrow, until the parent accepts or ignores it.
  const pendingArrowOpeningRef = useRef<object | null>(null);
  // Set while the dropdown moves focus to Close, which has no row index and must not report a highlight.
  const silentHighlightRef = useRef(false);

  const isArrowKeyNav = navigationType === LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS;
  // Vue binds role="menu", then $attrs, so a consumer's role wins; an explicitly unset one falls to DtPopover's default.
  const popoverRole = 'role' in rest ? (rest.role ?? 'dialog') : 'menu';
  const showCloseButton = rest.showCloseButton ?? false;

  const getListElement = () => listRef.current;

  // Vue's popover.popoverContentEl: the `.d-popover__dialog` element the list is rendered in.
  const getPopoverContentEl = () => listRef.current?.closest<HTMLElement>('.d-popover__dialog') ?? null;

  // The keyboard navigation mixin's _getListItemNodes.
  const getListItemNodes = (): HTMLElement[] => {
    const listElement = listRef.current;
    if (!listElement) return [];
    return Array.from(listElement.querySelectorAll<HTMLElement>(LIST_ITEM_SELECTOR))
      .filter(item => item.getAttribute('role') !== 'menuitemradio' || item.id);
  };

  const itemsLength = () => getListItemNodes().length;

  // Vue's activeItemEl, for a given highlighted id.
  const getActiveItem = (highlightId: string | undefined) =>
    (highlightId ? getListItemNodes().find(item => item.id === highlightId) ?? null : null);

  const nav = useKeyboardListNavigation({
    listItemRole: LIST_ITEM_ROLES,
    getListElement,
    getActiveItem,
    afterHighlightMethod: (index) => {
      if (silentHighlightRef.current || index === itemsLength() - 1) {
        return;
      }
      onHighlight?.(index);
    },
    // Called from key handlers, by which time `nav` is set.
    beginningOfListMethod: () => (onBeginningOfList ?? onBeginningOfMenu)(),
    endOfListMethod: () => (onEndOfList ?? onEndOfMenu)(),
    focusOnKeyboardNavigation: true,
  });

  const onVisibilityChange = (isOpen: boolean) => {
    isLogicallyOpenRef.current = isOpen;
    visibilityChangeCallback?.(isOpen);
  };

  // Focuses the menu container; false when it can't take focus (contentTabindex null).
  const focusMenuContent = () => {
    const content = getPopoverContentEl();
    content?.focus();
    return isFocused(content);
  };

  // A DtListItem disabled row takes the highlight but not focus, which would draw the keyboard focus ring under the
  // pointer. The menu holds focus so Enter can't activate another row.
  const focusHoveredRow = (row: HTMLElement) => {
    if (isDisabledRow(row) && focusMenuContent()) return;
    row.focus();
  };

  // Vue's popover.getCloseButtonElement(), only while the popup is a menu.
  const getMenuCloseButton = () => {
    if (popoverRole !== 'menu') return null;
    return getPopoverContentEl()?.querySelector<HTMLElement>(showCloseButton
      ? ':scope > .d-popover__header > [data-qa="dt-popover-close"]'
      : ':scope > #sr-only-close-button') ?? null;
  };

  const isMenuCloseFocused = () => isFocused(getMenuCloseButton());

  const focusMenuClose = () => {
    const closeButton = getMenuCloseButton();
    if (!closeButton) return false;
    // Close has no application row index and must not emit a choice highlight.
    silentHighlightRef.current = true;
    try {
      nav.setHighlightIndex(-1);
    } finally {
      silentHighlightRef.current = false;
    }
    closeButton.focus();
    return true;
  };

  function onBeginningOfMenu () {
    if (!focusMenuClose()) nav.jumpToEnd();
  }

  function onEndOfMenu () {
    if (!focusMenuClose()) nav.jumpToBeginning();
  }

  const clearHighlightIndex = () => {
    nav.setHighlightIndex(-1);
  };

  const onMouseHighlight = (event: ReactMouseEvent<HTMLUListElement>) => {
    const liElement = (event.target as Element).closest('li');

    if (liElement?.getAttribute('role') && liElement.id && nav.highlightId !== liElement.id) {
      nav.setHighlightId(liElement.id);
      if (getListItemNodes().includes(liElement)) focusHoveredRow(liElement);
    }
  };

  const updateInitialHighlightIndex = (isPopoverOpen: boolean) => {
    isOpenRef.current = isPopoverOpen;

    if (isPopoverOpen) {
      if (openedWithKeyboard && isArrowKeyNav) {
        const hasItems = itemsLength() > 0;
        if (hasItems || !focusMenuClose()) nav.setHighlightIndex(0);
        // DtPopover's default first-element focus skips aria-disabled rows, but a DtListItem disabled row stays
        // reachable: focus it so focus and keyboard position agree. A consumer focus target wins.
        const activeItemEl = hasItems ? getActiveItem(getListItemNodes()[0]?.id) : null;
        const consumerFocus = rest.initialFocusElement !== undefined;
        if (!consumerFocus && activeItemEl && isDisabledRow(activeItemEl)) activeItemEl.focus();
      }
      onOpened?.(true);
    } else {
      clearHighlightIndex();
      setOpenedWithKeyboard(false);
      onOpened?.(false);
    }
  };

  const onSpaceKey = (event: KeyboardEvent) => {
    if (!open) {
      setOpenedWithKeyboard(true);
    }
    // The menu holds focus while the pointer rests on a disabled row; keep Space from scrolling it.
    if (isDisabledRow(getActiveItem(nav.highlightId)) && event.target === getPopoverContentEl()) {
      event.preventDefault();
    }
  };

  const onEnterKey = () => {
    if (!open) {
      setOpenedWithKeyboard(true);
    }
  };

  const onUpKeyPress = () => {
    if (!isOpenRef.current) {
      setOpenedWithKeyboard(true);
      return;
    }
    if (isArrowKeyNav) {
      if (isMenuCloseFocused()) return nav.onEndKey();
      nav.onUpKey();
    }
  };

  const onDownKeyPress = () => {
    if (!isOpenRef.current) {
      setOpenedWithKeyboard(true);
      return;
    }
    if (isArrowKeyNav) {
      if (isMenuCloseFocused()) return nav.onHomeKey();
      nav.onDownKey();
    }
  };

  const onHomeKeyPress = () => {
    if (!isOpenRef.current || !isArrowKeyNav) {
      return;
    }
    if (!itemsLength() && focusMenuClose()) return;
    nav.onHomeKey();
  };

  const onEndKeyPress = () => {
    if (!isOpenRef.current || !isArrowKeyNav) {
      return;
    }
    if (focusMenuClose()) return;
    nav.onEndKey();
  };

  const onKeyPress = (event: KeyboardEvent) => {
    if (!isOpenRef.current || !isArrowKeyNav || !nav.isValidLetter(event.key)) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    nav.onNavigationKey(event.key);
  };

  // DtPopover reports keydown from its anchor wrapper and from its content element; the list is in the content.
  const isFromAnchor = (event: KeyboardEvent) => !getPopoverContentEl()?.contains(event.target as Node);

  // The popover's keydown: from the anchor, and from the open content.
  const handleKeyDown = (event: KeyboardEvent) => {
    const isArrow = ARROW_CODES.includes(event.code);

    if (forwardAnchorArrowKeys && open !== null && !isLogicallyOpenRef.current && isArrow && isFromAnchor(event)) {
      const pending = {};
      pendingArrowOpeningRef.current = pending;
      setOpenedWithKeyboard(true);
      onKeyDown?.(event);
      // Let synchronous acceptance in the handler above commit before discarding ignored modality.
      nextTick().then(() => {
        if (pendingArrowOpeningRef.current === pending && !isLogicallyOpenRef.current) {
          setOpenedWithKeyboard(false);
        }
      });
      return;
    }

    switch (event.code) {
      case 'Up':
      case 'ArrowUp':
        onUpKeyPress();
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'Down':
      case 'ArrowDown':
        onDownKeyPress();
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'Space':
      case 'Spacebar':
        onSpaceKey(event);
        break;
      case 'Enter':
        onEnterKey();
        break;
      case 'Home':
        onHomeKeyPress();
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'End':
        onEndKeyPress();
        event.stopPropagation();
        event.preventDefault();
        break;
      default:
        onKeyPress(event);
        break;
    }

    onKeyDown?.(event);
  };

  const listClasses = cx(
    'd-dropdown-list',
    DROPDOWN_PADDING_CLASSES[padding],
    listClass,
    { 'd-context-menu-list': openOnContext },
  );

  return (
    <HighlightIdContext.Provider value={nav.highlightIdContext}>
      <DtPopover
        contentWidth={contentWidth}
        open={open}
        forwardAnchorArrowKeys={forwardAnchorArrowKeys}
        visibilityChangeCallback={onVisibilityChange}
        placement={placement}
        initialFocusElement={openedWithKeyboard ? 'first' : 'dialog'}
        fallbackPlacements={fallbackPlacements}
        padding="none"
        role="menu"
        appendTo={appendTo}
        modal={modal}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        openWithArrowKeys={!openOnContext}
        openOnContext={openOnContext}
        {...rest}
        dialogClass={[dialogClass, {
          'd-dropdown__menu--arrow-keys': isArrowKeyNav && (!('role' in rest) || rest.role === 'menu'),
        }]}
        tether={tether}
        transition={transition}
        footerClass={footerClass}
        onOpened={updateInitialHighlightIndex}
        onKeyDown={handleKeyDown}
        anchor={({ attrs }) => renderSlot(anchor, attrs)}
        content={({ close }) => (
          <ul
            id={listId}
            ref={listRef}
            role="none"
            className={listClasses}
            data-qa="dt-dropdown-list-wrapper"
            onMouseLeave={clearHighlightIndex}
            onMouseMoveCapture={onMouseHighlight}
          >
            {renderSlot(list, { close })}
          </ul>
        )}
        footerContent={({ close }) => renderSlot(footer, { close })}
      />
    </HighlightIdContext.Provider>
  );
}
