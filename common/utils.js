let UNIQUE_ID_COUNTER = 0;
export function getUniqueString (prefix = 'dtx') {
  return `${prefix}${UNIQUE_ID_COUNTER++}`;
}
