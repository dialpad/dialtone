/**
 * @fileoverview Tests for deprecated-success-color-classes rule.
 * @author Dialtone Team
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/deprecated-success-color-classes');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {
     
    parser: require('vue-eslint-parser'),
    ecmaVersion: 'latest',
  },
});

ruleTester.run('deprecated-success-color-classes', rule, {
  valid: [
    // Migrated `positive`-named classes are valid.
    { code: '<template><div class="d-bgc-positive" /></template>' },
    { code: '<template><div class="d-bgc-positive-subtle" /></template>' },
    { code: '<template><div class="d-bc-positive-strong" /></template>' },
    { code: '<template><div class="d-fc-positive-inverted" /></template>' },
    // Unrelated semantic colors.
    { code: '<template><div class="d-bgc-other" /></template>' },
    { code: '<template><div class="d-bgc-critical" /></template>' },
    { code: '<template><div class="d-bgc-warning" /></template>' },
    // The English word "success" alone (no `d-` prefix) is not a utility class.
    { code: '<template><div class="success" /></template>' },
    { code: '<template><div class="success-banner" /></template>' },
    { code: '<template><div class="my-success-state" /></template>' },
    // Non-class string literals containing the word "success".
    { code: 'const message = "Operation success!";' },
    // No false positives across token boundaries (`d-bgc-success-foo-bar`
    // is NOT one of the deprecated tokens — the trailing chars rule it out).
    { code: '<template><div class="d-bgc-success-foo" /></template>' },
    // Layout / spacing / unrelated tokens.
    { code: '<template><div class="d-pa-200 d-bgc-positive" /></template>' },
  ],

  invalid: [
    // Bare `d-bgc-success`.
    {
      code: '<template><div class="d-bgc-success" /></template>',
      errors: [{ messageId: 'deprecatedBackgroundSuccess' }],
    },
    // Border with `-subtle` suffix.
    {
      code: '<template><div class="d-bc-success-subtle" /></template>',
      errors: [{ messageId: 'deprecatedBorderSuccess' }],
    },
    // Foreground with `-strong` suffix (foreground stragglers).
    {
      code: '<template><div class="d-fc-success-strong" /></template>',
      errors: [{ messageId: 'deprecatedForegroundSuccess' }],
    },
    // Foreground inverted variant.
    {
      code: '<template><div class="d-fc-success-inverted" /></template>',
      errors: [{ messageId: 'deprecatedForegroundSuccess' }],
    },
    // Background opaque.
    {
      code: '<template><div class="d-bgc-success-opaque" /></template>',
      errors: [{ messageId: 'deprecatedBackgroundSuccess' }],
    },
    // Background subtle-opaque-inverted (longest variant).
    {
      code: '<template><div class="d-bgc-success-subtle-opaque-inverted" /></template>',
      errors: [{ messageId: 'deprecatedBackgroundSuccess' }],
    },
    // Mixed with unrelated tokens — only the success class is flagged.
    {
      code: '<template><div class="d-bgc-success d-pa-200" /></template>',
      errors: [{ messageId: 'deprecatedBackgroundSuccess' }],
    },
    // Mixed across multiple roles in the same class string.
    {
      code: '<template><div class="d-bgc-success d-bc-success-subtle" /></template>',
      errors: [
        { messageId: 'deprecatedBackgroundSuccess' },
        { messageId: 'deprecatedBorderSuccess' },
      ],
    },
    // Dynamic `:class="[...]"` array binding — best effort.
    {
      code: `<template><div :class="['d-bgc-success']" /></template>`,
      errors: [{ messageId: 'deprecatedBackgroundSuccess' }],
    },
    // Dynamic `:class` with conditional string literal.
    {
      code: `<template><div :class="active ? 'd-bgc-success' : 'd-bgc-positive'" /></template>`,
      errors: [{ messageId: 'deprecatedBackgroundSuccess' }],
    },
    // `:class="{ ... }"` object syntax — best effort.
    {
      code: `<template><div :class="{ 'd-bgc-success-subtle': isActive }" /></template>`,
      errors: [{ messageId: 'deprecatedBackgroundSuccess' }],
    },
    // String literal in script block.
    {
      code: `<script>const cls = 'd-bgc-success';</script>`,
      errors: [{ messageId: 'deprecatedBackgroundSuccess' }],
    },
    // Template literal in script block.
    {
      code: '<script>const cls = `d-fc-success-strong`;</script>',
      errors: [{ messageId: 'deprecatedForegroundSuccess' }],
    },
  ],
});
