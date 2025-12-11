<template>
  <component
    :is="as"
    data-qa="dt-text"
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
  TEXT_HEADLINE_ONLY_SIZES,
  TEXT_ALIGN_MODIFIERS,
  TEXT_TONE_PREFIX,
  TEXT_TONE_TOKENS,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_LINE_CLAMP_CLASS,
  TEXT_WRAP_MODIFIERS,
  TEXT_TRIM_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
} from './text_constants';

const DEFAULT_SIZE = 'md';
const SEMANTIC_HEADING_ELEMENTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

// Module-level flag to emit info only once per session
let hasEmittedHeadlineSemanticInfo = false;

// Exported for testing purposes only
export const resetHeadlineSemanticInfoFlag = () => {
  hasEmittedHeadlineSemanticInfo = false;
};

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
     * Typography kind mapping to headline/body/label/code token sets.
     * @values headline, body, label, code
     */
    kind: {
      type: String,
      default: null,
      validator: (value) => {
        return value === null || Object.prototype.hasOwnProperty.call(TEXT_KIND_MODIFIERS, value);
      },
    },

    /**
     * Size variant within the selected `kind`. Falls back to `md` if unsupported.
     * Headline supports all sizes; body/label/code support lg, md, sm, xs.
     * @values xxxl, xxl, xl, lg, md, sm, xs
     */
    size: {
      type: String,
      default: null,
    },

    /**
     * Aligns to available foreground color tokens, e.g. `tertiary`, `critical`, etc.
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

    /**
     * Controls text wrapping behavior.
     * @values wrap, nowrap, balance, pretty
     */
    wrap: {
      type: String,
      default: null,
      validator: (value) => {
        return value === null || Object.prototype.hasOwnProperty.call(TEXT_WRAP_MODIFIERS, value);
      },
    },

    /**
     * Controls leading space trimming. Useful for tight component layouts.
     * @values start, end, both
     */
    trim: {
      type: String,
      default: null,
      validator: (value) => {
        return value === null || Object.prototype.hasOwnProperty.call(TEXT_TRIM_MODIFIERS, value);
      },
    },

    /**
     * Overrides font-weight. Applies to any kind/size combination.
     * @values bold, semibold, medium, normal
     */
    strength: {
      type: String,
      default: null,
      validator: (value) => {
        return value === null || Object.prototype.hasOwnProperty.call(TEXT_STRENGTH_MODIFIERS, value);
      },
    },

    /**
     * Overrides line-height. Applies to any kind/size combination.
     * @values 100, 200, 300, 400, 500, 600
     */
    density: {
      type: [String, Number],
      default: null,
      validator: (value) => {
        return value === null || Object.prototype.hasOwnProperty.call(TEXT_DENSITY_MODIFIERS, value);
      },
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

      const wrapClass = this.getWrapClass();
      if (wrapClass) {
        classes.push(wrapClass);
      }

      const trimClass = this.getTrimClass();
      if (trimClass) {
        classes.push(trimClass);
      }

      const strengthClass = this.getStrengthClass();
      if (strengthClass) {
        classes.push(strengthClass);
      }

      const densityClass = this.getDensityClass();
      if (densityClass) {
        classes.push(densityClass);
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

  mounted () {
    // Emit info once per session when headline is used without semantic heading element
    if (
      !hasEmittedHeadlineSemanticInfo &&
      this.kind === 'headline' &&
      !SEMANTIC_HEADING_ELEMENTS.includes(this.as)
    ) {

      console.info(
        '[DtText] kind="headline" is used without a semantic heading element. ' +
        'Consider using as="h1|h2|h3|h4|h5|h6" for better accessibility.',
      );
      hasEmittedHeadlineSemanticInfo = true;
    }
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
        // Headline-only sizes (xxxl, xxl, xl) throw an error when used with incompatible kinds
        if (TEXT_HEADLINE_ONLY_SIZES.includes(requestedSize)) {
          throw new Error(
            `[DtText] size="${requestedSize}" is only valid for kind="headline". ` +
            `Cannot use with kind="${this.kind}".`,
          );
        }

        // Universal sizes (lg, md, sm, xs) fall back gracefully with a warning
        const fallbackSize = allowedSizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : allowedSizes[0];
        if (fallbackSize) {
          resolvedSize = fallbackSize;
        }
        console.warn(`[DtText] size="${requestedSize}" is not valid for kind="${this.kind}". Using "${resolvedSize}" instead.`);
      }

      if (!resolvedSize) {
        return null;
      }

      return `${TEXT_KIND_MODIFIERS[this.kind]}--${resolvedSize}`;
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

      if (!TEXT_TONE_TOKENS.includes(this.tone)) {
        console.warn(`[DtText] Unsupported tone "${this.tone}".`);
        return null;
      }

      return `${TEXT_TONE_PREFIX}${this.tone}`;
    },

    getWrapClass () {
      if (!this.wrap) {
        return null;
      }

      const wrapClass = TEXT_WRAP_MODIFIERS[this.wrap];
      if (!wrapClass) {
        console.warn(`[DtText] Unsupported wrap "${this.wrap}".`);
        return null;
      }

      return wrapClass;
    },

    getTrimClass () {
      if (!this.trim) {
        return null;
      }

      const trimClass = TEXT_TRIM_MODIFIERS[this.trim];
      if (!trimClass) {
        console.warn(`[DtText] Unsupported trim "${this.trim}".`);
        return null;
      }

      return trimClass;
    },

    getStrengthClass () {
      if (!this.strength) {
        return null;
      }

      const strengthClass = TEXT_STRENGTH_MODIFIERS[this.strength];
      if (!strengthClass) {
        console.warn(`[DtText] Unsupported strength "${this.strength}".`);
        return null;
      }

      return strengthClass;
    },

    getDensityClass () {
      if (this.density === null || this.density === undefined) {
        return null;
      }

      const densityClass = TEXT_DENSITY_MODIFIERS[this.density];
      if (!densityClass) {
        console.warn(`[DtText] Unsupported density "${this.density}".`);
        return null;
      }

      return densityClass;
    },
  },
};
</script>
