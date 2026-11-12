import { StrictMode, type ReactNode } from 'react';
import { act, render, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HighlightIdContext, useHighlightIdContext } from './HighlightIdContext';
import {
  useKeyboardListNavigation,
  type KeyboardListNavigationOptions,
  type KeyboardListNavigationState,
} from './useKeyboardListNavigation';

// React-only: what the Vue tests don't reach (item ids, scrolling, focusing, the provided highlightId).

let list: HTMLElement;

// jsdom doesn't scroll; record what the list is scrolled to.
const trackScrollTop = () => {
  const set = vi.fn();
  Object.defineProperty(list, 'scrollTop', { configurable: true, get: () => 0, set });
  return set;
};

const setup = (options: Partial<KeyboardListNavigationOptions> = {}) => renderHook(
  () => useKeyboardListNavigation({
    getListElement: () => list,
    getActiveItem: id => (id ? list.querySelector<HTMLElement>(`#${id}`) : null),
    ...options,
  }),
  { wrapper: ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode> },
);

describe('useKeyboardListNavigation', () => {
  beforeEach(() => {
    list = document.createElement('ul');
    list.innerHTML = `
      <li id="apple" role="option" tabindex="-1">Apple</li>
      <li id="avocado" role="option" tabindex="-1">Avocado</li>
      <li id="banana" role="option" tabindex="-1">Banana</li>
      <li id="separator" role="separator">Not an item</li>
      <li id="menu-item" role="menuitem" tabindex="-1">Cherry</li>
    `;
    document.body.append(list);
  });

  afterEach(() => {
    list.remove();
    vi.restoreAllMocks();
  });

  it('starts with nothing highlighted', () => {
    const { result } = setup();
    expect(result.current.highlightIndex).toBe(-1);
    expect(result.current.highlightId).toBe('');
  });

  it('highlights the id of the item at the index, counting only items with the list item role', () => {
    const { result } = setup();
    act(() => result.current.onEndKey());
    expect(result.current.highlightIndex).toBe(2);
    expect(result.current.highlightId).toBe('banana');
  });

  it('uses listItemRole to find the items', () => {
    const { result } = setup({ listItemRole: 'menuitem' });
    act(() => result.current.onDownKey());
    expect(result.current.highlightId).toBe('menu-item');
  });

  it('highlights from the one just set when a key is pressed twice in one act', () => {
    const { result } = setup();
    act(() => {
      result.current.onDownKey();
      result.current.onDownKey();
    });
    expect(result.current.highlightIndex).toBe(1);
  });

  it('opens the list on up and down', () => {
    const openMethod = vi.fn();
    const { result } = setup({ openMethod });
    act(() => result.current.onDownKey());
    act(() => result.current.onUpKey());
    expect(openMethod).toHaveBeenCalledTimes(2);
    expect(openMethod).toHaveBeenCalledWith(true);
  });

  it('cycles through the items matching a letter', () => {
    const { result } = setup();
    act(() => result.current.onNavigationKey('A'));
    expect(result.current.highlightId).toBe('apple');
    act(() => result.current.onNavigationKey('a'));
    expect(result.current.highlightId).toBe('avocado');
    act(() => result.current.onNavigationKey('a'));
    expect(result.current.highlightId).toBe('apple');
  });

  it('keeps the highlight when no item matches the letter', () => {
    const { result } = setup();
    act(() => result.current.onNavigationKey('z'));
    expect(result.current.highlightIndex).toBe(-1);
  });

  it('accepts a single letter as a valid one', () => {
    const { result } = setup();
    expect(['a', 'Z', '1', 'ab', 'Enter', ' '].map(result.current.isValidLetter))
      .toEqual([true, true, false, false, false, false]);
  });

  describe('setHighlightId', () => {
    it('highlights the item with the id', () => {
      const afterHighlightMethod = vi.fn();
      const { result } = setup({ afterHighlightMethod });
      act(() => result.current.setHighlightId('avocado'));
      expect(result.current.highlightIndex).toBe(1);
      expect(result.current.highlightId).toBe('avocado');
      expect(afterHighlightMethod).toHaveBeenCalledWith(1);
    });

    it('ignores an empty id', () => {
      const afterHighlightMethod = vi.fn();
      const { result } = setup({ afterHighlightMethod });
      act(() => result.current.setHighlightId(''));
      expect(result.current.highlightIndex).toBe(-1);
      expect(afterHighlightMethod).not.toHaveBeenCalled();
    });
  });

  describe('When there is no list element', () => {
    it('logs an error and has no items', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const endOfListMethod = vi.fn();
      const { result } = setup({ getListElement: () => null, endOfListMethod });
      act(() => result.current.onDownKey());
      expect(error).toHaveBeenCalled();
      expect(endOfListMethod).toHaveBeenCalledTimes(1);
    });
  });

  describe('scrollToOnHighlight', () => {
    it('scrolls the highlighted item into view by default', () => {
      const scrollTo = trackScrollTop();
      const { result } = setup();
      act(() => result.current.onDownKey());
      expect(scrollTo).toHaveBeenCalled();
    });

    it('does not scroll when it is false', () => {
      const scrollTo = trackScrollTop();
      const { result } = setup({ scrollToOnHighlight: false });
      act(() => result.current.onDownKey());
      expect(scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('focusOnKeyboardNavigation', () => {
    it('focuses the highlighted item when it is true', () => {
      const { result } = setup({ focusOnKeyboardNavigation: true });
      act(() => result.current.onDownKey());
      expect(document.activeElement).toBe(list.querySelector('#apple'));
    });

    it('leaves the focus alone by default', () => {
      const { result } = setup();
      act(() => result.current.onDownKey());
      expect(document.activeElement).toBe(document.body);
    });
  });

  describe('highlightIdContext', () => {
    it('provides a function returning the highlighted id, which changes with it', () => {
      const injected: { current: string | undefined } = { current: undefined };
      const navigation: { current: KeyboardListNavigationState | null } = { current: null };
      const Consumer = () => {
        injected.current = useHighlightIdContext()?.();
        return null;
      };
      const Host = () => {
        navigation.current = useKeyboardListNavigation({ getListElement: () => list });
        return (
          <HighlightIdContext.Provider value={navigation.current.highlightIdContext}>
            <Consumer />
          </HighlightIdContext.Provider>
        );
      };
      render(<Host />);
      expect(injected.current).toBe('');
      act(() => navigation.current?.onEndKey());
      expect(injected.current).toBe('banana');
    });

    it('is null outside a provider, as Vue injects its default', () => {
      const { result } = renderHook(() => useHighlightIdContext());
      expect(result.current).toBeNull();
    });
  });
});
