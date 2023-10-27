export const DEFAULT_PREFIX = 'dtIcon';
let UNIQUE_ID_COUNTER = 0;

export function getUniqueString (prefix = DEFAULT_PREFIX) {
  return `${prefix}${UNIQUE_ID_COUNTER++}`;
}

export default {
  getUniqueString,
}
