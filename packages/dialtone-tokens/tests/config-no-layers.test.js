import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initDialtoneThemeNoLayers } from '@/themes/config-no-layers.js';
import { resetBrand } from '@/themes/config.js';
import { dpStub } from './fixtures/theme-stubs.js';
import { setupRoot } from './fixtures/dom-helpers.js';

describe('themes/config-no-layers.js', () => {
  let root;

  beforeEach(() => {
    root = setupRoot();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    resetBrand(document.documentElement);
    document.head
      .querySelectorAll('style[id^="dialtone-css-"]')
      .forEach((el) => el.remove());
    vi.restoreAllMocks();
  });

  describe('initDialtoneThemeNoLayers', () => {
    it('Should apply the no-layers core tokens synchronously, with no dynamic import delay', () => {
      initDialtoneThemeNoLayers(dpStub, 'light', root);

      // Unlike initDialtoneTheme(..., { layers: false }), no await/waitFor is
      // needed here — the core CSS must already be applied when the call returns.
      expect(root.querySelector('#dialtone-css-core').innerHTML).toContain('--dt-no-layers-marker');
    });

    it('Should behave like initDialtoneTheme(..., { layers: false }) otherwise', () => {
      initDialtoneThemeNoLayers(dpStub, 'light', root);

      expect(root.getAttribute('data-dt-mode')).toBe('light');
      expect(root.getAttribute('data-dt-brand')).toBe(dpStub.brand.name);
    });
  });
});
