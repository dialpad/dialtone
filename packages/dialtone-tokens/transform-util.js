/**
 * Utility functions for custom transforms
 */

import Color from 'tinycolor2';
import { transformColorModifiers } from '@tokens-studio/sd-transforms';

export const DeviceObjectFormat = Object.freeze({
  ANDROID_COMPOSE: 'android/compose',
  ANDROID_XML: 'android/xml',
  IOS_SWIFT: 'ios/swift',
});

export const colorsFilter = (token) => {
  return (token.$type ?? token.type) === 'color' &&
    // Don't transform linear-gradient colors so they can be identified and removed by the file filter
    !(token.$value ?? token.value).startsWith('linear-gradient');
};

export const colorModifiersFilter = (token) => {
  return colorsFilter(token) &&
            token.$extensions &&
            token.$extensions['studio.tokens']?.modify;
};

/**
 * Converts a color string in a device format to a standard format
 * @param color {string}
 * @param deviceObjectFormat {DeviceObjectFormat}
 * @returns {string}
 * @throws {Error} when deviceObjectFormat is invalid
 */
export function deviceColorToTokenColor (color, deviceObjectFormat) {
  switch (deviceObjectFormat) {
    case DeviceObjectFormat.ANDROID_COMPOSE:
      // Compose argb hex8 -> rgba hex8 e.g. Color(0xeeffffff) -> #ffffffee
      return '#' + color.slice(10, 16) + color.slice(8, 10);
    case DeviceObjectFormat.ANDROID_XML: {
      // argb hex8 -> rgba hex8 e.g. #eeffffff -> #ffffffee
      return '#' + color.slice(3) + color.slice(1, 3);
    }
    case DeviceObjectFormat.IOS_SWIFT: {
      // iOS Swift UIColor -> rgba e.g. UIColor(red: 0.318, green: 0.627, blue: 0.996, alpha: 1) -> rgba(81.09, 159.885, 253.98, 1)
      const match = color.match(swiftUIColorRegExp);
      if (match?.groups) {
        const { red, green, blue, alpha } = match.groups;
        return `rgba(${parseFloat(red) * 255}, ${parseFloat(green) * 255}, ${parseFloat(blue) * 255}, ${alpha})`;
      }
      return color;
    }
  }
  throw new Error(`Invalid DeviceObjectFormat ${deviceObjectFormat}`);
}

/**
 * Converts a color string in a standard format to a device format
 * @param color {string}
 * @param deviceObjectFormat {DeviceObjectFormat}
 * @returns {string}
 * @throws {Error} when deviceObjectFormat is invalid
 */
export function tokenColorToDeviceColor (color, deviceObjectFormat) {
  switch (deviceObjectFormat) {
    case DeviceObjectFormat.ANDROID_COMPOSE: {
      // To Compose argb hex8 e.g. Color(0xff000000)
      const hex8 = Color(color).toHex8();
      return `Color(0x${hex8.slice(6) + hex8.slice(0, 6)})`;
    }
    case DeviceObjectFormat.ANDROID_XML: {
      // To argb hex8 e.g. #ff000000
      const hex8 = Color(color).toHex8();
      return '#' + hex8.slice(6) + hex8.slice(0, 6);
    }
    case DeviceObjectFormat.IOS_SWIFT: {
      // To iOS Swift UIColor e.g. UIColor(red: 0.318, green: 0.627, blue: 0.996, alpha: 1)
      return tokenColorToSwiftUIColor(color);
    }
  }
  throw new Error(`Invalid DeviceObjectFormat ${deviceObjectFormat}`);
}

/**
 * Custom version of `transformColorModifiers` from tokens-studio sd-transform library for device tokens.
 * This is needed because a color that a modifier references has already been transformed to the device color
 * (e.g. android compose `Color(0xeeffffff)`). So passing that into the standard color modifier transformer will fail.
 * This function takes the device color, converts it to a standard format, then calls the color modifier transformer.
 * The output is then converted to the appropriate device format and returned.
 * @param token
 * @param deviceObjectFormat {DeviceObjectFormat}
 * @returns {undefined|string}
 */
export function deviceTransformColorModifiers (token, deviceObjectFormat) {
  const modifier = token.$extensions['studio.tokens'].modify;
  const oldValue = token.$value ?? token.value;
  const newValue = deviceColorToTokenColor(oldValue, deviceObjectFormat);
  if (token.$value) {
    token.$value = newValue;
  } else {
    token.value = newValue;
  }
  const oldFormat = modifier.format;
  modifier.format = 'hex';

  // Call tokens-studio/sd-transforms function to apply color modifier
  const transformed = transformColorModifiers(token);

  modifier.format = oldFormat;
  if (token.$value) {
    token.$value = oldValue;
  } else {
    token.value = oldValue;
  }

  if (!transformed) {
    // If transformColorModifiers returns undefined, then we should also return that. (See transformColorModifiers)
    return undefined;
  }

  // Log a warning if there are new color modifier params we have not tested in mobile yet
  if (!['hsl', 'lch'].includes(modifier.space) || modifier.format || modifier.type === 'mix') {
    console.log('\x1b[1;33m%s\x1b[0m', `Color modifier not tested on mobile: ${token.name}, ${modifier.type}, ${modifier.space}, format=${modifier.format}`);
  }

  return tokenColorToDeviceColor(transformed, deviceObjectFormat);
}

const swiftUIColorRegExp =
  /UIColor\(red: (?<red>[\d.]+?), green: (?<green>[\d.]+?), blue: (?<blue>[\d.]+?), alpha: (?<alpha>[\d.]+?)\)/;

function tokenColorToSwiftUIColor (color) {
  const { r, g, b, a } = Color(color).toRgb();
  const rFixed = (r / 255.0).toFixed(3);
  const gFixed = (g / 255.0).toFixed(3);
  const bFixed = (b / 255.0).toFixed(3);
  const aFixed = a > 0 && a < 1 ? a.toFixed(3) : a;
  return `UIColor(red: ${rFixed}, green: ${gFixed}, blue: ${bFixed}, alpha: ${aFixed})`;
}
