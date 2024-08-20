"use strict";

const noMixins = require("./rules/no-mixins");
const recommendFontStyleTokens = require("./rules/recommend-font-style-tokens");

module.exports = [noMixins, recommendFontStyleTokens];
