import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import config from '../configs/size-to-layout.mjs';
import { applyConfig } from './helpers.mjs';

const apply = (input) => applyConfig(config, input);

describe('size-to-layout config', () => {
  // ─── Off-scale pixel-indexed exceptions (DLT-3330) ────────────────────
  //
  // Layout-property context only: old --dt-size-N stop at these pixel values
  // maps to the off-scale --dt-layout-Npx token.
  // 100 → 1px, 200 → 2px, 400 → 8px, 525 → 20px, 550 → 24px

  describe('off-scale exceptions — layout context routes to --dt-layout-Npx', () => {
    const offScaleCases = [
      ['width',           '--dt-size-100', '--dt-layout-1px'],
      ['height',          '--dt-size-200', '--dt-layout-2px'],
      ['min-inline-size', '--dt-size-400', '--dt-layout-8px'],
      ['max-width',       '--dt-size-525', '--dt-layout-20px'],
      ['block-size',      '--dt-size-550', '--dt-layout-24px'],
      ['inline-size',     '--dt-size-100', '--dt-layout-1px'],
      ['min-height',      '--dt-size-400', '--dt-layout-8px'],
      ['flex-basis',      '--dt-size-400', '--dt-layout-8px'],
    ];

    for (const [prop, from, to] of offScaleCases) {
      it(`${prop}: var(${from}) → var(${to})`, () => {
        const result = apply(`.x { ${prop}: var(${from}); }`);
        assert.equal(result, `.x { ${prop}: var(${to}); }`);
      });
    }
  });

  describe('off-scale exceptions — spacing context STILL routes to --dt-spacing-* (regression guard)', () => {
    // These are the same stops, but used in spacing-property context.
    // The LAYOUT_MAP additions must NOT leak into spacing routing.
    const spacingRegressionCases = [
      ['padding',        '--dt-size-100', '--dt-spacing-1'],
      ['margin',         '--dt-size-200', '--dt-spacing-25'],
      ['gap',            '--dt-size-400', '--dt-spacing-100'],
      ['padding-block',  '--dt-size-525', '--dt-spacing-250'],
      ['margin-inline',  '--dt-size-550', '--dt-spacing-300'],
      ['inset',          '--dt-size-400', '--dt-spacing-100'],
    ];

    for (const [prop, from, to] of spacingRegressionCases) {
      it(`${prop}: var(${from}) → var(${to})`, () => {
        const result = apply(`.x { ${prop}: var(${from}); }`);
        assert.equal(result, `.x { ${prop}: var(${to}); }`);
      });
    }
  });

  // ─── Existing scale-indexed behavior unchanged (smoke tests) ──────────

  describe('scale-indexed stops — unchanged', () => {
    const scaleCases = [
      ['width',   '--dt-size-500',  '--dt-layout-25'],  // 16px
      ['width',   '--dt-size-700',  '--dt-layout-100'], // 64px
      ['width',   '--dt-size-1100', '--dt-layout-1600'], // 1024px
      ['padding', '--dt-size-700',  '--dt-spacing-800'], // 64px
      ['margin',  '--dt-size-500',  '--dt-spacing-200'], // 16px
    ];

    for (const [prop, from, to] of scaleCases) {
      it(`${prop}: var(${from}) → var(${to})`, () => {
        const result = apply(`.x { ${prop}: var(${from}); }`);
        assert.equal(result, `.x { ${prop}: var(${to}); }`);
      });
    }
  });

  // ─── Logical properties and custom property name heuristics ───────────

  describe('off-scale — custom property name heuristics', () => {
    it('--panel-width: var(--dt-size-400) → --dt-layout-8px', () => {
      const result = apply(`.x { --panel-width: var(--dt-size-400); }`);
      assert.equal(result, `.x { --panel-width: var(--dt-layout-8px); }`);
    });

    it('--badge-padding-x: var(--dt-size-400) → --dt-spacing-100 (stays spacing)', () => {
      const result = apply(`.x { --badge-padding-x: var(--dt-size-400); }`);
      assert.equal(result, `.x { --badge-padding-x: var(--dt-spacing-100); }`);
    });
  });
});
