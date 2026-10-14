import { ref, computed, watch, onMounted } from 'vue';

// Normalizes a possibly-uncontrolled, out-of-contract modelValue into
// internalValues — clamped, step-snapped, range-ordered, gap-enforced. isRange
// is prop-derived state, not value normalization, so it's passed in rather
// than owned here.
export function useSliderValue(props, emit, { isRange, activeSnapValue }) {
  // Whether thumbIndex currently holds an active magnetic snap at exactly
  // its present value — reapplying step/gap constraints to it would destroy
  // the (intentionally off-grid) hold for no reason; held values are already
  // clamped within [min, max] by findMagneticSnapPoint itself.
  function isActivelyHeld(thumbIndex, val) {
    return activeSnapValue?.value[thumbIndex] === val;
  }
  // JS stringifies a tiny number in exponential notation ("5e-7", not
  // "0.0000005") — no "." for the plain branch below to find, so this used
  // to report 0 decimal places and silently truncate valid tiny values.
  function decimalPlaces(n) {
    const str = String(n);
    const eIndex = str.search(/e/i);
    if (eIndex !== -1) {
      const mantissa = str.slice(0, eIndex);
      const exponent = parseInt(str.slice(eIndex + 1), 10);
      const mantissaDot = mantissa.indexOf('.');
      const mantissaDecimals = mantissaDot === -1 ? 0 : mantissa.length - mantissaDot - 1;
      return Math.max(0, mantissaDecimals - exponent);
    }
    const dot = str.indexOf('.');
    return dot === -1 ? 0 : str.length - dot - 1;
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
    // Rounded — minGapSteps is a COUNT of steps; a fractional value would
    // make the gap not an exact multiple of props.step, breaking the
    // on-grid guarantee every other value in this file relies on.
    const gap = Math.round(props.minGapSteps) * props.step;
    if (gap <= 0) return values;
    let [lo, hi] = values;
    if (hi - lo >= gap) return values;
    // Try widening hi alone first (lo stays put) — the common case. Failing
    // that (it'd overshoot max), shrink lo alone instead of always pinning hi
    // at max: that could freeze a thumb's native min === max even when a
    // less disruptive pair existed, e.g. max=95, step=10, gap=20: [80,90]
    // became [75,95] (frozen) instead of [70,90]. Only pin hi at max when
    // neither single-ended fix fits the domain at all (dev-warned elsewhere).
    if (lo + gap <= props.max) {
      hi = lo + gap;
    } else if (hi - gap >= props.min) {
      lo = hi - gap;
    } else {
      hi = props.max;
      lo = Math.max(props.min, hi - gap);
    }
    // Precision must include max's own decimal places — a hi pinned exactly
    // at a fractional max (e.g. 0.96) rounding at a coarser precision could
    // push it back out of bounds. The clamp after rounding is a second guard
    // against that and ordinary float drift.
    const dp = Math.max(decimalPlaces(props.min), decimalPlaces(props.max), decimalPlaces(props.step));
    lo = Math.min(props.max, Math.max(props.min, parseFloat(lo.toFixed(dp))));
    hi = Math.min(props.max, Math.max(props.min, parseFloat(hi.toFixed(dp))));
    return [lo, hi];
  }

  // Every value entering internalValues funnels through here (mount,
  // controlled modelValue changes, reactive min/max/step/minGapSteps changes)
  // so they all get the same guarantees — otherwise an out-of-contract value
  // would split the native input, aria-valuetext, and visual thumb into three
  // disagreeing states.
  function applyValueConstraints(values) {
    // A non-finite element (NaN, or a non-numeric value coerced to NaN)
    // would otherwise propagate through Math.min/Math.max in enforceRangeGap
    // and contaminate the OTHER thumb's value too — replace it before
    // anything downstream can see it.
    let out = values
      .map((v) => (Number.isFinite(v) ? v : defaultValue()))
      .map(clampToRange)
      .map(snapToStep);
    out = out.length === 2 ? normalizeRangeValues(out) : out;
    return enforceRangeGap(out);
  }

  // Matches native <input type="range">, which defaults an unset value to the
  // midpoint of its range rather than min.
  function defaultValue() {
    return (props.min + props.max) / 2;
  }

  function normalizeModelValue(value) {
    let raw;
    if (Array.isArray(value)) {
      raw = value.length >= 2 ? [value[0], value[1]] : value.length === 1 ? [value[0]] : [defaultValue()];
    } else {
      raw = value !== undefined && value !== null ? [value] : [defaultValue()];
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

  // Rounds a bound derived from a (possibly off-grid, e.g. an actively held
  // magnetic snap — see thumbNativeStep below) sibling value onto the real
  // step grid, always stricter (min rounds up, max rounds down) so the
  // crossing-prevention guarantee only tightens, never loosens. Without
  // this, native stepMismatch (computed from the input's own min attribute,
  // not props.min) became permanently unsatisfiable for the other thumb.
  // Nothing reachable is lost — the gap between raw and rounded was never
  // on-grid anyway.
  function toGridBound(val, roundUp) {
    if (props.step <= 0) return val;
    const stepsFromMin = (val - props.min) / props.step;
    const rounded = roundUp ? Math.ceil(stepsFromMin - 1e-9) : Math.floor(stepsFromMin + 1e-9);
    return props.min + rounded * props.step;
  }

  // The WAI-ARIA multi-thumb pattern requires each thumb's aria-valuemin/max
  // to reflect the OTHER thumb's current position, not a static [min, max] —
  // the low thumb can never reach past (high - gap), and vice versa. Guarded
  // on internalValues having a second thumb at all, not just isRange — an
  // out-of-contract single-element modelValue in range mode must not apply a
  // gap against a thumb that doesn't exist.
  function thumbNativeMin(i) {
    if (!isRange.value || i !== 1 || internalValues.value.length < 2) return props.min;
    const gap = Math.round(props.minGapSteps) * props.step;
    const raw = Math.min(props.max, internalValues.value[0] + gap);
    return Math.min(props.max, toGridBound(raw, true));
  }

  function thumbNativeMax(i) {
    if (!isRange.value || i !== 0 || internalValues.value.length < 2) return props.max;
    const gap = Math.round(props.minGapSteps) * props.step;
    const raw = Math.max(props.min, internalValues.value[1] - gap);
    return Math.max(props.min, toGridBound(raw, false));
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

  // Logged at most once per mount — formatValue runs on every render path
  // (aria-valuetext, every readout style), so an unconditional console.info
  // would flood the console for the whole lifetime of a drag if getValueText
  // keeps misbehaving on every call.
  let hasWarnedGetValueText = false;
  function warnGetValueTextOnce(message) {
    if (process.env.NODE_ENV === 'production' || hasWarnedGetValueText) return;
    hasWarnedGetValueText = true;
    console.info(`[Dialtone] DtSlider: ${message}`);
  }

  // Shared by the readout and each thumb's aria-valuetext, so the two always
  // agree on how a value is displayed. Deliberately NOT used for a mark's own
  // auto-generated text — see formatMarkValue (UseSliderMarksAndTicks).
  function formatValue(value, index) {
    if (props.getValueText) {
      try {
        const text = props.getValueText(value, index);
        // A non-string return (e.g. an async getValueText's Promise) would
        // otherwise render literally — String(aPromise) is "[object Promise]".
        if (typeof text === 'string') return text;
        warnGetValueTextOnce(`getValueText must return a string synchronously (got ${typeof text}) — falling back to the raw value.`);
      } catch (e) {
        // An uncaught throw here would crash the whole component, not just
        // degrade one value's text.
        warnGetValueTextOnce(`getValueText threw — falling back to the raw value. ${e}`);
      }
    }
    return `${props.prefix}${value}${props.suffix}`;
  }

  // ─── Sync controlled modelValue → internalValues ──────────────────────────

  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal === undefined || newVal === null) return;
      const current = internalValues.value;
      const incoming = Array.isArray(newVal) ? newVal : [newVal];
      // A held magnetic snap is intentionally off-grid — normalizeModelValue
      // doesn't know that and re-snaps it onto the step grid regardless. If
      // the parent simply echoed back exactly what we just emitted (the
      // common v-model round trip), there's nothing to correct; restore the
      // held value so the echo doesn't silently destroy the hold.
      const next = normalizeModelValue(newVal).map((v, i) => (
        incoming[i] === current[i] && isActivelyHeld(i, current[i]) ? current[i] : v
      ));
      if (next.length !== current.length || next.some((v, i) => v !== current[i])) {
        // internalValues already diverged from lastCommittedValues means a
        // drag/keyboard interaction is mid-flight and this echo is just our
        // own uncommitted change bouncing back through v-model — overwriting
        // lastCommittedValues here would make that interaction's own commit
        // (commitIfChanged) see no diff and swallow its change event.
        const alreadyUncommitted = current.length !== lastCommittedValues.value.length
          || current.some((v, i) => v !== lastCommittedValues.value[i]);
        internalValues.value = next;
        // An externally-driven value is already "committed" — without this,
        // the next blur sees a spurious diff against a stale lastCommittedValues
        // and fires a false change event.
        if (!alreadyUncommitted) {
          lastCommittedValues.value = [...next];
        }
      }
      // normalizeModelValue can rewrite what was passed in (inverted pair,
      // out-of-bounds clamp, invalid length) — that correction must reach the
      // parent's own v-model, or it stays silently out of sync. Safe against
      // feedback loops since normalizeModelValue is idempotent.
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
      const cur = internalValues.value;
      // If internalValues already differed from lastCommittedValues before
      // this correction, a drag/keyboard interaction is already mid-flight
      // with its own uncommitted delta — this correction is just an
      // intermediate waypoint in that gesture, not a standalone change, so it
      // must not emit 'change' ahead of the interaction's own eventual
      // commit (pointer up / blur).
      const alreadyUncommitted = cur.length !== lastCommittedValues.value.length
        || cur.some((v, i) => v !== lastCommittedValues.value[i]);
      // Same hold-preserving exception as the modelValue watcher above — a
      // held value still within the (possibly just-changed) [min, max]
      // bounds shouldn't be re-snapped onto the grid just because an
      // unrelated reactive prop changed mid-drag.
      const next = applyValueConstraints(cur).map((v, i) => (
        isActivelyHeld(i, cur[i]) && cur[i] >= props.min && cur[i] <= props.max ? cur[i] : v
      ));
      if (next.length !== cur.length || next.some((v, i) => v !== cur[i])) {
        internalValues.value = next;
        const payload = isRange.value ? [...next] : next[0];
        emit('update:modelValue', payload);
        if (alreadyUncommitted) return;
        // Unlike the controlled-modelValue watch above, this correction is
        // never something the parent explicitly requested — it's a real,
        // committed change the parent needs to know about (e.g. to persist),
        // not an intermediate drag state. Without this, lastCommittedValues
        // below having already moved on meant the actual transition from the
        // previous value was never reported via 'change' at all.
        lastCommittedValues.value = [...next];
        emit('change', payload);
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
