import { createRef, StrictMode } from 'react';
import { act, render } from '@testing-library/react';
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
