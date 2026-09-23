<template>
  <div
    v-bind="removeClassStyleAttrs($attrs)"
    :class="[
      'd-slider',
      sizeClass,
      $attrs.class,
      {
        'd-slider--disabled': disabled,
        'd-slider--vertical': isVertical,
        'd-slider--inverted': inverted,
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
      :class="['d-slider__label', { 'sr-only': labelHidden }, labelClass]"
      data-qa="dt-slider-label"
    >
      <!-- @slot Slot for the label, defaults to the label prop. Scoped with
           :value (Number, or Number[] in range mode) — the live value(s),
           updating as the thumb is dragged — for labels that echo the
           current value. Required for accessibility; use labelHidden to
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
    <div class="d-slider__body">
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
        <input
          v-for="(val, i) in internalValues"
          :key="`thumb-input-${i}`"
          ref="thumbRefs"
          type="range"
          class="d-slider__thumb"
          :value="val"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :name="name || undefined"
          :aria-labelledby="(label || $slots.label) ? labelId : undefined"
          :aria-label="(!label && !$slots.label) ? $attrs['aria-label'] : undefined"
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
          :style="markStyle(mark.pct)"
          :data-mark-index="i"
          data-qa="dt-slider-mark"
        >
          {{ mark.text }}
        </div>
        <!-- Plain, CSS-positioned text — deliberately not a floating tooltip/portal.
             It sits in the same row as marks, positioned by the same value-to-percent
             math, so it never needs JS measurement or a reposition loop that could
             desync from the thumb (see DLT-1974 investigation notes). -->
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

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { DtText } from '@/components/Text';
import { getUniqueString, removeClassStyleAttrs } from '@/common/utils';
import {
  SLIDER_ORIENTATIONS,
  SLIDER_SIZE_MODIFIERS,
  SLIDER_READOUT_MODES,
  SLIDER_DEFAULT_LARGE_STEP,
} from './SliderConstants';

defineOptions({ name: 'DtSlider', inheritAttrs: false });

const props = defineProps({
  /**
   * The current value. A number enables single-thumb mode; an array enables range mode.
   */
  modelValue: {
    type: [Number, Array],
    default: undefined,
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
   * outside snapThreshold of a snap point stays freely reachable. Pass a
   * number for an evenly spaced interval (e.g. 25), or an array for
   * arbitrary values (e.g. [10, 42, 90]). Pointer drag only — keyboard
   * stepping (step/largeStep) is unaffected.
   */
  snapPoints: {
    type: [Number, Array],
    default: undefined,
  },

  /**
   * Pixel radius around a snap point where the magnetic pull engages. Once
   * engaged, releasing takes a larger drag than entering did (see
   * SNAP_RELEASE_MULTIPLIER) — a "sticky" feel like Figma/Photoshop
   * guide-snapping, rather than a hard cutoff at the same radius.
   */
  snapThreshold: {
    type: Number,
    default: 10,
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
   * When true, the indicator fills from the max end toward the thumb instead of from min.
   * Ignored when fillOrigin is set.
   * @values true, false
   */
  inverted: {
    type: Boolean,
    default: false,
  },

  /**
   * When set, the indicator fills outward from this value toward the thumb
   * rather than from the min (or max when inverted). Useful for balance
   * controls (aka center-fill) or deviation-from-setpoint displays.
   * Ignored in range mode. Clamped to [min, max].
   */
  fillOrigin: {
    type: Number,
    default: null,
  },

  /**
   * When true, renders a tick mark at every tickInterval along the track.
   * @values true, false
   */
  showTicks: {
    type: Boolean,
    default: false,
  },

  /**
   * Distance between tick marks, in the same units as step.
   * When null, defaults to the step value.
   */
  tickInterval: {
    type: Number,
    default: null,
  },

  /**
   * Minimum number of steps that must remain between thumbs in range mode.
   */
  minStepsBetweenValues: {
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
   * When true, the label is hidden visually but remains in the DOM for screen readers.
   * @values true, false
   */
  labelHidden: {
    type: Boolean,
    default: false,
  },

  /**
   * A function returning the user-facing text for a value — shared by the readout, marks,
   * and each thumb's aria-valuetext, so all three always agree on how a number is displayed.
   * Signature: (value: number, index?: number) => string. index is the thumb index for a
   * thumb's own value (use it to differentiate thumbs in range mode, e.g. "Minimum: 20"),
   * and is omitted when formatting a mark, since marks aren't tied to a specific thumb.
   * Takes precedence over prefix/suffix when set. The default (null) uses the raw number
   * (optionally wrapped in prefix/suffix), which must be i18n-safe for your context.
   */
  getValueText: {
    type: Function,
    default: null,
  },

  /**
   * Text prepended to the raw number wherever it's displayed (readout, marks, aria-valuetext)
   * — e.g. prefix="$" for currency. Ignored when getValueText is set.
   */
  prefix: {
    type: String,
    default: '',
  },

  /**
   * Text appended to the raw number wherever it's displayed (readout, marks, aria-valuetext)
   * — e.g. suffix="%" for a percentage. Ignored when getValueText is set.
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
   * Number of steps to move on Page Up/Page Down or Shift + Arrow.
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
   * Text is formatted the same way as marks — via getValueText, or prefix/suffix.
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
   * automatically (uses tickInterval or step to determine positions) instead. Pass an
   * array for explicit control: each entry is either a plain number (text defaults to the
   * number itself) or an object with a required value and optional text override.
   * Pass false to render no marks at all. Example: [{ value: 0, text: 'Neutral' }, -100, 100]
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

const labelId = `slider-label-${getUniqueString()}`;
const controlRef = ref(null);
const thumbRefs = ref([]);
const isDragging = ref(false);
const activeThumbIndex = ref(null);
// Unlike activeThumbIndex (cleared on pointerup so the --active visual class
// turns off), this persists across drags — it's what lets a pointerdown on
// two coincident thumbs route to whichever one wasn't grabbed last time,
// instead of always defaulting back to the same thumb once they touch.
const lastActiveThumbIndex = ref(null);
const focusedThumbIndex = ref(null);
const hoveredThumbIndex = ref(null);
// Not reactive on purpose: set synchronously right before a pointer-driven
// focus() call and read/cleared synchronously in the 'focus' handler it
// triggers, within the same task. See onPointerDown.
let isPointerFocus = false;

const isRange = computed(() => Array.isArray(props.modelValue));

// The low thumb's value can never exceed the high thumb's — swap rather than
// clamp so an inverted pair (e.g. a consumer-supplied [70, 30]) still keeps
// its intended width instead of collapsing to a single point.
function normalizeRangeValues(values) {
  if (values.length === 2 && values[0] > values[1]) {
    return [values[1], values[0]];
  }
  return values;
}

const internalValues = ref(
  Array.isArray(props.modelValue)
    ? normalizeRangeValues([...props.modelValue])
    : props.modelValue !== undefined
      ? [props.modelValue]
      : [props.min],
);

const lastCommittedValues = ref([...internalValues.value]);

const isVertical = computed(() => props.orientation === 'vertical');
const sizeClass = computed(() => SLIDER_SIZE_MODIFIERS[String(props.size)] ?? '');

// Mirrors the update:modelValue payload shape (Number, or Number[] in range
// mode) so a custom #label slot can render the live value while dragging.
const currentValue = computed(() => (isRange.value ? [...internalValues.value] : internalValues.value[0]));

// ─── Sync controlled modelValue → internalValues ──────────────────────────────

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === undefined || newVal === null) return;
    const isInvertedPair = Array.isArray(newVal) && newVal.length === 2 && newVal[0] > newVal[1];
    const next = Array.isArray(newVal) ? normalizeRangeValues([...newVal]) : [newVal];
    const current = internalValues.value;
    if (next.length !== current.length || next.some((v, i) => v !== current[i])) {
      internalValues.value = next;
    }
    // Correct the parent's own v-model source, not just our local render —
    // otherwise a consumer reading modelValue directly (not just watching
    // our rendered output) sees a stale, still-inverted pair indefinitely.
    // Safe against feedback loops: the corrected pair is never itself
    // inverted, so this re-triggers the watcher at most once.
    if (isInvertedPair) {
      emit('update:modelValue', [...next]);
    }
  },
  { deep: true },
);

// ─── Computed visual helpers ──────────────────────────────────────────────────

function thumbPercent(val) {
  return ((val - props.min) / (props.max - props.min)) * 100;
}

function decimalPlaces(n) {
  const dot = String(n).indexOf('.');
  return dot === -1 ? 0 : String(n).length - dot - 1;
}

function snapToStep(val) {
  const steps = Math.round((val - props.min) / props.step);
  const dp = Math.max(decimalPlaces(props.min), decimalPlaces(props.step));
  return Math.min(props.max, Math.max(props.min, parseFloat((props.min + steps * props.step).toFixed(dp))));
}

// Mirrors computedTickValues' interval generation — a number means "evenly
// spaced", an array is used as-is. [] (snapPoints unset) short-circuits
// findMagneticSnapPoint below, so this is also what keeps the feature a
// pure no-op — same code path, same result — for every consumer that
// doesn't set snapPoints.
const computedSnapPoints = computed(() => {
  if (props.snapPoints == null) return [];
  if (typeof props.snapPoints === 'number') {
    const interval = props.snapPoints;
    if (interval <= 0) return [];
    const values = [];
    for (let v = props.min; v <= props.max; v = parseFloat((v + interval).toFixed(10))) {
      values.push(v);
    }
    return values;
  }
  // A point outside [min, max] can never be a value the thumb is allowed to
  // hold, so it must never be offered as a snap target — otherwise a drag
  // that lands within snapThreshold of it would pull the thumb (and the
  // emitted modelValue) out of the slider's own documented range.
  return props.snapPoints.filter((point) => point >= props.min && point <= props.max);
});

// How much wider the release radius is than the entry radius, in units of
// snapThreshold — lets a snapped thumb resist small jitter near the point
// instead of flickering in and out right at the entry boundary.
const SNAP_RELEASE_MULTIPLIER = 2;

// Tracks, per thumb index, the snap point currently held via hysteresis —
// cleared once a drag moves far enough past SNAP_RELEASE_MULTIPLIER's radius
// to release it, or once the drag ends.
const activeSnapValue = ref({});

// Magnetic, not restrictive: only overrides the value when rawVal falls
// within snapThreshold *pixels* of a snap point (converted to value-space
// via the control's current rendered size, so the pull feels consistent
// regardless of the slider's min/max range) — otherwise returns null and
// normal step-quantization proceeds untouched. A pixel radius, not a value
// radius, is what makes this feel like Figma/Photoshop guide-snapping
// rather than a second, finer step grid. Once a thumb is pulled onto a
// point, releasing it requires crossing a wider radius than entering did
// (SNAP_RELEASE_MULTIPLIER) rather than the same boundary in both
// directions — the "sticky" half of that feel.
function findMagneticSnapPoint(rawVal, thumbIndex) {
  const points = computedSnapPoints.value;
  if (!points.length || !controlRef.value) {
    delete activeSnapValue.value[thumbIndex];
    return null;
  }
  const rect = controlRef.value.getBoundingClientRect();
  const trackSizePx = isVertical.value ? rect.height : rect.width;
  if (!trackSizePx) return null;
  const entryThreshold = (props.snapThreshold / trackSizePx) * (props.max - props.min);

  const heldValue = activeSnapValue.value[thumbIndex];
  if (heldValue != null) {
    const releaseThreshold = entryThreshold * SNAP_RELEASE_MULTIPLIER;
    if (Math.abs(heldValue - rawVal) <= releaseThreshold) {
      return heldValue;
    }
  }

  let closest = null;
  let closestDist = Infinity;
  for (const point of points) {
    const dist = Math.abs(point - rawVal);
    if (dist <= entryThreshold && dist < closestDist) {
      closest = point;
      closestDist = dist;
    }
  }

  if (closest == null) {
    delete activeSnapValue.value[thumbIndex];
  } else {
    activeSnapValue.value[thumbIndex] = closest;
  }
  return closest;
}

function thumbPositionStyle(val) {
  const pct = thumbPercent(val);
  if (isVertical.value) {
    return { bottom: `${pct}%`, transform: 'translate(-50%, 50%)' };
  }
  return { left: `${pct}%`, transform: 'translate(-50%, -50%)' };
}

function tickPositionStyle(val) {
  const pct = thumbPercent(val);
  if (isVertical.value) {
    return { bottom: `${pct}%`, transform: 'translateY(50%)' };
  }
  return { left: `${pct}%`, transform: 'translateX(-50%)' };
}

// Shared by the readout, marks (rendered from a bare number, not an explicit
// text override), and each thumb's aria-valuetext, so all three always agree
// on how a value is displayed. index is omitted for marks — they aren't tied
// to a specific thumb — and getValueText simply ignores an argument it wasn't
// written to use.
function formatValue(value, index) {
  if (props.getValueText) return props.getValueText(value, index);
  return `${props.prefix}${value}${props.suffix}`;
}

const computedMarks = computed(() => {
  let source;
  if (props.marks === undefined) {
    // Default: start and end, unless the consumer opts in to every tick (true),
    // provides their own array, or opts out entirely (false).
    source = [props.min, props.max];
  } else if (props.marks === true) {
    source = computedTickValues.value;
  } else {
    source = props.marks || [];
  }
  return source.map((item) => {
    const value = typeof item === 'number' ? item : item.value;
    const text = typeof item === 'number' ? formatValue(item) : (item.text ?? formatValue(value));
    const pct = (value - props.min) / (props.max - props.min) * 100;
    return { text, pct };
  });
});

function markStyle (pct) {
  if (isVertical.value) {
    return { bottom: `${pct}%` };
  }
  return { left: `${pct}%` };
}

const computedTickValues = computed(() => {
  const interval = props.tickInterval ?? props.step;
  if (!interval || interval <= 0) return [];
  const values = [];
  for (let v = props.min; v <= props.max; v = parseFloat((v + interval).toFixed(10))) {
    values.push(v);
  }
  return values;
});

const indicatorStyle = computed(() => {
  if (isRange.value && internalValues.value.length === 2) {
    const [lo, hi] = internalValues.value;
    const loP = thumbPercent(lo);
    const hiP = thumbPercent(hi);
    if (isVertical.value) {
      return { bottom: `${loP}%`, height: `${hiP - loP}%` };
    }
    return { left: `${loP}%`, width: `${hiP - loP}%` };
  }

  const pct = thumbPercent(internalValues.value[0] ?? props.min);

  if (props.fillOrigin != null) {
    const originPct = thumbPercent(Math.min(props.max, Math.max(props.min, props.fillOrigin)));
    const startPct = Math.min(pct, originPct);
    const sizePct = Math.abs(pct - originPct);
    if (isVertical.value) {
      return { bottom: `${startPct}%`, height: `${sizePct}%` };
    }
    return { left: `${startPct}%`, width: `${sizePct}%` };
  }

  if (isVertical.value) {
    return props.inverted
      ? { top: '0', height: `${100 - pct}%` }
      : { bottom: '0', height: `${pct}%` };
  }
  return props.inverted
    ? { right: '0', width: `${100 - pct}%` }
    : { left: '0', width: `${pct}%` };
});

// ─── Value update ─────────────────────────────────────────────────────────────

function updateThumbValue(thumbIndex, newVal, { allowSnap = false } = {}) {
  let clamped = Math.min(props.max, Math.max(props.min, newVal));
  const magneticValue = allowSnap ? findMagneticSnapPoint(clamped, thumbIndex) : null;
  clamped = magneticValue ?? snapToStep(clamped);

  const next = [...internalValues.value];

  if (isRange.value) {
    // The low thumb can never pass the high thumb (and vice versa) — they
    // may only meet. minStepsBetweenValues, when set, widens this into a
    // larger required gap instead of a bare touch.
    const gap = props.minStepsBetweenValues * props.step;
    if (thumbIndex === 0) {
      clamped = Math.min(clamped, (next[1] ?? props.max) - gap);
    } else {
      clamped = Math.max(clamped, (next[0] ?? props.min) + gap);
    }
    // gap is a product of two decimals (e.g. 3 * 0.1) and can carry IEEE-754
    // noise (0.30000000000000004) that snapToStep's rounding, applied
    // earlier in this function, never sees — round it out the same way
    // before it reaches internalValues/the emitted modelValue.
    const dp = Math.max(decimalPlaces(props.min), decimalPlaces(props.step));
    clamped = parseFloat(clamped.toFixed(dp));
    clamped = Math.min(props.max, Math.max(props.min, clamped));

    // The crossing clamp above can pull the thumb away from the magnetic
    // point findMagneticSnapPoint just latched hysteresis onto — the thumb
    // never actually reached it. Left uncleared, hysteresis keeps comparing
    // future drag positions against that unreachable point and can freeze
    // the thumb at the other thumb's boundary across a wide swath of the
    // release radius. Clearing it lets the next move re-evaluate fresh.
    if (magneticValue != null && clamped !== magneticValue) {
      delete activeSnapValue.value[thumbIndex];
    }
  }

  if (next[thumbIndex] === clamped) return;
  next[thumbIndex] = clamped;
  internalValues.value = next;

  const payload = isRange.value ? [...next] : next[0];
  emit('update:modelValue', payload);
}

function commitIfChanged() {
  const cur = internalValues.value;
  const last = lastCommittedValues.value;
  const changed = cur.length !== last.length || cur.some((v, i) => v !== last[i]);
  if (!changed) return;
  lastCommittedValues.value = [...cur];
  const payload = isRange.value ? [...cur] : cur[0];
  emit('change', payload);
}

// ─── Pointer drag ─────────────────────────────────────────────────────────────

function getValueFromPointerEvent(event) {
  const rect = controlRef.value.getBoundingClientRect();
  let pct;
  if (isVertical.value) {
    pct = 1 - (event.clientY - rect.top) / rect.height;
  } else {
    pct = (event.clientX - rect.left) / rect.width;
  }
  pct = Math.min(1, Math.max(0, pct));
  return props.min + pct * (props.max - props.min);
}

function getNearestThumbIndex(val) {
  if (!isRange.value || internalValues.value.length < 2) return 0;
  const [lo, hi] = internalValues.value;
  if (lo === hi) {
    // When thumbs overlap, route to the one opposite last-active
    return lastActiveThumbIndex.value === 0 ? 1 : 0;
  }
  return Math.abs(val - lo) <= Math.abs(val - hi) ? 0 : 1;
}

function onPointerDown(event) {
  if (props.disabled) return;
  // Only handle primary pointer button
  if (event.pointerType === 'mouse' && event.button !== 0) return;

  // Suppresses the browser's native mousedown default action, which would
  // otherwise shift focus to the nearest scrollable ancestor after our own
  // thumbRefs.focus() call below runs.
  event.preventDefault();

  const rawVal = getValueFromPointerEvent(event);
  const idx = getNearestThumbIndex(rawVal);

  activeThumbIndex.value = idx;
  lastActiveThumbIndex.value = idx;
  isDragging.value = true;
  controlRef.value.setPointerCapture(event.pointerId);

  updateThumbValue(idx, rawVal, { allowSnap: true });
  // Marks the focus() call below as pointer-driven so onThumbFocus can skip
  // the keyboard-focus ring for it — :focus-visible isn't usable here since
  // browsers treat range inputs as always focus-visible on click, unlike
  // buttons/links. focus() dispatches its 'focus' event synchronously, so
  // this flag is read and cleared before any other code runs.
  isPointerFocus = true;
  thumbRefs.value[idx]?.focus();
}

function onPointerMove(event) {
  if (!isDragging.value || activeThumbIndex.value === null) return;

  // A consumer can flip :disabled reactively mid-drag (e.g. async
  // validation) — stop accepting input immediately rather than waiting for
  // the pointer to be released, matching a native disabled control.
  if (props.disabled) {
    onPointerUp();
    return;
  }

  // The primary button can be released outside this document (e.g. over a
  // parent frame, or outside the OS window) without a pointerup ever
  // reaching us, leaving isDragging stuck true. event.buttons reflects the
  // actual current button state, so this self-heals on the next move.
  if (event.buttons === 0) {
    onPointerUp();
    return;
  }

  updateThumbValue(activeThumbIndex.value, getValueFromPointerEvent(event), { allowSnap: true });
}

function onPointerUp() {
  if (!isDragging.value) return;
  isDragging.value = false;
  commitIfChanged();
  activeThumbIndex.value = null;
  activeSnapValue.value = {};
}

// ─── Keyboard events on native inputs ─────────────────────────────────────────

function onThumbInput(i, event) {
  // Fires from native arrow keys / Home / End on the hidden input
  updateThumbValue(i, Number(event.target.value));
}

function onThumbKeydown(i, event) {
  const { key, shiftKey } = event;
  if (key === 'PageUp' || (shiftKey && (key === 'ArrowRight' || key === 'ArrowUp'))) {
    event.preventDefault();
    updateThumbValue(i, internalValues.value[i] + props.largeStep);
  } else if (key === 'PageDown' || (shiftKey && (key === 'ArrowLeft' || key === 'ArrowDown'))) {
    event.preventDefault();
    updateThumbValue(i, internalValues.value[i] - props.largeStep);
  }
  // Plain arrow keys, Home, End handled natively by <input type="range">
}

function onThumbFocus(i, event) {
  // Skip the keyboard-focus ring (and the interaction-mode readout it's tied
  // to via focusedThumbIndex) for a pointer-driven focus — a mouse drag
  // already gets its own affordance via activeThumbIndex while the pointer
  // is down. Tab/keyboard focus falls through and sets it normally.
  if (isPointerFocus) {
    isPointerFocus = false;
  } else {
    focusedThumbIndex.value = i;
  }
  emit('focus', event);
}

function onThumbBlur(i, event) {
  focusedThumbIndex.value = null;
  commitIfChanged();
  emit('blur', event);
}

function onThumbHitPointerEnter(i) {
  hoveredThumbIndex.value = i;
}

function onThumbHitPointerLeave(i) {
  if (hoveredThumbIndex.value === i) hoveredThumbIndex.value = null;
}

function isReadoutOpen(i) {
  if (props.readout === 'always') return true;
  return activeThumbIndex.value === i || focusedThumbIndex.value === i || hoveredThumbIndex.value === i;
}

// ─── Mark / readout collision avoidance ────────────────────────────────────────
// Two kinds of collision, resolved in order: in range mode, the low/high readouts
// can overlap each other as the thumbs converge — merged into a single centered
// "lo–hi" pill. Separately, the live readout can overlap a static mark — marks
// default to start/end and readout defaults to always, so the readout sits right
// on top of an end mark near the extremes. When they collide, hide the mark: the
// readout is the thing actively communicating current state during interaction,
// matching the convention this was
// modeled on (firespotter's own percentage slider hides its static markers, never
// the live value). Pure rect measurement, no continuous polling — recomputed when
// the value or readout visibility changes (both already reactive) and on control
// resize, so there's no open-ended loop that could silently stop working the way
// the old Popper-based tooltip did (see the DLT-1974 investigation notes above).

const markElRefs = ref([]);
const readoutElRefs = ref([]);
const mergedReadoutElRef = ref(null);
const markCollisionHidden = ref([]);
const readoutMerged = ref(false);
const COLLISION_PADDING = 4; // px of breathing room before a mark hides or readouts merge

function rectsOverlap(a, b, padding = 0) {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}

const mergedReadoutPct = computed(() => {
  if (!isRange.value || internalValues.value.length !== 2) return 0;
  const [lo, hi] = internalValues.value;
  return (thumbPercent(lo) + thumbPercent(hi)) / 2;
});

const mergedReadoutText = computed(() => {
  if (!isRange.value || internalValues.value.length !== 2) return '';
  const [lo, hi] = internalValues.value;
  return `${formatValue(lo, 0)}–${formatValue(hi, 1)}`;
});

// Two passes: first decide whether the individual readouts should merge (their
// elements stay in the DOM at all times, only visibility toggles, so their rects
// are always measurable). Then, after Vue renders the merged pill (or removes it),
// measure whichever readout representation is actually shown against the marks.
// The watcher and the ResizeObserver below can both call this, and since it
// awaits across multiple ticks, two calls can overlap: a slower call started
// from stale (pre-update) DOM state can finish — and write its now-outdated
// result — after a newer call already wrote the correct one, clobbering it
// with stale data. collisionUpdateId is a generation counter: each call
// captures the id it started with and bails at its next checkpoint if a newer
// call has since started, so only the freshest measurement ever gets applied.
let collisionUpdateId = 0;

// .d-slider__readout has `transition: left/bottom` (see slider.less) so its
// value-driven position animates — during that ~100ms animation,
// getBoundingClientRect() reports wherever it currently is mid-flight, not
// its final target. data-dragging turns the transition off during a mouse
// drag, but a keyboard nudge or a programmatic value change never sets
// data-dragging, so this genuinely can read a stale, mid-animation position.
// Sidesteps this by computing position analytically from the same reactive
// pct the template itself uses (always instantly correct, no animation to
// wait out) and only pulling size (width/height) from the DOM — unlike
// position, size isn't transitioned, so it's accurate immediately after
// Vue's own render, no extra frame-waiting needed.
function analyticalReadoutRect(pct, el) {
  if (!el || !controlRef.value) return null;
  const elRect = el.getBoundingClientRect();
  const controlRect = controlRef.value.getBoundingClientRect();
  if (isVertical.value) {
    const height = elRect.bottom - elRect.top;
    const centerPx = controlRect.bottom - (pct / 100) * (controlRect.bottom - controlRect.top);
    return { left: elRect.left, right: elRect.right, top: centerPx - height / 2, bottom: centerPx + height / 2 };
  }
  const width = elRect.right - elRect.left;
  const centerPx = controlRect.left + (pct / 100) * (controlRect.right - controlRect.left);
  return { left: centerPx - width / 2, right: centerPx + width / 2, top: elRect.top, bottom: elRect.bottom };
}

// Same rationale as data-mark-index on marks: don't trust readoutElRefs[i]'s
// array position to correspond to internalValues[i] — look the element up by
// its own tagged index instead.
function readoutElByIndex(i) {
  return readoutElRefs.value.find((el) => el && Number(el.dataset.readoutIndex) === i);
}

async function updateCollisions() {
  const thisUpdateId = ++collisionUpdateId;
  await nextTick(); // let Vue's own DOM patch (text/value/style) land before measuring
  if (thisUpdateId !== collisionUpdateId) return;

  const wasMerged = readoutMerged.value;
  if (isRange.value && internalValues.value.length === 2 && isReadoutOpen(0) && isReadoutOpen(1)) {
    const [lo, hi] = internalValues.value;
    const rectA = analyticalReadoutRect(thumbPercent(lo), readoutElByIndex(0));
    const rectB = analyticalReadoutRect(thumbPercent(hi), readoutElByIndex(1));
    readoutMerged.value = !!(rectA && rectB && rectsOverlap(rectA, rectB, COLLISION_PADDING));
  } else {
    readoutMerged.value = false;
  }

  // Only worth another wait when the merge state actually flipped this cycle
  // — that's the only time the merged pill is about to mount/unmount, so
  // it's the only time it'd otherwise be measured (for the marks check
  // below) before existing in the DOM at all.
  if (readoutMerged.value !== wasMerged) {
    await nextTick();
    if (thisUpdateId !== collisionUpdateId) return;
  }

  updateMarkCollisions();
}

function collectReadoutRects() {
  if (readoutMerged.value) {
    const rect = analyticalReadoutRect(mergedReadoutPct.value, mergedReadoutElRef.value);
    return rect ? [rect] : [];
  }
  return internalValues.value
    .map((val, i) => (isReadoutOpen(i) ? analyticalReadoutRect(thumbPercent(val), readoutElByIndex(i)) : null))
    .filter(Boolean);
}

// Key the result by each mark's own data-mark-index rather than by its
// position in markElRefs.value — that array (populated via ref="markElRefs"
// on the marks v-for) isn't reliably index-aligned across renders with
// computedMarks/markCollisionHidden[i], which the template assumes when it
// reads markCollisionHidden[i] for the same i as its v-for. Confirmed live:
// markElRefs.value[0]/[1] can end up holding the "100"/"0" mark elements in
// the opposite order from computedMarks, silently applying one mark's
// collision result to the other mark's rendered element.
function updateMarkCollisions() {
  const marks = markElRefs.value;
  if (!marks.length) return;
  const readoutRects = collectReadoutRects();
  const result = computedMarks.value.map(() => false);
  if (readoutRects.length) {
    marks.forEach((markEl) => {
      if (!markEl) return;
      const idx = Number(markEl.dataset.markIndex);
      const markRect = markEl.getBoundingClientRect();
      result[idx] = readoutRects.some((readoutRect) => rectsOverlap(markRect, readoutRect, COLLISION_PADDING));
    });
  }
  markCollisionHidden.value = result;
}

const readoutVisibility = computed(() => internalValues.value.map((_, i) => isReadoutOpen(i)));

let markCollisionResizeObserver = null;

watch(
  [internalValues, readoutVisibility, computedMarks],
  () => updateCollisions(),
  { deep: true },
);

onMounted(() => {
  nextTick(updateCollisions);
  if (typeof ResizeObserver !== 'undefined' && controlRef.value) {
    markCollisionResizeObserver = new ResizeObserver(() => updateCollisions());
    markCollisionResizeObserver.observe(controlRef.value);
  }
  // The initial modelValue never runs through the watch() above — correct
  // an inverted starting pair back to the parent the same way a later prop
  // update would, so v-model doesn't stay silently out of sync with what's
  // rendered.
  if (Array.isArray(props.modelValue) && props.modelValue.length === 2 && props.modelValue[0] > props.modelValue[1]) {
    emit('update:modelValue', [...internalValues.value]);
  }
});

onBeforeUnmount(() => {
  markCollisionResizeObserver?.disconnect();
});

// ─── Dev warnings ─────────────────────────────────────────────────────────────

onMounted(() => {
  if (isRange.value && !props.getValueText) {
    console.info(
      '[Dialtone] DtSlider in range mode: provide getValueText to give each thumb a distinct screen-reader description.',
    );
  }
  if (!props.label && !props.labelHidden) {
    console.info(
      '[Dialtone] DtSlider: provide a label prop (use labelHidden to hide it visually) or aria-label for accessibility.',
    );
  }
});

// ─── Exposed API ──────────────────────────────────────────────────────────────

function focus() {
  thumbRefs.value[0]?.focus();
}

function blur() {
  thumbRefs.value[0]?.blur();
}

defineExpose({ focus, blur });
</script>
