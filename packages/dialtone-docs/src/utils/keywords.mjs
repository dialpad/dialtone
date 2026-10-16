/** Keywords are authored discovery phrases, never public component identifiers. */
export function readKeywords(value, sourcePath) {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some(keyword =>
    typeof keyword !== 'string' || !keyword.trim(),
  )) {
    throw new Error(`Invalid keywords in ${sourcePath}: expected an array of nonempty strings`);
  }
  return value.map(keyword => keyword.trim());
}
