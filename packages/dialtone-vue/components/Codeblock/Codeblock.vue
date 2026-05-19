<template>
  <pre
    class="d-codeblock"
    :class="{ 'd-codeblock--bordered': bordered }"
  ><code
    class="d-codeblock__code"
    :class="`d-codeblock__code--${sizeClass}`"
  >{{ text }}</code></pre> <!-- this must be a single line -->
</template>

<script>
import { CODEBLOCK_SIZES, CODEBLOCK_SIZE_MAP } from './CodeblockConstants';

export default {
  name: 'DtCodeblock',

  props: {
    /**
     * The text to display in the codeblock.
     */
    text: {
      type: String,
      required: true,
    },

    /**
     * Whether to render as a styled container block.
     */
    bordered: {
      type: Boolean,
      default: false,
    },

    /**
     * Font size of the code block.
     * @values 100, 200, 300, 400
     */
    size: {
      type: [String, Number],
      default: 200,
      validator: (val) => CODEBLOCK_SIZES.includes(String(val)),
    },
  },

  computed: {
    sizeClass () {
      return CODEBLOCK_SIZE_MAP[String(this.size)] || String(this.size);
    },
  },
};
</script>
