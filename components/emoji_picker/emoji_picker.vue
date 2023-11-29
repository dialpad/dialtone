<template>
  <div
    class="d-emoji-picker"
  >
    <div class="d-emoji-picker--header">
      <emoji-tabset
        ref="tabsetRef"
        :emoji-filter="searchQuery"
        :show-recently-used-tab="showRecentlyUsedTab"
        :scroll-into-tab="scrollIntoTab"
        :tab-set-labels="tabSetLabels"
        :is-scrolling="isScrolling"
        @focus-search-input="$refs.searchInputRef.focusSearchInput()"
        @selected-tabset="scrollToSelectedTabset"
        @keydown.esc.native="$emit('close')"
      />
    </div>
    <div class="d-emoji-picker--body">
      <emoji-search
        ref="searchInputRef"
        :model-value="searchQuery"
        :search-placeholder-label="searchPlaceholderLabel"
        @update:model-value="newValue => searchQuery = newValue"
        @select-first-emoji="$emit('selected-emoji', highlightedEmoji)"
        @focus-tabset="$refs.tabsetRef.focusTabset()"
        @focus-emoji-selector="$refs.emojiSelectorRef.focusEmojiSelector()"
        @keydown.esc.native="$emit('close')"
      />
      <emoji-selector
        ref="emojiSelectorRef"
        :emoji-filter="searchQuery"
        :skin-tone="skinTone"
        :tab-set-labels="tabSetLabels"
        :search-results-label="searchResultsLabel"
        :search-no-results-label="searchNoResultsLabel"
        :recently-used-emojis="recentlyUsedEmojis"
        :selected-tabset="selectedTabset"
        @scroll-into-tab="updateScrollIntoTab"
        @is-scrolling="updateIsScrolling"
        @highlighted-emoji="updateHighlightedEmoji"
        @selected-emoji="$emit('selected-emoji', $event)"
        @focus-skin-selector="$refs.skinSelectorRef.focusSkinSelector()"
        @focus-search-input="$refs.searchInputRef.focusSearchInput()"
        @keydown.esc.native="$emit('close')"
      />
    </div>
    <div class="d-emoji-picker--footer">
      <emoji-description :emoji="highlightedEmoji" />
      <emoji-skin-selector
        ref="skinSelectorRef"
        :is-hovering="!!highlightedEmoji"
        :skin-selector-button-tooltip-label="skinSelectorButtonTooltipLabel"
        :skin-tone="skinTone"
        @skin-tone="$emit('skin-tone', $event)"
        @focus-tabset="$refs.tabsetRef.focusTabset()"
        @keydown.esc.native="$emit('close')"
      />
    </div>
  </div>
</template>

<script>
import EmojiTabset from './modules/emoji_tabset.vue';
import EmojiSearch from './modules/emoji_search.vue';
import EmojiSelector from './modules/emoji_selector.vue';
import EmojiDescription from './modules/emoji_description.vue';
import EmojiSkinSelector from './modules/emoji_skin_selector.vue';

export default {
  name: 'DtEmojiPicker',

  components: {
    EmojiTabset,
    EmojiSearch,
    EmojiSelector,
    EmojiDescription,
    EmojiSkinSelector,
  },

  props: {
    recentlyUsedEmojis: {
      type: Array,
    },

    searchPlaceholderLabel: {
      type: String,
      required: true,
    },

    searchResultsLabel: {
      type: String,
      required: true,
    },

    searchNoResultsLabel: {
      type: String,
      required: true,
    },

    tabSetLabels: {
      type: Array,
      required: true,
    },

    skinTone: {
      type: String,
    },

    skinSelectorButtonTooltipLabel: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      searchQuery: '',
      highlightedEmoji: null,
      selectedTabset: {},
      scrollIntoTab: 0,
      isScrolling: false,
    };
  },

  computed: {
    showRecentlyUsedTab () {
      return this.recentlyUsedEmojis.length > 0;
    },
  },

  methods: {
    scrollToSelectedTabset (tabId) {
      this.searchQuery = '';
      this.selectedTabset = { ...this.selectedTabset, tabId };
    },

    updateScrollIntoTab (value) {
      this.scrollIntoTab = value;
    },

    updateIsScrolling (value) {
      this.isScrolling = value;
    },

    updateHighlightedEmoji (emoji) {
      this.highlightedEmoji = emoji;
    },
  },
};
</script>
