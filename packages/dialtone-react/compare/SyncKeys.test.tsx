import { act, render } from '@testing-library/react';
import { SyncKeys } from './SyncKeys';
import { KEYS_MS, TYPING } from './sync';
import type { KeyEntry, KeysState } from './sync';

const entry = (seq: number, label: string, count = 1): KeyEntry => ({ seq, label, count, time: 0 });
const state = (entries: KeyEntry[], over: KeysState['over'] = 'react'): KeysState => ({ over, mirrors: 'vue', entries });

describe('SyncKeys', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const labels = (container: HTMLElement) =>
    [...container.querySelectorAll('.compare-keys__key')].map(key => key.textContent);

  it('lists the keys mirrored into its frame, hidden from assistive technology and the pointer', () => {
    const { container } = render(<SyncKeys keys={state([entry(1, 'Escape'), entry(2, 'ArrowDown', 3)])} side="react" />);
    const overlay = container.firstElementChild as HTMLElement;

    expect(overlay).toHaveClass('compare-keys');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay).toHaveAttribute('data-side', 'vue');
    expect(overlay.style.pointerEvents).toBe('none');
    expect(labels(container)).toEqual(['Escape', 'ArrowDown ×3']);
  });

  it('shows nothing when no key was mirrored, or only into the other frame', () => {
    expect(render(<SyncKeys keys={null} side="react" />).container.firstElementChild).toBeNull();
    expect(render(<SyncKeys keys={state([entry(1, 'Escape')])} side="vue" />).container.firstElementChild).toBeNull();
  });

  it('shows each key for KEYS_MS from when it came, then nothing', () => {
    const { container, rerender } = render(<SyncKeys keys={state([entry(1, 'Home')])} side="react" />);

    act(() => { vi.advanceTimersByTime(1000); });
    rerender(<SyncKeys keys={state([entry(1, 'Home'), entry(2, 'End')])} side="react" />);
    act(() => { vi.advanceTimersByTime(KEYS_MS - 1000); });
    expect(labels(container)).toEqual(['End']);

    act(() => { vi.advanceTimersByTime(1000); });
    expect(container.firstElementChild).toBeNull();
  });

  it('starts a repeated key\'s time again', () => {
    const { container, rerender } = render(<SyncKeys keys={state([entry(1, 'ArrowDown')])} side="react" />);

    act(() => { vi.advanceTimersByTime(KEYS_MS - 100); });
    rerender(<SyncKeys keys={state([entry(2, 'ArrowDown', 2)])} side="react" />);
    act(() => { vi.advanceTimersByTime(KEYS_MS - 1); });

    expect(labels(container)).toEqual(['ArrowDown ×2']);
  });

  it('shows typing as "typing…", with no count', () => {
    const { container } = render(<SyncKeys keys={state([entry(1, TYPING)])} side="react" />);

    expect(labels(container)).toEqual([TYPING]);
    expect(container.querySelector('[data-typing]')).not.toBeNull();
  });
});
