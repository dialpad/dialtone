import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { SKELETON_RIPPLE_DURATION } from './SkeletonConstants';

/** The props dialtone-vue's skeleton mixin reads. Each component declares its own defaults, as in Vue. */
export interface SkeletonAnimationProps {
  /**
   * Duration time of the animation (ms), set -1 for an infinite animation.
   */
  animationDuration?: number;

  /**
   * This property has higher priority than "option.animate"
   * @values true, false
   */
  animate?: boolean;

  /**
   * RippleDuration controls how long the delay is for the animation of a
   * placeholder 1000 pixels from the top of the page. Each placeholder
   * from the top down will have a delay duration from 0 to this offset.
   * The delay of each placeholder animation is based on how far down the page
   * the placeholder is rendered. This is a linear relationship. The unit
   * is milliseconds.
   */
  offset?: number;
}

/**
 * The skeleton animation mixin: the animation delay and duration of a placeholder element.
 *   props: the component's values, its defaults applied.
 *   el: the placeholder element (Vue's `$refs.skeleton`), or null while it isn't rendered.
 */
export function useSkeletonAnimation (
  { animationDuration, animate, offset }: Required<SkeletonAnimationProps>,
  el: HTMLElement | null,
): CSSProperties {
  // Vue's `skeletonOffset` computed reads `$refs.skeleton`, which isn't reactive. On mount the ref isn't set yet, so it
  // returns `offset`, which it depends on. When `offset` first changes with the element rendered, it measures the
  // element's vertical centre instead, and having no reactive dependency left, keeps that value from then on.
  const [measuredOffset, setMeasuredOffset] = useState<number | null>(null);
  const offsetSeen = useRef(offset);
  useLayoutEffect(() => {
    if (measuredOffset !== null || offsetSeen.current === offset) return;
    offsetSeen.current = offset;
    if (el) {
      const { top, height } = el.getBoundingClientRect();
      setMeasuredOffset(top + (height / 2));
    }
  }, [offset, el, measuredOffset]);
  const skeletonOffset = measuredOffset ?? offset;

  if (skeletonOffset === -1 || (!animate && animationDuration === -1)) {
    return {};
  }
  return {
    animationDelay: `${skeletonOffset * SKELETON_RIPPLE_DURATION / 1000}ms`,
    animationDuration: `${animationDuration === -1 ? 1000 : animationDuration}ms`,
  };
}
