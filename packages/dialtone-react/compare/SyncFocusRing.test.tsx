import { render } from '@testing-library/react';
import { RING_OFFSET, SyncFocusRing } from './SyncFocusRing';

describe('SyncFocusRing', () => {
  const ring = (highContrast = false) => render(
    <SyncFocusRing
      mirrors="vue"
      rect={{ x: 100, y: 40, width: 120, height: 32 }}
      offset={{ x: 1, y: 2 }}
      highContrast={highContrast}
    />,
  ).container.firstElementChild as HTMLElement;

  it('surrounds the element, offset into the container, out of the pointer\'s and assistive technology\'s way', () => {
    const element = ring();

    expect(element).toHaveClass('compare-ring');
    expect(element).toHaveAttribute('aria-hidden', 'true');
    expect(element).toHaveAttribute('data-side', 'vue');
    expect(element.style.pointerEvents).toBe('none');
    expect(element.style.transform).toBe(`translate(${101 - RING_OFFSET}px, ${42 - RING_OFFSET}px)`);
    expect(element.style.width).toBe(`${120 + 2 * RING_OFFSET}px`);
    expect(element.style.height).toBe(`${32 + 2 * RING_OFFSET}px`);
  });

  it('marks high contrast', () => {
    expect(ring(true)).toHaveAttribute('data-contrast', 'high');
    expect(ring()).not.toHaveAttribute('data-contrast');
  });
});
