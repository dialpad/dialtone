import { useMemo } from 'react';
import { generateInterval, isValidMark } from '../utils';
import type { ResolvedSliderProps } from './types';

/** A mark ready to render: its text, its position, and whether it sits on min or max. */
export interface ComputedMark {
  text: string;
  pct: number;
  edge: 'start' | 'end' | null;
}

export function useSliderMarksAndTicks (
  props: ResolvedSliderProps,
  { isVertical, thumbPercent }: { isVertical: boolean; thumbPercent: (val: number) => number },
) {
  const { showTicks, step, min, max, prefix, suffix, showMarks, readout } = props;

  // Memoized like Vue's computed, so a capped interval's notice logs once per change.
  const computedTickValues = useMemo(() => {
    const interval = typeof showTicks === 'number' ? showTicks : step;
    if (!interval || interval <= 0) return [];
    return generateInterval(min, max, interval, 'ticks');
  }, [showTicks, step, min, max]);

  // A mark isn't tied to either thumb, so there's no meaningful index for
  // getValueText. Only prefix/suffix apply; anything more specific belongs in
  // that mark's own explicit `text`, which bypasses this entirely.
  function formatMarkValue (value: number): string {
    return `${prefix}${value}${suffix}`;
  }

  const source = showMarks === true ? [min, max] : showMarks;
  const computedMarks: ComputedMark[] = !Array.isArray(source)
    ? []
    : source.filter(isValidMark).map((item) => {
      const value = typeof item === 'number' ? item : item.value;
      const text = typeof item === 'number' ? formatMarkValue(item) : (item.text ?? formatMarkValue(value));
      // A mark landing exactly on min/max is edge-aligned (flush to the track's
      // own edge) rather than centered — see markStyle (UseSliderGeometry).
      const edge = value === min ? 'start' : value === max ? 'end' : null;
      return { text, pct: thumbPercent(value), edge };
    });

  // Marks/readout are position:absolute (see slider.less) so they don't push
  // following content down on their own. Only relevant horizontally; a
  // tooltip-styled readout renders above the thumb instead of in this row.
  const reservesAnnotationSpace = !isVertical && (computedMarks.length > 0 || readout === 'always');

  return { computedTickValues, computedMarks, reservesAnnotationSpace };
}
