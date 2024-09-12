/**
 * @fileoverview Detects usage of d-gg*, d-grg*, d-gcg* deprecated utility classes which will be removed in the future.
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
      description: "Usage of d-gg*, d-grg*, d-gcg* utility classes are deprecated and will be removed in the future.",
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-grid-gap-classes.md', // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      recommendGridGapStyle: `Usage of d-gg*, d-grg*, d-gcg* utility classes are deprecated and will be removed in the future. 
      Checkout the available replacements here: https://dialtone.dialpad.com/utilities/grid/gap.html`,
    }, // Add messageId and message
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      // Visitor functions for Vue templates
      VAttribute(node) {
        if (node.key.name === 'class') {
          const classes = node.value.value.split(' ');
          const gapClasses = ['d-gg', 'd-grg', 'd-gcg'];
          const gapClassesFound = classes.filter((className) =>
            gapClasses.some((gapClass) => className.startsWith(gapClass))
          );
          if (gapClassesFound.length > 0) {
            context.report({
              node: node,
              messageId: 'recommendGridGapStyle',
            });
          }
        }
      }
    });
  }
};
