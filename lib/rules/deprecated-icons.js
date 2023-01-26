/**
 * @fileoverview Finds old dialtone svg icons usage
 * @author julio ortega
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion', // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'Finds deprecated svg and vue icon imports from dialtone',
            recommended: false,
            url: 'https://github.com/dialpad/eslint-plugin-dialtone/blob/main/docs/rules/deprecated-icons.md', // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
        messages: {
            avoidDeprecatedImport: 'Avoid usage of old dialtone icons [deprecated]. Check https://dialpad.design/components/icon.html for details.',
        },
    },
    create(context) {
        const iconRegex = /.*@dialpad\/dialtone\/(vue\/.*|.+\.svg)/gm;
        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportDeclaration(node) {
                const matched = iconRegex.exec(node.source.value.toLowerCase());
                if (!matched ||matched.input.includes('/brand/') || matched.input.includes('/spot/')) return;

                context.report({
                    node: node,
                    messageId: 'avoidDeprecatedImport',
                });
            }
        };
    },
};
