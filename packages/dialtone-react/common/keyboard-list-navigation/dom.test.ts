import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  scrollElementIntoView,
  scrollElementIntoViewIfNeeded,
  scrollIntoView,
  scrollIntoViewIfNeeded,
} from './dom';

// React-only: dialtone-vue has no tests for common/mixins/dom.js.
// jsdom has no layout, so the geometry is set by hand: a 100px-high parent scrolled to `scrollTop`, and an item at
// `offsetTop` that is 20px high.
describe('Dom mixin functions', () => {
  let parent: HTMLElement;
  let item: HTMLElement;

  const lay = ({ scrollTop, offsetTop }: { scrollTop: number; offsetTop: number }) => {
    parent.scrollTop = scrollTop;
    Object.defineProperty(item, 'offsetTop', { configurable: true, value: offsetTop });
  };

  beforeEach(() => {
    parent = document.createElement('div');
    item = document.createElement('div');
    parent.append(item);
    document.body.append(parent);
    vi.spyOn(parent, 'getBoundingClientRect').mockReturnValue({ height: 100 } as DOMRect);
    vi.spyOn(item, 'getBoundingClientRect').mockReturnValue({ height: 20 } as DOMRect);
  });

  afterEach(() => {
    parent.remove();
    vi.restoreAllMocks();
  });

  describe('scrollIntoView', () => {
    it.each([
      ['top', 300, 300],
      ['center', 300, 260],
      ['bottom', 300, 220],
    ] as const)('scrolls the item to the %s of the parent', (dir, offsetTop, scrollTop) => {
      lay({ scrollTop: 0, offsetTop });
      scrollIntoView(item, dir);
      expect(parent.scrollTop).toBe(scrollTop);
    });

    it('goes to the closest edge when no direction is given', () => {
      lay({ scrollTop: 0, offsetTop: 300 });
      scrollIntoView(item);
      expect(parent.scrollTop).toBe(220);
    });

    it('scrolls the given parent rather than the item\'s own', () => {
      const scroller = document.createElement('div');
      vi.spyOn(scroller, 'getBoundingClientRect').mockReturnValue({ height: 50 } as DOMRect);
      lay({ scrollTop: 0, offsetTop: 300 });
      scrollIntoView(item, 'top', false, null, scroller);
      expect(scroller.scrollTop).toBe(300);
      expect(parent.scrollTop).toBe(0);
    });

    it('scrolls with the behavior when one is given', () => {
      const scrollTo = vi.fn();
      parent.scrollTo = scrollTo;
      lay({ scrollTop: 0, offsetTop: 300 });
      scrollIntoView(item, 'top', false, 'smooth');
      expect(scrollTo).toHaveBeenCalledWith({ top: 300, behavior: 'smooth' });
    });

    it('does nothing for an element without a parent', () => {
      const orphan = document.createElement('div');
      const scrollTop = vi.fn();
      Object.defineProperty(orphan, 'scrollTop', { configurable: true, get: () => 0, set: scrollTop });
      scrollIntoView(orphan, 'top');
      scrollIntoView(null);
      expect(scrollTop).not.toHaveBeenCalled();
    });
  });

  describe('scrollIntoViewIfNeeded', () => {
    it('leaves a visible item where it is', () => {
      lay({ scrollTop: 0, offsetTop: 40 });
      scrollIntoViewIfNeeded(item);
      expect(parent.scrollTop).toBe(0);
    });

    it('snaps an item hanging off the bottom edge to the bottom', () => {
      lay({ scrollTop: 0, offsetTop: 90 });
      scrollIntoViewIfNeeded(item);
      expect(parent.scrollTop).toBe(10);
    });

    it('snaps an item hanging off the top edge to the top', () => {
      lay({ scrollTop: 100, offsetTop: 95 });
      scrollIntoViewIfNeeded(item);
      expect(parent.scrollTop).toBe(95);
    });

    it('scrolls to the closest edge an item that is well outside', () => {
      lay({ scrollTop: 0, offsetTop: 500 });
      scrollIntoViewIfNeeded(item);
      expect(parent.scrollTop).toBe(420);
    });

    it('centers the item when asked to', () => {
      lay({ scrollTop: 0, offsetTop: 500 });
      scrollIntoViewIfNeeded(item, true);
      expect(parent.scrollTop).toBe(460);
    });
  });

  describe('scrollElementIntoViewIfNeeded', () => {
    it('scrolls to the bottom edge, unconditionally, when the browser has no scrollIntoViewIfNeeded', () => {
      lay({ scrollTop: 0, offsetTop: 40 });
      scrollElementIntoViewIfNeeded(item);
      expect(parent.scrollTop).toBe(-40);
    });

    it('leaves a visible item where it is when the browser has scrollIntoViewIfNeeded', () => {
      Object.defineProperty(item, 'scrollIntoViewIfNeeded', { configurable: true, value: () => {} });
      lay({ scrollTop: 0, offsetTop: 40 });
      scrollElementIntoViewIfNeeded(item);
      expect(parent.scrollTop).toBe(0);
    });
  });

  describe('scrollElementIntoView', () => {
    it.each([
      [undefined, 300],
      [true, 300],
      [false, 220],
      ['center', 260],
    ] as const)('with %s scrolls the item to %i', (scrollToTop, scrollTop) => {
      lay({ scrollTop: 0, offsetTop: 300 });
      scrollElementIntoView(item, scrollToTop);
      expect(parent.scrollTop).toBe(scrollTop);
    });
  });
});
