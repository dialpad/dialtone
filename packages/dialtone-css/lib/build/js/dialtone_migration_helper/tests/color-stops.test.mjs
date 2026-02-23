import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import config from '../configs/color-stops.mjs';
import { applyConfig } from './helpers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const apply = (input) => applyConfig(config, input);

// ─── Unit tests: individual replacements ──────────────────────────────

describe('color-stops config', () => {
  describe('CSS custom properties', () => {
    const cases = [
      // Purple
      ['var(--dt-color-purple-250)', 'var(--dt-color-purple-300)'],
      ['var(--dt-color-purple-300)', 'var(--dt-color-purple-400)'],
      ['var(--dt-color-purple-350)', 'var(--dt-color-purple-500)'],
      ['var(--dt-color-purple-400)', 'var(--dt-color-purple-600)'],
      ['var(--dt-color-purple-450)', 'var(--dt-color-purple-700)'],
      ['var(--dt-color-purple-500)', 'var(--dt-color-purple-800)'],
      ['var(--dt-color-purple-550)', 'var(--dt-color-purple-900)'],
      ['var(--dt-color-purple-600)', 'var(--dt-color-purple-950)'],
      // Blue
      ['var(--dt-color-blue-425)', 'var(--dt-color-blue-500)'],
      ['var(--dt-color-blue-450)', 'var(--dt-color-blue-600)'],
      ['var(--dt-color-blue-475)', 'var(--dt-color-blue-700)'],
      ['var(--dt-color-blue-500)', 'var(--dt-color-blue-800)'],
      ['var(--dt-color-blue-600)', 'var(--dt-color-blue-900)'],
      ['var(--dt-color-blue-900)', 'var(--dt-color-blue-950)'],
      // Magenta
      ['var(--dt-color-magenta-250)', 'var(--dt-color-magenta-300)'],
      ['var(--dt-color-magenta-300)', 'var(--dt-color-magenta-400)'],
      ['var(--dt-color-magenta-400)', 'var(--dt-color-magenta-500)'],
      ['var(--dt-color-magenta-425)', 'var(--dt-color-magenta-600)'],
      ['var(--dt-color-magenta-475)', 'var(--dt-color-magenta-700)'],
      ['var(--dt-color-magenta-500)', 'var(--dt-color-magenta-800)'],
      ['var(--dt-color-magenta-600)', 'var(--dt-color-magenta-900)'],
      ['var(--dt-color-magenta-900)', 'var(--dt-color-magenta-950)'],
      // Gold
      ['var(--dt-color-gold-350)', 'var(--dt-color-gold-400)'],
      ['var(--dt-color-gold-400)', 'var(--dt-color-gold-500)'],
      ['var(--dt-color-gold-450)', 'var(--dt-color-gold-600)'],
      ['var(--dt-color-gold-500)', 'var(--dt-color-gold-700)'],
      ['var(--dt-color-gold-600)', 'var(--dt-color-gold-800)'],
      ['var(--dt-color-gold-700)', 'var(--dt-color-gold-900)'],
      ['var(--dt-color-gold-900)', 'var(--dt-color-gold-950)'],
      // Green
      ['var(--dt-color-green-350)', 'var(--dt-color-green-400)'],
      ['var(--dt-color-green-400)', 'var(--dt-color-green-500)'],
      ['var(--dt-color-green-425)', 'var(--dt-color-green-600)'],
      ['var(--dt-color-green-475)', 'var(--dt-color-green-700)'],
      ['var(--dt-color-green-500)', 'var(--dt-color-green-800)'],
      ['var(--dt-color-green-600)', 'var(--dt-color-green-900)'],
      ['var(--dt-color-green-900)', 'var(--dt-color-green-950)'],
      // Red
      ['var(--dt-color-red-350)', 'var(--dt-color-red-400)'],
      ['var(--dt-color-red-400)', 'var(--dt-color-red-500)'],
      ['var(--dt-color-red-450)', 'var(--dt-color-red-600)'],
      ['var(--dt-color-red-500)', 'var(--dt-color-red-700)'],
      ['var(--dt-color-red-600)', 'var(--dt-color-red-800)'],
      ['var(--dt-color-red-700)', 'var(--dt-color-red-900)'],
      ['var(--dt-color-red-900)', 'var(--dt-color-red-950)'],
    ];

    for (const [input, expected] of cases) {
      it(`${input} → ${expected}`, () => {
        assert.equal(apply(input), expected);
      });
    }
  });

  describe('HSL variants', () => {
    const suffixes = ['-h', '-s', '-l', '-hsl'];
    for (const suffix of suffixes) {
      it(`purple-350${suffix} → purple-500${suffix}`, () => {
        assert.equal(
          apply(`var(--dt-color-purple-350${suffix})`),
          `var(--dt-color-purple-500${suffix})`,
        );
      });
    }
  });

  describe('utility classes', () => {
    const prefixes = ['bgc', 'fc', 'bc', 'bgg-from', 'bgg-to'];
    for (const prefix of prefixes) {
      it(`d-${prefix}-purple-350 → d-${prefix}-purple-500`, () => {
        assert.equal(
          apply(`d-${prefix}-purple-350`),
          `d-${prefix}-purple-500`,
        );
      });
    }
  });

  describe('pseudo-prefixed utility classes', () => {
    it('h:d-bgc-purple-350 → h:d-bgc-purple-500', () => {
      assert.equal(apply('h:d-bgc-purple-350'), 'h:d-bgc-purple-500');
    });
    it('f:d-fc-blue-425 → f:d-fc-blue-500', () => {
      assert.equal(apply('f:d-fc-blue-425'), 'f:d-fc-blue-500');
    });
    it('a:d-bc-green-500 → a:d-bc-green-800', () => {
      assert.equal(apply('a:d-bc-green-500'), 'a:d-bc-green-800');
    });
  });

  describe('responsive-prefixed utility classes', () => {
    it('sm:d-bgc-magenta-400 → sm:d-bgc-magenta-500', () => {
      assert.equal(apply('sm:d-bgc-magenta-400'), 'sm:d-bgc-magenta-500');
    });
    it('md:d-fc-gold-450 → md:d-fc-gold-600', () => {
      assert.equal(apply('md:d-fc-gold-450'), 'md:d-fc-gold-600');
    });
  });

  describe('unchanged stops are not modified', () => {
    const unchanged = [50, 100, 200, 1000];
    for (const stop of unchanged) {
      it(`purple-${stop} unchanged`, () => {
        assert.equal(
          apply(`var(--dt-color-purple-${stop})`),
          `var(--dt-color-purple-${stop})`,
        );
      });
    }
    // Blue/gold/green/red also keep 300
    for (const color of ['blue', 'gold', 'green', 'red']) {
      it(`${color}-300 unchanged`, () => {
        assert.equal(
          apply(`var(--dt-color-${color}-300)`),
          `var(--dt-color-${color}-300)`,
        );
      });
    }
  });

  describe('non-accent colors are not modified', () => {
    it('black-500 unchanged', () => {
      assert.equal(
        apply('var(--dt-color-black-500)'),
        'var(--dt-color-black-500)',
      );
    });
    it('tan-300 unchanged', () => {
      assert.equal(
        apply('var(--dt-color-tan-300)'),
        'var(--dt-color-tan-300)',
      );
    });
    it('d-bgc-black-300 unchanged', () => {
      assert.equal(apply('d-bgc-black-300'), 'd-bgc-black-300');
    });
  });

  describe('collision safety (single-pass)', () => {
    it('purple-300 becomes 400, not 600', () => {
      assert.equal(
        apply('var(--dt-color-purple-300)'),
        'var(--dt-color-purple-400)',
      );
    });
    it('magenta-300 becomes 400, not 500', () => {
      assert.equal(
        apply('var(--dt-color-magenta-300)'),
        'var(--dt-color-magenta-400)',
      );
    });
  });

  describe('multi-match string (simulates real file)', () => {
    it('replaces multiple references in one string correctly', () => {
      const input =
        '.card { color: var(--dt-color-purple-350); background: var(--dt-color-purple-400); }';
      const expected =
        '.card { color: var(--dt-color-purple-500); background: var(--dt-color-purple-600); }';
      assert.equal(apply(input), expected);
    });
  });

  // ─── Integration: run against the example .vue file ──────────────────

  describe('example .vue file integration', () => {
    let input;

    before(async () => {
      input = await readFile(
        join(__dirname, 'base-color-migration-test-examples.vue'), 'utf8',
      );
    });

    it('transforms all old stops to new stops', () => {
      const output = apply(input);

      // Old stops that should have been replaced should NOT appear
      const oldStops = [
        'purple-250', 'purple-350', 'purple-450', 'purple-550',
        'blue-425', 'blue-475',
        'magenta-250', 'magenta-425', 'magenta-475',
        'gold-350', 'gold-450',
        'green-350', 'green-425', 'green-475',
        'red-350', 'red-450',
      ];
      const prefixes = ['dt-color-', 'd-bgc-', 'd-fc-', 'd-bc-', 'd-bgg-from-', 'd-bgg-to-'];
      for (const old of oldStops) {
        for (const prefix of prefixes) {
          assert.ok(!output.includes(`${prefix}${old}`), `"${prefix}${old}" should have been replaced`);
        }
      }

      // New stops that should appear
      const newStops = [
        'purple-500', 'purple-700', 'purple-900', 'purple-950',
        'blue-500', 'blue-700',
        'magenta-300', 'magenta-600', 'magenta-700',
        'gold-400', 'gold-600',
        'green-400', 'green-600', 'green-700',
        'red-400', 'red-600',
      ];
      for (const newStop of newStops) {
        assert.ok(output.includes(newStop), `New stop "${newStop}" should appear in output`);
      }

      // Unchanged stops should still be present
      assert.ok(output.includes('purple-50'), 'purple-50 unchanged');
      assert.ok(output.includes('purple-100'), 'purple-100 unchanged');
      assert.ok(output.includes('purple-200'), 'purple-200 unchanged');
      assert.ok(output.includes('purple-1000'), 'purple-1000 unchanged');
      assert.ok(output.includes('blue-300'), 'blue-300 unchanged');

      // Non-accent colors should be untouched
      assert.ok(output.includes('black-500'), 'black-500 untouched');
      assert.ok(output.includes('tan-300'), 'tan-300 untouched');
    });
  });
});
