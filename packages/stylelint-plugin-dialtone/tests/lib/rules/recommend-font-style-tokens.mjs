import { testRule } from 'stylelint-test-rule-node';

import plugin from '../../../lib/rules/recommend-font-style-tokens.js';

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
        font: var(--dt-typography-body-md-compact);
      }`,
      description: 'simple class definition containing a composed typography utility',
    },
  ],

  reject: [
    {
      code: `.a {
        font-size: var(--dt-font-size-200);
      }`,
      description: 'simple class definition containing a font size property',
      message: messages.recommendFontStyleTokens("font-size"),
    },
    {
      code: `.a {
        div {
          line-height: var(--dt-font-line-height-300);
          font-size: var(--dt-font-size-200);
          font-family: var(--dt-font-family-mono);
          font-weight: var(--dt-font-weight-medium);
        }
      }`,
      description: 'nested selector and several font properties',
      warnings: [
        { message: messages.recommendFontStyleTokens("line-height") },
        { message: messages.recommendFontStyleTokens("font-size") },
        { message: messages.recommendFontStyleTokens("font-family") },
        { message: messages.recommendFontStyleTokens("font-weight") },
      ],
    },
  ],
});
