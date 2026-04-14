<template>
  <component
    :is="as"
    v-if="scrollbar"
    v-dt-scrollbar:[scrollbarMode]
    data-qa="dt-box"
    :class="boxClasses"
  >
    <div
      data-qa="dt-box-scrollbar-content"
      class="d-box__scrollbar-content"
    >
      <!-- @slot Slot for main content -->
      <slot />
    </div>
  </component>
  <component
    :is="as"
    v-else
    data-qa="dt-box"
    :class="boxClasses"
  >
    <!-- @slot Slot for main content -->
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import {
  asValidator,
  spacingValidator,
  surfaceValidator,
  borderColorValidator,
  borderWidthValidator,
  borderRadiusValidator,
  shadowValidator,
  layoutValidator,
  overflowValidator,
  scrollbarValidator,
} from './validators.js';

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

  /**
   * Border color. Maps to --dt-color-border-* tokens.
   * When set, border-style: solid is applied automatically via @property defaults.
   * @values subtle, default, moderate, bold, accent, focus, brand, info, success, warning, critical, brand-subtle, brand-strong, ...
   */
  borderColor: {
    type: String,
    default: undefined,
    validator: borderColorValidator,
  },

  /**
   * Border width. Maps to --dt-size-border-* tokens.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidth: {
    type: String,
    default: undefined,
    validator: borderWidthValidator,
  },

  /**
   * Border radius. Maps to --dt-size-radius-* tokens.
   * @values 0, 100, 200, 300, 350, 400, 450, 500, 600, pill, circle
   */
  borderRadius: {
    type: String,
    default: undefined,
    validator: borderRadiusValidator,
  },

  /**
   * Box shadow. Maps to --dt-shadow-* tokens.
   * @values small, medium, large, extra-large, card
   */
  shadow: {
    type: String,
    default: undefined,
    validator: shadowValidator,
  },

  /**
   * Inline size. Maps to --dt-layout-* tokens.
   * @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600
   */
  inlineSize: {
    type: String,
    default: undefined,
    validator: layoutValidator,
  },

  /**
   * Block size. Maps to --dt-layout-* tokens.
   * @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600
   */
  blockSize: {
    type: String,
    default: undefined,
    validator: layoutValidator,
  },

  /**
   * Minimum inline size. Maps to --dt-layout-* tokens.
   */
  minInlineSize: {
    type: String,
    default: undefined,
    validator: layoutValidator,
  },

  /**
   * Maximum inline size. Maps to --dt-layout-* tokens.
   */
  maxInlineSize: {
    type: String,
    default: undefined,
    validator: layoutValidator,
  },

  /**
   * Minimum block size. Maps to --dt-layout-* tokens.
   */
  minBlockSize: {
    type: String,
    default: undefined,
    validator: layoutValidator,
  },

  /**
   * Maximum block size. Maps to --dt-layout-* tokens.
   */
  maxBlockSize: {
    type: String,
    default: undefined,
    validator: layoutValidator,
  },

  /**
   * Overflow behavior.
   * @values hidden, scroll, auto, clip, visible
   */
  overflow: {
    type: String,
    default: undefined,
    validator: overflowValidator,
  },

  /**
   * Custom scrollbar via OverlayScrollbars. When set, an inner viewport
   * wrapper (.d-box__scrollbar-content) is inserted automatically.
   * @values leave, scroll, move, never
   */
  scrollbar: {
    type: [String, Boolean],
    default: undefined,
    validator: scrollbarValidator,
  },
});

const scrollbarMode = computed(() => {
  if (props.scrollbar === true) return 'leave';
  return props.scrollbar ?? undefined;
});

function modifierClass (prefix, value) {
  return value ? `${prefix}-${value}` : false;
}

function paddingClasses (p) {
  return [
    modifierClass('d-box--p', p.padding),
    modifierClass('d-box--pi', p.paddingInline),
    modifierClass('d-box--pis', p.paddingInlineStart),
    modifierClass('d-box--pie', p.paddingInlineEnd),
    modifierClass('d-box--pbl', p.paddingBlock),
    modifierClass('d-box--pbs', p.paddingBlockStart),
    modifierClass('d-box--pbe', p.paddingBlockEnd),
  ];
}

function visualClasses (p) {
  return [
    modifierClass('d-box--surface', p.surface),
    modifierClass('d-box--bc', p.borderColor),
    modifierClass('d-box--bw', p.borderWidth),
    modifierClass('d-box--br', p.borderRadius),
    modifierClass('d-box--shadow', p.shadow),
    modifierClass('d-box--of', p.overflow),
  ];
}

function sizingClasses (p) {
  return [
    modifierClass('d-box--is', p.inlineSize),
    modifierClass('d-box--bls', p.blockSize),
    modifierClass('d-box--min-is', p.minInlineSize),
    modifierClass('d-box--max-is', p.maxInlineSize),
    modifierClass('d-box--min-bls', p.minBlockSize),
    modifierClass('d-box--max-bls', p.maxBlockSize),
  ];
}

const boxClasses = computed(() => [
  'd-box',
  ...paddingClasses(props),
  ...visualClasses(props),
  ...sizingClasses(props),
]);
</script>
