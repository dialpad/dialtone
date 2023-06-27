import { computed, nextTick, ref } from 'vue';

import { useKeyboardNavigation } from '@/components/emoji_picker/composables/useKeyboardNavigation.js';
const { focusEmoji } = useKeyboardNavigation();

export function useEmojiSelector (listRef, props, emits) {
  /**
 * The list of tab labels
 * This is used to display the tabs
 * This is a computed property because it will check if the recently used emojis list is empty
 * If it is empty, it will remove the recently used tab
 */
  const tabLabels = computed(() => {
    return props.recentlyUsedEmojis.length
      ? props.tabsetLabels.map((label) => ({ label, ref: ref(null) }))
      : props.tabsetLabels.slice(1).map((label) => ({ label, ref: ref(null) }));
  });

  /**
 * Scroll to the selected tab
 */
  function scrollToTab (tabIndex, focusFirstEmoji = true) {
    const tabLabel = tabLabels.value[tabIndex - 1];
    const tabElement = tabLabel.ref.value[0];

    nextTick(() => {
      const container = listRef.value;
      const offsetTop = tabIndex === '1' ? 0 : tabElement.offsetTop - 20;

      /**
     * This variable is used to check if the user is scrolling inside the emoji picker
     * This is used to check if the user is scrolling using the scrollTo function
     * This is useful because this flag will prevent to update the fixed label when the user is scrolling using the scrollTo function
     */
      let isScrolling = true;

      let prevScrollTop = container.scrollTop;
      emits('is-scrolling', true);

      /**
     * This event listener checks whether the user is scrolling up or down by comparing the current scrollTop to prevScrollTop.
     * If the scrollToTab function is scrolling from bottom to top and has reached the desired position (scrollTop <= offsetTop),
     * or if the scrollToTab function is scrolling from top to bottom and has passed the desired position (scrollTop >= offsetTop),
     * then isScrolling is set to false.
     */
      container.addEventListener('scroll', () => {
        if (isScrolling) {
          const scrollTop = container.scrollTop;
          if (
            (prevScrollTop < scrollTop && scrollTop >= offsetTop) ||
          (prevScrollTop > scrollTop && scrollTop <= offsetTop)
          ) {
            isScrolling = false;
            emits('is-scrolling', false);
          }
          prevScrollTop = scrollTop;
        }
      });

      container.scrollTop = offsetTop;

      if (focusFirstEmoji) {
        focusEmoji((tabIndex - 1), 0);
      }
    });
  }

  return {
    scrollToTab,
    tabLabels,
  };
}
