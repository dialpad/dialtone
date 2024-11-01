import { testRule } from 'stylelint-test-rule-node';

import plugin from '../../../lib/rules/use-dialtone-tokens.js';

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
      code: `.a {
        padding: var(--dt-space-450);
      }`,
      description: 'setting padding using a Dialtone token',
    },
  ],

  reject: [
    {
      code: `.a {
        padding: 12px;
      }`,
      description: 'setting padding using px',
      warnings: [
        { message: messages.useDialtoneTokens("12px") },
        { message: messages.useRemInsteadOfPx("12px") },
      ],
    },
    {
      code: `.a {
        padding: 1.2rem;
      }`,
      description: 'setting padding using rem',
      message: messages.useDialtoneTokens("1.2rem"),
    },
  ],
});
