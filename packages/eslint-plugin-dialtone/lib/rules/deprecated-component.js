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
        link: 'https://dialtone.dialpad.com/vue/?path=/story/recipes-comboboxes-combobox-with-popover--default'
      },
      {
        fileName: 'dropdown_menu',
        componentName: 'DropdownMenu',
        replacement: 'DtSelectMenu',
        link: 'https://dialtone.dialpad.com/vue/?path=/story/components-select-menu--default'
      },
      {
        fileName: 'base_toggle',
        componentName: 'BaseToggle',
        replacement: 'DtToggle',
        link: 'https://dialtone.dialpad.com/vue/?path=/story/components-toggle--default'
      },
      {
        fileName: 'base_date_picker',
        componentName: 'BaseDatePicker',
        replacement: 'DtDatepicker',
        link: 'https://dialtone.dialpad.com/vue/?path=/story/components-datepicker--default'
      },
      {
        fileName: 'checkbox',
        componentName: 'Checkbox',
        replacement: 'DtCheckbox',
        link: 'https://dialtone.dialpad.com/vue/?path=/story/components-checkbox--default'
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
