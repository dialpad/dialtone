import { testRule } from 'stylelint-test-rule-node';

import plugin from './index.js';

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
    },
  ],

  reject: [
    {
      code: `.foo {
        .aThing();
      }`,
      message: messages.rejected('.foo'),
    },
  ],
});

// testRule({
//   plugins: [plugin],
//   ruleName,
//   config: true,
//   fix: true,

//   accept: [
//     {
//       code: '.a {}',
//     },
//     {
//       code: '.b {}',
//     },
//   ],

//   reject: [
//     {
//       code: '.foo {}',
//       fixed: '.safe {}',
//       message: messages.rejected('.foo'),
//       line: 1,
//       column: 1,
//       endLine: 1,
//       endColumn: 8,
//     },
//   ],
// });
