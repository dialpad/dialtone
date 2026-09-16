/**
 * @fileoverview Tests for deprecated-physical-naming rule.
 *
 * Coverage:
 *   - Slots: leftIcon, rightIcon, alphaIcon, omegaIcon, omega, left, right,
 *            bottom, leftContent, rightContent, icon (dt-button special case)
 *   - Props: alpha-*, omega-*, left-class, right-class, bottom-class
 *   - Prop values: icon-position="left|right|top|bottom",
 *                  sidebar-position="left|right"
 *   - Events: @alpha-clicked, @omega-clicked
 *   - Recipe components: dt-recipe-callbox, dt-recipe-contact-centers-row,
 *                        dt-recipe-general-row, dt-recipe-top-banner-info,
 *                        dt-recipe-grouped-chip
 */
'use strict';

const rule = require('../../../lib/rules/deprecated-physical-naming'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  languageOptions: {
    // eslint-disable-next-line n/no-extraneous-require
    parser: require('vue-eslint-parser'),
    ecmaVersion: 'latest',
  },
});

ruleTester.run('deprecated-physical-naming', rule, {

  // ============================================================
  // VALID — logical names and unrelated components
  // ============================================================
  valid: [
    // V1: dt-badge with startIcon / endIcon
    { code: '<template><dt-badge><template #startIcon>x</template></dt-badge></template>' },
    // V2: dt-button with startIcon
    { code: '<template><dt-button><template #startIcon>x</template></dt-button></template>' },
    // V3: dt-button with endIcon
    { code: '<template><dt-button><template #endIcon>x</template></dt-button></template>' },
    // V4: dt-button with blockStartIcon
    { code: '<template><dt-button><template #blockStartIcon>x</template></dt-button></template>' },
    // V5: dt-button with blockEndIcon
    { code: '<template><dt-button><template #blockEndIcon>x</template></dt-button></template>' },
    // V6: dt-input with startIcon
    { code: '<template><dt-input label="x"><template #startIcon>x</template></dt-input></template>' },
    // V7: dt-tab with startIcon
    { code: '<template><dt-tab><template #startIcon>x</template></dt-tab></template>' },
    // V8: dt-split-button with logical props
    { code: '<template><dt-split-button start-active start-aria-label="x">x</dt-split-button></template>' },
    // V9: dt-item-layout with logical props
    { code: '<template><dt-item-layout start-class="x" end-class="x" block-end-class="x">x</dt-item-layout></template>' },
    // V10: dt-root-layout with sidebar-position="start"
    { code: '<template><dt-root-layout sidebar-position="start">x</dt-root-layout></template>' },
    // V11: dt-button with icon-position="start"
    { code: '<template><dt-button icon-position="start">x</dt-button></template>' },
    // V12: dt-split-button with logical events
    { code: '<template><dt-split-button @start-clicked="x" @end-clicked="x">x</dt-split-button></template>' },
    // V13: dt-recipe-callbox with end
    { code: '<template><dt-recipe-callbox><template #end>x</template></dt-recipe-callbox></template>' },
    // V14: dt-recipe-general-row with start
    { code: '<template><dt-recipe-general-row><template #start>x</template></dt-recipe-general-row></template>' },
    // V15: dt-recipe-grouped-chip with startIcon
    { code: '<template><dt-recipe-grouped-chip><template #startIcon>x</template></dt-recipe-grouped-chip></template>' },
    // V16: Unrelated component with #left (not in map)
    { code: '<template><custom-layout><template #left>x</template></custom-layout></template>' },
    // V17: dt-avatar with #icon (not deprecated on avatar)
    { code: '<template><dt-avatar><template #icon>x</template></dt-avatar></template>' },
    // V18: div with #leftIcon (not a Dialtone component)
    { code: '<template><div><template #leftIcon>x</template></div></template>' },
    // V19: alpha-active on dt-button (not in dt-button's prop map)
    { code: '<template><dt-button alpha-active>x</dt-button></template>' },
  ],

  // ============================================================
  // INVALID — deprecated physical names
  // ============================================================
  invalid: [
    // ── dt-badge ────────────────────────────────────────────────
    // I1: #leftIcon
    {
      code: '<template><dt-badge><template #leftIcon>x</template></dt-badge></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I2: #rightIcon
    {
      code: '<template><dt-badge><template #rightIcon>x</template></dt-badge></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },

    // ── dt-button ───────────────────────────────────────────────
    // I3: #icon (special ambiguous message)
    {
      code: '<template><dt-button><template #icon>x</template></dt-button></template>',
      errors: [{ messageId: 'deprecatedIconSlot' }],
    },
    // I4: #icon + icon-position="left" (2 errors)
    {
      code: '<template><dt-button icon-position="left"><template #icon>x</template></dt-button></template>',
      errors: [
        { messageId: 'deprecatedPropValue' },
        { messageId: 'deprecatedIconSlot' },
      ],
    },
    // I5: #icon + icon-position="right" (2 errors)
    {
      code: '<template><dt-button icon-position="right"><template #icon>x</template></dt-button></template>',
      errors: [
        { messageId: 'deprecatedPropValue' },
        { messageId: 'deprecatedIconSlot' },
      ],
    },
    // I6: icon-position="top"
    {
      code: '<template><dt-button icon-position="top">x</dt-button></template>',
      errors: [{ messageId: 'deprecatedPropValue' }],
    },
    // I7: icon-position="bottom"
    {
      code: '<template><dt-button icon-position="bottom">x</dt-button></template>',
      errors: [{ messageId: 'deprecatedPropValue' }],
    },

    // ── dt-input ────────────────────────────────────────────────
    // I8: #leftIcon
    {
      code: '<template><dt-input label="x"><template #leftIcon>x</template></dt-input></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I9: #rightIcon
    {
      code: '<template><dt-input label="x"><template #rightIcon>x</template></dt-input></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },

    // ── dt-tab ──────────────────────────────────────────────────
    // I10: #leftIcon
    {
      code: '<template><dt-tab><template #leftIcon>x</template></dt-tab></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },

    // ── dt-split-button slots ───────────────────────────────────
    // I11: #alphaIcon
    {
      code: '<template><dt-split-button><template #alphaIcon>x</template></dt-split-button></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I12: #omegaIcon
    {
      code: '<template><dt-split-button><template #omegaIcon>x</template></dt-split-button></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I13: #omega
    {
      code: '<template><dt-split-button><template #omega>x</template></dt-split-button></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },

    // ── dt-split-button props ───────────────────────────────────
    // I14: alpha-active
    {
      code: '<template><dt-split-button alpha-active>x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I15: alpha-aria-label
    {
      code: '<template><dt-split-button alpha-aria-label="Call">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I16: alpha-disabled
    {
      code: '<template><dt-split-button alpha-disabled>x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I17: alpha-loading
    {
      code: '<template><dt-split-button alpha-loading>x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I18: alpha-icon-position
    {
      code: '<template><dt-split-button alpha-icon-position="start">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I19: alpha-leading-class
    {
      code: '<template><dt-split-button alpha-leading-class="x">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I20: alpha-trailing-class
    {
      code: '<template><dt-split-button alpha-trailing-class="x">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I21: alpha-label-class
    {
      code: '<template><dt-split-button alpha-label-class="x">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I22: alpha-tooltip-text
    {
      code: '<template><dt-split-button alpha-tooltip-text="x">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I23: omega-active
    {
      code: '<template><dt-split-button omega-active>x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I24: omega-aria-label
    {
      code: '<template><dt-split-button omega-aria-label="x">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I25: omega-disabled
    {
      code: '<template><dt-split-button omega-disabled>x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I26: omega-id
    {
      code: '<template><dt-split-button omega-id="x">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I27: omega-tooltip-text
    {
      code: '<template><dt-split-button omega-tooltip-text="x">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },

    // ── dt-split-button events ──────────────────────────────────
    // I28: @alpha-clicked
    {
      code: '<template><dt-split-button @alpha-clicked="x">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedEvent' }],
    },
    // I29: @omega-clicked
    {
      code: '<template><dt-split-button @omega-clicked="x">x</dt-split-button></template>',
      errors: [{ messageId: 'deprecatedEvent' }],
    },

    // ── dt-item-layout ──────────────────────────────────────────
    // I30: #left
    {
      code: '<template><dt-item-layout><template #left>x</template></dt-item-layout></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I31: #right
    {
      code: '<template><dt-item-layout><template #right>x</template></dt-item-layout></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I32: #bottom
    {
      code: '<template><dt-item-layout><template #bottom>x</template></dt-item-layout></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I33: left-class
    {
      code: '<template><dt-item-layout left-class="x">x</dt-item-layout></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I34: right-class
    {
      code: '<template><dt-item-layout right-class="x">x</dt-item-layout></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },
    // I35: bottom-class
    {
      code: '<template><dt-item-layout bottom-class="x">x</dt-item-layout></template>',
      errors: [{ messageId: 'deprecatedProp' }],
    },

    // ── dt-root-layout ──────────────────────────────────────────
    // I36: sidebar-position="left"
    {
      code: '<template><dt-root-layout sidebar-position="left">x</dt-root-layout></template>',
      errors: [{ messageId: 'deprecatedPropValue' }],
    },
    // I37: sidebar-position="right"
    {
      code: '<template><dt-root-layout sidebar-position="right">x</dt-root-layout></template>',
      errors: [{ messageId: 'deprecatedPropValue' }],
    },

    // ── Recipe components ───────────────────────────────────────
    // I38: dt-recipe-callbox #right
    {
      code: '<template><dt-recipe-callbox><template #right>x</template></dt-recipe-callbox></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I39: dt-recipe-callbox #bottom
    {
      code: '<template><dt-recipe-callbox><template #bottom>x</template></dt-recipe-callbox></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I40: dt-recipe-contact-centers-row #right
    {
      code: '<template><dt-recipe-contact-centers-row><template #right>x</template></dt-recipe-contact-centers-row></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I41: dt-recipe-general-row #left
    {
      code: '<template><dt-recipe-general-row><template #left>x</template></dt-recipe-general-row></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I42: dt-recipe-top-banner-info #left
    {
      code: '<template><dt-recipe-top-banner-info><template #left>x</template></dt-recipe-top-banner-info></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I43: dt-recipe-top-banner-info #right
    {
      code: '<template><dt-recipe-top-banner-info><template #right>x</template></dt-recipe-top-banner-info></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I44: dt-recipe-grouped-chip #leftIcon
    {
      code: '<template><dt-recipe-grouped-chip><template #leftIcon>x</template></dt-recipe-grouped-chip></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I45: dt-recipe-grouped-chip #rightIcon
    {
      code: '<template><dt-recipe-grouped-chip><template #rightIcon>x</template></dt-recipe-grouped-chip></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I46: dt-recipe-grouped-chip #leftContent
    {
      code: '<template><dt-recipe-grouped-chip><template #leftContent>x</template></dt-recipe-grouped-chip></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },
    // I47: dt-recipe-grouped-chip #rightContent
    {
      code: '<template><dt-recipe-grouped-chip><template #rightContent>x</template></dt-recipe-grouped-chip></template>',
      errors: [{ messageId: 'deprecatedSlot' }],
    },

    // ── Multi-violation cases ───────────────────────────────────
    // M1: dt-split-button with slots + props + events
    {
      code: `<template>
  <dt-split-button
    alpha-active
    alpha-aria-label="Call"
    omega-disabled
    @alpha-clicked="x"
    @omega-clicked="x"
  >
    <template #alphaIcon>x</template>
    <template #omegaIcon>x</template>
  </dt-split-button>
</template>`,
      errors: [
        { messageId: 'deprecatedProp' },   // alpha-active
        { messageId: 'deprecatedProp' },   // alpha-aria-label
        { messageId: 'deprecatedProp' },   // omega-disabled
        { messageId: 'deprecatedEvent' },  // @alpha-clicked
        { messageId: 'deprecatedEvent' },  // @omega-clicked
        { messageId: 'deprecatedSlot' },   // #alphaIcon
        { messageId: 'deprecatedSlot' },   // #omegaIcon
      ],
    },
    // M2: dt-item-layout with all deprecated slots and props
    {
      code: `<template>
  <dt-item-layout left-class="x" right-class="x" bottom-class="x">
    <template #left>x</template>
    <template #right>x</template>
    <template #bottom>x</template>
  </dt-item-layout>
</template>`,
      errors: [
        { messageId: 'deprecatedProp' },   // left-class
        { messageId: 'deprecatedProp' },   // right-class
        { messageId: 'deprecatedProp' },   // bottom-class
        { messageId: 'deprecatedSlot' },   // #left
        { messageId: 'deprecatedSlot' },   // #right
        { messageId: 'deprecatedSlot' },   // #bottom
      ],
    },
    // M3: dt-button with #icon + icon-position="left"
    {
      code: `<template>
  <dt-button icon-position="left">
    <template #icon>x</template>
  </dt-button>
</template>`,
      errors: [
        { messageId: 'deprecatedPropValue' },  // icon-position="left"
        { messageId: 'deprecatedIconSlot' },    // #icon
      ],
    },
  ],
});
