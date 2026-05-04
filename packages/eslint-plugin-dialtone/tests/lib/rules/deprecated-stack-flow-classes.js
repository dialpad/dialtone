/**
 * @fileoverview Tests for deprecated-stack-flow-classes rule.
 */
'use strict';

const rule = require('../../../lib/rules/deprecated-stack-flow-classes'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  languageOptions: {
    // eslint-disable-next-line n/no-extraneous-require
    parser: require('vue-eslint-parser'),
    ecmaVersion: 'latest',
  },
});

ruleTester.run('deprecated-stack-flow-classes', rule, {
  valid: [
    { code: '<template><div>...</div></template>' },
    { code: '<template><div class="">...</div></template>' },
    { code: '<template><div class="d-p-200 d-bgc-primary">...</div></template>' },
    { code: '<template><dt-stack gap="200">...</dt-stack></template>' },
    // Word-boundary check: tokens that contain "stack"/"flow" but aren't the deprecated pattern
    { code: '<template><div class="my-stack-thing flow-chart">...</div></template>' },
    // Word-boundary check: deprecated stem without the digit suffix is not flagged
    { code: '<template><div class="d-stack d-flow">...</div></template>' },
    { code: '<template><div :class="[\'d-p-200\', someClass]">...</div></template>' },
    { code: '<template><div :class="{ \'d-bgc-primary\': active }">...</div></template>' },
    // Identifier (not a string literal) referencing a similarly-named variable is not flagged
    { code: '<template><div :class="dStack16">...</div></template>' },
  ],

  invalid: [
    // Carries the data assertion that pins the px → gap mapping in the message.
    {
      code: '<template><div class="d-stack16">...</div></template>',
      errors: [{
        messageId: 'preferStack',
        data: { className: 'd-stack16', px: '16', gap: '200' },
      }],
    },
    {
      code: '<template><div class="d-flow24">...</div></template>',
      errors: [{ messageId: 'preferStack' }],
    },
    // Mirrors a real OOS site: deprecated class alongside other utilities
    {
      code: '<template><ul class="d-ps-relative d-stack2 d-m-50 d-px-0">...</ul></template>',
      errors: [{ messageId: 'preferStack' }],
    },
    {
      code: '<template><div class="md:d-stack16">...</div></template>',
      errors: [{ messageId: 'preferStack' }],
    },
    // Pin: rule does NOT whitelist <dt-stack> — using deprecated classes there is still flagged
    {
      code: '<template><dt-stack class="d-stack16">...</dt-stack></template>',
      errors: [{ messageId: 'preferStack' }],
    },
    {
      code: '<template><ul :class="[\'d-ps-relative\', \'d-stack2\', \'d-px-0\', listClass]">...</ul></template>',
      errors: [{ messageId: 'preferStackInBinding' }],
    },
    {
      code: '<template><div :class="{ \'d-stack16\': condition }">...</div></template>',
      errors: [{ messageId: 'preferStackInBinding' }],
    },
    // Carries the data assertion for binding messages.
    {
      code: '<template><div :class="\'d-flow24\'">...</div></template>',
      errors: [{
        messageId: 'preferStackInBinding',
        data: { className: 'd-flow24', px: '24', gap: '300' },
      }],
    },
    {
      code: '<template><div v-bind:class="[\'d-stack8\']">...</div></template>',
      errors: [{ messageId: 'preferStackInBinding' }],
    },
    // Responsive-prefixed deprecated class inside a binding string literal
    {
      code: '<template><div :class="[\'md:d-stack16\']">...</div></template>',
      errors: [{ messageId: 'preferStackInBinding' }],
    },
    // Multi-class quoted string literal: deprecated token alongside other classes
    {
      code: '<template><div :class="\'d-ps-relative d-stack2 d-px-0\'">...</div></template>',
      errors: [{ messageId: 'preferStackInBinding' }],
    },
    // Static and dynamic on the same element each report independently
    {
      code: '<template><div class="d-stack16" :class="[\'d-flow24\']">...</div></template>',
      errors: [
        { messageId: 'preferStack' },
        { messageId: 'preferStackInBinding' },
      ],
    },
    // Template literal binding: outer attribute quotes wrap the backtick-delimited
    // expression, so the binding regex still matches and the rule fires.
    {
      code: '<template><div :class="`d-stack16`">...</div></template>',
      errors: [{ messageId: 'preferStackInBinding' }],
    },
    // Sizes outside the gap-token scale (>= 72) fall back to the unmapped message.
    {
      code: '<template><div class="d-stack72">...</div></template>',
      errors: [{ messageId: 'preferStackUnmapped' }],
    },
    {
      code: '<template><div :class="\'d-stack72\'">...</div></template>',
      errors: [{ messageId: 'preferStackInBindingUnmapped' }],
    },
  ],
});
