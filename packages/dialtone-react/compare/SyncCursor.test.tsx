import { act, render } from '@testing-library/react';
import { ARROW_PATH, RIPPLE_MS, SyncCursor } from './SyncCursor';

const BOUNDS = { width: 600, height: 700 };

const renderCursor = (props: Partial<Parameters<typeof SyncCursor>[0]> = {}) => {
  const { container } = render(
    <SyncCursor mirrors="vue" x={120.5} y={48} pressed={false} bounds={BOUNDS} {...props} />,
  );
  return container.firstElementChild as HTMLElement;
};

describe('SyncCursor', () => {
  it('is hidden from assistive technology and never takes the pointer', () => {
    const cursor = renderCursor();

    expect(cursor).toHaveAttribute('aria-hidden', 'true');
    expect(cursor.style.pointerEvents).toBe('none');
  });

  it('puts its hotspot, the arrow\'s tip, at the point it\'s given', () => {
    const cursor = renderCursor();

    expect(cursor.style.transform).toBe('translate(120.5px, 48px)');
    expect(ARROW_PATH).toMatch(/^M0 0 /);
  });

  it.each([
    ['vue', 'Vue'],
    ['react', 'React'],
  ] as const)('is tinted and labelled for the %s side it mirrors', (side, label) => {
    const cursor = renderCursor({ mirrors: side });

    expect(cursor).toHaveAttribute('data-side', side);
    expect(cursor).toHaveTextContent(label);
  });

  it('shows a press', () => {
    expect(renderCursor()).not.toHaveAttribute('data-pressed');
    expect(renderCursor({ pressed: true })).toHaveAttribute('data-pressed');
  });

  it('turns black and white under high contrast', () => {
    expect(renderCursor({ highContrast: true })).toHaveAttribute('data-contrast', 'high');
  });

  it('keeps its label inside the frame near the end edges', () => {
    const middle = renderCursor();
    const corner = renderCursor({ x: 590, y: 690 });

    expect(middle).not.toHaveAttribute('data-flip-x');
    expect(middle).not.toHaveAttribute('data-flip-y');
    expect(corner).toHaveAttribute('data-flip-x');
    expect(corner).toHaveAttribute('data-flip-y');
  });

  describe('Click ripple', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    const ring = (cursor: HTMLElement) => cursor.querySelector('.compare-cursor__ripple');

    it('shows a ring for a click and takes it away after RIPPLE_MS', () => {
      const cursor = renderCursor({ click: 1 });

      expect(ring(cursor)).not.toBeNull();
      expect(cursor).toHaveAttribute('data-ripple');
      act(() => { vi.advanceTimersByTime(RIPPLE_MS - 1); });
      expect(ring(cursor)).not.toBeNull();
      act(() => { vi.advanceTimersByTime(1); });
      expect(ring(cursor)).toBeNull();
      expect(cursor).not.toHaveAttribute('data-ripple');
    });

    it('shows no ring without a click', () => {
      expect(ring(renderCursor())).toBeNull();
    });

    it('keeps the ring when the cursor moves on, and restarts it for another click', () => {
      const { container, rerender } = render(
        <SyncCursor mirrors="vue" x={1} y={1} pressed={false} click={1} bounds={BOUNDS} />,
      );
      const cursor = container.firstElementChild as HTMLElement;
      const first = ring(cursor);

      act(() => { vi.advanceTimersByTime(RIPPLE_MS - 100); });
      rerender(<SyncCursor mirrors="vue" x={9} y={9} pressed={false} bounds={BOUNDS} />);
      expect(ring(cursor)).toBe(first);

      rerender(<SyncCursor mirrors="vue" x={9} y={9} pressed={false} click={2} bounds={BOUNDS} />);
      act(() => { vi.advanceTimersByTime(RIPPLE_MS - 1); });
      expect(ring(cursor)).not.toBeNull();
      expect(ring(cursor)).not.toBe(first);
    });
  });
});
