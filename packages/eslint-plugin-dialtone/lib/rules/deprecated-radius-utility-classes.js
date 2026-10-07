/**
 * @fileoverview Detects usage of legacy border-radius utility classes (d-bar6, d-btr8, d-bbr-pill,
 * etc.) and autofixes them to the new token-stop-indexed logical names (d-bar-350, d-bbsr-400,
 * d-bber-pill).
 */
'use strict';

const { START, END, buildDetectRegex, createClassAttributeRule } = require('../util/class-attribute-rule');

const { RADIUS_MAP: RADIUS_STOP_MAP, RADIUS_PAIR_PREFIX_MAP: PAIR_PREFIX_MAP } = require('../generated/migration-guidance.json');

// Ordered by descending string length so regex alternation matches longest first
// (.d-bar32 resolves as `32`, not `3`).
const NUMERIC_SUFFIXES = Object.keys(RADIUS_STOP_MAP).sort((a, b) => b.length - a.length || Number(b) - Number(a)).join('|');
const PAIR_PREFIXES = Object.keys(PAIR_PREFIX_MAP).join('|');

const ALL_CORNERS_NUMERIC = new RegExp(`${START}d-bar(${NUMERIC_SUFFIXES})${END}`, 'g');
const PAIR_NUMERIC        = new RegExp(`${START}d-(${PAIR_PREFIXES})(${NUMERIC_SUFFIXES})${END}`, 'g');
const PAIR_KEYWORD        = new RegExp(`${START}d-(${PAIR_PREFIXES})-(pill|circle)${END}`, 'g');

const DETECT = buildDetectRegex([ALL_CORNERS_NUMERIC, PAIR_NUMERIC, PAIR_KEYWORD]);

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
      description: 'Detects legacy border-radius utilities that have logical, token-stop names.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-radius-utility-classes.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecatedRadiusClass: 'Legacy border-radius utility classes are deprecated. Use token-stop-indexed logical names instead (e.g. d-bar6 → d-bar-350, d-btr6 → d-bbsr-350, d-btr-pill → d-bbsr-pill).',
    },
  },

  create: createClassAttributeRule({
    detect: DETECT,
    rewrite: rewriteClassString,
    messageId: 'deprecatedRadiusClass',
  }),
};
