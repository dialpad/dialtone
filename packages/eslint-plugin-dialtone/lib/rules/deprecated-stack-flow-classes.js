/**
 * @fileoverview Detect deprecated `d-stack*` / `d-flow*` sibling-margin classes;
 * recommend `<dt-stack>` with the equivalent `gap` prop.
 */
'use strict';

// Word boundaries handle responsive prefixes (`md:d-stack16`) and adjacent classes.
// Capture group 1 is the px size; used to map to the equivalent `<dt-stack>` `gap` token.
const DEPRECATED_AUTO_SPACING_RE = /\bd-(?:stack|flow)(\d+)\b/;

// Same pattern as a quoted string literal anywhere inside a `:class` binding.
// Scans the whole quoted span so multi-class strings (`'d-ps-relative d-stack2 d-px-0'`)
// and responsive prefixes (`'md:d-stack16'`) both match.
const DEPRECATED_IN_BINDING_RE = /['"][^'"]*\bd-(?:stack|flow)\d+\b[^'"]*['"]/;

// Mirrors the table in docs/rules/deprecated-stack-flow-classes.md.
const PX_TO_GAP = {
  0: '0',
  1: '1',
  2: '25',
  4: '50',
  6: '75',
  8: '100',
  12: '150',
  16: '200',
  20: '250',
  24: '300',
  32: '400',
  48: '600',
  64: '800',
};

function describeMatch(text) {
  const match = DEPRECATED_AUTO_SPACING_RE.exec(text);
  if (!match) return null;
  const px = match[1];
  const gap = PX_TO_GAP[px];
  return { className: match[0], px, gap };
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detects sibling-margin utilities that should use the `DtStack` `gap` prop.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-stack-flow-classes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      preferStack: '`{{className}}` is deprecated. Use `<dt-stack>` with `gap="{{gap}}"` instead.',
      preferStackUnmapped: '`{{className}}` is deprecated. No exact `gap` equivalent for {{px}}px — use the closest `<dt-stack>` `gap` value (see rule docs).',
      preferStackInBinding: '`{{className}}` detected in dynamic `:class` binding. Use `<dt-stack>` with `gap="{{gap}}"`. Manual migration required.',
      preferStackInBindingUnmapped: '`{{className}}` detected in dynamic `:class` binding. No exact `gap` equivalent for {{px}}px — use the closest `<dt-stack>` `gap` value (see rule docs). Manual migration required.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const defineTemplateBodyVisitor = sourceCode.parserServices?.defineTemplateBodyVisitor;
    if (!defineTemplateBodyVisitor) return {};

    return defineTemplateBodyVisitor({

      VElement(node) {
        const classAttr = node.startTag.attributes.find(
          attr => attr.key && attr.key.name === 'class' && !attr.directive,
        );

        if (classAttr && classAttr.value && classAttr.value.value) {
          const info = describeMatch(classAttr.value.value);
          if (info) {
            context.report({
              node: classAttr,
              messageId: info.gap ? 'preferStack' : 'preferStackUnmapped',
              data: info,
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
            const info = describeMatch(bindingText);
            if (info) {
              context.report({
                node: node,
                messageId: info.gap ? 'preferStackInBinding' : 'preferStackInBindingUnmapped',
                data: info,
              });
            }
          }
        }
      },
    });
  },
};
