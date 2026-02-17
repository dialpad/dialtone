/**
 * custom transforms specific to dialtone-tokens. All of these will be
 * prefixed with dt/ for easy identification. Most of these are for mobile
 * because sd-transforms handles the transforms for CSS.
 */

import { colorsFilter, colorModifiersFilter, DeviceObjectFormat, deviceTransformColorModifiers, tokenColorToDeviceColor } from './transform-util.js';
import { parse, converter } from 'culori';

const SIZE_IDENTIFIERS = ['sizing', 'borderWidth', 'borderRadius', 'blur', 'spread', 'x', 'y', 'dimension'];
const SPACING_IDENTIFIERS = ['spacing'];
const FONT_FAMILY_IDENTIFIERS = ['fontFamily'];
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
};

const pxToRemTransformer = (token, options) => {
  if (token.value.toString().endsWith('%')) { return token.value; }
  const baseFont = (options && options.basePxFontSize) || 16;
  const floatVal = parseFloat(token.value);

  if (isNaN(floatVal)) {
    throwSizeError(token.path, token.value, 'rem');
  }

  if (floatVal === 0) {
    return '0rem';
  }

  return `${floatVal / baseFont}rem`;
};

function throwSizeError (name, value, unitType) {
  throw new Error(`Invalid Number: '${name}: ${value}' is not a valid number, cannot transform to '${unitType}' \n`);
}

export function registerDialtoneTransforms (styleDictionary) {
  styleDictionary.registerTransform({
    name: 'dt/size/pxToRem',
    type: 'value',
    filter: function (token) {
      return [...FONT_SIZE_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type) &&
      !(token.filePath === 'tokens/root.json');
    },
    transform: pxToRemTransformer,
  });

  styleDictionary.registerTransform({
    name: 'dt/space/pxToRem',
    type: 'value',
    filter: function (token) {
      return SPACING_IDENTIFIERS.includes(token.type);
    },
    transform: pxToRemTransformer,
  });

  styleDictionary.registerTransform({
    name: 'dt/android/xml/size/resolveMath',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return [...SPACING_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type);
    },
    transform: (token) => {
      // replace unmathable characters with empty string
      const mathString = token.value.replace(/dp|sp|em|px|%/g, '');
       
      const result = eval(mathString).toFixed(2);
      return `${result}dp`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/xml/size/pxToDp',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return [...SPACING_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type);
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, 'dp');
      }

      return `${floatVal.toFixed(2)}dp`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/xml/color',
    type: 'value',
    filter: colorsFilter,
    transform: function (token) {
      return tokenColorToDeviceColor(token.value, DeviceObjectFormat.ANDROID_XML);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/xml/color/modifiers',
    type: 'value',
    transitive: true,
    filter: colorModifiersFilter,
    transform: function (token) {
      return deviceTransformColorModifiers(token, DeviceObjectFormat.ANDROID_XML);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/color',
    type: 'value',
    filter: colorsFilter,
    transform: (token) => {
      return tokenColorToDeviceColor(token.value, DeviceObjectFormat.ANDROID_COMPOSE);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/color/modifiers',
    type: 'value',
    transitive: true,
    filter: colorModifiersFilter,
    transform: (token) => {
      return deviceTransformColorModifiers(token, DeviceObjectFormat.ANDROID_COMPOSE);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/fonts/transformToStack',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return FONT_FAMILY_IDENTIFIERS.includes(token.type);
    },
    transform: (token) => {
      if (token.name === 'mono' || token.path.includes('code')) {
        return 'FontFamily.Monospace';
      }
      return 'FontFamily.Default';
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/fonts/weight',
    type: 'value',
    filter: function (token) {
      return WEIGHT_IDENTIFIERS.includes(token.type);
    },
    transform: (token) => {
      return `FontWeight.${ANDROID_WEIGHTS[token.value]}`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/size/pxToDp',
    type: 'value',
    transitive: true,
    filter: function (token) {
      // Exclude lineHeight dimension tokens - they're handled by lineHeight transform
      if (token.type === 'dimension' && token.path?.includes('lineHeight')) return false;
      return [...SPACING_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type) &&
        // The fontSize token in typography tokens is a 'dimension' type for some reason,
        // so have this special case to exclude it from this transform.
        !FONT_SIZE_IDENTIFIERS.includes(token.name);
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, 'dp');
      }

      return `${floatVal}.dp`;
    },
  });

  // Sp is for font sizes only
  styleDictionary.registerTransform({
    name: 'dt/android/compose/size/pxToSp',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return [...FONT_SIZE_IDENTIFIERS].includes(token.type) ||
        // The fontSize token in typography tokens is a 'dimension' type for some reason,
        // so have this special case to include it in this transform.
        FONT_SIZE_IDENTIFIERS.includes(token.name);
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, 'sp');
      }

      return `${floatVal}.sp`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/size/resolveMath',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return [...SPACING_IDENTIFIERS, ...SIZE_IDENTIFIERS, ...FONT_SIZE_IDENTIFIERS].includes(token.type);
    },
    transform: (token) => {
      // replace unmathable characters with empty string
      let unit;
      if (token.value.includes('.dp')) unit = 'dp';
      if (token.value.includes('.sp')) unit = 'sp';
      if (token.value.includes('.em')) unit = 'em';
      const mathString = token.value.replace(/\.dp|\.sp|\.em|px|%/g, '');
       
      const result = eval(mathString);
      return `${result}.${unit}`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/android/compose/lineHeight/percentToDecimal',
    type: 'value',
    filter: function (token) {
      // Match by type (legacy tokens) or path (DTCG-compliant tokens with type: dimension)
      return LINE_HEIGHT_IDENTIFIERS.includes(token.type) ||
        (token.type === 'dimension' && token.path?.includes('lineHeight'));
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, '%');
      }

      if (floatVal === 0) {
        return '0';
      }

      return `${floatVal / 100}.em`;
    },
  });

  // Sp is for font sizes only
  styleDictionary.registerTransform({
    name: 'dt/android/compose/opacity/percentToFloat',
    type: 'value',
    filter: function (token) {
      return ['opacity'].includes(token.type);
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, '%');
      }

      return `${floatVal}F`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/stringify',
    type: 'value',
    filter: function (token) {
      return ['type', 'textCase'].includes(token.type);
    },
    transform: (token) => {
      return `"${token.value}"`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/ios/fonts/transformToStack',
    type: 'value',
    transitive: true,
    filter: function (token) {
      return FONT_FAMILY_IDENTIFIERS.includes(token.type);
    },
    transform: (token) => {
      if (token.name === 'mono' || token.path.includes('code')) {
        return 'UIFont.monospacedSystemFont(ofSize: 15, weight: .regular)';
      }
      return 'UIFont.systemFont(ofSize: 15)';
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/ios/color',
    type: 'value',
    filter: colorsFilter,
    transform: (token) => {
      return tokenColorToDeviceColor(token.value, DeviceObjectFormat.IOS_SWIFT);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/ios/color/modifiers',
    type: 'value',
    transitive: true,
    filter: colorModifiersFilter,
    transform: (token) => {
      return deviceTransformColorModifiers(token, DeviceObjectFormat.IOS_SWIFT);
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/ios/size/pxToCGFloat',
    type: 'value',
    filter: function (token) {
      // Exclude lineHeight dimension tokens - they're handled by dt/ios/lineHeight/percentToDecimal
      if (token.type === 'dimension' && token.path?.includes('lineHeight')) return false;
      return [...SPACING_IDENTIFIERS, ...SIZE_IDENTIFIERS].includes(token.type);
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, 'dp');
      }

      return `CGFloat(${(floatVal).toFixed(2)})`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/ios/lineHeight/percentToDecimal',
    type: 'value',
    filter: function (token) {
      // Skip if already transformed to CGFloat
      if (typeof token.value === 'string' && token.value.includes('CGFloat')) return false;
      // Match by type (legacy tokens) or path (DTCG-compliant tokens with type: dimension)
      return ['opacity', ...LINE_HEIGHT_IDENTIFIERS].includes(token.type) ||
        (token.type === 'dimension' && token.path?.includes('lineHeight'));
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, '%');
      }

      return `CGFloat(${(floatVal).toFixed(2)})`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/lineHeight/percentToDecimal',
    type: 'value',
    filter: function (token) {
      // Match by type (legacy tokens) or path (DTCG-compliant tokens with type: dimension)
      return LINE_HEIGHT_IDENTIFIERS.includes(token.type) ||
        (token.type === 'dimension' && token.path?.includes('lineHeight'));
    },
    transform: (token) => {
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.path, token.value, '%');
      }

      if (floatVal === 0) {
        return '0';
      }

      return `${floatVal / 100}`;
    },
  });

  styleDictionary.registerTransform({
    name: 'dt/fonts/transformToStack',
    type: 'value',
    filter: function (token) {
      return FONT_FAMILY_IDENTIFIERS.includes(token.type);
    },
    transform: (token) => {
      if (token.name === 'body' || token.name === 'expressive') {
        return `${token.value}, ${FALLBACK_FONTS.join(', ')}`;
      } else if (token.name === 'mono') {
        return `${token.value}, ${FALLBACK_FONTS_MONO.join(', ')}`;
      }
      return token.value;
    },
  });

  // Convert hex color to OKLCH and extract just the hue component (degrees)
  // Used for avatar anchor hue that rotates avatar colors based on theme accent
  const toOklch = converter('oklch');
  styleDictionary.registerTransform({
    name: 'dt/avatar/anchorHue',
    type: 'value',
    transitive: true, // Must be transitive to run after references are resolved
    filter: function (token) {
      // Only apply to avatar.anchor.hue token
      return token.path.join('.') === 'avatar.anchor.hue';
    },
    transform: (token) => {
      const color = parse(token.value);
      if (!color) {
        console.warn(`Could not parse color for avatar anchor hue: ${token.value}`);
        return '0';
      }
      const oklch = toOklch(color);
      // Return just the hue value in degrees, rounded to 1 decimal
      // Handle achromatic colors (undefined hue) by defaulting to 0
      const hue = oklch.h ?? 0;
      return Math.round(hue * 10) / 10;
    },
  });

}
