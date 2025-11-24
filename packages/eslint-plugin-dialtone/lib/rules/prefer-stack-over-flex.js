/**
 * @fileoverview Prefer DtStack component over flex utility classes
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "Prefer DtStack component over flex utility classes",
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/prefer-stack-over-flex.md',
    },
    fixable: null,
    schema: [],
    messages: {
      preferStack: 'Consider using `<dt-stack>` instead of `d-d-flex`. See: https://dialtone.dialpad.com/components/stack.html',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VElement(node) {
        // Skip if already dt-stack or DtStack
        const elementName = node.name || node.rawName;
        if (elementName === 'dt-stack' || elementName === 'DtStack') return;

        // Find class attribute
        const classAttr = node.startTag.attributes.find(
          attr => attr.key && attr.key.name === 'class'
        );

        if (classAttr && classAttr.value && classAttr.value.value) {
          const classes = classAttr.value.value;

          // Flag any element with d-d-flex (no exclusions)
          if (/\bd-d-flex\b/.test(classes)) {
            context.report({
              node: classAttr,
              messageId: 'preferStack',
            });
          }
        }
      }
    });
  }
};
