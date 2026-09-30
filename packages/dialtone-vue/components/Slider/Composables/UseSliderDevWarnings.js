import { watch } from 'vue';

// Boolean-sourced watch()es (not a bare watchEffect reading currentValue
// directly) — hasVisibleLabel's hasSlotContent probe reads currentValue.value
// to avoid crashing on a scoped #label slot, and currentValue changes on
// every drag tick. A watchEffect tracking that read directly would re-run —
// and re-log — on every tick too; a boolean source only invokes the callback
// when the WARNING CONDITION itself actually flips, which is the only time
// there's anything new to warn about.
//
// { immediate: true } (not onMounted) because a consumer can legitimately
// change label/getValueText after mount (e.g. reactively clearing label once
// a heading it depends on loads) — a one-shot mount check would silently
// stop warning about a real regression the moment it happens after the
// initial paint.
//
// Guarded by NODE_ENV, matching this repo's convention for dev-only console
// warnings (see e.g. DtButton, DtTextList, DtProse) — a library can't assume
// every downstream consumer strips console calls from their own production
// build, so an unguarded call here would log in every consumer's production
// app, not just during local development.
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

  // showLabel is a purely visual modifier (see the #label template branch
  // and the sr-only class above) — it hides label content, it doesn't
  // create it. Checking it here as if it were its own accessible-name
  // source let showLabel={false} without a label ship with no name and no
  // warning, while a valid aria-label-only consumer got warned unnecessarily.
  // aria-labelledby is also a valid accessible-name source (see the thumb's
  // own aria-labelledby/aria-label fallback logic) — a consumer using that
  // standard pattern shouldn't be warned either. hasVisibleLabel already
  // covers the label prop/slot half of this.
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
