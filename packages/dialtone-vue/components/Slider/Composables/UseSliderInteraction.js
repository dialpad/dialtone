import { ref, watch } from 'vue';

// Pointer drag, native keyboard events, focus/hover tracking, and the
// interactive value-update path (updateThumbValue/commitIfChanged) — as
// opposed to UseSliderValue's normalization of externally-driven changes.
export function useSliderInteraction(props, emit, {
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
  isRtl,
}) {
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

  // A consumer can flip :disabled reactively while a thumb is focused or
  // hovered — the native input's own focus ring clears automatically, but
  // focusedThumbIndex/hoveredThumbIndex are separate internal state (also
  // drive the 'interaction' readout), so without this they'd keep pointing at
  // a thumb that's no longer interactive, leaving its focus ring/readout
  // stuck open.
  watch(
    () => props.disabled,
    (isDisabled) => {
      if (isDisabled) {
        focusedThumbIndex.value = null;
        hoveredThumbIndex.value = null;
      }
    },
  );

  // ─── Value update ─────────────────────────────────────────────────────────

  function updateThumbValue(thumbIndex, newVal, { allowSnap = false } = {}) {
    let clamped = Math.min(props.max, Math.max(props.min, newVal));
    const magneticValue = allowSnap ? findMagneticSnapPoint(clamped, thumbIndex) : null;
    clamped = magneticValue ?? snapToStep(clamped);

    const next = [...internalValues.value];

    if (isRange.value) {
      // The low thumb can never pass the high thumb (and vice versa) — they
      // may only meet. minGapSteps, when set, widens this into a
      // larger required gap instead of a bare touch.
      const gap = props.minGapSteps * props.step;
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
      // Home/End) may have already written a different value into the native
      // input's own DOM .value — it isn't range-clamped the way this is.
      // Vue's :value binding won't re-patch an unchanged reactive value, so
      // correct the DOM directly or it silently drifts from internalValues.
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

  // ─── Pointer drag ─────────────────────────────────────────────────────────

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
      if (isRtl.value) pct = 1 - pct;
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
    // Marks the focus() below as pointer-driven so onThumbFocus skips the
    // keyboard-focus ring — :focus-visible can't tell, since browsers treat
    // range inputs as always focus-visible on click. Only call focus() when
    // the thumb isn't already active: an already-focused element fires no
    // 'focus' event, so the flag would never clear and would corrupt the
    // next real keyboard focus.
    const thumbEl = thumbRefs.value[idx];
    if (thumbEl && document.activeElement !== thumbEl) {
      isPointerFocus = true;
      thumbEl.focus();
    } else if (focusedThumbIndex.value === idx) {
      // Already keyboard-focused, so focus() above is skipped (no 'focus'
      // event fires) — clear the ring by hand, or it'd stay combined with
      // the --active drag style even though input switched to pointer.
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

  // ─── Keyboard events on native inputs ──────────────────────────────────────

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

  // Rounding largeStep to the NEAREST step-grid point can round backward to
  // the start value when step is more than ~2x largeStep (step=25,
  // largeStep=10: 100+10=110 rounds back to 100 — a silent no-op). Converting
  // to a whole number of steps first, at least one, guarantees it always moves.
  function largeStepValue() {
    if (props.step <= 0) return props.largeStep;
    const stepsCount = Math.max(1, Math.round(props.largeStep / props.step));
    return stepsCount * props.step;
  }

  function onThumbKeydown(i, event) {
    // focus() only fires once per session, so a click-to-focus then keyboard
    // nav would never show the ring without setting this explicitly.
    if (focusedThumbIndex.value !== i) {
      focusedThumbIndex.value = i;
    }

    // The native input swaps which of Left/Right increments under dir="rtl" —
    // largeStepDelta's Shift+Arrow must swap the same way, or Shift+ArrowRight
    // would contradict plain ArrowRight on the same key. Up/Down never swap.
    // Applies in vertical mode too — aria-orientation is purely an ARIA hint,
    // the native input is never actually reoriented, so dir still swaps Left/
    // Right there exactly as it does horizontally.
    const rtlKeys = isRtl.value;
    const increaseKey = rtlKeys ? 'ArrowLeft' : 'ArrowRight';
    const decreaseKey = rtlKeys ? 'ArrowRight' : 'ArrowLeft';
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

  return {
    isDragging,
    activeThumbIndex,
    focusedThumbIndex,
    hoveredThumbIndex,
    updateThumbValue,
    commitIfChanged,
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
