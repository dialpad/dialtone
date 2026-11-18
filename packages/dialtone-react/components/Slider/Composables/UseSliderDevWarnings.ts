import { useEffect, useRef } from 'react';
import { isDevelopment } from '../../../common/dev';
import type { ResolvedSliderProps } from './types';

/**
 * Vue's `watch(() => condition, fn, { immediate: true })`: logs when the condition turns true, on mount included, and
 * again only after it has turned false and back. The ref keeps StrictMode's second mount from logging twice.
 */
function useInfoWhen (condition: boolean, message: () => string) {
  const seen = useRef<boolean | null>(null);
  useEffect(() => {
    if (seen.current === condition) return;
    seen.current = condition;
    if (condition && isDevelopment()) console.info(message());
    // message reads the props this condition was computed from; the condition alone decides when to log.
  }, [condition]);
}

// Condition-sourced, not value-sourced — hasAccessibleName's probe reads the
// current value, which changes every drag tick; a boolean only fires when the
// warning condition flips. Development builds only, per this repo's
// dev-warning convention.
export function useSliderDevWarnings (
  props: ResolvedSliderProps,
  { isRange, hasAccessibleName }: { isRange: boolean; hasAccessibleName: boolean },
) {
  useInfoWhen(
    isRange && !props.getValueText,
    () => '[Dialtone] DtSlider in range mode: provide getValueText to give each thumb a distinct screen-reader description.',
  );

  useInfoWhen(
    !hasAccessibleName,
    () => '[Dialtone] DtSlider: provide a label prop (set showLabel to false to hide it visually) or aria-label for accessibility.',
  );

  // Every gap computation rounds minGapSteps to the nearest integer before
  // multiplying by step — warn instead of leaving the mismatch undiscoverable.
  useInfoWhen(
    props.minGapSteps !== Math.round(props.minGapSteps),
    () => `[Dialtone] DtSlider: minGapSteps (${props.minGapSteps}) is not a whole number — it will be rounded to ${Math.round(props.minGapSteps)}.`,
  );

  // clampToRange (UseSliderValue) silently collapses every value to max when
  // min > max — almost always a prop-wiring bug upstream.
  useInfoWhen(
    props.min > props.max,
    () => `[Dialtone] DtSlider: min (${props.min}) is greater than max (${props.max}) — every value will collapse to max.`,
  );
}
