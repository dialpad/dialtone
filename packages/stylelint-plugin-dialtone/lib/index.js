'use strict';

const noBaseColorTokens = require('./rules/no-base-color-tokens');
const noDeprecatedSpaceTokens = require('./rules/no-deprecated-space-tokens');
const noMixins = require('./rules/no-mixins');
const recommendFontStyleTokens = require('./rules/recommend-font-style-tokens');
const useDialtoneTokens = require('./rules/use-dialtone-tokens');

module.exports = [
  noBaseColorTokens,
  noDeprecatedSpaceTokens,
  noMixins,
  recommendFontStyleTokens,
  useDialtoneTokens,
];
