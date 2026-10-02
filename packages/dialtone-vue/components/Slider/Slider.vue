<template>
  <div
    v-bind="wrapperAttrs"
    :class="[
      'd-slider',
      sizeClass,
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
          size="300"
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
        <template v-if="ticks">
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
        <!-- A plain string `ref="thumbRefs"` on a v-for only pushes each
             element in patch order — the same class of ordering risk this
             file's own updateMarkCollisions comment documents ("confirmed
             live") for markElRefs, and onPointerDown/updateThumbValue below
             both index into thumbRefs directly, so a misalignment here would
             focus/write to the wrong native input. A function ref assigns by
             the v-for's own index explicitly instead, and Vue calls it with
             null on unmount, so a shrinking array (range to single mode)
             self-cleans rather than leaving a stale entry. -->
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
          :style="markStyle(mark.pct, i)"
          :data-mark-index="i"
          data-qa="dt-slider-mark"
        >
          {{ mark.text }}
        </div>
        <!-- Plain, CSS-positioned text — deliberately not a floating tooltip/portal.
             It sits in the same row as marks, positioned by the same value-to-percent
             math, so it never needs JS measurement or a reposition loop that could
             desync from the thumb. -->
        <template v-if="readout !== 'never'">
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
import { ref, computed, onMounted, onBeforeUnmount, useSlots, useAttrs } from 'vue';
import { DtText } from '@/components/Text';
import { getUniqueString, hasSlotContent, removeClassStyleAttrs } from '@/common/utils';
import {
  SLIDER_ORIENTATIONS,
  SLIDER_SIZE_MODIFIERS,
  SLIDER_READOUT_MODES,
  SLIDER_DEFAULT_LARGE_STEP,
  SLIDER_FILL_ORIGINS,
} from './SliderConstants';
import { useSliderDevWarnings } from './Composables/UseSliderDevWarnings';
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
   * When omitted (or explicitly undefined/null), resolves to min — see normalizeModelValue.
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
   * @values true, false
   */
  ticks: {
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
   * Size of the slider (thumb and track scale).
   * @values 200, 300, 400
   */
  size: {
    type: [String, Number],
    default: 300,
    validator: (v) => Object.keys(SLIDER_SIZE_MODIFIERS).includes(String(v)),
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
   * A function returning the user-facing text for a value — shared by the readout and
   * each thumb's aria-valuetext, so the two always agree on how a number is displayed.
   * Signature: (value: number, index?: number) => string. index is the thumb index (use
   * it to differentiate thumbs in range mode, e.g. "Minimum: 20" / "Maximum: 70").
   * Deliberately NOT used for a mark's own auto-generated text — a mark isn't tied to
   * either thumb, so there's no index this function could meaningfully receive; marks use
   * prefix/suffix instead (see the marks prop), or their own explicit text override.
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
   * the track's own edges (see marks).
   */
  prefix: {
    type: String,
    default: '',
  },

  /**
   * Text appended to the raw number wherever it's displayed — e.g. suffix="%" for a
   * percentage. Always applied to marks. Ignored by the readout and aria-valuetext when
   * getValueText is set (see getValueText). Same edge-legibility caveat as prefix
   * applies (see marks).
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
   * Controls the live value readout shown alongside the track for each thumb: always
   * visible, never shown, or shown only while hovering, dragging, or focusing that thumb.
   * Text is formatted via getValueText when set, otherwise prefix/suffix — same as each
   * thumb's aria-valuetext, but unlike a mark's own auto-generated text (see marks).
   * @values always, never, interaction
   */
  readout: {
    type: String,
    default: 'always',
    validator: (v) => SLIDER_READOUT_MODES.includes(v),
  },

  /**
   * Text annotations rendered below the track at specific positions, independent of ticks.
   * Defaults to min and max (start and end). Pass true to mark every tick position
   * automatically (uses the ticks interval or step to determine positions) instead. Pass an
   * array for explicit control: each entry is either a plain number (text defaults to the
   * number itself, formatted with prefix/suffix — NOT getValueText, which has no
   * meaningful index for a position that isn't tied to either thumb) or an object with a
   * required value and optional text override, which is used as-is regardless of
   * prefix/suffix/getValueText. Pass false to render no marks at all.
   * Example: [{ value: 0, text: 'Neutral' }, -100, 100]
   *
   * Keep mark text (via a short prefix/suffix, or an explicit text override) reasonably
   * short — the first/last mark is nudged inward once it would otherwise render past the
   * track's own edges, but very long text can still end up close to the live readout or
   * an adjacent mark.
   */
  marks: {
    type: [Array, Boolean],
    default: undefined,
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

const {
  isRange,
  isVertical,
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
  correctInitialModelValue,
} = useSliderValue(props, emit);

// Whether each thumb gets its accessible name from a visible label (prop or
// slot) rather than a bare aria-label — determines which of the two the
// native input actually binds. hasSlotContent (not a bare slots.label
// existence check) so a #label slot that renders nothing — an empty or
// v-if-false template — doesn't count as providing a name.
const hasVisibleLabel = computed(() => !!(
  props.label?.trim() || hasSlotContent(slots.label, { value: currentValue.value })
));
const sizeClass = computed(() => SLIDER_SIZE_MODIFIERS[String(props.size)] ?? '');

// These form-control ARIA relationship attributes are explicitly forwarded
// to each native thumb input instead (see the template's thumb <input>
// bindings) — a generic wrapper <div> isn't a form control, so leaving them
// here as well would duplicate aria-label/aria-labelledby on an element
// that shouldn't be named, and would strand aria-describedby/
// aria-errormessage/aria-details/aria-invalid somewhere neither the native
// input nor assistive tech querying it would ever see them.
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
  isRtl,
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
  mountInteraction,
  unmountInteraction,
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
});

// ─── Computed visual helpers ──────────────────────────────────────────────────

const {
  positionStyle,
  centerInlineTransform,
  thumbPositionStyle,
  tickPositionStyle,
  indicatorStyle,
} = useSliderGeometry(props, { isVertical, isRange, internalValues, thumbPercent, isRtl });

const { computedTickValues, computedMarks, reservesAnnotationSpace } = useSliderMarksAndTicks(
  props,
  { isVertical, thumbPercent },
);

const markElRefs = ref([]);
const readoutElRefs = ref([]);
const mergedReadoutElRef = ref(null);

const {
  markStyle,
  markCollisionHidden,
  readoutMerged,
  mergedReadoutPct,
  mergedReadoutText,
  mountCollisionAvoidance,
  unmountCollisionAvoidance,
} = useSliderCollisionAvoidance(props, {
  controlRef,
  markElRefs,
  readoutElRefs,
  mergedReadoutElRef,
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  formatValue,
  isRtl,
  isReadoutOpen,
  computedMarks,
  positionStyle,
  centerInlineTransform,
});

onMounted(() => {
  mountCollisionAvoidance();
  mountInteraction();
  correctInitialModelValue();
});

onBeforeUnmount(() => {
  unmountCollisionAvoidance();
  unmountInteraction();
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
