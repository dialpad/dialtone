import { ref, computed, watch, onMounted } from 'vue';

// Normalizes a possibly-uncontrolled, out-of-contract modelValue into
// internalValues — clamped, step-snapped, range-ordered, gap-enforced. isRange
// is prop-derived state, not value normalization, so it's passed in rather
// than owned here.
export function useSliderValue(props, emit, { isRange }) {
  function decimalPlaces(n) {
    const dot = String(n).indexOf('.');
    return dot === -1 ? 0 : String(n).length - dot - 1;
  }

  function clampToRange(val) {
    return Math.min(props.max, Math.max(props.min, val));
  }

  // Without this, an off-grid value (from a controlled modelValue or a
  // magnetic snap point) renders correctly in Vue's state but gets silently
  // rounded by the browser the moment it hits the native input's .value —
  // splitting Vue's state from the native control. A non-positive step has no
  // valid grid, so just clamp.
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

  // updateThumbValue (UseSliderInteraction) enforces this gap during drags,
  // but a controlled modelValue or a reactive min/max/step/minGapSteps change
  // bypasses that — this is what keeps those paths honoring the same gap.
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

  // Every value entering internalValues funnels through here (mount,
  // controlled modelValue changes, reactive min/max/step/minGapSteps changes)
  // so they all get the same guarantees — otherwise an out-of-contract value
  // would split the native input, aria-valuetext, and visual thumb into three
  // disagreeing states.
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

  // The WAI-ARIA multi-thumb pattern requires each thumb's aria-valuemin/max
  // to reflect the OTHER thumb's current position, not a static [min, max] —
  // the low thumb can never reach past (high - gap), and vice versa. Guarded
  // on internalValues having a second thumb at all, not just isRange — an
  // out-of-contract single-element modelValue in range mode must not apply a
  // gap against a thumb that doesn't exist.
  function thumbNativeMin(i) {
    if (!isRange.value || i !== 1 || internalValues.value.length < 2) return props.min;
    const gap = props.minGapSteps * props.step;
    return Math.min(props.max, internalValues.value[0] + gap);
  }

  function thumbNativeMax(i) {
    if (!isRange.value || i !== 0 || internalValues.value.length < 2) return props.max;
    const gap = props.minGapSteps * props.step;
    return Math.max(props.min, internalValues.value[1] - gap);
  }

  // internalValues is always on-grid except for one deliberate case: an
  // active magnetic snap point (UseSliderMagneticSnap) intentionally holds an
  // off-grid value while dragging. step="any" for just that thumb, only while
  // off-grid, keeps the browser from fighting it without losing native
  // Home/End/Arrow stepping the rest of the time.
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
        // An externally-driven value is already "committed" — without this,
        // the next blur sees a spurious diff against a stale lastCommittedValues
        // and fires a false change event.
        lastCommittedValues.value = [...next];
      }
      // normalizeModelValue can rewrite what was passed in (inverted pair,
      // out-of-bounds clamp, invalid length) — that correction must reach the
      // parent's own v-model, or it stays silently out of sync. Safe against
      // feedback loops since normalizeModelValue is idempotent.
      const incoming = Array.isArray(newVal) ? newVal : [newVal];
      const needsCorrection = next.length !== incoming.length || next.some((v, i) => v !== incoming[i]);
      if (needsCorrection) {
        emit('update:modelValue', Array.isArray(newVal) ? [...next] : next[0]);
      }
    },
    { deep: true },
  );

  // Narrowing [min, max], step, or minGapSteps without touching modelValue
  // never fires the watcher above — re-apply the full constraint pipeline so
  // the value can't silently drift out of bounds, off-grid, or inside a
  // now-invalid gap.
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
  // rewritten starting value back to the parent the same way a later update
  // would, so v-model isn't out of sync from the first paint.
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
    snapToStep,
    thumbPercent,
    thumbNativeMin,
    thumbNativeMax,
    thumbNativeStep,
    formatValue,
  };
}
