/**
 * Shared FLIP + Web Animations API utility for "traveling indicator" animations.
 * Used by DtTabGroup and DtSegmentedControl to slide the selection indicator
 * from the old selected element to the new one.
 */

/**
 * Cache animation config from CSS custom properties on a container element.
 * @param {HTMLElement} containerEl
 * @param {string} durationVar - CSS variable name for duration
 * @param {string} easingVar - CSS variable name for easing
 * @returns {{ duration: number, easing: string, prefersReducedMotion: boolean }}
 */
export function cacheIndicatorConfig (containerEl, durationVar, easingVar) {
  let prefersReducedMotion = false;
  if (typeof window.matchMedia === 'function') {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  const style = getComputedStyle(containerEl);
  const duration = parseInt(style.getPropertyValue(durationVar), 10) || 200;
  const easing = style.getPropertyValue(easingVar).trim() || 'ease';
  return { duration, easing, prefersReducedMotion };
}

/**
 * Cancel any in-flight indicator animations.
 * @param {{ indicator: Animation|null, hideNative: Animation|null }} state
 */
export function cancelIndicatorAnimations (state) {
  if (state.indicator) {
    state.indicator.onfinish = null;
    state.indicator.cancel();
  }
  if (state.hideNative) {
    state.hideNative.onfinish = null;
    state.hideNative.cancel();
  }
}

/**
 * Animate an indicator from oldRect position to newEl's current position.
 * @param {{ indicator: Animation|null, hideNative: Animation|null }} state - mutable animation state
 * @param {object} options
 * @param {DOMRect} options.oldRect - bounding rect of the previously selected element
 * @param {HTMLElement} options.newEl - the newly selected element
 * @param {string} options.orientation - 'horizontal' or 'vertical'
 * @param {number} options.duration - animation duration in ms
 * @param {string} options.easing - CSS easing string
 * @param {object} options.hideProps - properties to suppress on newEl during animation
 * @param {object} [options.indicatorExtra] - additional CSS properties for the indicator pseudo
 * @param {string} options.pseudoElement - '::before' or '::after'
 */
export function animateIndicator (state, {
  oldRect, newEl, orientation, duration, easing, hideProps, indicatorExtra = {}, pseudoElement,
}) {
  const newRect = newEl.getBoundingClientRect();
  const isVertical = orientation === 'vertical';
  // Use center-to-center delta so scale from center aligns both edges correctly
  const delta = isVertical
    ? (oldRect.top + oldRect.height / 2) - (newRect.top + newRect.height / 2)
    : (oldRect.left + oldRect.width / 2) - (newRect.left + newRect.width / 2);
  if (delta === 0) return;

  cancelIndicatorAnimations(state);

  const from = isVertical ? `0 ${delta}px` : `${delta}px 0`;
  const scale = isVertical
    ? `1 ${oldRect.height / newRect.height}`
    : `${oldRect.width / newRect.width} 1`;

  const opts = { duration, easing };
  state.hideNative = newEl.animate(
    [hideProps, hideProps], { ...opts, fill: 'forwards' },
  );
  state.indicator = newEl.animate(
    [{ translate: from, scale, ...indicatorExtra },
      { translate: '0 0', scale: '1 1', ...indicatorExtra }],
    { ...opts, pseudoElement },
  );
  state.indicator.onfinish = () => { state.hideNative?.cancel(); };
}
