/**
 * @fileoverview Detects usage of deprecated t-shirt size props (xs, sm, md, lg, xl) on Dialtone
 * components and suggests current equivalents.
 * @author Dialtone Team
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const {
  findStaticAttribute,
  getAttributeName,
  getElementName,
  getStaticAttributeValue,
  hasAttribute,
  hasDirectiveAttribute,
  isDtTextComponent,
  removeAttributeFix,
} = require('../util/vue-attribute-helpers');

const SIZE_MAP = {
  xs: '100',
  sm: '200',
  md: '300',
  lg: '400',
  xl: '500',
  '2xl': '600',
  '3xl': '700',
};

const TSHIRT_VALUES = new Set(Object.keys(SIZE_MAP));

const DT_TEXT_KIND_SIZE_MAP = {
  headline: new Set(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  body: new Set(['xs', 'sm', 'md', 'lg']),
  label: new Set(['xs', 'sm', 'md', 'lg']),
  code: new Set(['xs', 'sm', 'md', 'lg']),
};

// Props that accept the component size scale
const SIZE_PROPS = ['size', 'label-size', 'labelSize'];

// Speed prop on motion-text also uses the same scale
const SPEED_PROPS = ['speed'];

// All size-related prop names
const ALL_SIZE_PROPS = [...SIZE_PROPS, ...SPEED_PROPS];

// Only flag on Dialtone components (dt-* or Dt*)
function isDialtoneComponent(node) {
  const name = getElementName(node);
  return name.startsWith('dt-') || name.startsWith('Dt');
}

function getDtTextVariant(node, sizeValue) {
  const variantAttribute = findStaticAttribute(node, 'variant');
  if (variantAttribute) return null;

  if (
    hasDirectiveAttribute(node, 'variant') ||
    hasDirectiveAttribute(node, 'kind')
  ) {
    return null;
  }

  const kindAttribute = findStaticAttribute(node, 'kind');
  const kindValue = getStaticAttributeValue(kindAttribute);
  if (!kindValue || !DT_TEXT_KIND_SIZE_MAP[kindValue]) return null;
  if (!DT_TEXT_KIND_SIZE_MAP[kindValue].has(sizeValue)) return null;

  return {
    kindAttribute,
    variant: `${kindValue}-${sizeValue}`,
  };
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'T-shirt sizes (xs, sm, md, lg, xl) are deprecated. Use the current numeric or DtText variant API instead.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-tshirt-sizes.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecatedSize:
        'Size "{{oldSize}}" is deprecated. Use :{{prop}}="{{newSize}}" instead.',
      deprecatedSizeInBinding:
        'T-shirt size "{{oldSize}}" in dynamic binding is deprecated. Use numeric {{newSize}} instead.',
      deprecatedDtTextSize:
        'DtText size "{{oldSize}}" is deprecated for text composition. Use variant="{{variant}}" instead.',
      deprecatedDtTextSizeManual:
        'DtText size "{{oldSize}}" is deprecated. Use variant for text composition, or a numeric size token for raw font-size control.',
      deprecatedDtTextSizeInBinding:
        'T-shirt size "{{oldSize}}" in DtText size binding is deprecated. Use variant for text composition, or numeric {{newSize}} only for raw font-size control.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute(node) {
        if (!isDialtoneComponent(node)) return;

        // Get the prop name and check if it's a size-related prop
        const isDirective = node.directive;
        const propName = getAttributeName(node);

        if (!propName || !ALL_SIZE_PROPS.includes(propName)) return;
        const isDtText = isDtTextComponent(node);

        // --- Static attributes: size="sm" → auto-fixable ---
        if (!isDirective && node.value && node.value.value) {
          const sizeValue = node.value.value;
          if (SIZE_MAP[sizeValue]) {
            if (isDtText && propName === 'size') {
              const dtTextVariant = getDtTextVariant(node, sizeValue);

              if (dtTextVariant) {
                context.report({
                  node,
                  messageId: 'deprecatedDtTextSize',
                  data: {
                    oldSize: sizeValue,
                    variant: dtTextVariant.variant,
                  },
                  fix(fixer) {
                    const fixes = [
                      fixer.replaceTextRange(
                        [node.range[0], node.range[1]],
                        `variant="${dtTextVariant.variant}"`,
                      ),
                    ];
                    if (dtTextVariant.kindAttribute) {
                      fixes.push(
                        removeAttributeFix(
                          fixer,
                          sourceCode,
                          dtTextVariant.kindAttribute,
                        ),
                      );
                    }
                    return fixes;
                  },
                });
                return;
              }

              if (
                hasAttribute(node, 'kind') &&
                !hasAttribute(node, 'variant')
              ) {
                context.report({
                  node,
                  messageId: 'deprecatedDtTextSizeManual',
                  data: {
                    oldSize: sizeValue,
                  },
                });
                return;
              }
            }

            context.report({
              node,
              messageId: 'deprecatedSize',
              data: {
                oldSize: sizeValue,
                newSize: SIZE_MAP[sizeValue],
                prop: propName,
              },
              fix(fixer) {
                const newAttr = `:${propName}="${SIZE_MAP[sizeValue]}"`;
                return fixer.replaceTextRange(
                  [node.range[0], node.range[1]],
                  newAttr,
                );
              },
            });
          }
          return;
        }

        // --- Dynamic bindings: :size="'sm'" or :size="x ? 'sm' : 'md'" ---
        if (isDirective && node.value && node.value.expression) {
          // Walk the expression tree for string literals with t-shirt values
          const expression = node.value.expression;
          const literals = [];

          (function findLiterals(n) {
            if (!n) return;
            if (
              n.type === 'Literal' &&
              typeof n.value === 'string' &&
              TSHIRT_VALUES.has(n.value)
            ) {
              literals.push(n);
            }
            // Walk child nodes
            for (const key of Object.keys(n)) {
              if (key === 'parent') continue;
              const child = n[key];
              if (child && typeof child === 'object') {
                if (Array.isArray(child)) {
                  child.forEach((c) => {
                    if (c && c.type) findLiterals(c);
                  });
                } else if (child.type) {
                  findLiterals(child);
                }
              }
            }
          })(expression);

          for (const literal of literals) {
            if (isDtText && propName === 'size') {
              context.report({
                node: literal,
                messageId: 'deprecatedDtTextSizeInBinding',
                data: {
                  oldSize: literal.value,
                  newSize: SIZE_MAP[literal.value],
                },
              });
              continue;
            }

            context.report({
              node: literal,
              messageId: 'deprecatedSizeInBinding',
              data: {
                oldSize: literal.value,
                newSize: SIZE_MAP[literal.value],
              },
            });
          }
        }
      },
    });
  },
};
