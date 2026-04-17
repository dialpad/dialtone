/**
 * Infers parent-child relationships between props so
 * dependent controls can be hidden until their parent is active.
 *
 * Two strategies:
 * 1. Description parsing — "Only applies when the `link` prop is true"
 * 2. Boolean prefix matching — `linkKind` starts with `link` (a boolean prop)
 */

/**
 * Regex that captures the parent prop name from description text like:
 * - "Only applies when the `link` prop is true"
 * - "Only applied when using the `href` prop."
 * - "Only applies when `startHref` is set."
 *
 * @type {RegExp}
 */
const DESCRIPTION_RE = /only\s+appl\w+\s+when\s+(?:the\s+|using\s+the\s+)?[`"']?(\w+)[`"']?(?:\s+(?:prop|is))?/i;

/**
 * Suffixes that indicate styling/config props — these should not be
 * treated as children of a boolean parent even if the name matches.
 *
 * @type {RegExp}
 */
const EXCLUDED_SUFFIX_RE = /(?:Class|ChildProps|Id)$/;
const EXCLUDED_NAMES = new Set(['showDivider']);

/**
 * Builds a map from child prop name → parent prop name.
 *
 * @param {Array} members - The member list (props) with name, description, types.
 * @returns {Map<string, string>} dependency map
 */
export function buildDependencyMap (members) {
  const map = new Map();
  if (!members?.length) return map;

  const membersByName = new Map(members.map(m => [m.name, m]));

  // Strategy 1: description parsing
  for (const member of members) {
    if (!member.description || EXCLUDED_NAMES.has(member.name)) continue;
    const match = member.description.match(DESCRIPTION_RE);
    if (match) {
      const parentName = match[1];
      if (parentName !== member.name && membersByName.has(parentName)) {
        map.set(member.name, parentName);
      }
    }
  }

  // Strategy 2: boolean prefix matching
  const booleanProps = members
    .filter(m => m.types?.includes('boolean') && !m.types.includes('string'))
    .map(m => m.name);

  for (const member of members) {
    // Skip if already mapped by strategy 1
    if (map.has(member.name)) continue;
    // Skip excluded suffixes
    if (EXCLUDED_SUFFIX_RE.test(member.name)) continue;

    for (const boolName of booleanProps) {
      if (
        member.name !== boolName &&
        member.name.startsWith(boolName) &&
        // Next char after prefix must be uppercase (camelCase boundary)
        member.name.length > boolName.length &&
        member.name[boolName.length] === member.name[boolName.length].toUpperCase()
      ) {
        map.set(member.name, boolName);
        break;
      }
    }
  }

  return map;
}

/**
 * Returns true if the prop should be hidden because its parent prop is falsy.
 *
 * @param {string} propName - The prop to check.
 * @param {Map<string, string>} dependencyMap - From buildDependencyMap.
 * @param {object} values - Current prop values keyed by prop name.
 * @returns {boolean}
 */
export function shouldHideProp (propName, dependencyMap, values) {
  const parentName = dependencyMap.get(propName);
  if (!parentName) return false;
  return !values[parentName];
}
