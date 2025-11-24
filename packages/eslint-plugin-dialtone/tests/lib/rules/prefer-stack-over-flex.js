/**
 * @fileoverview Prefer DtStack component over flex utility classes
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-stack-over-flex"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  // eslint-disable-next-line n/no-extraneous-require
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 'latest' }
});

ruleTester.run("prefer-stack-over-flex", rule, {
  valid: [
    // DtStack without d-d-flex (correct usage)
    {
      code: "<template><dt-stack align=\"center\">...</dt-stack></template>",
    },
    // DtStack with PascalCase (correct usage)
    {
      code: "<template><DtStack justify=\"between\">...</DtStack></template>",
    },
    // Element without d-d-flex
    {
      code: "<template><div class=\"d-p16 d-mb8\">...</div></template>",
    },
    // Element with no class attribute
    {
      code: "<template><div>...</div></template>",
    },
    // Element with empty class
    {
      code: "<template><div class=\"\">...</div></template>",
    },
    // DtStack with d-d-flex is handled by deprecated-stack-alignment-classes rule
    // So this rule should NOT trigger (to avoid duplicate warnings)
    {
      code: "<template><dt-stack class=\"d-d-flex\">...</dt-stack></template>",
    },
    {
      code: "<template><DtStack class=\"d-d-flex d-ai-center\">...</DtStack></template>",
    },
  ],

  invalid: [
    // Basic d-d-flex on div
    {
      code: "<template><div class=\"d-d-flex\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex with align-items utility
    {
      code: "<template><div class=\"d-d-flex d-ai-center\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex with justify-content utility
    {
      code: "<template><div class=\"d-d-flex d-jc-space-between\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex with direction and gap utilities
    {
      code: "<template><div class=\"d-d-flex d-fd-column d-g16\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex with multiple flex utilities
    {
      code: "<template><div class=\"d-d-flex d-ai-center d-jc-space-between\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex with wrap (can use dt-stack with class retained)
    {
      code: "<template><div class=\"d-d-flex d-fw-wrap\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex with flex-grow (can use dt-stack with class retained)
    {
      code: "<template><div class=\"d-d-flex d-fl-grow1\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex with align-self (can use dt-stack with class retained)
    {
      code: "<template><div class=\"d-d-flex d-as-flex-end\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex with flow gap (can use dt-stack with class retained)
    {
      code: "<template><div class=\"d-d-flex d-flow16\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex on span element
    {
      code: "<template><span class=\"d-d-flex d-ai-center d-g8\">...</span></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex with non-flex utilities
    {
      code: "<template><div class=\"d-d-flex d-p16 d-mb8\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // d-d-flex mixed with other classes
    {
      code: "<template><div class=\"d-p16 d-d-flex d-ai-flex-start d-mb8\">...</div></template>",
      errors: [{ messageId: 'preferStack' }],
    },
    // Multi-line element with d-d-flex
    {
      code: `<template>
  <div
    class="d-d-flex d-ai-center"
  >
    ...
  </div>
</template>`,
      errors: [{ messageId: 'preferStack' }],
    },
  ],
});
