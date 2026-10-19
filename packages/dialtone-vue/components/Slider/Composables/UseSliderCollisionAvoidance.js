import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { SLIDER_EDGE_CLAMP_TOLERANCE_PX } from '../SliderConstants';
import { edgeClampOffset, measureEdgeInsetPx, mirrorPct, sameValues } from '../utils';

// Two kinds of collision: low/high readouts overlapping each other as thumbs
// converge (merged into one centered "lo–hi" pill), and a readout overlapping
// a static mark (readout wins, mark hides — it's the thing actively
// communicating current state). Pure rect measurement, recomputed on value/
// visibility change and control resize — and, for the tooltip readout, each
// time UseSliderTooltipReadout moves it (Slider.vue's onPosition).
export function useSliderCollisionAvoidance(props, {
  controlRef,
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  isRtl,
  isReadoutOpen,
  computedMarks,
  formatValue,
}) {
  const markElRefs = ref([]);
  const readoutElRefs = ref([]);
  const mergedReadoutElRef = ref(null);
  const tooltipElRefs = ref([]);
  const markCollisionHidden = ref([]);
  const readoutMerged = ref(false);
  // Owned here (measured and written), read by UseSliderGeometry to build
  // markStyle — returned below rather than threaded in from Slider.vue as a
  // bare shared ref.
  const markEdgeOffsetPx = ref([]);
  // Same edge-clamp protection as markEdgeOffsetPx, but for readout='always'
  // pills — those anchor onto the same inset band as the thumb (so they
  // never poke past the thumb's own radius), but unlike the thumb, a
  // readout's rendered width depends on its TEXT (locale, suffix, a long
  // getValueText override), which the anchored band alone doesn't account
  // for. A consumer wrapping the slider in a narrower overflow:hidden box
  // than the control's own overflow-clip-margin tolerance could clip it.
  // One offset per thumb index (individual pills) plus a separate scalar
  // for the merged pill — never both populated at once (readoutMerged
  // decides which representation is actually rendered).
  const readoutEdgeOffsetPx = ref([]);
  const mergedReadoutEdgeOffsetPx = ref(0);
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

  // --slider-edge-inset is effectively static for the component's lifetime
  // (same rationale as UseSliderInteraction's own cachedEdgeInsetPx) —
  // measured once per updateCollisions() pass below, not per
  // analyticalReadoutRect() call. Every call within a single pass (the merge
  // check's rectA/rectB, and updateMarkCollisions's own readout rects) traces
  // back to that one measurement; re-measuring per call would mean inserting
  // and removing a DOM probe — forcing a synchronous layout — up to 4 times
  // in a single collision pass for no benefit, since the value can't have
  // changed between them.
  let cachedInsetPx = 0;

  // .d-slider__readout animates position (slider.less), so a mid-transition
  // getBoundingClientRect() can read a stale position — a keyboard nudge or
  // programmatic change doesn't set data-dragging to disable it. Sidesteps
  // this by computing position analytically from the same reactive pct the
  // template uses, only pulling size (never transitioned) from the DOM.
  //
  // Rescaled onto the same inset band the actual render uses (UseSliderGeometry's
  // anchorPct, via markStyle) — not a flush linear pct-to-px mapping across the
  // control's full true edges. The two used to agree (both flush) before
  // markStyle switched marks/readout='always' to anchorPct; left flush here,
  // this would now systematically disagree with where the readout actually
  // renders, worst-case by a full --slider-edge-inset right at the ends —
  // exactly where collision/merge detection matters most.
  function analyticalReadoutRect(pct, el) {
    if (!el || !controlRef.value) return null;
    const elRect = el.getBoundingClientRect();
    const controlRect = controlRef.value.getBoundingClientRect();
    const insetPx = cachedInsetPx;
    if (isVertical.value) {
      const height = elRect.bottom - elRect.top;
      const totalPx = controlRect.bottom - controlRect.top;
      const anchorPx = insetPx + (totalPx - 2 * insetPx) * (pct / 100);
      const centerPx = controlRect.bottom - anchorPx;
      return { left: elRect.left, right: elRect.right, top: centerPx - height / 2, bottom: centerPx + height / 2 };
    }
    const width = elRect.right - elRect.left;
    const totalPx = controlRect.right - controlRect.left;
    const anchorPx = insetPx + (totalPx - 2 * insetPx) * (mirrorPct(pct, isRtl.value) / 100);
    const centerPx = controlRect.left + anchorPx;
    return { left: centerPx - width / 2, right: centerPx + width / 2, top: elRect.top, bottom: elRect.bottom };
  }

  // Same rationale as data-mark-index on marks: don't trust readoutElRefs[i]'s
  // array position to correspond to internalValues[i] — look the element up by
  // its own tagged index instead.
  function readoutElByIndex(i) {
    return readoutElRefs.value.find((el) => el && Number(el.dataset.readoutIndex) === i);
  }

  // The tooltip readout is positioned by UseSliderTooltipReadout, not by
  // percent math, so its rect is measured directly. Its ref array
  // (tooltipElRefs) is already index-aligned, same pattern as markElRefs.
  function readoutRect(val, i) {
    if (props.readout === 'tooltip') return tooltipElRefs.value[i]?.getBoundingClientRect() ?? null;
    return analyticalReadoutRect(thumbPercent(val), readoutElByIndex(i));
  }

  async function updateCollisions() {
    const thisUpdateId = ++collisionUpdateId;
    await nextTick(); // let Vue's own DOM patch (text/value/style) land before measuring
    if (thisUpdateId !== collisionUpdateId) return;

    if (controlRef.value) cachedInsetPx = measureEdgeInsetPx(controlRef.value);

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
    updateReadoutEdgeOffsets();
  }

  // Mirrors updateMarkCollisions's own edge-clamp loop (same edgeClampOffset
  // helper, same "back out the previous offset before measuring" rationale),
  // but for the readout='always' pill(s) instead of static marks — marks and
  // readouts are two different DOM subtrees (only one of which ever renders
  // a merged pill), so this is a parallel pass rather than a shared loop.
  // Deliberately independent of updateMarkCollisions's own mark-vs-readout
  // overlap check above: that check already ran against the readout's
  // un-nudged rect this cycle, and the nudge here is a small, edge-only
  // correction — not worth a second collision pass to chase.
  function updateReadoutEdgeOffsets() {
    const canClampEdges = props.readout === 'always' && !!controlRef.value && !isVertical.value;
    const controlRect = canClampEdges ? controlRef.value.getBoundingClientRect() : null;

    function clampOffset(el, prevOffset) {
      if (!el || !canClampEdges) return 0;
      const r = el.getBoundingClientRect();
      return edgeClampOffset(r.left - prevOffset, r.right - prevOffset, controlRect, EDGE_CLAMP_TOLERANCE_PX);
    }

    function updateMergedOffset() {
      const offset = clampOffset(mergedReadoutElRef.value, mergedReadoutEdgeOffsetPx.value);
      if (offset !== mergedReadoutEdgeOffsetPx.value) mergedReadoutEdgeOffsetPx.value = offset;
      if (readoutEdgeOffsetPx.value.some(Boolean)) readoutEdgeOffsetPx.value = internalValues.value.map(() => 0);
    }

    function updateIndividualOffsets() {
      if (mergedReadoutEdgeOffsetPx.value) mergedReadoutEdgeOffsetPx.value = 0;
      const offsets = internalValues.value.map((_, i) => (
        isReadoutOpen(i) ? clampOffset(readoutElByIndex(i), readoutEdgeOffsetPx.value[i] || 0) : 0
      ));
      if (!sameValues(offsets, readoutEdgeOffsetPx.value)) readoutEdgeOffsetPx.value = offsets;
    }

    if (readoutMerged.value) updateMergedOffset();
    else updateIndividualOffsets();
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
      .map((val, i) => (isReadoutOpen(i) ? readoutRect(val, i) : null))
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

    if (!sameValues(collisionResult, markCollisionHidden.value)) markCollisionHidden.value = collisionResult;
    if (!sameValues(offsets, markEdgeOffsetPx.value)) markEdgeOffsetPx.value = offsets;
  }

  const readoutVisibility = computed(() => internalValues.value.map((_, i) => isReadoutOpen(i)));

  // Rendered widths change with formatted TEXT (getValueText/prefix/suffix),
  // not just the values — a STABLE getValueText closing over some other
  // reactive value (e.g. a locale ref) can produce different text with its
  // own reference never changing, so this watches the actual output instead.
  const formattedValues = computed(() => internalValues.value.map((v, i) => formatValue(v, i)));

  let markCollisionResizeObserver = null;

  // isVertical/isRtl are watched too — a runtime orientation or dir flip
  // changes every rect this measures without touching any of the other
  // sources, or without the control's own size changing (the ResizeObserver
  // below only watches that), and neither recomputes on its own otherwise.
  watch(
    [readoutVisibility, computedMarks, isVertical, isRtl],
    () => updateCollisions(),
    { deep: true },
  );

  // The tooltip readout re-runs collisions itself once it has moved
  // (Slider.vue's onPosition); measuring here would read its old position.
  watch(
    [internalValues, formattedValues, () => props.readoutClass],
    () => { if (props.readout !== 'tooltip') updateCollisions(); },
    { deep: true },
  );

  onMounted(() => {
    nextTick(updateCollisions);
    if (typeof ResizeObserver !== 'undefined' && controlRef.value) {
      markCollisionResizeObserver = new ResizeObserver(() => {
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
    readoutEdgeOffsetPx,
    mergedReadoutEdgeOffsetPx,
    readoutVisibility,
    formattedValues,
    updateCollisions,
  };
}
