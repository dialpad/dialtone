import { testRule } from 'stylelint-test-rule-node';

import plugin from '../../../lib/rules/no-deprecated-size-tokens.js';

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
      code: '.card { width: var(--dt-layout-500); }',
      description: 'layout token (correct)',
    },
    {
      code: '.card { padding: var(--dt-spacing-400); }',
      description: 'spacing token for padding (correct)',
    },
    {
      code: '.card { margin: var(--dt-spacing-200); }',
      description: 'spacing token for margin (correct)',
    },
    {
      code: '.card { width: 80rem; }',
      description: 'raw rem value after migration (correct)',
    },
  ],

  reject: [
    {
      code: '.card { width: var(--dt-size-500); }',
      description: 'size token for layout (deprecated)',
      message: messages.deprecatedSizeToken,
    },
    {
      code: '.card { padding: var(--dt-size-400); }',
      description: 'size token for spacing (deprecated)',
      message: messages.deprecatedSizeToken,
    },
    {
      code: '.card { padding: var(--dt-space-400); }',
      description: 'space token (deprecated)',
      message: messages.deprecatedSpaceToken,
    },
    {
      code: '.card { padding: var(--dt-size-400) var(--dt-size-200); }',
      description: 'multiple size tokens in one declaration (deprecated)',
      warnings: [
        { message: messages.deprecatedSizeToken },
        { message: messages.deprecatedSizeToken },
      ],
    },
  ],
});
