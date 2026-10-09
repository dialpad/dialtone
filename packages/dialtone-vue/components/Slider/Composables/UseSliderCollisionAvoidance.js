import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { SLIDER_EDGE_CLAMP_TOLERANCE_PX } from '../SliderConstants';
import { edgeClampOffset, mirrorPct } from '../utils';

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
}) {
  const markElRefs = ref([]);
  const readoutElRefs = ref([]);
  const mergedReadoutElRef = ref(null);
  const tooltipElRefs = ref([]);
  const markCollisionHidden = ref([]);
  const readoutMerged = ref(false);
  // Owned here (measured and written), read by UseSliderGeometry to build
  // markStyle/tooltipReadoutStyle — returned below rather than threaded in
  // from Slider.vue as a bare shared ref.
  const markEdgeOffsetPx = ref([]);
  const controlRect = ref({ left: 0, right: 0 });
  const tooltipWidthPx = ref([]);
  const COLLISION_PADDING = 4; // px of breathing room before a mark hides or readouts merge
  // Must match .d-slider__control's own overflow-clip-margin (slider.less) — a
  // mark within that margin already renders fully today (it's what the margin
  // is for), so leave it centered exactly as before. Only once a mark's natural
  // centered position would exceed this margin does it need nudging inward;
  // see markEdgeOffsetPx (UseSliderGeometry's markStyle reads it) below.
  const EDGE_CLAMP_TOLERANCE_PX = SLIDER_EDGE_CLAMP_TOLERANCE_PX;

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
    const centerPx = controlRect.left
      + (mirrorPct(pct, isRtl.value) / 100) * (controlRect.right - controlRect.left);
    return { left: centerPx - width / 2, right: centerPx + width / 2, top: elRect.top, bottom: elRect.bottom };
  }

  // Same rationale as data-mark-index on marks: don't trust readoutElRefs[i]'s
  // array position to correspond to internalValues[i] — look the element up by
  // its own tagged index instead. The tooltip readout uses a separate,
  // already index-aligned ref array (tooltipElRefs, same pattern as
  // markElRefs) instead of data-readout-index, since it never needs the
  // array-ref-plus-lookup indirection the in-row readout does.
  function readoutElByIndex(i) {
    if (props.readout === 'tooltip') return tooltipElRefs.value[i] || null;
    return readoutElRefs.value.find((el) => el && Number(el.dataset.readoutIndex) === i);
  }

  async function updateCollisions() {
    const thisUpdateId = ++collisionUpdateId;
    await nextTick(); // let Vue's own DOM patch (text/value/style) land before measuring
    if (thisUpdateId !== collisionUpdateId) return;

    const wasMerged = readoutMerged.value;
    // The tooltip readout has no merged-pill fallback UI (unlike the in-row
    // readout) — merging it here would hide both individual bubbles'
    // measurement (collectReadoutRects falls back to the nonexistent merged
    // pill) while nothing fills the gap, silently disabling mark collision
    // avoidance for tooltip mode whenever two bubbles happen to overlap.
    if (props.readout !== 'tooltip' && isRange.value && internalValues.value.length === 2 && isReadoutOpen(0) && isReadoutOpen(1)) {
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

  // Measures synchronously (not via the async/cancelable updateCollisions
  // pipeline) so values stay current through a fast drag — see
  // tooltipReadoutStyle for how they're consumed. Horizontal only.
  function updateTooltipMeasurements() {
    if (!controlRef.value) return;
    controlRect.value = controlRef.value.getBoundingClientRect();
    if (isVertical.value) return;
    tooltipWidthPx.value = internalValues.value.map((_, i) => {
      const el = tooltipElRefs.value[i];
      return el ? el.getBoundingClientRect().width : 0;
    });
  }

  // Same formula as UseSliderGeometry's own mergedReadoutPct — recomputed
  // here rather than threaded in, since both values a merge check ever needs
  // (internalValues, thumbPercent) are already inputs to this composable.
  function mergedReadoutPct() {
    const [lo, hi] = internalValues.value;
    return (thumbPercent(lo) + thumbPercent(hi)) / 2;
  }

  function collectReadoutRects() {
    if (readoutMerged.value) {
      const rect = analyticalReadoutRect(mergedReadoutPct(), mergedReadoutElRef.value);
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

      const offset = canClampEdges
        ? edgeClampOffset(naturalLeft, naturalRight, controlRect, EDGE_CLAMP_TOLERANCE_PX)
        : 0;
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

  // Separate from updateCollisions' watcher: flush:'post' can't be starved
  // by its own async cancellation, so this stays current during a fast drag.
  watch(
    [
      internalValues,
      readoutVisibility,
      () => props.getValueText,
      () => props.prefix,
      () => props.suffix,
      isVertical,
      isRtl,
    ],
    () => updateTooltipMeasurements(),
    { deep: true, flush: 'post' },
  );

  onMounted(() => {
    updateTooltipMeasurements();
    nextTick(updateCollisions);
    if (typeof ResizeObserver !== 'undefined' && controlRef.value) {
      markCollisionResizeObserver = new ResizeObserver(() => {
        updateTooltipMeasurements();
        updateCollisions();
      });
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
    tooltipElRefs,
    markCollisionHidden,
    readoutMerged,
    markEdgeOffsetPx,
    controlRect,
    tooltipWidthPx,
  };
}
