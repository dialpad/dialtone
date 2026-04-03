'use strict';

const noBaseColorTokens = require('./rules/no-base-color-tokens');
const noDeprecatedSizeTokens = require('./rules/no-deprecated-size-tokens');
const noDeprecatedSpaceTokens = require('./rules/no-deprecated-space-tokens');
const noMixins = require('./rules/no-mixins');
const recommendFontStyleTokens = require('./rules/recommend-font-style-tokens');
const useDialtoneTokens = require('./rules/use-dialtone-tokens');
const useLogical = require('stylelint-use-logical');

module.exports = [
  noBaseColorTokens,
  noDeprecatedSizeTokens,
  noDeprecatedSpaceTokens,
  noMixins,
  recommendFontStyleTokens,
  useDialtoneTokens,
  useLogical,
];
