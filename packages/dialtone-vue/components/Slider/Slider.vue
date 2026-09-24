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
          :style="markStyle(mark.pct)"
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

<script setup>
import { ref, computed, watch, watchEffect, onMounted, onBeforeUnmount, nextTick, useSlots, useAttrs } from 'vue';
import { DtText } from '@/components/Text';
import { getUniqueString, hasSlotContent, removeClassStyleAttrs } from '@/common/utils';
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
   * getValueText is set (see getValueText).
   */
  prefix: {
    type: String,
    default: '',
  },

  /**
   * Text appended to the raw number wherever it's displayed — e.g. suffix="%" for a
   * percentage. Always applied to marks. Ignored by the readout and aria-valuetext when
   * getValueText is set (see getValueText).
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
   * automatically (uses tickInterval or step to determine positions) instead. Pass an
   * array for explicit control: each entry is either a plain number (text defaults to the
   * number itself, formatted with prefix/suffix — NOT getValueText, which has no
   * meaningful index for a position that isn't tied to either thumb) or an object with a
   * required value and optional text override, which is used as-is regardless of
   * prefix/suffix/getValueText. Pass false to render no marks at all.
   * Example: [{ value: 0, text: 'Neutral' }, -100, 100]
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

function clampToRange(val) {
  return Math.min(props.max, Math.max(props.min, val));
}

// step must be a positive value for a well-defined grid — <input step> is
// only valid when positive, and the HTML range-state algorithm silently
// rounds any assigned .value to the nearest step-grid point relative to the
// element's own min. Without this guard, a controlled value or a magnetic
// snap point that doesn't land on that grid renders correctly in Vue's
// internal state (visual thumb, readout, aria-valuetext, emitted
// modelValue) but gets silently coerced by the BROWSER itself the moment
// it's written to the native input's .value — splitting Vue's state from
// what the native control, its implicit aria-valuenow, and form submission
// actually hold.
function snapToStep(val) {
  if (props.step <= 0) return Math.min(props.max, Math.max(props.min, val));
  const steps = Math.round((val - props.min) / props.step);
  const dp = Math.max(decimalPlaces(props.min), decimalPlaces(props.step));
  return Math.min(props.max, Math.max(props.min, parseFloat((props.min + steps * props.step).toFixed(dp))));
}

// Range mode's low/high thumbs may only meet, or — when minStepsBetweenValues
// is set — must keep at least that many steps apart. updateThumbValue already
// enforces this during interactive drags/keyboard input, but a controlled
// modelValue, or a reactive change to step/minStepsBetweenValues, bypassed it
// entirely: two values could sit closer together than the documented minimum
// gap from the very first render, and the native inputs' min/max never
// reflected that dependency either (see thumbNativeMin/thumbNativeMax).
function enforceRangeGap(values) {
  if (values.length !== 2) return values;
  const gap = props.minStepsBetweenValues * props.step;
  if (gap <= 0) return values;
  let [lo, hi] = values;
  if (hi - lo >= gap) return values;
  // Widen from the high end first — mirrors updateThumbValue's own
  // asymmetry (thumb 1 is the one pushed when a drag closes the gap) — then
  // pull the low end down only if that overflowed max.
  hi = Math.min(props.max, lo + gap);
  lo = Math.min(lo, hi - gap);
  lo = Math.max(props.min, lo);
  const dp = Math.max(decimalPlaces(props.min), decimalPlaces(props.step));
  return [parseFloat(lo.toFixed(dp)), parseFloat(hi.toFixed(dp))];
}

// The single place every value entering internalValues funnels through —
// mount, a controlled modelValue change, and reactive min/max/step/
// minStepsBetweenValues changes all call this (directly or via
// renormalizeCurrentValues below) — so all of them get the same guarantees:
// clamped to [min, max], snapped to the step grid, range order normalized,
// and the minStepsBetweenValues gap enforced. Nothing enforces the public
// contract (see modelValue's validator) at runtime otherwise: a controlled
// value out of [min, max] or off the step grid, or an array of some other
// length, would otherwise flow straight into internalValues and split the
// native input (browser-clamped/step-coerced), aria-valuetext (unclamped),
// and visual thumb (also unclamped) into three disagreeing states, or
// render an unmanaged extra thumb.
function applyValueConstraints(values) {
  let out = values.map(clampToRange).map(snapToStep);
  out = out.length === 2 ? normalizeRangeValues(out) : out;
  return enforceRangeGap(out);
}

function normalizeModelValue(value) {
  let raw;
  if (Array.isArray(value)) {
    raw = value.length >= 2 ? [value[0], value[1]] : value.length === 1 ? [value[0]] : [props.min];
  } else {
    raw = value !== undefined && value !== null ? [value] : [props.min];
  }
  return applyValueConstraints(raw);
}

const internalValues = ref(normalizeModelValue(props.modelValue));

const lastCommittedValues = ref([...internalValues.value]);

const isVertical = computed(() => props.orientation === 'vertical');

// Mirrors the update:modelValue payload shape (Number, or Number[] in range
// mode) so a custom #label slot can render the live value while dragging.
// Declared here (not further down where currentValue used to live) because
// hasVisibleLabel below needs it too — the #label slot is documented as
// scoped with :value, and probing it via hasSlotContent({}) without that
// scope left `value` undefined inside the slot body, throwing whenever a
// consumer actually used it (e.g. `{{ value[0] }}`, the exact pattern the
// 'call duration filter' Combinator preset already ships).
const currentValue = computed(() => (isRange.value ? [...internalValues.value] : internalValues.value[0]));

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

// ─── Sync controlled modelValue → internalValues ──────────────────────────────

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === undefined || newVal === null) return;
    const next = normalizeModelValue(newVal);
    const current = internalValues.value;
    if (next.length !== current.length || next.some((v, i) => v !== current[i])) {
      internalValues.value = next;
      // An externally-driven value is already "committed" as far as this
      // component is concerned — without this, lastCommittedValues stays
      // stale, and the next blur (even with zero further user interaction)
      // sees a spurious diff against it and fires a false change event.
      lastCommittedValues.value = [...next];
    }
    // normalizeModelValue can rewrite what was actually passed in — swapping
    // an inverted pair, clamping an out-of-[min,max] value, or truncating an
    // invalid array length — and that correction must reach the parent's own
    // v-model source, not just our local render, or a consumer reading
    // modelValue directly stays silently out of sync with what's rendered.
    // Safe against feedback loops: normalizeModelValue is idempotent, so a
    // corrected emission re-triggers this watcher at most once, and that
    // second pass is always a no-op.
    const incoming = Array.isArray(newVal) ? newVal : [newVal];
    const needsCorrection = next.length !== incoming.length || next.some((v, i) => v !== incoming[i]);
    if (needsCorrection) {
      emit('update:modelValue', Array.isArray(newVal) ? [...next] : next[0]);
    }
  },
  { deep: true },
);

// A consumer can flip :disabled reactively while a thumb is focused — the
// native input's own focus ring clears automatically, but focusedThumbIndex
// is separate internal state (also drives the 'interaction' readout), so
// without this it would keep pointing at a thumb that's no longer
// interactive, leaving its focus ring/readout stuck open.
watch(
  () => props.disabled,
  (isDisabled) => {
    if (isDisabled) focusedThumbIndex.value = null;
  },
);

// A consumer can narrow [min, max], change step, or change
// minStepsBetweenValues without touching modelValue at all — the watcher
// above never fires for that, so the current value(s) would otherwise
// silently drift out of bounds, off the step grid, or inside a now-invalid
// gap (native input clamps/step-coerces, aria-valuetext and the visual
// thumb don't — see applyValueConstraints). This re-applies the same full
// constraint pipeline every time any of those four props change, so the
// guarantees hold continuously, not just at mount and on modelValue writes.
watch(
  () => [props.min, props.max, props.step, props.minStepsBetweenValues],
  () => {
    const next = applyValueConstraints(internalValues.value);
    if (next.length !== internalValues.value.length || next.some((v, i) => v !== internalValues.value[i])) {
      internalValues.value = next;
      lastCommittedValues.value = [...next];
      emit('update:modelValue', isRange.value ? [...next] : next[0]);
    }
  },
);

// ─── Computed visual helpers ──────────────────────────────────────────────────

function thumbPercent(val) {
  // A degenerate min === max range has no meaningful position — avoid a
  // division by zero that would otherwise produce NaN and corrupt every
  // positioning/collision calculation downstream.
  if (props.max === props.min) return 0;
  return ((val - props.min) / (props.max - props.min)) * 100;
}

function decimalPlaces(n) {
  const dot = String(n).indexOf('.');
  return dot === -1 ? 0 : String(n).length - dot - 1;
}

// The two thumbs in range mode have a DEPENDENT range, not the full
// [min, max] each: the low thumb can never reach past (high - gap) and the
// high thumb never below (low + gap). Binding both native inputs to the
// same static min/max (as before) told the browser and assistive tech that
// either thumb could traverse the complete range, contradicting the
// WAI-ARIA multi-thumb slider pattern, which requires each thumb's
// aria-valuemin/aria-valuemax to reflect the other thumb's current position.
function thumbNativeMin(i) {
  if (!isRange.value || i !== 1) return props.min;
  const gap = props.minStepsBetweenValues * props.step;
  return Math.min(props.max, (internalValues.value[0] ?? props.min) + gap);
}

function thumbNativeMax(i) {
  if (!isRange.value || i !== 0) return props.max;
  const gap = props.minStepsBetweenValues * props.step;
  return Math.max(props.min, (internalValues.value[1] ?? props.max) - gap);
}

// The native range-state algorithm rounds any value assigned to a step
// mismatch relative to the input's OWN min — silently overriding Vue's
// :value binding the moment the browser applies it, splitting native state
// (and form submission) from the visual thumb/readout/aria-valuetext/
// emitted modelValue. applyValueConstraints (mount, controlled updates,
// reactive min/max/step/minStepsBetweenValues changes) already keeps
// internalValues on the step grid, so this never matters in practice — with
// one deliberate exception: an active magnetic snap point (see
// findMagneticSnapPoint) intentionally holds an off-grid value while
// dragging, exactly as documented ("unlike step, this doesn't restrict
// which values are selectable"). Falling back to step="any" only for that
// specific thumb, only while its value is genuinely off-grid, keeps the
// browser from fighting that intentional value without touching native
// Home/End/Arrow stepping (which relies on the real `step` attribute) the
// rest of the time. A non-positive step has no valid grid at all, matching
// snapToStep's own unsnapped fallback in that case.
function thumbNativeStep(i) {
  if (props.step <= 0) return 'any';
  const val = internalValues.value[i];
  if (val === undefined) return props.step;
  const stepsFromMin = (val - props.min) / props.step;
  const isOffGrid = Math.abs(stepsFromMin - Math.round(stepsFromMin)) > 1e-9;
  return isOffGrid ? 'any' : props.step;
}

// A too-small interval relative to [min, max] (e.g. tickInterval=0.001 over a
// 0–100 range) would otherwise generate tens of thousands of DOM nodes and an
// equally large per-pointermove scan — cap it and warn instead of silently
// hanging the tab.
const MAX_GENERATED_POINTS = 1000;

function generateInterval(min, max, interval, label) {
  const span = max - min;
  const naturalCount = span > 0 ? Math.floor(span / interval) + 1 : 1;
  let effectiveInterval = interval;
  if (naturalCount > MAX_GENERATED_POINTS) {
    // Too many points for the requested interval to be practical over this
    // range — widen it just enough to fit the cap while still spanning the
    // FULL domain, rather than truncating to a fixed count from `min`. That
    // used to silently cover only the first ~1% of the range (e.g.
    // tickInterval=0.001 over 0–100 rendered ticks from 0 to 0.999 only) —
    // a plausible-looking but materially false representation of the range.
    effectiveInterval = span / (MAX_GENERATED_POINTS - 1);
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        `[Dialtone] DtSlider: ${label}=${interval} would generate more than ${MAX_GENERATED_POINTS} points over this range — using ${effectiveInterval} instead so coverage still spans the full range.`,
      );
    }
  }
  const values = [];
  for (
    let v = min;
    v <= max && values.length < MAX_GENERATED_POINTS;
    v = parseFloat((v + effectiveInterval).toFixed(10))
  ) {
    values.push(v);
  }
  // Float accumulation can fall just short of `max` after many increments —
  // make sure the end of the domain is always represented.
  if (values.length && values[values.length - 1] < max - 1e-9) {
    values.push(max);
  }
  return values;
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
    return generateInterval(props.min, props.max, interval, 'snapPoints');
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

// Shared by every element positioned along the track (thumb, tick, mark,
// readout) — they only differ in which transform re-centers them, so the
// axis branch (insetInlineStart/top vs. bottom for vertical) lives in one
// place instead of being repeated per element type. insetInlineStart (not
// left) so the browser itself mirrors horizontal positions under
// dir="rtl" — see getValueFromPointerEvent and onThumbKeydown for the two
// other places RTL must be handled explicitly (pointer math and the
// hard-coded Shift+Arrow keys), since neither goes through CSS.
function positionStyle(pct, transform) {
  const style = isVertical.value ? { bottom: `${pct}%` } : { insetInlineStart: `${pct}%` };
  if (transform) style.transform = transform;
  return style;
}

// translateX(-50%) is the standard trick for centering an element ON its
// insetInlineStart anchor point — shift left by half the element's own
// width so the anchor lands at its center instead of its edge. That shift
// is a PHYSICAL transform: transform: translateX() never mirrors under
// dir="rtl" the way insetInlineStart does. So when the anchor itself has
// mirrored to the physical right, the compensating shift has to flip sign
// too (+50%, not -50%), or the element renders centered a full width away
// from its actual anchor — which is exactly what caused the thumb/indicator
// gap and mark misalignment under RTL before this existed. This applies
// regardless of orientation — insetInlineStart is still the horizontal/
// inline axis even for a vertical slider (it's used there to center the
// narrow track/thumb within the wider control area), since orientation is
// a layout convention, not a CSS writing-mode change.
function centerInlineTransform() {
  return isRtl() ? '50%' : '-50%';
}

function thumbPositionStyle(val) {
  const transform = isVertical.value
    ? `translate(${centerInlineTransform()}, 50%)`
    : `translate(${centerInlineTransform()}, -50%)`;
  return positionStyle(thumbPercent(val), transform);
}

function tickPositionStyle(val) {
  const transform = isVertical.value ? 'translateY(50%)' : `translateX(${centerInlineTransform()})`;
  return positionStyle(thumbPercent(val), transform);
}

// Shared by the readout and each thumb's aria-valuetext, so the two always
// agree on how a value is displayed. Deliberately NOT used for a mark's own
// auto-generated text — see formatMarkValue below.
function formatValue(value, index) {
  if (props.getValueText) return props.getValueText(value, index);
  return `${props.prefix}${value}${props.suffix}`;
}

// A mark isn't tied to either thumb, so unlike formatValue there's no
// meaningful index to pass getValueText — that function's whole purpose is
// letting a dual-thumb slider give each thumb a *different* meaning (e.g.
// "Minimum"/"Maximum"), which has no correct answer for a fixed reference
// point on the track. Only prefix/suffix apply here, same as a bare number
// would get; anything more specific belongs in that mark's own explicit
// `text`, which bypasses this function entirely (see computedMarks below).
function formatMarkValue(value) {
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
    const text = typeof item === 'number' ? formatMarkValue(item) : (item.text ?? formatMarkValue(value));
    return { text, pct: thumbPercent(value) };
  });
});

function markStyle(pct) {
  return positionStyle(pct);
}

const computedTickValues = computed(() => {
  const interval = props.tickInterval ?? props.step;
  if (!interval || interval <= 0) return [];
  return generateInterval(props.min, props.max, interval, 'tickInterval');
});

const indicatorStyle = computed(() => {
  if (isRange.value && internalValues.value.length === 2) {
    const [lo, hi] = internalValues.value;
    const loP = thumbPercent(lo);
    const hiP = thumbPercent(hi);
    if (isVertical.value) {
      return { bottom: `${loP}%`, height: `${hiP - loP}%` };
    }
    return { insetInlineStart: `${loP}%`, width: `${hiP - loP}%` };
  }

  const pct = thumbPercent(internalValues.value[0] ?? props.min);

  if (props.fillOrigin != null) {
    const originPct = thumbPercent(Math.min(props.max, Math.max(props.min, props.fillOrigin)));
    const startPct = Math.min(pct, originPct);
    const sizePct = Math.abs(pct - originPct);
    if (isVertical.value) {
      return { bottom: `${startPct}%`, height: `${sizePct}%` };
    }
    return { insetInlineStart: `${startPct}%`, width: `${sizePct}%` };
  }

  if (isVertical.value) {
    return props.inverted
      ? { top: '0', height: `${100 - pct}%` }
      : { bottom: '0', height: `${pct}%` };
  }
  return props.inverted
    ? { insetInlineEnd: '0', width: `${100 - pct}%` }
    : { insetInlineStart: '0', width: `${pct}%` };
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

  if (next[thumbIndex] === clamped) {
    // Nothing logically changed, but a native keyboard step (plain Arrow/
    // Home/End, handled by the browser itself — see onThumbKeydown) can
    // still have already written a DIFFERENT value into the native
    // <input>'s own DOM .value before this handler ran, since the native
    // element isn't constrained to the sibling thumb's position the way
    // this range-mode clamp is. Vue's one-way :value binding only re-patches
    // the DOM when the bound reactive value itself changes, so without this
    // correction the native input's real value would silently drift from
    // internalValues/aria-valuetext, and the next keypress would read from
    // that wrong baseline instead of the true current value.
    const el = thumbRefs.value[thumbIndex];
    if (el && el.value !== String(clamped)) {
      el.value = String(clamped);
    }
    return;
  }
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

// True when the control's resolved text direction is RTL — read live off
// the DOM (not a prop) since dir is ambient, inherited from any ancestor.
// Only meaningful for horizontal orientation: vertical positioning runs on
// the block axis, which bidi direction doesn't affect.
function isRtl() {
  return !!controlRef.value && getComputedStyle(controlRef.value).direction === 'rtl';
}

function getValueFromPointerEvent(event) {
  const rect = controlRef.value.getBoundingClientRect();
  let pct;
  if (isVertical.value) {
    pct = 1 - (event.clientY - rect.top) / rect.height;
  } else {
    pct = (event.clientX - rect.left) / rect.width;
    // The visual track is positioned with insetInlineStart, so the browser
    // already mirrors it under dir="rtl" — min renders on the physical right
    // instead of the left. clientX is always a physical coordinate, so the
    // pointer-to-value mapping has to mirror the same way by hand.
    if (isRtl()) pct = 1 - pct;
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
  // Pointer capture routes every subsequent pointer event to controlRef, so
  // the non-dragged thumb's own pointerenter/pointerleave never fire again
  // once the drag starts — without this, a thumb hovered right before the
  // drag began would keep its 'interaction' readout stuck open for the rest
  // of the drag. The dragged thumb's own readout is unaffected — it's driven
  // by activeThumbIndex, not hoveredThumbIndex.
  hoveredThumbIndex.value = null;

  updateThumbValue(idx, rawVal, { allowSnap: true });
  // Marks the focus() call below as pointer-driven so onThumbFocus can skip
  // the keyboard-focus ring for it — :focus-visible isn't usable here since
  // browsers treat range inputs as always focus-visible on click, unlike
  // buttons/links. focus() dispatches its 'focus' event synchronously, so
  // this flag is read and cleared before any other code runs.
  //
  // Only set it — and only call focus() — when the thumb isn't already the
  // active element: focus() on an already-focused element fires no focus
  // event at all, so the flag would never get cleared and would corrupt
  // the next *real* keyboard focus, which is exactly the modality it's
  // meant to distinguish.
  const thumbEl = thumbRefs.value[idx];
  if (thumbEl && document.activeElement !== thumbEl) {
    isPointerFocus = true;
    thumbEl.focus();
  } else if (focusedThumbIndex.value === idx) {
    // This exact thumb was already keyboard-focused, so focus() above is
    // skipped entirely (an already-focused element fires no 'focus' event to
    // clear the keyboard-focus ring through the normal path). Without this,
    // the keyboard-only focus ring would stay visually combined with the
    // --active drag style for the whole drag, even though input modality
    // just switched to pointer.
    focusedThumbIndex.value = null;
  }
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

// +1/-1/0 for a largeStep nudge, or 0 for any other key. increaseKey/
// decreaseKey are resolved by the caller (onThumbKeydown) rather than here,
// so this stays a flat, low-complexity lookup — see the comment there for
// why they're sometimes 'ArrowLeft'/'ArrowRight' and sometimes swapped.
function largeStepDelta(key, shiftKey, increaseKey, decreaseKey) {
  if (key === 'PageUp') return 1;
  if (key === 'PageDown') return -1;
  if (!shiftKey) return 0;
  if (key === 'ArrowUp' || key === increaseKey) return 1;
  if (key === 'ArrowDown' || key === decreaseKey) return -1;
  return 0;
}

// largeStep is documented as roughly how far a Page Up/Down or Shift+Arrow
// nudge should move — but the actual movement always has to land on the
// step grid (see snapToStep), and rounding the raw sum to the NEAREST grid
// point can round backward to the value it started from whenever step is
// more than about twice largeStep (e.g. step=25, largeStep=10: 100+10=110
// rounds back to 100 — a silent no-op on a documented keyboard operation).
// Converting largeStep into a whole number of real steps first — at least
// one — guarantees a large-step key always moves, while still landing on
// exactly the plain-step increment for the common case (step=1, the
// default) where it already matched exactly.
function largeStepValue() {
  if (props.step <= 0) return props.largeStep;
  const stepsCount = Math.max(1, Math.round(props.largeStep / props.step));
  return stepsCount * props.step;
}

function onThumbKeydown(i, event) {
  // A pointer click that focused this thumb never fires another 'focus'
  // event just because the user starts pressing keys afterward — focus()
  // only fires once per focus session. Without this, arrow-key navigation
  // right after a click-to-focus would silently never show the ring, even
  // though the user has unambiguously switched to keyboard input.
  if (focusedThumbIndex.value !== i) {
    focusedThumbIndex.value = i;
  }

  // Left/Right are direction-relative — the native <input type="range">
  // swaps which one increments under dir="rtl" (per the HTML stepping
  // algorithm), and plain arrow keys fall through to that native handling
  // below. largeStepDelta's Shift+Arrow handling must swap the same way, or
  // Shift+ArrowRight would contradict what plain ArrowRight just did on the
  // same key. Up/Down and PageUp/PageDown are never direction-relative;
  // vertical orientation only ever uses Up/Down, so it's unaffected by this.
  const rtl = !isVertical.value && isRtl();
  const increaseKey = rtl ? 'ArrowLeft' : 'ArrowRight';
  const decreaseKey = rtl ? 'ArrowRight' : 'ArrowLeft';
  const delta = largeStepDelta(event.key, event.shiftKey, increaseKey, decreaseKey);
  if (delta !== 0) {
    event.preventDefault();
    updateThumbValue(i, internalValues.value[i] + delta * largeStepValue());
  }
  // Plain arrow keys, Home, End handled natively by <input type="range">
  // (also RTL-aware natively, so no extra handling needed here).
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
// so it takes priority over a fixed reference point. Pure rect measurement, no
// continuous polling — recomputed when the value or readout visibility changes
// (both already reactive) and on control resize, so there's no open-ended loop
// that could silently stop tracking the layout.

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
  // pct is measured from insetInlineStart, which the browser mirrors to the
  // physical right under dir="rtl" — this analytical calculation has to
  // mirror the same way, or collision rects land on the wrong side and the
  // system ends up comparing (and hiding) the wrong element entirely.
  const effectivePct = isRtl() ? 100 - pct : pct;
  const centerPx = controlRect.left + (effectivePct / 100) * (controlRect.right - controlRect.left);
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

// Collision detection measures rendered readout/mark widths, which change
// whenever their formatted TEXT changes — not just when the underlying
// values do. getValueText/prefix/suffix drive that text (see formatValue),
// so a consumer swapping getValueText (e.g. a locale change) at unchanged
// values must still trigger a recheck, or two readouts can end up visibly
// overlapping (or a stale merged pill can persist) with nothing left to
// re-trigger the measurement — the ResizeObserver below only watches the
// control container's own size, not text-driven changes to its children.
watch(
  [internalValues, readoutVisibility, computedMarks, () => props.getValueText, () => props.prefix, () => props.suffix],
  () => updateCollisions(),
  { deep: true },
);

onMounted(() => {
  nextTick(updateCollisions);
  if (typeof ResizeObserver !== 'undefined' && controlRef.value) {
    markCollisionResizeObserver = new ResizeObserver(() => updateCollisions());
    markCollisionResizeObserver.observe(controlRef.value);
  }
  // The initial modelValue never runs through the watch() above — correct a
  // starting value normalizeModelValue had to rewrite (inverted pair,
  // out-of-bounds clamp, invalid array length) back to the parent the same
  // way a later prop update would, so v-model doesn't stay silently out of
  // sync with what's rendered from the very first paint.
  if (props.modelValue !== undefined && props.modelValue !== null) {
    const incoming = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
    const next = internalValues.value;
    const needsCorrection = next.length !== incoming.length || next.some((v, i) => v !== incoming[i]);
    if (needsCorrection) {
      emit('update:modelValue', Array.isArray(props.modelValue) ? [...next] : next[0]);
    }
  }
});

onBeforeUnmount(() => {
  markCollisionResizeObserver?.disconnect();
});

// ─── Dev warnings ─────────────────────────────────────────────────────────────

// watchEffect (not onMounted) — the accessible-name and range/getValueText
// checks below read reactive sources (props and slots; the accessible-name
// check also reads useAttrs(), which is reactive for properties read while
// an effect runs), and a consumer can legitimately change label/getValueText
// after mount (e.g. reactively clearing label once a heading it depends on
// loads). A one-shot mount check would silently stop warning about a real
// regression the moment it happens after the initial paint.
//
// Guarded by NODE_ENV, matching this repo's convention for dev-only console
// warnings (see e.g. DtButton, DtTextList, DtProse) — a library can't assume
// every downstream consumer strips console calls from their own production
// build, so an unguarded call here would log in every consumer's production
// app, not just during local development.
watchEffect(() => {
  if (process.env.NODE_ENV === 'production') return;

  if (isRange.value && !props.getValueText) {
    console.info(
      '[Dialtone] DtSlider in range mode: provide getValueText to give each thumb a distinct screen-reader description.',
    );
  }
  // showLabel is a purely visual modifier (see the #label template branch
  // and the sr-only class above) — it hides label content, it doesn't
  // create it. Checking it here as if it were its own accessible-name
  // source let showLabel={false} without a label ship with no name and no
  // warning, while a valid aria-label-only consumer got warned unnecessarily.
  // aria-labelledby is also a valid accessible-name source (see the thumb's
  // own aria-labelledby/aria-label fallback logic above) — a consumer using
  // that standard pattern shouldn't be warned either.
  const hasAccessibleName = !!(
    props.label?.trim() ||
    hasSlotContent(slots.label, { value: currentValue.value }) ||
    attrs['aria-label'] ||
    attrs['aria-labelledby']
  );
  if (!hasAccessibleName) {
    console.info(
      '[Dialtone] DtSlider: provide a label prop (set showLabel to false to hide it visually) or aria-label for accessibility.',
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
