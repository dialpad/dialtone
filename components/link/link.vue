<template>
  <a
    :class="[
      'd-link',
      LINK_KIND_MODIFIERS[kind],
    ]"
    data-qa="dt-link"
  >
    <slot />
  </a>
</template>

<script>
import { LINK_VARIANTS, LINK_KIND_MODIFIERS } from './link_constants.js';

/**
 * @property {String} href attribute
 * @property {String} rel attribute
 */
export default {
  name: 'DtLink',

  props: {
    /**
     * Applies the link variant styles
     */
    kind: {
      type: String,
      default: '',
      validator (kind) {
        return LINK_VARIANTS.includes(kind);
      },
    },
  },

  data () {
    return {
      LINK_KIND_MODIFIERS,
    };
  },
};
</script>
