<template>
  <pre
    class="d-codeblock"
    :class="{ 'd-codeblock--bordered': bordered }"
  ><code
    class="d-codeblock__code"
    :class="`d-codeblock__code--${size}`"
  >{{ text }}</code></pre> <!-- this must be a single line -->
</template>

<script>
import { CODEBLOCK_SIZES } from './codeblock_constants';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtCodeblock',

  props: {
    text: {
      type: String,
      required: true,
    },

    bordered: {
      type: Boolean,
      default: false,
    },

    /**
     * Font size of the code block.
     * @values xs, sm, md, lg
     */
    size: {
      type: String,
      default: 'sm',
      validator: (val) => CODEBLOCK_SIZES.includes(val),
    },
  },
};
</script>
