import { onMounted, onBeforeUnmount, unref } from 'vue';
import {
  cacheIndicatorConfig,
  cancelIndicatorAnimations,
  animateIndicator,
} from '../utils/indicatorAnimation';

/**
 * Composable for "traveling indicator" animations.
 * Handles lifecycle (config caching on mount, cleanup on unmount) and
 * exposes animate/cancel for the component to call on selection change.
 *
 * @param {import('vue').Ref|Function} containerRef - template ref or getter for the container element
 * @param {string} durationVar - CSS variable name for duration (e.g. '--tab-indicator-duration')
 * @param {string} easingVar - CSS variable name for easing (e.g. '--tab-indicator-easing')
 */
export function useIndicatorAnimation (containerRef, durationVar, easingVar) {
  const state = { indicator: null, hideNative: null };
  let config = null;

  onMounted(() => {
    const el = typeof containerRef === 'function' ? containerRef() : unref(containerRef);
    const resolvedEl = el?.$el || el;
    if (resolvedEl) {
      config = cacheIndicatorConfig(resolvedEl, durationVar, easingVar);
    }
  });

  onBeforeUnmount(() => {
    cancelIndicatorAnimations(state);
  });

  function animate (options) {
    if (!config || config.prefersReducedMotion) return;
    animateIndicator(state, {
      ...options,
      duration: config.duration,
      easing: config.easing,
    });
  }

  function cancel () {
    cancelIndicatorAnimations(state);
  }

  function canAnimate () {
    return !!config && !config.prefersReducedMotion;
  }

  return { animate, cancel, canAnimate };
}
