import { useLayoutEffect, useRef, type ChangeEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { measureEdgeInsetPx } from '../utils';
import type { ActiveSnapValues } from './UseSliderMagneticSnap';
import { useSyncedState } from './useSyncedState';
import type { ResolvedSliderProps, SliderEmit, SyncedState } from './types';

// Keys that actually navigate the thumb's value (natively or via
// largeStepDelta below) — used to scope the Escape-dismissal reopen to real
// navigation, not every keydown the thumb receives.
const THUMB_NAV_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown',
]);

/** The fields of a pointer event the drag reads; a real pointerup/pointercancel always has them. */
type SliderPointerEvent = Pick<PointerEvent, 'pointerId' | 'pointerType' | 'button' | 'buttons' | 'clientX' | 'clientY'>
  & { preventDefault: () => void };

export interface SliderInteraction {
  isDragging: boolean;
  activeThumbIndex: number | null;
  focusedThumbIndex: number | null;
  onPointerDown: (event: SliderPointerEvent) => void;
  onPointerMove: (event: SliderPointerEvent) => void;
  onPointerUp: (event?: Pick<PointerEvent, 'pointerId'>) => void;
  onThumbInput: (i: number, event: ChangeEvent<HTMLInputElement>) => void;
  onThumbKeydown: (i: number, event: KeyboardEvent<HTMLInputElement>) => void;
  onThumbFocus: (i: number) => void;
  onThumbBlur: (i: number) => void;
  onThumbHitPointerEnter: (i: number) => void;
  onThumbHitPointerLeave: (i: number) => void;
  isReadoutOpen: (i: number) => boolean;
}

// Pointer drag, native keyboard events, focus/hover tracking, and the
// interactive value-update path (updateThumbValue/commitIfChanged) — as
// opposed to UseSliderValue's normalization of externally-driven changes.
export function useSliderInteraction (props: ResolvedSliderProps, emit: SliderEmit, {
  controlEl,
  thumbEls,
  internalValues,
  isRange,
  isVertical,
  decimalPlaces,
  snapToStep,
  lastCommittedValues,
  findMagneticSnapPoint,
  activeSnapValue,
  isRtl,
}: {
  controlEl: HTMLElement | null;
  thumbEls: { current: (HTMLInputElement | null)[] };
  internalValues: SyncedState<number[]>;
  isRange: boolean;
  isVertical: boolean;
  decimalPlaces: (n: number) => number;
  snapToStep: (val: number) => number;
  lastCommittedValues: { current: number[] };
  findMagneticSnapPoint: (rawVal: number, thumbIndex: number) => number | null;
  activeSnapValue: { current: ActiveSnapValues };
  isRtl: boolean;
}): SliderInteraction {
  const isDragging = useSyncedState(false);
  const activeThumbIndex = useSyncedState<number | null>(null);
  // Unlike activeThumbIndex (cleared on pointerup so the --active visual class
  // turns off), this persists across drags — it's what lets a pointerdown on
  // two coincident thumbs route to whichever one wasn't grabbed last time.
  const lastActiveThumbIndex = useRef<number | null>(null);
  const focusedThumbIndex = useSyncedState<number | null>(null);
  const hoveredThumbIndex = useSyncedState<number | null>(null);
  // Escape's job is "suppress until the next real show-trigger", not "turn
  // off forever" — tracked separately and cleared by whichever handler fires
  // on the next genuine trigger.
  const escapeDismissedIndex = useSyncedState<number | null>(null);
  // Set synchronously right before a pointer-driven focus() call and
  // read/cleared synchronously in the focus handler it triggers.
  const isPointerFocus = useRef(false);
  // Which pointer owns the current drag. setPointerCapture only retargets
  // POINTER events for this pointerId; an unrelated second pointer still
  // reaches the same listeners.
  const activePointerId = useRef<number | null>(null);
  // Whether THIS drag's own pointerdown landed on an already-coincident pair,
  // the only case resolveCoincidentHandoff should apply in.
  const dragStartedCoincident = useRef(false);
  // Whether the high thumb's native input holds DOM focus — Vue reads
  // document.activeElement before the unmount, which React has already done
  // by the time an effect runs.
  const highThumbHasFocus = useRef(false);

  // A consumer can flip disabled while a thumb is focused or hovered — the
  // native input's own focus ring clears automatically, but these are
  // separate internal state (also driving the tooltip readout).
  const seenDisabled = useRef(props.disabled);
  // A controlled value switching from range to single mode unmounts thumb
  // index 1's native input. If it held focus, restore it to the one
  // remaining thumb.
  const seenLength = useRef(internalValues.value.length);
  useLayoutEffect(() => {
    if (seenDisabled.current !== props.disabled) {
      seenDisabled.current = props.disabled;
      if (props.disabled) {
        focusedThumbIndex.set(null);
        hoveredThumbIndex.set(null);
      }
    }
    const newLength = internalValues.value.length;
    const oldLength = seenLength.current;
    if (newLength !== oldLength) {
      seenLength.current = newLength;
      // focusedThumbIndex alone misses a pointer-driven drag — onPointerDown
      // deliberately never sets it — so real DOM focus is a second signal.
      const wasFocused = focusedThumbIndex.ref.current === 1 || highThumbHasFocus.current;
      if (newLength === 1 && oldLength === 2 && wasFocused) {
        highThumbHasFocus.current = false;
        thumbEls.current[0]?.focus();
      }
      // An external update mid-drag can shrink internalValues below the
      // thumb being dragged. isDragging is left alone; the eventual
      // pointerup/pointercancel still arrives and ends it normally.
      if (activeThumbIndex.ref.current !== null && activeThumbIndex.ref.current >= newLength) {
        activeThumbIndex.set(null);
      }
    }
  });

  // ─── Value update ─────────────────────────────────────────────────────────

  function updateThumbValue (thumbIndex: number, newVal: number, { allowSnap = false } = {}) {
    let clamped = Math.min(props.max, Math.max(props.min, newVal));
    const magneticValue = allowSnap ? findMagneticSnapPoint(clamped, thumbIndex) : null;
    clamped = magneticValue ?? snapToStep(clamped);

    const next = [...internalValues.ref.current];

    if (isRange) {
      // The low thumb can never pass the high thumb (and vice versa) — they
      // may only meet. Clamped to 0 — a negative minGapSteps would otherwise
      // flip the sign below and invert the crossing clamp. Rounded —
      // minGapSteps is a COUNT of steps.
      const gap = Math.max(0, Math.round(props.minGapSteps) * props.step);
      if (thumbIndex === 0) {
        clamped = Math.min(clamped, (next[1] ?? props.max) - gap);
      } else {
        clamped = Math.max(clamped, (next[0] ?? props.min) + gap);
      }

      // Whether the crossing clamp above left an active magnetic snap point
      // untouched — if so, keep that exact (deliberately off-grid) value.
      const heldMagneticValue = magneticValue != null && clamped === magneticValue;
      if (!heldMagneticValue) {
        // gap is a product of two decimals and can carry IEEE-754 noise.
        const dp = Math.max(decimalPlaces(props.min), decimalPlaces(props.step));
        clamped = parseFloat(clamped.toFixed(dp));
        clamped = Math.min(props.max, Math.max(props.min, clamped));
      }

      // The crossing clamp can pull the thumb away from the magnetic point
      // findMagneticSnapPoint just latched onto — clear it so the next move
      // re-evaluates fresh instead of freezing the thumb.
      if (magneticValue != null && clamped !== magneticValue) {
        delete activeSnapValue.current[thumbIndex];
      }
    }

    if (next[thumbIndex] === clamped) {
      // Nothing logically changed, but a native keyboard step may have already
      // written a different value into the native input's own DOM .value.
      const el = thumbEls.current[thumbIndex];
      if (el && el.value !== String(clamped)) {
        el.value = String(clamped);
      }
      return;
    }
    next[thumbIndex] = clamped;
    internalValues.set(next);

    const payload = isRange ? [...next] : next[0];
    emit.valueChange(payload);
  }

  function commitIfChanged () {
    const cur = internalValues.ref.current;
    const last = lastCommittedValues.current;
    const changed = cur.length !== last.length || cur.some((v, i) => v !== last[i]);
    if (!changed) return;
    lastCommittedValues.current = [...cur];
    const payload = isRange ? [...cur] : cur[0];
    emit.valueCommit(payload);
  }

  // ─── Pointer drag ─────────────────────────────────────────────────────────

  // Resolved once per gesture (onPointerDown), not on every pointermove.
  const cachedEdgeInsetPx = useRef(0);

  function getValueFromPointerEvent (event: SliderPointerEvent, el: HTMLElement): number {
    const rect = el.getBoundingClientRect();
    const sizePx = isVertical ? rect.height : rect.width;
    // Mirrors anchorPct's own inset band (UseSliderGeometry) — the thumb's
    // rendered position is compressed into [inset, size - inset], so the
    // inverse (pointer position -> value) applies the same compression.
    const inset = cachedEdgeInsetPx.current;
    const span = sizePx - 2 * inset;
    let pct;
    if (isVertical) {
      // Distance from the bottom edge — matches thumbPositionStyle's own
      // `bottom: anchorPct(pct)`.
      const rawPx = rect.bottom - event.clientY;
      pct = span > 0 ? (rawPx - inset) / span : rawPx / sizePx;
    } else {
      const rawPx = event.clientX - rect.left;
      pct = span > 0 ? (rawPx - inset) / span : rawPx / sizePx;
      // clientX is always a physical coordinate, so the pointer-to-value
      // mapping mirrors by hand under dir="rtl".
      if (isRtl) pct = 1 - pct;
    }
    pct = Math.min(1, Math.max(0, pct));
    return props.min + pct * (props.max - props.min);
  }

  function getNearestThumbIndex (val: number): number {
    const values = internalValues.ref.current;
    if (!isRange || values.length < 2) return 0;
    const [lo, hi] = values;
    if (lo === hi) {
      // When thumbs overlap, route to the one opposite last-active
      return lastActiveThumbIndex.current === 0 ? 1 : 0;
    }
    return Math.abs(val - lo) <= Math.abs(val - hi) ? 0 : 1;
  }

  // Only meaningful when a drag STARTS on a coincident pair — which thumb that
  // initial touch means to grab is ambiguous. Hands off to the sibling, which
  // this same move CAN actually satisfy.
  function resolveCoincidentHandoff (idx: number, rawVal: number): number {
    if (!isRange) return idx;
    const [lo, hi] = internalValues.ref.current;
    if (lo !== hi) return idx;
    if (idx === 0 && rawVal > lo) return 1;
    if (idx === 1 && rawVal < hi) return 0;
    return idx;
  }

  function onPointerDown (event: SliderPointerEvent) {
    if (props.disabled || !controlEl) return;
    // Only handle primary pointer button
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    // A second pointer touching down mid-drag must not steal ownership.
    if (isDragging.ref.current && event.pointerId !== activePointerId.current) return;

    // Suppresses the browser's native mousedown default action, which would
    // otherwise shift focus after our own focus() call below runs.
    event.preventDefault();

    cachedEdgeInsetPx.current = measureEdgeInsetPx(controlEl);

    const rawVal = getValueFromPointerEvent(event, controlEl);
    const idx = getNearestThumbIndex(rawVal);
    const values = internalValues.ref.current;
    const [lo, hi] = values;
    dragStartedCoincident.current = isRange && values.length === 2 && lo === hi;

    if (escapeDismissedIndex.ref.current === idx) escapeDismissedIndex.set(null);
    activeThumbIndex.set(idx);
    lastActiveThumbIndex.current = idx;
    isDragging.set(true);
    activePointerId.current = event.pointerId;
    controlEl.setPointerCapture(event.pointerId);
    // Pointer capture routes every subsequent pointer event to the control,
    // so the non-dragged thumb's own pointerleave never fires again once the
    // drag starts.
    hoveredThumbIndex.set(null);

    updateThumbValue(idx, rawVal, { allowSnap: true });
    // Marks the focus() below as pointer-driven so onThumbFocus skips the
    // keyboard-focus ring. Only call focus() when the thumb isn't already
    // active: an already-focused element fires no focus event, so the flag
    // would never clear.
    const thumbEl = thumbEls.current[idx];
    if (thumbEl && document.activeElement !== thumbEl) {
      isPointerFocus.current = true;
      thumbEl.focus();
    } else if (focusedThumbIndex.ref.current === idx) {
      // Already keyboard-focused, so no focus event fires — clear the ring by
      // hand, or it'd stay combined with the --active drag style.
      focusedThumbIndex.set(null);
    }
  }

  function onPointerMove (event: SliderPointerEvent) {
    if (!isDragging.ref.current || activeThumbIndex.ref.current === null || !controlEl) return;
    // Pointer capture only retargets the owning pointer's events.
    if (event.pointerId !== activePointerId.current) return;

    // A consumer can flip disabled mid-drag — stop accepting input immediately.
    if (props.disabled) {
      onPointerUp();
      return;
    }

    // The primary button can be released outside this document without a
    // pointerup ever reaching us. event.buttons reflects the actual current
    // button state, so this self-heals on the next move.
    if (event.buttons === 0) {
      onPointerUp();
      return;
    }

    const rawVal = getValueFromPointerEvent(event, controlEl);
    const active = activeThumbIndex.ref.current;
    const idx = dragStartedCoincident.current ? resolveCoincidentHandoff(active, rawVal) : active;
    if (idx !== active) {
      // The abandoned thumb is no longer being dragged — its old hold would
      // otherwise sit there stale, read as "actively held" by UseSliderValue.
      delete activeSnapValue.current[active];
      if (escapeDismissedIndex.ref.current === idx) escapeDismissedIndex.set(null);
      activeThumbIndex.set(idx);
      lastActiveThumbIndex.current = idx;
    }

    updateThumbValue(idx, rawVal, { allowSnap: true });
  }

  // Same off-grid detection as UseSliderValue's thumbNativeStep.
  function isOffGrid (val: number): boolean {
    if (props.step <= 0) return false;
    const stepsFromMin = (val - props.min) / props.step;
    return Math.abs(stepsFromMin - Math.round(stepsFromMin)) > 1e-9;
  }

  // event is omitted for the internal end-of-drag calls above (disabled
  // flip, buttons===0 self-heal). A real pointerup/pointercancel passes one.
  function onPointerUp (event?: Pick<PointerEvent, 'pointerId'>) {
    if (!isDragging.ref.current) return;
    if (event && event.pointerId !== activePointerId.current) return;
    isDragging.set(false);
    activePointerId.current = null;
    // A magnetic snap point can leave the thumb off the step grid — re-quantize
    // onto the grid now that the drag has ended.
    const idx = activeThumbIndex.ref.current;
    if (idx !== null && isOffGrid(internalValues.ref.current[idx])) {
      updateThumbValue(idx, internalValues.ref.current[idx]);
    }
    commitIfChanged();
    activeThumbIndex.set(null);
    activeSnapValue.current = {};
  }

  // ─── Keyboard events on native inputs ──────────────────────────────────────

  function onThumbInput (i: number, event: ChangeEvent<HTMLInputElement>) {
    // Fires from native arrow keys / Home / End on the native input
    updateThumbValue(i, Number(event.target.value));
  }

  // +1/-1/0 for a largeStep nudge, or 0 for any other key.
  function largeStepDelta (key: string, shiftKey: boolean, increaseKey: string, decreaseKey: string): number {
    if (key === 'PageUp') return 1;
    if (key === 'PageDown') return -1;
    if (!shiftKey) return 0;
    if (key === 'ArrowUp' || key === increaseKey) return 1;
    if (key === 'ArrowDown' || key === decreaseKey) return -1;
    return 0;
  }

  // Converting largeStep to a whole number of steps first, at least one,
  // guarantees it always moves.
  function largeStepValue (): number {
    if (props.step <= 0) return props.largeStep;
    const stepsCount = Math.max(1, Math.round(props.largeStep / props.step));
    return stepsCount * props.step;
  }

  function onThumbKeydown (i: number, event: KeyboardEvent<HTMLInputElement>) {
    // A click-to-focus then keyboard nav would never show the ring without
    // setting this explicitly.
    if (focusedThumbIndex.ref.current !== i) {
      focusedThumbIndex.set(i);
    }

    // The native input swaps which of Left/Right increments under dir="rtl" —
    // Shift+Arrow must swap the same way. Up/Down never swap.
    const increaseKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const decreaseKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
    const delta = largeStepDelta(event.key, event.shiftKey, increaseKey, decreaseKey);
    if (delta !== 0) {
      event.preventDefault();
      updateThumbValue(i, internalValues.ref.current[i] + delta * largeStepValue());
    }
    // Matches DtTooltip's own Escape handling: dismiss without moving focus.
    // A THUMB_NAV_KEYS press is a fresh show-trigger; a bare modifier press
    // doesn't reopen a tooltip the user just dismissed.
    if (event.key === 'Escape') {
      escapeDismissedIndex.set(i);
    } else if (THUMB_NAV_KEYS.has(event.key) && escapeDismissedIndex.ref.current === i) {
      escapeDismissedIndex.set(null);
    }
    // Plain arrow keys, Home, End handled natively by <input type="range">.
  }

  function onThumbFocus (i: number) {
    if (i === 1) highThumbHasFocus.current = true;
    // Skip the keyboard-focus ring and focus-driven tooltip readout for a
    // pointer-driven focus — a mouse drag already gets its own affordance.
    if (isPointerFocus.current) {
      isPointerFocus.current = false;
    } else {
      if (escapeDismissedIndex.ref.current === i) escapeDismissedIndex.set(null);
      focusedThumbIndex.set(i);
    }
  }

  function onThumbBlur (i: number) {
    if (i === 1) highThumbHasFocus.current = false;
    focusedThumbIndex.set(null);
    commitIfChanged();
  }

  function onThumbHitPointerEnter (i: number) {
    if (escapeDismissedIndex.ref.current === i) escapeDismissedIndex.set(null);
    hoveredThumbIndex.set(i);
  }

  function onThumbHitPointerLeave (i: number) {
    if (hoveredThumbIndex.ref.current === i) hoveredThumbIndex.set(null);
  }

  function isReadoutOpen (i: number): boolean {
    if (props.readout === 'always') return true;
    if (escapeDismissedIndex.value === i) return false;
    return activeThumbIndex.value === i || focusedThumbIndex.value === i || hoveredThumbIndex.value === i;
  }

  return {
    isDragging: isDragging.value,
    activeThumbIndex: activeThumbIndex.value,
    focusedThumbIndex: focusedThumbIndex.value,
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
  };
}
