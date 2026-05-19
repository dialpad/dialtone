<template>
  <component
    :is="computedTag"
    :class="getLinkClasses()"
    data-qa="dt-link"
    v-bind="computedAttrs"
  >
    <!-- @slot Slot for main content -->
    <slot />
  </component>
</template>

<script>
import { resolveComponent } from 'vue';
import { LINK_VARIANTS, LINK_KIND_MODIFIERS, getLinkKindModifier } from './LinkConstants';

/**
 * A link is a navigational element that can be found on its own, within other text, or directly following content.
 * @property {String} rel attribute
 * @see https://dialtone.dialpad.com/components/link.html
 */
export default {
  name: 'DtLink',

  props: {
    /**
     * Applies the link variant styles
     * @values null, critical, warning, positive, info, muted, mention
     */
    tone: {
      type: String,
      default: '',
      validator (tone) {
        return LINK_VARIANTS.includes(tone);
      },
    },

    /**
     * @deprecated Use tone
     */
    kind: {
      type: String,
      default: undefined,
    },

    /**
     * Determines whether the link should have inverted styling
     * default is false.
     * @values true, false
     * @deprecated Use v-dt-mode directive instead.
     */
    inverted: {
      type: Boolean,
      default: false,
    },

    /**
     * URL for anchor link navigation. Renders as a native <a> element.
     */
    href: {
      type: String,
      default: null,
    },

    /**
     * Vue Router destination. Renders as a <router-link>.
     * Takes precedence over href when both are provided.
     * @see https://router.vuejs.org/api/interfaces/RouterLinkProps.html#to
     */
    to: {
      type: [String, Object],
      default: null,
    },

    /**
     * When true, navigation replaces the current history entry instead of pushing.
     * Only applies when `to` is provided.
     * @values true, false
     */
    replace: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether the link should display an underline.
     * @values true, false
     */
    underline: {
      type: Boolean,
      default: true,
    },
  },

  data () {
    return {
      LINK_KIND_MODIFIERS,
    };
  },

  computed: {
    resolvedTone () {
      return this.kind ?? this.tone;
    },

    computedTag () {
      if (this.to) {
        return resolveComponent('RouterLink');
      }
      return 'a';
    },

    computedAttrs () {
      if (this.to) {
        return {
          to: this.to,
          replace: this.replace,
        };
      }
      return {
        href: this.href || 'javascript:void(0)',
      };
    },
  },

  methods: {
    getLinkClasses () {
      return [
        'd-link',
        getLinkKindModifier(this.resolvedTone, this.inverted),
        { 'd-link--no-underline': !this.underline },
      ];
    },
  },
};
</script>
