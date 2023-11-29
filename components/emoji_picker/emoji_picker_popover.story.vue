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
        :skin-tone="isSkinTone"
        :skin-selector-button-tooltip-label="$attrs.skinSelectorButtonTooltipLabel"
        :tab-set-labels="$attrs.tabSetLabels"
        :recently-used-emojis="$attrs.recentlyUsedEmojis"
        :search-results-label="$attrs.searchResultsLabel"
        :search-no-results-label="$attrs.searchNoResultsLabel"
        :search-placeholder-label="$attrs.searchPlaceholderLabel"
        @skin-tone="isSkinTone = $event"
        @selected-emoji="$attrs.selectedEmoji"
      />
    </template>
  </dt-popover>
</template>

<script>
import DtEmojiPicker from './emoji_picker.vue';
import DtButton from '@/components/button/button.vue';
import DtIcon from '@/components/icon/icon.vue';
import DtPopover from '@/components/popover/popover.vue';

export default {
  name: 'DtEmojiPickerDefaultTemplate',

  components: {
    DtEmojiPicker,
    DtButton,
    DtIcon,
    DtPopover,
  },

  data () {
    return {
      isSkinTone: this.$attrs.skinTone,
      emojiPickerOpened: this.$attrs.showPopover,
    };
  },

  watch: {
    skinTone (value) {
      this.isSkinTone = value;
    },
  },

  methods: {
    toggleEmojiPicker: function () {
      this.emojiPickerOpened = !this.emojiPickerOpened;
    },
  },
};
</script>
