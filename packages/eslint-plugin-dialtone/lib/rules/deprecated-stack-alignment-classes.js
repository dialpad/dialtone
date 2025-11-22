/**
 * @fileoverview Recommends using align/justify props instead of CSS utilities on Stack component
 * @author Claude Code
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "Recommend using align/justify props instead of CSS utilities on Stack component",
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-stack-alignment-classes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      useAlignProp: 'Use the `align` prop instead of `d-ai-*` utility classes on <dt-stack>. See: https://dialtone.dialpad.com/components/stack.html#align',
      useJustifyProp: 'Use the `justify` prop instead of `d-jc-*` utility classes on <dt-stack>. See: https://dialtone.dialpad.com/components/stack.html#justify',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VElement(node) {
        // Check if element is dt-stack or DtStack
        const elementName = node.name || node.rawName;
        if (elementName === 'dt-stack' || elementName === 'DtStack') {
          // Find class attribute
          const classAttr = node.startTag.attributes.find(
            attr => attr.key && attr.key.name === 'class'
          );

          if (classAttr && classAttr.value && classAttr.value.value) {
            const classes = classAttr.value.value;

            // Check for d-ai-* classes (align-items utilities)
            if (/d-ai-(normal|flex-start|center|flex-end|stretch|baseline)/.test(classes)) {
              context.report({
                node: classAttr,
                messageId: 'useAlignProp',
              });
            }

            // Check for d-jc-* classes (justify-content utilities)
            if (/d-jc-(flex-start|center|flex-end|space-around|space-between|space-evenly)/.test(classes)) {
              context.report({
                node: classAttr,
                messageId: 'useJustifyProp',
              });
            }
          }
        }
      }
    });
  }
};
