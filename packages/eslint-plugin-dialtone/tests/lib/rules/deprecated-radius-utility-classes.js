/**
 * @fileoverview Tests for deprecated-radius-utility-classes rule.
 */
'use strict';

const rule = require('../../../lib/rules/deprecated-radius-utility-classes');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester({
  languageOptions: {
    // eslint-disable-next-line n/no-extraneous-require
    parser: require('vue-eslint-parser'),
    parserOptions: { ecmaVersion: 'latest' },
  },
});

ruleTester.run('deprecated-radius-utility-classes', rule, {
  valid: [
    // New logical token-stop-indexed classes
    { code: '<template><div class="d-bar-350" /></template>' },
    { code: '<template><div class="d-bbsr-400 d-bber-200" /></template>' },
    { code: '<template><div class="d-bisr-450 d-bier-500" /></template>' },
    { code: '<template><div class="d-bssr-350 d-bser-350 d-besr-350 d-beer-350" /></template>' },
    { code: '<template><div class="d-bar-550" /></template>' },
    // Not-deprecated keyword variants
    { code: '<template><div class="d-bar-pill d-bar-circle d-bar-unset" /></template>' },
    { code: '<template><div class="d-bbsr-pill d-bier-circle" /></template>' },
    // Unrelated utilities
    { code: '<template><div class="d-p-200 d-m-100 d-fc-primary" /></template>' },
    // Non-radius utility classes that could look similar but aren't matched
    { code: '<template><div class="d-ba d-baw2 d-bas-dashed" /></template>' },
  ],

  invalid: [
    // Legacy all-corners numeric → logical token stop
    {
      code: '<template><div class="d-bar6" /></template>',
      output: '<template><div class="d-bar-350" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    {
      code: '<template><div class="d-bar0 d-bar1 d-bar2 d-bar4" /></template>',
      output: '<template><div class="d-bar-0 d-bar-100 d-bar-200 d-bar-300" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    {
      code: '<template><div class="d-bar24 d-bar32" /></template>',
      output: '<template><div class="d-bar-550 d-bar-600" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    // Legacy side-pair numeric → logical pair name
    {
      code: '<template><div class="d-btr6" /></template>',
      output: '<template><div class="d-bbsr-350" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    {
      code: '<template><div class="d-bbr8" /></template>',
      output: '<template><div class="d-bber-400" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    {
      code: '<template><div class="d-blr12" /></template>',
      output: '<template><div class="d-bisr-450" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    {
      code: '<template><div class="d-brr16" /></template>',
      output: '<template><div class="d-bier-500" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    // Legacy side-pair keyword → logical pair keyword
    {
      code: '<template><div class="d-btr-pill" /></template>',
      output: '<template><div class="d-bbsr-pill" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    {
      code: '<template><div class="d-brr-circle" /></template>',
      output: '<template><div class="d-bier-circle" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    // Mixed classes in one attribute
    {
      code: '<template><div class="d-p-200 d-bar6 d-fc-primary" /></template>',
      output: '<template><div class="d-p-200 d-bar-350 d-fc-primary" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    // Multiple legacy classes rewritten in one pass
    {
      code: '<template><div class="d-bar6 d-btr8 d-blr-pill" /></template>',
      output: '<template><div class="d-bar-350 d-bbsr-400 d-bisr-pill" /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    // Unquoted attribute — autofix must not add quotes.
    {
      code: '<template><div class=d-bar6 /></template>',
      output: '<template><div class=d-bar-350 /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
    // Single-quoted attribute — preserves single quotes.
    {
      code: '<template><div class=\'d-btr8\' /></template>',
      output: '<template><div class=\'d-bbsr-400\' /></template>',
      errors: [{ messageId: 'deprecatedRadiusClass' }],
    },
  ],
});
