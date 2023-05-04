<template>
  <a
    :class="[
      'd-link',
      LINK_KIND_MODIFIERS[kind],
    ]"
    data-qa="dt-link"
    v-on="$listeners"
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
 * @see https://dialpad.design/components/link.html
 */
export default {
  name: 'DtLink',

  props: {
    /**
     * Applies the link variant styles
     * @values null, danger, warning, success, muted, inverted
     */
    kind: {
      type: String,
      default: '',
      validator (kind) {
        return LINK_VARIANTS.includes(kind);
      },
    },
  },

  emits: [
    /**
     * Native click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',

    /**
     * Native focus in event
     *
     * @event focusin
     * @type {FocusEvent}
     */
    'focusin',

    /**
     * Native focus out event
     *
     * @event focusout
     * @type {FocusEvent}
     */
    'focusout',
  ],

  data () {
    return {
      LINK_KIND_MODIFIERS,
    };
  },
};
</script>
