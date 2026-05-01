/**
 * @fileoverview Detect deprecated `d-stack*` / `d-flow*` sibling-margin classes;
 * recommend `<dt-stack>` with the equivalent `gap` prop.
 */
'use strict';

// Word boundaries handle responsive prefixes (`md:d-stack16`) and adjacent classes.
const DEPRECATED_AUTO_SPACING_RE = /\bd-(?:stack|flow)\d+\b/;

// Same pattern as a quoted string literal inside a `:class` array/object binding.
// Allows responsive prefixes (`md:d-stack16`) before the deprecated token.
const DEPRECATED_IN_BINDING_RE = /['"](?:[\w-]+:)*d-(?:stack|flow)\d+['"]/;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect deprecated `d-stack*` / `d-flow*` sibling-margin utilities; prefer `<dt-stack>` with the equivalent `gap` prop',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-stack-flow-classes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      preferStack: '`d-stack*` / `d-flow*` are deprecated sibling-margin utilities. Use `<dt-stack>` with the equivalent `gap` prop instead.',
      preferStackInBinding: '`d-stack*` / `d-flow*` detected in dynamic `:class` binding. These sibling-margin utilities are deprecated. Use `<dt-stack>` with the equivalent `gap` prop. Manual migration required.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({

      VElement(node) {
        const classAttr = node.startTag.attributes.find(
          attr => attr.key && attr.key.name === 'class' && !attr.directive,
        );

        if (classAttr && classAttr.value && classAttr.value.value) {
          if (DEPRECATED_AUTO_SPACING_RE.test(classAttr.value.value)) {
            context.report({
              node: classAttr,
              messageId: 'preferStack',
            });
          }
        }
      },

      VAttribute(node) {
        if (node.directive &&
            node.key.name.name === 'bind' &&
            node.key.argument?.name === 'class' &&
            node.value) {
          const bindingText = sourceCode.getText(node.value);
          if (DEPRECATED_IN_BINDING_RE.test(bindingText)) {
            context.report({
              node: node,
              messageId: 'preferStackInBinding',
            });
          }
        }
      },
    });
  },
};
