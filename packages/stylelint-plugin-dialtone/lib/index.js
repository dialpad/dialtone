"use strict";

const noMixins = require("./rules/no-mixins");
const recommendFontStyleTokens = require("./rules/recommend-font-style-tokens");
const useDialtoneTokens = require("./rules/use-dialtone-tokens");
const noDeprecatedSpaceTokens = require("./rules/no-deprecated-space-tokens");

module.exports = [noMixins, recommendFontStyleTokens, useDialtoneTokens, noDeprecatedSpaceTokens];
