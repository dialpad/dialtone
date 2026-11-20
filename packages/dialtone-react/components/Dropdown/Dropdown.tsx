import { useCallback, useId, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
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
// The close button sits outside the list, but keyboard navigation reaches it like a row.
const LIST_ITEM_SELECTOR = [...LIST_ITEM_ROLES.map(role => `[role="${role}"]`), '#sr-only-close-button'].join(', ');
const DEFAULT_FALLBACK_PLACEMENTS: Placement[] = ['auto'];
const ARROW_CODES = ['Up', 'ArrowUp', 'Down', 'ArrowDown'];

// DtListItem's `disabled` modifier. Hand-rolled aria-disabled rows don't carry it and keep the legacy behavior.
const isDisabledRow = (element: Element | null | undefined) => Boolean(element?.classList.contains('d-list-item--disabled'));

const isFocused = (element: HTMLElement) => (element.getRootNode() as Document | ShadowRoot).activeElement === element;

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

  /** Anchor element that activates the dropdown. Spread the scope on it: `anchor={(attrs) => <DtButton {...attrs} />}`. */
  anchor?: SlotProp<DtDropdownAnchorScope>;

  /** Slot for the list component. */
  list?: SlotProp<DtPopoverCloseScope>;

  /** Slot for the footer content. */
  footer?: SlotProp<DtPopoverCloseScope>;

  /**
   * Optional callback receiving the open boolean synchronously on logical visibility changes. Includes an initial
   * `true` on the first commit when `open` is true. For modal removal, keep modal=true, its anchor and scroll
   * container unchanged until onOpened(false). Changing modal or the anchor's scroll context after opening can retain
   * the original lock. onOpened(false) reports transition completion, not global scroll-lock ownership.
   */
  visibilityChangeCallback?: (open: boolean) => void;

  /**
   * Forwards anchor ArrowUp/ArrowDown through `onKeyDown` with a boolean `open` prop, without toggling. Closed anchor
   * arrows keep their default action and propagation for the consumer. Accept opening synchronously in the `onKeyDown`
   * callback for first-row focus.
   */
  forwardAnchorArrowKeys?: boolean;

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
  ref,
  open = null,
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

  const isArrowKeyNav = navigationType === LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS;

  const getListElement = () => listRef.current;

  const itemsLength = () =>
    listRef.current?.querySelectorAll(`[role="${LIST_ITEM_ROLE}"], #sr-only-close-button`).length ?? 0;

  const nav = useKeyboardListNavigation({
    listItemRole: LIST_ITEM_ROLE,
    getListElement,
    // An item without an id has no element to find; Vue's `querySelector('#')` throws there.
    getActiveItem: highlightId => (highlightId ? listRef.current?.querySelector<HTMLElement>(`#${highlightId}`) : null),
    afterHighlightMethod: (index) => {
      if (index === itemsLength() - 1) {
        return;
      }
      onHighlight?.(index);
    },
    // Called from key handlers, by which time `nav` is set.
    beginningOfListMethod: () => (onBeginningOfList ?? nav.jumpToEnd)(),
    endOfListMethod: () => (onEndOfList ?? nav.jumpToBeginning)(),
    focusOnKeyboardNavigation: true,
  });

  const clearHighlightIndex = () => {
    nav.setHighlightIndex(-1);
  };

  const onMouseHighlight = (event: ReactMouseEvent<HTMLUListElement>) => {
    const liElement = (event.target as Element).closest('li');

    if (liElement && liElement.getAttribute('role') && nav.highlightId !== liElement.id) {
      nav.setHighlightId(liElement.id);
      liElement.focus();
    }
  };

  const updateInitialHighlightIndex = (isPopoverOpen: boolean) => {
    isOpenRef.current = isPopoverOpen;

    if (isPopoverOpen) {
      if (openedWithKeyboard && isArrowKeyNav) {
        nav.setHighlightIndex(0);
      }
      onOpened?.(true);
    } else {
      clearHighlightIndex();
      setOpenedWithKeyboard(false);
      onOpened?.(false);
    }
  };

  const onSpaceOrEnterKey = () => {
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
      nav.onUpKey();
    }
  };

  const onDownKeyPress = () => {
    if (!isOpenRef.current) {
      setOpenedWithKeyboard(true);
      return;
    }
    if (isArrowKeyNav) {
      nav.onDownKey();
    }
  };

  const onHomeKeyPress = () => {
    if (!isOpenRef.current || !isArrowKeyNav) {
      return;
    }
    nav.onHomeKey();
  };

  const onEndKeyPress = () => {
    if (!isOpenRef.current || !isArrowKeyNav) {
      return;
    }
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

  // The popover's keydown: from the anchor, and from the open content.
  const handleKeyDown = (event: KeyboardEvent) => {
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
      case 'Enter':
        onSpaceOrEnterKey();
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
