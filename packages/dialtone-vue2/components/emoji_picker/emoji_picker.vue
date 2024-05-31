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
        :tab-set-labels="tabSetLabels"
        :is-scrolling="isScrolling"
        @focus-search-input="$refs.searchInputRef.focusSearchInput()"
        @focus-skin-selector="$refs.skinSelectorRef.focusSkinSelector()"
        @selected-tabset="scrollToSelectedTabset"
        @keydown.esc.native="$emit('close')"
      />
    </div>
    <div class="d-emoji-picker--body">
      <emoji-search
        v-if="showSearch"
        ref="searchInputRef"
        :model-value="internalSearchQuery"
        :search-placeholder-label="searchPlaceholderLabel"
        @update:model-value="newValue => internalSearchQuery = newValue"
        @select-first-emoji="$emit('selected-emoji', highlightedEmoji)"
        @focus-tabset="$refs.tabsetRef.focusTabset()"
        @focus-emoji-selector="$refs.emojiSelectorRef.focusEmojiSelector()"
        @keydown.esc.native="$emit('close')"
      />
      <emoji-selector
        ref="emojiSelectorRef"
        :emoji-filter="internalSearchQuery"
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
        @focus-last-emoji="$refs.emojiSelectorRef.focusLastEmoji()"
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
  },

  data () {
    return {
      internalSearchQuery: this.searchQuery,
      highlightedEmoji: null,
      selectedTabset: {},
      scrollIntoTab: 0,
      isScrolling: false,
    };
  },

  computed: {
    showRecentlyUsedTab () {
      return this.recentlyUsedEmojis?.length > 0;
    },
  },

  watch: {
    searchQuery (value) {
      this.internalSearchQuery = value;
    },
  },

  methods: {
    scrollToSelectedTabset (tabId) {
      this.internalSearchQuery = '';
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
