import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

// Two kinds of collision: low/high readouts overlapping each other as thumbs
// converge (merged into one centered "lo–hi" pill), and a readout overlapping
// a static mark (readout wins, mark hides — it's the thing actively
// communicating current state). Pure rect measurement, recomputed on value/
// visibility change and control resize, no polling.
export function useSliderCollisionAvoidance(props, {
  controlRef,
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  isRtl,
  isReadoutOpen,
  computedMarks,
  markEdgeOffsetPx,
  mergedReadoutPct,
}) {
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
  // see markEdgeOffsetPx (UseSliderGeometry's markStyle reads it) below.
  const EDGE_CLAMP_TOLERANCE_PX = 32;

  function rectsOverlap(a, b, padding = 0) {
    return !(
      a.right + padding < b.left ||
      a.left - padding > b.right ||
      a.bottom + padding < b.top ||
      a.top - padding > b.bottom
    );
  }

  // Two passes: decide whether the readouts should merge, then — after Vue
  // renders the merged pill or removes it — measure whichever representation
  // is actually shown against the marks. The watcher and ResizeObserver below
  // can both call this and overlap across ticks; collisionUpdateId is a
  // generation counter so only the freshest call's result ever applies.
  let collisionUpdateId = 0;

  // .d-slider__readout animates position (slider.less), so a mid-transition
  // getBoundingClientRect() can read a stale position — a keyboard nudge or
  // programmatic change doesn't set data-dragging to disable it. Sidesteps
  // this by computing position analytically from the same reactive pct the
  // template uses, only pulling size (never transitioned) from the DOM.
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
    const effectivePct = isRtl.value ? 100 - pct : pct;
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

  // Key by each mark's own data-mark-index, not its position in
  // markElRefs.value — that array isn't reliably aligned with computedMarks
  // across renders (confirmed live: can hold the "100"/"0" marks in opposite
  // order, silently swapping collision results).
  // Measures collision-hiding and edge-clamping in one pass, not two: the
  // collision check must compare against where a mark is ABOUT to render this
  // cycle (post-clamp), not its stale pre-nudge position, or a mark at the
  // boundary gets a wrong hidden/visible state until some later remeasure.
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

  // Rendered widths change with formatted TEXT (getValueText/prefix/suffix),
  // not just the underlying values — a locale change at unchanged values must
  // still recheck, since the ResizeObserver below only watches the control's
  // own size, not text-driven changes to its children. isVertical/isRtl are
  // watched too — a runtime orientation or dir flip changes every rect this
  // measures without touching any of the other sources, or without the
  // control's own size changing, and neither recomputes on its own otherwise.
  watch(
    [
      internalValues,
      readoutVisibility,
      computedMarks,
      () => props.getValueText,
      () => props.prefix,
      () => props.suffix,
      isVertical,
      isRtl,
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
    markElRefs,
    readoutElRefs,
    mergedReadoutElRef,
    markCollisionHidden,
    readoutMerged,
  };
}
