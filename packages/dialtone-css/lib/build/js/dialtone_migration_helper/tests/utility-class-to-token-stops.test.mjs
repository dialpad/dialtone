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

  // ─── Border-radius migration (DLT-3329) ───────────────────────────────

  describe('border-radius all-corners — legacy pixel-suffix to token stop', () => {
    const cases = [
      ['d-bar0', 'd-bar-0'],
      ['d-bar1', 'd-bar-100'],
      ['d-bar2', 'd-bar-200'],
      ['d-bar4', 'd-bar-300'],
      ['d-bar6', 'd-bar-350'],
      ['d-bar8', 'd-bar-400'],
      ['d-bar12', 'd-bar-450'],
      ['d-bar16', 'd-bar-500'],
      ['d-bar24', 'd-bar-550'],
      ['d-bar32', 'd-bar-600'],
    ];
    for (const [from, to] of cases) {
      it(`${from} → ${to}`, () => {
        assert.equal(apply(`<div class="${from}" />`), `<div class="${to}" />`);
      });
    }
  });

  describe('border-radius side-pair numeric — physical prefix to logical prefix', () => {
    const cases = [
      ['d-btr6', 'd-bbsr-350'],     // top    → block-start pair
      ['d-bbr8', 'd-bber-400'],     // bottom → block-end pair
      ['d-blr12', 'd-bisr-450'],    // left   → inline-start pair
      ['d-brr16', 'd-bier-500'],    // right  → inline-end pair
      ['d-btr24', 'd-bbsr-550'],    // new 550 stop
      ['d-bbr32', 'd-bber-600'],
      ['d-blr0', 'd-bisr-0'],
      ['d-brr1', 'd-bier-100'],
    ];
    for (const [from, to] of cases) {
      it(`${from} → ${to}`, () => {
        assert.equal(apply(`<div class="${from}" />`), `<div class="${to}" />`);
      });
    }
  });

  describe('border-radius side-pair keyword — pill/circle', () => {
    const cases = [
      ['d-btr-pill', 'd-bbsr-pill'],
      ['d-btr-circle', 'd-bbsr-circle'],
      ['d-bbr-pill', 'd-bber-pill'],
      ['d-bbr-circle', 'd-bber-circle'],
      ['d-blr-pill', 'd-bisr-pill'],
      ['d-blr-circle', 'd-bisr-circle'],
      ['d-brr-pill', 'd-bier-pill'],
      ['d-brr-circle', 'd-bier-circle'],
    ];
    for (const [from, to] of cases) {
      it(`${from} → ${to}`, () => {
        assert.equal(apply(`<div class="${from}" />`), `<div class="${to}" />`);
      });
    }
  });

  describe('border-radius canonical keyword names — unchanged', () => {
    const cases = [
      'd-bar-pill',
      'd-bar-circle',
      'd-bar-unset',
    ];
    for (const unchanged of cases) {
      it(`${unchanged} stays as ${unchanged}`, () => {
        assert.equal(apply(`<div class="${unchanged}" />`), `<div class="${unchanged}" />`);
      });
    }
  });

  describe('border-radius multi-class migration', () => {
    it('rewrites mixed legacy classes in one string', () => {
      const input = `<div class="d-bar6 d-btr8 d-blr-pill d-p-200" />`;
      const expected = `<div class="d-bar-350 d-bbsr-400 d-bisr-pill d-p-200" />`;
      assert.equal(apply(input), expected);
    });
  });
});
