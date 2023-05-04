<template>
  <dt-emoji-picker
    :skin-tone="skinTone"
    :skin-selector-button-tooltip-label="$attrs.skinSelectorButtonTooltipLabel"
    :tab-set-labels="$attrs.tabSetLabels"
    :recently-used-emojis="$attrs.recentlyUsedEmojis"
    :search-results-label="$attrs.searchResultsLabel"
    :search-no-results-label="$attrs.searchNoResultsLabel"
    :search-placeholder-label="$attrs.searchPlaceholderLabel"
    @skin-tone="skinTone = $event"
    @selected-emoji="$attrs.selectedEmoji"
  />
</template>

<script setup>
import DtEmojiPicker from './emoji_picker.vue';
import { ref } from 'vue';

const skinTone = ref('Light');
</script>
