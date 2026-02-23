import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import config from '../configs/base-to-semantic.mjs';
import { applyConfig } from './helpers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const apply = (input) => applyConfig(config, input);

describe('base-to-semantic config', () => {
  // ─── Utility class map tests (data-driven) ─────────────────────────

  const mapTests = [
    ['FOREGROUND_MAP', 'fc', [
      ['black-600', 'tertiary'], ['black-700', 'secondary'], ['black-900', 'primary'],
      ['red-600', 'critical'], ['red-700', 'critical-strong'],
      ['green-800', 'success'], ['green-900', 'success-strong'], ['gold-800', 'warning'],
    ]],
    ['SURFACE_MAP', 'bgc', [
      ['black-50', 'primary'], ['black-100', 'secondary'], ['black-200', 'moderate'],
      ['black-300', 'bold'], ['black-600', 'strong'], ['black-800', 'contrast'],
      ['red-50', 'critical-subtle'], ['red-100', 'critical'], ['red-600', 'critical-strong'],
      ['gold-50', 'warning-subtle'], ['gold-100', 'warning'], ['gold-400', 'warning-strong'],
      ['green-50', 'success-subtle'], ['green-100', 'success'], ['green-800', 'success-strong'],
      ['blue-50', 'info-subtle'], ['blue-100', 'info'], ['blue-800', 'info-strong'],
      ['purple-50', 'brand-subtle'], ['purple-100', 'brand'], ['purple-600', 'brand-strong'],
    ]],
    ['BORDER_MAP', 'bc', [
      ['red-300', 'critical-subtle'], ['red-600', 'critical'], ['red-800', 'critical-strong'],
      ['green-300', 'success-subtle'], ['green-700', 'success'], ['green-900', 'success-strong'],
      ['gold-300', 'warning-subtle'], ['gold-500', 'warning'], ['gold-700', 'warning-strong'],
      ['purple-300', 'brand-subtle'], ['purple-600', 'brand'], ['purple-800', 'brand-strong'],
      ['blue-500', 'focus'],
    ]],
  ];

  for (const [name, prefix, cases] of mapTests) {
    describe(`${name}: d-${prefix}-{key} → d-${prefix}-{semantic}`, () => {
      for (const [key, semantic] of cases) {
        it(`d-${prefix}-${key} → d-${prefix}-${semantic}`, () => {
          assert.equal(apply(`d-${prefix}-${key}`), `d-${prefix}-${semantic}`);
        });
      }
    });
  }

  describe('d-divide uses BORDER_MAP', () => {
    it('d-divide-red-600 → d-divide-critical', () => {
      assert.equal(apply('d-divide-red-600'), 'd-divide-critical');
    });
    it('d-divide-green-700 → d-divide-success', () => {
      assert.equal(apply('d-divide-green-700'), 'd-divide-success');
    });
  });

  // ─── Utility edge cases (data-driven) ──────────────────────────────

  const edgeCases = [
    // Unmapped
    ['d-fc-purple-600', 'd-fc-purple-600', 'no foreground mapping for purple'],
    ['d-bgc-magenta-400', 'd-bgc-magenta-400', 'no semantic for magenta'],
    ['d-fc-black-500', 'd-fc-black-500', 'ambiguous: placeholder/disabled'],
    ['d-bc-blue-200', 'd-bc-blue-200', 'no border mapping'],
    // Pseudo-prefixed
    ['h:d-fc-red-600', 'h:d-fc-critical', 'hover pseudo prefix'],
    ['f:d-bgc-black-100', 'f:d-bgc-secondary', 'focus pseudo prefix'],
    // Responsive-prefixed
    ['sm:d-bgc-black-100', 'sm:d-bgc-secondary', 'sm responsive prefix'],
    ['md:d-bc-red-600', 'md:d-bc-critical', 'md responsive prefix'],
    // Already-semantic (no digit suffix → regex doesn't match)
    ['d-fc-critical', 'd-fc-critical', 'already semantic foreground'],
    ['d-bgc-primary', 'd-bgc-primary', 'already semantic surface'],
    ['d-bc-success', 'd-bc-success', 'already semantic border'],
  ];

  describe('utility edge cases', () => {
    for (const [input, expected, label] of edgeCases) {
      it(`${input} → ${expected} (${label})`, () => {
        assert.equal(apply(input), expected);
      });
    }
  });

  // ─── CSS property context tests ────────────────────────────────────

  describe('CSS property context', () => {
    const cssCases = [
      // color: → foreground
      ['.a {\n  color: var(--dt-color-red-600);\n}', 'foreground-critical', 'color: → foreground'],
      ['.a {\n  color: var(--dt-color-black-900);\n}', 'foreground-primary', 'color: black-900'],
      // background-color → surface
      ['.a { background-color: var(--dt-color-red-100); }', 'surface-critical', 'background-color:'],
      // background shorthand → surface
      ['.a { background: var(--dt-color-red-100); }', 'surface-critical', 'background shorthand'],
      ['.a { background: var(--dt-color-purple-100); }', 'surface-brand', 'background: purple-100'],
      // background shorthand with other values
      ['.a { background: var(--dt-color-black-100) url(\'b.png\') no-repeat center; }',
        'surface-secondary', 'bg: color before image'],
      ['.a { background: url(\'i.svg\') no-repeat var(--dt-color-green-100); }',
        'surface-success', 'bg: color after image'],
      ['.a { background: var(--dt-color-blue-100) no-repeat center / cover; }',
        'surface-info', 'bg: color + size shorthand'],
      ['.a { background: var(--dt-color-red-50) url(\'t.png\') repeat-x top left; }',
        'surface-critical-subtle', 'bg: color + image + repeat + position'],
      // border-color → border
      ['.a { border-color: var(--dt-color-red-600); }', 'border-critical', 'border-color:'],
      ['.a { border-top-color: var(--dt-color-green-700); }', 'border-success', 'border-top-color:'],
      // border shorthand
      ['.a { border: var(--dt-size-border-300) solid var(--dt-color-red-600); }',
        'border-critical', 'border shorthand'],
      // logical properties
      ['.a { border-block-start: var(--dt-size-border-100) solid var(--dt-color-red-600); }',
        'border-critical', 'border-block-start'],
      ['.a { border-inline-end-color: var(--dt-color-green-700); }',
        'border-success', 'border-inline-end-color'],
      ['.a { border-block-end-color: var(--dt-color-gold-500); }',
        'border-warning', 'border-block-end-color'],
    ];

    for (const [input, expectedToken, label] of cssCases) {
      it(label, () => {
        assert.ok(apply(input).includes(`var(--dt-color-${expectedToken})`));
      });
    }

    it('same base color → different semantic per property', () => {
      const input = [
        '.a {', '  color: var(--dt-color-red-600);',
        '  background-color: var(--dt-color-red-600);',
        '  border-color: var(--dt-color-red-600);', '}',
      ].join('\n');
      const output = apply(input);
      assert.ok(output.includes('var(--dt-color-foreground-critical)'));
      assert.ok(output.includes('var(--dt-color-surface-critical-strong)'));
      assert.ok(output.includes('var(--dt-color-border-critical)'));
    });
  });

  // ─── Skip cases ────────────────────────────────────────────────────

  describe('skip cases', () => {
    const skipCases = [
      ['.a { --my-color: var(--dt-color-red-600); }', 'custom property'],
      ['.a {\n  color: var(--dt-color-red-600-hsl);\n}', 'HSL variant'],
      ['.a {\n  color: var(--dt-color-foreground-critical);\n}', 'already semantic'],
      ['var(--dt-color-red-600)', 'bare var() no property context'],
      ['.a { fill: var(--dt-color-red-600); }', 'fill property'],
      ['.a {\n  color: var(--dt-color-purple-600);\n}', 'unmapped in CSS property'],
    ];

    for (const [input, label] of skipCases) {
      it(`unchanged: ${label}`, () => {
        assert.equal(apply(input), input);
      });
    }
  });

  // ─── Integration: .vue file ────────────────────────────────────────

  describe('example .vue file integration', () => {
    let input;

    before(async () => {
      input = await readFile(
        join(__dirname, 'base-to-semantic-test-examples.vue'), 'utf8',
      );
    });

    it('replaces mapped utility classes and preserves unmapped', () => {
      const output = apply(input);
      assert.ok(output.includes('d-fc-critical'));
      assert.ok(output.includes('d-bgc-secondary'));
      assert.ok(output.includes('d-bc-critical'));
      assert.ok(output.includes('d-divide-critical'));
      assert.ok(output.includes('d-fc-purple-600'), 'unmapped preserved');
      assert.ok(output.includes('d-bgc-magenta-400'), 'unmapped preserved');
    });

    it('replaces CSS property contexts and preserves skip cases', () => {
      const output = apply(input);
      assert.ok(output.includes('var(--dt-color-foreground-critical)'));
      assert.ok(output.includes('var(--dt-color-surface-critical)'));
      assert.ok(output.includes('var(--dt-color-border-critical)'));
      assert.ok(output.includes('var(--dt-size-border-300) solid var(--dt-color-border-critical)'));
      assert.ok(output.includes('--my-color: var(--dt-color-red-600)'));
    });

    it('context-sensitive: same base color → different semantics', () => {
      const block = apply(input).split('.test-context-difference')[1].split('}')[0];
      assert.ok(block.includes('foreground-critical'));
      assert.ok(block.includes('surface-critical-strong'));
      assert.ok(block.includes('border-critical'));
    });
  });
});
