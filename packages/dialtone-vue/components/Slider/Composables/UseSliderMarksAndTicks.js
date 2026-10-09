import { computed } from 'vue';
import { generateInterval } from '../utils';

export function useSliderMarksAndTicks(props, { isVertical, thumbPercent }) {
  const computedTickValues = computed(() => {
    const interval = typeof props.showTicks === 'number' ? props.showTicks : props.step;
    if (!interval || interval <= 0) return [];
    return generateInterval(props.min, props.max, interval, 'ticks');
  });

  // A mark isn't tied to either thumb, so there's no meaningful index for
  // getValueText (its whole purpose is per-thumb meaning, e.g. "Minimum"/
  // "Maximum"). Only prefix/suffix apply; anything more specific belongs in
  // that mark's own explicit `text`, which bypasses this entirely.
  function formatMarkValue(value) {
    return `${props.prefix}${value}${props.suffix}`;
  }

  const computedMarks = computed(() => {
    const source = props.showMarks === true ? [props.min, props.max] : (props.showMarks || []);
    return source.map((item) => {
      const value = typeof item === 'number' ? item : item.value;
      const text = typeof item === 'number' ? formatMarkValue(item) : (item.text ?? formatMarkValue(value));
      // A mark landing exactly on min/max is edge-aligned (flush to the track's
      // own edge) rather than centered — see markStyle (UseSliderGeometry).
      const edge = value === props.min ? 'start' : value === props.max ? 'end' : null;
      return { text, pct: thumbPercent(value), edge };
    });
  });

  // Marks/readout are position:absolute (see slider.less) so they don't push
  // following content down on their own, even though they render below the
  // track — a sibling right after <dt-slider> would overlap them. Only relevant
  // horizontally: in vertical mode marks/readout sit to the side of the track,
  // not below it. Ticks don't need this — they sit close enough to the track to
  // stay within the control's own box (see slider.less). A tooltip-styled readout
  // renders above the thumb instead of in this row, so it doesn't need the space
  // either — when nothing else does (no marks, readout isn't in-row), there's
  // nothing below the track to reserve space for; a parent controls spacing/gaps.
  const reservesAnnotationSpace = computed(() => (
    !isVertical.value && (
      computedMarks.value.length > 0 || (props.readout !== 'never' && props.readout !== 'tooltip')
    )
  ));

  return {
    computedTickValues,
    computedMarks,
    reservesAnnotationSpace,
  };
}
