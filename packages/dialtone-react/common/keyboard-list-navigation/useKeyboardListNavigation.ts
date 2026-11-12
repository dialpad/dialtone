import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { scrollElementIntoViewIfNeeded } from './dom';
import type { HighlightIdContextValue } from './HighlightIdContext';

const ERROR_INVALID_LIST_ELEMENT = (
  'listElementKey is required or the referenced ' +
  'element doesn\'t exist. Received listElement: '
);

/**
 * Vue's `keyboardNavigationMixin(options)`. Its `*Key` options, which name a data field or a method of the
 * component, become the values themselves: `listElementKey` → `getListElement`, `activeItemKey` → `getActiveItem`,
 * and the `*Method` options take the function. `indexKey` and `idKey` only renamed the fields, so the hook always
 * returns `highlightIndex` and `highlightId`.
 */
export interface KeyboardListNavigationOptions {
  /**
   * Role of the list items in the component. This is used to identify the list items
   * so you must update this if the role of your list items is anything other than 'option'.
   */
  listItemRole?: string;
  /** Returns the list element. */
  getListElement: () => HTMLElement | null | undefined;
  /**
   * Optional. Returns the currently active item element, given the id of the highlighted item (the one just set,
   * where Vue's `activeItemKey` computed was re-evaluated at once).
   */
  getActiveItem?: (highlightId: string | undefined) => HTMLElement | null | undefined | '';
  /** Optional. Toggles the list's visibility; called with `true` when up or down is pressed. */
  openMethod?: ((open: boolean) => void) | null;
  /** Optional. Called with the new index when the highlight changes. */
  afterHighlightMethod?: ((index: number) => void) | null;
  /** Optional. Called when the highlight goes past the beginning of the list. */
  beginningOfListMethod?: (() => void) | null;
  /** Optional. Called when the highlight goes past the end of the list. */
  endOfListMethod?: (() => void) | null;
  /** Scroll the active element into view when highlighted by a keyboard event. */
  scrollToOnHighlight?: boolean;
  /** Focus the active element on keyboard navigation. */
  focusOnKeyboardNavigation?: boolean;
}

export interface KeyboardListNavigationState {
  /** The highlighted item's index in the list; -1 when none. */
  highlightIndex: number;
  /** The highlighted item's id; '' when none or when the highlighted item has no id attribute, undefined when no item exists at the index. */
  highlightId: string | undefined;
  /** Vue's `provide: { highlightId }`. Pass it to `HighlightIdContext.Provider`. */
  highlightIdContext: HighlightIdContextValue;
  onUpKey: () => void;
  onDownKey: () => void;
  onHomeKey: () => void;
  onEndKey: () => void;
  onNavigationKey: (key: string) => void;
  isValidLetter: (key: string) => boolean;
  jumpToBeginning: () => void;
  jumpToEnd: () => void;
  setHighlightIndex: (index: number) => void;
  setHighlightId: (id: string | null | undefined) => void;
  scrollActiveItemIntoViewIfNeeded: () => void;
  focusActiveItemIfNeeded: () => void;
}

interface Highlight {
  index: number;
  id: string | undefined;
}

/**
 * Keyboard navigation of a list of items (such as a dropdown or select menu).
 *
 * To be effective, bind `onUpKey` and `onDownKey` to the key events, usually of the component's root element.
 *
 * The highlight is kept in state for rendering and mirrored in a ref, so the methods read the value they just wrote,
 * as Vue's synchronous data does (`onDownKey` highlights, then scrolls to the item it highlighted).
 */
export function useKeyboardListNavigation (options: KeyboardListNavigationOptions): KeyboardListNavigationState {
  const [highlight, setHighlight] = useState<Highlight>({ index: -1, id: '' });
  const latestHighlight = useRef(highlight);
  const latestOptions = useRef(options);
  // Updated once a render commits, so an abandoned render's options never reach the methods the committed UI holds.
  useLayoutEffect(() => {
    latestOptions.current = options;
  });

  const methods = useMemo(() => {
    const opts = () => latestOptions.current;

    const getListElement = () => opts().getListElement();

    const itemSelector = () => `[role="${opts().listItemRole ?? 'option'}"], #sr-only-close-button`;

    // Gets all the list item nodes within the list element, uses the listItemRole option to determine
    // whether an element is a list item.
    const getListItemNodes = (): HTMLElement[] | null => {
      const listElement = getListElement();

      if (!listElement) {
        console.error(ERROR_INVALID_LIST_ELEMENT, listElement);
        return null;
      }

      return Array.from(listElement.querySelectorAll<HTMLElement>(itemSelector()));
    };

    // Gets the length of all the items in the list.
    const itemsLength = () => {
      const listItems = getListItemNodes();

      if (listItems === null) {
        return 0;
      }

      return listItems.length;
    };

    const getItemIndex = (id: string) => {
      const listElement = getListElement();
      if (!listElement) {
        return -1;
      }

      const listItems = Array.from(listElement.querySelectorAll(itemSelector()));
      return listItems.indexOf(listElement.querySelector(`#${id}`) as Element);
    };

    const getItemId = (index: number) => {
      const listElement = getListElement();
      if (!listElement) {
        return undefined;
      }

      return listElement.querySelectorAll(itemSelector())[index]?.id;
    };

    const write = (next: Highlight) => {
      latestHighlight.current = next;
      setHighlight(next);
    };

    const afterHighlight = (index: number) => {
      if (itemsLength() && opts().afterHighlightMethod) {
        opts().afterHighlightMethod?.(index);
      }
    };

    const setHighlightIndex = (index: number) => {
      write({ index, id: getItemId(index) });
      afterHighlight(index);
    };

    const setHighlightId = (id: string | null | undefined) => {
      if (!id) return;
      const index = getItemIndex(id);
      write({ index, id });
      afterHighlight(getItemIndex(id));
    };

    const scrollActiveItemIntoViewIfNeeded = () => {
      if (!(opts().scrollToOnHighlight ?? true)) {
        return;
      }
      const activeItemEl = opts().getActiveItem?.(latestHighlight.current.id);
      if (activeItemEl) {
        // When the list element isn't given, scrollElementIntoViewIfNeeded defaults to the item's immediate wrapper.
        scrollElementIntoViewIfNeeded(activeItemEl, null, null, getListElement());
      }
    };

    const focusActiveItemIfNeeded = () => {
      if (!opts().focusOnKeyboardNavigation) {
        return;
      }
      const activeItemEl = opts().getActiveItem?.(latestHighlight.current.id);
      if (activeItemEl) {
        activeItemEl.focus();
      }
    };

    const scrollAndFocus = () => {
      scrollActiveItemIntoViewIfNeeded();
      focusActiveItemIfNeeded();
    };

    const jumpToBeginning = () => {
      setHighlightIndex(0);
    };

    const jumpToEnd = () => {
      setHighlightIndex(itemsLength() - 1);
    };

    const onUpKey = () => {
      opts().openMethod?.(true);
      if (latestHighlight.current.index > 0) {
        setHighlightIndex(latestHighlight.current.index - 1);
      } else {
        opts().beginningOfListMethod?.();
      }
      scrollAndFocus();
    };

    const onDownKey = () => {
      opts().openMethod?.(true);
      if (latestHighlight.current.index < itemsLength() - 1) {
        setHighlightIndex(latestHighlight.current.index + 1);
      } else {
        opts().endOfListMethod?.();
      }
      scrollAndFocus();
    };

    const onHomeKey = () => {
      jumpToBeginning();
      scrollAndFocus();
    };

    const onEndKey = () => {
      jumpToEnd();
      scrollAndFocus();
    };

    const onNavigationKey = (key: string) => {
      // Vue's getListItemNodes() can return null here, and its .filter() then throws; kept.
      const listItems = getListItemNodes() as HTMLElement[];

      const matchingItems = listItems.filter(item => {
        const content = (item.textContent ?? '').trim().toLowerCase();
        return content.startsWith(key.toLowerCase());
      });

      if (matchingItems.length <= 0) {
        return;
      }

      const highlightedMatchingItemIndex = matchingItems.findIndex(item => {
        return latestHighlight.current.index === listItems.indexOf(item);
      });

      const nextHighlightedItemIndex = listItems.indexOf(
        highlightedMatchingItemIndex < matchingItems.length - 1
          ? matchingItems[highlightedMatchingItemIndex + 1]
          : matchingItems[0],
      );

      setHighlightIndex(nextHighlightedItemIndex);
      scrollAndFocus();
    };

    const isValidLetter = (key: string) => {
      if (key.length > 1) {
        return false;
      }

      return (key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z');
    };

    return {
      onUpKey,
      onDownKey,
      onHomeKey,
      onEndKey,
      onNavigationKey,
      isValidLetter,
      jumpToBeginning,
      jumpToEnd,
      setHighlightIndex,
      setHighlightId,
      scrollActiveItemIntoViewIfNeeded,
      focusActiveItemIfNeeded,
    };
  }, []);

  const highlightIdContext = useMemo(() => () => highlight.id, [highlight.id]);

  return { highlightIndex: highlight.index, highlightId: highlight.id, highlightIdContext, ...methods };
}
