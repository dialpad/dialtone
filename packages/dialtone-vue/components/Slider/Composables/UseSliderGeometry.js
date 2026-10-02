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

  function thumbPositionStyle(val) {
    const transform = isVertical.value
      ? `translate(${centerInlineTransform()}, 50%)`
      : `translate(${centerInlineTransform()}, -50%)`;
    return positionStyle(thumbPercent(val), transform);
  }

  function tickPositionStyle(val) {
    const transform = isVertical.value ? 'translateY(50%)' : `translateX(${centerInlineTransform()})`;
    return positionStyle(thumbPercent(val), transform);
  }

  // A mark beyond the edge-clamp tolerance of the control's edge (see
  // UseSliderCollisionAvoidance, which measures and populates
  // markEdgeOffsetPx) gets nudged inward by that excess so its text stays
  // legible instead of being clipped. Guarded by !isVertical here (not just
  // where the offset is computed) so a stale offset from a prior horizontal
  // render can never leak into vertical mode's own transform (translateY,
  // not translateX) if orientation changes reactively.
  function markStyle(pct, index) {
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

    const fillsFromEnd = props.fillOrigin === 'end';
    if (isVertical.value) {
      return fillsFromEnd
        ? { top: '0', height: `${100 - pct}%` }
        : { bottom: '0', height: `${pct}%` };
    }
    return fillsFromEnd
      ? { insetInlineEnd: '0', width: `${100 - pct}%` }
      : { insetInlineStart: '0', width: `${pct}%` };
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
