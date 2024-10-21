/**
 * @fileoverview Detects usage of d-gg*, d-grg*, d-gcg* deprecated utility classes which will be removed in the future.
 * @author Tico Ortega
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/deprecated-grid-gap-classes"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  // eslint-disable-next-line node/no-extraneous-require
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 'latest' }
});

ruleTester.run("deprecated-grid-gap-classes", rule, {
  valid: [
    {
      code: "<template><div class=\"d-g8\" /></template>",
    },
    {
      code: "<template><div class=\"d-g16\" /></template>",
    },
    {
      code: "<template><div class=\"d-rg8\" /></template>",
    },
    {
      code: "<template><div class=\"d-rg16\" /></template>",
    },
    {
      code: "<template><div class=\"d-cg8\" /></template>",
    },
    {
      code: "<template><div class=\"d-cg16\" /></template>",
    },
  ],

  invalid: [
    {
      code: "<template><div class=\"d-gg8\" /></template>",
      errors: [{ messageId: 'recommendGridGapStyle' }],
    },
    {
      code: "<template><div class=\"d-gg16\" /></template>",
      errors: [{ messageId: 'recommendGridGapStyle' }],
    },
    {
      code: "<template><div class=\"d-gcg8\" /></template>",
      errors: [{ messageId: 'recommendGridGapStyle' }],
    },
    {
      code: "<template><div class=\"d-gcg16\" /></template>",
      errors: [{ messageId: 'recommendGridGapStyle' }],
    },
    {
      code: "<template><div class=\"d-grg8\" /></template>",
      errors: [{ messageId: 'recommendGridGapStyle' }],
    },
    {
      code: "<template><div class=\"d-grg16\" /></template>",
      errors: [{ messageId: 'recommendGridGapStyle' }],
    },
  ],
});
