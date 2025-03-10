/**
 * @fileoverview Detects usage of deprecated base color utility classes.
 * @author Tico Ortega
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const description = 'Usage of base color utility classes are deprecated and will be removed in the future.';

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description,
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-base-color-classes.md', // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      recommendBackgroundSemanticColor: `${ description } Checkout the available replacements here: https://dialtone.dialpad.com/utilities/backgrounds/color.html`,
      recommendForegroundSemanticColor: `${ description } Checkout the available replacements here: https://dialtone.dialpad.com/utilities/typography/font-color.html`,
      recommendBorderSemanticColor: `${ description } Checkout the available replacements here: https://dialtone.dialpad.com/utilities/borders/color.html`,
      recommendDivideSemanticColor: `${ description } Checkout the available replacements here: https://dialtone.dialpad.com/utilities/borders/divide-color.html`,
    }, // Add messageId and message
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      // Visitor functions for Vue templates
      VAttribute (node) {
        if (node.key.name === 'class') {
          const classes = node.value.value;
          if (classes.match(/d-bgc-\w+-\d{2,4}/)) {
            context.report({ node: node, messageId: 'recommendBackgroundSemanticColor' });
          } else if (classes.match(/d-fc-\w+-\d{2,4}/)) {
            context.report({ node: node, messageId: 'recommendForegroundSemanticColor' });
          } else if (classes.match(/d-bc-\w+-\d{2,4}/)) {
            context.report({ node: node, messageId: 'recommendBorderSemanticColor' });
          } else if (classes.match(/d-divide-\w+-\d{2,4}/)) {
            context.report({ node: node, messageId: 'recommendDivideSemanticColor' });
          }
        }
      },
    });
  },
};
