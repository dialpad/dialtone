import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

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
export function useSliderCollisionAvoidance(props, {
  controlRef,
  markElRefs,
  readoutElRefs,
  mergedReadoutElRef,
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  formatValue,
  isRtl,
  isReadoutOpen,
  computedMarks,
  positionStyle,
  centerInlineTransform,
}) {
  const markCollisionHidden = ref([]);
  const readoutMerged = ref(false);
  const COLLISION_PADDING = 4; // px of breathing room before a mark hides or readouts merge
  // Must match .d-slider__control's own overflow-clip-margin (slider.less) — a
  // mark within that margin already renders fully today (it's what the margin
  // is for), so leave it centered exactly as before. Only once a mark's natural
  // centered position would exceed this margin does it need nudging inward;
  // see markEdgeOffsetPx below.
  const EDGE_CLAMP_TOLERANCE_PX = 32;

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
  // values do. getValueText/prefix/suffix drive that text (see formatValue,
  // UseSliderValue), so a consumer swapping getValueText (e.g. a locale
  // change) at unchanged values must still trigger a recheck, or two readouts
  // can end up visibly overlapping (or a stale merged pill can persist) with
  // nothing left to re-trigger the measurement — the ResizeObserver below
  // only watches the control container's own size, not text-driven changes
  // to its children.
  watch(
    [
      internalValues,
      readoutVisibility,
      computedMarks,
      () => props.getValueText,
      () => props.prefix,
      () => props.suffix,
    ],
    () => updateCollisions(),
    { deep: true },
  );

  onMounted(() => {
    nextTick(updateCollisions);
    if (typeof ResizeObserver !== 'undefined' && controlRef.value) {
      markCollisionResizeObserver = new ResizeObserver(() => updateCollisions());
      markCollisionResizeObserver.observe(controlRef.value);
    }
  });

  onBeforeUnmount(() => {
    markCollisionResizeObserver?.disconnect();
  });

  return {
    markEdgeOffsetPx,
    markStyle,
    markCollisionHidden,
    readoutMerged,
    mergedReadoutPct,
    mergedReadoutText,
  };
}
