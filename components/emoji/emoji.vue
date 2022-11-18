<template>
  <span :class="emojiSize">
    <dt-skeleton
      v-show="imgLoading && showSkeleton"
      :offset="0"
      :class="emojiSize"
      :shape-option="{ shape: 'square', contentClass: emojiSize, size: 'auto' }"
    />
    <img
      v-show="!imgLoading"
      ref="emojiImg"
      :class="['d-icon', emojiSize, imgClass]"
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
import { ICON_SIZE_MODIFIERS } from '@/components/icon/icon_constants';
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
     * The size of the emoji. Can be any of the icon size utility classes from
     * <a href="https://dialpad.design/components/icon.html" target="_blank"> Dialpad Icon Size</a>
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    size: {
      type: String,
      default: '500',
      validator: (t) => Object.keys(ICON_SIZE_MODIFIERS).includes(t),
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

      if (['100', '200'].includes(this.size)) {
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

    emojiSize () {
      return ICON_SIZE_MODIFIERS[this.size];
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
