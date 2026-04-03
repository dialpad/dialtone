/**
 * @fileoverview Tests for deprecated-tshirt-sizes rule.
 * @author Dialtone Team
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/deprecated-tshirt-sizes'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  // eslint-disable-next-line n/no-extraneous-require
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 'latest' },
});

ruleTester.run('deprecated-tshirt-sizes', rule, {
  valid: [
    // Numeric sizes should be valid
    {
      code: '<template><dt-button :size="200" /></template>',
    },
    {
      code: '<template><dt-text :size="300" /></template>',
    },
    {
      code: '<template><dt-chip :size="100" /></template>',
    },
    // Dynamic bindings should be valid (not flagged)
    {
      code: '<template><dt-button :size="computedSize" /></template>',
    },
    // Non-Dialtone components should not be flagged
    {
      code: '<template><my-button size="sm" /></template>',
    },
    {
      code: '<template><div size="md" /></template>',
    },
    // Numeric label-size should be valid
    {
      code: '<template><dt-input :label-size="200" /></template>',
    },
    // Numeric speed should be valid
    {
      code: '<template><dt-motion-text :speed="300" /></template>',
    },
    // Dynamic binding with numeric literal should be valid
    {
      code: `<template><dt-button :size="isCompact ? 200 : 300" /></template>`,
    },
  ],

  invalid: [
    // size="xs" on dt-button
    {
      code: '<template><dt-button size="xs" /></template>',
      output: '<template><dt-button :size="100" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // size="sm" on dt-text
    {
      code: '<template><dt-text size="sm" /></template>',
      output: '<template><dt-text :size="200" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // size="md" on dt-input
    {
      code: '<template><dt-input size="md" /></template>',
      output: '<template><dt-input :size="300" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // size="lg" on dt-toggle
    {
      code: '<template><dt-toggle size="lg" /></template>',
      output: '<template><dt-toggle :size="400" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // size="xl" on dt-segmented-control
    {
      code: '<template><dt-segmented-control size="xl" /></template>',
      output: '<template><dt-segmented-control :size="500" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // size="2xl" on dt-text (headline extended)
    {
      code: '<template><dt-text size="2xl" /></template>',
      output: '<template><dt-text :size="600" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // size="3xl" on dt-text (headline extended)
    {
      code: '<template><dt-text size="3xl" /></template>',
      output: '<template><dt-text :size="700" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // label-size="xs" on dt-input
    {
      code: '<template><dt-input label-size="xs" /></template>',
      output: '<template><dt-input :label-size="100" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // speed="sm" on dt-motion-text
    {
      code: '<template><dt-motion-text speed="sm" /></template>',
      output: '<template><dt-motion-text :speed="200" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // PascalCase component names
    {
      code: '<template><DtButton size="sm" /></template>',
      output: '<template><DtButton :size="200" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // Dynamic binding: :size="'sm'" (string literal in expression)
    {
      code: `<template><dt-button :size="'sm'" /></template>`,
      errors: [{ messageId: 'deprecatedSizeInBinding' }],
    },
    // Dynamic binding: ternary with t-shirt literals
    {
      code: `<template><dt-button :size="isCompact ? 'sm' : 'md'" /></template>`,
      errors: [
        { messageId: 'deprecatedSizeInBinding' },
        { messageId: 'deprecatedSizeInBinding' },
      ],
    },
    // Dynamic binding: single t-shirt in ternary
    {
      code: `<template><dt-text :size="isLarge ? 'xl' : 300" /></template>`,
      errors: [{ messageId: 'deprecatedSizeInBinding' }],
    },
  ],
});
