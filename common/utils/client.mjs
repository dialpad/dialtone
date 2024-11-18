/**
 * Contains utilities that will work on a browser,
 * don't import anything related to node or that is not SSR friendly.
 */

let UNIQUE_ID_COUNTER = 0;
export function getUniqueString (prefix = 'dt') {
  return `${prefix}${UNIQUE_ID_COUNTER++}`;
}

const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout;
export function flushPromises () {
  return new Promise((resolve) => {
    scheduler(resolve);
  });
}

/**
 * Transform a string from kebab-case to PascalCase
 * @param string
 * @returns {string}
 */
export function kebabCaseToPascalCase (string) {
  return string?.toLowerCase()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Transform a string from PascalCase to kebab-case
 * @param {*} string
 * @returns {string}
 */
export function PascalCaseToKebabCase (string) {
  return string
    .split(/(?=[A-Z]|[0-9]{3,}?)/)
    .join('-')
    .toLowerCase();
}

export default {
  getUniqueString,
  kebabCaseToPascalCase,
  flushPromises,
  PascalCaseToKebabCase
};
