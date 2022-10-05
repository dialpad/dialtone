<template>
  <span :class="skeletonSizeClass">
    <dt-skeleton
      v-show="imgLoading && showSkeleton"
      :offset="0"
      :class="skeletonSizeClass"
      :shape-option="{ shape: 'square', contentClass: skeletonSizeClass, size: 'auto' }"
    />
    <img
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
  customEmojiAssetUrl,
} from '@/common/emoji';
import { DtSkeleton } from '../skeleton';

/**
 * Renders an emoji from a shortcode such as :smile: or unicode character such as 😄
 * @see https://dialpad.design/components/emoji.html
 */
export default {
  name: 'DtEmoji',

  components: {
    DtSkeleton,
  },

  props: {
    /**
     * Supports shortcode ex: :smile: or unicode ex: 😄. Will display the resulting emoji.
     * See <a href="https://emojipedia.org/joypixels/" target="_blank">JoyPixels</a>
     *  for all supported shortcode/unicode or the docs for setting up custom emojis.
     */
    code: {
      type: String,
      default: null,
    },

    /**
     * The size of the emoji. Can be any of the svg size utility classes from
     * <a href="https://dialpad.design/utilities/svg/size" target="_blank"> Dialpad SVG Size</a>
     * @values d-svg--size14, d-svg--size16, d-svg--size18, d-svg--size20
     * d-svg--size24, d-svg--size32, d-svg--size48, d-svg--size64, d-svg--size100p
     */
    size: {
      type: String,
      default: EMOJI_SIZES.SIZE_20,
      validator: (t) => Object.values(EMOJI_SIZES).includes(t),
    },

    /**
     * Additional class name for the emoji img element.
     * Can accept String, Object, and Array, i.e. has the
     * same API as Vue's built-in handling of the class attribute.
     */
    imgClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Will be read out on a screen reader for this emoji. You must use this prop if you want your emoji to be i18n
     * Compatible as Dialtone Vue will not translate it by itself. If you do not set this prop the aria-label will
     * be set to the english description of the emoji. You can retrieve the description for an emoji yourself via the
     * getEmojiData() function
     */
    ariaLabel: {
      type: String,
      default: null,
    },

    /**
     * Shows a skeleton loader while the emoji asset is loading.
     * @values true, false
     */
    showSkeleton: {
      type: Boolean,
      default: true,
    },
  },

  data () {
    return {
      emojiData: null,
      imgLoading: false,
    };
  },

  computed: {
    emojiDataValid () {
      return !!this.emojiData;
    },

    emojiSrc () {
      if (!this.emojiDataValid) { return 'invalid'; }

      // custom emoji
      if (this.emojiData?.custom) {
        return customEmojiAssetUrl + this.emojiData.key + this.emojiData.extension;
      }

      if (['d-svg--size14', 'd-svg--size16'].includes(this.size)) {
        return emojiImageUrlSmall + this.emojiData.key + emojiFileExtensionSmall;
      } else {
        return emojiImageUrlLarge + this.emojiData.key + emojiFileExtensionLarge;
      }
    },

    emojiAlt () {
      if (!this.emojiDataValid) { return undefined; }
      return this.emojiData.unicode_output ? stringToUnicode(this.emojiData.unicode_output) : this.emojiData.name;
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
      handler: function () {
        this.getEmojiData();
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
    getEmojiData () {
      this.emojiData = codeToEmojiData(this.code);
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
