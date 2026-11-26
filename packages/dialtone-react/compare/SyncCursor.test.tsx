import { render } from '@testing-library/react';
import { ARROW_PATH, SyncCursor } from './SyncCursor';

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
});
