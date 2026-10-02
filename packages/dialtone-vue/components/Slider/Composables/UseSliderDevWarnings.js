import { watch } from 'vue';

// Boolean-sourced watch()es, not watchEffect — hasVisibleLabel's probe reads
// currentValue, which changes every drag tick, so a direct watchEffect would
// re-log constantly; a boolean only fires when the warning condition flips.
// { immediate: true } (not onMounted) since label/getValueText can legitimately
// change after mount. Guarded by NODE_ENV per this repo's dev-warning
// convention (DtButton, DtTextList, DtProse) — consumers' production builds
// shouldn't log library console calls.
export function useSliderDevWarnings(props, { isRange, hasVisibleLabel, attrs }) {
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

  // showLabel only hides label content, it doesn't create an accessible name —
  // treating it as its own name source let showLabel={false} ship silently
  // unnamed. aria-labelledby is also a valid name source and shouldn't warn.
  watch(
    () => !!(hasVisibleLabel.value || attrs['aria-label'] || attrs['aria-labelledby']),
    (hasAccessibleName) => {
      if (!hasAccessibleName) {
        console.info(
          '[Dialtone] DtSlider: provide a label prop (set showLabel to false to hide it visually) or aria-label for accessibility.',
        );
      }
    },
    { immediate: true },
  );
}
