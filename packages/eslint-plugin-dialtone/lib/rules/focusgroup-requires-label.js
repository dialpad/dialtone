/**
 * @fileoverview Warns when v-dt-focusgroup is used without an accessible label on the same element.
 * @author Dialtone
 */
'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Warns when v-dt-focusgroup is used on an element without aria-label or aria-labelledby. ' +
        'Screen readers need an accessible name to identify the widget.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/focusgroup-requires-label.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missingLabel:
        'v-dt-focusgroup requires an accessible name via "aria-label" or "aria-labelledby" ' +
        'so screen readers can identify the widget.',
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (node) {
        if (!node.directive) return;
        if (node.key.name.name !== 'dt-focusgroup') return;

        const element = node.parent;
        const hasLabel = element.attributes.some(
          attr =>
            (!attr.directive && (
              attr.key.name === 'aria-label' ||
              attr.key.name === 'aria-labelledby'
            )) ||
            (attr.directive && attr.key.name.name === 'bind' && (
              attr.key.argument?.name === 'aria-label' ||
              attr.key.argument?.name === 'aria-labelledby'
            )),
        );

        if (!hasLabel) {
          context.report({ node, messageId: 'missingLabel' });
        }
      },
    });
  },
};
