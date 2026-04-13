<template>
  <component
    :is="as"
    data-qa="dt-text"
    :class="textClasses"
    :style="textStyles"
  >
    <!-- @slot Default slot for text content -->
    <slot />
  </component>
</template>

<script>
import {
  TEXT_KIND_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_SIZE_MAP,
  TEXT_HEADLINE_ONLY_SIZES,
  TEXT_ALIGN_MODIFIERS,
  TEXT_TONE_MODIFIERS,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_LINE_CLAMP_CLASS,
  TEXT_WRAP_MODIFIERS,
  TEXT_BOX_TRIM_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
} from './text_constants';

const DEFAULT_SIZE = '300';
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
     * Size variant within the selected `kind`. Falls back to `md`/300 if unsupported.
     * Headline supports all sizes; body/label/code support 100-400.
     * @values 100, 200, 300, 400, 500, 600, 700
     */
    size: {
      type: [String, Number],
      default: null,
    },

    /**
     * Semantic foreground color.
     * @values primary, secondary, tertiary, muted, disabled, placeholder, critical, critical-strong, positive, positive-strong, success, success-strong, warning, neutral-black, neutral-white
     */
    tone: {
      type: String,
      default: null,
      validator: (value) => {
        return value === null || Object.prototype.hasOwnProperty.call(TEXT_TONE_MODIFIERS, value);
      },
    },

    /**
     * Logical text alignment. Requires block/inline-block context.
     * @values start, center, end, justify
     */
    align: {
      type: String,
      default: null,
      validator: (value) => {
        return value === null || Object.prototype.hasOwnProperty.call(TEXT_ALIGN_MODIFIERS, value);
      },
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
     * Controls text-box-trim (leading space above/below text). Useful for tight component layouts.
     * @values start, end, both
     */
    textBoxTrim: {
      type: String,
      default: null,
      validator: (value) => {
        return value === null || Object.prototype.hasOwnProperty.call(TEXT_BOX_TRIM_MODIFIERS, value);
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

      const textBoxTrimClass = this.getTextBoxTrimClass();
      if (textBoxTrimClass) {
        classes.push(textBoxTrimClass);
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
        if (this.size) {
          console.warn('[DtText] size prop has no effect without kind. Set kind="headline|body|label|code".');
        }
        return null;
      }

      if (!Object.prototype.hasOwnProperty.call(TEXT_KIND_MODIFIERS, this.kind)) {
        console.warn(`[DtText] Unsupported kind "${this.kind}".`);
        return null;
      }

      const allowedSizes = TEXT_SIZE_MODIFIERS[this.kind] || [];
      const rawSize = this.size != null ? String(this.size) : null;
      const requestedSize = rawSize || DEFAULT_SIZE;
      let resolvedSize = requestedSize;

      if (!allowedSizes.includes(requestedSize)) {
        // Headline-only sizes (3xl, 2xl, xl, 500, 600, 700) throw an error when used with incompatible kinds
        if (TEXT_HEADLINE_ONLY_SIZES.includes(requestedSize)) {
          throw new Error(
            `[DtText] size="${requestedSize}" is only valid for kind="headline". ` +
            `Cannot use with kind="${this.kind}".`,
          );
        }

        // Universal sizes fall back gracefully with a warning
        const fallbackSize = allowedSizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : allowedSizes[0];
        if (fallbackSize) {
          resolvedSize = fallbackSize;
        }
        console.warn(`[DtText] size="${requestedSize}" is not valid for kind="${this.kind}". Using "${resolvedSize}" instead.`);
      }

      if (!resolvedSize) {
        return null;
      }

      // Map numeric sizes to t-shirt CSS class suffix
      const cssSuffix = TEXT_SIZE_MAP[resolvedSize] || resolvedSize;
      return `${TEXT_KIND_MODIFIERS[this.kind]}--${cssSuffix}`;
    },

    getModifierClass (value, modifiers, propName) {
      if (value === null || value === undefined) {
        return null;
      }

      const className = modifiers[value];
      if (!className) {
        console.warn(`[DtText] Unsupported ${propName} "${value}".`);
        return null;
      }

      return className;
    },

    getAlignClass () {
      return this.getModifierClass(this.align, TEXT_ALIGN_MODIFIERS, 'align');
    },

    getToneClass () {
      return this.getModifierClass(this.tone, TEXT_TONE_MODIFIERS, 'tone');
    },

    getWrapClass () {
      return this.getModifierClass(this.wrap, TEXT_WRAP_MODIFIERS, 'wrap');
    },

    getTextBoxTrimClass () {
      return this.getModifierClass(this.textBoxTrim, TEXT_BOX_TRIM_MODIFIERS, 'textBoxTrim');
    },

    getStrengthClass () {
      return this.getModifierClass(this.strength, TEXT_STRENGTH_MODIFIERS, 'strength');
    },

    getDensityClass () {
      return this.getModifierClass(this.density, TEXT_DENSITY_MODIFIERS, 'density');
    },
  },
};
</script>
