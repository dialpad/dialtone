<template>
  <dt-emoji-picker
    :skin-tone="skinTone"
    :skin-selector-button-tooltip-label="$attrs.skinSelectorButtonTooltipLabel"
    :tab-set-labels="$attrs.tabSetLabels"
    :recently-used-emojis="$attrs.recentlyUsedEmojis"
    :custom-emojis="$attrs.customEmojis"
    :add-emoji-label="$attrs.addEmojiLabel"
    :search-results-label="$attrs.searchResultsLabel"
    :search-no-results-label="$attrs.searchNoResultsLabel"
    :search-placeholder-label="$attrs.searchPlaceholderLabel"
    :search-query="$attrs.searchQuery"
    :show-search="$attrs.showSearch"
    @skin-tone="skinTone = $event"
    @selected-emoji="$attrs.selectedEmoji"
    @scroll-bottom-reached="$attrs.scrollBottomReached"
    @add-emoji="$attrs.onAddEmoji($event)"
  />
</template>

<script setup>
import DtEmojiPicker from './emoji_picker.vue';
import { ref } from 'vue';

const skinTone = ref('Default');
</script>
