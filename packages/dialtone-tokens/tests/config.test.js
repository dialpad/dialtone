import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  setMode,
  setBrand,
  setMaterial,
  setContrast,
  initDialtoneTheme,
  getBrandMaterial,
  hasBrandMaterialLock,
  resetTheme,
  VALID_MATERIALS,
} from '@/themes/config.js';
import {
  dpStub,
  melonStub,
  botanyStub,
  unknownMaterialBrandStub,
  highContrastStub,
} from './fixtures/theme-stubs.js';
import { setupRoot, setupShadowHost } from './fixtures/dom-helpers.js';

describe('themes/config.js', () => {
  let root;
  let warnSpy;

  beforeEach(() => {
    root = setupRoot();
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    resetTheme(document.documentElement);
    document.head
      .querySelectorAll('style[id^="dialtone-css-"]')
      .forEach((el) => el.remove());
    vi.restoreAllMocks();
  });

  describe('initDialtoneTheme', () => {
    describe('When the brand declares a material lock', () => {
      it.each([
        ['iron', melonStub],
        ['sandstone', botanyStub],
      ])('Should apply data-dt-material="%s"', (expected, brand) => {
        initDialtoneTheme(brand, 'light', root);
        expect(root.getAttribute('data-dt-material')).toBe(expected);
      });
    });

    describe('When the brand has no material lock', () => {
      it('Should apply the seeded sandstone default', () => {
        initDialtoneTheme(dpStub, 'light', root);
        expect(root.getAttribute('data-dt-material')).toBe('sandstone');
      });
    });

    describe('When called with malformed input', () => {
      it.each([
        ['null brand', null, 'light'],
        ['brand without name', { brand: { css: ':root {}' } }, 'light'],
        ['brand without css', { brand: { name: 'x' } }, 'light'],
        ['invalid mode', dpStub, 'invalid'],
      ])('Should throw TypeError on %s', (_label, brand, mode) => {
        expect(() => initDialtoneTheme(brand, mode, root)).toThrow(TypeError);
      });

      it('Should throw TypeError on null rootNode', () => {
        expect(() => initDialtoneTheme(dpStub, 'light', null)).toThrow(TypeError);
      });
    });

    describe('When initialized on documentElement and theme styles already exist', () => {
      it('Should throw to prevent embedded-app double-init', () => {
        const coreStyle = document.createElement('style');
        coreStyle.id = 'dialtone-css-core';
        document.head.appendChild(coreStyle);
        expect(() =>
          initDialtoneTheme(dpStub, 'light', document.documentElement),
        ).toThrow(/embedded/i);
      });
    });
  });

  describe('setBrand', () => {
    describe('When the brand declares an unknown material name', () => {
      beforeEach(() => {
        setBrand(unknownMaterialBrandStub, root);
      });

      it('Should warn with brand and material context', () => {
        const message = warnSpy.mock.calls.flat().join(' ');
        expect(message).toContain(`brand '${unknownMaterialBrandStub.brand.name}'`);
        expect(message).toContain(`unknown material '${unknownMaterialBrandStub.material.name}'`);
      });

      it('Should fall back to data-dt-material="sandstone"', () => {
        expect(root.getAttribute('data-dt-material')).toBe('sandstone');
      });
    });

    describe('When called with malformed input', () => {
      it.each([
        ['null', null],
        ['number', 42],
        ['empty object', {}],
        ['brand without name', { brand: { css: ':root {}' } }],
        ['brand with empty name', { brand: { name: '', css: ':root {}' } }],
        ['brand without css', { brand: { name: 'x' } }],
        ['brand with non-string css', { brand: { name: 'x', css: 123 } }],
      ])('Should throw TypeError on %s', (_label, input) => {
        expect(() => setBrand(input, root)).toThrow(TypeError);
      });
    });
  });

  describe('setMaterial', () => {
    describe('When called with a known material name', () => {
      it.each(VALID_MATERIALS)(
        'Should set data-dt-material="%s" without injecting a style tag',
        (name) => {
          setMaterial(name, root);
          expect(root.getAttribute('data-dt-material')).toBe(name);
          expect(root.querySelector('#dialtone-css-material')).toBeNull();
        },
      );
    });

    describe('When called with null or undefined', () => {
      beforeEach(() => {
        setMaterial('steel', root);
      });

      it.each([null, undefined])(
        'Should reset to sandstone without injecting a style tag (%p)',
        (sentinel) => {
          setMaterial(sentinel, root);
          expect(root.getAttribute('data-dt-material')).toBe('sandstone');
          expect(root.querySelector('#dialtone-css-material')).toBeNull();
        },
      );
    });

    describe('When called with an unknown name', () => {
      beforeEach(() => {
        setMaterial('unobtainium', root);
      });

      it('Should warn with the unknown name in context', () => {
        const message = warnSpy.mock.calls.flat().join(' ');
        expect(message).toContain('unknown material \'unobtainium\'');
      });

      it('Should fall back to data-dt-material="sandstone"', () => {
        expect(root.getAttribute('data-dt-material')).toBe('sandstone');
      });
    });

    describe('When called with a non-string non-null name', () => {
      it('Should throw TypeError', () => {
        expect(() => setMaterial(42, root)).toThrow(TypeError);
      });
    });
  });

  describe('Shadow DOM rootNode handling', () => {
    const directShadowRootCallers = [
      ['setMode', (rootNode) => setMode('dark', rootNode)],
      ['setBrand', (rootNode) => setBrand(dpStub, rootNode)],
      ['setMaterial', (rootNode) => setMaterial('steel', rootNode)],
      ['setContrast', (rootNode) => setContrast(highContrastStub, rootNode)],
      ['initDialtoneTheme', (rootNode) => initDialtoneTheme(dpStub, 'light', rootNode)],
    ];

    describe('When a ShadowRoot is passed directly', () => {
      it.each(directShadowRootCallers)('%s should warn', (_name, call) => {
        const { shadowRoot } = setupShadowHost();
        try {
          call(shadowRoot);
        } catch {
          // The downstream setAttribute throws on ShadowRoot; the warn fires first.
        }
        const message = warnSpy.mock.calls.flat().join(' ');
        expect(message).toMatch(/ShadowRoot/);
      });
    });

    it('host-with-shadowRoot: sets data-dt-* attributes on host, injects styles into shadowRoot', () => {
      const { host, shadowRoot } = setupShadowHost();
      initDialtoneTheme(dpStub, 'light', host);
      expect(host.getAttribute('data-dt-mode')).toBe('light');
      expect(host.getAttribute('data-dt-brand')).toBe(dpStub.brand.name);
      expect(host.getAttribute('data-dt-contrast')).toBe('default');
      expect(shadowRoot.querySelector('#dialtone-css-core')).not.toBeNull();
      expect(shadowRoot.querySelector('#dialtone-css-brand-colors')).not.toBeNull();
    });
  });

  describe('getBrandMaterial', () => {
    it.each([
      ['locked-iron brand', melonStub, 'iron'],
      ['locked-sandstone brand', botanyStub, 'sandstone'],
      ['free-choice brand', dpStub, null],
    ])('Should return the locked name or null (%s)', (_label, brand, expected) => {
      expect(getBrandMaterial(brand)).toBe(expected);
    });
  });

  describe('hasBrandMaterialLock', () => {
    it.each([
      ['locked-iron brand', melonStub, true],
      ['locked-sandstone brand', botanyStub, true],
      ['free-choice brand', dpStub, false],
    ])('Should return true/false (%s)', (_label, brand, expected) => {
      expect(hasBrandMaterialLock(brand)).toBe(expected);
    });
  });

  describe('resetTheme', () => {
    describe('When called on a root with theme attributes set', () => {
      beforeEach(() => {
        initDialtoneTheme(melonStub, 'dark', root);
        resetTheme(root);
      });

      it.each([
        'data-dt-mode',
        'data-dt-brand',
        'data-dt-material',
        'data-dt-contrast',
      ])('Should remove %s', (attr) => {
        expect(root.getAttribute(attr)).toBeNull();
      });
    });
  });
});
