/**
 * @fileoverview Detects usage of deprecated xxl/xxxl headline sizes which have been renamed to 2xl/3xl.
 * @author Dialtone Team
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/deprecated-headline-sizes"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  // eslint-disable-next-line n/no-extraneous-require
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 'latest' }
});

ruleTester.run("deprecated-headline-sizes", rule, {
  valid: [
    // New size names should be valid
    {
      code: '<template><dt-text size="2xl" /></template>',
    },
    {
      code: '<template><dt-text size="3xl" /></template>',
    },
    {
      code: '<template><dt-text size="xl" /></template>',
    },
    // New class names should be valid
    {
      code: '<template><div class="d-text-headline--2xl" /></template>',
    },
    {
      code: '<template><div class="d-text-headline--3xl" /></template>',
    },
    // Legacy classes should NOT be flagged (d-headline--xxl is legacy, still supported)
    {
      code: '<template><div class="d-headline--xxl" /></template>',
    },
    {
      code: '<template><div class="d-headline--xl" /></template>',
    },
  ],

  invalid: [
    // Deprecated size="xxl" prop
    {
      code: '<template><dt-text size="xxl" /></template>',
      output: '<template><dt-text size="2xl" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // Deprecated size="xxxl" prop
    {
      code: '<template><dt-text size="xxxl" /></template>',
      output: '<template><dt-text size="3xl" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // Deprecated d-text-headline--xxl class
    {
      code: '<template><div class="d-text-headline--xxl" /></template>',
      output: '<template><div class="d-text-headline--2xl" /></template>',
      errors: [{ messageId: 'deprecatedClass' }],
    },
    // Deprecated d-text-headline--xxxl class
    {
      code: '<template><div class="d-text-headline--xxxl" /></template>',
      output: '<template><div class="d-text-headline--3xl" /></template>',
      errors: [{ messageId: 'deprecatedClass' }],
    },
    // Class with multiple classes, only one deprecated
    {
      code: '<template><div class="d-p16 d-text-headline--xxl d-fc-primary" /></template>',
      output: '<template><div class="d-p16 d-text-headline--2xl d-fc-primary" /></template>',
      errors: [{ messageId: 'deprecatedClass' }],
    },
  ],
});
