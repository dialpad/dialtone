<template>
  <a
    :class="[
      'd-link',
      LINK_KIND_MODIFIERS[kind],
    ]"
    data-qa="dt-link"
    v-on="$listeners"
  >
    <slot />
  </a>
</template>

<script>
import { LINK_VARIANTS, LINK_KIND_MODIFIERS } from './link_constants.js';

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

  emits: ['click', 'focusin', 'focusout'],

  data () {
    return {
      LINK_KIND_MODIFIERS,
    };
  },
};
</script>
