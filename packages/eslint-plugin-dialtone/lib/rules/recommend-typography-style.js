/**
 * @fileoverview Utilities to set Font family, Font weight, Font size, and Line height separately are discouraged in favor of composed typography utilities
 * @author Nina Repetto
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Utilities to set Font family, Font weight, Font size, and Line height separately are discouraged in favor of composed typography utilities",
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/recommend-typography-style.md', // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      recommendTypographyStyle: `Utilities to set Font family, Font weight, Font size, and Line height separately are
      discouraged in favor of composed typography utilities. Checkout the available classes here:
      https://dialtone.dialpad.com/design/typography/#api. There can be cases where using these utilities is intentional and valid,
      in which case you can ignore this lint warning.`,
    }, // Add messageId and message
  },

  create(context) {
    return context.parserServices.defineTemplateBodyVisitor({
      // Visitor functions for Vue templates
      VAttribute(node) {
        if (node.key.name === 'class') {
          const classes = node.value.value.split(' ');
          const typographyClasses = ['d-fs', 'd-fw', 'd-lh', 'd-ff'];
          const typographyClassesFound = classes.filter((className) =>
            typographyClasses.some((typographyClass) => className.includes(typographyClass))
          );
          if (typographyClassesFound.length > 0) {
            context.report({
              node: node,
              messageId: 'recommendTypographyStyle',
            });
          }
        }
      }
    });
  }
};
