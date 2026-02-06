/**
 * @fileoverview Detects usage of deprecated xxl/xxxl headline sizes which have been renamed to 2xl/3xl.
 * @author Dialtone Team
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const SIZE_MAP = {
  xxxl: '3xl',
  xxl: '2xl',
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Headline sizes xxl/xxxl have been renamed to 2xl/3xl.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-headline-sizes.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecatedSize: 'Headline size "{{oldSize}}" has been renamed to "{{newSize}}". Update size="{{oldSize}}" to size="{{newSize}}".',
      deprecatedClass: 'CSS class "{{oldClass}}" has been renamed to "{{newClass}}". Update to use the new class name.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute(node) {
        // Check size prop (e.g., size="xxl" or size="xxxl")
        if (node.key.name === 'size' && node.value && node.value.value) {
          const sizeValue = node.value.value;
          if (SIZE_MAP[sizeValue]) {
            context.report({
              node,
              messageId: 'deprecatedSize',
              data: {
                oldSize: sizeValue,
                newSize: SIZE_MAP[sizeValue],
              },
              fix(fixer) {
                return fixer.replaceText(node.value, `"${SIZE_MAP[sizeValue]}"`);
              },
            });
          }
        }

        // Check class attributes for deprecated d-text-headline--xxl/xxxl classes
        // Note: We only flag d-text-headline-- (current system), NOT d-headline-- (legacy system)
        if (node.key.name === 'class' && node.value && node.value.value) {
          const classValue = node.value.value;
          // Match d-text-headline--xxl or d-text-headline--xxxl (but NOT d-headline--xxl)
          const match = classValue.match(/\bd-text-headline--(xxx?l)\b/);
          if (match && SIZE_MAP[match[1]]) {
            const oldClass = `d-text-headline--${match[1]}`;
            const newClass = `d-text-headline--${SIZE_MAP[match[1]]}`;
            context.report({
              node,
              messageId: 'deprecatedClass',
              data: { oldClass, newClass },
              fix(fixer) {
                const newValue = classValue.replace(oldClass, newClass);
                return fixer.replaceText(node.value, `"${newValue}"`);
              },
            });
          }
        }
      },
    });
  },
};
