/**
 * @fileoverview Recommends using align/justify props instead of CSS utilities on Stack component
 * @author Claude Code
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/deprecated-stack-alignment-classes"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  // eslint-disable-next-line n/no-extraneous-require
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 'latest' }
});

ruleTester.run("deprecated-stack-alignment-classes", rule, {
  valid: [
    // Stack with align prop (correct usage)
    {
      code: "<template><dt-stack align=\"center\">...</dt-stack></template>",
    },
    // Stack with justify prop (correct usage)
    {
      code: "<template><dt-stack justify=\"between\">...</dt-stack></template>",
    },
    // Stack with both props (correct usage)
    {
      code: "<template><dt-stack align=\"center\" justify=\"between\">...</dt-stack></template>",
    },
    // Stack with other utility classes (no alignment utilities)
    {
      code: "<template><dt-stack class=\"d-p16 d-mb8\">...</dt-stack></template>",
    },
    // Regular div with alignment utilities (not a Stack component)
    {
      code: "<template><div class=\"d-ai-center\">...</div></template>",
    },
    // Regular div with justify utilities (not a Stack component)
    {
      code: "<template><div class=\"d-jc-space-between\">...</div></template>",
    },
    // Stack with no classes
    {
      code: "<template><dt-stack>...</dt-stack></template>",
    },
  ],

  invalid: [
    // Stack with d-ai-center
    {
      code: "<template><dt-stack class=\"d-ai-center\">...</dt-stack></template>",
      errors: [{ messageId: 'useAlignProp' }],
    },
    // Stack with d-ai-flex-start
    {
      code: "<template><dt-stack class=\"d-ai-flex-start\">...</dt-stack></template>",
      errors: [{ messageId: 'useAlignProp' }],
    },
    // Stack with d-ai-flex-end
    {
      code: "<template><dt-stack class=\"d-ai-flex-end\">...</dt-stack></template>",
      errors: [{ messageId: 'useAlignProp' }],
    },
    // Stack with d-ai-stretch
    {
      code: "<template><dt-stack class=\"d-ai-stretch\">...</dt-stack></template>",
      errors: [{ messageId: 'useAlignProp' }],
    },
    // Stack with d-ai-baseline
    {
      code: "<template><dt-stack class=\"d-ai-baseline\">...</dt-stack></template>",
      errors: [{ messageId: 'useAlignProp' }],
    },
    // Stack with d-ai-normal
    {
      code: "<template><dt-stack class=\"d-ai-normal\">...</dt-stack></template>",
      errors: [{ messageId: 'useAlignProp' }],
    },
    // Stack with d-jc-center
    {
      code: "<template><dt-stack class=\"d-jc-center\">...</dt-stack></template>",
      errors: [{ messageId: 'useJustifyProp' }],
    },
    // Stack with d-jc-flex-start
    {
      code: "<template><dt-stack class=\"d-jc-flex-start\">...</dt-stack></template>",
      errors: [{ messageId: 'useJustifyProp' }],
    },
    // Stack with d-jc-flex-end
    {
      code: "<template><dt-stack class=\"d-jc-flex-end\">...</dt-stack></template>",
      errors: [{ messageId: 'useJustifyProp' }],
    },
    // Stack with d-jc-space-between
    {
      code: "<template><dt-stack class=\"d-jc-space-between\">...</dt-stack></template>",
      errors: [{ messageId: 'useJustifyProp' }],
    },
    // Stack with d-jc-space-around
    {
      code: "<template><dt-stack class=\"d-jc-space-around\">...</dt-stack></template>",
      errors: [{ messageId: 'useJustifyProp' }],
    },
    // Stack with d-jc-space-evenly
    {
      code: "<template><dt-stack class=\"d-jc-space-evenly\">...</dt-stack></template>",
      errors: [{ messageId: 'useJustifyProp' }],
    },
    // Stack with mixed utilities (should trigger align prop warning)
    {
      code: "<template><dt-stack class=\"d-p16 d-ai-flex-start d-mb8\">...</dt-stack></template>",
      errors: [{ messageId: 'useAlignProp' }],
    },
    // Stack with mixed utilities (should trigger justify prop warning)
    {
      code: "<template><dt-stack class=\"d-p16 d-jc-space-between d-mb8\">...</dt-stack></template>",
      errors: [{ messageId: 'useJustifyProp' }],
    },
    // Stack with both align and justify utilities (should trigger both warnings)
    {
      code: "<template><dt-stack class=\"d-ai-center d-jc-space-between\">...</dt-stack></template>",
      errors: [
        { messageId: 'useAlignProp' },
        { messageId: 'useJustifyProp' }
      ],
    },
    // Multi-line Stack with alignment utility
    {
      code: `<template>
  <dt-stack
    direction="row"
    gap="600"
    class="d-ai-flex-start"
  >
    ...
  </dt-stack>
</template>`,
      errors: [{ messageId: 'useAlignProp' }],
    },
  ],
});
