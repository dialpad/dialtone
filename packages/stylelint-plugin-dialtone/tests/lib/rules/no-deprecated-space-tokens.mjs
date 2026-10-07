import { testRule } from 'stylelint-test-rule-node';

import plugin from '../../../lib/rules/no-deprecated-space-tokens.js';

const {
  rule: { messages, ruleName },
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,
  customSyntax: 'postcss-less',

  accept: [
    {
      code: '.card { padding: var(--dt-size-400); }',
      description: 'size token usage (correct)',
    },
    {
      code: '.card { margin: var(--dt-size-400-negative); }',
      description: 'negative size token usage (correct)',
    },
    {
      code: '.card { width: var(--dt-size-50-percent); }',
      description: 'percentage size token usage (correct)',
    },
  ],

  reject: [
    {
      code: '.card { padding: var(--dt-space-400); }',
      description: 'space token usage (deprecated)',
      message: messages.deprecated('--dt-space-400', '--dt-spacing-100'),
    },
    {
      code: '.card { margin: var(--dt-space-400-negative); }',
      description: 'negative space token usage (deprecated)',
      message: messages.deprecated('--dt-space-400-negative', '--dt-spacing-100-negative'),
    },
    {
      code: '.card { padding: var(--dt-space-400) var(--dt-space-500); }',
      description: 'multiple space tokens in one declaration (deprecated)',
      warnings: [
        { message: messages.deprecated('--dt-space-400', '--dt-spacing-100') },
        { message: messages.deprecated('--dt-space-500', '--dt-spacing-200') },
      ],
    },
  ],
});

// The package test script already uses node --test on its supported Node 18 floor.
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { test } from 'node:test';
import assert from 'node:assert/strict';
import stylelint from 'stylelint';

test('unsupported and percent space tokens require review rather than a suffix swap', async () => {
  const result = await stylelint.lint({ code: '.card { gap: var(--dt-space-720); width: var(--dt-space-50-percent); }', config: { plugins: [plugin], rules: { [ruleName]: true } } });
  const warnings = result.results[0].warnings;
  assert.equal(warnings.length, 2);
  for (const warning of warnings) {
    assert.match(warning.text, /manual review/i);
    assert.doesNotMatch(warning.text, /Use "--dt-size-/);
  }
});

test('migration instruction identifies the package exposing the actual binary', async () => {
  const result = await stylelint.lint({ code: '.card { padding: var(--dt-space-400); }', config: { plugins: [plugin], rules: { [ruleName]: true } } });
  const text = result.results[0].warnings[0].text;
  assert.match(text, /--dt-spacing-100/);
  assert.match(text, /space-to-spacing/);
  assert.match(text, /--package @dialpad\/dialtone-css dialtone-migration-helper/);
});

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import guidance from '../../../../dialtone-css/lib/build/js/dialtone_migration_helper/migration-guidance.cjs';

// Resolve only the scalar references/products used by size, spacing and layout scales.
const base = JSON.parse(readFileSync(new URL('../../../../dialtone-tokens/tokens/base/default.json', import.meta.url), 'utf8'));
const root = JSON.parse(readFileSync(new URL('../../../../dialtone-tokens/tokens/root.json', import.meta.url), 'utf8'));
for (const [category, entries] of Object.entries(root)) base[category] = { ...base[category], ...entries };
function pixels(key) {
  const token = key.split('.').reduce((entry, part) => entry[part], base);
  const value = token.value.replace(/\{([^}]+)\}/g, (_, ref) => String(pixels(ref)));
  const parts = value.split('*').map(part => Number.parseFloat(part));
  assert.ok(parts.every(Number.isFinite), `Unsupported scalar token ${key}: ${value}`);
  return parts.reduce((product, part) => product * part, 1);
}

test('preferred authority preserves actual source scale values', () => {
  assert.equal(pixels('space.400'), 8);
  assert.equal(pixels('spacing.100'), 8);
  assert.equal(pixels('space.400-negative'), -8);
  assert.equal(pixels('spacing.100-negative'), -8);
  assert.equal(pixels('space.50'), 0.5);
  assert.equal(pixels('space.720'), 72);
  for (const [stop, target] of Object.entries(guidance.SPACE_TOKEN_MAP)) {
    assert.equal(pixels(`space.${stop}`), pixels(target.replace('-', '.')), `space-${stop} -> ${target}`);
  }
  for (const [px, stop] of Object.entries(guidance.SPACING_MAP)) {
    assert.equal(Number(px), pixels(`spacing.${stop}`), `pixel spacing ${px} -> ${stop}`);
  }
  for (const [px, stop] of Object.entries(guidance.SIZING_MAP)) {
    assert.equal(Number(px), pixels(`layout.${stop}`), `pixel sizing ${px} -> ${stop}`);
  }
  for (const [stop, target] of Object.entries(guidance.SIZE_LAYOUT_MAP)) {
    assert.equal(pixels(`size.${stop}`), pixels(`layout.${target}`), `size-${stop} -> layout-${target}`);
  }
});

test('packaged lint projections derive from the preferred authority', () => {
  execFileSync(process.execPath, [new URL('../../../../../scripts/generate-migration-guidance.mjs', import.meta.url).pathname, '--check']);
});
