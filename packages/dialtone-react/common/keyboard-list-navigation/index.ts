// dialtone-vue's common/mixins/keyboard_list_navigation.js as a hook, with its `provide`d highlightId as a context,
// and common/mixins/dom.js (mixin-dom) as plain functions.
export {
  useKeyboardListNavigation,
  type KeyboardListNavigationOptions,
  type KeyboardListNavigationState,
} from './useKeyboardListNavigation';
export { HighlightIdContext, useHighlightIdContext, type HighlightIdContextValue } from './HighlightIdContext';
export {
  scrollElementIntoView,
  scrollElementIntoViewIfNeeded,
  scrollIntoView,
  scrollIntoViewIfNeeded,
  type ScrollDirection,
} from './dom';
