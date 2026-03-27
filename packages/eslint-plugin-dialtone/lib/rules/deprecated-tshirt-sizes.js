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

const TSHIRT_VALUES = new Set(Object.keys(SIZE_MAP));

// Props that accept the component size scale
const SIZE_PROPS = ['size', 'label-size', 'labelSize'];

// Speed prop on motion-text also uses the same scale
const SPEED_PROPS = ['speed'];

// All size-related prop names
const ALL_SIZE_PROPS = [...SIZE_PROPS, ...SPEED_PROPS];

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
      deprecatedSizeInBinding: 'T-shirt size "{{oldSize}}" in dynamic binding is deprecated. Use numeric {{newSize}} instead.',
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (node) {
        if (!isDialtoneComponent(node)) return;

        // Get the prop name and check if it's a size-related prop
        const isDirective = node.directive;
        const propName = isDirective
          ? (node.key.argument && node.key.argument.name)
          : node.key.name;

        if (!propName || !ALL_SIZE_PROPS.includes(propName)) return;

        // --- Static attributes: size="sm" → auto-fixable ---
        if (!isDirective && node.value && node.value.value) {
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

          (function findLiterals (n) {
            if (!n) return;
            if (n.type === 'Literal' && typeof n.value === 'string' && TSHIRT_VALUES.has(n.value)) {
              literals.push(n);
            }
            // Walk child nodes
            for (const key of Object.keys(n)) {
              if (key === 'parent') continue;
              const child = n[key];
              if (child && typeof child === 'object') {
                if (Array.isArray(child)) {
                  child.forEach(c => { if (c && c.type) findLiterals(c); });
                } else if (child.type) {
                  findLiterals(child);
                }
              }
            }
          })(expression);

          for (const literal of literals) {
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
