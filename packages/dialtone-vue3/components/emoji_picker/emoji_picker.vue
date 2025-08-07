<template>
  <div
    class="d-emoji-picker"
  >
    <div class="d-emoji-picker--header">
      <emoji-tabset
        ref="tabsetRef"
        :emoji-filter="internalSearchQuery"
        :show-custom-emojis-tab="showCustomEmojisTab"
        :show-recently-used-tab="showRecentlyUsedTab"
        :scroll-into-tab="scrollIntoTab"
        :tab-set-labels="tabSetLabels"
        @focus-skin-selector="$refs.skinSelectorRef.focusSkinSelector()"
        @focus-search-input="showSearch
          ? $refs.searchInputRef.focusSearchInput()
          : $refs.emojiSelectorRef.focusEmojiSelector()"
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
        :custom-emojis="customEmojis"
        :selected-tabset="selectedTabset"
        @scroll-into-tab="updateScrollIntoTab"
        @highlighted-emoji="updateHighlightedEmoji"
        @selected-emoji="emits('selected-emoji', $event)"
        @focus-skin-selector="$refs.skinSelectorRef.focusSkinSelector()"
        @focus-search-input="showSearch ? $refs.searchInputRef.focusSearchInput() : $refs.tabsetRef.focusTabset()"
        @keydown.esc="emits('close')"
        @scroll-bottom-reached="emits('scroll-bottom-reached')"
      />
    </div>
    <div class="d-emoji-picker--footer">
      <dt-button
        v-if="showCustomEmojisTab && !highlightedEmoji"
        importance="outlined"
        :aria-label="addEmojiLabel"
        class="d-emoji-picker__add-emoji"
        @click="emits('add-emoji')"
      >
        {{ addEmojiLabel }}
      </dt-button>
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
import { DtButton } from '../button';
import { computed, ref, watch } from 'vue';
import { DialtoneLocalization } from '@/localization';

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
    default: () => [],
  },

  /**
     * The array with custom emojis object
     * This list is necessary to fill the custom tab
     * @type {Array}
     * @default []
     * @example
     * <dt-emoji-picker :customEmojis="[emojiObject, emojiObject]" />
     */
  customEmojis: {
    type: Array,
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
   * Emitted when the user reach bottom scroll
   * This is being handled by handleScroll method
   * @event scroll-bottom-reached
   */
    'scroll-bottom-reached',

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

    /**
     * Emitted when the user clicks on the add emoji button
     * @event add-emoji
     */
    'add-emoji',
  ],
);

const internalSearchQuery = ref(props.searchQuery.value);
const highlightedEmoji = ref(null);
const selectedTabset = ref({});

const scrollIntoTab = ref(0);

const showRecentlyUsedTab = computed(() => props.recentlyUsedEmojis?.length > 0);
const showCustomEmojisTab = computed(() => props.customEmojis?.length > 0);

const i18n = new DialtoneLocalization();

const tabSetLabels = [
  i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_RECENTLY_USED_LABEL'),
  i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_SMILEYS_AND_PEOPLE_LABEL'),
  i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_NATURE_LABEL'),
  i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_FOOD_LABEL'),
  i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_ACTIVITY_LABEL'),
  i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_TRAVEL_LABEL'),
  i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_OBJECTS_LABEL'),
  i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_SYMBOLS_LABEL'),
  i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_FLAGS_LABEL'),
  i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_CUSTOM_LABEL'),
];

const searchPlaceholderLabel = i18n.$t('DIALTONE_EMOJI_PICKER_SEARCH_PLACEHOLDER_LABEL');
const searchResultsLabel = i18n.$t('DIALTONE_EMOJI_PICKER_SEARCH_RESULTS_LABEL');
const searchNoResultsLabel = i18n.$t('DIALTONE_EMOJI_PICKER_SEARCH_NO_RESULTS_LABEL');
const skinSelectorButtonTooltipLabel = i18n.$t('DIALTONE_EMOJI_PICKER_SKIN_SELECTOR_BUTTON_TOOLTIP_LABEL');
const addEmojiLabel = i18n.$t('DIALTONE_EMOJI_PICKER_ADD_EMOJI_LABEL');

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
 * @param tabId {String} - The id of the tab that was selected
 */
function scrollToSelectedTabset (tabId) {
  internalSearchQuery.value = '';
  selectedTabset.value = { ...selectedTabset.value, tabId };
}

function updateScrollIntoTab (value) {
  scrollIntoTab.value = value;
}

function updateHighlightedEmoji (emoji) {
  highlightedEmoji.value = emoji;
}
</script>
