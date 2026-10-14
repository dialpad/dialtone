/** Lowercase and drop separators, keeping any "Dt" prefix.
 * @param {string} name
 */
export function compactName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** C1 canonical/alias comparison, shared with source documentation generation.
 * @param {string} name
 */
export function normalizeComponentName(name) {
  return compactName(name).replace(/^dt/, '');
}
