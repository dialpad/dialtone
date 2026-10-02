import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

// Everything about a user actively interacting with the thumbs: pointer
// drag, native keyboard events, focus/hover tracking, and the interactive
// value-update path they all funnel through (updateThumbValue/
// commitIfChanged) — as opposed to UseSliderValue's normalization of
// externally-driven (controlled prop, reactive min/max/step) changes.
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
}) {
  // Cached, reactive mirror of isRtl()'s live DOM read (see syncDirection and
  // the dirObserver near it) — getComputedStyle itself isn't reactive, so a
  // runtime dir change on any ancestor (dir is ambient/inherited) would
  // otherwise never re-trigger the template's transform bindings between
  // mount and the next unrelated render.
  const rtl = ref(false);
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

  // ─── Pointer drag ─────────────────────────────────────────────────────────

  // Re-reads the control's resolved text direction off the DOM and caches it
  // in the `rtl` ref above. getComputedStyle() itself isn't reactive — Vue has
  // no way to know a runtime dir change on some ancestor should re-run
  // anything — so this has to be called explicitly: once on mount (see
  // mountInteraction below), and again whenever dirObserver sees a relevant
  // dir attribute change. Only meaningful for horizontal orientation: vertical
  // positioning runs on the block axis, which bidi direction doesn't affect.
  function syncDirection() {
    rtl.value = !!controlRef.value && getComputedStyle(controlRef.value).direction === 'rtl';
  }

  // True when the control's resolved text direction is RTL. Reads the cached
  // `rtl` ref (kept current by syncDirection) rather than the DOM directly, so
  // every call site — pointer math, keyboard direction-relative keys, and the
  // analytical collision rect — reactively agrees on the same value instead of
  // each doing its own point-in-time getComputedStyle() read.
  function isRtl() {
    return rtl.value;
  }

  // dir is ambient — inherited from ANY ancestor, not just controlRef's direct
  // parent — so this has to watch the whole document, not just this
  // component's own subtree, to catch every change that could actually affect
  // the resolved direction here.
  let dirObserver = null;

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
    const rtlKeys = !isVertical.value && isRtl();
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

  onMounted(() => {
    syncDirection();
    if (typeof MutationObserver !== 'undefined') {
      dirObserver = new MutationObserver(syncDirection);
      dirObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'], subtree: true });
    }
  });

  onBeforeUnmount(() => {
    dirObserver?.disconnect();
  });

  return {
    isDragging,
    activeThumbIndex,
    focusedThumbIndex,
    hoveredThumbIndex,
    isRtl,
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
