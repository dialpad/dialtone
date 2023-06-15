#!/usr/bin/env node

var Color = require('tinycolor2');

const fs = require('fs');

const StyleDictionary = require('style-dictionary');

const getStyleDictionaryConfig = require('./config.js').getStyleDictionaryConfig;

// Identifiers
const SPACING_IDENTIFIERS = ['spacing'];
const SIZE_IDENTIFIERS = ['fontSizes', 'fontSize', 'sizing', 'borderWidth', 'borderRadius', 'blur', 'spread', 'x', 'y'];
const LINE_HEIGHT_IDENTIFIERS = ['lineHeights', 'lineHeight'];
const FONT_SIZE_IDENTIFIERS = ['fontSizes', 'fontSize'];
const WEIGHT_IDENTIFIERS = ['fontWeights', 'fontWeight'];
const FONT_FAMILY_IDENTIFIERS = ['fontFamilies', 'fontFamily', 'typography'];

const THEMES = ['light', 'dark'];
exports.THEMES = THEMES;

// Values
const FALLBACK_FONTS = ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'];
const FALLBACK_FONTS_MONO = ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace'];
const BASE_FONT_SIZE = require('./base.json').base.font.size.root.value;

const ANDROID_WEIGHTS = {
  300: 'Light',
  400: 'Normal',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
}

function getBasePxFontSize(options) {
  return (options && options.basePxFontSize) || Number.parseFloat(BASE_FONT_SIZE);
}

function throwSizeError(name, value, unitType) {
  throw `Invalid Number: '${name}: ${value}' is not a valid number, cannot transform to '${unitType}' \n`;
}

StyleDictionary.registerTransform({
  name: 'dt/android/fonts/weight',
  type: 'value',
  matcher: function(token) {
    return WEIGHT_IDENTIFIERS.includes(token.type)
  },
  transformer: (token, options) => {
    return `FontWeight.${ANDROID_WEIGHTS[token.value]}`
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
      return `${token.value}, ${FALLBACK_FONTS.join(', ')}`
    }
    else if (token.name === 'mono') {
      return `${token.value}, ${FALLBACK_FONTS_MONO.join(', ')}`
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
    if (token.name === 'mono' || token.path.includes('code')) {
      return 'FontFamily.Monospace';
    }
    return 'FontFamily.Default';
  }
});

StyleDictionary.registerTransform({
  name: 'dt/ios/fonts/transformToStack',
  type: 'value',
  matcher: function(token) {
    return FONT_FAMILY_IDENTIFIERS.includes(token.type)
  },
  transformer: (token, options) => {
    if (token.name === 'mono' || token.path.includes('code')) {
      return 'UIFont.monospacedSystemFont(ofSize: 15, weight: .regular)';
    }
    return 'UIFont.systemFont(ofSize: 15)';
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
    if (token.value.toString().endsWith('%')) { return token.value };
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
  name: 'dt/space/pxToRem',
  type: 'value',
  matcher: function(token) {
    return SPACING_IDENTIFIERS.includes(token.type) && !token.name.includes('percent');
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
    return [...SPACING_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type)
  },
  transformer: (token, options) => {
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'dp');
    }

    return `${floatVal}.dp`;
  }
});

//Sp is for font sizes only
StyleDictionary.registerTransform({
  name: 'dt/android/size/pxToSp',
  type: 'value',
  matcher: function(token) {
    return [...FONT_SIZE_IDENTIFIERS].includes(token.type)
  },
  transformer: (token, options) => {
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'sp');
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
  name: 'dt/android/lineHeight/percentToDecimal',
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

    return `${floatVal / 100}.em`;
  }
});

//Sp is for font sizes only
StyleDictionary.registerTransform({
  name: 'dt/android/opacity/percentToFloat',
  type: 'value',
  matcher: function(token) {
    return ['opacity'].includes(token.type)
  },
  transformer: (token, options) => {
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, '%');
    }

    return `${floatVal}F`;
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
    return ['type', 'textCase'].includes(token.type)
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
  const tokenDescription = currentObj?.description

  if (tokenValue) {
    const tokenPath = currentObj.path.join('/');
    docTokens[tokenPath] = {
      ...docTokens[tokenPath],
      [platformName]: {
        name: formatTokenName(platformName, tokenName),
        value: tokenValue,
        description: tokenDescription,
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

function formatTokenName(platformName, tokenName) {
  if (platformName === 'css/variables') {
    return `var(--${tokenName})`;
  }
  return tokenName;
}

StyleDictionary.registerAction({
  name: 'buildDocJson',
  do: function(dictionary, config) {
    const platformName = config.files[0].format.name;
    buildDocs(platformName, dictionary.properties);
  },
});


THEMES.forEach(theme => {
  const sd = StyleDictionary.extend(getStyleDictionaryConfig(theme));
  sd.buildAllPlatforms();
});

function insert(str, index, value) {
  return str.substring(0, index) + value + str.substring(index);
}

function addImportIntoKotlinFile(path, importText) {
  const content = fs.readFileSync(path).toString();
  // find first import statement in file
  const writePos = content.indexOf('import androidx') - 1;
  // insert new import before it
  const newContent = insert(content, writePos, importText);

  fs.writeFileSync(path, newContent);
}

THEMES.forEach(theme => {
  const KOTLIN_FILE_PATH = `./dist/android/java/tokens-${theme}.kt`;
  addImportIntoKotlinFile(KOTLIN_FILE_PATH, 'import androidx.compose.ui.text.font.FontWeight');
  addImportIntoKotlinFile(KOTLIN_FILE_PATH, 'import androidx.compose.ui.text.font.FontFamily');
});


const DOC_OUTPUT_PATH = './dist/doc.json';

fs.writeFile(DOC_OUTPUT_PATH, JSON.stringify(docTokens, null, 2), err => {
  if (err) {
    throw err
  }
  console.info(`Token documentation data written to ${DOC_OUTPUT_PATH}`)
});
