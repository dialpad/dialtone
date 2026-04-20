/**
 * @fileoverview Detects usage of legacy border-radius utility classes (d-bar6, d-btr8, d-bbr-pill,
 * etc.) and autofixes them to the new token-stop-indexed logical names (d-bar-350, d-bbsr-400,
 * d-bber-pill).
 */
'use strict';

// MUST STAY IN SYNC with:
// - RADIUS_STOPS in dialtone-css/postcss/constants.cjs
// - RADIUS_MAP / RADIUS_PAIR_PREFIX_MAP in dialtone-css/.../migration_helper/configs/utility-class-to-token-stops.mjs

const RADIUS_STOP_MAP = {
  0: '0', 1: '100', 2: '200', 4: '300', 6: '350',
  8: '400', 12: '450', 16: '500', 24: '550', 32: '600',
};

const PAIR_PREFIX_MAP = {
  btr: 'bbsr', // top    → block-start pair
  bbr: 'bber', // bottom → block-end pair
  blr: 'bisr', // left   → inline-start pair
  brr: 'bier', // right  → inline-end pair
};

// Ordered by descending string length so regex alternation matches longest first
// (.d-bar32 resolves as `32`, not `3`).
const NUMERIC_SUFFIXES = Object.keys(RADIUS_STOP_MAP).sort((a, b) => b.length - a.length || Number(b) - Number(a)).join('|');
const PAIR_PREFIXES = Object.keys(PAIR_PREFIX_MAP).join('|');

const ALL_CORNERS_NUMERIC = new RegExp(`\\bd-bar(${NUMERIC_SUFFIXES})\\b`, 'g');
const PAIR_NUMERIC        = new RegExp(`\\bd-(${PAIR_PREFIXES})(${NUMERIC_SUFFIXES})\\b`, 'g');
const PAIR_KEYWORD        = new RegExp(`\\bd-(${PAIR_PREFIXES})-(pill|circle)\\b`, 'g');

// Non-global detection pattern for fast early-exit.
const DETECT = new RegExp([ALL_CORNERS_NUMERIC, PAIR_NUMERIC, PAIR_KEYWORD].map(r => r.source).join('|'));

function rewriteClassString (input) {
  return input
    .replace(ALL_CORNERS_NUMERIC, (_, px) => `d-bar-${RADIUS_STOP_MAP[px]}`)
    .replace(PAIR_NUMERIC, (_, legacyPrefix, px) => `d-${PAIR_PREFIX_MAP[legacyPrefix]}-${RADIUS_STOP_MAP[px]}`)
    .replace(PAIR_KEYWORD, (_, legacyPrefix, keyword) => `d-${PAIR_PREFIX_MAP[legacyPrefix]}-${keyword}`);
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Legacy border-radius utility classes (d-bar6, d-btr8, d-bbr-pill) are deprecated. Use token-stop-indexed logical names (d-bar-350, d-bbsr-400, d-bber-pill).',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-radius-utility-classes.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecatedRadiusClass: 'Legacy border-radius utility classes are deprecated. Use token-stop-indexed logical names instead (e.g. d-bar6 → d-bar-350, d-btr6 → d-bbsr-350, d-btr-pill → d-bbsr-pill).',
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (node) {
        if (node.key.name !== 'class') return;
        const classes = node.value?.value;
        if (!classes || !DETECT.test(classes)) return;

        context.report({
          node,
          messageId: 'deprecatedRadiusClass',
          fix (fixer) {
            const rewritten = rewriteClassString(classes);
            if (rewritten === classes) return null;
            // Preserve the attribute's quoting style (single, double, or unquoted).
            const firstChar = sourceCode.getText(node.value)[0];
            const quote = firstChar === '"' || firstChar === '\'' ? firstChar : '';
            return fixer.replaceText(node.value, `${quote}${rewritten}${quote}`);
          },
        });
      },
    });
  },
};
