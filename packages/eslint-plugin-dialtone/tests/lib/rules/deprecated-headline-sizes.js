/**
 * @fileoverview Detects usage of deprecated xxl/xxxl headline sizes which have been renamed to 2xl/3xl.
 * @author Dialtone Team
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/deprecated-headline-sizes'),
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

ruleTester.run('deprecated-headline-sizes', rule, {
  valid: [
    // New DtText variants should be valid
    {
      code: '<template><dt-text variant="headline-2xl" /></template>',
    },
    {
      code: '<template><DtText variant="headline-3xl" /></template>',
    },
    // New size names should be valid on non-DtText components
    {
      code: '<template><my-heading size="2xl" /></template>',
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
    // Deprecated size="xxl" prop on dt-text without explicit headline kind needs manual migration
    {
      code: '<template><dt-text size="xxl" /></template>',
      output: null,
      errors: [{ messageId: 'deprecatedDtTextSize' }],
    },
    // Deprecated size="xxl" prop on dt-text with explicit headline kind
    {
      code: '<template><dt-text kind="headline" size="xxl" /></template>',
      output: '<template><dt-text variant="headline-2xl" /></template>',
      errors: [{ messageId: 'deprecatedDtTextSize' }],
    },
    // Deprecated size="xxxl" prop on PascalCase DtText
    {
      code: '<template><DtText kind="headline" size="xxxl" /></template>',
      output: '<template><DtText variant="headline-3xl" /></template>',
      errors: [{ messageId: 'deprecatedDtTextSize' }],
    },
    // Deprecated size with an existing variant needs manual migration
    {
      code: '<template><dt-text variant="headline-xl" size="xxl" /></template>',
      output: null,
      errors: [{ messageId: 'deprecatedDtTextSize' }],
    },
    // Deprecated size with a dynamic variant needs manual migration
    {
      code: '<template><dt-text :variant="headlineVariant" size="xxl" /></template>',
      output: null,
      errors: [{ messageId: 'deprecatedDtTextSize' }],
    },
    // Deprecated size with a dynamic kind needs manual migration
    {
      code: '<template><dt-text :kind="textKind" size="xxl" /></template>',
      output: null,
      errors: [{ messageId: 'deprecatedDtTextSize' }],
    },
    // Deprecated size with a conflicting kind needs manual migration
    {
      code: '<template><dt-text kind="body" size="xxl" /></template>',
      output: null,
      errors: [{ messageId: 'deprecatedDtTextSize' }],
    },
    // Deprecated size="xxxl" prop on non-DtText component
    {
      code: '<template><my-heading size="xxxl" /></template>',
      output: '<template><my-heading size="3xl" /></template>',
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
      output:
        '<template><div class="d-p16 d-text-headline--2xl d-fc-primary" /></template>',
      errors: [{ messageId: 'deprecatedClass' }],
    },
  ],
});
