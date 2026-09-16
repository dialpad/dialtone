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
      message: messages.deprecated('--dt-space-400', '--dt-size-400'),
    },
    {
      code: '.card { margin: var(--dt-space-400-negative); }',
      description: 'negative space token usage (deprecated)',
      message: messages.deprecated('--dt-space-400-negative', '--dt-size-400-negative'),
    },
    {
      code: '.card { width: var(--dt-space-50-percent); }',
      description: 'percentage space token usage (deprecated)',
      message: messages.deprecated('--dt-space-50-percent', '--dt-size-50-percent'),
    },
    {
      code: '.card { padding: var(--dt-space-400) var(--dt-space-500); }',
      description: 'multiple space tokens in one declaration (deprecated)',
      warnings: [
        { message: messages.deprecated('--dt-space-400', '--dt-size-400') },
        { message: messages.deprecated('--dt-space-500', '--dt-size-500') },
      ],
    },
  ],
});
