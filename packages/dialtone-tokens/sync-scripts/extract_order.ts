/**
 * Extracts the curated ordering out of the Dialtone 9 Figma file.
 *
 * Figma has no ordering field on a variable: position comes from the order the
 * variables were created in. So to get a sensible order we have to supply one,
 * and the best one available was built by hand over several years in the old
 * file. Sorting names alphabetically or numerically cannot reproduce it,
 * because the order is semantic: importance, then intensity, then variants.
 *
 * Two sources, because the old file split things differently to us. Colours and
 * type were paint and text *styles* there, and styles carry a `sort_position`
 * fractional index. Numbers were variables, and a collection stores its
 * variables in order.
 *
 * Run once and commit the result. The old file is not expected to change, and
 * a checked-in list keeps the sync free of a second Figma dependency and makes
 * the ordering reviewable in a pull request.
 *
 *   npx tsx sync-scripts/extract_order.ts
 */

import 'dotenv/config';
import { writeFileSync } from 'fs';

import axios from 'axios';

/** Dialtone 9 Design Tokens (2025). Read only. */
const SOURCE_FILE = 'VjrRh4vvfONSmBQxnZrL3u';

const OUT = 'sync-scripts/figma_order.json';

interface StyleMeta {
  name: string;
  style_type: string;
  sort_position: string;
}

async function get<T> (path: string): Promise<T> {
  const token = process.env.PERSONAL_ACCESS_TOKEN;
  if (!token) throw new Error('PERSONAL_ACCESS_TOKEN is required');
  const response = await axios.get(`https://api.figma.com${path}`, {
    headers: { 'X-Figma-Token': token },
  });
  return response.data as T;
}

/** Figma groups with slashes, the token source with dots. */
function toTokenPath (figmaName: string): string {
  return figmaName.split('/').join('.');
}

async function main (): Promise<void> {
  const order: string[] = [];
  const seen = new Set<string>();
  const add = (name: string) => {
    const path = toTokenPath(name);
    if (seen.has(path)) return;
    seen.add(path);
    order.push(path);
  };

  // Styles, in the order a designer arranged them.
  //
  // `sort_position` is scoped to a style type, so the fill, text and effect
  // sequences are three independent orderings and comparing across them is
  // meaningless. Sorted separately, then concatenated in a deliberate order:
  // colours lead because they are the bulk of what a designer reaches for,
  // effects trail because there are seven of them.
  const styles = await get<{ meta: { styles: StyleMeta[] } }>(`/v1/files/${SOURCE_FILE}/styles`);
  const ofType = (type: string) => styles.meta.styles
    .filter(s => s.style_type === type)
    .sort((a, b) => (a.sort_position < b.sort_position ? -1 : a.sort_position > b.sort_position ? 1 : 0));

  const fills = ofType('FILL');
  const texts = ofType('TEXT');
  const effects = ofType('EFFECT');

  const counts: Record<string, number> = { FILL: fills.length, TEXT: texts.length, EFFECT: effects.length };
  for (const style of fills) add(style.name);

  // Variables, in the order the collection stores them.
  const variables = await get<{
    meta: {
      variables: Record<string, { name: string }>;
      variableCollections: Record<string, { name: string; remote: boolean; variableIds: string[] }>;
    };
  }>(`/v1/files/${SOURCE_FILE}/variables/local`);

  let variableCount = 0;
  for (const collection of Object.values(variables.meta.variableCollections)) {
    // A remote collection's order belongs to whichever file owns it.
    if (collection.remote) continue;
    for (const id of collection.variableIds) {
      const variable = variables.meta.variables[id];
      if (!variable) continue;
      variableCount++;
      add(variable.name);
    }
  }

  // Type styles after the number scales, effects last.
  for (const style of texts) add(style.name);
  for (const style of effects) add(style.name);

  writeFileSync(OUT, `${JSON.stringify({
    source: SOURCE_FILE,
    note: 'Curated ordering lifted from the Dialtone 9 file. Regenerate with sync-scripts/extract_order.ts.',
    order,
  }, null, 2)}\n`);

  console.log(`styles    : ${Object.entries(counts).map(([t, n]) => `${t} ${n}`).join(', ')}`);
  console.log(`variables : ${variableCount}`);
  console.log(`written   : ${OUT}, ${order.length} distinct names`);
}

main().catch((error: { response?: { status?: number; data?: unknown }; message?: string }) => {
  console.error(`failed: ${error.response?.status ?? ''} ${JSON.stringify(error.response?.data ?? error.message)}`);
  process.exit(1);
});
