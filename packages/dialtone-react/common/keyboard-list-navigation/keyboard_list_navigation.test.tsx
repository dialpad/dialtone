import { createRef, StrictMode, useRef } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { DtListItem } from '../../components/ListItem';
import { HighlightIdContext } from './HighlightIdContext';
import { useKeyboardListNavigation } from './useKeyboardListNavigation';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import {
  KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS,
  KEYBOARD_LIST_NAVIGATION_TESTER_KEY,
  KeyboardListNavigationTester,
} from './keyboard_list_navigation_tester';
import type { KeyboardListNavigationState } from './useKeyboardListNavigation';

// Since we are testing a mixin here we use a mock tester component to render what we need to test.

describe('Keyboard Navigation Mixin Tests', () => {
  // Test Environment
  let navigation: { current: KeyboardListNavigationState | null };
  let afterHighlightSpy: Mock<(index: number) => void>;
  let beginningOfListSpy: Mock<() => void>;
  let endOfListSpy: Mock<() => void>;

  // Vue's `wrapper.vm`: the hook's latest result.
  const vm = () => navigation.current as KeyboardListNavigationState;

  // Vue's `wrapper.setData({ highlightIndex })`, which doesn't call afterHighlightMethod: the spy is cleared after.
  const setData = ({ highlightIndex }: { highlightIndex: number }) => {
    act(() => vm().setHighlightIndex(highlightIndex));
    afterHighlightSpy.mockClear();
  };

  // Test Setup
  // The spies are fresh for every test. Vue's afterHighlight spy was cleared once, so its "calls the expected
  // afterHighlight function" tests passed on any earlier call; these can fail.
  beforeEach(() => {
    navigation = createRef<KeyboardListNavigationState>();
    afterHighlightSpy = vi.fn<(index: number) => void>();
    beginningOfListSpy = vi.fn<() => void>();
    endOfListSpy = vi.fn<() => void>();
    render(
      <StrictMode>
        <KeyboardListNavigationTester
          navigation={navigation}
          options={{
            afterHighlightMethod: afterHighlightSpy,
            beginningOfListMethod: beginningOfListSpy,
            endOfListMethod: endOfListSpy,
          }}
        />
      </StrictMode>,
    );
  });

  describe('When first item is highlighted', () => {
    // Test Setup
    beforeEach(() => {
      setData({ highlightIndex: 0 });
    });

    describe('When arrow up is pressed', () => {
      beforeEach(() => {
        act(() => vm().onUpKey());
      });

      it('calls the expected beginning of list function', () => {
        expect(beginningOfListSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('When arrow down is pressed', () => {
      beforeEach(() => {
        act(() => vm().onDownKey());
      });

      it('highlight is incremented by 1', () => {
        expect(vm().highlightIndex).toBe(1);
      });

      it('calls the expected afterHighlight function', () => {
        expect(afterHighlightSpy).toHaveBeenCalledWith(1);
      });
    });

    describe(`When navigation key "${KEYBOARD_LIST_NAVIGATION_TESTER_KEY}" is pressed`, () => {
      beforeEach(() => {
        act(() => vm().onNavigationKey(KEYBOARD_LIST_NAVIGATION_TESTER_KEY));
      });

      it('highlight is incremented by 1', () => {
        expect(vm().highlightIndex).toBe(1);
      });
    });

    describe('When "end" key is pressed', () => {
      beforeEach(() => {
        act(() => vm().onEndKey());
      });

      it('last index is highlighted', () => {
        expect(vm().highlightIndex).toBe(KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 1);
      });
    });
  });

  describe('When last item is highlighted', () => {
    // Test Setup
    beforeEach(() => {
      setData({ highlightIndex: KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 1 });
    });

    describe('When arrow up is pressed', () => {
      beforeEach(() => {
        act(() => vm().onUpKey());
      });

      it('highlight is decremented by 1', () => {
        expect(vm().highlightIndex).toBe(KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 2);
      });

      it('calls the expected afterHighlight function', () => {
        expect(afterHighlightSpy).toHaveBeenCalledWith(KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 2);
      });
    });

    describe('When arrow down is pressed', () => {
      beforeEach(() => {
        act(() => vm().onDownKey());
      });

      it('calls the expected end of list function', () => {
        expect(endOfListSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe(`When navigation key "${KEYBOARD_LIST_NAVIGATION_TESTER_KEY}" is pressed`, () => {
      beforeEach(() => {
        act(() => vm().onNavigationKey(KEYBOARD_LIST_NAVIGATION_TESTER_KEY));
      });

      it('first index is highlighted', () => {
        expect(vm().highlightIndex).toBe(0);
      });
    });

    describe('When "home" key is pressed', () => {
      beforeEach(() => {
        act(() => vm().onHomeKey());
      });

      it('first index is highlighted', () => {
        expect(vm().highlightIndex).toBe(0);
      });
    });
  });
});

describe('Keyboard navigation role collections', () => {
  let navigation: { current: KeyboardListNavigationState | null };
  const vm = () => navigation.current as KeyboardListNavigationState;

  function RoleList ({ listItemRole }: { listItemRole: string | string[] }) {
    const listRef = useRef<HTMLUListElement>(null);
    const nav = useKeyboardListNavigation({
      listItemRole,
      getListElement: () => listRef.current,
      getActiveItem: id => Array.from(listRef.current?.querySelectorAll('[id]') ?? []).find(item => item.id === id) as
        HTMLElement | undefined,
      focusOnKeyboardNavigation: true,
      scrollToOnHighlight: false,
    });
    navigation.current = nav;
    return (
      <ul
        ref={listRef}
        onKeyDown={event => {
          if (event.key === 'ArrowDown') nav.onDownKey();
          if (event.key === 'ArrowUp') nav.onUpKey();
          if (event.key === 'Home') nav.onHomeKey();
          if (event.key === 'End') nav.onEndKey();
        }}
      >
        <li role="presentation" id="heading">Heading</li>
        <li role="menuitem" id="action:id" tabIndex={-1}>Action</li>
        <li role="menuitemradio" id="radio [one]" tabIndex={-1}>Radio</li>
        <li role="menuitemradio" tabIndex={-1}>Missing ID</li>
        <li role="option" id="option" tabIndex={-1}>Option</li>
        <button id="sr-only-close-button">Close</button>
      </ul>
    );
  }

  function PendingList ({ show }: { show: boolean }) {
    const listRef = useRef<HTMLUListElement>(null);
    const nav = useKeyboardListNavigation({ getListElement: () => listRef.current, scrollToOnHighlight: false });
    navigation.current = nav;
    return (
      <HighlightIdContext.Provider value={nav.highlightIdContext}>
        <div onKeyDown={() => nav.onDownKey()}>
          {show
            ? (
              <ul ref={listRef}>
                {['one', 'two'].map(id => (
                  <DtListItem key={id} id={id} role="option" navigationType="arrow-keys">{id}</DtListItem>
                ))}
              </ul>
              )
            : null}
        </div>
      </HighlightIdContext.Provider>
    );
  }

  beforeEach(() => {
    navigation = { current: null };
  });

  it('retains a public highlight request made before the list renders', () => {
    const warning = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { container, rerender } = render(<PendingList show={false} />);
      act(() => vm().setHighlightId('two'));
      rerender(<PendingList show />);
      expect(container.querySelector('#two')?.getAttribute('aria-selected')).toBe('true');
      fireEvent.keyDown(container.firstElementChild?.firstElementChild as Element, { key: 'ArrowDown' });
      expect(container.querySelector('#two')?.getAttribute('aria-selected')).toBe('true');
    } finally {
      warning.mockRestore();
    }
  });

  it('navigates a role array and special IDs while retaining the close control', () => {
    const { container } = render(<RoleList listItemRole={['menuitem', 'menuitemradio']} />);
    const list = container.querySelector('ul') as HTMLElement;
    const press = (key: string) => fireEvent.keyDown(list, { key });
    press('ArrowDown');
    expect(document.activeElement?.id).toBe('action:id');
    press('ArrowDown');
    expect(document.activeElement?.id).toBe('radio [one]');
    press('ArrowDown');
    expect(document.activeElement?.id).toBe('sr-only-close-button');
    act(() => vm().setHighlightId('radio [one]'));
    press('ArrowUp');
    expect(document.activeElement?.id).toBe('action:id');
    press('End');
    expect(document.activeElement?.id).toBe('sr-only-close-button');
    press('Home');
    expect(document.activeElement?.id).toBe('action:id');
  });
});
