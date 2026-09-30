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
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, useSlots, useAttrs } from 'vue';
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
import { generateInterval } from './utils';

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
   * automatically (uses tickInterval or step to determine positions) instead. Pass an
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

// Marks/readout are position:absolute (see slider.less) so they don't push
// following content down on their own, even though they render below the
// track — a sibling right after <dt-slider> would overlap them. Only relevant
// horizontally: in vertical mode marks/readout sit to the side of the track,
// not below it. Ticks don't need this — they sit close enough to the track to
// stay within the control's own box (see slider.less).
const reservesAnnotationSpace = computed(() => (
  !isVertical.value && (computedMarks.value.length > 0 || props.readout !== 'never')
));

// A mark beyond EDGE_CLAMP_TOLERANCE_PX of the control's edge (see
// updateMarkCollisions below, which measures and populates this) gets nudged
// inward by that excess so its text stays legible instead of being clipped —
// index-keyed like markCollisionHidden, for the same reason (see the
// data-mark-index rationale above updateMarkCollisions). Guarded by
// !isVertical here (not just where it's computed) so a stale offset from a
// prior horizontal render can never leak into vertical mode's own transform
// (translateY, not translateX) if orientation changes reactively.
const markEdgeOffsetPx = ref([]);
function markStyle(pct, index) {
  const offset = !isVertical.value ? markEdgeOffsetPx.value[index] : 0;
  if (!offset) return positionStyle(pct);
  return positionStyle(pct, `translateX(calc(${centerInlineTransform()} + ${offset}px))`);
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

  if (typeof props.fillOrigin === 'number') {
    const originPct = thumbPercent(Math.min(props.max, Math.max(props.min, props.fillOrigin)));
    const startPct = Math.min(pct, originPct);
    const sizePct = Math.abs(pct - originPct);
    if (isVertical.value) {
      return { bottom: `${startPct}%`, height: `${sizePct}%` };
    }
    return { insetInlineStart: `${startPct}%`, width: `${sizePct}%` };
  }

  const fillsFromEnd = props.fillOrigin === 'end';
  if (isVertical.value) {
    return fillsFromEnd
      ? { top: '0', height: `${100 - pct}%` }
      : { bottom: '0', height: `${pct}%` };
  }
  return fillsFromEnd
    ? { insetInlineEnd: '0', width: `${100 - pct}%` }
    : { insetInlineStart: '0', width: `${pct}%` };
});

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
// Must match .d-slider__control's own overflow-clip-margin (slider.less) — a
// mark within that margin already renders fully today (it's what the margin
// is for), so leave it centered exactly as before. Only once a mark's natural
// centered position would exceed this margin does it need nudging inward;
// see markEdgeOffsetPx below.
const EDGE_CLAMP_TOLERANCE_PX = 32;

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
// Measures collision-hiding and edge-clamping together in one pass (rather
// than two separate functions each reading the DOM independently) because
// they'd otherwise disagree about a mark's position for one cycle: the
// collision check needs to compare against where a mark is ABOUT to render
// this cycle, not where it currently sits from last cycle's correction. If
// a mark's overflow newly crosses the edge-clamp tolerance this cycle, its
// collision-hidden verdict has to be judged against its corrected (not
// stale, pre-nudge) position, or a mark right at that boundary could be
// left with a wrong hidden/visible state until some later, unrelated
// re-measurement happens to correct it.
function updateMarkCollisions() {
  const marks = markElRefs.value;
  if (!marks.length) return;
  const readoutRects = collectReadoutRects();
  const collisionResult = computedMarks.value.map(() => false);
  const offsets = computedMarks.value.map(() => 0);
  // Edge-clamping is only meaningful horizontally — in vertical mode marks
  // sit beside the track, and .d-slider__control's inline-size there is
  // just the thumb's own width (see slider.less's vertical override), so
  // there's no equivalent inline edge to clamp against.
  const canClampEdges = !!controlRef.value && !isVertical.value;
  const controlRect = canClampEdges ? controlRef.value.getBoundingClientRect() : null;

  marks.forEach((markEl) => {
    if (!markEl) return;
    const idx = Number(markEl.dataset.markIndex);
    // Measure with any PREVIOUS offset backed out, so this reflects the
    // mark's natural (centered) position, not last render's correction —
    // otherwise a shrinking overflow (e.g. a shorter value swapped in)
    // would compound on top of the old offset instead of being measured
    // fresh each time.
    const prevOffset = markEdgeOffsetPx.value[idx] || 0;
    const r = markEl.getBoundingClientRect();
    const naturalLeft = r.left - prevOffset;
    const naturalRight = r.right - prevOffset;

    let offset = 0;
    if (canClampEdges) {
      const startOverflow = controlRect.left - naturalLeft; // >0 means it hangs past the left edge
      const endOverflow = naturalRight - controlRect.right; // >0 means it hangs past the right edge
      if (startOverflow > EDGE_CLAMP_TOLERANCE_PX) offset = startOverflow - EDGE_CLAMP_TOLERANCE_PX;
      else if (endOverflow > EDGE_CLAMP_TOLERANCE_PX) offset = -(endOverflow - EDGE_CLAMP_TOLERANCE_PX);
    }
    offsets[idx] = offset;

    if (readoutRects.length) {
      // The rect this mark is ABOUT to render at this cycle (natural
      // position + the offset just computed above), not markEl's current
      // (pre-update) DOM rect — see this function's own comment for why.
      const correctedRect = {
        top: r.top, bottom: r.bottom, left: naturalLeft + offset, right: naturalRight + offset,
      };
      collisionResult[idx] = readoutRects.some(
        (readoutRect) => rectsOverlap(correctedRect, readoutRect, COLLISION_PADDING),
      );
    }
  });

  markCollisionHidden.value = collisionResult;
  markEdgeOffsetPx.value = offsets;
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
  mountInteraction();
  correctInitialModelValue();
});

onBeforeUnmount(() => {
  markCollisionResizeObserver?.disconnect();
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
