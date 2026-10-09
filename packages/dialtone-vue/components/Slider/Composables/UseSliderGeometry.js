import { computed } from 'vue';
import { SLIDER_EDGE_CLAMP_TOLERANCE_PX } from '../SliderConstants';
import { edgeClampOffset, mirrorPct } from '../utils';

// Pure positioning math shared by every element placed along the track
// (thumb, tick, mark, readout, indicator) — no DOM reads, just props +
// reactive state from UseSliderValue/UseSliderDirection/
// UseSliderCollisionAvoidance (markEdgeOffsetPx, controlRect, tooltipWidthPx).
export function useSliderGeometry(props, {
  isVertical,
  isRange,
  internalValues,
  thumbPercent,
  isRtl,
  markEdgeOffsetPx,
  controlRect,
  tooltipWidthPx,
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

  // A mark at min/max flush-aligns to the track edge instead of centering;
  // end uses the mark's own width, not half (RTL-mirrored like centerInlineTransform).
  function edgeAlignedTransform (edge) {
    if (edge === 'start') return 'translateX(0)';
    return `translateX(${isRtl.value ? '100%' : '-100%'})`;
  }

  // A mark beyond the edge-clamp tolerance of the control's edge (see
  // UseSliderCollisionAvoidance, which measures and populates
  // markEdgeOffsetPx) gets nudged inward by that excess so its text stays
  // legible instead of being clipped. Guarded by !isVertical here (not just
  // where the offset is computed) so a stale offset from a prior horizontal
  // render can never leak into vertical mode's own transform (translateY,
  // not translateX) if orientation changes reactively.
  function markStyle(pct, index, edge) {
    if (edge && !isVertical.value) return positionStyle(pct, edgeAlignedTransform(edge));
    const offset = !isVertical.value ? markEdgeOffsetPx.value[index] : 0;
    if (!offset) return positionStyle(pct);
    return positionStyle(pct, `translateX(calc(${centerInlineTransform()} + ${offset}px))`);
  }

  // Tooltip-styled readout: borrows .d-tooltip CSS, positioned by percent
  // math like marks (no measurement/polling loop). Above thumb horizontally;
  // beside it vertically.
  const tooltipReadoutArrowClass = computed(() => (
    isVertical.value ? 'd-tooltip__arrow--left-center' : 'd-tooltip__arrow--bottom-center'
  ));

  // Hugs the thumb without overlapping the tooltip arrow's ~6px protrusion.
  const tooltipReadoutGapPx = 'var(--dt-spacing-150)'; // 12px

  // Horizontal-only clamp, same tolerance marks use minus a small safety
  // margin — sub-pixel noise can tip an unmargined clamp back and forth at
  // the boundary during a drag. Computed synchronously from pct so the
  // offset reacts instantly.
  const TOOLTIP_CLAMP_SAFETY_MARGIN_PX = 4;
  const TOOLTIP_EDGE_CLAMP_TOLERANCE_PX = SLIDER_EDGE_CLAMP_TOLERANCE_PX - TOOLTIP_CLAMP_SAFETY_MARGIN_PX;

  function tooltipEdgeOffset(pct, index) {
    const rect = controlRect.value;
    const width = tooltipWidthPx.value[index];
    if (!rect || !width) return 0;
    const controlWidth = rect.right - rect.left;
    if (!controlWidth) return 0;
    const centerPx = rect.left + (mirrorPct(pct, isRtl.value) / 100) * controlWidth;
    return edgeClampOffset(centerPx - width / 2, centerPx + width / 2, rect, TOOLTIP_EDGE_CLAMP_TOLERANCE_PX);
  }

  function tooltipReadoutStyle(val, index) {
    const pct = thumbPercent(val);
    if (isVertical.value) {
      return {
        bottom: `${pct}%`,
        insetInlineStart: `calc(50% + var(--slider-thumb-visual-size) / 2 + ${tooltipReadoutGapPx})`,
        transform: 'translateY(50%)',
      };
    }
    const offset = tooltipEdgeOffset(pct, index);
    const transform = offset
      ? `translateX(calc(${centerInlineTransform()} + ${offset}px))`
      : `translateX(${centerInlineTransform()})`;
    return {
      insetInlineStart: `${pct}%`,
      insetBlockEnd: `calc(50% + var(--slider-thumb-visual-size) / 2 + ${tooltipReadoutGapPx})`,
      transform,
      // Bridges into the ::after arrow rule (slider.less) since inline style
      // can't target a pseudo-element; negated so the arrow stays visually
      // anchored to the thumb when the bubble shifts.
      '--tooltip-arrow-offset': `${-offset}px`,
    };
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

    // Half the track's own height — how far the indicator's STATIC cap (the
    // fixed end at fillOrigin, always resting at the control's true min/max,
    // never tracked by a thumb) pokes outward past the control's edge, so
    // its rounded end renders fully exposed instead of clipped flush against
    // it. Grows the box by this amount while shifting its start by the same
    // amount, so only this fixed edge moves — the OTHER edge tracks the
    // thumb's own value and must land exactly there, no overshoot.
    const capExtension = 'calc(var(--slider-track-height) / 2)';

    // The inline-end cap gets an extra --dt-size-border-100 over the
    // inline-start cap — a visual balance call (see .d-slider__track's own
    // matching asymmetry in slider.less). Horizontal only — vertical mode's
    // top/bottom caps stay symmetric.
    const capExtensionInlineEnd = `calc(${capExtension} + var(--dt-size-border-100))`;

    const fillsFromEnd = props.fillOrigin === 'end';
    if (isVertical.value) {
      return fillsFromEnd
        ? { top: `calc(${capExtension} * -1)`, height: `calc(${100 - pct}% + ${capExtension})` }
        : { bottom: `calc(${capExtension} * -1)`, height: `calc(${pct}% + ${capExtension})` };
    }
    return fillsFromEnd
      ? { insetInlineEnd: `calc(${capExtensionInlineEnd} * -1)`, width: `calc(${100 - pct}% + ${capExtensionInlineEnd})` }
      : { insetInlineStart: `calc(${capExtension} * -1)`, width: `calc(${pct}% + ${capExtension})` };
  });

  return {
    thumbPositionStyle,
    tickPositionStyle,
    markStyle,
    tooltipReadoutArrowClass,
    tooltipReadoutStyle,
    mergedReadoutPct,
    mergedReadoutText,
    indicatorStyle,
  };
}
