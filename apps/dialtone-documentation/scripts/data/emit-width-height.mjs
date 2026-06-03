/**
 * Emitter for docs/_data/width-height.json.
 *
 * `layout` is one row per LAYOUT_STOPS entry: `"Npx"` strings are off-scale literals (px = N);
 * bare numbers are layout-token stops with px resolved from the built token output. The
 * `percentage` / `viewport` / `characterWidth` / `keywords` blocks are hand-maintained docs
 * metadata (CSS keyword lists, not token-derived).
 */
import { getLayoutStops, getTokenPx } from './token-values.mjs';
import { widthHeight } from './metadata.mjs';

export const file = 'width-height.json';

export async function build () {
  const stops = await getLayoutStops();
  const layout = stops.map((stop) => {
    if (typeof stop === 'string' && stop.endsWith('px')) {
      return { stop, px: parseInt(stop, 10) };
    }
    return { stop: String(stop), px: getTokenPx('layout', String(stop)) };
  });
  return {
    percentage: widthHeight.percentage,
    layout,
    viewport: widthHeight.viewport,
    characterWidth: widthHeight.characterWidth,
    keywords: widthHeight.keywords,
  };
}
