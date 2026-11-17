import { StrictMode } from 'react';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIndicatorAnimation } from './useIndicatorAnimation';

// dialtone-vue has no test for the composable; these are React-only.
const DURATION_VAR = '--test-indicator-duration';
const EASING_VAR = '--test-indicator-easing';

const rect = (left: number, top: number, width: number, height: number) =>
  ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top }) as DOMRect;

interface FakeAnimation {
  onfinish: (() => void) | null;
  cancel: ReturnType<typeof vi.fn>;
}

const makeAnimation = (): FakeAnimation => ({ onfinish: null, cancel: vi.fn() });

describe('useIndicatorAnimation', () => {
  let container: HTMLElement;
  let tab: HTMLElement;
  let animations: FakeAnimation[];

  const setup = (el: HTMLElement | null = container) =>
    renderHook(({ el }: { el: HTMLElement | null }) => useIndicatorAnimation(el, DURATION_VAR, EASING_VAR), {
      initialProps: { el },
      wrapper: StrictMode,
    });

  beforeEach(() => {
    container = document.createElement('div');
    container.style.setProperty(DURATION_VAR, '350ms');
    container.style.setProperty(EASING_VAR, ' ease-in ');
    tab = document.createElement('button');
    tab.className = 'tab';
    container.appendChild(tab);
    document.body.appendChild(container);

    animations = [];
    // jsdom has no Web Animations API.
    HTMLElement.prototype.animate = vi.fn(() => {
      const animation = makeAnimation();
      animations.push(animation);
      return animation as unknown as Animation;
    });
    window.matchMedia = vi.fn(() => ({ matches: false }) as MediaQueryList);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    // @ts-expect-error restoring jsdom's lack of the Web Animations API
    delete HTMLElement.prototype.animate;
    // @ts-expect-error restoring jsdom's lack of matchMedia
    delete window.matchMedia;
  });

  it('can animate once the container is there and animations are supported', () => {
    expect(setup().result.current.canAnimate()).toBe(true);
  });

  it('cannot animate without a container', () => {
    expect(setup(null).result.current.canAnimate()).toBe(false);
  });

  it('cannot animate when the element has no animate method', () => {
    // @ts-expect-error simulating a browser without the Web Animations API
    delete HTMLElement.prototype.animate;
    expect(setup().result.current.canAnimate()).toBe(false);
  });

  it('cannot animate when the user prefers reduced motion', () => {
    window.matchMedia = vi.fn(() => ({ matches: true }) as MediaQueryList);
    expect(setup().result.current.canAnimate()).toBe(false);
  });

  it('can animate when matchMedia does not exist', () => {
    // @ts-expect-error simulating an environment without matchMedia
    delete window.matchMedia;
    expect(setup().result.current.canAnimate()).toBe(true);
  });

  it('starts animating once the container arrives', () => {
    const { result, rerender } = setup(null);
    rerender({ el: container });
    expect(result.current.canAnimate()).toBe(true);
  });

  describe('snapshot', () => {
    it('returns null when animations are not supported', () => {
      window.matchMedia = vi.fn(() => ({ matches: true }) as MediaQueryList);
      expect(setup().result.current.snapshot('.tab')).toBeNull();
    });

    it('returns null when nothing matches the selector', () => {
      expect(setup().result.current.snapshot('.missing')).toBeNull();
    });

    it('captures the matched element, its rect and its computed style', () => {
      tab.getBoundingClientRect = () => rect(10, 0, 100, 40);
      const snap = setup().result.current.snapshot('.tab');
      expect(snap?.el).toBe(tab);
      expect(snap?.rect.left).toBe(10);
      expect(snap?.rect.width).toBe(100);
      expect(Object.keys(snap?.style ?? {})).toEqual(['borderColor', 'borderWidth', 'backgroundColor']);
    });
  });

  describe('animate', () => {
    const options = (newEl: HTMLElement, oldRect: DOMRect) => ({
      oldRect,
      newEl,
      orientation: 'horizontal' as const,
      hideProps: { borderColor: 'transparent' },
      pseudoElement: '::after' as const,
    });

    it('does nothing when animations are not supported', () => {
      window.matchMedia = vi.fn(() => ({ matches: true }) as MediaQueryList);
      tab.getBoundingClientRect = () => rect(100, 0, 100, 40);
      setup().result.current.animate(options(tab, rect(0, 0, 100, 40)));
      expect(tab.animate).not.toHaveBeenCalled();
    });

    it('slides the indicator from the old element to the new one with the CSS duration and easing', () => {
      tab.getBoundingClientRect = () => rect(100, 0, 50, 40);
      setup().result.current.animate({
        ...options(tab, rect(0, 0, 100, 40)),
        indicatorExtra: { opacity: '1' },
      });

      expect(tab.animate).toHaveBeenCalledTimes(2);
      const calls = vi.mocked(tab.animate).mock.calls;
      expect(calls[0]).toEqual([
        [{ borderColor: 'transparent' }, { borderColor: 'transparent' }],
        { duration: 350, easing: 'ease-in', fill: 'forwards' },
      ]);
      expect(calls[1]).toEqual([
        [
          // centers are 50 apart; the indicator starts twice as wide
          { translate: '-75px 0', scale: '2 1', opacity: '1' },
          { translate: '0 0', scale: '1 1', opacity: '1' },
        ],
        { duration: 350, easing: 'ease-in', pseudoElement: '::after' },
      ]);
    });

    it('slides along the block axis when vertical', () => {
      tab.getBoundingClientRect = () => rect(0, 100, 80, 20);
      setup().result.current.animate({ ...options(tab, rect(0, 0, 80, 40)), orientation: 'vertical' });

      const keyframes = vi.mocked(tab.animate).mock.calls[1][0] as Keyframe[];
      expect(keyframes[0]).toEqual({ translate: '0 -90px', scale: '1 2' });
    });

    it('falls back to 200ms and ease when the CSS variables are not set', () => {
      container.style.removeProperty(DURATION_VAR);
      container.style.removeProperty(EASING_VAR);
      tab.getBoundingClientRect = () => rect(100, 0, 100, 40);
      setup().result.current.animate(options(tab, rect(0, 0, 100, 40)));

      expect(vi.mocked(tab.animate).mock.calls[0][1]).toEqual({ duration: 200, easing: 'ease', fill: 'forwards' });
    });

    it('skips elements on a different row', () => {
      tab.getBoundingClientRect = () => rect(100, 60, 100, 40);
      setup().result.current.animate(options(tab, rect(0, 0, 100, 40)));
      expect(tab.animate).not.toHaveBeenCalled();
    });

    it('skips an element that has not moved', () => {
      tab.getBoundingClientRect = () => rect(0, 0, 100, 40);
      setup().result.current.animate(options(tab, rect(0, 0, 100, 40)));
      expect(tab.animate).not.toHaveBeenCalled();
    });

    it('cancels the previous animation before starting another', () => {
      tab.getBoundingClientRect = () => rect(100, 0, 100, 40);
      const { animate } = setup().result.current;
      animate(options(tab, rect(0, 0, 100, 40)));
      const [firstHide, firstIndicator] = animations;
      animate(options(tab, rect(0, 0, 100, 40)));

      expect(firstHide.cancel).toHaveBeenCalled();
      expect(firstIndicator.cancel).toHaveBeenCalled();
    });

    it('stops hiding the native indicator when the animation finishes', () => {
      tab.getBoundingClientRect = () => rect(100, 0, 100, 40);
      setup().result.current.animate(options(tab, rect(0, 0, 100, 40)));
      const [hide, indicator] = animations;

      expect(hide.cancel).not.toHaveBeenCalled();
      indicator.onfinish?.();
      expect(hide.cancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('cancel', () => {
    it('cancels both animations without letting them finish', () => {
      tab.getBoundingClientRect = () => rect(100, 0, 100, 40);
      const { animate, cancel } = setup().result.current;
      animate({
        oldRect: rect(0, 0, 100, 40),
        newEl: tab,
        orientation: 'horizontal',
        hideProps: {},
        pseudoElement: '::before',
      });
      const [hide, indicator] = animations;
      cancel();

      expect(hide.cancel).toHaveBeenCalled();
      expect(indicator.cancel).toHaveBeenCalled();
      expect(indicator.onfinish).toBeNull();
    });

    it('does nothing when nothing is animating', () => {
      expect(() => setup().result.current.cancel()).not.toThrow();
    });
  });

  describe('when the container goes away', () => {
    it('cancels running animations on unmount', () => {
      tab.getBoundingClientRect = () => rect(100, 0, 100, 40);
      const { result, unmount } = setup();
      result.current.animate({
        oldRect: rect(0, 0, 100, 40),
        newEl: tab,
        orientation: 'horizontal',
        hideProps: {},
        pseudoElement: '::before',
      });
      const [hide, indicator] = animations;
      unmount();

      expect(hide.cancel).toHaveBeenCalled();
      expect(indicator.cancel).toHaveBeenCalled();
    });

    it('stops animating when the container is lost', () => {
      const { result, rerender } = setup();
      rerender({ el: null });
      expect(result.current.canAnimate()).toBe(false);
      expect(result.current.snapshot('.tab')).toBeNull();
    });
  });

  it('returns the same functions across renders', () => {
    const { result, rerender } = setup();
    const first = result.current;
    rerender({ el: container });
    expect(result.current).toBe(first);
  });
});
