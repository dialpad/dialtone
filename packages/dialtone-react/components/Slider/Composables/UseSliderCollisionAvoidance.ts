import { useEffect, useEffectEvent, useReducer, useRef } from 'react';
import { SLIDER_EDGE_CLAMP_TOLERANCE_PX, SLIDER_READOUT_EDGE_CLAMP_TOLERANCE_PX } from '../SliderConstants';
import { edgeClampOffset, measureEdgeInsetPx, mirrorPct, sameValues, type EdgeRect } from '../utils';
import type { ComputedMark } from './UseSliderMarksAndTicks';
import { useSyncedState } from './useSyncedState';
import type { ResolvedSliderProps } from './types';

const COLLISION_PADDING = 4; // px of breathing room before a mark hides or readouts merge
// Must match .d-slider__control's own overflow-clip-margin (slider.less).
const EDGE_CLAMP_TOLERANCE_PX = SLIDER_EDGE_CLAMP_TOLERANCE_PX;
// Readouts get no tolerance allowance (unlike marks above) — see
// SLIDER_READOUT_EDGE_CLAMP_TOLERANCE_PX's own comment.
const READOUT_EDGE_CLAMP_TOLERANCE_PX = SLIDER_READOUT_EDGE_CLAMP_TOLERANCE_PX;

function rectsOverlap (a: EdgeRect, b: EdgeRect, padding = 0): boolean {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}

/** Element slots the component fills with callback refs, by index where there are several. */
export interface CollisionElements {
  markEls: { current: (HTMLDivElement | null)[] };
  readoutEls: { current: (HTMLDivElement | null)[] };
  mergedReadoutEl: { current: HTMLDivElement | null };
  tooltipEls: { current: (HTMLDivElement | null)[] };
}

// Two kinds of collision: low/high readouts overlapping each other as thumbs
// converge (merged into one centered "lo–hi" pill), and a readout overlapping
// a static mark (readout wins, mark hides). Pure rect measurement, recomputed
// on value/visibility change and control resize — and, for the tooltip
// readout, each time UseSliderTooltipReadout moves it (requestUpdate).
export function useSliderCollisionAvoidance (props: ResolvedSliderProps, {
  controlEl,
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  isRtl,
  isReadoutOpen,
  computedMarks,
  formatValue,
  readoutClass,
}: {
  controlEl: HTMLElement | null;
  isVertical: boolean;
  isRange: boolean;
  internalValues: number[];
  thumbPercent: (val: number) => number;
  isRtl: boolean;
  isReadoutOpen: (i: number) => boolean;
  computedMarks: ComputedMark[];
  formatValue: (value: number, index: number) => string;
  readoutClass: unknown;
}) {
  const markEls = useRef<(HTMLDivElement | null)[]>([]);
  const readoutEls = useRef<(HTMLDivElement | null)[]>([]);
  const mergedReadoutEl = useRef<HTMLDivElement | null>(null);
  const tooltipEls = useRef<(HTMLDivElement | null)[]>([]);
  const markCollisionHidden = useSyncedState<boolean[]>([]);
  const readoutMerged = useSyncedState(false);
  // Measured and written here, read by UseSliderGeometry to build markStyle.
  const markEdgeOffsetPx = useSyncedState<number[]>([]);
  // Same edge-clamp protection, for readout='always' pills: one offset per
  // thumb index, plus a separate scalar for the merged pill — never both
  // populated at once.
  const readoutEdgeOffsetPx = useSyncedState<number[]>([]);
  const mergedReadoutEdgeOffsetPx = useSyncedState(0);

  // --slider-edge-inset is effectively static — measured once per
  // updateCollisions() pass, not per analyticalReadoutRect() call.
  const cachedInsetPx = useRef(0);

  const readoutVisibility = internalValues.map((_, i) => isReadoutOpen(i));
  // Rendered widths change with formatted TEXT (getValueText/prefix/suffix),
  // not just the values, so this watches the actual output instead.
  const formattedValues = internalValues.map((v, i) => formatValue(v, i));

  // .d-slider__readout animates position (slider.less), so a mid-transition
  // getBoundingClientRect() can read a stale position. Computes position
  // analytically from the same pct the render uses, on the same inset band,
  // only pulling size (never transitioned) from the DOM.
  function analyticalReadoutRect (pct: number, el: HTMLElement | null | undefined): EdgeRect | null {
    if (!el || !controlEl) return null;
    const elRect = el.getBoundingClientRect();
    const controlRect = controlEl.getBoundingClientRect();
    const insetPx = cachedInsetPx.current;
    if (isVertical) {
      const height = elRect.bottom - elRect.top;
      const totalPx = controlRect.bottom - controlRect.top;
      const anchorPx = insetPx + (totalPx - 2 * insetPx) * (pct / 100);
      const centerPx = controlRect.bottom - anchorPx;
      return { left: elRect.left, right: elRect.right, top: centerPx - height / 2, bottom: centerPx + height / 2 };
    }
    const width = elRect.right - elRect.left;
    const totalPx = controlRect.right - controlRect.left;
    const anchorPx = insetPx + (totalPx - 2 * insetPx) * (mirrorPct(pct, isRtl) / 100);
    const centerPx = controlRect.left + anchorPx;
    return { left: centerPx - width / 2, right: centerPx + width / 2, top: elRect.top, bottom: elRect.bottom };
  }

  // Look the readout element up by its own tagged index rather than trusting
  // the slot's position.
  function readoutElByIndex (i: number): HTMLDivElement | undefined {
    return readoutEls.current.find((el): el is HTMLDivElement => !!el && Number(el.dataset.readoutIndex) === i);
  }

  // The tooltip readout is positioned by UseSliderTooltipReadout, not by
  // percent math, so its rect is measured directly.
  function readoutRect (val: number, i: number): EdgeRect | null {
    if (props.readout === 'tooltip') return tooltipEls.current[i]?.getBoundingClientRect() ?? null;
    return analyticalReadoutRect(thumbPercent(val), readoutElByIndex(i));
  }

  // Same formula as UseSliderGeometry's own mergedReadoutPct.
  function mergedReadoutPct (): number {
    const [lo, hi] = internalValues;
    return (thumbPercent(lo) + thumbPercent(hi)) / 2;
  }

  function collectReadoutRects (merged: boolean): EdgeRect[] {
    if (merged) {
      const rect = analyticalReadoutRect(mergedReadoutPct(), mergedReadoutEl.current);
      return rect ? [rect] : [];
    }
    return internalValues
      .map((val, i) => (isReadoutOpen(i) ? readoutRect(val, i) : null))
      .filter((rect): rect is EdgeRect => !!rect);
  }

  // Key by each mark's own data-mark-index. Measures collision-hiding and
  // edge-clamping in one pass: the collision check compares against where a
  // mark is ABOUT to render this cycle (post-clamp).
  function updateMarkCollisions (merged: boolean) {
    const marks = markEls.current;
    if (!marks.some(Boolean)) return;
    const readoutRects = collectReadoutRects(merged);
    const collisionResult = computedMarks.map(() => false);
    const offsets = computedMarks.map(() => 0);
    // Edge-clamping is only meaningful horizontally.
    const controlRect = controlEl && !isVertical ? controlEl.getBoundingClientRect() : null;

    marks.forEach((markEl) => {
      if (!markEl) return;
      const idx = Number(markEl.dataset.markIndex);
      // Measure with any PREVIOUS offset backed out, so this reflects the
      // mark's natural (centered) position, not last render's correction.
      const prevOffset = markEdgeOffsetPx.ref.current[idx] || 0;
      const r = markEl.getBoundingClientRect();
      const naturalLeft = r.left - prevOffset;
      const naturalRight = r.right - prevOffset;

      const offset = controlRect
        ? edgeClampOffset(naturalLeft, naturalRight, controlRect, EDGE_CLAMP_TOLERANCE_PX)
        : 0;
      offsets[idx] = offset;

      if (readoutRects.length) {
        const correctedRect = {
          top: r.top, bottom: r.bottom, left: naturalLeft + offset, right: naturalRight + offset,
        };
        collisionResult[idx] = readoutRects.some(
          (rect) => rectsOverlap(correctedRect, rect, COLLISION_PADDING),
        );
      }
    });

    if (!sameValues(collisionResult, markCollisionHidden.ref.current)) markCollisionHidden.set(collisionResult);
    if (!sameValues(offsets, markEdgeOffsetPx.ref.current)) markEdgeOffsetPx.set(offsets);
  }

  // Mirrors updateMarkCollisions's own edge-clamp loop, for the
  // readout='always' pill(s) instead of static marks.
  function updateReadoutEdgeOffsets (merged: boolean) {
    const controlRect = props.readout === 'always' && controlEl && !isVertical
      ? controlEl.getBoundingClientRect()
      : null;

    function clampOffset (el: HTMLElement | null | undefined, prevOffset: number): number {
      if (!el || !controlRect) return 0;
      const r = el.getBoundingClientRect();
      return edgeClampOffset(r.left - prevOffset, r.right - prevOffset, controlRect, READOUT_EDGE_CLAMP_TOLERANCE_PX);
    }

    if (merged) {
      const offset = clampOffset(mergedReadoutEl.current, mergedReadoutEdgeOffsetPx.ref.current);
      if (offset !== mergedReadoutEdgeOffsetPx.ref.current) mergedReadoutEdgeOffsetPx.set(offset);
      if (readoutEdgeOffsetPx.ref.current.some(Boolean)) readoutEdgeOffsetPx.set(internalValues.map(() => 0));
    } else {
      if (mergedReadoutEdgeOffsetPx.ref.current) mergedReadoutEdgeOffsetPx.set(0);
      const offsets = internalValues.map((_, i) => (
        isReadoutOpen(i) ? clampOffset(readoutElByIndex(i), readoutEdgeOffsetPx.ref.current[i] || 0) : 0
      ));
      if (!sameValues(offsets, readoutEdgeOffsetPx.ref.current)) readoutEdgeOffsetPx.set(offsets);
    }
  }

  // Two passes: decide whether the readouts should merge, then — after the
  // merged pill renders or unmounts — measure whichever representation is
  // actually shown against the marks.
  const pendingMeasure = useRef(false);
  const updateCollisions = useEffectEvent(() => {
    if (controlEl) cachedInsetPx.current = measureEdgeInsetPx(controlEl);

    const wasMerged = readoutMerged.ref.current;
    let merged = false;
    // The tooltip readout has no merged-pill fallback UI, so it never merges.
    if (props.readout !== 'tooltip' && isRange && internalValues.length === 2 && isReadoutOpen(0) && isReadoutOpen(1)) {
      const [lo, hi] = internalValues;
      const rectA = analyticalReadoutRect(thumbPercent(lo), readoutElByIndex(0));
      const rectB = analyticalReadoutRect(thumbPercent(hi), readoutElByIndex(1));
      merged = !!(rectA && rectB && rectsOverlap(rectA, rectB, COLLISION_PADDING));
    }

    // Only worth another render when the merge state flipped — that's the
    // only time the merged pill is about to mount/unmount.
    if (merged !== wasMerged) {
      readoutMerged.set(merged);
      pendingMeasure.current = true;
      return;
    }
    pendingMeasure.current = false;
    updateMarkCollisions(merged);
    updateReadoutEdgeOffsets(merged);
  });

  const measureAfterMerge = useEffectEvent(() => {
    if (!pendingMeasure.current) return;
    pendingMeasure.current = false;
    updateMarkCollisions(readoutMerged.ref.current);
    updateReadoutEdgeOffsets(readoutMerged.ref.current);
  });
  // The second pass, once the merge flip has rendered.
  useEffect(() => measureAfterMerge(), [readoutMerged.value]);

  // The tooltip readout and the ResizeObserver ask for a pass through this,
  // from outside React's render.
  const [updateRequests, requestUpdate] = useReducer((n: number) => n + 1, 0);
  const seenRequests = useRef(updateRequests);
  // Vue's watchers, as value comparisons against what this hook last saw.
  // The values are part of the first key as Vue's deep watcher on
  // readoutVisibility re-fires whenever it recomputes, which a value change
  // makes it do. isVertical/isRtl change every rect without touching the rest.
  // readout is part of it too: Vue's isReadoutOpen reads props.readout, so a
  // mode change re-fires the watcher even when the visibility values don't move.
  const layoutKey = JSON.stringify([
    readoutVisibility, computedMarks, isVertical, isRtl, internalValues, props.readout,
  ]);
  // The tooltip readout re-runs collisions itself once it has moved;
  // measuring here would read its old position.
  const contentKey = JSON.stringify([internalValues, formattedValues, readoutClass ?? null]);
  const seenKeys = useRef<[string, string] | null>(null);
  useEffect(() => {
    const seen = seenKeys.current;
    seenKeys.current = [layoutKey, contentKey];
    const requested = seenRequests.current !== updateRequests;
    seenRequests.current = updateRequests;
    // Vue's watchers don't run on mount; the mount effect below does instead.
    if (!seen) return;
    if (requested || seen[0] !== layoutKey || (seen[1] !== contentKey && props.readout !== 'tooltip')) {
      updateCollisions();
    }
  }, [layoutKey, contentKey, updateRequests, props.readout]);

  useEffect(() => {
    // Vue measures once its own patch has settled (onMounted, then nextTick
    // twice); the first frame is the React equivalent.
    const frame = requestAnimationFrame(() => updateCollisions());
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && controlEl) {
      observer = new ResizeObserver(() => requestUpdate());
      observer.observe(controlEl);
    }
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [controlEl]);

  return {
    elements: { markEls, readoutEls, mergedReadoutEl, tooltipEls } satisfies CollisionElements,
    markCollisionHidden: markCollisionHidden.value,
    readoutMerged: readoutMerged.value,
    markEdgeOffsetPx: markEdgeOffsetPx.value,
    readoutEdgeOffsetPx: readoutEdgeOffsetPx.value,
    mergedReadoutEdgeOffsetPx: mergedReadoutEdgeOffsetPx.value,
    readoutVisibility,
    formattedValues,
    requestUpdate,
  };
}
