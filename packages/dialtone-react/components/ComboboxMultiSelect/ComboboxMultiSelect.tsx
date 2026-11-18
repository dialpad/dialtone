import {
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type DOMAttributes,
  type FocusEvent,
  type InputEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { hasContent } from '../../common/slots';
import { getValidationState, type ValidationMessage } from '../../common/utils';
import { DtChip, type ChipSize } from '../Chip';
import { DtComboboxWithPopover, type DtComboboxWithPopoverProps } from '../ComboboxWithPopover';
import { DtInput } from '../Input';
import type { PopoverAppendTo } from '../Popover';
import { DtValidationMessages } from '../ValidationMessages';
import { CHIP_SIZES, type ComboboxMultiSelectSize } from './ComboboxMultiSelectConstants';

// dialtone-vue's COMPONENT_SIZES (common/constants/sizes.js).
const COMPONENT_SIZES: Readonly<Partial<Record<string, string>>> = {
  100: 'xs', 200: 'sm', 300: 'md', 400: 'lg', 500: 'xl',
};
const CHIP_SIZE_OF: Readonly<Partial<Record<string, ChipSize>>> = CHIP_SIZES;
const POPOVER_OFFSET: [number, number] = [0, 4];
const NO_ITEMS: string[] = [];
const NO_MESSAGES: ValidationMessage[] = [];

type ChipElement = HTMLButtonElement | HTMLSpanElement;
type InputElement = HTMLInputElement | HTMLTextAreaElement;

interface DtComboboxMultiSelectOwnProps {
  /** String to use for the input label. */
  label: string;

  /**
   * Determines visibility of input label.
   * @values true, false
   */
  showLabel?: boolean;

  /** Description for the input */
  description?: string;

  /** Input placeholder */
  placeholder?: string;

  /** Input validation messages */
  inputMessages?: (string | ValidationMessage)[];

  /** Show input validation message */
  showInputMessages?: boolean;

  /** Determines if the list is loading */
  loading?: boolean;

  /** The message when the list is loading */
  loadingMessage?: string;

  /**
   * Determines when to show the list element and also controls the aria-expanded attribute.
   * Leaving this null will have the combobox trigger on input focus by default.
   * If you set this value, the default trigger behavior will be disabled and you can
   * control it as you need.
   */
  showList?: boolean | null;

  /**
   * Determines maximum height for the popover before overflow.
   * Possible units rem|px|em
   */
  listMaxHeight?: string;

  /** The selected items */
  selectedItems?: string[];

  /** Would be the maximum number of selections you can make. 0 is unlimited */
  maxSelected?: number;

  /**
   * Max select message when the max selections is exceeded with the structure:
   * `[{"message": string, "type": VALIDATION_MESSAGE_TYPES }]`
   */
  maxSelectedMessage?: ValidationMessage[];

  /**
   * Displays the list when the combobox is focused, before the user has typed anything.
   * When this is enabled the list will not close after selection.
   */
  hasSuggestionList?: boolean;

  /**
   * Size of the chip.
   * @values 100, 200, 300
   */
  size?: ComboboxMultiSelectSize;

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

  /** Determines whether the combobox should collapse to a single when losing focus. */
  collapseOnFocusOut?: boolean;

  /**
   * Determines maximum width for the popover before overflow.
   * Possible units rem|px|em
   */
  listMaxWidth?: string;

  /**
   * Amount of reserved space (in px) on the right side of the input
   * before the chips and the input caret jump to the next line.
   * default is 64
   */
  reservedRightSpace?: number;

  /**
   * Determines the maximum width of a single chip. If the text within this chip exceeds the value
   * it will be truncated with ellipses.
   * Possible units rem|px|em
   */
  chipMaxWidth?: string;

  /** Additional class name for the input element. */
  inputClass?: ClassValue;

  /** Additional class name for the input wrapper element. */
  inputWrapperClass?: ClassValue;

  /** When true, disables the underlying input. */
  disabled?: boolean;

  /** Additional class name for the header wrapper element. */
  headerClass?: ClassValue;

  /** Additional class name for the footer wrapper element. */
  footerClass?: ClassValue;

  /** Additional class name for the list wrapper element. */
  listClass?: ClassValue;

  /** Additional class for the popover dialog element. */
  dialogClass?: ClassValue;

  /** slot for popover header */
  header?: ReactNode;

  /** slot for popover list */
  list?: ReactNode;

  /** slot for popover footer */
  footer?: ReactNode;

  /** Fired as the user types, with the input's text (Vue's `update:modelValue`). */
  onValueChange?: (value: string) => void;

  /** Event fired when item selected, with the highlighted index. */
  onSelect?: (index: number) => void;

  /** Event fired when item removed */
  onRemove?: (item: string) => void;

  /** Event fired when max selected items limit is reached */
  onMaxSelected?: () => void;

  /**
   * Native keydown event fired when a key is pressed in the text input.
   * For the common Escape and Enter cases, listen to `onEscape` / `onEnter` instead.
   */
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;

  /** Native keydown event fired when a key is pressed while a chip is focused. */
  onChipKeyDown?: (event: KeyboardEvent<ChipElement>) => void;

  /**
   * Fired when Escape is pressed in the text input.
   * Not fired when a chip is focused.
   */
  onEscape?: (event: KeyboardEvent<HTMLInputElement>) => void;

  /**
   * Fired when Enter is pressed in the text input.
   * Not fired when a chip is focused.
   */
  onEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;

  /** Event fired when combobox item is highlighted, with its index. */
  onComboboxHighlight?: (index: number) => void;
}

/** Vue's `extractVueListeners($attrs)`: every other handler goes to the native input. */
type InputListeners = Omit<DOMAttributes<HTMLInputElement>,
  'children' | 'dangerouslySetInnerHTML' | keyof DtComboboxMultiSelectOwnProps>;

/** Vue's `extractNonListeners($attrs)`: every other attribute (and DtComboboxWithPopover prop) goes to it. */
type ComboboxAttrs = Omit<DtComboboxWithPopoverProps,
  keyof DtComboboxMultiSelectOwnProps | `on${string}` | 'input'>;

/**
 * Like Vue's `$attrs`: handlers (`on*`) go to the text input; every other attribute, `className`, `style` and `ref`
 * included, goes to DtComboboxWithPopover, which puts it on its root.
 */
export type DtComboboxMultiSelectProps = DtComboboxMultiSelectOwnProps & ComboboxAttrs & InputListeners;

const isListener = (key: string) => /^on[A-Z]/.test(key);

function getComputedPx (el: Element, property: 'paddingTop' | 'rowGap'): number {
  return parseFloat(getComputedStyle(el)[property]) || 0;
}

function getFullWidth (el: HTMLElement): number {
  const styles = window.getComputedStyle(el);
  return el.offsetWidth + parseInt(styles.marginLeft) + parseInt(styles.marginRight);
}

/**
 * A combobox that lets the user pick several items, shown as chips inside its input.
 * @see https://dialtone.dialpad.com/components/combobox_multi_select.html
 */
export function DtComboboxMultiSelect ({
  label,
  showLabel = true,
  description = '',
  placeholder = 'Select one or start typing',
  inputMessages = NO_MESSAGES,
  showInputMessages = true,
  loading = false,
  loadingMessage = 'loading...',
  showList = null,
  listMaxHeight = '300px',
  selectedItems = NO_ITEMS,
  maxSelected = 0,
  maxSelectedMessage = NO_MESSAGES,
  hasSuggestionList = true,
  size = 300,
  appendTo = 'body',
  transition = 'fade',
  collapseOnFocusOut = false,
  listMaxWidth = '',
  reservedRightSpace = 64,
  chipMaxWidth = '',
  inputClass = '',
  inputWrapperClass = '',
  disabled = false,
  headerClass = '',
  footerClass = '',
  listClass = '',
  dialogClass = '',
  header,
  list,
  footer,
  onValueChange,
  onSelect,
  onRemove,
  onMaxSelected,
  onKeyDown,
  onChipKeyDown,
  onEscape,
  onEnter,
  onComboboxHighlight,
  onInput,
  onClick,
  openWithArrowKeys = false,
  ...rest
}: DtComboboxMultiSelectProps) {
  const [value, setValue] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [hideInputText, setHideInputText] = useState(false);
  // Counts focusins while collapseOnFocusOut is set, each of which re-pads the input once it has rendered.
  const [focusInCount, setFocusInCount] = useState(0);
  const messagesId = useId();

  const inputRef = useRef<InputElement | null>(null);
  const inputSlotWrapperRef = useRef<HTMLSpanElement>(null);
  const chipsWrapperRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Each chip's button, by index in selectedItems, so lookups never depend on stale DOM order.
  const chipButtonsRef = useRef<(ChipElement | null)[]>([]);
  // Vue's initialInputHeight and inputVisibilityObserver data: only the measuring code reads them.
  const initialInputHeight = useRef<number | null>(null);
  const inputVisibilityObserver = useRef<ResizeObserver | null>(null);

  const comboboxAttrs: Record<string, unknown> = {};
  const inputListeners: Record<string, unknown> = {};
  for (const [key, attr] of Object.entries(rest)) {
    (isListener(key) ? inputListeners : comboboxAttrs)[key] = attr;
  }

  // DtComboboxWithPopover only opens and closes its list itself while its showList is null, and has no handle to do
  // it from outside, as Vue's `$refs.comboboxWithPopover.showComboboxList()` does. So this component keeps that state
  // (mirrored back through onOpened, when the popover closes itself) and does what DtComboboxWithPopover would.
  const [listShown, setListShown] = useState(false);

  // Applied in a microtask, so it renders at React's default priority. The popover reports each time it finishes
  // opening or closing through onOpenChange, from a microtask, with the value DtComboboxWithPopover already holds, and
  // React queues that update without rendering. A showList change rendered at a higher priority (in a keydown or click)
  // skips the queued update, and the state DtComboboxWithPopover sets during that render to follow showList is then
  // lost: the list closes and opens again at once. At default priority, both are rendered together.
  const changeListShown = (shown: boolean) => {
    queueMicrotask(() => setListShown(shown));
  };

  const showComboboxList = () => {
    if (showList != null) return;
    changeListShown(true);
  };

  const closeComboboxList = () => {
    if (showList != null) return;
    changeListShown(false);
  };

  // Vue's showValidationMessages, which checkMaxSelected sets whenever selectedItems changes; derived here.
  const showValidationMessages = maxSelected !== 0 && selectedItems.length > maxSelected;
  const inputPlaceHolder = selectedItems.length > 0 ? '' : placeholder;
  const ariaInvalid = getValidationState(maxSelectedMessage) === VALIDATION_MESSAGE_TYPES.CRITICAL ? 'true' : undefined;
  const ariaDescribedBy = showValidationMessages && maxSelectedMessage.length > 0 ? messagesId : undefined;
  const sizeName = COMPONENT_SIZES[String(size)] || size;
  const chipWrapperClass = [
    // Always emitted so the CSS can size the row rhythm without reaching
    // sideways into DtInput's markup to discover the size.
    `d-combobox-multi-select__chip-wrapper--${sizeName}`,
    { [`d-combobox-multi-select__chip-wrapper-${sizeName}--collapsed`]: !inputFocused && collapseOnFocusOut },
  ];

  // Sizes other than xs need a height floor so the box can grow for wrapped
  // chip rows without collapsing back; xs renders correctly without one.
  const inputHeightFloor = () => (
    (initialInputHeight.current && size !== 'xs') ? `${initialInputHeight.current}px` : ''
  );

  const getInput = () => inputRef.current;

  const getChipButtons = (): ChipElement[] | null => {
    if (!selectedItems.length) return null;
    return chipButtonsRef.current.slice(0, selectedItems.length).filter(el => el !== null);
  };

  const getChips = (): HTMLElement[] | null => {
    const buttons = getChipButtons();
    return buttons && buttons.map(button => button.parentElement).filter(el => el !== null);
  };

  const getLastChipButton = () => {
    const chipButtons = getChipButtons();
    return chipButtons && chipButtons[chipButtons.length - 1];
  };

  const getLastChip = () => {
    const chips = getChips();
    return chips && chips[chips.length - 1];
  };

  const getFirstChip = () => {
    const chips = getChips();
    return chips && chips[0];
  };

  const setChipsTopPosition = () => {
    // Centers the first row of chips on the input box's first line.
    // Two offsets have to be measured rather than derived: the input's
    // position within the slot wrapper (label and description heights vary),
    // and the chip's position within its own wrapper (the chips are atomic
    // inline boxes, so line-box metrics — not just the chip margin — decide
    // where the row starts).
    const input = getInput();
    const chipsWrapper = chipsWrapperRef.current;
    const inputSlotWrapper = inputSlotWrapperRef.current;
    const firstChip = getFirstChip();
    if (!input || !chipsWrapper || !inputSlotWrapper || !firstChip) return;

    const inputTop = input.getBoundingClientRect().top - inputSlotWrapper.getBoundingClientRect().top;
    // The empty-input height, so chips stay on the first line rather than
    // recentering on the whole box once it grows to fit wrapped rows.
    const inputRowHeight = initialInputHeight.current || input.getBoundingClientRect().height;
    const chipRect = firstChip.getBoundingClientRect();
    const chipOffsetInWrapper = chipRect.top - chipsWrapper.getBoundingClientRect().top;

    const top = inputTop + (inputRowHeight - chipRect.height) / 2 - chipOffsetInWrapper;
    chipsWrapper.style.top = top + 'px';
  };

  const revertInputPadding = (input: InputElement) => {
    input.style.paddingInlineStart = '';
    // setInputPadding writes the physical paddingTop slot, so that is the
    // slot to clear — the logical one is a different CSSOM property.
    input.style.paddingTop = '';
    // Restore the single-row height floor that setInitialInputHeight
    // applies (setInputPadding grows it while rows are wrapped).
    input.style.minHeight = inputHeightFloor();
  };

  const growInputForWrappedRows = (input: InputElement, caretRowTop: number) => {
    // The grown box would otherwise end at the caret line, leaving the last
    // chip row flush against the block-end border (aka bottom). Extend the height floor
    // so the last row keeps the same breathing room the first row gets from
    // centering: its row top plus the single-row envelope.
    if (!initialInputHeight.current) return;
    input.style.minHeight = `${caretRowTop + initialInputHeight.current}px`;
  };

  // Distance from the first chip row to the row the caret belongs on.
  const getCaretRowTop = (
    lastChip: HTMLElement,
    firstChip: HTMLElement | null,
    hasSpace: boolean,
    isWrapped: boolean,
  ) => {
    // Chip fits beside the cursor on the first row; CSS centers it already.
    if ((hasSpace && !isWrapped) || !firstChip) return null;
    // Measured rather than offsetTop, which rounds to whole pixels and drifts
    // further out of alignment with every row added.
    const rowTop = lastChip.getBoundingClientRect().top - firstChip.getBoundingClientRect().top;
    // Chip wrapped onto a new row with space remaining; share that row.
    if (hasSpace) return rowTop;
    // No space left on that row — predict the next one. Row spacing belongs
    // to the wrapper's row-gap, not to the chip.
    const rowGap = chipsWrapperRef.current ? getComputedPx(chipsWrapperRef.current, 'rowGap') : 0;
    return rowTop + lastChip.getBoundingClientRect().height + rowGap;
  };

  const setInputPadding = () => {
    const lastChip = getLastChip();
    const input = getInput();
    if (!input) return;
    revertInputPadding(input);
    if (!lastChip) return;
    // Avoid adding extra padding when the input is not focused if collapseOnFocusOut is true
    // This ensures the input returns to its original state when resizing
    if (collapseOnFocusOut && !inputFocused) return;

    // Read while revertInputPadding() above has the inline override cleared,
    // so this is the input's own padding rather than a previous run's value.
    const inputPaddingTop = getComputedPx(input, 'paddingTop');

    // Get the position of the last chip
    // The input cursor should be the same "top" as that chip and next besides it
    const left = lastChip.offsetLeft + getFullWidth(lastChip);
    const spaceLeft = input.getBoundingClientRect().width - left;
    const firstChip = getFirstChip();
    const isWrapped = !!firstChip && lastChip.offsetTop > firstChip.offsetTop;

    if (spaceLeft > reservedRightSpace) {
      input.style.paddingInlineStart = left + 'px';
    } else {
      input.style.paddingInlineStart = '4px';
    }

    const caretRowTop = getCaretRowTop(lastChip, firstChip, spaceLeft > reservedRightSpace, isWrapped);
    if (caretRowTop != null) {
      // Adding the input's own padding reproduces the single-row layout on
      // the caret's row, so the typed text keeps the same baseline relative
      // to the chips beside it no matter how many rows have accumulated.
      input.style.paddingTop = `${caretRowTop + inputPaddingTop}px`;
      growInputForWrappedRows(input, caretRowTop);
    }
  };

  const setInputMinWidth = () => {
    // Ensure the width of the input is "slightly bigger" than the width of a single chip
    const firstChip = getFirstChip();
    const input = getInput();
    if (!input) return;
    if (firstChip) {
      // Add 4px buffer for typing room
      input.style.minWidth = (getFullWidth(firstChip) + 4) + 'px';
    } else {
      input.style.minWidth = '';
    }
  };

  const setInitialInputHeight = () => {
    const input = getInput();
    if (!input) return;
    input.style.minHeight = '';
    input.style.height = '';
    initialInputHeight.current = input.getBoundingClientRect().height;
    // xs renders correctly without a min-height floor; other sizes need it to grow when chips wrap.
    if (size !== 'xs') {
      input.style.minHeight = `${initialInputHeight.current}px`;
      input.style.height = 'auto';
    }
  };

  const onBodyResize = useEffectEvent(() => {
    setChipsTopPosition();
    setInputPadding();
  });

  const onInputResize = useEffectEvent(() => {
    if (initialInputHeight.current) return;
    setInitialInputHeight();
    if (!initialInputHeight.current) return;
    setInputPadding();
    setChipsTopPosition();
    inputVisibilityObserver.current?.disconnect();
    inputVisibilityObserver.current = null;
  });

  const measureInitialInputHeight = useEffectEvent(() => setInitialInputHeight());

  // Vue's mounted() and beforeUnmount().
  useLayoutEffect(() => {
    measureInitialInputHeight();
    // Recalculate chip position and input padding when resizing window
    const resizeWindowObserver = new ResizeObserver(() => onBodyResize());
    resizeWindowObserver.observe(document.body);

    // The measurement above can land on a zero-size input — for example it's inside a collapsed
    // panel or a not-yet-visible tab. Nothing else is guaranteed to react once the input later
    // becomes visible: revealing it doesn't necessarily resize document.body, and with the
    // default collapseOnFocusOut: false, focusing the input doesn't recompute anything either.
    // Watch the input's own box directly so we can recover the instant it actually gets real
    // layout, instead of depending on some other call site to happen to run again.
    const input = inputRef.current;
    if (!initialInputHeight.current && input) {
      inputVisibilityObserver.current = new ResizeObserver(() => onInputResize());
      inputVisibilityObserver.current.observe(input);
    }

    return () => {
      resizeWindowObserver.unobserve(document.body);
      inputVisibilityObserver.current?.disconnect();
      inputVisibilityObserver.current = null;
    };
  }, []);

  // Vue's size watcher, which doesn't run on mount.
  const onSizeChange = useEffectEvent(() => {
    const input = getInput();
    if (input) revertInputPadding(input);
    setInitialInputHeight();
    setInputPadding();
    setChipsTopPosition();
  });
  const previousSize = useRef(size);
  useLayoutEffect(() => {
    if (previousSize.current === size) return;
    previousSize.current = size;
    onSizeChange();
  }, [size]);

  // Vue's initSelectedItems: on mount, and from the deep selectedItems and the chipMaxWidth watchers.
  const itemsKey = JSON.stringify(selectedItems);
  const checkedMaxSelectedFor = useRef<string | null>(null);
  const initSelectedItems = useEffectEvent(() => {
    setInputPadding();
    setChipsTopPosition();
    setInputMinWidth();
    // checkMaxSelected. The ref keeps StrictMode's second run from reporting the same items twice.
    const checkKey = `${itemsKey}|${chipMaxWidth}`;
    if (checkedMaxSelectedFor.current === checkKey) return;
    checkedMaxSelectedFor.current = checkKey;
    if (maxSelected !== 0 && selectedItems.length > maxSelected) onMaxSelected?.();
  });
  useLayoutEffect(() => {
    initSelectedItems();
  }, [itemsKey, chipMaxWidth]);

  // Vue's label and description watchers: adjust the chips position if either changed.
  const repositionChips = useEffectEvent(() => setChipsTopPosition());
  useLayoutEffect(() => {
    repositionChips();
  }, [label, description]);

  // The second half of Vue's handleInputFocusIn, after its nextTick.
  const padFocusedInput = useEffectEvent(() => setInputPadding());
  useLayoutEffect(() => {
    if (focusInCount > 0) padFocusedInput();
  }, [focusInCount]);

  // DtComboboxWithPopover's window mousedown listener: closes the list on a mousedown outside the input and the
  // popover, while it's shown.
  const onWindowMouseDown = useEffectEvent((event: MouseEvent) => {
    const popoverEl = listRef.current?.closest('[data-tippy-root]');
    const comboboxEl = inputSlotWrapperRef.current?.parentElement;
    if (event.composedPath().some(el => el === popoverEl || el === comboboxEl)) return;
    closeComboboxList();
  });
  useEffect(() => {
    if (!listShown || showList != null) return undefined;
    const listener = (event: MouseEvent) => onWindowMouseDown(event);
    window.addEventListener('mousedown', listener);
    return () => window.removeEventListener('mousedown', listener);
  }, [listShown, showList]);

  const handleDisplayList = (next: string) => {
    if (!hasSuggestionList && next) showComboboxList();
    if (!hasSuggestionList && !next) closeComboboxList();
  };

  const onComboboxSelect = (i: number) => {
    if (!loading) {
      setValue('');
      onSelect?.(i);
    }
    // DtComboboxWithPopover's: we don't display the list before the user has typed anything
    if (!hasSuggestionList) closeComboboxList();
  };

  const onChipRemove = (item: string) => {
    onRemove?.(item);
    getInput()?.focus();
  };

  const moveFromInputToChip = () => {
    getLastChipButton()?.focus();
    getInput()?.blur();
    closeComboboxList();
  };

  const moveFromChipToInput = () => {
    getLastChipButton()?.blur();
    getInput()?.focus();
    showComboboxList();
  };

  const navigateBetweenChips = (target: EventTarget, toLeft: boolean) => {
    const chipButtons = getChipButtons() ?? [];
    const from = chipButtons.findIndex(button => button === target);
    const to = toLeft ? from - 1 : from + 1;
    if (to < 0 || to >= selectedItems.length) {
      return;
    }
    chipButtons[from]?.blur();
    chipButtons[to]?.focus();
    closeComboboxList();
  };

  const navigateFromChip = (event: KeyboardEvent<ChipElement>) => {
    const key = event.code?.toLowerCase();
    if (key === 'arrowleft') {
      // Move to the previous chip
      navigateBetweenChips(event.target, true);
    } else if (key === 'arrowright') {
      if ((event.target as Element).id === getLastChipButton()?.id) {
        // Move to the input if it's the last chip
        moveFromChipToInput();
      } else {
        // Move to the next chip
        navigateBetweenChips(event.target, false);
      }
    }
  };

  // Vue's chipListeners, then its `@keydown.backspace`, which runs even when disabled.
  const handleChipKeyDown = (event: KeyboardEvent<ChipElement>, item: string) => {
    if (!disabled) {
      navigateFromChip(event);
      onChipKeyDown?.(event);
    }
    if (event.key === 'Backspace') onChipRemove(item);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const key = event.key?.toLowerCase();
    const target = event.currentTarget;
    // If the cursor is at the start of the text,
    // press 'backspace' or 'left' focuses the last chip
    if (selectedItems.length > 0 && target.selectionStart === 0) {
      // if there is selected text, do not focus the last chip
      if (target.selectionEnd !== target.selectionStart) {
        return;
      }
      if (key === 'backspace' || key === 'arrowleft') {
        moveFromInputToChip();
      }
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    onInputKeyDown(event);
    onKeyDown?.(event);
    // Use event.key (not event.code) so NumpadEnter normalizes to 'Enter'
    // and consumers don't have to special-case the numpad.
    const key = event.key?.toLowerCase();
    if (key === 'escape') {
      onEscape?.(event);
    } else if (key === 'enter') {
      onEnter?.(event);
    }
  };

  const handleInput = (event: InputEvent<InputElement>) => {
    onValueChange?.(event.currentTarget.value);
    if (hasSuggestionList) showComboboxList();
    // DtInput is typed for a textarea too, but renders an <input> here: its type is never 'textarea'.
    onInput?.(event as InputEvent<HTMLInputElement>);
  };

  const handleInputClick = (event: ReactMouseEvent<HTMLInputElement>) => {
    if (hasSuggestionList) showComboboxList();
    onClick?.(event);
  };

  const handleValueChange = (next: string | string[]) => {
    const text = String(next);
    setValue(text);
    handleDisplayList(text);
  };

  const handleInputFocusIn = (event: FocusEvent<HTMLSpanElement>) => {
    // DtComboboxWithPopover's: only when it's the input specifically that was focused
    if (hasSuggestionList && event.target === getInput()) showComboboxList();
    setInputFocused(true);
    if (collapseOnFocusOut) {
      setHideInputText(false);
      setFocusInCount(count => count + 1);
    }
  };

  const handleInputFocusOut = () => {
    setInputFocused(false);
    if (collapseOnFocusOut) {
      setHideInputText(true);
      const input = getInput();
      if (!input) return;
      // Hide the input text when is not on first line
      if (!input.style.paddingTop) {
        return;
      }
      revertInputPadding(input);
    }
  };

  // DtComboboxWithPopover's openOnArrowKeyPress.
  const openOnArrowKeyPress = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    if (showList !== null || listShown || !openWithArrowKeys) return;
    showComboboxList();
  };

  return (
    <DtComboboxWithPopover
      label={label}
      showList={showList ?? listShown}
      maxHeight={listMaxHeight}
      maxWidth={listMaxWidth}
      popoverOffset={POPOVER_OFFSET}
      hasSuggestionList={hasSuggestionList}
      contentWidth="anchor"
      appendTo={appendTo}
      dialogClass={dialogClass}
      transition={transition}
      {...comboboxAttrs}
      onSelect={onComboboxSelect}
      onHighlight={index => onComboboxHighlight?.(index)}
      onEscape={closeComboboxList}
      onOpened={setListShown}
      input={(
        <span
          ref={inputSlotWrapperRef}
          className="d-combobox-multi-select__input-wrapper"
          onFocus={handleInputFocusIn}
          onBlur={handleInputFocusOut}
          onKeyDown={openOnArrowKeyPress}
        >
          <span
            ref={chipsWrapperRef}
            className={cx('d-combobox-multi-select__chip-wrapper', chipWrapperClass)}
          >
            {selectedItems.map((item, index) => (
              <DtChip
                key={`${index}-${item}`}
                ref={(el) => { chipButtonsRef.current[index] = el; }}
                interactive
                labelClass={['d-chip__label--focus-always']}
                className={cx(
                  'd-combobox-multi-select__chip',
                  { 'd-combobox-multi-select__chip--truncate': !!chipMaxWidth },
                )}
                style={chipMaxWidth ? { maxWidth: chipMaxWidth } : undefined}
                size={CHIP_SIZE_OF[String(size)]}
                disabled={disabled}
                onKeyDown={event => handleChipKeyDown(event, item)}
                onClose={() => onChipRemove(item)}
              >
                {item}
              </DtChip>
            ))}
          </span>

          <DtInput
            ref={inputRef}
            value={value}
            onValueChange={handleValueChange}
            className="d-combobox-multi-select__input"
            inputClass={[inputClass, { 'd-combobox-multi-select__input--hidden': hideInputText }]}
            inputWrapperClass={inputWrapperClass}
            disabled={disabled}
            aria-label={label}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            label={showLabel ? label : ''}
            description={description}
            placeholder={inputPlaceHolder}
            showMessages={showInputMessages}
            messages={inputMessages}
            size={size}
            {...inputListeners}
            onInput={handleInput}
            onKeyDown={handleInputKeyDown}
            onClick={handleInputClick}
          />

          <DtValidationMessages
            id={messagesId}
            validationMessages={maxSelectedMessage}
            showMessages={showValidationMessages}
          />
        </span>
      )}
      header={hasContent(header)
        ? <div className={cx(headerClass) || undefined}>{header}</div>
        : undefined}
      list={(
        <div
          ref={listRef}
          className={cx('d-combobox-multi-select__list', listClass)}
          onMouseDown={event => event.preventDefault()}
        >
          {!loading
            ? list
            : (
              <div className="d-combobox-multi-select__list--loading">
                {loadingMessage}
              </div>
            )}
        </div>
      )}
      footer={hasContent(footer)
        ? <div className={cx(footerClass) || undefined}>{footer}</div>
        : undefined}
    />
  );
}
