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
            description: 'Finds old svg icons imports from dialtone',
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
        messages: {
            avoidSVGImport: 'Avoid usage of old dialtone icons [deprecated]. Check https://dialpad.design/components/icon.html for details.',
        },
    },
    create(context) {
        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportDeclaration(node) {
                const foundIndex = node.source.value.toLowerCase().search(/@dialpad\/dialtone\/.*\.svg/g);
                if (foundIndex === -1) return;

                context.report({
                    node: node,
                    messageId: 'avoidSVGImport',
                });
            }
        };
    },
};
