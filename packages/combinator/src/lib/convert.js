import { parseDocValue, stringifyDocValue } from '@/src/lib/parse';

const convertMap = {
  object: {
    array: objectToArray,
    string: stringifyDocValue,
  },
  array: {
    object: arrayToObject,
    string: stringifyDocValue,
  },
  string: {
    object: stringToObject,
    array: stringToArray,
    number: parseInt,
    boolean: stringToBoolean,
  },
  number: {
    string: numberToString,
    boolean: numberToBoolean,
  },
  boolean: {
    string: booleanToString,
    number: booleanToNumber,
  },
};

/**
 * Converts a 'value' 'from' one data type 'to' another if implemented.
 * Returns null if unable to convert.
 *
 * @param {*} from - The type name to convert from
 * @param {*} to - The type name to convert to
 * @param {*} value - The original value
 * @returns {*} The converted value or 'null'
 */
export function convert (from, to, value) {
  return convertMap[from]?.[to]?.(value);
}

function objectToArray (object) {
  return Object.values(object);
}

function arrayToObject (array) {
  return {
    ...array,
  };
}

function stringToObject (string) {
  const value = parseDocValue(string);
  return Array.isArray(value)
    ? arrayToObject(value)
    : value;
}

function stringToArray (string) {
  const value = parseDocValue(string);
  return Array.isArray(value)
    ? value
    : objectToArray(value);
}

function stringToBoolean (string) {
  return string === 'true';
}

function numberToString (number) {
  return number
    ? number.toString()
    : null;
}

function numberToBoolean (number) {
  return number === 1;
}

function booleanToString (boolean) {
  return boolean ? 'true' : 'false';
}

function booleanToNumber (boolean) {
  return boolean ? 1 : 0;
}
