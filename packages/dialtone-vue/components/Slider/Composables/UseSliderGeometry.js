import { computed } from 'vue';

// Pure positioning math shared by every element placed along the track
// (thumb, tick, mark, readout, indicator) — no DOM reads, just props +
// reactive state from UseSliderValue/UseSliderDirection/
// UseSliderCollisionAvoidance (markEdgeOffsetPx).
export function useSliderGeometry(props, {
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  isRtl,
  markEdgeOffsetPx,
  formatValue,
}) {
  // Shared by every track element — they only differ in which transform
  // re-centers them. insetInlineStart (not left) so the browser itself
  // mirrors under dir="rtl"; see UseSliderInteraction for the other two
  // places RTL needs explicit handling instead (pointer math, Shift+Arrow).
  function positionStyle(pct, transform) {
    const style = isVertical.value ? { bottom: `${pct}%` } : { insetInlineStart: `${pct}%` };
    if (transform) style.transform = transform;
    return style;
  }

  // translateX(-50%) centers an element on its insetInlineStart anchor — but
  // unlike insetInlineStart, transform never mirrors under dir="rtl", so the
  // shift has to flip sign by hand (+50%) once the anchor itself mirrors, or
  // the element renders a full width away from its anchor. Applies regardless
  // of orientation — insetInlineStart centers the track/thumb on the inline
  // axis even in vertical mode.
  function centerInlineTransform() {
    return isRtl.value ? '50%' : '-50%';
  }

  // The usable area every centered track element (thumb, tick) anchors
  // within: inset from the true 0%/100% edge by 1px plus half a tick's own
  // width, matching where an edge tick's center would otherwise overshoot
  // to if it were simply centered at 0%/100% like every other tick. The
  // track and indicator still span the full control; the leftover span
  // beyond this inset is a decorative, non-interactive cap — the same
  // rounded-pill overhang a tick or thumb would otherwise visually poke
  // past the edge of.
  const EDGE_INSET = 'calc(1px + var(--slider-tick-width) / 2)';

  // (100% - inset*2) * pct/100 + inset: a percentage and a px length combine
  // into one calc() value when multiplied by a unitless number, so this
  // rescales [0, 100]% onto [inset, 100% - inset] without ever needing the
  // control's actual measured width. Shared by thumbPositionStyle and
  // tickPositionStyle below — every tick (not just the edge ones) is
  // rescaled onto this same band, so spacing between ticks stays even
  // rather than only the edges standing out as special cases. Prefix/suffix
  // hoisted once since EDGE_INSET's own text never changes between calls.
  const ANCHOR_PCT_PREFIX = `calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * `;
  const ANCHOR_PCT_SUFFIX = ')';

  function anchorPct(pct) {
    return `${ANCHOR_PCT_PREFIX}${pct / 100}${ANCHOR_PCT_SUFFIX}`;
  }

  // Shared by thumbPositionStyle and tickPositionStyle — both anchor onto
  // the same inset band horizontally, differing only in which transform
  // re-centers them (and, vertically, positionStyle's own simpler path).
  function anchoredPositionStyle(val, { verticalTransform, horizontalTransform }) {
    const pct = thumbPercent(val);
    if (isVertical.value) {
      return positionStyle(pct, verticalTransform);
    }
    return {
      insetInlineStart: anchorPct(pct),
      transform: horizontalTransform,
    };
  }

  function thumbPositionStyle(val) {
    return anchoredPositionStyle(val, {
      verticalTransform: `translate(${centerInlineTransform()}, 50%)`,
      horizontalTransform: `translate(${centerInlineTransform()}, -50%)`,
    });
  }

  function tickPositionStyle(val) {
    return anchoredPositionStyle(val, {
      verticalTransform: 'translateY(50%)',
      horizontalTransform: `translateX(${centerInlineTransform()})`,
    });
  }

  // A mark at min/max nudges 1px inward from the true 0%/100% edge instead
  // of centering like every other one — centering ignores the mark's own
  // width, which pokes it ~1px past the edge. Pure flush (an unadorned 0%/
  // 100%) reads as touching the label above it instead of a deliberately
  // placed mark. Distinct from ticks (above), which center on the shared
  // anchorPct band — a mark flush-aligns its own edge, not its center, so it
  // doesn't fit that same rescale. RTL-mirrored like centerInlineTransform:
  // "inward" is a physical direction that flips with which edge actually
  // sits on which side.
  function markEdgeInsetTransform(edge) {
    const inward = isRtl.value ? -1 : 1; // mirrors centerInlineTransform's own RTL flip
    if (edge === 'start') return `translateX(${inward}px)`;
    const flushPct = isRtl.value ? '100%' : '-100%';
    return `translateX(calc(${flushPct} + ${-inward}px))`;
  }

  // A mark beyond the edge-clamp tolerance of the control's edge (see
  // UseSliderCollisionAvoidance, which measures and populates
  // markEdgeOffsetPx) gets nudged inward by that excess so its text stays
  // legible instead of being clipped. Guarded by !isVertical here (not just
  // where the offset is computed) so a stale offset from a prior horizontal
  // render can never leak into vertical mode's own transform (translateY,
  // not translateX) if orientation changes reactively.
  function markStyle(pct, index, edge) {
    if (edge && !isVertical.value) return positionStyle(pct, markEdgeInsetTransform(edge));
    const offset = !isVertical.value ? markEdgeOffsetPx.value[index] : 0;
    if (!offset) return positionStyle(pct);
    return positionStyle(pct, `translateX(calc(${centerInlineTransform()} + ${offset}px))`);
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

  const indicatorStyle = computed(() => {
    if (isRange.value && internalValues.value.length === 2) {
      const [lo, hi] = internalValues.value;
      const loP = thumbPercent(lo);
      const hiP = thumbPercent(hi);
      if (isVertical.value) {
        return { bottom: `${loP}%`, height: `${hiP - loP}%` };
      }
      return { insetInlineStart: `${loP}%`, width: `${hiP - loP}%` };
    }

    const pct = thumbPercent(internalValues.value[0] ?? props.min);

    if (typeof props.fillOrigin === 'number') {
      const originPct = thumbPercent(Math.min(props.max, Math.max(props.min, props.fillOrigin)));
      const startPct = Math.min(pct, originPct);
      const sizePct = Math.abs(pct - originPct);
      if (isVertical.value) {
        return { bottom: `${startPct}%`, height: `${sizePct}%` };
      }
      return { insetInlineStart: `${startPct}%`, width: `${sizePct}%` };
    }

    // The indicator's STATIC cap (the fixed end at fillOrigin, always resting
    // at the control's true min/max, never tracked by a thumb) sits flush at
    // that edge — the OTHER edge tracks the thumb's own value and must land
    // exactly there too, matching .d-slider__track's own flush edges.
    const fillsFromEnd = props.fillOrigin === 'end';
    if (isVertical.value) {
      return fillsFromEnd
        ? { top: 0, height: `${100 - pct}%` }
        : { bottom: 0, height: `${pct}%` };
    }
    return fillsFromEnd
      ? { insetInlineEnd: 0, width: `${100 - pct}%` }
      : { insetInlineStart: 0, width: `${pct}%` };
  });

  return {
    thumbPositionStyle,
    tickPositionStyle,
    markStyle,
    mergedReadoutPct,
    mergedReadoutText,
    indicatorStyle,
  };
}
