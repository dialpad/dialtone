<template>
  <component
    :is="as"
    :class="textClasses"
    :style="textStyles"
  >
    <slot v-if="hasDefaultSlot" />
    <template v-else-if="text !== null && text !== undefined">
      {{ text }}
    </template>
  </component>
</template>

<script>
import { hasSlotContent } from '@/common/utils';
import {
  TEXT_KIND_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
  TEXT_ALIGN_MODIFIERS,
  TEXT_TONE_PREFIX,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_LINE_CLAMP_CLASS,
} from './text_constants';

const DEFAULT_SIZE = 'md';

/**
 * Dialtone text primitive that applies typography tokens based on semantic props.
 * @see https://dialtone.dialpad.com/components/text.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtText',

  props: {
    /**
     * HTML tag or component used for rendering.
     * @values span, p, h1, h2, h3, h4, h5, h6, label, div, component
     */
    as: {
      type: String,
      default: 'span',
    },

    /**
     * Typography kind mapping to headline/body/label/helper/code token sets.
     * @values headline, body, label, helper, code
     */
    kind: {
      type: String,
      default: null,
      validator: (value) => {
        return value === null || Object.prototype.hasOwnProperty.call(TEXT_KIND_MODIFIERS, value);
      },
    },

    /**
     * Size variant within the selected `kind`. Falls back to `md` if unsupported. e.g. `body` doesn't have `lg` variant.
     * @values eyebrow, sm, md, lg, xl, xxl
     */
    size: {
      type: String,
      default: null,
    },

    /**
     * Weight override aligned with type tokens. Does not apply to all kinds. e.g. `body` doesn't have `soft` strength.
     * @values soft, plain
     */
    strength: {
      type: String,
      default: null,
    },

    /**
     * Line-height density modifier for compact typography. Does not apply to all kinds.
     * @values compact
     */
    density: {
      type: String,
      default: null,
    },

    /**
     * Aligns to available foreground color tokens, e.g. `d-fc-tertiary`, `d-fc-critical`, etc.
     * @values (Dialtone foreground token suffixes, e.g., primary, secondary, success)
     */
    tone: {
      type: String,
      default: null,
    },

    /**
     * Logical text alignment. Requires block/inline-block context.
     * @values start, center, end, justify
     */
    align: {
      type: String,
      default: null,
    },

    /**
     * Enables single-line truncation (i.e. ellipsis) when true; requires block/inline-block context.
     */
    truncate: {
      type: Boolean,
      default: false,
    },

    /**
     * Applies multi-line truncation (i.e. clamp) when greater than zero; requires block/inline-block context.
     */
    maxLines: {
      type: Number,
      default: null,
      validator: (value) => {
        return value === null || (Number.isInteger(value) && value > 0);
      },
    },

    /**
     * Renders numeric content with tabular figures.
     */
    numeric: {
      type: Boolean,
      default: false,
    },

    /**
     * Optional string fallback rendered when default slot is empty.
     */
    text: {
      type: String,
      default: null,
    },
  },

  computed: {
    hasDefaultSlot () {
      return hasSlotContent(this.$slots.default);
    },

    textClasses () {
      const classes = ['d-text'];
      const variantClass = this.getVariantClass();
      if (variantClass) {
        classes.push(variantClass);
      }

      const alignClass = this.getAlignClass();
      if (alignClass) {
        classes.push(alignClass);
      }

      const toneClass = this.getToneClass();
      if (toneClass) {
        classes.push(toneClass);
      }

      if (this.truncate) {
        classes.push(TEXT_TRUNCATE_CLASS);
      }

      if (this.numeric) {
        classes.push(TEXT_NUMERIC_CLASS);
      }

      if (this.maxLines) {
        classes.push(TEXT_LINE_CLAMP_CLASS);
      }

      return classes;
    },

    textStyles () {
      if (!this.maxLines) {
        return undefined;
      }

      return {
        '--dt-text-line-clamp': this.maxLines,
      };
    },
  },

  methods: {
    getVariantClass () {
      if (!this.kind) {
        return null;
      }

      if (!Object.prototype.hasOwnProperty.call(TEXT_KIND_MODIFIERS, this.kind)) {
        console.warn(`[DtText] Unsupported kind "${this.kind}".`);
        return null;
      }

      const allowedSizes = TEXT_SIZE_MODIFIERS[this.kind] || [];
      const requestedSize = this.size || DEFAULT_SIZE;
      let resolvedSize = requestedSize;

      if (!allowedSizes.includes(requestedSize)) {
        const fallbackSize = allowedSizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : allowedSizes[0];
        if (fallbackSize) {
          resolvedSize = fallbackSize;
        }
        console.warn(`[DtText] size="${requestedSize}" is not valid for kind="${this.kind}". Using "${resolvedSize}" instead.`);
      }

      if (!resolvedSize) {
        return null;
      }

      let modifier = `${TEXT_KIND_MODIFIERS[this.kind]}--${resolvedSize}`;

      if (this.strength) {
        if (TEXT_STRENGTH_MODIFIERS.includes(this.strength)) {
          modifier += `-${this.strength}`;
        } else {
          console.warn(`[DtText] Unsupported strength "${this.strength}".`);
        }
      }

      if (this.density) {
        if (TEXT_DENSITY_MODIFIERS.includes(this.density)) {
          modifier += `-${this.density}`;
        } else {
          console.warn(`[DtText] Unsupported density "${this.density}".`);
        }
      }

      return modifier;
    },

    getAlignClass () {
      if (!this.align) {
        return null;
      }

      const alignClass = TEXT_ALIGN_MODIFIERS[this.align];
      if (!alignClass) {
        console.warn(`[DtText] Unsupported align "${this.align}".`);
        return null;
      }

      return alignClass;
    },

    getToneClass () {
      if (!this.tone) {
        return null;
      }

      return `${TEXT_TONE_PREFIX}${this.tone}`;
    },
  },
};
</script>
