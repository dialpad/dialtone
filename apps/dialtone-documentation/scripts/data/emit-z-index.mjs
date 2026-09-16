/**
 * Emitter for docs/_data/z-index.json.
 *
 * One row per z-index level: `name` + `output` (the numeric value, as a string) are derived
 * from the `Z_INDEX` constant; `description` is hand-maintained docs prose (metadata.mjs).
 */
import { getZIndexLevels } from './token-values.mjs';
import { zIndexDescriptions } from './metadata.mjs';

export const file = 'z-index.json';

export async function build () {
  const levels = await getZIndexLevels();
  return levels.map(({ name, value }) => {
    const description = zIndexDescriptions[name];
    if (description === undefined) {
      throw new Error(
        `z-index: no description for level "${name}". Add it to zIndexDescriptions in data/metadata.mjs.`,
      );
    }
    return { name, output: String(value), description };
  });
}
