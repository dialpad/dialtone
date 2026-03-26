/**
 * @fileoverview Detects usage of deprecated t-shirt size props (xs, sm, md, lg, xl) on Dialtone
 * components and suggests numeric equivalents (100, 200, 300, 400, 500).
 * @author Dialtone Team
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const SIZE_MAP = {
  xs: '100',
  sm: '200',
  md: '300',
  lg: '400',
  xl: '500',
  '2xl': '600',
  '3xl': '700',
};

// Props that accept the component size scale
const SIZE_PROPS = ['size', 'label-size', 'labelSize'];

// Speed prop on motion-text also uses the same scale
const SPEED_PROPS = ['speed'];

// Only flag on Dialtone components (dt-* or Dt*)
function isDialtoneComponent (node) {
  const parent = node.parent;
  if (!parent || parent.type !== 'VStartTag') return false;
  const element = parent.parent;
  if (!element || element.type !== 'VElement') return false;
  const name = element.rawName || element.name || '';
  return name.startsWith('dt-') || name.startsWith('Dt');
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'T-shirt sizes (xs, sm, md, lg, xl) are deprecated. Use numeric scale (100, 200, 300, 400, 500) instead.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-tshirt-sizes.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecatedSize: 'Size "{{oldSize}}" is deprecated. Use :{{prop}}="{{newSize}}" instead.',
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (node) {
        if (!isDialtoneComponent(node)) return;

        // Get the prop name — handle both `size` and `label-size` forms
        const propName = node.key.name;
        const isDirective = node.directive;

        // Skip v-bind expressions like :size="computedSize" — we only flag static values
        if (isDirective) return;

        // Check size/label-size props
        if (SIZE_PROPS.includes(propName) && node.value && node.value.value) {
          const sizeValue = node.value.value;
          if (SIZE_MAP[sizeValue]) {
            context.report({
              node,
              messageId: 'deprecatedSize',
              data: {
                oldSize: sizeValue,
                newSize: SIZE_MAP[sizeValue],
                prop: propName,
              },
              fix (fixer) {
                // Replace `size="sm"` with `:size="200"`
                const newAttr = `:${propName}="${SIZE_MAP[sizeValue]}"`;
                return fixer.replaceTextRange(
                  [node.range[0], node.range[1]],
                  newAttr,
                );
              },
            });
          }
        }

        // Check speed prop on motion-text
        if (SPEED_PROPS.includes(propName) && node.value && node.value.value) {
          const speedValue = node.value.value;
          if (SIZE_MAP[speedValue]) {
            context.report({
              node,
              messageId: 'deprecatedSize',
              data: {
                oldSize: speedValue,
                newSize: SIZE_MAP[speedValue],
                prop: propName,
              },
              fix (fixer) {
                const newAttr = `:${propName}="${SIZE_MAP[speedValue]}"`;
                return fixer.replaceTextRange(
                  [node.range[0], node.range[1]],
                  newAttr,
                );
              },
            });
          }
        }
      },
    });
  },
};
