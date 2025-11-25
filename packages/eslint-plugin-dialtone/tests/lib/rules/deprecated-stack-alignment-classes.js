/**
 * @fileoverview Recommends using props instead of CSS utilities on Stack component
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
    // Stack with direction prop (correct usage)
    {
      code: "<template><dt-stack direction=\"row\">...</dt-stack></template>",
    },
    // Stack with gap prop (correct usage)
    {
      code: "<template><dt-stack gap=\"500\">...</dt-stack></template>",
    },
    // Regular div with d-fd-* (not a Stack component)
    {
      code: "<template><div class=\"d-fd-row\">...</div></template>",
    },
    // Regular div with d-g* (not a Stack component)
    {
      code: "<template><div class=\"d-g16\">...</div></template>",
    },
    // Regular div with d-d-flex (not a Stack component)
    {
      code: "<template><div class=\"d-d-flex\">...</div></template>",
    },
    // Stack with gap utility that has no DtStack equivalent (d-g80, d-g96, etc.)
    {
      code: "<template><dt-stack class=\"d-g80\">...</dt-stack></template>",
    },
    // Stack with gap utility that has no DtStack equivalent (d-g96)
    {
      code: "<template><dt-stack class=\"d-g96\">...</dt-stack></template>",
    },
    // Stack with d-gg utility that has no DtStack equivalent (d-gg80, d-gg96, etc.)
    {
      code: "<template><dt-stack class=\"d-gg80\">...</dt-stack></template>",
    },
    // Regular div with d-gg* (not a Stack component)
    {
      code: "<template><div class=\"d-gg16\">...</div></template>",
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

    // ========================================
    // Direction utilities (d-fd-*)
    // ========================================

    // Stack with d-fd-row
    {
      code: "<template><dt-stack class=\"d-fd-row\">...</dt-stack></template>",
      errors: [{ messageId: 'useDirectionProp' }],
    },
    // Stack with d-fd-column
    {
      code: "<template><dt-stack class=\"d-fd-column\">...</dt-stack></template>",
      errors: [{ messageId: 'useDirectionProp' }],
    },
    // Stack with d-fd-row-reverse
    {
      code: "<template><dt-stack class=\"d-fd-row-reverse\">...</dt-stack></template>",
      errors: [{ messageId: 'useDirectionProp' }],
    },
    // Stack with d-fd-column-reverse
    {
      code: "<template><dt-stack class=\"d-fd-column-reverse\">...</dt-stack></template>",
      errors: [{ messageId: 'useDirectionProp' }],
    },
    // Stack with d-fd-* mixed with other classes
    {
      code: "<template><dt-stack class=\"d-p16 d-fd-row d-mb8\">...</dt-stack></template>",
      errors: [{ messageId: 'useDirectionProp' }],
    },

    // ========================================
    // Gap utilities (d-g*) - only with equivalents
    // ========================================

    // Stack with d-g0
    {
      code: "<template><dt-stack class=\"d-g0\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-g8
    {
      code: "<template><dt-stack class=\"d-g8\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-g16
    {
      code: "<template><dt-stack class=\"d-g16\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-g24
    {
      code: "<template><dt-stack class=\"d-g24\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-g32
    {
      code: "<template><dt-stack class=\"d-g32\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-g48
    {
      code: "<template><dt-stack class=\"d-g48\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-g64
    {
      code: "<template><dt-stack class=\"d-g64\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-g* mixed with other classes
    {
      code: "<template><dt-stack class=\"d-p16 d-g16 d-mb8\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },

    // ========================================
    // Grid-gap utilities (d-gg*) - deprecated, but same conversion as d-g*
    // ========================================

    // Stack with d-gg8
    {
      code: "<template><dt-stack class=\"d-gg8\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-gg16
    {
      code: "<template><dt-stack class=\"d-gg16\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-gg24
    {
      code: "<template><dt-stack class=\"d-gg24\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-gg32
    {
      code: "<template><dt-stack class=\"d-gg32\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-gg48
    {
      code: "<template><dt-stack class=\"d-gg48\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-gg64
    {
      code: "<template><dt-stack class=\"d-gg64\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },
    // Stack with d-gg* mixed with other classes
    {
      code: "<template><dt-stack class=\"d-p16 d-gg16 d-mb8\">...</dt-stack></template>",
      errors: [{ messageId: 'useGapProp' }],
    },

    // ========================================
    // Redundant d-d-flex
    // ========================================

    // Stack with d-d-flex (redundant)
    {
      code: "<template><dt-stack class=\"d-d-flex\">...</dt-stack></template>",
      errors: [{ messageId: 'removeRedundantFlex' }],
    },
    // Stack with d-d-flex mixed with other classes
    {
      code: "<template><dt-stack class=\"d-d-flex d-ai-center\">...</dt-stack></template>",
      errors: [
        { messageId: 'useAlignProp' },
        { messageId: 'removeRedundantFlex' },
      ],
    },

    // ========================================
    // Multiple violations
    // ========================================

    // Stack with direction, gap, and alignment utilities
    {
      code: "<template><dt-stack class=\"d-fd-row d-g16 d-ai-center\">...</dt-stack></template>",
      errors: [
        { messageId: 'useAlignProp' },
        { messageId: 'useDirectionProp' },
        { messageId: 'useGapProp' },
      ],
    },
    // Stack with all possible violations
    {
      code: "<template><dt-stack class=\"d-d-flex d-fd-row d-g16 d-ai-center d-jc-space-between\">...</dt-stack></template>",
      errors: [
        { messageId: 'useAlignProp' },
        { messageId: 'useJustifyProp' },
        { messageId: 'useDirectionProp' },
        { messageId: 'useGapProp' },
        { messageId: 'removeRedundantFlex' },
      ],
    },
  ],
});
