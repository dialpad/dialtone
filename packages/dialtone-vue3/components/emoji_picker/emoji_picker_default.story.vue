<template>
  <dt-emoji-picker
    :skin-tone="skinTone"
    :recently-used-emojis="$attrs.recentlyUsedEmojis"
    :custom-emojis="$attrs.customEmojis"
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
