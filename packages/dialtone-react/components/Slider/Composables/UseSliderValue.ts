import { useLayoutEffect, useRef } from 'react';
import { isDevelopment } from '../../../common/dev';
import type { ActiveSnapValues } from './UseSliderMagneticSnap';
import { useSyncedState } from './useSyncedState';
import type { ResolvedSliderProps, SliderEmit, SliderValue, SyncedState } from './types';

export interface SliderValueState {
  internalValues: SyncedState<number[]>;
  lastCommittedValues: { current: number[] };
  currentValue: SliderValue;
  decimalPlaces: (n: number) => number;
  snapToStep: (val: number) => number;
  thumbPercent: (val: number) => number;
  thumbNativeMin: (i: number) => number;
  thumbNativeMax: (i: number) => number;
  thumbNativeStep: (i: number) => number | 'any';
  formatValue: (value: number, index: number) => string;
}

// JS stringifies a tiny number in exponential notation ("5e-7", not
// "0.0000005") — no "." for the plain branch below to find, so this used
// to report 0 decimal places and silently truncate valid tiny values.
export function decimalPlaces (n: number): number {
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

function sameList (a: readonly unknown[], b: readonly unknown[]): boolean {
  return a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
}

/** Vue's deep watcher on modelValue, as a value comparison: the same number, or arrays with the same entries. */
function sameModelValue (a: SliderValue | null | undefined, b: SliderValue | null | undefined): boolean {
  if (Array.isArray(a) && Array.isArray(b)) return sameList(a, b);
  return Object.is(a, b);
}

function differs (a: readonly number[], b: readonly number[]): boolean {
  return a.length !== b.length || a.some((v, i) => v !== b[i]);
}

// The value-normalizing half of Vue's useSliderValue, as plain functions of
// the current props: clamped, step-snapped, range-ordered, gap-enforced.
export function sliderValueMath (props: ResolvedSliderProps, activeSnapValue: { current: ActiveSnapValues }) {
  // Whether thumbIndex currently holds an active magnetic snap at exactly
  // its present value — reapplying step/gap constraints to it would destroy
  // the (intentionally off-grid) hold for no reason.
  function isActivelyHeld (thumbIndex: number, val: number): boolean {
    return activeSnapValue.current[thumbIndex] === val;
  }

  function clampToRange (val: number): number {
    return Math.min(props.max, Math.max(props.min, val));
  }

  // Without this, an off-grid value (from a controlled value or a magnetic
  // snap point) gets silently rounded by the browser the moment it hits the
  // native input's .value. A non-positive step has no valid grid, so just clamp.
  function snapToStep (val: number): number {
    if (props.step <= 0) return Math.min(props.max, Math.max(props.min, val));
    const steps = Math.round((val - props.min) / props.step);
    const dp = Math.max(decimalPlaces(props.min), decimalPlaces(props.step));
    return Math.min(props.max, Math.max(props.min, parseFloat((props.min + steps * props.step).toFixed(dp))));
  }

  // The low thumb's value can never exceed the high thumb's — swap rather than
  // clamp so an inverted pair still keeps its intended width.
  function normalizeRangeValues (values: number[]): number[] {
    if (values.length === 2 && values[0] > values[1]) {
      return [values[1], values[0]];
    }
    return values;
  }

  // updateThumbValue (UseSliderInteraction) enforces this gap during drags,
  // but a controlled value or a min/max/step/minGapSteps change bypasses that.
  // heldIndex marks a thumb whose value must be treated as a FIXED anchor —
  // an actively-held magnetic snap, deliberately off-grid.
  function enforceRangeGap (values: number[], heldIndex: number | null = null): number[] {
    if (values.length !== 2) return values;
    // Rounded — minGapSteps is a COUNT of steps.
    const gap = Math.round(props.minGapSteps) * props.step;
    if (gap <= 0) return values;
    let [lo, hi] = values;
    if (hi - lo >= gap) return values;
    if (heldIndex === 0) {
      hi = Math.min(props.max, lo + gap);
    } else if (heldIndex === 1) {
      lo = Math.max(props.min, hi - gap);
    } else if (lo + gap <= props.max) {
      // Try widening hi alone first (lo stays put) — the common case.
      hi = lo + gap;
    } else if (hi - gap >= props.min) {
      // Failing that, shrink lo alone instead of always pinning hi at max.
      lo = hi - gap;
    } else {
      // Neither single-ended fix fits the domain at all (dev-warned
      // elsewhere) — only then fall back to pinning hi at max.
      hi = props.max;
      lo = Math.max(props.min, hi - gap);
    }
    // Precision must include max's own decimal places, and a held value's,
    // whose precision isn't bound by min/max/step at all.
    const dp = Math.max(
      decimalPlaces(props.min), decimalPlaces(props.max), decimalPlaces(props.step),
      heldIndex !== null ? decimalPlaces(values[heldIndex]) : 0,
    );
    if (heldIndex !== 0) lo = Math.min(props.max, Math.max(props.min, parseFloat(lo.toFixed(dp))));
    if (heldIndex !== 1) hi = Math.min(props.max, Math.max(props.min, parseFloat(hi.toFixed(dp))));
    return [lo, hi];
  }

  // Matches native <input type="range">, which defaults an unset value to the
  // midpoint of its range rather than min.
  function defaultValue (): number {
    return (props.min + props.max) / 2;
  }

  // Every value entering internalValues funnels through here (mount,
  // controlled value changes, min/max/step/minGapSteps changes) so they all
  // get the same guarantees. heldIndex skips clamping/snapping for that index.
  function applyValueConstraints (values: number[], heldIndex: number | null = null): number[] {
    // A non-finite element would otherwise propagate through Math.min/Math.max
    // in enforceRangeGap and contaminate the OTHER thumb's value too.
    let out = values.map((v, i) => (i === heldIndex ? v : (Number.isFinite(v) ? v : defaultValue())));
    out = out.map((v, i) => (i === heldIndex ? v : clampToRange(v)));
    out = out.map((v, i) => (i === heldIndex ? v : snapToStep(v)));
    // A held index can't meaningfully swap sides with its sibling.
    out = out.length === 2 && heldIndex === null ? normalizeRangeValues(out) : out;
    return enforceRangeGap(out, heldIndex);
  }

  function normalizeModelValue (value: SliderValue | null | undefined, heldIndex: number | null = null): number[] {
    let raw: number[];
    if (Array.isArray(value)) {
      raw = value.length >= 2 ? [value[0], value[1]] : value.length === 1 ? [value[0]] : [defaultValue()];
    } else {
      raw = value !== undefined && value !== null ? [value] : [defaultValue()];
    }
    return applyValueConstraints(raw, heldIndex);
  }

  function thumbPercent (val: number): number {
    // A degenerate min === max range has no meaningful position — avoid a
    // division by zero that would otherwise produce NaN.
    if (props.max === props.min) return 0;
    return ((val - props.min) / (props.max - props.min)) * 100;
  }

  // Rounds a bound derived from a (possibly off-grid) sibling value onto the
  // real step grid, always stricter (min rounds up, max rounds down).
  function toGridBound (val: number, roundUp: boolean): number {
    if (props.step <= 0) return val;
    const stepsFromMin = (val - props.min) / props.step;
    const rounded = roundUp ? Math.ceil(stepsFromMin - 1e-9) : Math.floor(stepsFromMin + 1e-9);
    return props.min + rounded * props.step;
  }

  return {
    isActivelyHeld,
    snapToStep,
    applyValueConstraints,
    normalizeModelValue,
    thumbPercent,
    toGridBound,
  };
}

// Normalizes a possibly-uncontrolled, out-of-contract value into
// internalValues — clamped, step-snapped, range-ordered, gap-enforced.
export function useSliderValue (
  props: ResolvedSliderProps,
  emit: SliderEmit,
  { isRange, activeSnapValue }: { isRange: boolean; activeSnapValue: { current: ActiveSnapValues } },
): SliderValueState {
  const math = sliderValueMath(props, activeSnapValue);
  const { isActivelyHeld, snapToStep, applyValueConstraints, normalizeModelValue, thumbPercent, toGridBound } = math;

  const internalValues = useSyncedState(() => normalizeModelValue(props.value));
  const lastCommittedValues = useRef<number[]>([...internalValues.ref.current]);
  const values = internalValues.value;

  // Mirrors the onValueChange payload shape (number, or number[] in range
  // mode) so a custom label render prop can show the live value while dragging.
  const currentValue: SliderValue = isRange ? [...values] : values[0];

  // The WAI-ARIA multi-thumb pattern requires each thumb's aria-valuemin/max
  // to reflect the OTHER thumb's current position, not a static [min, max].
  function thumbNativeMin (i: number): number {
    if (!isRange || i !== 1 || values.length < 2) return props.min;
    const gap = Math.round(props.minGapSteps) * props.step;
    const raw = Math.min(props.max, values[0] + gap);
    return Math.min(props.max, toGridBound(raw, true));
  }

  function thumbNativeMax (i: number): number {
    if (!isRange || i !== 0 || values.length < 2) return props.max;
    const gap = Math.round(props.minGapSteps) * props.step;
    const raw = Math.max(props.min, values[1] - gap);
    return Math.max(props.min, toGridBound(raw, false));
  }

  // internalValues is always on-grid except for an active magnetic snap
  // point, which intentionally holds an off-grid value while dragging.
  // step="any" for just that thumb, only while off-grid.
  function thumbNativeStep (i: number): number | 'any' {
    if (props.step <= 0) return 'any';
    const val = values[i];
    if (val === undefined) return props.step;
    const stepsFromMin = (val - props.min) / props.step;
    const isOffGrid = Math.abs(stepsFromMin - Math.round(stepsFromMin)) > 1e-9;
    return isOffGrid ? 'any' : props.step;
  }

  // Logged at most once per mount — formatValue runs on every render path,
  // so an unconditional console.info would flood the console during a drag.
  const hasWarnedGetValueText = useRef(false);
  function warnGetValueTextOnce (message: string) {
    if (!isDevelopment() || hasWarnedGetValueText.current) return;
    hasWarnedGetValueText.current = true;
    console.info(`[Dialtone] DtSlider: ${message}`);
  }

  // Shared by the readout and each thumb's aria-valuetext, so the two always
  // agree on how a value is displayed. Deliberately NOT used for a mark's own
  // auto-generated text — see formatMarkValue (UseSliderMarksAndTicks).
  function formatValue (value: number, index: number): string {
    if (props.getValueText) {
      try {
        const text = props.getValueText(value, index);
        // A non-string return (e.g. an async getValueText's Promise) would
        // otherwise render literally.
        if (typeof text === 'string') return text;
        warnGetValueTextOnce(
          `getValueText must return a string synchronously (got ${typeof text}) — falling back to the raw value.`,
        );
      } catch (e) {
        // An uncaught throw here would crash the whole component.
        warnGetValueTextOnce(`getValueText threw — falling back to the raw value. ${e}`);
      }
    }
    return `${props.prefix}${value}${props.suffix}`;
  }

  // Vue's two watchers, compared against what this hook last saw. Layout
  // effects, so a correction renders before paint, as Vue's pre-flush
  // watchers do.
  const seenValue = useRef(props.value);
  const bounds = [props.min, props.max, props.step, props.minGapSteps];
  const seenBounds = useRef(bounds);
  useLayoutEffect(() => {
    // ─── Sync controlled value → internalValues ────────────────────────────
    if (!sameModelValue(seenValue.current, props.value)) {
      seenValue.current = props.value;
      const newVal = props.value;
      if (newVal !== undefined && newVal !== null) {
        const current = internalValues.ref.current;
        const incoming = Array.isArray(newVal) ? newVal : [newVal];
        // A held magnetic snap is intentionally off-grid. If the parent simply
        // echoed back exactly what we just emitted, there's nothing to correct.
        const heldIndex = current.findIndex((v, i) => incoming[i] === v && isActivelyHeld(i, v));
        const next = normalizeModelValue(newVal, heldIndex === -1 ? null : heldIndex);
        if (differs(next, current)) {
          // internalValues already diverged from lastCommittedValues means an
          // interaction is mid-flight and this echo is our own uncommitted
          // change bouncing back — overwriting lastCommittedValues here would
          // swallow that interaction's own commit.
          const alreadyUncommitted = differs(current, lastCommittedValues.current);
          internalValues.set(next);
          // An externally-driven value is already "committed".
          if (!alreadyUncommitted) {
            lastCommittedValues.current = [...next];
          }
        }
        // The normalized value can differ from what was passed in (inverted
        // pair, out-of-bounds clamp, invalid length) — that correction must
        // reach the parent, or it stays silently out of sync.
        if (differs(next, incoming)) {
          emit.valueChange(Array.isArray(newVal) ? [...next] : next[0]);
        }
      }
    }

    // ─── Re-apply constraints when min/max/step/minGapSteps change ─────────
    if (!sameList(seenBounds.current, bounds)) {
      seenBounds.current = bounds;
      const cur = internalValues.ref.current;
      // A gesture already mid-flight owns its own commit; this correction is
      // just an intermediate waypoint in it.
      const alreadyUncommitted = differs(cur, lastCommittedValues.current);
      const heldIndex = cur.findIndex((v, i) => isActivelyHeld(i, v) && v >= props.min && v <= props.max);
      const next = applyValueConstraints(cur, heldIndex === -1 ? null : heldIndex);
      if (differs(next, cur)) {
        internalValues.set(next);
        // Each callback gets its own array, so one mutating its argument can't change what the other sees.
        emit.valueChange(isRange ? [...next] : next[0]);
        if (!alreadyUncommitted) {
          // Never something the parent asked for — a real, committed change
          // the parent needs to know about (e.g. to persist).
          lastCommittedValues.current = [...next];
          emit.valueCommit(isRange ? [...next] : next[0]);
        }
      }
    }
  });

  // The initial value never runs through the watcher above — correct a
  // rewritten starting value back to the parent the same way a later update
  // would. Once per instance, as Vue's onMounted.
  const correctedOnMount = useRef(false);
  useLayoutEffect(() => {
    if (correctedOnMount.current) return;
    correctedOnMount.current = true;
    const initial = seenValue.current;
    if (initial === undefined || initial === null) return;
    const incoming = Array.isArray(initial) ? initial : [initial];
    const next = internalValues.ref.current;
    if (differs(next, incoming)) {
      emit.valueChange(Array.isArray(initial) ? [...next] : next[0]);
    }
    // Mount only, so no dependencies: later values go through the watcher above.
  }, []);

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
