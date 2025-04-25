"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/deprecated-base-color-classes"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  // eslint-disable-next-line node/no-extraneous-require
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 'latest' }
});

ruleTester.run("deprecated-base-color-classes", rule, {
  valid: [
    { code: "<template><div class=\"d-bgc-primary\" /></template>" },
    { code: "<template><div class=\"d-fc-secondary\" /></template>" },
    { code: "<template><div class=\"d-bc-success\" /></template>" },
    { code: "<template><div class=\"d-divide-critical\" /></template>" },
  ],

  invalid: [
    {
      code: "<template><div class=\"d-bgc-black-100\" /></template>",
      errors: [{ messageId: 'recommendBackgroundSemanticColor' }],
    },
    {
      code: "<template><div class=\"d-fc-black-900\" /></template>",
      errors: [{ messageId: 'recommendForegroundSemanticColor' }],
    },
    {
      code: "<template><div class=\"d-bc-green-300\" /></template>",
      errors: [{ messageId: 'recommendBorderSemanticColor' }],
    },
    {
      code: "<template><div class=\"d-divide-red-300\" /></template>",
      errors: [{ messageId: 'recommendDivideSemanticColor' }],
    },
  ],
});
