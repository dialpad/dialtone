<template>
  <div
    :class="[
      'd-slider-alt',
      sizeClass,
      {
        'd-slider-alt--disabled': disabled,
        'd-slider-alt--vertical': isVertical,
        'd-slider-alt--inverted': inverted,
      },
    ]"
    :data-disabled="disabled || undefined"
    :data-orientation="orientation"
    :data-dragging="isDragging || undefined"
    data-qa="dt-slider-alt"
  >
    <div
      :id="labelId"
      :class="['d-slider-alt__label', { 'sr-only': labelHidden }, labelClass]"
      data-qa="dt-slider-alt-label"
    >
      <!-- @slot Slot for the label, defaults to the label prop.
           Required for accessibility; use labelHidden to hide it visually. -->
      <slot name="label">
        <dt-text
          v-if="label"
          kind="label"
          size="300"
        >
          {{ label }}
        </dt-text>
      </slot>
    </div>
    <div class="d-slider-alt__body">
      <div
        :class="['d-slider-alt__start', startClass]"
        data-qa="dt-slider-alt-start"
      >
        <!-- @slot Optional content at the inline-start end of the track (aka left in LTR).
             When using icon-only content, add aria-label or hidden text to the icon. -->
        <slot name="start" />
      </div>
      <div class="d-slider-alt__control-wrapper">
        <div
          ref="controlRef"
          :class="[
            'd-slider-alt__control',
            { 'd-slider-alt__control--focused': focusedThumbIndex !== null },
          ]"
          :style="isVertical ? { touchAction: 'pan-x' } : { touchAction: 'pan-y' }"
          data-qa="dt-slider-alt-control"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <div
            class="d-slider-alt__track"
            data-qa="dt-slider-alt-track"
          />
          <div
            class="d-slider-alt__indicator"
            :style="indicatorStyle"
            data-qa="dt-slider-alt-indicator"
          />
          <template v-if="showTicks">
            <div
              v-for="(tickValue, i) in computedTickValues"
              :key="i"
              class="d-slider-alt__tick"
              :style="tickPositionStyle(tickValue)"
              data-qa="dt-slider-alt-tick"
            />
          </template>
          <div
            v-for="(val, i) in internalValues"
            :key="`thumb-visual-${i}`"
            :class="[
              'd-slider-alt__thumb-visual',
              {
                'd-slider-alt__thumb-visual--focused': focusedThumbIndex === i,
                'd-slider-alt__thumb-visual--active': activeThumbIndex === i,
              },
            ]"
            :style="thumbPositionStyle(val)"
            data-qa="dt-slider-alt-thumb-visual"
          />
          <div
            v-for="(val, i) in internalValues"
            :key="`thumb-hit-${i}`"
            :ref="el => setThumbHitRef(el, i)"
            class="d-slider-alt__thumb-hit"
            :style="{ ...thumbPositionStyle(val), touchAction: isVertical ? 'pan-x' : 'pan-y' }"
            data-qa="dt-slider-alt-thumb-hit"
          />
          <template v-if="showTooltip && thumbHitRefsReady">
            <dt-tooltip
              v-for="(val, i) in internalValues"
              :key="`thumb-tooltip-${i}`"
              :external-anchor-element="thumbHitRefs[i]"
              :message="getAriaValueText ? getAriaValueText(val, i) : String(val)"
              :open="true"
              :placement="isRange ? (i === 0 ? 'left' : 'right') : 'top'"
              :fallback-placements="isRange ? (i === 0 ? ['top', 'right'] : ['top', 'left']) : ['bottom']"
            />
          </template>
          <input
            v-for="(val, i) in internalValues"
            :key="`thumb-input-${i}`"
            ref="thumbRefs"
            type="range"
            class="d-slider-alt__thumb"
            :value="val"
            :min="min"
            :max="max"
            :step="step"
            :disabled="disabled"
            :name="name || undefined"
            :aria-labelledby="(label || $slots.label) ? labelId : undefined"
            :aria-label="(!label && !$slots.label) ? $attrs['aria-label'] : undefined"
            :aria-valuetext="getAriaValueText ? getAriaValueText(val, i) : undefined"
            :style="thumbPositionStyle(val)"
            data-qa="dt-slider-alt-thumb"
            @input="onThumbInput(i, $event)"
            @keydown="onThumbKeydown(i, $event)"
            @focus="onThumbFocus(i, $event)"
            @blur="onThumbBlur(i, $event)"
          >
        </div>
        <div
          v-for="(mark, i) in computedMarks"
          :key="`mark-${i}`"
          class="d-slider-alt__mark"
          :style="markStyle(mark.pct)"
          data-qa="dt-slider-alt-mark"
        >
          {{ mark.text }}
        </div>
      </div>
      <div
        :class="['d-slider-alt__end', endClass]"
        data-qa="dt-slider-alt-end"
      >
        <!-- @slot Optional content at the inline-end end of the track (aka right in LTR).
             When using icon-only content, add aria-label or hidden text to the icon. -->
        <slot name="end" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { DtText } from '@/components/Text';
import { DtTooltip } from '@/components/Tooltip';
import { getUniqueString } from '@/common/utils';
import {
  SLIDER_ORIENTATIONS,
  SLIDER_DEFAULT_LARGE_STEP,
} from '../Slider/SliderConstants';
import { SLIDER_ALT_SIZE_MODIFIERS } from './SliderAltConstants';

defineOptions({ name: 'DtSliderAlt', inheritAttrs: false });

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
   * @values 100, 200, 300, 400, 500
   */
  size: {
    type: [String, Number],
    default: 300,
    validator: (v) => Object.keys(SLIDER_ALT_SIZE_MODIFIERS).includes(String(v)),
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
   * A function returning the accessible text for a thumb's current value.
   * Signature: (value: number, index: number) => string.
   * For range sliders, use this to differentiate thumbs (e.g., "Minimum: 20").
   * The default (null) uses the raw number, which must be i18n-safe for your context.
   */
  getAriaValueText: {
    type: Function,
    default: null,
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
   * Number of steps to move on Page Up or Page Down.
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
   * Additional class(es) applied to the inline-start slot wrapper (aka left in LTR).
   */
  startClass: {
    type: [String, Array, Object],
    default: '',
  },

  /**
   * Additional class(es) applied to the inline-end slot wrapper (aka right in LTR).
   */
  endClass: {
    type: [String, Array, Object],
    default: '',
  },

  /**
   * When true, shows a tooltip above (aka on top of) each thumb displaying its current value.
   * Uses getAriaValueText for the label when provided, otherwise falls back to the raw number.
   * @values true, false
   */
  showTooltip: {
    type: Boolean,
    default: false,
  },

  /**
   * Text annotations rendered below the track at specific positions, independent of ticks.
   * Pass true to mark every tick position automatically (uses tickInterval
   * or step to determine positions). Pass an array for explicit control: each entry is either
   * a plain number (text defaults to the number itself) or an object with a required value
   * and optional text override. Example: [{ value: 0, text: 'Neutral' }, -100, 100]
   */
  marks: {
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

const labelId = `slider-alt-label-${getUniqueString()}`;
const controlRef = ref(null);
const thumbRefs = ref([]);
const isDragging = ref(false);
const activeThumbIndex = ref(null);
const focusedThumbIndex = ref(null);
const thumbHitRefs = ref([]);
const thumbHitRefsReady = ref(false);

function setThumbHitRef (el, i) {
  thumbHitRefs.value[i] = el ?? null;
}

const isRange = computed(() => Array.isArray(props.modelValue));

const internalValues = ref(
  Array.isArray(props.modelValue)
    ? [...props.modelValue]
    : props.modelValue !== undefined
      ? [props.modelValue]
      : [props.min],
);

const lastCommittedValues = ref([...internalValues.value]);

const isVertical = computed(() => props.orientation === 'vertical');
const sizeClass = computed(() => SLIDER_ALT_SIZE_MODIFIERS[String(props.size)] ?? '');

// ─── Sync controlled modelValue → internalValues ──────────────────────────────

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === undefined || newVal === null) return;
    const next = Array.isArray(newVal) ? [...newVal] : [newVal];
    const current = internalValues.value;
    if (next.length !== current.length || next.some((v, i) => v !== current[i])) {
      internalValues.value = next;
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

// Returns a CSS calc() expression for the thumb center at a given 0–1 fraction.
// Uses --slider-alt-thumb-width (the pill's long axis) for horizontal travel bounds
// so the thumb stays inset from each track edge regardless of pill width.
function thumbCenter(pct) {
  return `calc(var(--slider-alt-thumb-inset) + var(--slider-alt-thumb-width) / 2 + ${pct} * (100% - 2 * var(--slider-alt-thumb-inset) - var(--slider-alt-thumb-width)))`;
}

function thumbPositionStyle(val) {
  const pct = (val - props.min) / (props.max - props.min);
  if (isVertical.value) {
    return { bottom: thumbCenter(pct), transform: 'translate(-50%, 50%)' };
  }
  return { left: thumbCenter(pct), transform: 'translate(-50%, -50%)' };
}

function tickPositionStyle(val) {
  const pct = thumbPercent(val);
  if (isVertical.value) {
    return { bottom: `${pct}%`, transform: 'translateY(50%)' };
  }
  return { left: `${pct}%`, transform: 'translateX(-50%)' };
}

const computedMarks = computed(() => {
  const source = props.marks === true ? computedTickValues.value : (props.marks || []);
  return source.map((item) => {
    const value = typeof item === 'number' ? item : item.value;
    const text = typeof item === 'number' ? String(item) : (item.text ?? String(value));
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
  // The pill thumb is wider than it is tall. Shift the indicator end by
  // (thumbWidth - thumbSize) / 2 so the fill's rounded end-cap aligns with
  // the thumb's rounded end-cap, creating a seamless pill-to-fill connection.
  // When thumbWidth === thumbSize (circular) the adjustment is 0 — backward compat.
  const adj = '(var(--slider-alt-thumb-width) - var(--slider-alt-thumb-size)) / 2';
  const adjFull = '(var(--slider-alt-thumb-width) - var(--slider-alt-thumb-size))';

  if (isRange.value && internalValues.value.length === 2) {
    const [lo, hi] = internalValues.value;
    const loP = (lo - props.min) / (props.max - props.min);
    const hiP = (hi - props.min) / (props.max - props.min);
    if (isVertical.value) {
      return {
        bottom: `calc(${thumbCenter(loP)} + ${adj})`,
        height: `calc(${thumbCenter(hiP)} - ${thumbCenter(loP)} - ${adjFull})`,
      };
    }
    return {
      left: `calc(${thumbCenter(loP)} + ${adj})`,
      width: `calc(${thumbCenter(hiP)} - ${thumbCenter(loP)} - ${adjFull})`,
    };
  }

  const rawPct = internalValues.value[0] ?? props.min;
  const pct = (rawPct - props.min) / (props.max - props.min);

  if (props.fillOrigin != null) {
    const originClamped = Math.min(props.max, Math.max(props.min, props.fillOrigin));
    const origPct = (originClamped - props.min) / (props.max - props.min);
    const lo = Math.min(pct, origPct);
    const hi = Math.max(pct, origPct);
    if (isVertical.value) {
      return {
        bottom: `calc(${thumbCenter(lo)} + ${adj})`,
        height: `calc(${thumbCenter(hi)} - ${thumbCenter(lo)} - ${adjFull})`,
      };
    }
    return {
      left: `calc(${thumbCenter(lo)} + ${adj})`,
      width: `calc(${thumbCenter(hi)} - ${thumbCenter(lo)} - ${adjFull})`,
    };
  }

  if (isVertical.value) {
    return props.inverted
      ? { top: '0', height: `calc(${thumbCenter(1 - pct)} - ${adj})` }
      : { bottom: '0', height: `calc(${thumbCenter(pct)} - ${adj})` };
  }
  return props.inverted
    ? { right: '0', width: `calc(${thumbCenter(1 - pct)} - ${adj})` }
    : { left: '0', width: `calc(${thumbCenter(pct)} - ${adj})` };
});

// ─── Value update ─────────────────────────────────────────────────────────────

function updateThumbValue(thumbIndex, newVal) {
  let clamped = Math.min(props.max, Math.max(props.min, newVal));
  clamped = snapToStep(clamped);

  const next = [...internalValues.value];

  if (isRange.value && props.minStepsBetweenValues > 0) {
    const gap = props.minStepsBetweenValues * props.step;
    if (thumbIndex === 0) {
      clamped = Math.min(clamped, (next[1] ?? props.max) - gap);
    } else {
      clamped = Math.max(clamped, (next[0] ?? props.min) + gap);
    }
    clamped = Math.min(props.max, Math.max(props.min, clamped));
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
    return activeThumbIndex.value === 0 ? 1 : 0;
  }
  return Math.abs(val - lo) <= Math.abs(val - hi) ? 0 : 1;
}

function onPointerDown(event) {
  if (props.disabled) return;
  // Only handle primary pointer button
  if (event.pointerType === 'mouse' && event.button !== 0) return;

  const rawVal = getValueFromPointerEvent(event);
  const idx = getNearestThumbIndex(rawVal);

  activeThumbIndex.value = idx;
  isDragging.value = true;
  controlRef.value.setPointerCapture(event.pointerId);

  updateThumbValue(idx, rawVal);
  thumbRefs.value[idx]?.focus();
}

function onPointerMove(event) {
  if (!isDragging.value || activeThumbIndex.value === null) return;
  updateThumbValue(activeThumbIndex.value, getValueFromPointerEvent(event));
}

function onPointerUp() {
  if (!isDragging.value) return;
  isDragging.value = false;
  commitIfChanged();
  activeThumbIndex.value = null;
}

// ─── Keyboard events on native inputs ─────────────────────────────────────────

function onThumbInput(i, event) {
  // Fires from native arrow keys / Home / End on the hidden input
  updateThumbValue(i, Number(event.target.value));
}

function onThumbKeydown(i, event) {
  const { key } = event;
  if (key === 'PageUp') {
    event.preventDefault();
    updateThumbValue(i, internalValues.value[i] + props.largeStep);
  } else if (key === 'PageDown') {
    event.preventDefault();
    updateThumbValue(i, internalValues.value[i] - props.largeStep);
  }
  // Arrow keys, Home, End handled natively by <input type="range">
}

function onThumbFocus(i, event) {
  focusedThumbIndex.value = i;
  emit('focus', event);
}

function onThumbBlur(i, event) {
  focusedThumbIndex.value = null;
  commitIfChanged();
  emit('blur', event);
}

// ─── Dev warnings ─────────────────────────────────────────────────────────────

onMounted(() => {
  thumbHitRefsReady.value = true;
  if (!props.label && !props.labelHidden) return; // will have visible label
  if (isRange.value && !props.getAriaValueText) {
    console.info(
      '[Dialtone] DtSliderAlt in range mode: provide getAriaValueText to give each thumb a distinct screen-reader description.',
    );
  }
  if (!props.label && !props.labelHidden) {
    console.info(
      '[Dialtone] DtSliderAlt: provide a label prop (use labelHidden to hide it visually) or aria-label for accessibility.',
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
