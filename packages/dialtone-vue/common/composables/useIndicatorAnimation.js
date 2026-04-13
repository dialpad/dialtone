import { onMounted, onBeforeUnmount, unref } from 'vue';

/**
 * Composable for "traveling indicator" animations.
 * Uses FLIP technique + Web Animations API to slide a selection indicator
 * (pseudo-element) from the old selected element to the new one.
 *
 * @param {import('vue').Ref|Function} containerRef - template ref or getter for the container element
 * @param {string} durationVar - CSS variable name for duration (e.g. '--tab-indicator-duration')
 * @param {string} easingVar - CSS variable name for easing (e.g. '--tab-indicator-easing')
 */
export function useIndicatorAnimation (containerRef, durationVar, easingVar) {
  const state = { indicator: null, hideNative: null };
  let duration = 200;
  let easing = 'ease';
  let supported = false;

  onMounted(() => {
    const el = typeof containerRef === 'function' ? containerRef() : unref(containerRef);
    const resolvedEl = el?.$el || el;
    if (!resolvedEl) return;

    // Cache config from CSS custom properties
    const style = getComputedStyle(resolvedEl);
    duration = parseInt(style.getPropertyValue(durationVar), 10) || 200;
    easing = style.getPropertyValue(easingVar).trim() || 'ease';

    // Feature detection: WAAPI + prefers-reduced-motion
    const prefersReducedMotion = typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    supported = typeof resolvedEl.animate === 'function' && !prefersReducedMotion;
  });

  onBeforeUnmount(() => { cancel(); });

  /**
   * Capture a snapshot of an element's position and computed style.
   * @param {string} selector - CSS selector to find the element within the container
   * @returns {{ rect: DOMRect, style: CSSStyleDeclaration, el: HTMLElement }|null}
   */
  function snapshot (selector) {
    if (!supported) return null;
    const container = typeof containerRef === 'function' ? containerRef() : unref(containerRef);
    const containerEl = container?.$el || container;
    const el = containerEl?.querySelector(selector);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      rect: el.getBoundingClientRect(),
      style: { borderColor: cs.borderColor, borderWidth: cs.borderWidth, backgroundColor: cs.backgroundColor },
      el,
    };
  }

  /**
   * Animate an indicator from oldRect to newEl's current position.
   * @param {object} options
   * @param {DOMRect} options.oldRect - bounding rect of the previously selected element
   * @param {HTMLElement} options.newEl - the newly selected element
   * @param {string} options.orientation - 'horizontal' or 'vertical'
   * @param {object} options.hideProps - properties to suppress on newEl during animation
   * @param {object} [options.indicatorExtra] - additional CSS properties for the indicator pseudo
   * @param {string} options.pseudoElement - '::before' or '::after'
   */
  function animate ({ oldRect, newEl, orientation, hideProps, indicatorExtra = {}, pseudoElement }) {
    if (!supported) return;
    cancel();

    const newRect = newEl.getBoundingClientRect();
    const isVertical = orientation === 'vertical';

    // Skip if elements are on different rows/columns (e.g. wrapped tabs).
    // Use half the element's cross-axis size as threshold — items on the same
    // row/column may differ slightly due to sub-pixel rounding or varying widths.
    const crossAxisSize = isVertical ? newRect.width : newRect.height;
    const crossAxisDelta = isVertical
      ? Math.abs(oldRect.left - newRect.left)
      : Math.abs(oldRect.top - newRect.top);
    if (crossAxisDelta > crossAxisSize / 2) return;

    // Center-to-center delta so scale from center aligns both edges
    const delta = isVertical
      ? (oldRect.top + oldRect.height / 2) - (newRect.top + newRect.height / 2)
      : (oldRect.left + oldRect.width / 2) - (newRect.left + newRect.width / 2);
    if (delta === 0) return;

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

  function cancel () {
    if (state.indicator) {
      state.indicator.onfinish = null;
      state.indicator.cancel();
    }
    if (state.hideNative) {
      state.hideNative.onfinish = null;
      state.hideNative.cancel();
    }
  }

  function canAnimate () {
    return supported;
  }

  return { animate, cancel, canAnimate, snapshot };
}
