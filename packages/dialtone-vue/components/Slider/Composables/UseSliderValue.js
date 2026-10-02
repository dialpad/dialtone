import { ref, computed, watch, onMounted } from 'vue';

// Single source of truth for turning a possibly-uncontrolled, possibly
// out-of-contract modelValue into the normalized internalValues every other
// part of the component reads — clamped to [min, max], snapped to the step
// grid, range order normalized, and the minGapSteps gap enforced. See
// normalizeModelValue below for the full rationale. isRange is prop-derived
// state, not value normalization — it lives in Slider.vue and is passed in
// here (and to every other composable that needs it) rather than owned by
// any one of them.
export function useSliderValue(props, emit, { isRange }) {
  function decimalPlaces(n) {
    const dot = String(n).indexOf('.');
    return dot === -1 ? 0 : String(n).length - dot - 1;
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

  // The low thumb's value can never exceed the high thumb's — swap rather than
  // clamp so an inverted pair (e.g. a consumer-supplied [70, 30]) still keeps
  // its intended width instead of collapsing to a single point.
  function normalizeRangeValues(values) {
    if (values.length === 2 && values[0] > values[1]) {
      return [values[1], values[0]];
    }
    return values;
  }

  // Range mode's low/high thumbs may only meet, or — when minGapSteps
  // is set — must keep at least that many steps apart. updateThumbValue (see
  // UseSliderInteraction) already enforces this during interactive
  // drags/keyboard input, but a controlled modelValue, or a reactive change
  // to step/minGapSteps, bypassed it entirely: two values could sit closer
  // together than the documented minimum gap from the very first render, and
  // the native inputs' min/max never reflected that dependency either (see
  // thumbNativeMin/thumbNativeMax).
  function enforceRangeGap(values) {
    if (values.length !== 2) return values;
    const gap = props.minGapSteps * props.step;
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
  // minGapSteps changes all call this (directly or via normalizeModelValue
  // below) — so all of them get the same guarantees: clamped to [min, max],
  // snapped to the step grid, range order normalized, and the minGapSteps gap
  // enforced. Nothing enforces the public contract (see modelValue's
  // validator) at runtime otherwise: a controlled value out of [min, max] or
  // off the step grid, or an array of some other length, would otherwise flow
  // straight into internalValues and split the native input (browser-clamped/
  // step-coerced), aria-valuetext (unclamped), and visual thumb (also
  // unclamped) into three disagreeing states, or render an unmanaged extra
  // thumb.
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

  // Mirrors the update:modelValue payload shape (Number, or Number[] in range
  // mode) so a custom #label slot can render the live value while dragging.
  const currentValue = computed(() => (isRange.value ? [...internalValues.value] : internalValues.value[0]));

  function thumbPercent(val) {
    // A degenerate min === max range has no meaningful position — avoid a
    // division by zero that would otherwise produce NaN and corrupt every
    // positioning/collision calculation downstream.
    if (props.max === props.min) return 0;
    return ((val - props.min) / (props.max - props.min)) * 100;
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
    const gap = props.minGapSteps * props.step;
    return Math.min(props.max, (internalValues.value[0] ?? props.min) + gap);
  }

  function thumbNativeMax(i) {
    if (!isRange.value || i !== 0) return props.max;
    const gap = props.minGapSteps * props.step;
    return Math.max(props.min, (internalValues.value[1] ?? props.max) - gap);
  }

  // The native range-state algorithm rounds any value assigned to a step
  // mismatch relative to the input's OWN min — silently overriding Vue's
  // :value binding the moment the browser applies it, splitting native state
  // (and form submission) from the visual thumb/readout/aria-valuetext/
  // emitted modelValue. applyValueConstraints (mount, controlled updates,
  // reactive min/max/step/minGapSteps changes) already keeps
  // internalValues on the step grid, so this never matters in practice — with
  // one deliberate exception: an active magnetic snap point (see
  // findMagneticSnapPoint, UseSliderMagneticSnap) intentionally holds an
  // off-grid value while dragging, exactly as documented ("unlike step, this
  // doesn't restrict which values are selectable"). Falling back to
  // step="any" only for that specific thumb, only while its value is
  // genuinely off-grid, keeps the browser from fighting that intentional
  // value without touching native Home/End/Arrow stepping (which relies on
  // the real `step` attribute) the rest of the time. A non-positive step has
  // no valid grid at all, matching snapToStep's own unsnapped fallback in
  // that case.
  function thumbNativeStep(i) {
    if (props.step <= 0) return 'any';
    const val = internalValues.value[i];
    if (val === undefined) return props.step;
    const stepsFromMin = (val - props.min) / props.step;
    const isOffGrid = Math.abs(stepsFromMin - Math.round(stepsFromMin)) > 1e-9;
    return isOffGrid ? 'any' : props.step;
  }

  // Shared by the readout and each thumb's aria-valuetext, so the two always
  // agree on how a value is displayed. Deliberately NOT used for a mark's own
  // auto-generated text — see formatMarkValue (UseSliderMarksAndTicks).
  function formatValue(value, index) {
    if (props.getValueText) return props.getValueText(value, index);
    return `${props.prefix}${value}${props.suffix}`;
  }

  // ─── Sync controlled modelValue → internalValues ──────────────────────────

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

  // A consumer can narrow [min, max], change step, or change
  // minGapSteps without touching modelValue at all — the watcher
  // above never fires for that, so the current value(s) would otherwise
  // silently drift out of bounds, off the step grid, or inside a now-invalid
  // gap (native input clamps/step-coerces, aria-valuetext and the visual
  // thumb don't — see applyValueConstraints). This re-applies the same full
  // constraint pipeline every time any of those four props change, so the
  // guarantees hold continuously, not just at mount and on modelValue writes.
  watch(
    () => [props.min, props.max, props.step, props.minGapSteps],
    () => {
      const next = applyValueConstraints(internalValues.value);
      if (next.length !== internalValues.value.length || next.some((v, i) => v !== internalValues.value[i])) {
        internalValues.value = next;
        lastCommittedValues.value = [...next];
        emit('update:modelValue', isRange.value ? [...next] : next[0]);
      }
    },
  );

  // The initial modelValue never runs through the watch() above — correct a
  // starting value normalizeModelValue had to rewrite (inverted pair,
  // out-of-bounds clamp, invalid array length) back to the parent the same
  // way a later prop update would, so v-model doesn't stay silently out of
  // sync with what's rendered from the very first paint.
  onMounted(() => {
    if (props.modelValue === undefined || props.modelValue === null) return;
    const incoming = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
    const next = internalValues.value;
    const needsCorrection = next.length !== incoming.length || next.some((v, i) => v !== incoming[i]);
    if (needsCorrection) {
      emit('update:modelValue', Array.isArray(props.modelValue) ? [...next] : next[0]);
    }
  });

  return {
    internalValues,
    lastCommittedValues,
    currentValue,
    decimalPlaces,
    clampToRange,
    snapToStep,
    applyValueConstraints,
    normalizeModelValue,
    thumbPercent,
    thumbNativeMin,
    thumbNativeMax,
    thumbNativeStep,
    formatValue,
  };
}
