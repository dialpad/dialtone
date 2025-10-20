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
  TEXT_WEIGHT_MODIFIERS,
  TEXT_ALIGN_MODIFIERS,
  TEXT_TONE_PREFIX,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_LINE_CLAMP_CLASS,
} from './text_constants';

const DEFAULT_SIZE = 'md';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtText',

  props: {
    as: {
      type: String,
      default: 'span',
    },

    kind: {
      type: String,
      default: null,
      validator: (value) => {
        return value === null || Object.prototype.hasOwnProperty.call(TEXT_KIND_MODIFIERS, value);
      },
    },

    size: {
      type: String,
      default: null,
    },

    strength: {
      type: String,
      default: null,
    },

    density: {
      type: String,
      default: null,
    },

    weight: {
      type: String,
      default: null,
    },

    tone: {
      type: String,
      default: null,
    },

    align: {
      type: String,
      default: null,
    },

    truncate: {
      type: Boolean,
      default: false,
    },

    maxLines: {
      type: Number,
      default: null,
      validator: (value) => {
        return value === null || (Number.isInteger(value) && value > 0);
      },
    },

    numeric: {
      type: Boolean,
      default: false,
    },

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

      const weightClass = this.getWeightClass();
      if (weightClass) {
        classes.push(weightClass);
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

    getWeightClass () {
      if (!this.weight) {
        return null;
      }

      const weightClass = TEXT_WEIGHT_MODIFIERS[this.weight];
      if (!weightClass) {
        console.warn(`[DtText] Unsupported weight "${this.weight}".`);
        return null;
      }

      return weightClass;
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
