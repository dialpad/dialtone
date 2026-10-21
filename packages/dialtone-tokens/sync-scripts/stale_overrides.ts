/**
 * Which overrides Figma still holds that a material's own run no longer
 * wants, so `build_materials.ts` can delete them and let inheritance resume.
 *
 * Kept in its own module, not inlined in `build_materials.ts`: that file
 * runs `main()` as a side effect of being imported, which would make this
 * function untestable without a full REST-backed run.
 *
 * "Absent from `wanted`" is only trustworthy as "no longer wanted" when every
 * desired override for this material actually got addressed this run — an
 * addressing failure (a renamed mode, a variable `byName` can't find) also
 * leaves an override out of `wanted`, for a completely different reason: not
 * that it's obsolete, but that this run couldn't tell what it should be.
 * Returning nothing whenever `unaddressable` is non-empty is deliberate, not
 * a missed case — reproduced directly without it: renaming a mode broke every
 * lookup for a material, and every one of that material's real, still-wanted
 * overrides got classified as stale and queued for deletion.
 */
export function staleOverrides (
  existing: Record<string, Record<string, unknown>>,
  wanted: Map<string, unknown>,
  unaddressable: readonly unknown[],
): { variableId: string; modeId: string }[] {
  if (unaddressable.length > 0) return [];

  const stale: { variableId: string; modeId: string }[] = [];
  for (const [variableId, byMode] of Object.entries(existing)) {
    for (const modeId of Object.keys(byMode)) {
      if (wanted.has(`${variableId}/${modeId}`)) continue;
      stale.push({ variableId, modeId });
    }
  }
  return stale;
}
