/**
 * @fileoverview Detects usage of pixel-based utility classes (d-h16, d-p8, d-m8, etc.)
 * which should be replaced with token-stop-based equivalents (d-h-25, d-p-100, d-m-100).
 * @author Joshua Hynes
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Pixel values that have token-stop equivalents
// MUST STAY IN SYNC with WIDTH_HEIGHTS_LAYOUT, MARGIN_SIZES_SPACING, MARGIN_SIZES_LAYOUT,
// and NEGATIVE_SPACING_MAP in dialtone-css/postcss/constants.cjs
// Sizing: layout stops (16px+)
const SIZING_PIXELS = '16|32|48|64|80|96|112|128|160|192|224|256|288|320|352|384|416|448|480|512|544|576|608|640|672|704|736|768|800|832|864|896|928|960|992|1024';
// Spacing: spacing stops (0-64px) + layout stops for margin/padding (96, 128)
const SPACING_PIXELS = '0|1|2|4|6|8|10|12|14|16|20|24|32|48|64|96|128';
// Negative spacing
const NEGATIVE_PIXELS = '1|2|4|6|8|10|12|14|16|24|32|48|64';

// Build patterns for each category
// Sizing: d-h16, d-w64, d-hmn96, d-hmx128, d-wmn32, d-wmx512
const SIZING_PATTERN = `d-(?:h|w|hmn|hmx|wmn|wmx)(?:${SIZING_PIXELS})\\b`;
// Margin: d-m8, d-mt16, d-mr8, d-mb8, d-ml8, d-mx8, d-my8
const MARGIN_PATTERN = `d-m(?:t|r|b|l|x|y)?(?:${SPACING_PIXELS})\\b`;
// Negative margin: d-mtn8, d-mrn8, d-mbn8, d-mln8, d-mxn8, d-myn8, d-mn8
const NEGATIVE_MARGIN_PATTERN = `d-m(?:t|r|b|l|x|y)?n(?:${NEGATIVE_PIXELS})\\b`;
// Padding: d-p8, d-pt16, d-pr8, d-pb8, d-pl8, d-px8, d-py8
const PADDING_PATTERN = `d-p(?:t|r|b|l|x|y)?(?:${SPACING_PIXELS})\\b`;
// Gap: d-g8, d-rg8, d-cg8
const GAP_PATTERN = `d-(?:g|rg|cg)(?:${SPACING_PIXELS})\\b`;
// Position: d-t8, d-r8, d-b8, d-l8, d-x8, d-y8, d-all8
const POSITION_PATTERN = `d-(?:t|r|b|l|x|y|all)(?:${SPACING_PIXELS})\\b`;
// Negative position: d-tn8, d-rn8, d-bn8, d-ln8, d-xn8, d-yn8, d-alln8
const NEGATIVE_POSITION_PATTERN = `d-(?:t|r|b|l|x|y|all)n(?:${NEGATIVE_PIXELS})\\b`;

const COMBINED_PATTERN = new RegExp(
  `(?:${SIZING_PATTERN}|${NEGATIVE_MARGIN_PATTERN}|${MARGIN_PATTERN}|${PADDING_PATTERN}|${GAP_PATTERN}|${NEGATIVE_POSITION_PATTERN}|${POSITION_PATTERN})`
);

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "Pixel-based utility classes (d-h16, d-p8, d-m8) are deprecated. Use token-stop-based equivalents (d-h-25, d-p-100, d-m-100).",
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-pixel-utility-classes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      deprecatedPixelClass: `Pixel-based utility classes are deprecated. Use token-stop-based equivalents instead (e.g. d-h16 → d-h-25, d-p8 → d-p-100). Run the "utility-class-to-token-stops" migration helper to update automatically.`,
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (node) {
        if (node.key.name === 'class') {
          const classes = node.value.value;
          if (COMBINED_PATTERN.test(classes)) {
            context.report({
              node,
              messageId: 'deprecatedPixelClass',
            });
          }
        }
      },
    });
  },
};
