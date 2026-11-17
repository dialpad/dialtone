import {
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import type { ModeProps } from '../../common/mode';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import {
  DtCombobox,
  type DtComboboxInputProps,
  type DtComboboxListProps,
  type DtComboboxProps,
} from '../Combobox';
import { ComboboxEmptyList } from '../Combobox/ComboboxEmptyList';
import { ComboboxLoadingList } from '../Combobox/ComboboxLoadingList';
import type { ComboboxSize } from '../Combobox/ComboboxConstants';
import { DROPDOWN_PADDING_CLASSES, type DropdownPadding } from '../Dropdown';
import {
  DtPopover,
  type PopoverAppendTo,
  type PopoverContentWidth,
  type PopoverSticky,
} from '../Popover';

const DEFAULT_OFFSET: [number, number] = [0, 4];

// The keys DtCombobox's root handles. See stopComboboxKeys.
const COMBOBOX_KEYS = new Set(['Escape', 'Esc', 'Enter', 'ArrowUp', 'ArrowDown', 'Home', 'End']);

/** The input slot's scope: bind `inputProps` on the input, and call `onInput` with its value as it changes. */
export interface DtComboboxWithPopoverInputScope {
  inputProps: DtComboboxInputProps;
  onInput: (value: unknown) => void;
}

/** The list slot's scope: spread `listProps` on the list element. */
export interface DtComboboxWithPopoverListScope {
  listProps: DtComboboxListProps;
}

interface DtComboboxWithPopoverOwnProps extends ModeProps {
  /** String to use for the input label. */
  label: string;

  /**
   * Determines visibility of input label.
   * @values true, false
   */
  showLabel?: boolean;

  /**
   * Size of the input.
   * @values 100, 200, 300, 400, 500
   */
  size?: ComboboxSize | null;

  /** Description for the input */
  description?: string;

  /**
   * Determines when to show the list element and also controls the aria-expanded attribute.
   * Leaving this null will have the combobox trigger on input focus by default.
   * If you set this value, the default trigger behavior will be disabled and you can
   * control it as you need.
   */
  showList?: boolean | null;

  /**
   * Sets an ID on the list element of the component. Used by several aria attributes
   * as well as when deriving the IDs for each item. Defaults to a generated unique id.
   */
  listId?: string;

  /** Additional class for the wrapper list element. */
  listClass?: ClassValue;

  /** Additional class for the header wrapper element. */
  headerClass?: ClassValue;

  /** Additional class for the footer wrapper element. */
  footerClass?: ClassValue;

  /** Additional class for the popover dialog element. */
  dialogClass?: ClassValue;

  /** A method that will be called when the selection goes past the beginning of the list. */
  onBeginningOfList?: (() => void) | null;

  /** A method that will be called when the selection goes past the end of the list. */
  onEndOfList?: (() => void) | null;

  /**
   * Determines maximum height for the popover before overflow.
   * Possible units rem|px|em
   */
  maxHeight?: string;

  /**
   * Determines maximum width for the popover before overflow.
   * Possible units rem|px|%|em
   */
  maxWidth?: string;

  /** Vertical padding size around the list element. */
  padding?: DropdownPadding;

  /**
   * Width configuration for the popover content. When its value is 'anchor',
   * the popover content will have the same width as the anchor.
   */
  contentWidth?: PopoverContentWidth | null;

  /**
   * If the list should be shown by pressing up or down arrow key on the input element.
   * This can be set when not passing showList prop.
   */
  openWithArrowKeys?: boolean;

  /**
   * Displaces the popover content box from its anchor element
   * by the specified number of pixels.
   */
  popoverOffset?: [number, number];

  /** If the popover sticks to the input. */
  popoverSticky?: PopoverSticky;

  /**
   * Displays the list when the combobox is focused, before the user has typed anything.
   * When this is enabled the list will not close after selection.
   */
  hasSuggestionList?: boolean;

  /** Determines when to show the skeletons and also controls aria-busy attribute. */
  loading?: boolean;

  /** Sets the list to an empty state, and displays the message from prop `emptyStateMessage`. */
  emptyList?: boolean;

  /** Message to show when the list is empty */
  emptyStateMessage?: string;

  /**
   * Sets the element to which the popover is going to append to.
   * 'body' will append to the nearest body (supports shadow DOM).
   * @values 'body', 'parent', 'root', HTMLElement,
   */
  appendTo?: PopoverAppendTo | HTMLElement;

  /**
   * Named transition when the content display is toggled.
   * @see DtLazyShow
   */
  transition?: string;

  /** Slot for the input: bind `inputProps` on it, and call `onInput` with its value. */
  input?: SlotProp<DtComboboxWithPopoverInputScope>;

  /** Slot for the list: spread `listProps` on it. */
  list?: SlotProp<DtComboboxWithPopoverListScope>;

  /** Slot for popover header content */
  header?: ReactNode;

  /** Slot for popover footer content */
  footer?: ReactNode;

  /** Event fired when item selected, with the highlighted index. */
  onSelect?: (index: number) => void;

  /** Event fired when 'escape' key is pressed */
  onEscape?: () => void;

  /** Event fired when an item is highlighted, with its index. */
  onHighlight?: (index: number) => void;

  /** Emitted when items are shown or hidden */
  onOpened?: (opened: boolean) => void;
}

/**
 * Like Vue's `$attrs`, every other attribute (and DtCombobox prop) goes to the DtCombobox, which puts attributes on
 * its root element, `ref` included.
 */
export type DtComboboxWithPopoverProps = DtComboboxWithPopoverOwnProps & Omit<DtComboboxProps,
  keyof DtComboboxWithPopoverOwnProps | 'listRenderedOutside' | 'emptyListItem'>;

/**
 * React events bubble through portals, so a keydown in the popover's content would reach DtCombobox's root, where Vue's
 * DOM event never does (tippy moves the content to the body). Enter there would select the highlighted item. This
 * keeps the keys DtCombobox handles inside the content, as in Vue; the popover's own Escape handling, on the content
 * element, still runs.
 */
const stopComboboxKeys = (event: KeyboardEvent<HTMLDivElement>) => {
  if (COMBOBOX_KEYS.has(event.key)) event.stopPropagation();
};

/**
 * A combobox whose list is shown in a popover, anchored to the input.
 * @see https://dialtone.dialpad.com/components/combobox.html
 */
export function DtComboboxWithPopover ({
  contentMode = null,
  label,
  showLabel = true,
  size = null,
  description = '',
  showList = null,
  listId,
  listClass = '',
  headerClass = '',
  footerClass = '',
  dialogClass = '',
  onBeginningOfList = null,
  onEndOfList = null,
  maxHeight = '',
  maxWidth = '',
  padding = 'small',
  contentWidth = null,
  openWithArrowKeys = false,
  popoverOffset = DEFAULT_OFFSET,
  popoverSticky = false,
  hasSuggestionList = true,
  loading = false,
  emptyList = false,
  emptyStateMessage = '',
  appendTo = 'body',
  transition = 'fade',
  input,
  list,
  header,
  footer,
  onSelect,
  onEscape,
  onHighlight,
  onOpened,
  ...rest
}: DtComboboxWithPopoverProps) {
  const externalAnchor = useId();
  const inputRef = useRef<HTMLDivElement>(null);
  const listWrapperRef = useRef<HTMLDivElement>(null);

  // Vue's isListShown, which follows showList whenever it's set (Vue's immediate watcher). The popover closing itself
  // (Escape, its close button) sets it too, through onOpenChange: Vue's v-model:open.
  const [isListShown, setIsListShown] = useState(showList ?? false);
  const [prevShowList, setPrevShowList] = useState(showList);
  if (showList !== prevShowList) {
    setPrevShowList(showList);
    if (showList !== null) setIsListShown(showList);
  }

  const showComboboxList = () => {
    if (showList != null) return;
    setIsListShown(true);
  };

  const closeComboboxList = () => {
    if (showList != null) return;
    setIsListShown(false);
  };

  const handleDisplayList = (value: unknown) => {
    if (!hasSuggestionList && value) showComboboxList();
    if (!hasSuggestionList && !value) closeComboboxList();
  };

  const handleSelect = (highlightIndex: number) => {
    if (loading) return;

    onSelect?.(highlightIndex);
    if (!hasSuggestionList) {
      // we don't display the list before the user has typed anything
      closeComboboxList();
    }
  };

  const handleEscape = () => {
    onEscape?.();
    closeComboboxList();
  };

  const handleHighlight = (highlightIndex: number) => {
    if (loading) return;

    onHighlight?.(highlightIndex);
  };

  const onFocusIn = (event: FocusEvent<HTMLDivElement>) => {
    if (hasSuggestionList && inputRef.current?.querySelector('input') === event.target) {
      // only trigger if we show suggestion list when focused, and
      // it's the input specifically that was focused
      showComboboxList();
    }
  };

  const openOnArrowKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    if (showList !== null || isListShown || !openWithArrowKeys) return;

    showComboboxList();
  };

  // Vue's isListShown watcher, which doesn't run on mount.
  const reportOpened = useEffectEvent((opened: boolean) => onOpened?.(opened));
  const previousIsListShown = useRef(isListShown);
  useLayoutEffect(() => {
    if (previousIsListShown.current === isListShown) return;
    previousIsListShown.current = isListShown;
    reportOpened(isListShown);
  }, [isListShown]);

  // Closes the list on a mousedown outside the input and the popover, while it's shown.
  const onWindowMouseDown = useEffectEvent((event: MouseEvent) => {
    // tippy's popper (Vue's `tip.popper`), which holds the content: the list wrapper's tippy root.
    const popoverEl = listWrapperRef.current?.closest('[data-tippy-root]');
    const comboboxEl = inputRef.current;

    // Check if the focus change was to another target within the combobox component
    if (event.composedPath().some(el => el === popoverEl || el === comboboxEl)) return;

    // If outside the combobox then close
    closeComboboxList();
  });
  useEffect(() => {
    if (!isListShown) return undefined;
    const listener = (event: MouseEvent) => onWindowMouseDown(event);
    window.addEventListener('mousedown', listener);
    return () => window.removeEventListener('mousedown', listener);
  }, [isListShown]);

  const renderList = (listProps: DtComboboxListProps): ReactNode => {
    if (loading) return <ComboboxLoadingList {...listProps} />;
    if (emptyList && emptyStateMessage) return <ComboboxEmptyList {...listProps} message={emptyStateMessage} />;
    return renderSlot(list, { listProps });
  };

  return (
    <DtCombobox
      loading={loading}
      label={label}
      showLabel={showLabel}
      size={size}
      description={description}
      emptyList={emptyList}
      emptyStateMessage={emptyStateMessage}
      showList={isListShown}
      onBeginningOfList={onBeginningOfList}
      onEndOfList={onEndOfList}
      listRenderedOutside
      listId={listId}
      data-qa="dt-combobox"
      {...rest}
      onSelect={handleSelect}
      onEscape={handleEscape}
      onHighlight={handleHighlight}
      input={({ inputProps }) => (
        <div
          id={externalAnchor}
          ref={inputRef}
          onFocus={onFocusIn}
          onKeyDown={openOnArrowKeyPress}
        >
          {renderSlot(input, { inputProps, onInput: handleDisplayList })}
        </div>
      )}
      list={({ opened, listProps, clearHighlightIndex }) => (
        <DtPopover
          open={isListShown}
          onOpenChange={setIsListShown}
          closeOnClick={false}
          maxHeight={maxHeight}
          maxWidth={maxWidth}
          offset={popoverOffset}
          sticky={popoverSticky}
          contentMode={contentMode}
          placement="bottom-start"
          initialFocusElement="none"
          padding="none"
          role="listbox"
          externalAnchor={externalAnchor}
          contentWidth={contentWidth}
          contentAppear
          contentTabindex={null}
          modal={false}
          appendTo={appendTo}
          dialogClass={dialogClass}
          transition={transition}
          onOpened={opened}
          headerContent={hasContent(header)
            ? (
              <div className={cx(headerClass) || undefined} onKeyDown={stopComboboxKeys}>
                {header}
              </div>
            )
            : undefined}
          content={(
            <div
              ref={listWrapperRef}
              className={cx('d-combobox-with-popover__list', DROPDOWN_PADDING_CLASSES[padding], listClass)}
              onMouseLeave={clearHighlightIndex}
              onBlur={clearHighlightIndex}
              onKeyDown={stopComboboxKeys}
            >
              {renderList(listProps)}
            </div>
          )}
          footerContent={hasContent(footer)
            ? (
              <div className={cx(footerClass) || undefined} onKeyDown={stopComboboxKeys}>
                {footer}
              </div>
            )
            : undefined}
        />
      )}
    />
  );
}
