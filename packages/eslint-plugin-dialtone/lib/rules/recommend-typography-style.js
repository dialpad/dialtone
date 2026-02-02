/**
 * @fileoverview Combining multiple typography utility categories is discouraged in favor of composed typography utilities
 * @author Nina Repetto
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const typographyCategories = {
  'font-weight': ['d-fw-normal', 'd-fw-medium', 'd-fw-semibold', 'd-fw-bold'],
  'font-size': ['d-fs'], // prefix match
  'line-height': ['d-lh'], // prefix match
  'font-family': ['d-ff-custom', 'd-ff-sans', 'd-ff-mono', 'd-ff-marketing', 'd-ff-unset'],
};

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Combining multiple typography utility categories is discouraged in favor of composed typography utilities',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/recommend-typography-style.md', // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      recommendTypographyStyle: `Combining multiple typography utility categories (Font family, Font weight, Font size, Line height) is
      discouraged in favor of composed typography utilities. Checkout the available classes here:
      https://dialtone.dialpad.com/design/typography/#api. There can be cases where using these utilities is intentional and valid,
      in which case you can ignore this lint warning.`,
    }, // Add messageId and message
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      // Visitor functions for Vue templates
      VAttribute (node) {
        if (node.key.name === 'class') {
          const classes = node.value.value.split(' ');

          // For each class, determine which category it belongs to
          const categoriesFound = new Set();
          classes.forEach((className) => {
            for (const [category, patterns] of Object.entries(typographyCategories)) {
              if (patterns.some((pattern) => className.startsWith(pattern))) {
                categoriesFound.add(category);
              }
            }
          });

          // Only report if 2+ different categories are present
          if (categoriesFound.size >= 2) {
            context.report({
              node,
              messageId: 'recommendTypographyStyle',
            });
          }
        }
      },
    });
  },
};
