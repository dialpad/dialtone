/**
 * @fileoverview Detects usage of pixel-based utility classes (d-h16, d-p8, d-m8, etc.)
 * which should be replaced with token-stop-based equivalents (d-h-25, d-p-100, d-m-100).
 * Autofixes via `lint-staged` — mirrors the `utility-class-to-token-stops` migration helper.
 * @author Joshua Hynes
 */
'use strict';

const { START, END, buildDetectRegex, createClassAttributeRule } = require('../util/class-attribute-rule');

// MUST STAY IN SYNC with:
// - LAYOUT_STOPS, MARGIN_SIZES_SPACING, MARGIN_SIZES_LAYOUT in dialtone-css/postcss/constants.cjs
// - SIZING_MAP, SPACING_MAP, NEGATIVE_SPACING_MAP, SPACING_LAYOUT_MAP in
//   dialtone-css/.../migration_helper/configs/utility-class-to-token-stops.mjs

// Ordered by descending string-length then descending value so regex alternation matches
// longest first (d-w1024 resolves `1024`, not `1`).
const SIZING_PIXELS = '1024|992|960|928|896|864|832|800|768|736|704|672|640|608|576|544|512|480|448|416|384|352|320|288|256|224|192|160|128|112|96|80|64|48|32|24|20|16|8|2|1';
const SPACING_PIXELS = '0|1|2|4|6|8|10|12|14|16|20|24|32|48|64|96|128';
const NEGATIVE_PIXELS = '1|2|4|6|8|10|12|14|16|20|24|32|48|64';

// Sizing autofix: scale-indexed layout stops + off-scale pixel-indexed exceptions (DLT-3330).
const SIZING_MAP = {
  1: '1px', 2: '2px', 8: '8px', 20: '20px', 24: '24px',
  16: '25', 32: '50', 48: '75', 64: '100', 80: '125', 96: '150',
  112: '175', 128: '200', 160: '250', 192: '300', 224: '350', 256: '400',
  288: '450', 320: '500', 352: '550', 384: '600', 416: '650', 448: '700',
  480: '750', 512: '800', 544: '850', 576: '900', 608: '950', 640: '1000',
  672: '1050', 704: '1100', 736: '1150', 768: '1200', 800: '1250',
  832: '1300', 864: '1350', 896: '1400', 928: '1450', 960: '1500',
  992: '1550', 1024: '1600',
};

const SPACING_MAP = {
  0: '0', 1: '1', 2: '25', 4: '50', 6: '75', 8: '100',
  10: '125', 12: '150', 14: '175', 16: '200', 20: '250', 24: '300',
  32: '400', 48: '600', 64: '800',
};

const NEGATIVE_SPACING_MAP = {
  1: '1', 2: '25', 4: '50', 6: '75', 8: '100',
  10: '125', 12: '150', 14: '175', 16: '200', 20: '250', 24: '300',
  32: '400', 48: '600', 64: '800',
};

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
      deprecatedPixelClass: 'Pixel-based utility classes are deprecated. Use token-stop-based equivalents instead (e.g. d-h16 → d-h-25, d-p8 → d-p-100, d-w1 → d-w-1px).',
    },
  },

  create: createClassAttributeRule({
    detect: DETECT,
    rewrite: rewriteClassString,
    messageId: 'deprecatedPixelClass',
  }),
};
