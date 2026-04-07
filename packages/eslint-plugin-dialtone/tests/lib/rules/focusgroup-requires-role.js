/**
 * @fileoverview Tests for focusgroup-requires-role rule.
 * @author Dialtone
 */
'use strict';

const rule = require('../../../lib/rules/focusgroup-requires-role');
const RuleTester = require('eslint').RuleTester;
// eslint-disable-next-line n/no-extraneous-require
const vueParser = require('vue-eslint-parser');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: vueParser,
    ecmaVersion: 'latest',
  },
});

ruleTester.run('focusgroup-requires-role', rule, {
  valid: [
    {
      name: 'Element with role and v-dt-focusgroup',
      code: '<template><div role="toolbar" v-dt-focusgroup="\'horizontal\'" /></template>',
    },
    {
      name: 'Element with role="tablist" and v-dt-focusgroup',
      code: '<template><div role="tablist" v-dt-focusgroup="\'horizontal nomemory\'" /></template>',
    },
    {
      name: 'Element without v-dt-focusgroup (no rule needed)',
      code: '<template><div role="toolbar" /></template>',
    },
    {
      name: 'Bare v-dt-focusgroup with role',
      code: '<template><div role="radiogroup" v-dt-focusgroup /></template>',
    },
  ],

  invalid: [
    {
      name: 'v-dt-focusgroup without role',
      code: '<template><div v-dt-focusgroup="\'horizontal\'" /></template>',
      errors: [{ messageId: 'missingRole' }],
    },
    {
      name: 'Bare v-dt-focusgroup without role',
      code: '<template><div v-dt-focusgroup /></template>',
      errors: [{ messageId: 'missingRole' }],
    },
  ],
});
