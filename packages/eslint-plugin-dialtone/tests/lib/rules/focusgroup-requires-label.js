/**
 * @fileoverview Tests for focusgroup-requires-label rule.
 * @author Dialtone
 */
'use strict';

const rule = require('../../../lib/rules/focusgroup-requires-label');
const RuleTester = require('eslint').RuleTester;
// eslint-disable-next-line n/no-extraneous-require
const vueParser = require('vue-eslint-parser');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: vueParser,
    ecmaVersion: 'latest',
  },
});

ruleTester.run('focusgroup-requires-label', rule, {
  valid: [
    {
      name: 'Element with aria-label and v-dt-focusgroup',
      code: '<template><div role="toolbar" v-dt-focusgroup aria-label="Formatting" /></template>',
    },
    {
      name: 'Element with aria-labelledby and v-dt-focusgroup',
      code: '<template><div role="toolbar" v-dt-focusgroup aria-labelledby="heading-id" /></template>',
    },
    {
      name: 'Element without v-dt-focusgroup (no rule needed)',
      code: '<template><div role="toolbar" /></template>',
    },
  ],

  invalid: [
    {
      name: 'v-dt-focusgroup without aria-label or aria-labelledby',
      code: '<template><div role="toolbar" v-dt-focusgroup="\'horizontal\'" /></template>',
      errors: [{ messageId: 'missingLabel' }],
    },
    {
      name: 'Bare v-dt-focusgroup without label',
      code: '<template><div role="radiogroup" v-dt-focusgroup /></template>',
      errors: [{ messageId: 'missingLabel' }],
    },
  ],
});
