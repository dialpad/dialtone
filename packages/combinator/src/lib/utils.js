import { DEFAULT_PREFIX } from '@/src/lib/constants';

/**
 * Returns the non-empty entries of a slots object, suitable for `v-for` over
 * named slot templates.
 *
 * @param {object|null|undefined} slots - The slot values map.
 * @returns {object} A new object containing only entries whose value is truthy.
 */
export function nonEmptySlots (slots) {
  return Object.fromEntries(Object.entries(slots ?? {}).filter(([, slot]) => slot));
}

/**
 * Copy all the entries of an object into a new object.
 *
 * @param {object} obj - The target object.
 * @returns {object} The flattened object.
 */
export function flatten (obj) {
  const result = {};
  for (const key in obj) {
    result[key] = obj[key];
  }
  return result;
}

/**
 * Map of prefixes with their current 'id' numbers.
 * Used by `getUniqueString(...)`
 *
 * @type {object}
 */
const UNIQUE_ID_MAP = {};

/**
 * Gets the next string value given a prefix.
 *
 * @param {string} prefix - The prefix that will be uniquely incremented.
 * @returns {string} The next unique string for given prefix.
 */
export function getUniqueString (prefix = DEFAULT_PREFIX) {
  let id = UNIQUE_ID_MAP[prefix];
  if (!id) {
    id = 0;
    UNIQUE_ID_MAP[prefix] = id;
  }
  return `${prefix}${UNIQUE_ID_MAP[prefix]++}`;
}

/**
 * Gets specific type name from a value, intended to be used with value from a 'member'.
 * Gives some more specific type names such as 'array' etc...
 *
 * @param {*} value - The value.
 * @returns {string|null} The specific member type.
 */
export function typeOfMemberValue (value) {
  if (value === undefined || value === null) {
    return null;
  }

  const type = typeof value;
  switch (type) {
    case 'symbol': {
      return value.toString();
    }
    case 'object': {
      return Array.isArray(value)
        ? 'array'
        : 'object';
    }
    default: return type;
  }
}

/**
 * Enumerates an object that contains key-value pairs, each containing an array.
 * A handler is called for each item in each array.
 *
 * The first parameter for the handler is the key for the array that the item is in.
 * The second parameter for the handler is the item in the array.
 *
 * Used to make enumerating through the 'options' and 'info' members easier.
 *
 * @param {Function} handler - The handler called for each entry.
 * @param {object} groups - Object that contains key-value pairs, each containing an array.
 */
export function enumerateGroups (handler, groups) {
  Object.entries(groups).forEach(([group, entries]) => {
    entries?.forEach(entry => {
      handler(group, entry);
    });
  });
}

/**
 * Gets the full list of icon component names from the dialtone package.
 *
 * @returns {Array} icon components.
 */
// export function getIcons () {
//  const requireContext = require.context(
//    '../../node_modules/@dialpad/dialtone/lib/dist/vue/icons',
//    false,
//    /[A-Z]\w+\.(vue|js)$/,
//  );
//
//  return getComponentFilesFromDir(requireContext).map(item => item.componentName);
// }

/**
 * Extracts filename and component name from all files in a directory.
 *
 * @param {object} requireContext - a requireContext containing the path of the
 * directory you would like to read files from.
 * @returns {Array} arr of objects containing both the
 * filename and component name in PascalCase.
 */
/**
 * Returns true if the member represents native `class` or a CSS class prop (name ends with 'Class').
 *
 * @param {object} member - The member descriptor.
 * @returns {boolean}
 */
export function isClassProp (member) {
  return member?.name === 'class' || member?.name?.endsWith('Class');
}

const SLOT_CLASS_PROP_DEPENDENCIES = new Map([
  ['blockEndIconClass', 'blockEndIcon'],
  ['blockStartIconClass', 'blockStartIcon'],
  ['endIconClass', 'endIcon'],
  ['iconClass', 'icon'],
  ['leadingClass', 'leading'],
  ['startIconClass', 'startIcon'],
  ['trailingClass', 'trailing'],
]);

function hasValue (value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Returns true when a prop customizes a direct slot wrapper but that slot is empty.
 *
 * @param {string} propName - The prop name to check.
 * @param {object} slotValues - Current slot values.
 * @returns {boolean}
 */
export function shouldDisableSlotClassProp (propName, slotValues) {
  const slotName = SLOT_CLASS_PROP_DEPENDENCIES.get(propName);
  if (!slotName || !slotValues || !Object.prototype.hasOwnProperty.call(slotValues, slotName)) return false;
  return !hasValue(slotValues[slotName]);
}

const UNSUPPORTED_ROOT_CLASS_COMPONENTS = new Set([
  'DtDropdown',
]);

/**
 * Returns true unless a Dialtone component is known not to apply native `class`
 * attributes directly to its rendered root element.
 *
 * @param {string} componentName - The component display name, e.g. 'DtCard'.
 * @returns {boolean}
 */
export function supportsRootClass (componentName) {
  return Boolean(componentName) && !UNSUPPORTED_ROOT_CLASS_COMPONENTS.has(componentName);
}

export const getComponentFilesFromDir = (requireContext) => {
  const files = [];
  requireContext.keys().forEach(fileName => {
    // Get PascalCase name of component
    const componentName = fileName.split('/').pop().replace(/\.\w+$/, '');
    files.push({ fileName, componentName });
  });
  return files;
};
