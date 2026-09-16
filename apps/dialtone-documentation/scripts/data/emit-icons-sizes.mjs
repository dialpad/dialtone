/**
 * Emitter for docs/_data/icons-sizes.json.
 *
 * One row per icon-size stop. `size` + the px in `width_height` are token-derived
 * (size.base × multiplier); the `var(--dt-icon-size-…)` display string and the
 * `d-icon--size-…` class name are derived from the stop. No hand-maintained metadata.
 */
import { getIconSizes } from './token-values.mjs';

export const file = 'icons-sizes.json';

export function build () {
  return getIconSizes().map(({ size, px }) => ({
    size,
    width_height: `var(--dt-icon-size-${size}) (${px}px)`,
    className: `d-icon--size-${size}`,
  }));
}
