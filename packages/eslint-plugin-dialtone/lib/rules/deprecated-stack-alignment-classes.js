/**
 * @fileoverview Recommends using props instead of CSS utilities on Stack component
 */
"use strict";

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

/**
 * Gap utility classes that have DtStack equivalents.
 * Maps utility class suffix to DtStack gap prop value.
 * Gaps > 64px have no equivalent and should not be flagged.
 */
const GAP_WITH_EQUIVALENTS = {
  '0': '0',
  '8': '400',
  '16': '500',
  '24': '550',
  '32': '600',
  '48': '650',
  '64': '700',
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "Recommend using props instead of CSS utilities on Stack component",
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-stack-alignment-classes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      useAlignProp: 'Use the `align` prop instead of `d-ai-*` utility classes on <dt-stack>. See: https://dialtone.dialpad.com/components/stack.html#align',
      useJustifyProp: 'Use the `justify` prop instead of `d-jc-*` utility classes on <dt-stack>. See: https://dialtone.dialpad.com/components/stack.html#justify',
      useDirectionProp: 'Use the `direction` prop instead of `d-fd-*` utility classes on <dt-stack>. See: https://dialtone.dialpad.com/components/stack.html#direction',
      useGapProp: 'Use the `gap` prop instead of `d-g*` utility classes on <dt-stack>. See: https://dialtone.dialpad.com/components/stack.html#gap',
      removeRedundantFlex: 'Remove `d-d-flex` from <dt-stack> - it is already a flex container.',
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

            // Check for d-fd-* classes (flex-direction utilities)
            if (/d-fd-(row|column|row-reverse|column-reverse)/.test(classes)) {
              context.report({
                node: classAttr,
                messageId: 'useDirectionProp',
              });
            }

            // Check for d-g* and d-gg* classes (gap utilities) - only those with DtStack equivalents
            // d-gg* uses deprecated grid-gap property but works the same as d-g*
            const gapMatch = classes.match(/\bd-gg?(\d+)\b/);
            if (gapMatch && GAP_WITH_EQUIVALENTS[gapMatch[1]]) {
              context.report({
                node: classAttr,
                messageId: 'useGapProp',
              });
            }

            // Check for d-d-flex (redundant on DtStack)
            if (/\bd-d-flex\b/.test(classes)) {
              context.report({
                node: classAttr,
                messageId: 'removeRedundantFlex',
              });
            }
          }
        }
      }
    });
  }
};
