#!/usr/bin/env node

var Color = require('tinycolor2');

const fs = require('fs');

const StyleDictionary = require('style-dictionary').extend('config.js');

// Identifiers
const SPACING_IDENTIFIERS = ['spacing'];
const SIZE_IDENTIFIERS = ['fontSizes', 'fontSize', 'sizing', 'borderWidth', 'borderRadius', 'blur', 'spread', 'x', 'y'];
const LINE_HEIGHT_IDENTIFIERS = ['lineHeights', 'lineHeight'];
const FONT_SIZE_IDENTIFIERS = ['fontSizes', 'fontSize'];
const WEIGHT_IDENTIFIERS = ['fontWeights', 'fontWeight'];
const FONT_FAMILY_IDENTIFIERS = ['fontFamilies', 'fontFamily']

// Values
const FALLBACK_FONTS = ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'];
const FALLBACK_FONTS_MONO = ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace'];
const BASE_FONT_SIZE = require('./base.json').base.font.size.root.value;
const WEIGHT = {
  'Light': 300,
  'Regular': 400,
  'Medium': 500,
  'Semibold': 600,
  'Bold': 700,
}

function getBasePxFontSize(options) {
  return (options && options.basePxFontSize) || Number.parseFloat(BASE_FONT_SIZE);
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
      return `"${token.value}, ${FALLBACK_FONTS.join(', ')}"`
    }
    else if (token.name === 'mono') {
      return `"${token.value}, ${FALLBACK_FONTS_MONO.join(', ')}"`
    }
    return token.value;
  }
});

StyleDictionary.registerTransform({
  name: 'dt/android/compose/fonts/transformToStack',
  type: 'value',
  matcher: function(token) {
    return FONT_FAMILY_IDENTIFIERS.includes(token.type)
  },
  transformer: (token, options) => {
    return `arrayOf(${token.value.split(',').map(s => `"${s.replaceAll('"', '').trim()}"`).join(', ')})`;
  }
});

StyleDictionary.registerTransform({
  name: 'dt/android/color',
  type: 'value',
  matcher: function(token) {
    return ['color'].includes(token.type)
  },
    transformer: function (token) {
      if (token.value === 'transparent') { return '#00ffffff'}
      var str = Color(token.value).toHex8();
      return '#' + str.slice(6) + str.slice(0,6);
    }
});

StyleDictionary.registerTransform({
  name: 'dt/android/compose/color',
  type: 'value',
  matcher: function(token) {
    return ['color'].includes(token.type)
  },
  transformer: (token, options) => {
    const hex8 = Color(token.value).toHex8();
    return `Color(0x${hex8.slice(6) + hex8.slice(0, 6)})`;
  }
});

StyleDictionary.registerTransform({
  name: 'dt/ios/color',
  type: 'value',
  matcher: function(token) {
    return ['color'].includes(token.type)
  },
  transformer: (token, options) => {
    const { r, g, b, a } = Color(token.value).toRgb();
    const rFixed = (r / 255.0).toFixed(3);
    const gFixed = (g / 255.0).toFixed(3);
    const bFixed = (b / 255.0).toFixed(3);
    return `UIColor(red: ${rFixed}, green: ${gFixed}, blue: ${bFixed}, alpha: ${a})`;
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

StyleDictionary.registerTransform({
  name: 'dt/android/size/pxToDp',
  type: 'value',
  matcher: function(token) {
    return SIZE_IDENTIFIERS.includes(token.type)
  },
  transformer: (token, options) => {
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'dp');
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal}.dp`;
  }
});

//Sp is for font sizes only
StyleDictionary.registerTransform({
  name: 'dt/android/size/pxToSp',
  type: 'value',
  matcher: function(token) {
    return [...SPACING_IDENTIFIERS, ...FONT_SIZE_IDENTIFIERS].includes(token.type)
  },
  transformer: (token, options) => {
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'sp');
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal}.sp`;
  }
});

StyleDictionary.registerTransform({
  name: 'dt/ios/size/pxToCGFloat',
  type: 'value',
  matcher: function(token) {
    return [...SPACING_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type)
  },
  transformer: (token, options) => {
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'dp');
    }

    return `CGFloat(${(floatVal).toFixed(2)})`;
  }
});

StyleDictionary.registerTransform({
  name: 'dt/lineHeight/percentToDecimal',
  type: 'value',
  matcher: function(token) {
    return LINE_HEIGHT_IDENTIFIERS.includes(token.type)
  },
  transformer: (token, options) => {
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, '%');
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal / 100}`;
  }
});

StyleDictionary.registerTransform({
  name: 'dt/ios/lineHeight/percentToDecimal',
  type: 'value',
  matcher: function(token) {
    return ['opacity', ...LINE_HEIGHT_IDENTIFIERS].includes(token.type)
  },
  transformer: (token, options) => {
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, '%');
    }

    return `CGFloat(${(floatVal).toFixed(2)})`;
  }
});

StyleDictionary.registerTransform({
  name: 'dt/stringify',
  type: 'value',
  matcher: function(token) {
    return [...WEIGHT_IDENTIFIERS, 'type', 'textCase'].includes(token.type)
  },
  transformer: (token, options) => {
    return `"${token.value}"`;
  }
});

// Stores json object for documentation
const docTokens = {};

// Recurse through style dictionary object and pick out
// bottom level token values.
function buildDocs(platformName, currentObj) {
  if (currentObj === null || typeof currentObj !== 'object') {
    return null;
  }

  const tokenName = currentObj.name;
  const tokenValue = currentObj.value;

  if (tokenValue) {
    const tokenPath = currentObj.path.join('/');
    docTokens[tokenPath] = {
      ...docTokens[tokenPath],
      [platformName]: {
        name: tokenName,
        value: tokenValue,
      }
    }
    return null;
  }

  for (const key in currentObj) {
    if (!currentObj.hasOwnProperty(key))
      continue;
    buildDocs(platformName, currentObj[key]);
  }

}

StyleDictionary.registerAction({
  name: 'buildDocJson',
  do: function(dictionary, config) {
    const platformName = config.files[0].format.name;
    buildDocs(platformName, dictionary.properties);
  },
});

StyleDictionary.buildAllPlatforms();

const DOC_OUTPUT_PATH = './dist/doc.json';

fs.writeFile(DOC_OUTPUT_PATH, JSON.stringify(docTokens, null, 2), err => {
  if (err) {
    throw err
  }
  console.info(`Token documentation data written to ${DOC_OUTPUT_PATH}`)
})
