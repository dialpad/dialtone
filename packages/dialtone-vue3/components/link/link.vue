<template>
  <a
    :class="[
      'd-link',
      LINK_KIND_MODIFIERS[kind],
    ]"
    data-qa="dt-link"
    :href="'href' in $attrs ? $attrs.href : 'javascript:void(0)'"
  >
    <!-- @slot Slot for main content -->
    <slot />
  </a>
</template>

<script>
import { LINK_VARIANTS, LINK_KIND_MODIFIERS } from './link_constants';

/**
 * A link is a navigational element that can be found on its own, within other text, or directly following content.
 * @property {String} href attribute
 * @property {String} rel attribute
 * @see https://dialtone.dialpad.com/components/link.html
 */
export default {
  name: 'DtLink',

  props: {
    /**
     * Applies the link variant styles
     * @values null, danger, warning, success, muted, inverted, mention
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
