import { act, render } from '@testing-library/react';
import { CUE_MS, SyncCue } from './SyncCue';
import type { CueState } from './sync';

const cue = (over: Partial<CueState> = {}): CueState => ({ over: 'react', mirrors: 'vue', seq: 1, direction: 'down', ...over });

describe('SyncCue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const renderCue = (state: CueState | null, side: 'vue' | 'react' = 'react') =>
    render(<SyncCue cue={state} side={side} />);

  it('shows a scroll replayed in its frame for CUE_MS, hidden from assistive technology', () => {
    const { container } = renderCue(cue());
    const bar = container.firstElementChild as HTMLElement;

    expect(bar).toHaveClass('compare-cue');
    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect(bar).toHaveAttribute('data-direction', 'down');
    expect(bar.style.pointerEvents).toBe('none');
    act(() => { vi.advanceTimersByTime(CUE_MS - 1); });
    expect(container.firstElementChild).not.toBeNull();
    act(() => { vi.advanceTimersByTime(1); });
    expect(container.firstElementChild).toBeNull();
  });

  it('shows nothing for the other frame\'s scroll, or for none', () => {
    expect(renderCue(cue(), 'vue').container.firstElementChild).toBeNull();
    expect(renderCue(null).container.firstElementChild).toBeNull();
  });

  it('has no chevron when the direction isn\'t known', () => {
    const { container } = renderCue(cue({ direction: null }));

    expect(container.querySelector('.compare-cue__chevron')).toBeNull();
  });

  it('starts its time again with each new scroll', () => {
    const { container, rerender } = renderCue(cue());

    act(() => { vi.advanceTimersByTime(CUE_MS - 100); });
    rerender(<SyncCue cue={cue({ seq: 2, direction: 'up' })} side="react" />);
    act(() => { vi.advanceTimersByTime(CUE_MS - 1); });

    expect(container.firstElementChild).toHaveAttribute('data-direction', 'up');
    act(() => { vi.advanceTimersByTime(1); });
    expect(container.firstElementChild).toBeNull();
  });
});
