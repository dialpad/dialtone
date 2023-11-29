<template>
  <dt-popover
    :open="emojiPickerOpened"
    initial-focus-element="#searchInput"
    padding="none"
    @opened="(open) => { emojiPickerOpened = open }"
  >
    <template #anchor>
      <dt-button
        size="sm"
        circle
        importance="clear"
        @click="toggleEmojiPicker"
      >
        <template #icon>
          <dt-icon
            name="satisfied"
            size="300"
          />
        </template>
      </dt-button>
    </template>
    <template #content>
      <dt-emoji-picker
        ref="emojiPickerRef"
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
  </dt-popover>
</template>

<script setup>
import { DtButton, DtIcon, DtPopover } from '@dialpad/dialtone-vue';
import { DtEmojiPicker } from '@dialpad/dialtone-vue/emoji';
import { ref } from 'vue';

const skinTone = ref('Default');
const emojiPickerOpened = ref(false);
const emojiPickerRef = ref(null);

const toggleEmojiPicker = () => {
  emojiPickerOpened.value = !emojiPickerOpened.value;
};
</script>
