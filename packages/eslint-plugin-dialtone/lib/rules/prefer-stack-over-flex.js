/**
 * @fileoverview Prefer DtStack component over flex utility classes
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detects flex utility layouts that should use `DtStack`.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/prefer-stack-over-flex.md',
    },
    fixable: null,
    schema: [],
    messages: {
      preferStack: 'Consider using `<dt-stack>` instead of `d-d-flex`. See: https://dialtone.dialpad.com/components/stack.html',
      dynamicFlexBinding: 'Flex utilities detected in dynamic `:class` binding. Consider using `<dt-stack>` with conditional props instead. Manual migration required.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VElement(node) {
        // Skip if already dt-stack or DtStack (use rawName — node.name is always lowercased)
        const elementName = node.rawName;
        if (elementName === 'dt-stack' || elementName === 'DtStack') return;

        // Find class attribute
        const classAttr = node.startTag.attributes.find(
          attr => attr.key && attr.key.name === 'class',
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
      },

      VAttribute(node) {
        // Check for :class or v-bind:class directives
        if (node.directive &&
            node.key.name.name === 'bind' &&
            node.key.argument?.name === 'class') {

          // Skip dt-stack / DtStack — these are handled by deprecated-stack-alignment-classes
          // (use rawName because node.name is always lowercased by vue-eslint-parser)
          const parentEl = node.parent?.parent;
          const parentName = parentEl?.rawName;
          if (parentName === 'dt-stack' || parentName === 'DtStack') return;

          // Get the raw source of the binding expression
          const bindingText = sourceCode.getText(node.value);

          // Check if it contains flex utilities (as string literals).
          // `\b` after `d-d-flex` prevents false matches on hypothetical `d-d-flexible`.
          if (/['"]d-d-flex\b|['"]d-ai-|['"]d-jc-|['"]d-fd-|['"]d-gg?\d/.test(bindingText)) {
            context.report({
              node: node,
              messageId: 'dynamicFlexBinding',
            });
          }
        }
      },
    });
  },
};
