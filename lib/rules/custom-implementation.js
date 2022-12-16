/**
 * @fileoverview Detects custom dialtone icons implementations
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
      description: "Detects custom dialtone icons implementations",
      recommended: false,
      url: 'https://github.com/dialpad/eslint-plugin-dialtone/blob/main/docs/rules/custom-implementation.md', // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      avoidRequireContext: 'Avoid custom dialtone icons implementation. Use DtIcon component instead https://vue.dialpad.design/?path=/docs/components-icon--default',
      avoidCustomImport: 'Avoid importing dialtone icons with custom webpack alias'
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
        const foundIndex = node.source.value.toLowerCase().search(/@d(spot|icon)/g);
         if (foundIndex === -1) return;

         context.report({
            node: node,
            messageId: 'avoidCustomImport',
        });
      },
      VariableDeclaration(node) {
        node.declarations.forEach(declaration => {
          const calleeIsRequireContext = declaration?.init?.callee?.object?.name === 'require' && declaration?.init?.callee?.property?.name === 'context';
          if (!calleeIsRequireContext) return;

          const argumentsIncludeDialtone = declaration?.init?.arguments?.find(argument => {
            if (typeof argument.value !== 'string') return false;
            return argument.value.toLowerCase().search(/@dialpad\/dialtone\/.*\/icons/g) !== -1
          });
          if (!argumentsIncludeDialtone) return;
          context.report({
            node: node,
            messageId: 'avoidRequireContext',
          })
        })
      }
    };
  },
};
