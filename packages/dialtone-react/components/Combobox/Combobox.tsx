import {
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { ClassValue } from '../../common/cx';
import {
  HighlightIdContext,
  useKeyboardListNavigation,
  type KeyboardListNavigationState,
} from '../../common/keyboard-list-navigation';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import { ComboboxEmptyList } from './ComboboxEmptyList';
import { ComboboxLoadingList } from './ComboboxLoadingList';
import type { ComboboxSize } from './ComboboxConstants';

/** What the `input` slot gets as `inputProps`: bind them on the input, as Vue's `v-bind="inputProps"`. */
export interface DtComboboxInputProps {
  label: string;
  showLabel: boolean;
  size: ComboboxSize | null;
  description: string;
  role: 'combobox';
  'aria-label': string;
  'aria-expanded': 'true' | 'false';
  'aria-owns': string;
  'aria-haspopup': 'listbox';
  'aria-activedescendant': string | undefined;
  'aria-controls': string;
}

/** What the `list` slot gets as `listProps`: spread them on the list element. */
export interface DtComboboxListProps {
  role: 'listbox';
  id: string;
  // The list has to be positioned relatively so that the auto-scroll can
  // calculate the correct offset for the list items.
  className: 'd-ps-relative';
  'aria-label': string;
}

export interface DtComboboxListScope {
  listProps: DtComboboxListProps;
  /**
   * Call it when a list rendered outside the component (in a popover) opens or closes, with that list's element:
   * the combobox then navigates it and emits `onOpened`.
   */
  opened: (open: boolean, contentRef?: HTMLElement | null) => void;
  clearHighlightIndex: () => void;
}

interface DtComboboxOwnProps {
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
   * Sets an ID on the list element of the component. Used by several aria attributes
   * as well as when deriving the IDs for each item. Defaults to a generated unique id.
   */
  listId?: string;

  /** A method that will be called when the selection goes past the beginning of the list. */
  onBeginningOfList?: (() => void) | null;

  /** A method that will be called when the selection goes past the end of the list. */
  onEndOfList?: (() => void) | null;

  /**
   * Determines when to show the list element and also controls the aria-expanded attribute.
   * @values true, false
   */
  showList?: boolean;

  /**
   * If the list is rendered outside the component, like when using popover as the list wrapper.
   * @values true, false
   */
  listRenderedOutside?: boolean;

  /**
   * Determines when to show the skeletons and also controls aria-busy attribute.
   * @values true, false
   */
  loading?: boolean;

  /**
   * Sets the list to an empty state, and displays the message from prop `emptyStateMessage`.
   * @values true, false
   */
  emptyList?: boolean;

  /** Message to show when the list is empty */
  emptyStateMessage?: string;

  /**
   * Additional class name for the empty list element.
   * Same API as Vue's class binding: a string, an object or an array.
   */
  emptyStateClass?: ClassValue;

  /**
   * Programmatically click on the active list item element when a selection
   * comes from keyboard navigation, i.e. pressing the "Enter" key.
   * @values true, false
   */
  clickOnSelect?: boolean;

  /** Slot for the combobox input element */
  input?: SlotProp<{ inputProps: DtComboboxInputProps }>;

  /** Slot for the combobox list element */
  list?: SlotProp<DtComboboxListScope>;

  /** Slot for the empty list item. Defaults to the `emptyStateMessage` prop. It's shown when `emptyList` is true. */
  emptyListItem?: ReactNode;

  /** Event fired when item selected, with the highlighted index. */
  onSelect?: (index: number) => void;

  /** Event fired when pressing escape */
  onEscape?: () => void;

  /** Event fired when the highlight changes, with the new index. */
  onHighlight?: (index: number) => void;

  /** Event fired when list is shown or hidden */
  onOpened?: (open: boolean) => void;

  /** Key down event. The combobox handles its navigation keys first. */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/** Like Vue's `$attrs`, every other attribute goes on the root element, `ref` included. */
export type DtComboboxProps = DtComboboxOwnProps & Omit<ComponentPropsWithRef<'div'>, keyof DtComboboxOwnProps>;

type NavigationKey = 'onEscapeKey' | 'onEnterKey' | 'onUpKey' | 'onDownKey' | 'onHomeKey' | 'onEndKey';

const EMPTY_LIST_ERROR = `Invalid props: you must pass both props emptyList and emptyStateMessage to show the
      empty message.`;

/**
 * A combobox is a semantic component that displays an input element combined with a listbox,
 * which enables the user to select items from the list.
 * @see https://dialtone.dialpad.com/components/combobox.html
 */
export function DtCombobox ({
  label,
  showLabel = true,
  size = null,
  description = '',
  listId: listIdProp,
  onBeginningOfList = null,
  onEndOfList = null,
  showList = false,
  listRenderedOutside = false,
  loading = false,
  emptyList = false,
  emptyStateMessage = '',
  emptyStateClass = '',
  clickOnSelect = false,
  input,
  list,
  emptyListItem,
  onSelect,
  onEscape,
  onHighlight,
  onOpened,
  onKeyDown,
  ...rest
}: DtComboboxProps) {
  const generatedId = useId();
  const listId = listIdProp ?? generatedId;
  const listWrapperRef = useRef<HTMLDivElement>(null);

  // If the list is rendered at the root, rather than as a child of this component, this is that DOM element,
  // set by the list slot's `opened`. The ref is for reading it at once, as Vue's data is; the state attaches
  // the mousemove listener to it.
  const outsideListRef = useRef<HTMLElement | null>(null);
  const [outsideList, setOutsideList] = useState<HTMLElement | null>(null);

  const getListElement = (): HTMLElement | null | undefined => (
    outsideListRef.current ?? listWrapperRef.current?.querySelector<HTMLElement>(`#${listId}`)
  );

  const nav: KeyboardListNavigationState = useKeyboardListNavigation({
    getListElement,
    getActiveItem: highlightId => getActiveItem(highlightId),
    afterHighlightMethod: index => {
      if (loading) return;
      onHighlight?.(index);
    },
    beginningOfListMethod: onBeginningOfList || (() => nav.jumpToEnd()),
    endOfListMethod: onEndOfList || (() => nav.jumpToBeginning()),
  });

  function getActiveItem (highlightId: string | undefined): HTMLElement | null | undefined | '' {
    if (!highlightId) return '';
    return getListElement()?.querySelector<HTMLElement>(`#${highlightId}`);
  }

  const activeItemId = (!showList || nav.highlightIndex < 0 || loading) ? undefined : nav.highlightId;

  const inputProps: DtComboboxInputProps = {
    label,
    showLabel,
    size,
    description,
    role: 'combobox',
    'aria-label': label,
    'aria-expanded': showList ? 'true' : 'false',
    'aria-owns': listId,
    'aria-haspopup': 'listbox',
    'aria-activedescendant': activeItemId,
    'aria-controls': listId,
  };

  const listProps: DtComboboxListProps = {
    role: 'listbox',
    id: listId,
    className: 'd-ps-relative',
    'aria-label': label,
  };

  const onMouseHighlight = (event: Event | { target: EventTarget | null }) => {
    if (loading) return;

    const liElement = (event.target as Element | null)?.closest('li');

    if (liElement && nav.highlightId !== liElement.id) {
      nav.setHighlightId(liElement.id);
    }
  };

  const clearHighlightIndex = () => {
    if (showList && getListElement()) {
      nav.setHighlightIndex(-1);
    }
  };

  // Vue's setInitialHighlightIndex runs its body on nextTick, after the list renders; callers here run it after
  // the commit (from a layout effect), or once the list element is known (`opened`).
  const setInitialHighlightIndex = () => {
    // The list may have closed, or when rendered outside its element is unreachable until the popover's enter
    // transition completes (DLT-3520).
    if (!showList || !getListElement()) return;
    // When the list's is shown, reset the highlight index.
    // If the list is loading, set to -1
    nav.setHighlightIndex(loading ? -1 : 0);
  };

  const onEnterKey = () => {
    if (loading || emptyList) return;

    if (nav.highlightIndex >= 0) {
      onSelect?.(nav.highlightIndex);

      if (clickOnSelect) {
        const activeItemEl = getActiveItem(nav.highlightId);
        if (activeItemEl) activeItemEl.click();
      }
    }
  };

  const onOpen = (open: boolean, contentRef?: HTMLElement | null) => {
    outsideListRef.current = contentRef ?? null;
    setOutsideList(contentRef ?? null);
    onOpened?.(open);

    if (open) {
      setInitialHighlightIndex();
    }
  };

  const keyHandlers: Record<NavigationKey, () => void> = {
    onEscapeKey: () => onEscape?.(),
    onEnterKey,
    onUpKey: nav.onUpKey,
    onDownKey: nav.onDownKey,
    onHomeKey: nav.onHomeKey,
    onEndKey: nav.onEndKey,
  };

  const onKeyValidation = (eventHandler: NavigationKey) => {
    if (!showList || !getListElement()) return;

    keyHandlers[eventHandler]();
  };

  // Vue's @keydown.esc.stop, .enter.exact, and .up/.down/.home/.end.stop.prevent.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'Escape':
      case 'Esc':
        event.stopPropagation();
        onKeyValidation('onEscapeKey');
        break;
      case 'Enter':
        if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          onKeyValidation('onEnterKey');
        }
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Home':
      case 'End': {
        event.stopPropagation();
        event.preventDefault();
        const handlers = { ArrowUp: 'onUpKey', ArrowDown: 'onDownKey', Home: 'onHomeKey', End: 'onEndKey' } as const;
        onKeyValidation(handlers[event.key]);
        break;
      }
    }
    onKeyDown?.(event);
  };

  // Vue's mousemove listener on the list rendered outside, added by `opened` and removed when the list hides.
  const onOutsideMouseMove = useEffectEvent((event: MouseEvent) => onMouseHighlight(event));
  useEffect(() => {
    if (!outsideList) return;
    const listener = (event: MouseEvent) => onOutsideMouseMove(event);
    outsideList.addEventListener('mousemove', listener);
    return () => outsideList.removeEventListener('mousemove', listener);
  }, [outsideList]);

  // Vue's showList watcher (not immediate, so not on mount). It runs after the commit, where Vue's emit runs
  // before its render and its highlight reset on nextTick: `onOpened` is called first, as in Vue.
  const onShowListChange = useEffectEvent(() => {
    if (!listRenderedOutside) {
      onOpened?.(showList);
      setInitialHighlightIndex();
    }

    if (!showList && outsideListRef.current) {
      outsideListRef.current = null;
      setOutsideList(null);
    }
  });
  const previousShowList = useRef(showList);
  useLayoutEffect(() => {
    if (previousShowList.current === showList) return;
    previousShowList.current = showList;
    onShowListChange();
  }, [showList]);

  // Vue's loading watcher, which resets the highlight once the loading or the real list has rendered.
  const onLoadingChange = useEffectEvent(() => setInitialHighlightIndex());
  const previousLoading = useRef(loading);
  useLayoutEffect(() => {
    if (previousLoading.current === loading) return;
    previousLoading.current = loading;
    onLoadingChange();
  }, [loading]);

  // Vue's validateEmptyListProps, from created() and a deep $props watcher. This logs when the props become
  // invalid, so neither StrictMode nor an unrelated prop change repeats it.
  const invalidEmptyList = emptyListItem === undefined && emptyList && !emptyStateMessage;
  const loggedInvalidEmptyList = useRef(false);
  useEffect(() => {
    if (invalidEmptyList && !loggedInvalidEmptyList.current) {
      console.error(EMPTY_LIST_ERROR);
    }
    loggedInvalidEmptyList.current = invalidEmptyList;
  }, [invalidEmptyList]);

  let listContent: ReactNode;
  if (loading && !listRenderedOutside) {
    listContent = <ComboboxLoadingList {...listProps} />;
  } else if (emptyList && (emptyStateMessage || hasContent(emptyListItem)) && !listRenderedOutside) {
    listContent = (
      <ComboboxEmptyList {...listProps} message={emptyStateMessage} itemClass={emptyStateClass}>
        {emptyListItem}
      </ComboboxEmptyList>
    );
  } else {
    listContent = renderSlot(list, { listProps, opened: onOpen, clearHighlightIndex });
  }

  return (
    <HighlightIdContext.Provider value={nav.highlightIdContext}>
      <div {...rest} onKeyDown={handleKeyDown}>
        <div data-qa="dt-combobox-input-wrapper">
          {renderSlot(input, { inputProps })}
        </div>

        {showList && (
          <div
            ref={listWrapperRef}
            data-qa="dt-combobox-list-wrapper"
            onMouseLeave={clearHighlightIndex}
            onBlur={clearHighlightIndex}
            onMouseMoveCapture={onMouseHighlight}
          >
            {listContent}
          </div>
        )}
      </div>
    </HighlightIdContext.Provider>
  );
}
