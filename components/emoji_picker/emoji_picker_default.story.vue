<template>
  <dt-emoji-picker
    :skin-tone.sync="isSkinTone"
    :skin-selector-button-tooltip-label="$attrs.skinSelectorButtonTooltipLabel"
    :tab-set-labels="$attrs.tabSetLabels"
    :recently-used-emojis="$attrs.recentlyUsedEmojis"
    :search-results-label="$attrs.searchResultsLabel"
    :search-no-results-label="$attrs.searchNoResultsLabel"
    :search-placeholder-label="$attrs.searchPlaceholderLabel"
    @skin-tone="isSkinTone = $event; $attrs.onSkinTone($event)"
    @close="$attrs.onClose($event)"
    @selected-emoji="$attrs.onSelectedEmoji($event)"
  />
</template>

<script>
import DtEmojiPicker from './emoji_picker.vue';

export default {
  name: 'DtEmojiPickerDefaultTemplate',

  components: {
    DtEmojiPicker,
  },

  data () {
    return {
      isSkinTone: this.$attrs.skinTone,
    };
  },

  watch: {
    skinTone (value) {
      this.isSkinTone = value;
    },
  },
};
</script>
