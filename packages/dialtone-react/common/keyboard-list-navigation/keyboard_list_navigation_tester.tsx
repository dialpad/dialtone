import { useRef, type RefObject } from 'react';
import {
  useKeyboardListNavigation,
  type KeyboardListNavigationOptions,
  type KeyboardListNavigationState,
} from './useKeyboardListNavigation';

// Since we are testing a mixin here we use a mock tester component to render what we need to test.
export const KEYBOARD_LIST_NAVIGATION_TESTER_KEY = 'i';
export const KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS = [
  'item 1',
  'item 2',
  'item 3',
];

export interface KeyboardListNavigationTesterProps {
  /** Receives the hook's latest result on every render: Vue's `wrapper.vm`. */
  navigation: RefObject<KeyboardListNavigationState | null>;
  /** Callbacks the hook is given, as the tester's `afterHighlightMethod`, `beginningOfListMethod` and so on. */
  options?: Partial<KeyboardListNavigationOptions>;
}

// The tester's DOM, as keyboard_list_navigation_tester.vue renders it: one `ol` with the same id per item, which is
// Vue's markup, and no ids on the items.
export function KeyboardListNavigationTester ({ navigation, options }: KeyboardListNavigationTesterProps) {
  const listWrapper = useRef<HTMLDivElement>(null);
  navigation.current = useKeyboardListNavigation({
    getListElement: () => listWrapper.current,
    ...options,
  });

  return (
    <div role="combobox" aria-expanded="true" aria-controls="list">
      <div data-qa="dt-combobox-input-wrapper">
        <input />
      </div>
      <div ref={listWrapper} data-qa="dt-combobox-list-wrapper">
        {KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.map((item, index) => (
          <ol id="list" key={index}>
            <li role="option">
              {item}
            </li>
          </ol>
        ))}
      </div>
    </div>
  );
}
