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

test('unsupported spacing values, percentages and property contexts require qualified advice', async () => {
  const result = await stylelint.lint({ code: '.card { gap: var(--dt-space-720); width: var(--dt-space-50-percent); max-width: var(--dt-space-400); }', config: { plugins: [plugin], rules: { [ruleName]: true } } });
  const warnings = result.results[0].warnings;
  assert.equal(warnings.length, 3);
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
