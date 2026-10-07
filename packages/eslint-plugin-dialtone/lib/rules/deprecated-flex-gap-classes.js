/**
 * @fileoverview Detects usage of d-flg* deprecated utility classes which will be removed in the future.
 * @author Tico Ortega
 */
"use strict";
const { SPACING_MAP } = require('../generated/migration-guidance.json');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Detects usage of deprecated `d-flg*` flex-gap utilities.",
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-flex-gap-classes.md', // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      recommendFlexGapStyle: `Legacy flex-gap utilities are deprecated in Dialtone 10. Use current token-stop gap utilities (e.g. d-g-${SPACING_MAP[8]}); child-margin gutters require manual layout review before using native gap. See https://dialtone.dialpad.com/utilities/flex/gap.html`,
    }, // Add messageId and message
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      // Visitor functions for Vue templates
      VAttribute(node) {
        if (node.key.name === 'class' && node.value && typeof node.value.value === 'string') {
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
