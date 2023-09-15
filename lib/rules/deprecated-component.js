/**
 * @fileoverview Detects usages of old dialpad product side components which should be replaced by Dialtone components.
 * @author Brad Paugh
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
      description: "Detects usages of deprecated components that should be replaced by Dialtone Vue components",
      recommended: false,
      url: 'https://github.com/dialpad/eslint-plugin-dialtone/blob/main/docs/rules/deprecated-component.md', // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      deprecatedComponent: '{{ componentName }} is deprecated and should be replaced with the Dialtone Vue {{ replacement }} component.\n{{ link }}',
    }
  },

  create(context) {
    const deprecatedComponents = [
      {
        fileName: 'select_menu',
        componentName: 'SelectMenu',
        replacement: 'DtComboboxWithPopover',
        link: 'https://vue.dialpad.design/?path=/story/recipes-comboboxes-combobox-with-popover--default'
      }
    ]

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        let foundIndex;

        deprecatedComponents.forEach(item => {
          const regex = new RegExp(`^.*${item.fileName}(?:\\.vue)?$`, 'g');
          foundIndex = node.source.value.toLowerCase().search(regex);

          if (foundIndex !== -1) {
            context.report({
                node: node,
                messageId: 'deprecatedComponent',
                data: {
                  componentName: item.componentName,
                  replacement: item.replacement,
                  link: item.link
                }
            });
            return;
          }
        });
      },
    };
  },
};
