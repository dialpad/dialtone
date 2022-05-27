<template>
  <span :class="skeletonSizeClass">
    <dt-skeleton
      v-show="emojiDataLoading || imgLoading"
      :offset="0"
      :class="skeletonSizeClass"
      :shape-option="{ shape: 'square', contentClass: skeletonSizeClass, size: 'auto' }"
    />
    <img
      v-if="!emojiDataLoading"
      v-show="!imgLoading"
      ref="emojiImg"
      :class="[size, imgClass]"
      :aria-label="emojiLabel"
      :alt="emojiAlt"
      :title="emojiLabel"
      :src="emojiSrc"
      @load="imageLoaded"
      @error="imageErrored"
    >
  </span>
</template>

<script>
import { EMOJI_SIZES } from './emoji_constants.js';
import {
  codeToEmojiData,
  stringToUnicode,
  emojiImageUrlSmall,
  emojiFileExtensionSmall,
  emojiImageUrlLarge,
  emojiFileExtensionLarge,
} from '@/common/emoji';
import { DtSkeleton } from '@/components/skeleton';

export default {
  name: 'DtEmoji',

  components: {
    DtSkeleton,
  },

  props: {
    /**
      * Supports shortcode ex: :smile: or unicode ex: 😄. Will display the resulting emoji.
      * See https://emojipedia.org/joypixels/ for all supported shortcode/unicode.
      */
    code: {
      type: String,
      default: null,
    },

    /**
      * The size of the emoji. Can be any of the svg size utility
      * classes from https://dialpad.design/utilities/svg/size
      */
    size: {
      type: String,
      default: EMOJI_SIZES.SIZE_20,
      validator: (t) => Object.values(EMOJI_SIZES).includes(t),
    },

    /**
     * Additional class name for the emoji img element.
     * Can accept all of String, Object, and Array, i.e. has the
     * same api as Vue's built-in handling of the class attribute.
     */
    imgClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Will be read out on a screenreader for this emoji. You must use this prop if you want your emoji to be i18n
     * Compatible as Dialtone Vue will not translate it by itself. If you do not set this prop the aria-label will
     * be set to the english description of the emoji. You can retrieve the description for an emoji yourself via the
     * getEmojiJson() function
     */
    ariaLabel: {
      type: String,
      default: null,
    },
  },

  data () {
    return {
      emojiData: null,
      imgLoading: false,
      emojiDataLoading: false,
    };
  },

  computed: {
    emojiDataValid () {
      if (this.emojiData) {
        return true;
      } else {
        return false;
      }
    },

    emojiSrc () {
      if (!this.emojiDataValid) { return 'invalid'; }
      if (['d-svg--size14', 'd-svg--size16'].includes(this.size)) {
        return emojiImageUrlSmall + this.emojiData.key + emojiFileExtensionSmall;
      } else {
        return emojiImageUrlLarge + this.emojiData.key + emojiFileExtensionLarge;
      }
    },

    emojiAlt () {
      if (!this.emojiDataValid) { return undefined; }
      return stringToUnicode(this.emojiData.unicode_output);
    },

    emojiLabel () {
      if (!this.emojiDataValid) { return 'Invalid Emoji'; }
      return this.ariaLabel ? this.ariaLabel : this.emojiData.name;
    },

    skeletonSizeClass () {
      return this.size === 'd-svg--size100p' ? ['d-h100p', 'd-w100p'] : this.size;
    },
  },

  watch: {
    code: {
      handler: async function () {
        this.emojiDataLoading = true;
        await this.getEmojiData();
        this.emojiDataLoading = false;
      },

      immediate: true,
    },

    emojiSrc: {
      handler: async function () {
        this.imgLoading = true;
      },
    },
  },

  methods: {
    async getEmojiData () {
      this.emojiData = await codeToEmojiData(this.code);
    },

    imageLoaded () {
      this.imgLoading = false;
    },

    imageErrored () {
      this.imgLoading = false;
    },
  },
};
</script>
