<template>
  <div class="d-emoji-picker__data">
    <img
      v-if="emoji"
      class="d-icon d-icon--size-500"
      :alt="emoji.name"
      :aria-label="emoji.name"
      :title="emoji.name"
      :src="imageSrc"
      @error="imageErrored = true"
    >
    <div>{{ emoji?.name }}</div>
  </div>
</template>

<script>
import { CDN_URL } from '@/components/emoji_picker/emoji_picker_constants';

export default {
  name: 'EmojiDescription',

  props: {
    /**
     * Emoji data
     * @type {Object}
     * @default null
     */
    emoji: {
      type: Object,
      default: () => null,
    },
  },

  data () {
    return {
      CDN_URL,
      imageErrored: false,
    };
  },

  computed: {
    imageSrc () {
      const key = this.emoji?.unicode_character;
      if (!key) { return ''; }
      if (this.imageErrored) { return `${CDN_URL + key}.png`; }
      return `https://fonts.gstatic.com/s/e/notoemoji/latest/${key}/512.webp`;
    },
  },

  watch: {
    emoji: {
      handler () {
        this.imageErrored = false;

        const preloadImage = new Image();
        preloadImage.src = this.imageSrc;
      },

      immediate: true,
    },
  },
};
</script>
