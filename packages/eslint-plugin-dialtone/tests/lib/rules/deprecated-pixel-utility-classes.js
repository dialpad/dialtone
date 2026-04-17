/**
 * @fileoverview Tests for deprecated-pixel-utility-classes rule.
 * @author Joshua Hynes
 */
'use strict';

const rule = require('../../../lib/rules/deprecated-pixel-utility-classes'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  languageOptions: {
    // eslint-disable-next-line n/no-extraneous-require
    parser: require('vue-eslint-parser'),
    parserOptions: { ecmaVersion: 'latest' },
  },
});

ruleTester.run('deprecated-pixel-utility-classes', rule, {
  valid: [
    // New token-stop-based classes (with hyphen)
    { code: '<template><div class="d-h-25 d-w-100" /></template>' },
    { code: '<template><div class="d-p-100 d-m-200" /></template>' },
    { code: '<template><div class="d-mt-100 d-pl-200" /></template>' },
    { code: '<template><div class="d-g-100 d-rg-200" /></template>' },
    { code: '<template><div class="d-t-100 d-l-200" /></template>' },
    { code: '<template><div class="d-mt-n100" /></template>' },
    { code: '<template><div class="d-size-100" /></template>' },
    // Off-scale pixel-indexed classes from DLT-3330 (not deprecated — these are the target)
    { code: '<template><div class="d-w-1px d-h-2px d-size-8px" /></template>' },
    { code: '<template><div class="d-wmn-20px d-hmx-24px" /></template>' },
    // Percentage classes (not deprecated)
    { code: '<template><div class="d-h100p d-w50p" /></template>' },
    // Viewport classes (not deprecated)
    { code: '<template><div class="d-h100vh d-w100vw" /></template>' },
    { code: '<template><div class="d-h-dvh d-w-dvw" /></template>' },
    // Keyword classes (not deprecated)
    { code: '<template><div class="d-h-auto d-w-fit-content" /></template>' },
    // Character width classes (not deprecated)
    { code: '<template><div class="d-w60ch d-w75ch" /></template>' },
    // Non-utility classes
    { code: '<template><div class="d-d-flex d-fc-primary" /></template>' },
    // Logical property aliases
    { code: '<template><div class="d-mis-100 d-pbs-200" /></template>' },
  ],

  invalid: [
    // Sizing
    {
      code: '<template><div class="d-h16" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    {
      code: '<template><div class="d-w64" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    {
      code: '<template><div class="d-hmn96 d-wmx512" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    // Margin
    {
      code: '<template><div class="d-m8" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    {
      code: '<template><div class="d-mt16 d-ml8" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    // Negative margin
    {
      code: '<template><div class="d-mtn8" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    // Padding
    {
      code: '<template><div class="d-p8 d-pt16" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    // Gap
    {
      code: '<template><div class="d-g8 d-rg16" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    // Position
    {
      code: '<template><div class="d-t8 d-l16" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    // Negative position
    {
      code: '<template><div class="d-tn8" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    // Mixed old and new (still reports because old class is present)
    {
      code: '<template><div class="d-h-25 d-p8" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    // Off-scale small-value sizing classes (DLT-3330 targets these for migration to d-*-Npx)
    {
      code: '<template><div class="d-w1" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    {
      code: '<template><div class="d-h2" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    {
      code: '<template><div class="d-hmn8" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    {
      code: '<template><div class="d-wmx20" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
    {
      code: '<template><div class="d-h24 d-w24" /></template>',
      errors: [{ messageId: 'deprecatedPixelClass' }],
    },
  ],
});
