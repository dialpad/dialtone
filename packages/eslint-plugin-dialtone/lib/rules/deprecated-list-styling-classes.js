/**
 * @fileoverview Detect deprecated list styling utilities; prefer DtTextList.
 */
'use strict';

// Token boundaries instead of `\b`: `\b` treats `-` as a non-word char, so it
// would match inside `foo-d-ls-reset` (see lib/util/class-attribute-rule.js).
// Quotes count as boundaries so the same regex works on static class attribute
// values and on the source text of `:class` binding expressions.
const DEPRECATED_LIST_CLASS_RE = /(?<=^|[\s'"`])(?:[\w-]+:)?(?:d-ls-(?:reset|none)|d-lst-[\w-]+)(?=$|[\s'"`])/g;

function deprecatedListClasses (source) {
  return Array.from(source.matchAll(DEPRECATED_LIST_CLASS_RE), match => match[0]);
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect deprecated `d-ls-*` / `d-lst-*` list styling utilities; prefer `<dt-text-list>`',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-list-styling-classes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      preferTextList: '`{{className}}` is deprecated for Vue text lists. Use `<dt-text-list>` and `<dt-text-list-item>` instead.',
      preferTextListInBinding: '`{{className}}` detected in dynamic `:class` binding. Use `<dt-text-list>` and `<dt-text-list-item>`. Manual migration required.',
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const defineTemplateBodyVisitor = sourceCode.parserServices?.defineTemplateBodyVisitor;
    if (!defineTemplateBodyVisitor) return {};

    return defineTemplateBodyVisitor({
      VAttribute (node) {
        if (!node.directive && node.key.name === 'class') {
          if (!node.value?.value) return;

          deprecatedListClasses(node.value.value).forEach((className) => {
            context.report({
              node,
              messageId: 'preferTextList',
              data: { className },
            });
          });
          return;
        }

        if (
          node.directive &&
          node.key.name.name === 'bind' &&
          node.key.argument?.name === 'class' &&
          node.value
        ) {
          deprecatedListClasses(sourceCode.getText(node.value)).forEach((className) => {
            context.report({
              node,
              messageId: 'preferTextListInBinding',
              data: { className },
            });
          });
        }
      },
    });
  },
};
