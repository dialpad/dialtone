/**
 * @fileoverview Detects usage of d-flg* deprecated utility classes which will be removed in the future.
 * @author Tico Ortega
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/deprecated-flex-gap-classes"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  // eslint-disable-next-line node/no-extraneous-require
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 'latest' }
});

ruleTester.run("deprecated-flex-gap-classes", rule, {
  valid: [
    {
      code: "<template><div class=\"d-fl-col2 d-g8\" /></template>",
    },
    {
      code: "<template><div class=\"d-fl-col12 d-g8\" /></template>",
    },
    {
      code: "<template><div class=\"d-fl-col2 d-g24\" /></template>",
    },
    {
      code: "<template><div class=\"d-fl-col12 d-cg24\" /></template>",
    },
  ],

  invalid: [
    {
      code: "<template><div class=\"d-fl-col2 d-flg8\" /></template>",
      errors: [{ messageId: 'recommendFlexGapStyle' }],
    },
    {
      code: "<template><div class=\"d-fl-col12 d-flg8\" /></template>",
      errors: [{ messageId: 'recommendFlexGapStyle' }],
    },
    {
      code: "<template><div class=\"d-fl-col2 d-flg24\" /></template>",
      errors: [{ messageId: 'recommendFlexGapStyle' }],
    },
    {
      code: "<template><div class=\"d-fl-col12 d-flg24\" /></template>",
      errors: [{ messageId: 'recommendFlexGapStyle' }],
    },
  ],
});
