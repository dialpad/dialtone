/**
 * @fileoverview Detects usages of deprecated Dialtone components that should be replaced by newer alternatives.
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
      description: "Detects usage of deprecated Dialtone components that have newer alternatives.",
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-dialtone-component.md',
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      deprecatedDialtoneComponent: '{{ componentName }} is deprecated. Replace with {{ replacement }} from {{ package }}.',
      deprecatedDtIcon: 'DtIcon is deprecated. Import icon components directly instead, for example: import { DtIconPhoneHangUp } from \'@dialpad/dialtone-icons/vue3\'.',
    }
  },

  create(context) {
    const deprecatedIconComponent = 'DtIcon';

    const deprecatedComponents = [
      { componentName: 'DtRecipeComboboxMultiSelect', replacement: 'DtComboboxMultiSelect', package: '@dialpad/dialtone' },
      { componentName: 'DtRecipeComboboxWithPopover', replacement: 'DtComboboxWithPopover', package: '@dialpad/dialtone' },
      { componentName: 'DtRecipeMotionText', replacement: 'DtMotionText', package: '@dialpad/dialtone' },
      { componentName: 'DtRecipeCallbarButton', replacement: 'DpCallbarButton', package: '@dialpad/callbarkit' },
      { componentName: 'DtRecipeCallbarButtonWithPopover', replacement: 'DpCallbarButtonWithPopover', package: '@dialpad/callbarkit' },
      { componentName: 'DtRecipeCallbarButtonWithDropdown', replacement: 'DpCallbarButtonWithDropdown', package: '@dialpad/callbarkit' },
      { componentName: 'DtRecipeGroupedChip', replacement: 'DpGroupedChip', package: '@dialpad/callbarkit' },
      { componentName: 'DtRecipeTopBannerInfo', replacement: 'DpTopBannerInfo', package: '@dialpad/callbarkit' },
      { componentName: 'DtRecipeAttachmentCarousel', replacement: 'DpAttachmentCarousel', package: '@dialpad/chatkit' },
      { componentName: 'DtRecipeMessageInput', replacement: 'DpMessageInput', package: '@dialpad/chatkit' },
      { componentName: 'DtRecipeContactInfo', replacement: 'DpContactInfo', package: '@dialpad/chatkit' },
      { componentName: 'DtRecipeEditor', replacement: 'DpEditor', package: '@dialpad/chatkit' },
      { componentName: 'DtRecipeEmojiRow', replacement: 'DpEmojiRow', package: '@dialpad/chatkit' },
      { componentName: 'DtRecipeFeedItemPill', replacement: 'DpFeedItemPill', package: '@dialpad/chatkit' },
      { componentName: 'DtRecipeFeedItemRow', replacement: 'DpFeedItemRow', package: '@dialpad/chatkit' },
      { componentName: 'DtRecipeContactCentersRow', replacement: 'DpContactCentersRow', package: '@dialpad/navigationkit' },
      { componentName: 'DtRecipeContactRow', replacement: 'DpContactRow', package: '@dialpad/navigationkit' },
      { componentName: 'DtRecipeGeneralRow', replacement: 'DpGeneralRow', package: '@dialpad/navigationkit' },
      { componentName: 'DtRecipeGroupRow', replacement: 'DpGroupRow', package: '@dialpad/navigationkit' },
      { componentName: 'DtRecipeUnreadPill', replacement: 'DpUnreadPill', package: '@dialpad/navigationkit' },
      { componentName: 'DtRecipeCallbox', replacement: 'DpCallbox', package: '@dialpad/navigationkit' },
      { componentName: 'DtRecipeSettingsMenuButton', replacement: 'DpSettingsMenuButton', package: '@dialpad/navigationkit' },
      { componentName: 'DtRecipeIvrNode', replacement: 'DpIvrNode', package: '@dialpad/workflowkit' },
    ];

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        const isDialtoneSource = /^@dialpad\/dialtone(?:-vue)?(?:$|\/)/.test(importPath);
        if (!isDialtoneSource) {
          return;
        }

        node.specifiers.forEach(specifier => {
          if (specifier.type !== 'ImportSpecifier') return;

          const importedName = specifier.imported.name;

          if (importedName === deprecatedIconComponent) {
            context.report({
              node: specifier,
              messageId: 'deprecatedDtIcon',
            });
            return;
          }

          const found = deprecatedComponents.find(item => item.componentName === importedName);

          if (found) {
            context.report({
              node: specifier,
              messageId: 'deprecatedDialtoneComponent',
              data: {
                componentName: found.componentName,
                replacement: found.replacement,
                package: found.package,
              }
            });
          }
        });
      },
    };
  },
};
