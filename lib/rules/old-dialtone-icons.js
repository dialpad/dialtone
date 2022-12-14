/**
 * @fileoverview Finds and warns about old dialtone icons usage
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
            description: "Finds and warns about old dialtone icons usage",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
        messages: {
            avoidImport: "Avoid usage of old dialtone icons [deprecated]. Check https://dialpad.design",
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
                if (node.source.value.includes('@dialpad/dialtone/lib/build')) {
                    context.report({
                        node: node,
                        messageId: "avoidImport",
                    });
                }
            }
        };
    },
};
