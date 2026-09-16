/**
 * @fileoverview Tests for deprecated-link-styling-classes rule.
 *
 * Coverage:
 *   - <a class="d-btn"> / <router-link class="d-btn">
 *   - <a class="d-link"> / <router-link class="d-link">
 *   - <dt-link class="d-td-*">
 *   - Valid cases: DtButton/DtLink with the new props
 */
'use strict';

const rule = require('../../../lib/rules/deprecated-link-styling-classes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  languageOptions: {
    // eslint-disable-next-line n/no-extraneous-require
    parser: require('vue-eslint-parser'),
    ecmaVersion: 'latest',
  },
});

ruleTester.run('deprecated-link-styling-classes', rule, {
  valid: [
    // V1: DtButton with href — the new API
    { code: '<template><dt-button href="/x">Go</dt-button></template>' },
    // V2: DtButton with :to
    { code: '<template><dt-button :to="route">Go</dt-button></template>' },
    // V3: DtLink with href
    { code: '<template><dt-link href="/x">Home</dt-link></template>' },
    // V4: DtLink with :to
    { code: '<template><dt-link :to="route">Home</dt-link></template>' },
    // V5: DtLink with :underline="false" (the new way)
    { code: '<template><dt-link href="/x" :underline="false">Quiet</dt-link></template>' },
    // V6: Plain anchor without d-btn or d-link is fine
    { code: '<template><a href="/x">plain</a></template>' },
    // V7: Anchor with unrelated class
    { code: '<template><a class="my-cta" href="/x">Go</a></template>' },
    // V8: DtLink with a non-d-td-* utility class
    { code: '<template><dt-link href="/x" class="d-fc-secondary">Go</dt-link></template>' },
    // V9: dt-button using the new size/kind props
    { code: '<template><dt-button href="/x" :size="400" kind="critical">Delete</dt-button></template>' },
  ],

  invalid: [
    // I1: <a class="d-btn">
    {
      code: '<template><a class="d-btn" href="/x">Go</a></template>',
      errors: [{ messageId: 'anchorWithDBtn' }],
    },
    // I2: <a class="d-btn d-btn--lg"> (modifiers also flag)
    {
      code: '<template><a class="d-btn d-btn--lg" href="/x">Go</a></template>',
      errors: [{ messageId: 'anchorWithDBtn' }],
    },
    // I3: <router-link class="d-btn">
    {
      code: '<template><router-link class="d-btn" to="/x">Go</router-link></template>',
      errors: [{ messageId: 'routerLinkWithDBtn' }],
    },
    // I4: <a class="d-link">
    {
      code: '<template><a class="d-link" href="/x">Home</a></template>',
      errors: [{ messageId: 'anchorWithDLink' }],
    },
    // I5: <router-link class="d-link">
    {
      code: '<template><router-link class="d-link" to="/x">Home</router-link></template>',
      errors: [{ messageId: 'routerLinkWithDLink' }],
    },
    // I6: <dt-link class="d-td-none">
    {
      code: '<template><dt-link href="/x" class="d-td-none">Quiet</dt-link></template>',
      errors: [{ messageId: 'dtLinkWithDTd' }],
    },
    // I7: <dt-link class="d-td-none h:d-td-underline">
    {
      code: '<template><dt-link href="/x" class="d-td-none h:d-td-underline">Quiet</dt-link></template>',
      errors: [{ messageId: 'dtLinkWithDTd' }],
    },
    // I8: <dt-link class="sm:d-td-none"> (responsive variant still flagged)
    {
      code: '<template><dt-link href="/x" class="sm:d-td-none">Responsive</dt-link></template>',
      errors: [{ messageId: 'dtLinkWithDTd' }],
    },
    // I9: PascalCase <RouterLink class="d-btn"> normalized to router-link and flagged
    {
      code: '<template><RouterLink class="d-btn" to="/x">Go</RouterLink></template>',
      errors: [{ messageId: 'routerLinkWithDBtn' }],
    },
    // I10: PascalCase <DtLink class="d-td-none"> normalized to dt-link and flagged
    {
      code: '<template><DtLink href="/x" class="d-td-none">Quiet</DtLink></template>',
      errors: [{ messageId: 'dtLinkWithDTd' }],
    },
  ],
});
