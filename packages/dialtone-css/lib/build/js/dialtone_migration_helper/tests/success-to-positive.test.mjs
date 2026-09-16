import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import config from '../configs/success-to-positive.mjs';
import { applyConfig } from './helpers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const apply = (input) => applyConfig(config, input);

describe('success-to-positive config', () => {
  // ─── CSS variable references (data-driven per family) ──────────────────────

  // Suffix variants per family. The four families (foreground, surface, border,
  // link) emit different subsets, so each family lists exactly the suffixes
  // it ships with.
  const variableTests = [
    ['foreground', [
      '', '-strong', '-inverted', '-strong-inverted',
    ]],
    ['surface', [
      '', '-subtle', '-strong',
      '-opaque', '-subtle-opaque',
      '-inverted', '-subtle-inverted', '-strong-inverted',
      '-opaque-inverted', '-subtle-opaque-inverted',
    ]],
    ['border', [
      '', '-subtle', '-strong',
      '-inverted', '-subtle-inverted', '-strong-inverted',
    ]],
    ['link', [
      '', '-hover', '-inverted', '-inverted-hover',
    ]],
  ];

  for (const [category, suffixes] of variableTests) {
    describe(`var(--dt-color-${category}-success*) → var(--dt-color-${category}-positive*)`, () => {
      for (const suffix of suffixes) {
        const input = `var(--dt-color-${category}-success${suffix})`;
        const expected = `var(--dt-color-${category}-positive${suffix})`;
        it(`${input} → ${expected}`, () => {
          assert.equal(apply(input), expected);
        });
      }
    });
  }

  // ─── Utility class renames (data-driven per prefix) ────────────────────────

  const utilityTests = [
    ['fc', [
      '', '-strong', '-inverted', '-strong-inverted',
    ]],
    ['bgc', [
      '', '-subtle', '-strong',
      '-opaque', '-subtle-opaque',
      '-inverted', '-subtle-inverted', '-strong-inverted',
      '-opaque-inverted', '-subtle-opaque-inverted',
    ]],
    ['bc', [
      '', '-subtle', '-strong',
      '-inverted', '-subtle-inverted', '-strong-inverted',
    ]],
  ];

  for (const [prefix, suffixes] of utilityTests) {
    describe(`d-${prefix}-success* → d-${prefix}-positive*`, () => {
      for (const suffix of suffixes) {
        const input = `d-${prefix}-success${suffix}`;
        const expected = `d-${prefix}-positive${suffix}`;
        it(`${input} → ${expected}`, () => {
          assert.equal(apply(input), expected);
        });
      }
    });
  }

  // ─── Utility class context: pseudo / responsive / inside attributes ────────

  describe('utility class context cases', () => {
    const cases = [
      ['h:d-fc-success', 'h:d-fc-positive', 'hover pseudo prefix'],
      ['f:d-bgc-success-subtle', 'f:d-bgc-positive-subtle', 'focus pseudo + subtle'],
      ['sm:d-bgc-success', 'sm:d-bgc-positive', 'sm responsive'],
      ['md:d-bc-success-strong', 'md:d-bc-positive-strong', 'md responsive + strong'],
      [
        '<div class="d-bgc-success d-fc-success-strong">',
        '<div class="d-bgc-positive d-fc-positive-strong">',
        'multiple classes in class attribute',
      ],
      [
        ':class="\'d-bc-success-subtle\'"',
        ':class="\'d-bc-positive-subtle\'"',
        'dynamic :class binding',
      ],
      [
        '`d-bgc-success`',
        '`d-bgc-positive`',
        'template literal containing only d-bgc-success',
      ],
    ];

    for (const [input, expected, label] of cases) {
      it(label, () => {
        assert.equal(apply(input), expected);
      });
    }
  });

  // ─── CSS property context: full declarations are rewritten correctly ───────

  describe('CSS property context', () => {
    const cssCases = [
      [
        '.a { color: var(--dt-color-foreground-success); }',
        '.a { color: var(--dt-color-foreground-positive); }',
        'color: foreground',
      ],
      [
        '.a { background-color: var(--dt-color-surface-success-subtle); }',
        '.a { background-color: var(--dt-color-surface-positive-subtle); }',
        'background-color: surface-subtle',
      ],
      [
        '.a { border-color: var(--dt-color-border-success); }',
        '.a { border-color: var(--dt-color-border-positive); }',
        'border-color: border',
      ],
      [
        '.a { color: var(--dt-color-link-success-hover); }',
        '.a { color: var(--dt-color-link-positive-hover); }',
        'color: link-hover',
      ],
      [
        '--my-token: var(--dt-color-surface-success-opaque-inverted);',
        '--my-token: var(--dt-color-surface-positive-opaque-inverted);',
        'custom property assignment with deepest variant',
      ],
    ];

    for (const [input, expected, label] of cssCases) {
      it(label, () => {
        assert.equal(apply(input), expected);
      });
    }
  });

  // ─── Skip cases (must NOT be modified) ─────────────────────────────────────

  describe('skip cases', () => {
    const skipCases = [
      // English words that contain "success" as a prefix
      ['Operation completed successfully.', 'English word "successfully"'],
      ['The successful run reported nothing.', 'English word "successful"'],
      ['// Skip on success: avoid retrying.', 'comment containing the word success'],
      // Custom-named tokens / classes that are not part of the rename family
      ['var(--dt-color-success-something)', 'unknown CSS variable shape'],
      ['var(--my-success-color)', 'unrelated custom property name'],
      ['.d-fc-success-foo', 'utility-like class with non-allowed suffix'],
      ['d-status-success', 'class with success in middle, not d-fc/bgc/bc'],
      ['my-d-bgc-success', 'class-name suffix that contains a utility token'],
      ['custom-d-fc-success-strong', 'longer custom class containing utility token'],
      // Already migrated
      ['var(--dt-color-foreground-positive)', 'already migrated foreground'],
      ['d-bgc-positive-subtle', 'already migrated utility'],
      // Other base / semantic family names should be untouched
      ['d-fc-critical', 'unrelated semantic'],
      ['d-bgc-warning-subtle', 'unrelated semantic family'],
    ];

    for (const [input, label] of skipCases) {
      it(`unchanged: ${label}`, () => {
        assert.equal(apply(input), input);
      });
    }
  });

  // ─── Boundary: success-foo should NOT match because -foo isn't a suffix ────

  describe('suffix boundary protection', () => {
    it('does not consume "-foo" suffix when matching success', () => {
      assert.equal(apply('d-bgc-success-foo'), 'd-bgc-success-foo');
    });

    it('does not partial-match before "fully"', () => {
      assert.equal(
        apply('Test ran successfully across all envs.'),
        'Test ran successfully across all envs.',
      );
    });

    it('does not rewrite d-bgc-success when followed by an unknown hyphen-letter suffix', () => {
      // d-bgc-success-x is invalid; the regex should bail out and leave it alone
      assert.equal(apply('d-bgc-success-x'), 'd-bgc-success-x');
    });

    it('skips template-literal interpolation patterns (manual migration required)', () => {
      // ` ${...} ` interpolation after `success-` is not a known suffix; flag for
      // manual migration instead of guessing the runtime value.
      const input = '`d-bgc-success-${state}`';
      assert.equal(apply(input), input);
    });
  });

  // ─── Component-specific tokens ─────────────────────────────────────────────

  describe('component-specific tokens (badge / inputs)', () => {
    const cases = [
      ['var(--dt-badge-color-background-success)', 'var(--dt-badge-color-background-positive)'],
      ['var(--dt-inputs-color-border-success)', 'var(--dt-inputs-color-border-positive)'],
    ];
    for (const [input, expected] of cases) {
      it(`${input} → ${expected}`, () => {
        assert.equal(apply(input), expected);
      });
    }
  });

  // ─── Cross-family in one pass ──────────────────────────────────────────────

  describe('cross-family migration in a single pass', () => {
    it('rewrites foreground, surface, border, link, and utility classes together', () => {
      const input = [
        '<div class="d-fc-success d-bgc-success-subtle d-bc-success-strong">',
        '  styled',
        '</div>',
        '<style>',
        '.x {',
        '  color: var(--dt-color-foreground-success);',
        '  background: var(--dt-color-surface-success);',
        '  border: 1px solid var(--dt-color-border-success-subtle);',
        '  --link: var(--dt-color-link-success-inverted-hover);',
        '}',
        '</style>',
      ].join('\n');

      const output = apply(input);
      assert.ok(output.includes('d-fc-positive'));
      assert.ok(output.includes('d-bgc-positive-subtle'));
      assert.ok(output.includes('d-bc-positive-strong'));
      assert.ok(output.includes('var(--dt-color-foreground-positive)'));
      assert.ok(output.includes('var(--dt-color-surface-positive)'));
      assert.ok(output.includes('var(--dt-color-border-positive-subtle)'));
      assert.ok(output.includes('var(--dt-color-link-positive-inverted-hover)'));
      // No stray "success" references should remain.
      assert.ok(!output.includes('success'));
    });
  });

  // ─── Integration: example .vue file ────────────────────────────────────────

  describe('example .vue file integration', () => {
    let output;

    before(async () => {
      const input = await readFile(
        join(__dirname, 'success-to-positive-test-examples.vue'), 'utf8',
      );
      output = apply(input);
    });

    it('replaces every success utility class', () => {
      assert.ok(output.includes('d-fc-positive'));
      assert.ok(output.includes('d-bgc-positive-subtle'));
      assert.ok(output.includes('d-bc-positive-strong'));
      assert.ok(output.includes('d-bgc-positive-subtle-opaque-inverted'));
    });

    it('replaces every CSS variable family', () => {
      assert.ok(output.includes('var(--dt-color-foreground-positive)'));
      assert.ok(output.includes('var(--dt-color-foreground-positive-strong-inverted)'));
      assert.ok(output.includes('var(--dt-color-surface-positive-opaque)'));
      assert.ok(output.includes('var(--dt-color-border-positive-subtle-inverted)'));
      assert.ok(output.includes('var(--dt-color-link-positive-hover)'));
    });

    it('preserves English words and unrelated classes', () => {
      // English usage of "successfully" / "successful" left intact
      assert.ok(output.includes('successfully'));
      assert.ok(output.includes('successful operation'));
      // unrelated semantic families pass through
      assert.ok(output.includes('d-fc-critical'));
      assert.ok(output.includes('d-bgc-warning-subtle'));
    });
  });
});
