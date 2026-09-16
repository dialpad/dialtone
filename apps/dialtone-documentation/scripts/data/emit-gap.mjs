/**
 * Emitter for docs/_data/gap.json.
 *
 * `values` is one row per spacing stop: `stop` from `SPACING_STOPS`, `px` resolved from the
 * built token output (`spacing/<stop>`), formatted as `"{px}px"`. `directions` is hand-maintained
 * docs metadata (the flex/grid gap axes).
 */
import { getSpacingStops, getTokenPx } from './token-values.mjs';
import { gapDirections } from './metadata.mjs';

export const file = 'gap.json';

export async function build () {
  const stops = await getSpacingStops();
  return {
    directions: gapDirections,
    values: stops.map((stop) => ({
      stop: String(stop),
      px: `${getTokenPx('spacing', String(stop))}px`,
    })),
  };
}
