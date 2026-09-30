import { computed } from 'vue';

// Pure positioning math shared by every element placed along the track
// (thumb, tick, mark, readout, indicator) — no DOM reads, just props +
// reactive state from UseSliderValue/UseSliderInteraction.
export function useSliderGeometry(props, { isVertical, isRange, internalValues, thumbPercent, isRtl }) {
  // Shared by every element positioned along the track (thumb, tick, mark,
  // readout) — they only differ in which transform re-centers them, so the
  // axis branch (insetInlineStart/top vs. bottom for vertical) lives in one
  // place instead of being repeated per element type. insetInlineStart (not
  // left) so the browser itself mirrors horizontal positions under
  // dir="rtl" — see getValueFromPointerEvent and onThumbKeydown
  // (UseSliderInteraction) for the two other places RTL must be handled
  // explicitly (pointer math and the hard-coded Shift+Arrow keys), since
  // neither goes through CSS.
  function positionStyle(pct, transform) {
    const style = isVertical.value ? { bottom: `${pct}%` } : { insetInlineStart: `${pct}%` };
    if (transform) style.transform = transform;
    return style;
  }

  // translateX(-50%) is the standard trick for centering an element ON its
  // insetInlineStart anchor point — shift left by half the element's own
  // width so the anchor lands at its center instead of its edge. That shift
  // is a PHYSICAL transform: transform: translateX() never mirrors under
  // dir="rtl" the way insetInlineStart does. So when the anchor itself has
  // mirrored to the physical right, the compensating shift has to flip sign
  // too (+50%, not -50%), or the element renders centered a full width away
  // from its actual anchor — which is exactly what caused the thumb/indicator
  // gap and mark misalignment under RTL before this existed. This applies
  // regardless of orientation — insetInlineStart is still the horizontal/
  // inline axis even for a vertical slider (it's used there to center the
  // narrow track/thumb within the wider control area), since orientation is
  // a layout convention, not a CSS writing-mode change.
  function centerInlineTransform() {
    return isRtl() ? '50%' : '-50%';
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
    positionStyle,
    centerInlineTransform,
    thumbPositionStyle,
    tickPositionStyle,
    indicatorStyle,
  };
}
