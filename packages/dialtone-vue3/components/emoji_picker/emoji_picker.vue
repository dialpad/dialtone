<template>
  <div
    class="d-emoji-picker"
  >
    <div class="d-emoji-picker--header">
      <emoji-tabset
        ref="tabsetRef"
        :emoji-filter="internalSearchQuery"
        :show-recently-used-tab="showRecentlyUsedTab"
        :scroll-into-tab="scrollIntoTab"
        :tabset-labels="tabSetLabels"
        :is-scrolling="isScrolling"
        @tab-key-pressed="focusNextSectionFromEmojiTabSet"
        @shift-tab-key-pressed="$refs.skinSelectorRef.focusSkinSelector()"
        @arrow-down-key-pressed="focusNextSectionFromEmojiTabSet"
        @selected-tabset="scrollToSelectedTabset"
        @keydown.esc="emits('close')"
      />
    </div>
    <div class="d-emoji-picker--body">
      <emoji-search
        v-if="showSearch"
        ref="searchInputRef"
        v-model="internalSearchQuery"
        :search-placeholder-label="searchPlaceholderLabel"
        @select-first-emoji="emits('selected-emoji', highlightedEmoji)"
        @focus-tabset="$refs.tabsetRef.focusTabset()"
        @focus-emoji-selector="$refs.emojiSelectorRef.focusEmojiSelector()"
        @keydown.esc="emits('close')"
      />
      <emoji-selector
        ref="emojiSelectorRef"
        :emoji-filter="internalSearchQuery"
        :skin-tone="skinTone"
        :tabset-labels="tabSetLabels"
        :search-results-label="searchResultsLabel"
        :search-no-results-label="searchNoResultsLabel"
        :recently-used-emojis="recentlyUsedEmojis"
        :selected-tabset="selectedTabset"
        @scroll-into-tab="updateScrollIntoTab"
        @is-scrolling="updateIsScrolling"
        @highlighted-emoji="updateHighlightedEmoji"
        @selected-emoji="emits('selected-emoji', $event)"
        @focus-skin-selector="$refs.skinSelectorRef.focusSkinSelector()"
        @shift-tab-key-pressed="focusNextSectionFromEmojiSelector"
        @keydown.esc="emits('close')"
      />
    </div>
    <div class="d-emoji-picker--footer">
      <emoji-description :emoji="highlightedEmoji" />
      <emoji-skin-selector
        ref="skinSelectorRef"
        :is-hovering="!!highlightedEmoji"
        :skin-selector-button-tooltip-label="skinSelectorButtonTooltipLabel"
        :skin-tone="skinTone"
        @skin-tone="emits('skin-tone', $event)"
        @focus-tabset="$refs.tabsetRef.focusTabset()"
        @focus-last-emoji="$refs.emojiSelectorRef.focusLastEmoji()"
        @keydown.esc="emits('close')"
      />
    </div>
  </div>
</template>

<script setup>
import EmojiSearch from './modules/emoji_search.vue';
import EmojiTabset from './modules/emoji_tabset.vue';
import EmojiSelector from './modules/emoji_selector.vue';
import EmojiSkinSelector from './modules/emoji_skin_selector.vue';
import EmojiDescription from './modules/emoji_description.vue';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  /**
   * The array with recently used  emoji object
   * This list is necessary to fill the recently used tab
   * @type {Array}
   * @default []
   * @example
   * <dt-emoji-picker :recentlyUsedEmojis="[emojiObject, emojiObject]" />
   */
  // TODO try to simplify this to achieve an array of unicode characters and not an entire emoji data object
  recentlyUsedEmojis: {
    type: Array,
    default: () => ([]),
  },

  /**
   * The placeholder text for the search input
   * @type {String}
   * @required
   * @example
   * <dt-emoji-picker :searchPlaceholderLabel="'Search...'" />
   */
  searchPlaceholderLabel: {
    type: String,
    required: true,
  },

  /**
   * The label for the search results tab
   * @type {String}
   * @required
   * @example
   * <dt-emoji-picker :searchResultsLabel="'Search results'" />
   */
  searchResultsLabel: {
    type: String,
    required: true,
  },

  /**
   * The label for the search no results
   * @type {String}
   * @required
   * @example
   * <dt-emoji-picker :searchNoResultsLabel="'No results'" />
   */
  searchNoResultsLabel: {
    type: String,
    required: true,
  },

  /**
   * The list of tabsets to show, it is necessary to be updated with the correct language
   * It must respect the provided order.
   * @type {Array}
   * @required
   * @example
   * <dt-emoji-picker
   *  :tabSetLabels="['Most recently used', 'Smileys and people', 'Nature',
   *    'Food', 'Activity', 'Travel', 'Objects', 'Symbols', 'Flags']" />
   */
  tabSetLabels: {
    type: Array,
    required: true,
  },

  /**
   * The skin tone to show the emojis
   * This prop gives the possibility to use the skin tone selected by the user previously
   * @type {String}
   * @default 'Default'
   * @values 'Default', 'Light', 'MediumLight', 'Medium', 'MediumDark', 'Dark'
   * @example
   * <dt-emoji-picker :skinTone="'Default'" />
   */
  skinTone: {
    type: String,
    default: 'Default',
  },

  /**
   * Tooltip shown when skin selector button is hovered.
   * @type {String}
   * @required
   * @example
   * <dt-emoji-picker :skin-selector-button-tooltip-label="'Change default skin tone'" />
   */
  skinSelectorButtonTooltipLabel: {
    type: String,
    required: true,
  },

  /**
   * Sets the search query that filters emojis.
   * @type {String}
   * @example
   * <dt-emoji-picker search-query="smile" />
   */
  searchQuery: {
    type: String,
    default: '',
  },

  /**
   * Shows the search input
   * @type {Boolean}
   * @example
   * <dt-emoji-picker :show-search="false" />
   */
  showSearch: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(
  [
    /**
     * It will emit the selected emoji
     * @event selected-emoji
     * @param {Object} emoji - The selected emoji from the emoji selector
     */
    'selected-emoji',

    /**
     * It will emit the selected skin tone
     * @event skin-tone
     * @param {String} skin - The selected skin tone from the skin selector
     */
    'skin-tone',

    /**
     * Since the keyboard events are encapsulated, we emit this event to close the picker
     * @event close
     */
    'close',
  ],
);

const internalSearchQuery = ref(props.searchQuery.value);
const highlightedEmoji = ref(null);
const selectedTabset = ref({});

const scrollIntoTab = ref(0);
const isScrolling = ref(false);

const searchInputRef = ref(null);
const emojiSelectorRef = ref(null);
const tabsetRef = ref(null);

const showRecentlyUsedTab = computed(() => props.recentlyUsedEmojis.length > 0);

watch(
  () => props.searchQuery,
  (newValue) => {
    internalSearchQuery.value = newValue;
  },
);

/**
 * Handle the selected tabset event
 * We're creating a new object with the same value as selectedTabset and assigning it back to selectedTabset.
 * Vue will see this as a new object and trigger the watcher in the child component.
 * Using this method, we are able to trigger the watcher in the child component even if the value being passed is the
 * same as the previous value.
 * @event selectedTabset
 * @param tabName {String} - The name of the tab that was selected
 */
function scrollToSelectedTabset (tabId) {
  internalSearchQuery.value = '';
  selectedTabset.value = tabId;
  selectedTabset.value = { ...selectedTabset.value, tabId };
}

function updateScrollIntoTab (value) {
  scrollIntoTab.value = value;
}

function updateIsScrolling (value) {
  isScrolling.value = value;
}
function updateHighlightedEmoji (emoji) {
  highlightedEmoji.value = emoji;
}

function focusNextSectionFromEmojiTabSet () {
  if (props.showSearch) {
    searchInputRef.value.focusSearchInput();
  } else {
    emojiSelectorRef.value.focusEmojiSelector();
  }
}

function focusNextSectionFromEmojiSelector () {
  if (props.showSearch) {
    searchInputRef.value.focusSearchInput();
  } else {
    tabsetRef.value.focusTabset();
  }
}
</script>
