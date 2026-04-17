<!-- eslint-disable vue/no-restricted-class -->
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
import { computed, onMounted } from 'vue';
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
  as: { type: String, default: 'div', validator: asValidator },

  /**
   * Custom scrollbar via OverlayScrollbars. When set, an inner viewport
   * wrapper (.d-box__scrollbar-content) is inserted automatically.
   * @values leave, scroll, move, never
   */
  scrollbar: { type: [String, Boolean], default: undefined, validator: scrollbarValidator },

  /**
   * Background surface color. Maps to --dt-color-surface-* tokens.
   * @values primary, primary-opaque, secondary, secondary-opaque, moderate, moderate-opaque, bold, bold-opaque, strong, strong-opaque, contrast, contrast-opaque, brand, brand-opaque, brand-subtle, brand-subtle-opaque, brand-strong, info, info-opaque, info-subtle, info-subtle-opaque, info-strong, positive, positive-opaque, positive-subtle, positive-subtle-opaque, positive-strong, warning, warning-opaque, warning-subtle, warning-subtle-opaque, warning-strong, critical, critical-opaque, critical-subtle, critical-subtle-opaque, critical-strong, backdrop
   */
  surface: { type: String, default: undefined, validator: surfaceValidator },

  /**
   * Border color. Maps to --dt-color-border-* tokens.
   * Defaults to 'default'. Visible when any border-width prop is set.
   * @values transparent, subtle, default, moderate, bold, positive, positive-subtle, positive-strong, warning, warning-subtle, warning-strong, critical, critical-subtle, critical-strong, focus, brand, brand-subtle, brand-strong
   */
  borderColor: { type: String, default: 'default', validator: borderColorValidator },

  /**
   * Border radius. Maps to --dt-size-radius-* tokens.
   * @values 0, 100, 200, 300, 350, 400, 450, 500, 600, pill, circle
   */
  borderRadius: { type: String, default: undefined, validator: borderRadiusValidator },

  /**
   * Border width on all sides. Maps to --dt-size-border-* tokens.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidth: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Border width on the block axis (top/bottom in horizontal writing mode).
   * Overrides `borderWidth` for block sides.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthBlock: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Border width on the block-end side.
   * Overrides `borderWidthBlock` and `borderWidth` for block-end.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthBlockEnd: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Border width on the block-start side.
   * Overrides `borderWidthBlock` and `borderWidth` for block-start.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthBlockStart: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Border width on the inline axis (left/right in LTR).
   * Overrides `borderWidth` for inline sides.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthInline: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Border width on the inline-end side.
   * Overrides `borderWidthInline` and `borderWidth` for inline-end.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthInlineEnd: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Border width on the inline-start side.
   * Overrides `borderWidthInline` and `borderWidth` for inline-start.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthInlineStart: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Padding on all sides. Accepts spacing token scale values.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  padding: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Padding on the block axis (top/bottom in horizontal writing mode).
   * Overrides `padding` for the block axis.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingBlock: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Padding on the block-end side.
   * Overrides `paddingBlock` and `padding` for block-end.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingBlockEnd: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Padding on the block-start side.
   * Overrides `paddingBlock` and `padding` for block-start.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingBlockStart: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Padding on the inline axis (left/right in LTR).
   * Overrides `padding` for the inline axis.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingInline: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Padding on the inline-end side.
   * Overrides `paddingInline` and `padding` for inline-end.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingInlineEnd: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Padding on the inline-start side.
   * Overrides `paddingInline` and `padding` for inline-start.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingInlineStart: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Block size (height in horizontal writing mode). Maps to --dt-layout-* tokens.
   * @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  blockSize: { type: String, default: undefined, validator: layoutValidator },

  /**
   * Inline size (width in horizontal writing mode). Maps to --dt-layout-* tokens.
   * @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  inlineSize: { type: String, default: undefined, validator: layoutValidator },

  /**
   * Maximum block size. Maps to --dt-layout-* tokens.
   * @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  maxBlockSize: { type: String, default: undefined, validator: layoutValidator },

  /**
   * Minimum block size. Maps to --dt-layout-* tokens.
   * @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  minBlockSize: { type: String, default: undefined, validator: layoutValidator },

  /**
   * Maximum inline size. Maps to --dt-layout-* tokens.
   * @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  maxInlineSize: { type: String, default: undefined, validator: layoutValidator },

  /**
   * Minimum inline size. Maps to --dt-layout-* tokens.
   * @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  minInlineSize: { type: String, default: undefined, validator: layoutValidator },

  /**
   * Box shadow. Maps to --dt-shadow-* tokens.
   * @values small, medium, large, extra-large, card
   */
  shadow: { type: String, default: undefined, validator: shadowValidator },

  /**
   * Overflow behavior.
   * @values hidden, scroll, auto, clip, visible
   */
  overflow: { type: String, default: undefined, validator: overflowValidator },
});

const SCROLLBAR_INCOMPATIBLE_ELEMENTS = ['ul', 'ol', 'span', 'fieldset'];

const scrollbarMode = computed(() => {
  if (props.scrollbar === true) return 'leave';
  return props.scrollbar ?? undefined;
});

onMounted(() => {
  if (props.scrollbar && SCROLLBAR_INCOMPATIBLE_ELEMENTS.includes(props.as)) {
    console.warn(
      `[DtBox] scrollbar prop inserts a <div> wrapper which breaks semantic child structure ` +
      `for <${props.as}>. Consider applying scrollbar on a parent DtBox container instead.`,
    );
  }
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
    modifierClass('d-box--bwi', p.borderWidthInline),
    modifierClass('d-box--bwis', p.borderWidthInlineStart),
    modifierClass('d-box--bwie', p.borderWidthInlineEnd),
    modifierClass('d-box--bwbl', p.borderWidthBlock),
    modifierClass('d-box--bwbs', p.borderWidthBlockStart),
    modifierClass('d-box--bwbe', p.borderWidthBlockEnd),
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
