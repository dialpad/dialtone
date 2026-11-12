import { StrictMode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ContentMode } from '../mode_constants';
import { useMode } from './useMode';

// dialtone-vue has no test for the mode mixin; these are React-only.
const flush = () => act(async () => { await Promise.resolve(); });

const renderMode = (
  contentMode: ContentMode | null | undefined,
  getReferenceEl: () => Element | null | undefined = () => null,
) =>
  renderHook(
    ({ mode }: { mode: ContentMode | null | undefined }) => useMode(mode, getReferenceEl),
    { initialProps: { mode: contentMode }, wrapper: StrictMode },
  );

describe('Mode Mixin Tests', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-dt-mode');
    document.documentElement.removeAttribute('data-dt-contrast');
    document.body.innerHTML = '';
  });

  describe('When contentMode is not set', () => {
    it('returns no attributes', () => {
      expect(renderMode(undefined).result.current).toEqual({});
      expect(renderMode(null).result.current).toEqual({});
    });
  });

  describe('When contentMode is light or dark', () => {
    it('returns the mode and the default contrast', () => {
      expect(renderMode('dark').result.current).toEqual({ 'data-dt-mode': 'dark', 'data-dt-contrast': 'default' });
      expect(renderMode('light').result.current).toEqual({ 'data-dt-mode': 'light', 'data-dt-contrast': 'default' });
    });

    it('follows the root contrast', async () => {
      document.documentElement.setAttribute('data-dt-contrast', 'high');
      const { result } = renderMode('dark');
      expect(result.current['data-dt-contrast']).toBe('high');

      document.documentElement.setAttribute('data-dt-contrast', 'low');
      await flush();
      expect(result.current['data-dt-contrast']).toBe('low');
    });
  });

  describe('When contentMode is invert', () => {
    const setup = (parentMode: string | null) => {
      const parent = document.createElement('div');
      if (parentMode) parent.setAttribute('data-dt-mode', parentMode);
      const anchor = document.createElement('button');
      parent.appendChild(anchor);
      document.body.appendChild(parent);
      return { parent, anchor };
    };

    it('returns the opposite of the nearest ancestor mode', () => {
      const { anchor } = setup('dark');
      const { result } = renderMode('invert', () => anchor);
      expect(result.current['data-dt-mode']).toBe('light');
    });

    it('falls back to the root mode when no ancestor sets one', () => {
      const { anchor } = setup(null);
      document.documentElement.setAttribute('data-dt-mode', 'dark');
      const { result } = renderMode('invert', () => anchor);
      expect(result.current['data-dt-mode']).toBe('light');
    });

    it('resolves from the root mode when there is no reference element', () => {
      // Resolved against nothing, the root mode (light by default) is inverted: dark.
      const { result } = renderMode('invert', () => null);
      expect(result.current['data-dt-mode']).toBe('dark');
    });

    it('updates when an ancestor mode changes', async () => {
      const { parent, anchor } = setup('dark');
      const { result } = renderMode('invert', () => anchor);
      expect(result.current['data-dt-mode']).toBe('light');

      parent.setAttribute('data-dt-mode', 'light');
      await flush();
      expect(result.current['data-dt-mode']).toBe('dark');
    });

    it('updates when the root mode changes', async () => {
      const { anchor } = setup(null);
      const { result } = renderMode('invert', () => anchor);
      expect(result.current['data-dt-mode']).toBe('dark');

      document.documentElement.setAttribute('data-dt-mode', 'dark');
      await flush();
      expect(result.current['data-dt-mode']).toBe('light');
    });

    it('disconnects its observers when unmounted', () => {
      const { anchor } = setup('dark');
      const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
      const { unmount } = renderMode('invert', () => anchor);
      disconnect.mockClear();
      unmount();
      // The contrast observer and the mode observer.
      expect(disconnect).toHaveBeenCalledTimes(2);
      disconnect.mockRestore();
    });
  });

  describe('When contentMode changes', () => {
    it('switches from an explicit mode to invert', () => {
      const parent = document.createElement('div');
      parent.setAttribute('data-dt-mode', 'light');
      const anchor = document.createElement('button');
      parent.appendChild(anchor);
      document.body.appendChild(parent);

      const { result, rerender } = renderHook(
        ({ mode }: { mode: ContentMode | null }) => useMode(mode, () => anchor),
        { initialProps: { mode: 'light' as ContentMode | null }, wrapper: StrictMode },
      );
      expect(result.current['data-dt-mode']).toBe('light');

      rerender({ mode: 'invert' });
      expect(result.current['data-dt-mode']).toBe('dark');

      rerender({ mode: null });
      expect(result.current).toEqual({});
    });
  });
});
