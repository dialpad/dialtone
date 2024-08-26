/**
 * @fileoverview Detects usages of old dialpad product side components which should be replaced by Dialtone components.
 * @author Brad Paugh
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description:
        'Detects usages of deprecated vue directives that should be replaced by Dialtone Vue directives',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-directive.md', // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      deprecatedDirective:
        'v-{{ directiveName }} is deprecated and should be replaced with the Dialtone Vue v-{{ replacement }} component.\n{{ link }}',
    },
  },

  create(context) {
    const deprecatedDirectives = [
      {
        directiveName: 'tooltip',
        replacement: 'dt-tooltip',
        link: 'https://dialtone.dialpad.com/vue/?path=/docs/directives-tooltip--docs',
      },
    ];

    return context.parserServices.defineTemplateBodyVisitor({
      VAttribute(node) {
        deprecatedDirectives.forEach((item) => {
          if (node.directive && node.key.name.name === item.directiveName) {
            context.report({
              node: node,
              messageId: 'deprecatedDirective',
              data: {
                directiveName: item.directiveName,
                replacement: item.replacement,
                link: item.link,
              },
            });
          }
        });
      },
    });
  },
};
