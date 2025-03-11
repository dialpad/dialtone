import { testRule } from 'stylelint-test-rule-node';

import plugin from '../../../lib/rules/no-base-color-tokens.js';

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
      code: '.custom-class { background-color: var(--dt-color-surface-primary); }',
      description: 'custom class definition containing a semantic color token',
    },
  ],

  reject: [
    {
      code: '.custom-class { background-color: var(--dt-color-black-100); }',
      description: 'custom class definition containing a base color token',
      message: messages.noBaseColorsRejected('--dt-color-black-100'),
    },
  ],
});
