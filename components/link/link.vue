<template>
  <a
    :class="linkClasses"
    data-qa="dt-link"
  >
    <slot />
  </a>
</template>

<script>
import { LINK_VARIANTS } from './link_constants.js';

export default {
  name: 'DtLink',

  inheritAttrs: true,

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

  computed: {
    linkClasses () {
      return [
        'd-link',
        { [`d-link--${this.kind}`]: this.kind.length > 0 },
      ];
    },
  },
};
</script>
