import { testRule } from 'stylelint-test-rule-node';

import plugin from '../../../lib/rules/no-mixins.js';

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
      code: '.a { color: red; }',
      description: 'simple class definition with no LESS mixin',
    },
  ],

  reject: [
    {
      code: `.a {
        .aMixin();
      }`,
      description: 'simple class definition containing a LESS mixin',
      message: messages.noMixinsRejected('.aMixin();'),
    },
    {
      code: `.a {
        .aMixin;
      }`,
      description: 'simple class definition containing the older syntax for LESS mixins',
      message: messages.noMixinsRejected('.aMixin;'),
    },
    {
      code: `.a {
        color: red;
        .aMixin;
        vertical-align: middle;
        .otherMixin();
      }`,
      description: 'multiple mixins in a class definition',
      warnings: [
        { message: messages.noMixinsRejected('.aMixin;') },
        { message: messages.noMixinsRejected('.otherMixin();') },
      ],
    },
  ],
});
