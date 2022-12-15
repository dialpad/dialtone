/**
 * @fileoverview Finds old dialtone vue icons usage
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
            description: 'Finds old vue icons imports from dialtone',
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
        messages: {
            avoidVueImport: 'Avoid usage of old dialtone vue icons [deprecated]. Use DtIcon component instead https://vue.dialpad.design/?path=/docs/components-icon--default'
        }
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
                if (!node.source.value.toLowerCase().includes('@dialpad/dialtone/vue')) return;
                context.report({
                    node: node,
                    messageId: 'avoidVueImport',
                });
            }
        };
    },
};
