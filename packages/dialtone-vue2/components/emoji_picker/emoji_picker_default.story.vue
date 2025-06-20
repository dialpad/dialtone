<template>
  <dt-emoji-picker
    :skin-tone.sync="isSkinTone"
    :recently-used-emojis="$attrs.recentlyUsedEmojis"
    :custom-emojis="$attrs.customEmojis"
    :search-query="$attrs.searchQuery"
    :show-search="$attrs.showSearch"
    @skin-tone="isSkinTone = $event; $attrs.onSkinTone($event)"
    @close="$attrs.onClose($event)"
    @selected-emoji="$attrs.onSelectedEmoji($event)"
    @scroll-bottom-reached="$attrs.onScrollBottomReached($event)"
    @add-emoji="$attrs.onAddEmoji($event)"
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
