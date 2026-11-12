import { useCallback, useEffect, useMemo, useRef } from 'react';

const DEFAULT_DURATION = 200;
const DEFAULT_EASING = 'ease';

export type IndicatorOrientation = 'horizontal' | 'vertical';

/** An element's position and the computed style the indicator animation needs, as `snapshot` captures it. */
export interface IndicatorSnapshot {
  rect: DOMRect;
  style: { borderColor: string; borderWidth: string; backgroundColor: string };
  el: HTMLElement;
}

export interface IndicatorAnimateOptions {
  /** Bounding rect of the previously selected element. */
  oldRect: DOMRect;
  /** The newly selected element. */
  newEl: HTMLElement;
  orientation: IndicatorOrientation;
  /** Properties to suppress on `newEl` during the animation. */
  hideProps: Keyframe;
  /** Additional CSS properties for the indicator pseudo-element. */
  indicatorExtra?: Keyframe;
  pseudoElement: '::before' | '::after';
}

export interface IndicatorAnimation {
  animate: (options: IndicatorAnimateOptions) => void;
  cancel: () => void;
  canAnimate: () => boolean;
  snapshot: (selector: string) => IndicatorSnapshot | null;
}

interface IndicatorState {
  indicator: Animation | null;
  hideNative: Animation | null;
}

/**
 * dialtone-vue's `useIndicatorAnimation` composable as a hook, for "traveling indicator" animations.
 * Uses the FLIP technique and the Web Animations API to slide a selection indicator (a pseudo-element) from the old
 * selected element to the new one.
 *
 * `el` is the container, kept in state with a callback ref, so the hook follows it: a new container is configured
 * afresh, as on Vue's `onMounted`, and losing one (or unmounting) cancels the running animations, as `onBeforeUnmount`
 * does. The returned functions are stable.
 *
 * @param el - the container element
 * @param durationVar - CSS variable name for the duration (e.g. '--tab-indicator-duration')
 * @param easingVar - CSS variable name for the easing (e.g. '--tab-indicator-easing')
 *
 * @example
 * const [el, setEl] = useState<HTMLElement | null>(null);
 * // <div ref={setEl}>
 * const { snapshot, animate } = useIndicatorAnimation(el, '--tab-indicator-duration', '--tab-indicator-easing');
 */
export function useIndicatorAnimation (
  el: HTMLElement | null,
  durationVar: string,
  easingVar: string,
): IndicatorAnimation {
  // Plain mutable state, like the closure variables in Vue's composable: none of it is rendered.
  const containerRef = useRef<HTMLElement | null>(null);
  const configRef = useRef({ duration: DEFAULT_DURATION, easing: DEFAULT_EASING, supported: false });
  const stateRef = useRef<IndicatorState>({ indicator: null, hideNative: null });

  const cancel = useCallback(() => {
    const state = stateRef.current;
    if (state.indicator) {
      state.indicator.onfinish = null;
      state.indicator.cancel();
    }
    if (state.hideNative) {
      state.hideNative.onfinish = null;
      state.hideNative.cancel();
    }
  }, []);

  useEffect(() => {
    if (!el) return undefined;
    containerRef.current = el;
    const config = configRef.current;

    // Cache config from CSS custom properties
    const style = getComputedStyle(el);
    config.duration = parseInt(style.getPropertyValue(durationVar), 10) || DEFAULT_DURATION;
    config.easing = style.getPropertyValue(easingVar).trim() || DEFAULT_EASING;

    // Feature detection: WAAPI + prefers-reduced-motion
    const prefersReducedMotion = typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    config.supported = typeof el.animate === 'function' && !prefersReducedMotion;

    // Vue's `onBeforeUnmount`; the container is gone, so there is nothing left to animate.
    return () => {
      cancel();
      containerRef.current = null;
      config.supported = false;
    };
  }, [el, durationVar, easingVar, cancel]);

  /** Capture a snapshot of an element's position and computed style. */
  const snapshot = useCallback((selector: string): IndicatorSnapshot | null => {
    if (!configRef.current.supported) return null;
    const target = containerRef.current?.querySelector<HTMLElement>(selector);
    if (!target) return null;
    const cs = getComputedStyle(target);
    return {
      rect: target.getBoundingClientRect(),
      style: { borderColor: cs.borderColor, borderWidth: cs.borderWidth, backgroundColor: cs.backgroundColor },
      el: target,
    };
  }, []);

  /** Animate an indicator from `oldRect` to `newEl`'s current position. */
  const animate = useCallback(({
    oldRect,
    newEl,
    orientation,
    hideProps,
    indicatorExtra = {},
    pseudoElement,
  }: IndicatorAnimateOptions) => {
    const { duration, easing, supported } = configRef.current;
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
    const state = stateRef.current;
    state.hideNative = newEl.animate(
      [hideProps, hideProps], { ...opts, fill: 'forwards' },
    );
    const indicator = newEl.animate(
      [{ translate: from, scale, ...indicatorExtra },
        { translate: '0 0', scale: '1 1', ...indicatorExtra }],
      { ...opts, pseudoElement },
    );
    indicator.onfinish = () => { state.hideNative?.cancel(); };
    state.indicator = indicator;
  }, [cancel]);

  const canAnimate = useCallback(() => configRef.current.supported, []);

  return useMemo(() => ({ animate, cancel, canAnimate, snapshot }), [animate, cancel, canAnimate, snapshot]);
}
