import { computed, getCurrentInstance, inject, provide, unref } from 'vue';
import {
  FEATURE_AWARENESS_BADGE_DEFAULTS,
  FEATURE_AWARENESS_BADGE_DEFAULTS_KEY,
} from '../BadgeConstants';

function normalizeInteger (value) {
  const normalized = Number(unref(value));
  return Number.isInteger(normalized) ? normalized : null;
}

function validateThresholds (thresholds) {
  const releaseThreshold = normalizeInteger(thresholds.release);
  const hiddenThreshold = normalizeInteger(thresholds.hidden);

  if (
    releaseThreshold === null ||
    hiddenThreshold === null ||
    releaseThreshold < 0 ||
    hiddenThreshold <= releaseThreshold
  ) {
    console.warn(
      'DtBadge warning: feature awareness thresholds must be ascending non-negative integers. ' +
      'Using Dialtone defaults.',
    );
    return FEATURE_AWARENESS_BADGE_DEFAULTS.thresholds;
  }

  return {
    release: releaseThreshold,
    hidden: hiddenThreshold,
  };
}

function resolveOptions (options, injectedDefaults) {
  return {
    ...FEATURE_AWARENESS_BADGE_DEFAULTS,
    ...injectedDefaults,
    ...options,
    thresholds: {
      ...FEATURE_AWARENESS_BADGE_DEFAULTS.thresholds,
      ...injectedDefaults?.thresholds,
      ...options.thresholds,
    },
    stages: {
      ...FEATURE_AWARENESS_BADGE_DEFAULTS.stages,
      ...injectedDefaults?.stages,
      ...options.stages,
    },
  };
}

/**
 * Provide app-level feature awareness badge defaults.
 *
 * Product code still owns persistence, exposure counting, label text, and i18n.
 */
export function provideFeatureAwarenessBadgeDefaults (defaults) {
  provide(FEATURE_AWARENESS_BADGE_DEFAULTS_KEY, defaults);
}

/**
 * Resolves Badge props for staged feature awareness.
 *
 * The badge starts in the `new` stage, moves to `release` at `thresholds.release` and is hidden at
 * `thresholds.hidden`. The stages are looks, not statements about availability: see `stages`.
 *
 * @param {object | import('vue').Ref<object>} [options]
 * @param {number | import('vue').Ref<number>} [options.exposureCount] Count owned by the consuming app. Defaults to 0.
 * @param {object} [options.thresholds] Exposure counts that end a stage. Both are optional.
 * @param {number} [options.thresholds.release] Count at which the badge moves to the release stage. Default 3.
 * @param {number} [options.thresholds.hidden] Count at which the badge is hidden. Default 10.
 * @param {object} [options.stages] Overrides for the variant and emphasis of each stage.
 * @param {{variant?: string, emphasis?: string}} [options.stages.new] Default: pre-release, strong.
 * @param {{variant?: string, emphasis?: string}} [options.stages.release] Default: release, base.
 * @returns {{kind: import('vue').ComputedRef<string>, variant: import('vue').ComputedRef<string>, emphasis: import('vue').ComputedRef<string>, stage: import('vue').ComputedRef<string>, isVisible: import('vue').ComputedRef<boolean>}}
 */
export function useFeatureAwarenessBadge (options = {}) {
  // getCurrentInstance works on every supported Vue 3 version; hasInjectionContext needs 3.3.
  const injectedDefaults = getCurrentInstance()
    ? inject(FEATURE_AWARENESS_BADGE_DEFAULTS_KEY, null)
    : null;

  const resolvedOptions = computed(() => resolveOptions(unref(options), unref(injectedDefaults)));

  const thresholds = computed(() => validateThresholds(resolvedOptions.value.thresholds));

  const exposureCount = computed(() => {
    const count = normalizeInteger(resolvedOptions.value.exposureCount ?? resolvedOptions.value.count ?? 0);
    return Math.max(0, count ?? 0);
  });

  const stage = computed(() => {
    if (exposureCount.value >= thresholds.value.hidden) return 'hidden';
    if (exposureCount.value >= thresholds.value.release) return 'release';
    return 'new';
  });

  const isVisible = computed(() => stage.value !== 'hidden');

  // A hidden badge has no stage of its own, so it keeps the last stage's look. "base" is not a variant.
  const lookStage = computed(() => (isVisible.value ? stage.value : 'release'));

  // Every variant here belongs to the release group, so a badge using it needs kind="release".
  const kind = computed(() => 'release');

  const variant = computed(() => {
    return resolvedOptions.value.stages[lookStage.value]?.variant ||
      FEATURE_AWARENESS_BADGE_DEFAULTS.stages[lookStage.value].variant;
  });

  const emphasis = computed(() => {
    return resolvedOptions.value.stages[lookStage.value]?.emphasis ||
      FEATURE_AWARENESS_BADGE_DEFAULTS.stages[lookStage.value].emphasis;
  });

  return {
    kind,
    variant,    emphasis,
    stage,
    isVisible,
  };
}
