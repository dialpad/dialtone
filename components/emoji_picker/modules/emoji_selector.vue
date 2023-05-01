<template>
  <div class="d-emoji-picker__selector">
    <div
      id="d-emoji-picker-list"
      ref="listRef"
      class="d-emoji-picker__list"
    >
      <p
        v-if="emojiFilter"
        class="d-emoji-picker__search-label d-emoji-picker__alignment"
      >
        {{ filteredEmojis.length > 0 ? searchResultsLabel : searchNoResultsLabel }}
      </p>
      <div
        v-else
        ref="tabCategoryRef"
        class="d-emoji-picker__category d-emoji-picker__alignment"
      >
        <p>
          {{ fixedLabel }}
        </p>
      </div>
      <div
        v-for="(tabLabel, index) in tabLabels"
        v-show="!emojiFilter"
        :key="index"
        :ref="tabLabel.ref"
        class="d-emoji-picker__alignment"
      >
        <p
          v-if="index"
        >
          {{ tabLabel.label }}
        </p>
        <div
          class="d-emoji-picker__tab"
        >
          <button
            v-for="emoji in (emojis[tabs[index] + skinTone] ? emojis[tabs[index] + skinTone] : emojis[tabs[index]])"
            :key="emoji.shortname"
            type="button"
            :aria-label="emoji.name"
            @click="$emit('selected-emoji', emoji)"
            @focusin="$emit('highlighted-emoji', emoji)"
            @focusout="$emit('highlighted-emoji', null)"
            @mouseover="$emit('highlighted-emoji', emoji)"
            @mouseleave="$emit('highlighted-emoji', null)"
          >
            <img
              class="d-icon d-icon--size-500"
              :alt="emoji.name"
              :aria-label="emoji.name"
              :title="emoji.name"
              :src="getImgSrc(emoji.unicode_character)"
              @error="handleImageError"
            >
          </button>
        </div>
      </div>
      <div
        v-if="emojiFilter"
        class="d-emoji-picker__alignment"
      >
        <div
          class="d-emoji-picker__tab "
        >
          <button
            v-for="emoji in filteredEmojis"
            :key="emoji.shortname"
            type="button"
            :aria-label="emoji.name"
            @click="$emit('selected-emoji', emoji)"
            @focusin="$emit('highlighted-emoji', emoji)"
            @focusout="$emit('highlighted-emoji', null)"
            @mouseover="$emit('highlighted-emoji', emoji)"
            @mouseleave="$emit('highlighted-emoji', null)"
          >
            <img
              class="d-icon d-icon--size-500"
              :alt="emoji.name"
              :aria-label="emoji.name"
              :title="emoji.name"
              :src="`${CDN_URL + emoji.unicode_character}.png`"
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { emojisGrouped as emojis } from '@/components/emoji_picker/emojis';
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { CDN_URL } from '@/components/emoji_picker/emoji_picker_constants';

const props = defineProps({
  /**
   * The filter to apply to the emoji list
   * @type {String}
   * @default ''
   */
  emojiFilter: {
    type: String,
    default: '',
  },

  /**
   * The skin tone to apply to the emoji list
   * @type {String}
   * @required
   */
  skinTone: {
    type: String,
    required: true,
  },

  /**
   * The labels for the tabset
   * @type {Array}
   * @required
   */
  tabsetLabels: {
    type: Array,
    required: true,
  },

  selectedTabset: {
    type: Object,
    required: true,
  },

  /**
   * The label for the search results tab
   * @type {String}
   * @required
   */
  searchResultsLabel: {
    type: String,
    required: true,
  },

  searchNoResultsLabel: {
    type: String,
    required: true,
  },

  /**
   * The list of recently used emojis
   * @type {Array}
   */
  recentlyUsedEmojis: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits([
  /**
   * Emitted when the user hover over an emoji
   * @event highlighted-emoji
   * @param {Object} emoji - The emoji data that was hovered
    */
  'highlighted-emoji',

  /**
   * Emitted when the user select an emoji
   * @event selected-emoji
   * @param {Object} emoji - The emoji data that was selected
    */
  'selected-emoji',

  /**
   * Emitted when the user scroll into an emoji tab
   * @event scroll-into-tab
   * @param {Number} tab-index - The tab that was scrolled into
    */
  'scroll-into-tab',

  /**
   * Emitted when the scrollTo function starts scrolling and stops scrolling
   * @event is-scrolling
   * @param {Boolean} is-scrolling - Whether the user is scrolling with the scroll-to
    */
  'is-scrolling',
]);

/**
 * The ref for the tab category
 * This is used to display the fixed label
 */
const tabCategoryRef = ref(null);

/**
 * The ref for the list
 * This is used to display the tabs
 */
const listRef = ref(null);

/**
 * The ref for the tab label observer
 * This is used to update the fixed label
 */
const tabLabelObserver = ref(null);

/**
 * The list of tabs
 * This is used to display the tabs
 */
const TABS_DATA = ['Recently used', 'People', 'Nature', 'Food', 'Activity', 'Travel', 'Objects', 'Symbols', 'Flags'];

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
 * The label of the fixed tab
 * This is used to display the fixed label
 */
const fixedLabel = ref(tabLabels.value[0].label);

/**
 * The list of tabs
 * This is used to display the tabs
 * This is a computed property because it will check if the recently used emojis list is empty
 * If it is empty, it will remove the recently used tab
 * The difference between this and the tab labels is that this one will set the structure of tabs
 * and the tab labels will set the labels
 */
const tabs = computed(() => {
  return props.recentlyUsedEmojis.length ? TABS_DATA : TABS_DATA.slice(1);
});

/**
 * The list of current emojis that match the filter
 * This will be updated when the emojiFilter changes
 * This is used to display the search results
 * The difference between this and the current emojis list is that this one will not have the skin tone applied
 */
const filteredEmojis = ref([]);

/**
 * The current emojis list we are displaying
 * This will be updated when the skin tone changes
 * The difference between this and the emojis list is that this one will have only the skin tone applied
 */
const currentEmojis = computed(() => {
  return [
    ...emojis[`People${props.skinTone}`],
    ...emojis.Nature,
    ...emojis.Food,
    ...emojis[`Activity${props.skinTone}`],
    ...emojis.Travel,
    ...emojis[`Objects${props.skinTone}`],
    ...emojis.Symbols,
    ...emojis.Flags,
  ];
});

/**
 * This will trigger the searchByNameAndKeywords function with debounce of 300 milliseconds
 */
const debouncedSearch = debounce(() => {
  searchByNameAndKeywords();
});

/**
 * Update the current emojis list on skin tone changes
 * Also update the filtered emojis list
 * @listens skinTone
 */
watch(currentEmojis, () => {
  searchByNameAndKeywords();
}, { immediate: true });

/**
 * Update the recently used emojis list on recently used emojis prop changes
 * @listens recentlyUsedEmojis
 */
watch(() => props.recentlyUsedEmojis,
  () => {
    emojis['Recently used'] = props.recentlyUsedEmojis;
  }, { immediate: true });

/**
 * Search for emojis by name and keywords
 * Will update the filtered emojis list on emojiFilter update
 * @listens emojiFilter
 */
watch(() => props.emojiFilter, () => {
  resetScroll();
  debouncedSearch();
});

watch(
  () => props.selectedTabset,
  (tab) => {
    scrollToTab(tab.tabId);
  },
  { deep: true },
);

/**
 * Filters an array of emoji objects based on a search string that matches both the name and keywords.
 * Will update the filtered emojis list
 */
function searchByNameAndKeywords () {
  const searchStr = props.emojiFilter.toLowerCase();
  filteredEmojis.value = currentEmojis.value.filter(obj => {
    const nameIncludesSearchStr = obj.name.toLowerCase().includes(searchStr);
    const keywordsIncludeSearchStr = obj.keywords.some(keyword => keyword.toLowerCase().includes(searchStr));
    return nameIncludesSearchStr || keywordsIncludeSearchStr;
  });
}

function debounce (fn, delay = 300) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function getImgSrc (emoji) {
  return `${CDN_URL + emoji}.png`;
}

/**
 * Handle image error - We hide the entire button if the image is not found
 */
function handleImageError (event) {
  event.target.parentNode.style.display = 'none';
}

/**
 * Scroll to the selected tab
 */
function scrollToTab (tabIndex) {
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
  });
}

function resetScroll () {
  const container = listRef.value;

  container.scrollTop = 0;
}

/**
 * This code creates an IntersectionObserver object that monitors the intersection between
 * the root element (tabCategoryRef) and its targets (the child elements of listRef),
 * and updates the value of the fixedLabel variable accordingly.
 */
function setTabLabelObserver () {
  /**
   * The code extracts the target element and its index from the IntersectionObserverEntry object,
   * and checks whether the target intersects with the root and is positioned above or below it.
   */
  tabLabelObserver.value = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const { target } = entry;
      const index = parseInt(target.dataset.index);

      /**
       * If the target is positioned above the root,
       * the code updates the value of the fixed label to the label of the previous tab, or the first tab if the current tab is the first one.
       * If the target is positioned below the root, the code updates the value of the fixed label to the label of the current tab.
       * If the target stops intersecting with the root and its index is 1 (the second tab),
       * the code updates the value of the fixed label to the label of the first tab.
       * NOTES:
       * This last condition is needed because sometimes it is
       * not detect the intersection between the root and the target.
       * We also provide a 50 pixels offset to the root element in the first condition to always get the
       * first tab if it has fewer emojis, because in some cases if you quickly scroll the observer does not detect it.
       */
      if (entry.isIntersecting && target.offsetTop <= tabCategoryRef.value.offsetTop + 50) {
        fixedLabel.value = tabLabels.value[index - 1]?.label ?? tabLabels.value[0]?.label;
        emits('scroll-into-tab', index - 1);
      } else if (entry.boundingClientRect.bottom <= tabCategoryRef.value?.getBoundingClientRect().bottom) {
        emits('scroll-into-tab', index);
        fixedLabel.value = tabLabels.value[index]?.label;
      } else if (index === 1) {
        emits('scroll-into-tab', index);
        fixedLabel.value = tabLabels.value[0]?.label;
      }
    });
  });

  /**
   * The tabLabelObserver is set to observe the root element and all its children elements with
   * the IntersectionObserver object, and sets their data-index attribute to their index.
   */
  tabLabelObserver.value.observe(tabCategoryRef.value);

  Array.from(listRef.value.children).forEach((child, index) => {
    tabLabelObserver.value.observe(child);
    child.dataset.index = index;
  });
}

onMounted(() => {
  setTabLabelObserver();
});

onUnmounted(() => {
  tabLabelObserver.value.disconnect();
});
</script>

<style lang="less" scoped>
.d-emoji-picker{

  &__selector{
    min-height: 297px;

    p{
      margin-bottom: 4px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
  }

  &__category {
    background: rgba(255, 255, 255, 0.9);
    position: sticky;
    top: 0;
    padding-top: 20px;
    width: 100%;
  }

  &__list{
    height: 100%;
    max-height: 297px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    top: -20px;

    div:not(:first-child){
      p{
        margin-top: 22px;
      }
    }
  }

  &__search-label{
    margin-top: 20px;
  }

  &__tab{
    width: calc(100% + 15px);
    max-width: 340px;
    gap: 2px;
    display: flex;
    flex-wrap: wrap;
    // We use this margin left to align the emoji list with the tabset label
    margin-left: -6px;

    button{
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 36px;
      height: 36px;

      border: none;
      background: none;
      cursor: pointer;
      margin: 0;
      padding: 0;
      outline: none;

      &:hover, &:active{
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
