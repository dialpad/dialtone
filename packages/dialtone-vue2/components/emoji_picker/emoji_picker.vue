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
        @focus-skin-selector="$refs.skinSelectorRef.focusSkinSelector()"
        @focus-search-input="showSearch
          ? $refs.searchInputRef.focusSearchInput()
          : $refs.emojiSelectorRef.focusEmojiSelector()"
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
        @highlighted-emoji="updateHighlightedEmoji"
        @selected-emoji="$emit('selected-emoji', $event)"
        @focus-skin-selector="$refs.skinSelectorRef.focusSkinSelector()"
        @focus-search-input="showSearch ? $refs.searchInputRef.focusSearchInput() : $refs.tabsetRef.focusTabset()"
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
import { DtLocalizationMixin } from '@/common/mixins';

export default {
  name: 'DtEmojiPicker',

  components: {
    EmojiTabset,
    EmojiSearch,
    EmojiSelector,
    EmojiDescription,
    EmojiSkinSelector,
  },

  mixins: [DtLocalizationMixin],

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
      default: () => [],
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
    };
  },

  computed: {
    showRecentlyUsedTab () {
      return this.recentlyUsedEmojis?.length > 0;
    },

    tabSetLabels () {
      return [
        this.i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_RECENTLY_USED_LABEL'),
        this.i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_SMILEYS_AND_PEOPLE_LABEL'),
        this.i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_NATURE_LABEL'),
        this.i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_FOOD_LABEL'),
        this.i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_ACTIVITY_LABEL'),
        this.i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_TRAVEL_LABEL'),
        this.i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_OBJECTS_LABEL'),
        this.i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_SYMBOLS_LABEL'),
        this.i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_FLAGS_LABEL'),
      ];
    },

    searchPlaceholderLabel () {
      return this.i18n.$t('DIALTONE_EMOJI_PICKER_SEARCH_PLACEHOLDER_LABEL');
    },

    searchResultsLabel () {
      return this.i18n.$t('DIALTONE_EMOJI_PICKER_SEARCH_RESULTS_LABEL');
    },

    searchNoResultsLabel () {
      return this.i18n.$t('DIALTONE_EMOJI_PICKER_SEARCH_NO_RESULTS_LABEL');
    },

    skinSelectorButtonTooltipLabel () {
      return this.i18n.$t('DIALTONE_EMOJI_PICKER_SKIN_SELECTOR_BUTTON_TOOLTIP_LABEL');
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

    updateHighlightedEmoji (emoji) {
      this.highlightedEmoji = emoji;
    },
  },
};
</script>
