import { computed, hasInjectionContext, inject, provide, unref } from 'vue';
import {
  FEATURE_AWARENESS_BADGE_DEFAULTS,
  FEATURE_AWARENESS_BADGE_DEFAULTS_KEY,
} from '../BadgeConstants';

function normalizeInteger (value) {
  const normalized = Number(unref(value));
  return Number.isInteger(normalized) ? normalized : null;
}

function validateThresholds (thresholds) {
  const newThreshold = normalizeInteger(thresholds.new);
  const lifecycleThreshold = normalizeInteger(thresholds.lifecycle);
  const hiddenThreshold = normalizeInteger(thresholds.hidden);

  if (
    newThreshold === null ||
    lifecycleThreshold === null ||
    hiddenThreshold === null ||
    newThreshold < 0 ||
    lifecycleThreshold <= newThreshold ||
    hiddenThreshold <= lifecycleThreshold
  ) {
    console.warn(
      'DtBadge warning: feature awareness thresholds must be ascending non-negative integers. ' +
      'Using Dialtone defaults.',
    );
    return FEATURE_AWARENESS_BADGE_DEFAULTS.thresholds;
  }

  return {
    new: newThreshold,
    lifecycle: lifecycleThreshold,
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
 * @param {object} options
 * @param {number} options.exposureCount Count owned by the consuming app.
 * @param {object} options.thresholds Ascending stage thresholds.
 * @returns {{variant: import('vue').ComputedRef<string>, emphasis: import('vue').ComputedRef<string>, stage: import('vue').ComputedRef<string>, isVisible: import('vue').ComputedRef<boolean>}}
 */
export function useFeatureAwarenessBadge (options = {}) {
  const injectedDefaults = hasInjectionContext()
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
    if (exposureCount.value >= thresholds.value.lifecycle) return 'lifecycle';
    return 'new';
  });

  const isVisible = computed(() => stage.value !== 'hidden');

  const variant = computed(() => {
    if (!isVisible.value) return 'base';
    return resolvedOptions.value.stages[stage.value]?.variant ||
      FEATURE_AWARENESS_BADGE_DEFAULTS.stages[stage.value].variant;
  });

  const emphasis = computed(() => {
    if (!isVisible.value) return 'base';
    return resolvedOptions.value.stages[stage.value]?.emphasis ||
      FEATURE_AWARENESS_BADGE_DEFAULTS.stages[stage.value].emphasis;
  });

  return {
    variant,
    emphasis,
    stage,
    isVisible,
  };
}
