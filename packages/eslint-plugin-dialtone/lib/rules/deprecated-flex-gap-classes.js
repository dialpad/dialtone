/**
 * @fileoverview Detects usage of d-flg* deprecated utility classes which will be removed in the future.
 * @author Tico Ortega
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Usage of d-flg* utility classes are deprecated and will be removed in the future.",
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-flex-gap-classes.md', // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      recommendFlexGapStyle: `Usage of d-flg* utility classes are deprecated and will be removed in the future. 
      Checkout the available replacements here: https://dialtone.dialpad.com/utilities/flex/gap.html`,
    }, // Add messageId and message
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      // Visitor functions for Vue templates
      VAttribute(node) {
        if (node.key.name === 'class') {
          const classes = node.value.value;
          if (classes.match(/d-flg\d{1,2}/)) {
            context.report({
              node: node,
              messageId: 'recommendFlexGapStyle',
            });
          }
        }
      }
    });
  }
};
