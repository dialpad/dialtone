let UNIQUE_ID_COUNTER = 0;
export function getUniqueString (prefix = 'dt') {
  return `${prefix}${UNIQUE_ID_COUNTER++}`;
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

export default {
  getUniqueString,
  kebabCaseToPascalCase,
};
