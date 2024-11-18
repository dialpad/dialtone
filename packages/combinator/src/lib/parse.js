import JSON5 from 'json5-with-undefined';

/**
 * Stringifies a documentation value using the docgen format.
 *
 * @param {*} value - The value to stringify.
 * @returns {string} Stringified value.
 */
export function stringifyDocValue (value) {
  return JSON5.stringify(value);
}

/**
 * Parses a documentation value using the docgen format.
 *
 * @param {string} value - The value to parse.
 * @returns {*} The parsed value
 */
export function parseDocValue (value) {
  return JSON5.parse(value);
}
