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
      :id="labelId"
      :class="['d-slider__label', { 'sr-only': !showLabel }, labelClass]"
      data-qa="dt-slider-label"
    >
      <!-- @slot Slot for the label, defaults to the label prop. Scoped with
           :value (Number, or Number[] in range mode) — the live value(s),
           updating as the thumb is dragged — for labels that echo the
           current value. Required for accessibility; set showLabel to false to
           hide it visually. -->
      <slot
        name="label"
        :value="currentValue"
      >
        <dt-text
          v-if="label"
          kind="label"
          :size="resolvedLabelSize"
          :strength="labelStrength"
          :tone="disabled ? 'disabled' : 'primary'"
        >
          {{ label }}
        </dt-text>
      </slot>
    </div>
    <div
      :class="['d-slider__body', { 'd-slider__body--reserve-annotation-space': reservesAnnotationSpace }]"
    >
      <div
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
             self-cleans on unmount when range shrinks to single mode. -->
        <input
          v-for="(val, i) in internalValues"
          :key="`thumb-input-${i}`"
          :ref="(el) => { thumbRefs[i] = el; }"
          type="range"
          class="d-slider__thumb"
          :value="val"
          :min="thumbNativeMin(i)"
          :max="thumbNativeMax(i)"
          :step="thumbNativeStep(i)"
          :disabled="disabled"
          :name="name || undefined"
          :aria-labelledby="hasVisibleLabel ? labelId : attrs['aria-labelledby']"
          :aria-label="hasVisibleLabel || attrs['aria-labelledby'] ? undefined : attrs['aria-label']"
          :aria-describedby="attrs['aria-describedby']"
          :aria-errormessage="attrs['aria-errormessage']"
          :aria-details="attrs['aria-details']"
          :aria-invalid="attrs['aria-invalid']"
          :aria-valuetext="formatValue(val, i)"
          :aria-orientation="isVertical ? 'vertical' : undefined"
          :style="thumbPositionStyle(val)"
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
        <template v-if="readout === 'always' || readout === 'interaction'">
          <div
            v-for="(val, i) in internalValues"
            :key="`readout-${i}`"
            ref="readoutElRefs"
            :class="[
              'd-slider__readout',
              (isReadoutOpen(i) && !readoutMerged) ? 'd-slider__readout--show' : 'd-slider__readout--hide',
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
        <!-- Tooltip-styled readout (default): borrows DtTooltip's CSS without
             the component; positioned like marks, no measurement loop. -->
        <template v-if="readout === 'tooltip'">
          <div
            v-for="(val, i) in internalValues"
            :key="`readout-tooltip-${i}`"
            :ref="(el) => { tooltipElRefs[i] = el; }"
            :class="[
              'd-tooltip',
              'd-slider__readout-tooltip',
              tooltipReadoutArrowClass,
              isReadoutOpen(i) ? 'd-tooltip--show' : 'd-tooltip--hide',
            ]"
            :style="tooltipReadoutStyle(val, i)"
            aria-hidden="true"
            data-qa="dt-slider-thumb-readout-tooltip"
          >
            {{ formatValue(val, i) }}
          </div>
        </template>
      </div>
      <div
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
import { getUniqueString, removeClassStyleAttrs } from '@/common/utils';
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

defineOptions({ name: 'DtSlider', inheritAttrs: false });

const props = defineProps({
  /**
   * The current value. A number enables single-thumb mode; an array enables range mode.
   * When omitted (or explicitly undefined/null), resolves to the midpoint of
   * [min, max] — matching native <input type="range"> — see normalizeModelValue.
   * @values Number, [Number, Number]
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
   * Magnetic snap points the thumb pulls toward while dragging — unlike
   * step, this doesn't restrict which values are selectable; a value just
   * outside the snap radius of a snap point stays freely reachable. Pass a
   * number for an evenly spaced interval (e.g. 25), or an array for
   * arbitrary values (e.g. [10, 42, 90]). Pointer drag only — keyboard
   * stepping (step/largeStep) is unaffected.
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
   * Which end the indicator fills from, toward the thumb: start (the default,
   * aka left) fills from the min end, end (aka right) fills from the max end.
   * Pass a Number instead to fill outward from that value toward the thumb —
   * useful for balance controls (aka center-fill) or deviation-from-setpoint
   * displays. A numeric origin is clamped to [min, max]. Ignored in range mode.
   * @values start, end
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
   * Minimum gap, in steps (not raw values), that must remain between the two
   * thumbs in range mode: the actual minimum gap enforced between their
   * values is minGapSteps * step, so the same prop value means a different
   * real gap depending on step (e.g. minGapSteps={5} enforces a gap of 5 with
   * step={1}, but 50 with step={10}).
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
   * When false, the label is hidden visually but remains in the DOM for screen readers.
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
   * A function returning the user-facing text for a value — shared by the readout and
   * each thumb's aria-valuetext, so the two always agree on how a number is displayed.
   * Signature: (value: number, index?: number) => string. index is the thumb index (use
   * it to differentiate thumbs in range mode, e.g. "Minimum: 20" / "Maximum: 70").
   * Deliberately NOT used for a mark's own auto-generated text — a mark isn't tied to
   * either thumb, so there's no index this function could meaningfully receive; marks use
   * prefix/suffix instead (see the showMarks prop), or their own explicit text override.
   * Takes precedence over prefix/suffix for the readout and aria-valuetext when set. The
   * default (null) uses the raw number (optionally wrapped in prefix/suffix), which must
   * be i18n-safe for your context.
   */
  getValueText: {
    type: Function,
    default: null,
  },

  /**
   * Text prepended to the raw number wherever it's displayed — e.g. prefix="$" for
   * currency. Always applied to marks. Ignored by the readout and aria-valuetext when
   * getValueText is set (see getValueText). A long prefix makes every mark's text
   * longer too — keep it short enough that the first/last mark stays legible near
   * the track's own edges (see showMarks).
   */
  prefix: {
    type: String,
    default: '',
  },

  /**
   * Text appended to the raw number wherever it's displayed — e.g. suffix="%" for a
   * percentage. Always applied to marks. Ignored by the readout and aria-valuetext when
   * getValueText is set (see getValueText). Same edge-legibility caveat as prefix
   * applies (see showMarks).
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
   * Roughly how far to move on Page Up/Page Down or Shift + Arrow, in the
   * same units as step — rounded to the nearest whole number of steps (at
   * least one), so the result always lands on the step grid and always
   * moves, even when step is coarser than largeStep itself.
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
   * Controls the live value readout for each thumb: a tooltip-styled bubble above the
   * thumb shown only while hovering, dragging, or focusing it (the default); always
   * visible below the track; never shown; or shown below the track only while
   * hovering, dragging, or focusing that thumb. Text is formatted via getValueText
   * when set, otherwise prefix/suffix — same as each thumb's aria-valuetext, but
   * unlike a mark's own auto-generated text (see showMarks). Only the tooltip
   * readout is edge-clamped near min/max (see UseSliderGeometry's
   * tooltipReadoutStyle) — the always/interaction readout and the merged
   * two-thumb pill are not, so a long getValueText/suffix string can render
   * close to or past the track's own edge at those values.
   * @values tooltip, always, never, interaction
   */
  readout: {
    type: String,
    default: 'tooltip',
    validator: (v) => SLIDER_READOUT_MODES.includes(v),
  },

  /**
   * Text annotations rendered below the track at specific positions, independent of ticks.
   * Off by default — rendering min/max isn't always wanted. Pass true to label min and max
   * (start and end) only. Pass an array for explicit control: each entry is either a plain
   * number (text defaults to the number itself, formatted with prefix/suffix — NOT
   * getValueText, which has no meaningful index for a position that isn't tied to either
   * thumb) or an object with a required value and optional text override, which is used
   * as-is regardless of prefix/suffix/getValueText.
   * Example: [{ value: 0, text: 'Neutral' }, -100, 100]
   *
   * Keep mark text (via a short prefix/suffix, or an explicit text override) reasonably
   * short — a mark landing exactly on min or max is edge-aligned rather than centered, and
   * any other mark is nudged inward once it would otherwise render past the track's own
   * edges, but very long text can still end up close to the live readout or an adjacent mark.
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
   * Emitted on commit only when the value has changed (pointer up, blur).
   * Use this for API calls or persistence.
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

// Prop-derived, not owned by any one composable — every composable that
// needs either receives it as a plain argument below.
const isRange = computed(() => Array.isArray(props.modelValue));
const isVertical = computed(() => props.orientation === 'vertical');

const { isRtl } = useSliderDirection(controlRef);

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
} = useSliderValue(props, emit, { isRange });

// Recurses into slot vnodes for actual TEXT, not just "something renders" —
// an icon-only #label (e.g. a bare <dt-icon> with no text of its own) would
// otherwise count as providing an accessible name, silently leaving the
// thumb unnamed with no indication anything's wrong.
function slotHasText(vnodes) {
  return vnodes.some((vnode) => {
    if (vnode.type === Comment) return false;
    if (typeof vnode.children === 'string') return vnode.children.trim() !== '';
    if (Array.isArray(vnode.children)) return slotHasText(vnode.children);
    return false;
  });
}

// Determines which accessible-name source each thumb's native input binds.
const hasVisibleLabel = computed(() => !!(
  props.label?.trim() || (slots.label && slotHasText(slots.label({ value: currentValue.value })))
));

const resolvedLabelSize = computed(() => props.labelSize ?? 300);

// These forward to each native thumb <input> instead — the wrapper <div>
// isn't a form control, so leaving them here would duplicate the name and
// strand the rest where assistive tech querying the input would never see them.
const THUMB_ARIA_KEYS = ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-errormessage', 'aria-details', 'aria-invalid'];
const wrapperAttrs = computed(() => {
  const base = removeClassStyleAttrs(attrs);
  return Object.fromEntries(Object.entries(base).filter(([key]) => !THUMB_ARIA_KEYS.includes(key)));
});

const { activeSnapValue, findMagneticSnapPoint } = useSliderMagneticSnap(props, { controlRef, isVertical });

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
  controlRect,
  tooltipWidthPx,
} = useSliderCollisionAvoidance(props, {
  controlRef,
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  isRtl,
  isReadoutOpen,
  computedMarks,
});

const {
  thumbPositionStyle,
  tickPositionStyle,
  markStyle,
  tooltipReadoutArrowClass,
  tooltipReadoutStyle,
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
  controlRect,
  tooltipWidthPx,
  formatValue,
});

// ─── Dev warnings ─────────────────────────────────────────────────────────────

useSliderDevWarnings(props, { isRange, hasVisibleLabel, attrs });

// ─── Exposed API ──────────────────────────────────────────────────────────────

function focus() {
  thumbRefs.value[0]?.focus();
}

function blur() {
  thumbRefs.value[0]?.blur();
}

defineExpose({ focus, blur });
</script>
