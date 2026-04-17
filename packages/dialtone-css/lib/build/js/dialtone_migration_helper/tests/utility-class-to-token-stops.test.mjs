import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import config from '../configs/utility-class-to-token-stops.mjs';
import { applyConfig } from './helpers.mjs';

const apply = (input) => applyConfig(config, input);

describe('utility-class-to-token-stops config', () => {
  // ─── Off-scale pixel-indexed sizing classes (DLT-3330) ────────────────
  //
  // Old legacy Tier 1 calc-based selectors → new hyphenated px-suffixed selectors.
  // d-w1 → d-w-1px, d-h2 → d-h-2px, d-hmn8 → d-hmn-8px, etc.

  describe('off-scale sizing — legacy small-value selectors migrate to Npx', () => {
    const prefixes = ['h', 'w', 'hmn', 'hmx', 'wmn', 'wmx'];
    const pxValues = [1, 2, 8, 20, 24];

    for (const prefix of prefixes) {
      for (const px of pxValues) {
        const from = `d-${prefix}${px}`;
        const to = `d-${prefix}-${px}px`;
        it(`${from} → ${to}`, () => {
          assert.equal(apply(`<div class="${from}" />`), `<div class="${to}" />`);
        });
      }
    }
  });

  // ─── Existing scale-indexed rewrites unchanged (smoke tests) ──────────

  describe('scale-indexed sizing — unchanged', () => {
    const cases = [
      ['d-h16', 'd-h-25'],
      ['d-w32', 'd-w-50'],
      ['d-w64', 'd-w-100'],
      ['d-hmn96', 'd-hmn-150'],
      ['d-hmx128', 'd-hmx-200'],
      ['d-w1024', 'd-w-1600'],
      ['d-wmn16', 'd-wmn-25'],
    ];
    for (const [from, to] of cases) {
      it(`${from} → ${to}`, () => {
        assert.equal(apply(`<div class="${from}" />`), `<div class="${to}" />`);
      });
    }
  });

  // ─── Regex disambiguation: longer alternatives must win over shorter ones ─

  describe('regex alternation — longest match wins', () => {
    it('d-w1024 matches 1024, not 1', () => {
      assert.equal(apply(`<div class="d-w1024" />`), `<div class="d-w-1600" />`);
    });
    it('d-w128 matches 128, not 1 or 2', () => {
      assert.equal(apply(`<div class="d-w128" />`), `<div class="d-w-200" />`);
    });
    it('d-w24 matches 24 (off-scale), not 2', () => {
      assert.equal(apply(`<div class="d-w24" />`), `<div class="d-w-24px" />`);
    });
    it('d-h20 matches 20 (off-scale), not 2', () => {
      assert.equal(apply(`<div class="d-h20" />`), `<div class="d-h-20px" />`);
    });
  });

  // ─── Spacing/margin/padding classes still map to spacing stops ────────

  describe('margin / padding / gap — unchanged behavior', () => {
    const cases = [
      ['d-m8', 'd-m-100'],     // margin 8px → spacing-100
      ['d-p8', 'd-p-100'],     // padding 8px → spacing-100
      ['d-g8', 'd-g-100'],     // gap 8px → spacing-100
      ['d-mt16', 'd-mt-200'],  // margin-top 16px → spacing-200
      ['d-pb24', 'd-pb-300'],  // padding-bottom 24px → spacing-300
    ];
    for (const [from, to] of cases) {
      it(`${from} → ${to}`, () => {
        assert.equal(apply(`<div class="${from}" />`), `<div class="${to}" />`);
      });
    }
  });

  // ─── Multi-class strings ──────────────────────────────────────────────

  describe('multi-class migration', () => {
    it('migrates each off-scale sizing class in a space-separated list', () => {
      const input = `<div class="d-w1 d-h2 d-size-25 d-hmn8 d-wmx24" />`;
      const expected = `<div class="d-w-1px d-h-2px d-size-25 d-hmn-8px d-wmx-24px" />`;
      assert.equal(apply(input), expected);
    });
  });
});
