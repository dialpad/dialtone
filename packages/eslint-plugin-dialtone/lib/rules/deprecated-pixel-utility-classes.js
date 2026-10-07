/**
 * @fileoverview Detects usage of pixel-based utility classes (d-h16, d-p8, d-m8, etc.)
 * which should be replaced with token-stop-based equivalents (d-h-25, d-p-100, d-m-100).
 * Autofixes via `lint-staged` — mirrors the `utility-class-to-token-stops` migration helper.
 * @author Joshua Hynes
 */
'use strict';

const { START, END, buildDetectRegex, createClassAttributeRule } = require('../util/class-attribute-rule');

const { SIZING_MAP, SPACING_MAP, NEGATIVE_SPACING_MAP, SPACING_LAYOUT_MAP } = require('../generated/migration-guidance.json');
const keys = map => Object.keys(map).sort((a, b) => b.length - a.length || Number(b) - Number(a)).join('|');
const SIZING_PIXELS = keys(SIZING_MAP);
const SPACING_PIXELS = keys({ ...SPACING_MAP, ...SPACING_LAYOUT_MAP });
const NEGATIVE_PIXELS = keys(NEGATIVE_SPACING_MAP);

// Per-category regexes with capture groups. Negative variants precede positive so `d-mtn8`
// matches the negative pattern (rule order is load-order in `rewriteClassString`).
const SIZING_RE          = new RegExp(`${START}d-(h|w|hmn|hmx|wmn|wmx)(${SIZING_PIXELS})${END}`, 'g');
const NEGATIVE_MARGIN_RE = new RegExp(`${START}d-m(t|r|b|l|x|y)?n(${NEGATIVE_PIXELS})${END}`, 'g');
const MARGIN_RE          = new RegExp(`${START}d-m(t|r|b|l|x|y)?(${SPACING_PIXELS})${END}`, 'g');
const PADDING_RE         = new RegExp(`${START}d-p(t|r|b|l|x|y)?(${SPACING_PIXELS})${END}`, 'g');
const GAP_RE             = new RegExp(`${START}d-(g|rg|cg)(${SPACING_PIXELS})${END}`, 'g');
const NEGATIVE_POS_RE    = new RegExp(`${START}d-(t|r|b|l|x|y|all)n(${NEGATIVE_PIXELS})${END}`, 'g');
const POSITION_RE        = new RegExp(`${START}d-(t|r|b|l|x|y|all)(${SPACING_PIXELS})${END}`, 'g');

const DETECT = buildDetectRegex([SIZING_RE, NEGATIVE_MARGIN_RE, MARGIN_RE, PADDING_RE, GAP_RE, NEGATIVE_POS_RE, POSITION_RE]);

/**
 * Rewrite a class attribute string from legacy pixel-suffix to token-stop naming.
 * Returns the input unchanged when no rewrites apply.
 */
function rewriteClassString (input) {
  return input
    .replace(NEGATIVE_MARGIN_RE, (m, dir, px) => NEGATIVE_SPACING_MAP[px] ? `d-m${dir ?? ''}-n${NEGATIVE_SPACING_MAP[px]}` : m)
    .replace(NEGATIVE_POS_RE,    (m, dir, px) => NEGATIVE_SPACING_MAP[px] ? `d-${dir}-n${NEGATIVE_SPACING_MAP[px]}` : m)
    .replace(SIZING_RE,          (m, dir, px) => SIZING_MAP[px] ? `d-${dir}-${SIZING_MAP[px]}` : m)
    .replace(MARGIN_RE,          (m, dir, px) => { const stop = SPACING_MAP[px]; return stop ? `d-m${dir ?? ''}-${stop}` : m; })
    .replace(PADDING_RE,         (m, dir, px) => { const stop = SPACING_MAP[px]; return stop ? `d-p${dir ?? ''}-${stop}` : m; })
    .replace(GAP_RE,             (m, dir, px) => SPACING_MAP[px] ? `d-${dir}-${SPACING_MAP[px]}` : m)
    .replace(POSITION_RE,        (m, dir, px) => { const stop = SPACING_MAP[px]; return stop ? `d-${dir}-${stop}` : m; });
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detects deprecated pixel-named utilities that have token-stop equivalents.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-pixel-utility-classes.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecatedPixelClass: 'Pixel-based utility classes are deprecated. Use token-stop-based equivalents instead (e.g. d-h16 → d-h-25, d-p8 → d-p-100, d-w1 → d-w-1px). Large spacing values without equivalents require manual review.',
    },
  },

  create: createClassAttributeRule({
    detect: DETECT,
    rewrite: rewriteClassString,
    messageId: 'deprecatedPixelClass',
  }),
};
