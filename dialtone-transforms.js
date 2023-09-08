/**
 * custom transforms specific to dialtone-tokens. All of these will be
 * prefixed with dt/ for easy identification. Most of these are for mobile
 * because sd-transforms handles the transforms for CSS.
 */

import Color from 'tinycolor2';

const SIZE_IDENTIFIERS = ['fontSizes', 'sizing', 'borderWidth', 'borderRadius', 'blur', 'spread', 'x', 'y'];
const SPACING_IDENTIFIERS = ['spacing'];
const FONT_FAMILY_IDENTIFIERS = ['fontFamilies', 'fontFamily', 'typography'];
const FONT_SIZE_IDENTIFIERS = ['fontSizes', 'fontSize'];
const WEIGHT_IDENTIFIERS = ['fontWeights', 'fontWeight'];
const LINE_HEIGHT_IDENTIFIERS = ['lineHeights', 'lineHeight'];

const FALLBACK_FONTS = ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'];
const FALLBACK_FONTS_MONO = ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace'];

const ANDROID_WEIGHTS = {
  300: 'Light',
  400: 'Normal',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
}

const pxToRemTransformer = (token, options) => {
  if (token.value.toString().endsWith('%')) { return token.value };
  const baseFont = (options && options.basePxFontSize) || 16;
  const floatVal = parseFloat(token.value);

  if (isNaN(floatVal)) {
    throwSizeError(token.name, token.value, 'rem');
  }

  if (floatVal === 0) {
    return '0';
  }

  return `${floatVal / baseFont}rem`;
}

function throwSizeError(name, value, unitType) {
  throw `Invalid Number: '${name}: ${value}' is not a valid number, cannot transform to '${unitType}' \n`;
}

export function registerDialtoneTransforms(styleDictionary) {

  styleDictionary.registerTransform({
    name: 'dt/size/pxToRem',
    type: 'value',
    matcher: function(token) {
      return SIZE_IDENTIFIERS.includes(token.type)
    },
    transformer: pxToRemTransformer,
  });

  styleDictionary.registerTransform({
    name: 'dt/space/pxToRem',
    type: 'value',
    matcher: function(token) {
      return SPACING_IDENTIFIERS.includes(token.type);
    },
    transformer: pxToRemTransformer,
  });

  styleDictionary.registerTransform({
    name: 'dt/android/xml/color',
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

  styleDictionary.registerTransform({
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

  styleDictionary.registerTransform({
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

  styleDictionary.registerTransform({
    name: 'dt/android/compose/fonts/weight',
    type: 'value',
    matcher: function(token) {
      return WEIGHT_IDENTIFIERS.includes(token.type)
    },
    transformer: (token, options) => {
      return `FontWeight.${ANDROID_WEIGHTS[token.value]}`
    }
  });


  styleDictionary.registerTransform({
    name: 'dt/android/compose/size/pxToDp',
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
  styleDictionary.registerTransform({
    name: 'dt/android/compose/size/pxToSp',
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


  styleDictionary.registerTransform({
    name: 'dt/android/compose/lineHeight/percentToDecimal',
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
  styleDictionary.registerTransform({
    name: 'dt/android/compose/opacity/percentToFloat',
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

  styleDictionary.registerTransform({
    name: 'dt/stringify',
    type: 'value',
    matcher: function(token) {
      return ['type', 'textCase'].includes(token.type)
    },
    transformer: (token, options) => {
      return `"${token.value}"`;
    }
  });

  styleDictionary.registerTransform({
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

  styleDictionary.registerTransform({
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

  styleDictionary.registerTransform({
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

  styleDictionary.registerTransform({
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

  styleDictionary.registerTransform({
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

  styleDictionary.registerTransform({
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

  styleDictionary.registerTransform({
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
}
