export { default as DtBadge } from './Badge.vue';
export {
  BADGE_GROUPS,
  BADGE_VARIANT_MODIFIERS,
  BADGE_EMPHASIS_MODIFIERS,
  BADGE_SIZE_MODIFIERS,
  BADGE_TYPE_MODIFIERS,
  BADGE_DECORATION_MODIFIERS,
  FEATURE_AWARENESS_BADGE_DEFAULTS,
  FEATURE_AWARENESS_BADGE_DEFAULTS_KEY,
} from './BadgeConstants';
export {
  provideFeatureAwarenessBadgeDefaults,
  useFeatureAwarenessBadge,
} from './composables/useFeatureAwarenessBadge';
