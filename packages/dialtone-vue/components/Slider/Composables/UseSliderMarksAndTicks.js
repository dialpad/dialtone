import { computed } from 'vue';
import { generateInterval } from '../utils';

export function useSliderMarksAndTicks(props, { isVertical, thumbPercent }) {
  // Independent of whether ticks render visually (gated separately by the
  // template's v-if="ticks") — computedMarks also reads this for marks="true"
  // (mark every tick position), regardless of whether ticks itself is set.
  const computedTickValues = computed(() => {
    const interval = typeof props.ticks === 'number' ? props.ticks : props.step;
    if (!interval || interval <= 0) return [];
    return generateInterval(props.min, props.max, interval, 'ticks');
  });

  // A mark isn't tied to either thumb, so unlike formatValue (UseSliderValue)
  // there's no meaningful index to pass getValueText — that function's whole
  // purpose is letting a dual-thumb slider give each thumb a *different*
  // meaning (e.g. "Minimum"/"Maximum"), which has no correct answer for a
  // fixed reference point on the track. Only prefix/suffix apply here, same
  // as a bare number would get; anything more specific belongs in that
  // mark's own explicit `text`, which bypasses this function entirely (see
  // computedMarks below).
  function formatMarkValue(value) {
    return `${props.prefix}${value}${props.suffix}`;
  }

  const computedMarks = computed(() => {
    let source;
    if (props.marks === undefined) {
      // Default: start and end, unless the consumer opts in to every tick (true),
      // provides their own array, or opts out entirely (false).
      source = [props.min, props.max];
    } else if (props.marks === true) {
      source = computedTickValues.value;
    } else {
      source = props.marks || [];
    }
    return source.map((item) => {
      const value = typeof item === 'number' ? item : item.value;
      const text = typeof item === 'number' ? formatMarkValue(item) : (item.text ?? formatMarkValue(value));
      return { text, pct: thumbPercent(value) };
    });
  });

  // Marks/readout are position:absolute (see slider.less) so they don't push
  // following content down on their own, even though they render below the
  // track — a sibling right after <dt-slider> would overlap them. Only relevant
  // horizontally: in vertical mode marks/readout sit to the side of the track,
  // not below it. Ticks don't need this — they sit close enough to the track to
  // stay within the control's own box (see slider.less).
  const reservesAnnotationSpace = computed(() => (
    !isVertical.value && (computedMarks.value.length > 0 || props.readout !== 'never')
  ));

  return {
    computedTickValues,
    computedMarks,
    reservesAnnotationSpace,
  };
}
