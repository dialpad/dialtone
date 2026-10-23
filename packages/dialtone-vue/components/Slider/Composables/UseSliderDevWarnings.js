import { watch } from 'vue';

// Boolean-sourced watch()es, not watchEffect — hasLabelContent's probe reads
// currentValue, which changes every drag tick, so a direct watchEffect would
// re-log constantly; a boolean only fires when the warning condition flips.
// { immediate: true } (not onMounted) since label/getValueText can legitimately
// change after mount. Guarded by NODE_ENV per this repo's dev-warning
// convention (DtButton, DtTextList, DtProse) — consumers' production builds
// shouldn't log library console calls.
export function useSliderDevWarnings(props, { isRange, hasAccessibleName }) {
  if (process.env.NODE_ENV === 'production') return;

  watch(
    () => isRange.value && !props.getValueText,
    (missingValueText) => {
      if (missingValueText) {
        console.info(
          '[Dialtone] DtSlider in range mode: provide getValueText to give each thumb a distinct screen-reader description.',
        );
      }
    },
    { immediate: true },
  );

  watch(
    () => hasAccessibleName.value,
    (hasName) => {
      if (!hasName) {
        console.info(
          '[Dialtone] DtSlider: provide a label prop (set showLabel to false to hide it visually) or aria-label for accessibility.',
        );
      }
    },
    { immediate: true },
  );

  // Every gap computation (UseSliderValue, UseSliderInteraction) rounds
  // minGapSteps to the nearest integer before multiplying by step — a
  // fractional value is silently coerced rather than rejected, so warn
  // instead of leaving the mismatch undiscoverable.
  watch(
    () => props.minGapSteps !== Math.round(props.minGapSteps),
    (isFractional) => {
      if (isFractional) {
        console.info(
          `[Dialtone] DtSlider: minGapSteps (${props.minGapSteps}) is not a whole number — it will be rounded to ${Math.round(props.minGapSteps)}.`,
        );
      }
    },
    { immediate: true },
  );

  // clampToRange (UseSliderValue) silently collapses every value to max when
  // min > max, with no indication anything's wrong — this is almost always a
  // prop-wiring bug upstream, not an intentional inverted range.
  watch(
    () => props.min > props.max,
    (isInverted) => {
      if (isInverted) {
        console.info(
          `[Dialtone] DtSlider: min (${props.min}) is greater than max (${props.max}) — every value will collapse to max.`,
        );
      }
    },
    { immediate: true },
  );
}
