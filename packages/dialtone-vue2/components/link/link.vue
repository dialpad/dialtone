<template>
  <a
    :class="getLinkClasses()"
    data-qa="dt-link"
    :href="'href' in $attrs ? $attrs.href : 'javascript:void(0)'"
    v-on="$listeners"
  >
    <!-- @slot Slot for main content -->
    <slot />
  </a>
</template>

<script>
import { LINK_VARIANTS, LINK_KIND_MODIFIERS, getLinkKindModifier } from './link_constants';

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
     * @values null, danger, warning, success, muted, mention
     */
    kind: {
      type: String,
      default: '',
      validator (kind) {
        return LINK_VARIANTS.includes(kind);
      },
    },

    /**
     * Determines whether the link should have inverted styling
     * default is false.
     * @values true, false
     */
    inverted: {
      type: Boolean,
      default: false,
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

  methods: {
    getLinkClasses () {
      return [
        'd-link',
        getLinkKindModifier(this.kind, this.inverted),
      ];
    },
  },
};
</script>
