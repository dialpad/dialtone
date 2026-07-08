/**
 * @fileoverview Tests for deprecated-list-styling-classes rule.
 */
'use strict';

const rule = require('../../../lib/rules/deprecated-list-styling-classes'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 'latest',
  },
});

ruleTester.run('deprecated-list-styling-classes', rule, {
  valid: [
    { code: '<template><dt-text-list><dt-text-list-item>One</dt-text-list-item></dt-text-list></template>' },
    { code: '<template><ul><li>Plain list outside Dialtone migration scope</li></ul></template>' },
    { code: '<template><ul class="d-pis-200"><li>Indented but no deprecated list class</li></ul></template>' },
    { code: '<template><div :class="[\'d-pis-200\', listClass]">...</div></template>' },
    { code: '<template><div :class="{ \'d-bgc-primary\': active }">...</div></template>' },
    { code: '<template><div :class="dLstDisc">...</div></template>' },
    // `\b`-style boundaries would false-positive on this suffix match
    { code: '<template><ul class="foo-d-ls-reset"><li>One</li></ul></template>' },
  ],

  invalid: [
    {
      code: '<template><ul class="d-ls-reset"><li>One</li></ul></template>',
      errors: [{
        messageId: 'preferTextList',
        data: { className: 'd-ls-reset' },
      }],
    },
    {
      code: '<template><ul class="d-ls-none"><li>One</li></ul></template>',
      errors: [{ messageId: 'preferTextList' }],
    },
    {
      code: '<template><li class="d-lst-disc">One</li></template>',
      errors: [{ messageId: 'preferTextList' }],
    },
    {
      code: '<template><li class="d-pis-100 d-lst-content">One</li></template>',
      errors: [{ messageId: 'preferTextList' }],
    },
    {
      code: '<template><li class="sm:d-lst-decimal">One</li></template>',
      errors: [{
        messageId: 'preferTextList',
        data: { className: 'sm:d-lst-decimal' },
      }],
    },
    {
      code: '<template><ul :class="[\'d-ls-reset\', listClass]"><li>One</li></ul></template>',
      errors: [{ messageId: 'preferTextListInBinding' }],
    },
    {
      code: '<template><li :class="{ \'d-lst-disc\': isBulleted }">One</li></template>',
      errors: [{ messageId: 'preferTextListInBinding' }],
    },
    {
      code: '<template><li :class="\'d-pis-100 d-lst-content\'">One</li></template>',
      errors: [{
        messageId: 'preferTextListInBinding',
        data: { className: 'd-lst-content' },
      }],
    },
    {
      code: '<template><li v-bind:class="[\'md:d-lst-circle\']">One</li></template>',
      errors: [{ messageId: 'preferTextListInBinding' }],
    },
    {
      code: '<template><li :class="`d-lst-none`">One</li></template>',
      errors: [{ messageId: 'preferTextListInBinding' }],
    },
    {
      code: '<template><li class="d-lst-disc" :class="[\'d-ls-reset\']">One</li></template>',
      errors: [
        { messageId: 'preferTextList' },
        { messageId: 'preferTextListInBinding' },
      ],
    },
  ],
});
