<template>
  <component
    :is="as"
    data-qa="dt-box"
    :class="boxClasses"
  >
    <!-- @slot Slot for main content -->
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { asValidator, spacingValidator, surfaceValidator } from './validators.js';

defineOptions({
  name: 'DtBox',
});

const props = defineProps({
  /**
   * HTML element to render as.
   * @values div, span, section, article, aside, main, header, footer, nav, ul, ol, li, fieldset, form, figure
   */
  as: {
    type: String,
    default: 'div',
    validator: asValidator,
  },

  /**
   * Padding on all sides. Accepts spacing token scale values.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  padding: {
    type: String,
    default: undefined,
    validator: spacingValidator,
  },

  /**
   * Padding on the inline axis (left/right in LTR).
   * Overrides `padding` for the inline axis.
   */
  paddingInline: {
    type: String,
    default: undefined,
    validator: spacingValidator,
  },

  /**
   * Padding on the inline-start side.
   * Overrides `paddingInline` and `padding` for inline-start.
   */
  paddingInlineStart: {
    type: String,
    default: undefined,
    validator: spacingValidator,
  },

  /**
   * Padding on the inline-end side.
   * Overrides `paddingInline` and `padding` for inline-end.
   */
  paddingInlineEnd: {
    type: String,
    default: undefined,
    validator: spacingValidator,
  },

  /**
   * Padding on the block axis (top/bottom in horizontal writing mode).
   * Overrides `padding` for the block axis.
   */
  paddingBlock: {
    type: String,
    default: undefined,
    validator: spacingValidator,
  },

  /**
   * Padding on the block-start side.
   * Overrides `paddingBlock` and `padding` for block-start.
   */
  paddingBlockStart: {
    type: String,
    default: undefined,
    validator: spacingValidator,
  },

  /**
   * Padding on the block-end side.
   * Overrides `paddingBlock` and `padding` for block-end.
   */
  paddingBlockEnd: {
    type: String,
    default: undefined,
    validator: spacingValidator,
  },

  /**
   * Background surface color. Maps to --dt-color-surface-* tokens.
   * @values primary, secondary, moderate, bold, strong, contrast, backdrop, brand, info, success, warning, critical, brand-subtle, brand-strong, ...
   */
  surface: {
    type: String,
    default: undefined,
    validator: surfaceValidator,
  },
});

const boxClasses = computed(() => [
  'd-box',
  props.padding && `d-box--p-${props.padding}`,
  props.paddingInline && `d-box--pi-${props.paddingInline}`,
  props.paddingInlineStart && `d-box--pis-${props.paddingInlineStart}`,
  props.paddingInlineEnd && `d-box--pie-${props.paddingInlineEnd}`,
  props.paddingBlock && `d-box--pbl-${props.paddingBlock}`,
  props.paddingBlockStart && `d-box--pbs-${props.paddingBlockStart}`,
  props.paddingBlockEnd && `d-box--pbe-${props.paddingBlockEnd}`,
  props.surface && `d-box--surface-${props.surface}`,
]);
</script>
