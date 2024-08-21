/**
 * @fileoverview Utilities to set Font family, Font weight, Font size, and Line height separately are discouraged in favor of composed typography utilities
 * @author Nina Repetto
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/recommend-typography-style"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  // eslint-disable-next-line node/no-extraneous-require
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 'latest' }
});

ruleTester.run("recommend-typography-style", rule, {
  valid: [
    {
      code: "<template><div class=\"d-label--md-plain\" /></template>",
    },
  ],

  invalid: [
    {
      code: "<template><div class=\"d-fw-medium\" /></template>",
      errors: [{ messageId: 'recommendTypographyStyle' }],
    },
    {
      code: "<template><div class=\"d-fs-200\" /></template>",
      errors: [{ messageId: 'recommendTypographyStyle' }],
    },
    {
      code: "<template><div class=\"d-lh-300\" /></template>",
      errors: [{ messageId: 'recommendTypographyStyle' }],
    },
    {
      code: "<template><div class=\"d-ff-mono\" /></template>",
      errors: [{ messageId: 'recommendTypographyStyle' }],
    },
  ],
});
