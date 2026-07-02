/**
 * @fileoverview Combining multiple typography utility categories is discouraged in favor of composed typography utilities
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
  languageOptions: {
    parser: require('vue-eslint-parser'),
    parserOptions: { ecmaVersion: 'latest' },
  },
});

ruleTester.run("recommend-typography-style", rule, {
  valid: [
    // Boolean/valueless class attribute should not crash
    {
      code: "<template><div class /></template>",
    },
    // Composed typography utilities are valid
    {
      code: "<template><div class=\"d-label--md-plain\" /></template>",
    },
    // Single typography utilities are valid (acceptable for overrides)
    {
      code: "<template><div class=\"d-fw-medium\" /></template>",
    },
    {
      code: "<template><div class=\"d-fs-200\" /></template>",
    },
    {
      code: "<template><div class=\"d-lh-300\" /></template>",
    },
    {
      code: "<template><div class=\"d-ff-mono\" /></template>",
    },
    // Mixed with non-typography classes is valid (single category)
    {
      code: "<template><div class=\"d-fw-bold d-mt-4 d-p-8\" /></template>",
    },
  ],

  invalid: [
    // 2 different categories: font-weight + font-size
    {
      code: "<template><div class=\"d-fw-bold d-fs-200\" /></template>",
      errors: [{ messageId: 'recommendTypographyStyle' }],
    },
    // 2 different categories: font-size + line-height
    {
      code: "<template><div class=\"d-fs-200 d-lh-300\" /></template>",
      errors: [{ messageId: 'recommendTypographyStyle' }],
    },
    // 2 different categories: font-family + font-weight
    {
      code: "<template><div class=\"d-ff-mono d-fw-bold\" /></template>",
      errors: [{ messageId: 'recommendTypographyStyle' }],
    },
    // 3 different categories: font-family + font-weight + font-size
    {
      code: "<template><div class=\"d-ff-mono d-fw-bold d-fs-200\" /></template>",
      errors: [{ messageId: 'recommendTypographyStyle' }],
    },
    // 4 different categories: all of them
    {
      code: "<template><div class=\"d-ff-sans d-fw-semibold d-fs-300 d-lh-400\" /></template>",
      errors: [{ messageId: 'recommendTypographyStyle' }],
    },
    // Mixed with non-typography classes but still has 2+ categories
    {
      code: "<template><div class=\"d-fw-bold d-fs-200 d-mt-4\" /></template>",
      errors: [{ messageId: 'recommendTypographyStyle' }],
    },
    // Conflicting utilities within same category: font-weight
    {
      code: "<template><div class=\"d-fw-bold d-fw-medium\" /></template>",
      errors: [{ messageId: 'conflictingTypographyUtilities' }],
    },
    // Conflicting utilities within same category: font-size
    {
      code: "<template><div class=\"d-fs-100 d-fs-200\" /></template>",
      errors: [{ messageId: 'conflictingTypographyUtilities' }],
    },
    // Conflicting utilities within same category: line-height
    {
      code: "<template><div class=\"d-lh-300 d-lh-400\" /></template>",
      errors: [{ messageId: 'conflictingTypographyUtilities' }],
    },
    // Conflicting utilities within same category: font-family
    {
      code: "<template><div class=\"d-ff-mono d-ff-sans\" /></template>",
      errors: [{ messageId: 'conflictingTypographyUtilities' }],
    },
    // Both errors: 2+ categories AND conflicting within a category
    {
      code: "<template><div class=\"d-fw-bold d-fw-medium d-fs-200\" /></template>",
      errors: [
        { messageId: 'recommendTypographyStyle' },
        { messageId: 'conflictingTypographyUtilities' },
      ],
    },
  ],
});
