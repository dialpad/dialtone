import type { CSSProperties } from 'react';
import type { ResolvedSliderProps } from './types';

// Pure positioning math shared by every element placed along the track
// (thumb, tick, mark, readout, indicator) — no DOM reads, just props + state
// from UseSliderValue/UseSliderDirection/UseSliderCollisionAvoidance
// (markEdgeOffsetPx).
export function useSliderGeometry (props: ResolvedSliderProps, {
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  isRtl,
  markEdgeOffsetPx,
  formatValue,
}: {
  isVertical: boolean;
  isRange: boolean;
  internalValues: number[];
  thumbPercent: (val: number) => number;
  isRtl: boolean;
  markEdgeOffsetPx: number[];
  formatValue: (value: number, index: number) => string;
}) {
  // insetInlineStart (not left) so the browser itself mirrors under dir="rtl".
  function positionStyle (pct: number, transform?: string): CSSProperties {
    const style: CSSProperties = isVertical ? { bottom: `${pct}%` } : { insetInlineStart: `${pct}%` };
    if (transform) style.transform = transform;
    return style;
  }

  // translateX(-50%) centers an element on its insetInlineStart anchor — but
  // transform never mirrors under dir="rtl", so the shift flips sign by hand.
  function centerInlineTransform (): string {
    return isRtl ? '50%' : '-50%';
  }

  // The usable area the thumb (and ticks, which share its travel band)
  // anchor within — defined once in slider.less (--slider-edge-inset).
  const EDGE_INSET = 'var(--slider-edge-inset)';

  // (100% - inset*2) * pct/100 + inset: rescales [0, 100]% onto
  // [inset, 100% - inset] without needing the control's measured width.
  const ANCHOR_PCT_PREFIX = `calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * `;
  const ANCHOR_PCT_SUFFIX = ')';

  function anchorPct (pct: number): string {
    return `${ANCHOR_PCT_PREFIX}${pct / 100}${ANCHOR_PCT_SUFFIX}`;
  }

  // Width/height between two anchored positions collapses to a pure function
  // of their percentage delta.
  function anchorSpanPct (deltaPct: number): string {
    return `calc((100% - ${EDGE_INSET} * 2) * ${deltaPct / 100})`;
  }

  function anchoredPositionStyle (
    val: number,
    { verticalTransform, horizontalTransform }: { verticalTransform: string; horizontalTransform: string },
  ): CSSProperties {
    const pct = thumbPercent(val);
    if (isVertical) {
      return { bottom: anchorPct(pct), transform: verticalTransform };
    }
    return {
      insetInlineStart: anchorPct(pct),
      transform: horizontalTransform,
    };
  }

  function thumbPositionStyle (val: number): CSSProperties {
    return anchoredPositionStyle(val, {
      verticalTransform: `translate(${centerInlineTransform()}, 50%)`,
      horizontalTransform: `translate(${centerInlineTransform()}, -50%)`,
    });
  }

  function tickPositionStyle (val: number): CSSProperties {
    return anchoredPositionStyle(val, {
      verticalTransform: 'translateY(50%)',
      horizontalTransform: `translateX(${centerInlineTransform()})`,
    });
  }

  // A mark at min/max nudges 1px inward from the true 0%/100% edge instead
  // of centering like every other one. RTL-mirrored like centerInlineTransform.
  function markEdgeInsetTransform (edge: 'start' | 'end'): string {
    const inward = isRtl ? -1 : 1;
    if (edge === 'start') return `translateX(${inward}px)`;
    const flushPct = isRtl ? '100%' : '-100%';
    return `translateX(calc(${flushPct} + ${-inward}px))`;
  }

  // A value mark (or the readout='always' pill) anchors onto the same inset
  // band as the thumb it tracks (anchorPct).
  function anchoredMarkStyle (pct: number, transform?: string): CSSProperties {
    const style: CSSProperties = isVertical ? { bottom: anchorPct(pct) } : { insetInlineStart: anchorPct(pct) };
    if (transform) style.transform = transform;
    return style;
  }

  // A mark beyond the edge-clamp tolerance of the control's edge gets nudged
  // inward by that excess. Guarded by !isVertical here too, so a stale offset
  // from a prior horizontal render can never leak into vertical mode.
  function markStyle (pct: number, index: number, edge: 'start' | 'end' | null): CSSProperties {
    if (edge && !isVertical) return positionStyle(pct, markEdgeInsetTransform(edge));
    const offset = !isVertical ? markEdgeOffsetPx[index] : 0;
    // No transform here — the base case's centering is CSS's own job.
    if (!offset) return anchoredMarkStyle(pct);
    return anchoredMarkStyle(pct, `translateX(calc(${centerInlineTransform()} + ${offset}px))`);
  }

  // Same anchored positioning + edge-nudge transform as markStyle, for the
  // readout='always' pill(s); the caller passes the resolved px offset.
  function readoutStyle (pct: number, offsetPx: number | undefined, edge?: 'start' | 'end' | null): CSSProperties {
    if (edge && !isVertical) return positionStyle(pct, markEdgeInsetTransform(edge));
    const offset = !isVertical ? offsetPx : 0;
    if (!offset) return anchoredMarkStyle(pct);
    return anchoredMarkStyle(pct, `translateX(calc(${centerInlineTransform()} + ${offset}px))`);
  }

  const hasPair = isRange && internalValues.length === 2;
  const mergedReadoutPct = hasPair ? (thumbPercent(internalValues[0]) + thumbPercent(internalValues[1])) / 2 : 0;
  const mergedReadoutText = hasPair ? `${formatValue(internalValues[0], 0)}–${formatValue(internalValues[1], 1)}` : '';

  // Every edge that tracks an actual thumb value anchors onto the same inset
  // band as the thumb itself; the default mode's fixed fillOrigin end stays
  // literally flush at 0/100%, same as the track.
  function computeIndicatorStyle (): CSSProperties {
    if (hasPair) {
      const [lo, hi] = internalValues;
      const loP = thumbPercent(lo);
      const hiP = thumbPercent(hi);
      if (isVertical) {
        return { bottom: anchorPct(loP), height: anchorSpanPct(hiP - loP) };
      }
      return { insetInlineStart: anchorPct(loP), width: anchorSpanPct(hiP - loP) };
    }

    const pct = thumbPercent(internalValues[0] ?? props.min);

    if (typeof props.fillOrigin === 'number') {
      const originPct = thumbPercent(Math.min(props.max, Math.max(props.min, props.fillOrigin)));
      const startPct = Math.min(pct, originPct);
      const sizePct = Math.abs(pct - originPct);
      if (isVertical) {
        return { bottom: anchorPct(startPct), height: anchorSpanPct(sizePct) };
      }
      return { insetInlineStart: anchorPct(startPct), width: anchorSpanPct(sizePct) };
    }

    const fillsFromEnd = props.fillOrigin === 'end';
    if (isVertical) {
      return fillsFromEnd
        ? { top: 0, height: `calc(100% - ${anchorPct(pct)})` }
        : { bottom: 0, height: anchorPct(pct) };
    }
    return fillsFromEnd
      ? { insetInlineEnd: 0, width: `calc(100% - ${anchorPct(pct)})` }
      : { insetInlineStart: 0, width: anchorPct(pct) };
  }

  return {
    thumbPositionStyle,
    tickPositionStyle,
    markStyle,
    readoutStyle,
    mergedReadoutPct,
    mergedReadoutText,
    indicatorStyle: computeIndicatorStyle(),
  };
}
