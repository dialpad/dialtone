#!/usr/bin/env node

const StyleDictionary = require('style-dictionary').extend('config.js');

// Identifiers
const SIZE_IDENTIFIERS = ['fontSizes', 'fontSize', 'sizing', 'borderWidth', 'borderRadius', 'blur', 'spread', 'x', 'y'];
const WEIGHT_IDENTIFIERS = ['fontWeights', 'fontWeight'];
const FONT_FAMILY_IDENTIFIERS = ['fontFamilies']

// Values
const FALLBACK_FONTS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
const FALLBACK_FONTS_MONO = "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace";
const BASE_FONT_SIZE = 10.0;
const WEIGHT = {
  'Light': 300,
  'Regular': 400,
  'Medium': 500,
  'Semibold': 600,
  'Bold': 700,
}

function getBasePxFontSize(options) {
  return (options && options.basePxFontSize) || BASE_FONT_SIZE;
}

function throwSizeError(name, value, unitType) {
  throw `Invalid Number: '${name}: ${value}' is not a valid number, cannot transform to '${unitType}' \n`;
}

StyleDictionary.registerTransform({
  name: 'dt/fonts/weight',
  type: 'value',
  matcher: function(token) {
    return WEIGHT_IDENTIFIERS.includes(token.type)
  },
  transformer: (token, options) => {
    return WEIGHT[token.value] ?? token.value
  }
});

StyleDictionary.registerTransform({
  name: 'dt/fonts/transformToStack',
  type: 'value',
  matcher: function(token) {
    return FONT_FAMILY_IDENTIFIERS.includes(token.type)
  },
  transformer: (token, options) => {
    if (token.name === 'body' || token.name === 'expressive') {
      return `${token.value}, ${FALLBACK_FONTS}`
    }
    else if (token.name === 'mono') {
      return `${token.value}, ${FALLBACK_FONTS_MONO}`
    }
    return token.value;
  }
});

StyleDictionary.registerTransform({
  name: 'dt/size/pxToRem',
  type: 'value',
  matcher: function(token) {
    return SIZE_IDENTIFIERS.includes(token.type)
  },
  transformer: (token, options) => {
    const baseFont = getBasePxFontSize(options);
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'rem');
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal / baseFont}rem`;
  }
});

StyleDictionary.buildAllPlatforms();
