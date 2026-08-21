/**
 * @fileoverview Warns when v-dt-focusgroup is used without a role attribute on the same element.
 * @author Dialtone
 */
'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detects `v-dt-focusgroup` elements without a role.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/focusgroup-requires-role.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missingRole:
        'v-dt-focusgroup requires a "role" attribute (e.g. toolbar, tablist, listbox, radiogroup, menu) ' +
        'so screen readers can announce the widget correctly.',
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (node) {
        if (!node.directive) return;
        if (node.key.name.name !== 'dt-focusgroup') return;

        const element = node.parent;
        const hasRole = element.attributes.some(
          attr =>
            (!attr.directive && attr.key.name === 'role') ||
            (attr.directive && attr.key.name.name === 'bind' && attr.key.argument?.name === 'role'),
        );

        if (!hasRole) {
          context.report({ node, messageId: 'missingRole' });
        }
      },
    });
  },
};
