// dialtone-vue's common/mixins/dom.js (mixin-dom), as plain functions: it has no state of its own to hook into.
// Vue's mixin methods call each other through `this`, so each function here takes what it needs as arguments.

export type ScrollDirection = 'top' | 'center' | 'bottom';

interface ScrollBounds {
  top: number;
  bottom: number;
}

function getElementHeight (el: Element): number {
  return el.getBoundingClientRect().height;
}

function getScrollBounds (el: Element): ScrollBounds {
  const height = getElementHeight(el);
  const scrollTop = el.scrollTop;
  return {
    top: scrollTop,
    bottom: scrollTop + height,
  };
}

function inScrollBounds (top: number, bottom: number, bounds: ScrollBounds): boolean {
  // Since we read from top to bottom, we want more than 3/4 to be visible at the top
  // (bc you're looking at the bottom half) or a quarter visible at the bottom (bc you
  // can read the beginning of it)
  const height = bottom - top;
  return (bottom <= bounds.bottom + (3 * height / 4)) && (top >= bounds.top - (height / 4));
}

function setScrollTop (
  el: Element,
  scrollTop: number,
  bounds: ScrollBounds | null,
  offsetTop: number,
  offsetBottom: number,
  isNeeded?: boolean,
  behavior?: ScrollBehavior | null,
): void {
  const scrollBounds = bounds || getScrollBounds(el);
  const parentHeight = scrollBounds.bottom - scrollBounds.top;
  if (isNeeded && inScrollBounds(offsetTop, offsetBottom, scrollBounds)) {
    // Then lock to the top or bottom if it's hanging off the edge.
    if (offsetTop < scrollBounds.top) {
      // Snap it to the top.
      scrollTop = offsetTop;
    } else if (offsetBottom > scrollBounds.bottom) {
      scrollTop = offsetBottom - parentHeight;
    } else {
      return;
    }
  }

  if (behavior) {
    el.scrollTo({ top: scrollTop, behavior });
  } else {
    el.scrollTop = scrollTop;
  }
}

/**
 * Scroll an element within its scroll parent (`parent`, or the element's own parent).
 * @param ref the element to scroll into view
 * @param dir where in the parent the element ends up; the closest edge when omitted
 * @param ifNeeded only scroll when the element isn't (almost) fully visible
 */
export function scrollIntoView (
  ref: HTMLElement | null | undefined,
  dir?: ScrollDirection,
  ifNeeded?: boolean,
  behavior?: ScrollBehavior | null,
  parent?: Element | null,
): void {
  if (!ref || !ref.parentElement) {
    return;
  }
  const offsetTop = ref.offsetTop;
  const refParent = parent || ref.parentElement;
  const scrollBounds = getScrollBounds(refParent);
  const parentHeight = scrollBounds.bottom - scrollBounds.top;
  const elHeight = getElementHeight(ref);
  const offsetBottom = offsetTop + elHeight;
  let scrollTop = -1;
  switch (dir) {
    case 'top':
      scrollTop = offsetTop;
      break;
    case 'center':
      scrollTop = offsetTop + (elHeight - parentHeight) / 2;
      break;
    case 'bottom':
      scrollTop = offsetBottom - parentHeight;
      break;
    default:
      // Go to the closest edge if needed and no direction is provided.
      if (offsetTop - scrollBounds.top <= (parentHeight / 2)) {
        // Lock it to the top edge.
        scrollTop = offsetTop;
      } else {
        scrollTop = offsetBottom - parentHeight;
      }
      break;
  }
  setScrollTop(refParent, scrollTop, scrollBounds, offsetTop, offsetBottom, ifNeeded, behavior);
}

/** Scroll an element into view if it is not fully visible in its nearest scrollable ancestor. */
export function scrollIntoViewIfNeeded (
  ref: HTMLElement | null | undefined,
  center?: boolean | null,
  behavior?: ScrollBehavior | null,
  parent?: Element | null,
): void {
  const dir = center ? 'center' : undefined;
  scrollIntoView(ref, dir, true, behavior, parent);
}

/**
 * Scroll an element into view if it is not fully visible in its nearest scrollable ancestor.
 * Browsers with a native `scrollIntoViewIfNeeded` take the centering-aware path; the others scroll to the bottom edge.
 */
export function scrollElementIntoViewIfNeeded (
  ref: HTMLElement,
  center?: boolean | null,
  behavior?: ScrollBehavior | null,
  parent?: Element | null,
): void {
  if ((ref as { scrollIntoViewIfNeeded?: unknown }).scrollIntoViewIfNeeded) {
    scrollIntoViewIfNeeded(ref, center, behavior, parent);
  } else {
    scrollIntoView(ref, 'bottom', false, behavior, parent);
  }
}

/** Scroll an element to the top or bottom of its scroll ancestor. */
export function scrollElementIntoView (
  ref: HTMLElement,
  scrollToTop?: boolean | 'center',
  behavior?: ScrollBehavior | null,
  parent?: Element | null,
): void {
  if (scrollToTop === 'center') {
    scrollIntoView(ref, 'center', false, behavior, parent);
    return;
  }

  if (scrollToTop === false) {
    scrollIntoView(ref, 'bottom', false, behavior, parent);
  } else {
    scrollIntoView(ref, 'top', false, behavior, parent);
  }
}
