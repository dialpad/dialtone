/**
 * Emitter for docs/_data/spacing.json.
 *
 * - `values`: one row per spacing stop (`SPACING_STOPS`), `output` = rem (px/10) of the spacing token.
 * - `coordinates`: every spacing stop (same scale as `values` and as the generated `d-ibs-*`
 *   inset utilities), each with its hand-maintained `negative`/`combo` flags + `value` (rem; the
 *   `0` stop is the literal `"0"`), then the literal percentage/calc coordinates appended.
 * - `directions` / `coordinateDirections`: hand-maintained docs metadata.
 */
import { getSpacingStops, getTokenPx, pxToRem } from './token-values.mjs';
import { spacing } from './metadata.mjs';

export const file = 'spacing.json';

export async function build () {
  const spacingStops = await getSpacingStops();
  const values = spacingStops.map((stop) => ({
    value: String(stop),
    output: pxToRem(getTokenPx('spacing', String(stop))),
  }));

  // Coordinates use the full spacing scale — the same stops as `values` and as the generated
  // `d-ibs-*` inset utilities; the legacy POSITION_SIZES_SPACING map omitted several stops.
  const coordinates = spacingStops.map((stop) => {
    // SPACING_STOPS are numbers; coordinate strings must match the old POSITION_SIZES_SPACING
    // output (e.g. "0", not 0) so the `0` stop stays the literal "0" and the field stays a string.
    const coordinate = String(stop);
    const flags = spacing.coordinateFlags[coordinate];
    if (!flags) {
      throw new Error(`spacing: no negative/combo flags for coordinate "${coordinate}" — add it to spacing.coordinateFlags in data/metadata.mjs.`);
    }
    return {
      coordinate,
      negative: flags.negative,
      combo: flags.combo,
      value: coordinate === '0' ? '0' : pxToRem(getTokenPx('spacing', coordinate)),
    };
  });
  coordinates.push(...spacing.extraCoordinates);

  return {
    directions: spacing.directions,
    values,
    coordinateDirections: spacing.coordinateDirections,
    coordinates,
  };
}
