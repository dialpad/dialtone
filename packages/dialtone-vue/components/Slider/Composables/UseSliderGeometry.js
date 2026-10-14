import { computed } from 'vue';
import { SLIDER_TOOLTIP_EDGE_CLAMP_TOLERANCE_PX } from '../SliderConstants';
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
  // rather than only the edges standing out as special cases.
  function anchorPct(pct) {
    return `calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * ${pct / 100})`;
  }

  function thumbPositionStyle(val) {
    const pct = thumbPercent(val);
    if (isVertical.value) {
      return positionStyle(pct, `translate(${centerInlineTransform()}, 50%)`);
    }
    return {
      insetInlineStart: anchorPct(pct),
      transform: `translate(${centerInlineTransform()}, -50%)`,
    };
  }

  function tickPositionStyle(val) {
    const pct = thumbPercent(val);
    if (isVertical.value) {
      return positionStyle(pct, 'translateY(50%)');
    }
    return {
      insetInlineStart: anchorPct(pct),
      transform: `translateX(${centerInlineTransform()})`,
    };
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
    if (edge === 'start') return `translateX(${isRtl.value ? '-1px' : '1px'})`;
    const flushPct = isRtl.value ? '100%' : '-100%';
    const inwardPx = isRtl.value ? '1px' : '-1px';
    return `translateX(calc(${flushPct} + ${inwardPx}))`;
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

  // Tooltip-styled readout: borrows .d-tooltip CSS, positioned by percent
  // math like marks (no measurement/polling loop). Above thumb horizontally;
  // beside it vertically.
  const tooltipReadoutArrowClass = computed(() => (
    isVertical.value ? 'd-tooltip__arrow--left-center' : 'd-tooltip__arrow--bottom-center'
  ));

  // Hugs the thumb without overlapping the tooltip arrow's ~6px protrusion.
  // Deliberately smaller than it could visually afford to be: the bubble's
  // vertical poke above .d-slider__control's own block-start edge (which
  // overflow-clip-margin, slider.less, gives ~32px of clipped room to render
  // into) measures flush against that budget with under 1px of slack at
  // --dt-spacing-150 (12px) — any larger and the bubble starts getting
  // clipped. This leaves real slack instead of growing the clip margin,
  // which is shared across all four sides and would leak out as a visible
  // horizontal scrollbar everywhere else the margin is too generous.
  const tooltipReadoutGapPx = 'var(--dt-spacing-100)'; // 8px

  // Computed synchronously from pct so the offset reacts instantly.
  function tooltipEdgeOffset(pct, index) {
    const rect = controlRect.value;
    const width = tooltipWidthPx.value[index];
    if (!rect || !width) return 0;
    const controlWidth = rect.right - rect.left;
    if (!controlWidth) return 0;
    const centerPx = rect.left + (mirrorPct(pct, isRtl.value) / 100) * controlWidth;
    return edgeClampOffset(centerPx - width / 2, centerPx + width / 2, rect, SLIDER_TOOLTIP_EDGE_CLAMP_TOLERANCE_PX);
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
      // Matches thumbPositionStyle's own inset anchor so the bubble (and its
      // arrow) stay attached to the thumb's actual rendered position, not
      // the control's true edge.
      insetInlineStart: anchorPct(pct),
      insetBlockEnd: `calc(50% + var(--slider-thumb-visual-size) / 2 + ${tooltipReadoutGapPx})`,
      transform,
      // Bridges into the ::after arrow rule (slider.less) since inline style
      // can't target a pseudo-element; negated so the arrow stays visually
      // anchored to the thumb when the bubble shifts. offset itself is a
      // physical pixel value, but the arrow rule positions via
      // inset-inline-start — a logical property the browser mirrors under
      // dir="rtl" — so the sign has to flip under RTL too, same as
      // centerInlineTransform, or the browser's own mirroring doubles up
      // with this one and sends the arrow the wrong physical direction.
      '--tooltip-arrow-offset': `${isRtl.value ? offset : -offset}px`,
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
    tooltipReadoutArrowClass,
    tooltipReadoutStyle,
    mergedReadoutPct,
    mergedReadoutText,
    indicatorStyle,
  };
}
