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
  /** @values div, span, section, article, aside, main, header, footer, nav, ul, ol, li, fieldset, form, figure */
  as: { type: String, default: 'div', validator: asValidator },

  /**
   * Custom scrollbar via OverlayScrollbars. When set, an inner viewport
   * wrapper (.d-box__scrollbar-content) is inserted automatically.
   * @values leave, scroll, move, never
   */
  scrollbar: { type: [String, Boolean], default: undefined, validator: scrollbarValidator },

  /** @values primary, secondary, moderate, bold, strong, contrast, backdrop, brand, info, positive, warning, critical, brand-subtle, brand-strong, ... */
  surface: { type: String, default: undefined, validator: surfaceValidator },

  /**
   * Defaults to 'default'. Visible when any border-width prop is set.
   * @values transparent, subtle, default, moderate, bold, accent, focus, brand, positive, warning, critical, brand-subtle, brand-strong, ...
   */
  borderColor: { type: String, default: 'default', validator: borderColorValidator },

  /** @values 0, 100, 200, 300, 350, 400, 450, 500, 600, pill, circle */
  borderRadius: { type: String, default: undefined, validator: borderRadiusValidator },

  /** @values 0, 50, 100, 150, 200, 300, 400 */
  borderWidth: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Overrides `borderWidth` for block sides.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthBlock: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Overrides `borderWidthBlock`.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthBlockEnd: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Overrides `borderWidthBlock`.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthBlockStart: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Overrides `borderWidth` for inline sides.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthInline: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Overrides `borderWidthInline`.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthInlineEnd: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * Overrides `borderWidthInline`.
   * @values 0, 50, 100, 150, 200, 300, 400
   */
  borderWidthInlineStart: { type: String, default: undefined, validator: borderWidthValidator },

  /**
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  padding: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Overrides `padding` for block axis.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingBlock: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Overrides `paddingBlock`.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingBlockEnd: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Overrides `paddingBlock`.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingBlockStart: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Overrides `padding` for inline axis.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingInline: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Overrides `paddingInline`.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingInlineEnd: { type: String, default: undefined, validator: spacingValidator },

  /**
   * Overrides `paddingInline`.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
   */
  paddingInlineStart: { type: String, default: undefined, validator: spacingValidator },

  /** @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600 */
  blockSize: { type: String, default: undefined, validator: layoutValidator },

  /** @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600 */
  inlineSize: { type: String, default: undefined, validator: layoutValidator },

  /** @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600 */
  maxBlockSize: { type: String, default: undefined, validator: layoutValidator },

  /** @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600 */
  minBlockSize: { type: String, default: undefined, validator: layoutValidator },

  /** @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600 */
  maxInlineSize: { type: String, default: undefined, validator: layoutValidator },

  /** @values 0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600 */
  minInlineSize: { type: String, default: undefined, validator: layoutValidator },

  /** @values small, medium, large, extra-large, card */
  shadow: { type: String, default: undefined, validator: shadowValidator },

  /** @values hidden, scroll, auto, clip, visible */
  overflow: { type: String, default: undefined, validator: overflowValidator },
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
