<template>
  <div
    v-bind="wrapperAttrs"
    :class="[
      'd-slider',
      $attrs.class,
      {
        'd-slider--disabled': disabled,
        'd-slider--vertical': isVertical,
        'd-slider--inverted': fillOrigin === 'end',
        'd-slider--dragging': isDragging,
      },
    ]"
    :style="$attrs.style"
    :data-disabled="disabled || undefined"
    :data-orientation="orientation"
    :data-dragging="isDragging || undefined"
    data-qa="dt-slider"
  >
    <div
      v-if="showLabel"
      :id="labelId"
      :class="['d-slider__label', labelClass]"
      data-qa="dt-slider-label"
    >
      <!-- @slot Slot for the label, defaults to the label prop. Scoped with
           :value (Number, or Number[] in range mode) — the live value(s),
           updating as the thumb is dragged — for labels that echo the
           current value. Required for accessibility; set showLabel to false
           to hide it, and provide the label prop (not just this slot) so its
           text can be promoted to aria-label — a slot's rich markup can't
           collapse to the flat string aria-label requires. -->
      <slot
        name="label"
        :value="currentValue"
      >
        <dt-text
          v-if="label"
          kind="label"
          :size="resolvedLabelSize"
          :strength="labelStrength"
          :tone="disabled ? 'disabled' : 'secondary'"
        >
          {{ label }}
        </dt-text>
      </slot>
    </div>
    <div
      :class="['d-slider__body', { 'd-slider__body--reserve-annotation-space': reservesAnnotationSpace }]"
    >
      <div
        v-if="hasSlotContent($slots.start)"
        :class="['d-slider__start', startClass]"
        data-qa="dt-slider-start"
      >
        <!-- @slot Optional content at the inline-start end of the track (aka left).
             When using icon-only content, add aria-label or hidden text to the icon. -->
        <slot name="start" />
      </div>
      <div
        ref="controlRef"
        class="d-slider__control"
        :style="isVertical ? { touchAction: 'pan-x' } : { touchAction: 'pan-y' }"
        data-qa="dt-slider-control"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div
          class="d-slider__track"
          data-qa="dt-slider-track"
        />
        <div
          class="d-slider__indicator"
          :style="indicatorStyle"
          data-qa="dt-slider-indicator"
        />
        <template v-if="showTicks">
          <div
            v-for="(tickValue, i) in computedTickValues"
            :key="i"
            class="d-slider__tick"
            :style="tickPositionStyle(tickValue)"
            data-qa="dt-slider-tick"
          />
        </template>
        <div
          v-for="(val, i) in internalValues"
          :key="`thumb-visual-${i}`"
          :ref="(el) => { thumbVisualRefs[i] = el; }"
          :class="[
            'd-slider__thumb-visual',
            {
              'd-slider__thumb-visual--focused': focusedThumbIndex === i,
              'd-slider__thumb-visual--active': activeThumbIndex === i,
            },
          ]"
          :style="thumbPositionStyle(val)"
          data-qa="dt-slider-thumb-visual"
        />
        <div
          v-for="(val, i) in internalValues"
          :key="`thumb-hit-${i}`"
          class="d-slider__thumb-hit"
          :style="{ ...thumbPositionStyle(val), touchAction: isVertical ? 'pan-x' : 'pan-y' }"
          data-qa="dt-slider-thumb-hit"
          @pointerenter="onThumbHitPointerEnter(i)"
          @pointerleave="onThumbHitPointerLeave(i)"
        />
        <!-- A plain `ref="thumbRefs"` only pushes in patch order (the same
             index-misalignment risk UseSliderCollisionAvoidance documents for
             markElRefs), but onPointerDown/updateThumbValue index into this
             directly — a function ref assigns by the v-for's own index, and
             self-cleans on unmount when range shrinks to single mode.
             Keep :value after :min/:max/:step: Vue patches them in template
             order, and the browser clamps a value set against stale bounds. -->
        <input
          v-for="(val, i) in internalValues"
          :key="`thumb-input-${i}`"
          :ref="(el) => { thumbRefs[i] = el; }"
          type="range"
          class="d-slider__thumb"
          :min="thumbNativeMin(i)"
          :max="thumbNativeMax(i)"
          :step="thumbNativeStep(i)"
          :value="val"
          :disabled="disabled"
          :name="name || undefined"
          :aria-labelledby="resolvedAriaLabelledby"
          :aria-label="resolvedAriaLabel"
          :aria-describedby="attrs['aria-describedby']"
          :aria-errormessage="attrs['aria-errormessage']"
          :aria-details="attrs['aria-details']"
          :aria-invalid="attrs['aria-invalid']"
          :aria-valuetext="formatValue(val, i)"
          :aria-orientation="isVertical ? 'vertical' : undefined"
          data-qa="dt-slider-thumb"
          @input="onThumbInput(i, $event)"
          @keydown="onThumbKeydown(i, $event)"
          @focus="onThumbFocus(i, $event)"
          @blur="onThumbBlur(i, $event)"
        >
        <div
          v-for="(mark, i) in computedMarks"
          :key="`mark-${i}`"
          ref="markElRefs"
          :class="['d-slider__mark', { 'd-slider__mark--collision-hidden': markCollisionHidden[i] }]"
          :style="markStyle(mark.pct, i, mark.edge)"
          :data-mark-index="i"
          data-qa="dt-slider-mark"
        >
          {{ mark.text }}
        </div>
        <!-- Plain, CSS-positioned text — deliberately not a floating tooltip/portal.
             It sits in the same row as marks, positioned by the same value-to-percent
             math, so it never needs JS measurement or a reposition loop that could
             desync from the thumb. -->
        <template v-if="readout === 'always'">
          <div
            v-for="(val, i) in internalValues"
            :key="`readout-${i}`"
            ref="readoutElRefs"
            :class="[
              'd-slider__readout',
              !readoutMerged ? 'd-slider__readout--show' : 'd-slider__readout--hide',
            ]"
            :style="markStyle(thumbPercent(val))"
            :data-readout-index="i"
            aria-hidden="true"
            data-qa="dt-slider-thumb-readout"
          >
            {{ formatValue(val, i) }}
          </div>
          <!-- Range mode only: when the two individual readouts above would overlap,
               they're hidden (still measurable — visibility:hidden) and this single
               merged pill takes over, centered between the thumbs. -->
          <div
            v-if="readoutMerged"
            ref="mergedReadoutElRef"
            class="d-slider__readout d-slider__readout--show"
            :style="markStyle(mergedReadoutPct)"
            aria-hidden="true"
            data-qa="dt-slider-thumb-readout-merged"
          >
            {{ mergedReadoutText }}
          </div>
        </template>
        <!-- Keep DOM parentage for inherited themes; native popovers paint
             outside every ancestor's overflow, clip path, and mask. -->
        <template v-if="readout === 'tooltip'">
          <div
            v-for="(val, i) in internalValues"
            :key="`readout-tooltip-${i}`"
            :ref="(el) => { tooltipElRefs[i] = el; }"
            class="d-tooltip d-slider__readout-tooltip"
            popover="manual"
            inert
            aria-hidden="true"
            data-qa="dt-slider-thumb-readout-tooltip"
          >
            <span class="d-slider__tooltip-content">{{ formatValue(val, i) }}</span>
          </div>
        </template>
      </div>
      <div
        v-if="hasSlotContent($slots.end)"
        :class="['d-slider__end', endClass]"
        data-qa="dt-slider-end"
      >
        <!-- @slot Optional content at the inline-end end of the track (aka right).
             When using icon-only content, add aria-label or hidden text to the icon. -->
        <slot name="end" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, Comment, useSlots, useAttrs } from 'vue';
import { DtText, TEXT_SIZE_MODIFIERS, TEXT_STRENGTH_MODIFIERS } from '@/components/Text';
import { getUniqueString, hasSlotContent, removeClassStyleAttrs } from '@/common/utils';
import {
  SLIDER_ORIENTATIONS,
  SLIDER_READOUT_MODES,
  SLIDER_DEFAULT_LARGE_STEP,
  SLIDER_FILL_ORIGINS,
} from './SliderConstants';
import { useSliderDevWarnings } from './Composables/UseSliderDevWarnings';
import { useSliderDirection } from './Composables/UseSliderDirection';
import { useSliderValue } from './Composables/UseSliderValue';
import { useSliderMagneticSnap } from './Composables/UseSliderMagneticSnap';
import { useSliderInteraction } from './Composables/UseSliderInteraction';
import { useSliderGeometry } from './Composables/UseSliderGeometry';
import { useSliderMarksAndTicks } from './Composables/UseSliderMarksAndTicks';
import { useSliderCollisionAvoidance } from './Composables/UseSliderCollisionAvoidance';
import { useSliderTooltipReadout } from './Composables/UseSliderTooltipReadout';

defineOptions({ name: 'DtSlider', inheritAttrs: false });

const props = defineProps({
  /**
   * The current value: a number for a single thumb or an array of two numbers
   * for a range. Defaults to the midpoint of [min, max] when omitted or null.
   */
  modelValue: {
    type: [Number, Array],
    default: undefined,
    validator: (value) => !Array.isArray(value) || value.length === 2,
  },

  /**
   * The minimum allowed value.
   */
  min: {
    type: Number,
    default: 0,
  },

  /**
   * The maximum allowed value.
   */
  max: {
    type: Number,
    default: 100,
  },

  /**
   * The increment/decrement step.
   */
  step: {
    type: Number,
    default: 1,
  },

  /**
   * Attracts a dragged thumb to nearby values without restricting selection.
   * Pass a number for an evenly spaced interval or an array of specific values.
   * Applies only to pointer dragging; keyboard changes follow step and largeStep.
   */
  snapPoints: {
    type: [Number, Array],
    default: undefined,
  },

  /**
   * Disables the slider, preventing interaction.
   * @values true, false
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * Track orientation.
   * @values horizontal, vertical
   */
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (v) => SLIDER_ORIENTATIONS.includes(v),
  },

  /**
   * Fills from the minimum ("start"), maximum ("end"), or a numeric origin
   * toward the thumb. A numeric origin is clamped to [min, max].
   * Ignored in range mode, where the fill spans the two thumbs.
   */
  fillOrigin: {
    type: [Number, String],
    default: 'start',
    validator: (v) => typeof v === 'number' || SLIDER_FILL_ORIGINS.includes(v),
  },

  /**
   * Renders tick marks along the track. Pass true to put a tick at every step;
   * pass a Number instead to space ticks at that interval (same units as step).
   */
  showTicks: {
    type: [Boolean, Number],
    default: false,
  },

  /**
   * Minimum separation between range values, measured in steps.
   * The value gap is minGapSteps * step.
   */
  minGapSteps: {
    type: Number,
    default: 0,
  },

  /**
   * Visible label text. Required for accessibility; if omitted, provide aria-label on the component.
   */
  label: {
    type: String,
    default: '',
  },

  /**
   * Hides the visible label when false, retaining the label prop as the accessible name.
   * A hidden custom label slot requires an explicit aria-label or aria-labelledby.
   * @values true, false
   */
  showLabel: {
    type: Boolean,
    default: true,
  },

  /**
   * Overrides the label text size.
   * @values 100, 200, 300, 400
   */
  labelSize: {
    type: [String, Number],
    default: null,
    validator: (s) => TEXT_SIZE_MODIFIERS.label.includes(String(s)),
  },

  /**
   * Overrides the label font weight.
   * @values bold, semibold, medium, normal
   */
  labelStrength: {
    type: String,
    default: null,
    validator: (s) => Object.keys(TEXT_STRENGTH_MODIFIERS).includes(s),
  },

  /**
   * Formats readout and screen reader values. Signature: (value: number, index?: number) => string.
   * In range mode, index 0 identifies the lower value and index 1 the upper value.
   * Return a localized string synchronously. Overrides prefix/suffix for these values;
   * does not format marks.
   */
  getValueText: {
    type: Function,
    default: null,
  },

  /**
   * Text prepended to numeric marks and default readout values, e.g. "$" for currency.
   * getValueText overrides it for readout and screen reader values.
   */
  prefix: {
    type: String,
    default: '',
  },

  /**
   * Text appended to numeric marks and default readout values, e.g. "%" for percentages.
   * getValueText overrides it for readout and screen reader values.
   */
  suffix: {
    type: String,
    default: '',
  },

  /**
   * Native name attribute for form submission. In range mode, both inputs share this name.
   * Retrieve both values with FormData.getAll(name).
   */
  name: {
    type: String,
    default: '',
  },

  /**
   * Value change for Page Up/Page Down or Shift + Arrow.
   * Rounded to a whole number of steps, with a minimum of one step.
   */
  largeStep: {
    type: Number,
    default: SLIDER_DEFAULT_LARGE_STEP,
  },

  /**
   * Additional class(es) applied to the label wrapper element.
   */
  labelClass: {
    type: [String, Array, Object],
    default: '',
  },

  /**
   * Additional class(es) applied to the inline-start slot wrapper (aka left).
   */
  startClass: {
    type: [String, Array, Object],
    default: '',
  },

  /**
   * Additional class(es) applied to the inline-end slot wrapper (aka right).
   */
  endClass: {
    type: [String, Array, Object],
    default: '',
  },

  /**
   * Shows the current value on hover, drag, or focus (tooltip), below the track
   * at all times (always), or hides it (never). Tooltip requires browser Popover support;
   * use always when a visible readout is needed in unsupported browsers.
   * Values are formatted by getValueText, or prefix/suffix when no formatter is provided.
   * @values tooltip, always, never
   */
  readout: {
    type: String,
    default: 'tooltip',
    validator: (v) => SLIDER_READOUT_MODES.includes(v),
  },

  /**
   * Labels positions below the track, independently of ticks. Pass true for min/max labels,
   * or an array of numbers and/or { value, text } objects for specific positions.
   * Numeric labels use prefix/suffix; explicit text overrides that formatting.
   * getValueText does not format marks. Keep labels short to avoid overlap.
   */
  showMarks: {
    type: [Array, Boolean],
    default: false,
  },
});

const emit = defineEmits([
  /**
   * Emitted on every value change (drag, keyboard, track click).
   * @event update:modelValue
   * @type {number | number[]}
   */
  'update:modelValue',

  /**
   * Emitted when a value change commits, on pointer release, blur, or a value
   * correction after constraints change. Use this for API calls or persistence.
   * @event change
   * @type {number | number[]}
   */
  'change',

  /**
   * Native focus event on a thumb.
   * @event focus
   * @type {FocusEvent}
   */
  'focus',

  /**
   * Native blur event on a thumb.
   * @event blur
   * @type {FocusEvent}
   */
  'blur',
]);

// ─── Internal state ───────────────────────────────────────────────────────────

const slots = useSlots();
const attrs = useAttrs();
const labelId = `slider-label-${getUniqueString()}`;
const controlRef = ref(null);
const thumbRefs = ref([]);
const thumbVisualRefs = ref([]);

// Prop-derived, not owned by any one composable — every composable that
// needs either receives it as a plain argument below.
const isRange = computed(() => Array.isArray(props.modelValue));
const isVertical = computed(() => props.orientation === 'vertical');

const { isRtl } = useSliderDirection(controlRef);

// Hoisted above useSliderValue (normally wired in right before
// useSliderInteraction below) so useSliderValue's own reactive watchers can
// tell a held magnetic snap apart from a genuinely new external value.
const { activeSnapValue, findMagneticSnapPoint } = useSliderMagneticSnap(props, { controlRef, isVertical });

const {
  internalValues,
  lastCommittedValues,
  currentValue,
  decimalPlaces,
  snapToStep,
  thumbPercent,
  thumbNativeMin,
  thumbNativeMax,
  thumbNativeStep,
  formatValue,
} = useSliderValue(props, emit, { isRange, activeSnapValue });

// Recurses into slot vnodes for actual TEXT, not just "something renders" —
// an icon-only #label (e.g. a bare <dt-icon> with no text of its own) would
// otherwise count as providing an accessible name, silently leaving the
// thumb unnamed with no indication anything's wrong.
function slotHasText(vnodes) {
  return vnodes.some((vnode) => {
    // A text vnode's own `children` is a plain string (handled below), but a
    // slot function (including the recursive default() call below) is only
    // contractually required to return SOME renderable value, not always an
    // array of vnodes — a bare string is valid too.
    if (typeof vnode === 'string') return vnode.trim() !== '';
    if (vnode.type === Comment) return false;
    if (typeof vnode.children === 'string') return vnode.children.trim() !== '';
    if (Array.isArray(vnode.children)) return slotHasText(vnode.children);
    // A child COMPONENT vnode (e.g. <dt-text>{{ label }}</dt-text> in
    // #label — the same pattern this component's own default fallback
    // markup below uses) has `children` as a slots object, not a string or
    // array — recurse into its own default slot to see what it will
    // actually render instead of treating it as textless.
    if (vnode.children && typeof vnode.children.default === 'function') {
      const result = vnode.children.default();
      return slotHasText(Array.isArray(result) ? result : [result]);
    }
    return false;
  });
}

// Whether what ACTUALLY renders for the label has real text — the #label
// slot when a consumer provides one (it fully replaces the prop's own
// fallback markup, so a textless slot, e.g. a bare icon, means no
// accessible name regardless of the unused prop), otherwise the prop
// itself. Independent of showLabel, which only controls visibility. Named
// to match DtCheckbox/DtRadio's own hasLabelContent.
const hasLabelContent = computed(() => {
  if (slots.label) return slotHasText(slots.label({ value: currentValue.value }));
  return !!props.label?.trim();
});

// Each native thumb <input> names itself from the visible label when there
// is one; otherwise it falls back to whatever aria-label/aria-labelledby a
// consumer passed in (or, lacking even that, the label prop's own text when
// it's being used as a hidden accessible name — showLabel false).
const usesVisibleLabelAsName = computed(() => props.showLabel && hasLabelContent.value);
const resolvedAriaLabelledby = computed(() => (
  usesVisibleLabelAsName.value ? labelId : attrs['aria-labelledby']
));
const resolvedAriaLabel = computed(() => {
  if (usesVisibleLabelAsName.value) return undefined;
  return !props.showLabel && props.label ? props.label : attrs['aria-label'];
});

const resolvedLabelSize = computed(() => props.labelSize ?? 300);

// These forward to each native thumb <input> instead — the wrapper <div>
// isn't a form control, so leaving them here would duplicate the name and
// strand the rest where assistive tech querying the input would never see them.
const THUMB_ARIA_KEYS = ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-errormessage', 'aria-details', 'aria-invalid'];
const wrapperAttrs = computed(() => {
  const base = removeClassStyleAttrs(attrs);
  return Object.fromEntries(Object.entries(base).filter(([key]) => !THUMB_ARIA_KEYS.includes(key)));
});

const {
  isDragging,
  activeThumbIndex,
  focusedThumbIndex,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onThumbInput,
  onThumbKeydown,
  onThumbFocus,
  onThumbBlur,
  onThumbHitPointerEnter,
  onThumbHitPointerLeave,
  isReadoutOpen,
} = useSliderInteraction(props, emit, {
  controlRef,
  thumbRefs,
  internalValues,
  isRange,
  isVertical,
  decimalPlaces,
  snapToStep,
  lastCommittedValues,
  findMagneticSnapPoint,
  activeSnapValue,
  isRtl,
});

// ─── Computed visual helpers ──────────────────────────────────────────────────

const { computedTickValues, computedMarks, reservesAnnotationSpace } = useSliderMarksAndTicks(
  props,
  { isVertical, thumbPercent },
);

const {
  markElRefs,
  readoutElRefs,
  mergedReadoutElRef,
  tooltipElRefs,
  markCollisionHidden,
  readoutMerged,
  markEdgeOffsetPx,
  readoutVisibility,
  formattedValues,
  updateCollisions,
} = useSliderCollisionAvoidance(props, {
  controlRef,
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  isRtl,
  isReadoutOpen,
  computedMarks,
  formatValue,
});

const {
  thumbPositionStyle,
  tickPositionStyle,
  markStyle,
  mergedReadoutPct,
  mergedReadoutText,
  indicatorStyle,
} = useSliderGeometry(props, {
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  isRtl,
  markEdgeOffsetPx,
  formatValue,
});

useSliderTooltipReadout(props, {
  thumbVisualRefs,
  tooltipElRefs,
  isVertical,
  isRtl,
  readoutVisibility,
  formattedValues,
  onPosition: updateCollisions,
});

// ─── Dev warnings ─────────────────────────────────────────────────────────────

useSliderDevWarnings(props, { isRange, hasLabelContent, attrs });

// ─── Exposed API ──────────────────────────────────────────────────────────────

function focus() {
  thumbRefs.value[0]?.focus();
}

function blur() {
  // Whichever thumb actually has focus, not always thumb 0 — in range mode
  // the wrong (unfocused) thumb left the real one's deferred keyboard commit
  // (commitIfChanged) never firing. No-op when nothing is focused.
  thumbRefs.value.find((el) => el === document.activeElement)?.blur();
}

defineExpose({ focus, blur });
</script>
