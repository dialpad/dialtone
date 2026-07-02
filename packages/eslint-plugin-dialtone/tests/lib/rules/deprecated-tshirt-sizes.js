/**
 * @fileoverview Tests for deprecated-tshirt-sizes rule.
 * @author Dialtone Team
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/deprecated-tshirt-sizes'),
  RuleTester = require('eslint').RuleTester,
  vueParser = require('vue-eslint-parser');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {
    parser: vueParser,
    ecmaVersion: 'latest',
  },
});

ruleTester.run('deprecated-tshirt-sizes', rule, {
  valid: [
    // Numeric sizes should be valid
    {
      code: '<template><dt-button :size="200" /></template>',
    },
    {
      code: '<template><dt-text variant="body-sm" /></template>',
    },
    {
      code: '<template><dt-text variant="body-md" :size="300" /></template>',
    },
    {
      code: '<template><dt-text :variant="textVariant" :size="300" /></template>',
    },
    {
      code: '<template><dt-text kind="body" :size="300" /></template>',
    },
    {
      code: '<template><dt-text :kind="textKind" :size="300" /></template>',
    },
    {
      code: '<template><DtText variant="headline-2xl" /></template>',
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
    // size alone on dt-text cannot infer composition
    {
      code: '<template><dt-text size="sm" /></template>',
      output: null,
      errors: [{ messageId: 'unpairedDtTextSize' }],
    },
    // numeric size alone on dt-text cannot infer composition
    {
      code: '<template><dt-text :size="300" /></template>',
      output: null,
      errors: [{ messageId: 'unpairedDtTextSize' }],
    },
    // size="sm" on dt-text with explicit kind
    {
      code: '<template><dt-text kind="body" size="sm" /></template>',
      output: '<template><dt-text variant="body-sm" /></template>',
      errors: [{ messageId: 'deprecatedDtTextSize' }],
    },
    // size="sm" on PascalCase DtText with explicit kind
    {
      code: '<template><DtText kind="body" size="sm" /></template>',
      output: '<template><DtText variant="body-sm" /></template>',
      errors: [{ messageId: 'deprecatedDtTextSize' }],
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
    // size="2xl" on dt-text with headline kind
    {
      code: '<template><dt-text kind="headline" size="2xl" /></template>',
      output: '<template><dt-text variant="headline-2xl" /></template>',
      errors: [{ messageId: 'deprecatedDtTextSize' }],
    },
    // size="3xl" on dt-text without headline kind cannot infer composition
    {
      code: '<template><dt-text size="3xl" /></template>',
      output: null,
      errors: [{ messageId: 'unpairedDtTextSize' }],
    },
    // size="xl" on body dt-text cannot safely map to a supported body variant
    {
      code: '<template><dt-text kind="body" size="xl" /></template>',
      output: null,
      errors: [{ messageId: 'deprecatedDtTextSizeManual' }],
    },
    // size t-shirt with a variant is treated as a raw-size override migration
    {
      code: '<template><dt-text variant="body-md" size="lg" /></template>',
      output: '<template><dt-text variant="body-md" :size="400" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // size t-shirt with a dynamic variant can safely migrate to a numeric override
    {
      code: '<template><dt-text :variant="textVariant" size="sm" /></template>',
      output:
        '<template><dt-text :variant="textVariant" :size="200" /></template>',
      errors: [{ messageId: 'deprecatedSize' }],
    },
    // size t-shirt with a dynamic kind needs manual migration
    {
      code: '<template><dt-text :kind="textKind" size="sm" /></template>',
      output: null,
      errors: [{ messageId: 'deprecatedDtTextSizeManual' }],
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
    // Dynamic binding on dt-text without variant/kind cannot infer composition
    {
      code: `<template><dt-text :size="'sm'" /></template>`,
      output: null,
      errors: [{ messageId: 'unpairedDtTextSize' }],
    },
    // Dynamic binding on dt-text with variant needs a manual raw-size migration
    {
      code: `<template><dt-text variant="body-md" :size="'sm'" /></template>`,
      errors: [{ messageId: 'deprecatedDtTextSizeInBinding' }],
    },
    // Dynamic binding: ternary with t-shirt literals
    {
      code: `<template><dt-button :size="isCompact ? 'sm' : 'md'" /></template>`,
      errors: [
        { messageId: 'deprecatedSizeInBinding' },
        { messageId: 'deprecatedSizeInBinding' },
      ],
    },
    // Dynamic binding: single t-shirt in ternary without variant/kind cannot infer composition
    {
      code: `<template><dt-text :size="isLarge ? 'xl' : 300" /></template>`,
      output: null,
      errors: [{ messageId: 'unpairedDtTextSize' }],
    },
    // Dynamic binding: single t-shirt in ternary with variant needs manual migration
    {
      code: `<template><dt-text :variant="textVariant" :size="isLarge ? 'xl' : 300" /></template>`,
      errors: [{ messageId: 'deprecatedDtTextSizeInBinding' }],
    },
  ],
});
