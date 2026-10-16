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

  // The usable area the thumb (and ticks, which share its travel band)
  // anchor within — defined once in slider.less (--slider-edge-inset) as the
  // thumb's own worst-case rendered radius (the --active state's 1.05x drag
  // scale bump included; its border is already inside that size, box-sizing:
  // border-box — see --slider-edge-inset's own comment), so the thumb can
  // never render past a consumer's own `overflow: hidden` wrapper.
  // .d-slider__track itself stays flush with the true 0%/100% edges
  // regardless — only the indicator's own thumb-tracking edges reuse this
  // same band (see indicatorStyle), so they land under the thumb instead of
  // poking past it. See --slider-edge-inset's own comment for why this can't
  // just be .d-slider__control's own (much more generous, but internal-only)
  // overflow-clip-margin.
  const EDGE_INSET = 'var(--slider-edge-inset)';

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

  // Width/height between two anchored positions collapses to a pure function
  // of their percentage delta — anchorPct(a) - anchorPct(b), with a - b ==
  // deltaPct, cancels both EDGE_INSET terms down to this. Used by
  // indicatorStyle wherever its span sits between two values on the same
  // anchored scale as the thumb (both thumbs in range mode, or a fillOrigin
  // value and a thumb) — staying on that same scale is what lets the
  // indicator's own edge land under the thumb that's covering it, instead of
  // poking past the thumb's own rendered radius.
  function anchorSpanPct(deltaPct) {
    return `calc((100% - ${EDGE_INSET} * 2) * ${deltaPct / 100})`;
  }

  // Shared by thumbPositionStyle and tickPositionStyle — both anchor onto
  // the same inset band regardless of orientation, differing only in which
  // transform re-centers them. Vertical used to fall through to
  // positionStyle's raw pct% (no inset at all) — the thumb's own radius
  // poked past the control's block-start/end edge at 0/100 exactly the same
  // way it did on the inline axis before this inset existed.
  function anchoredPositionStyle(val, { verticalTransform, horizontalTransform }) {
    const pct = thumbPercent(val);
    if (isVertical.value) {
      return { bottom: anchorPct(pct), transform: verticalTransform };
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
        // Matches thumbPositionStyle's own inset anchor (see its comment) —
        // raw pct here would drift apart from the thumb's actual position
        // near 0/100 now that the thumb itself anchors onto the inset band.
        bottom: anchorPct(pct),
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

  // Every edge that tracks an actual thumb value anchors onto the same
  // inset band as the thumb itself (anchorPct/anchorSpanPct) — not the raw
  // percentage .d-slider__track uses — so that edge always lands under the
  // thumb's own rendered circle instead of poking a sliver of color past it
  // (the thumb is wide enough to cover the gap this leaves against the
  // track's own flush edge; see --slider-edge-inset's comment in slider.less).
  // The one edge with no thumb anywhere near it — the default mode's fixed
  // fillOrigin end — has nothing to hide a mismatch under, so it stays
  // literally flush at 0/100%, same as the track.
  const indicatorStyle = computed(() => {
    if (isRange.value && internalValues.value.length === 2) {
      const [lo, hi] = internalValues.value;
      const loP = thumbPercent(lo);
      const hiP = thumbPercent(hi);
      if (isVertical.value) {
        return { bottom: anchorPct(loP), height: anchorSpanPct(hiP - loP) };
      }
      return { insetInlineStart: anchorPct(loP), width: anchorSpanPct(hiP - loP) };
    }

    const pct = thumbPercent(internalValues.value[0] ?? props.min);

    if (typeof props.fillOrigin === 'number') {
      const originPct = thumbPercent(Math.min(props.max, Math.max(props.min, props.fillOrigin)));
      const startPct = Math.min(pct, originPct);
      const sizePct = Math.abs(pct - originPct);
      if (isVertical.value) {
        return { bottom: anchorPct(startPct), height: anchorSpanPct(sizePct) };
      }
      return { insetInlineStart: anchorPct(startPct), width: anchorSpanPct(sizePct) };
    }

    const fillsFromEnd = props.fillOrigin === 'end';
    if (isVertical.value) {
      return fillsFromEnd
        ? { top: 0, height: `calc(100% - ${anchorPct(pct)})` }
        : { bottom: 0, height: anchorPct(pct) };
    }
    return fillsFromEnd
      ? { insetInlineEnd: 0, width: `calc(100% - ${anchorPct(pct)})` }
      : { insetInlineStart: 0, width: anchorPct(pct) };
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
