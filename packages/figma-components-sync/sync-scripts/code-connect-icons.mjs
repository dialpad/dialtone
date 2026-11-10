/**
 * Generate a Code Connect template for every icon component the icon library holds, so an icon that
 * is swapped into another component's slot renders as the real `DtIcon…` component.
 *
 *   node sync-scripts/code-connect-icons.mjs --target main
 *
 * One file per icon, in `code-connect/generated/icons/` (gitignored: they are rebuilt from the icon
 * library's ids, which `run-batch --icons` records in `build-data/<target>/icon-library.json`).
 * `figma connect publish` then picks them up through `figma.config.json`.
 *
 * The name is the icon's own: `controls/x-circle` is `DtIconXCircle` in `@dialpad/dialtone-icons`, with
 * the category dropped. Every icon in the library was checked against that package's exports (626 of
 * 626, no name taken twice); one with no export is skipped and listed rather than guessed.
 *
 * The component's name travels in the template's metadata, so a parent that swaps an icon in can read it
 * and write the props it owns (DtButton adds `:size="iconSize"`), instead of being handed a finished
 * snippet it cannot change.
 */
import { TARGET } from './target.mjs';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '');
const REPO = `${ROOT}/../..`;
const OUT = `${ROOT}/code-connect/generated/icons`;
const library = JSON.parse(readFileSync(`${ROOT}/sync-scripts/build-data/${TARGET.name}/icon-library.json`, 'utf8'));

// The names the package exports, read from its built type declarations.
const typings = `${REPO}/packages/dialtone-icons/vue/dist/types/index.d.ts`;
if (!existsSync(typings)) throw new Error(`build dialtone-icons first: ${typings} is missing`);
const exported = new Set([...readFileSync(typings, 'utf8').matchAll(/\bDtIcon[A-Za-z0-9]+\b/g)].map(m => m[0]));

const pascal = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let written = 0;
const skipped = [];
for (const [figmaName, nodeId] of Object.entries(library.ids)) {
  const [category, name] = figmaName.split('/');
  const component = 'DtIcon' + pascal(name);
  if (!exported.has(component)) { skipped.push(`${figmaName} (no ${component})`); continue; }
  const svg = `packages/dialtone-icons/src/svg/icons/${category}/${name}.svg`;
  const file = `${category}--${name}.figma.ts`;
  writeFileSync(`${OUT}/${file}`, `// url=https://www.figma.com/design/${TARGET.fileKey}/Dialtone-2026?node-id=${nodeId.replace(':', '-')}
// source=${svg}
// component=${component}
import figma from 'figma'

export default {
  example: figma.code\`<${component} />\`,
  imports: ["import { ${component} } from '@dialpad/dialtone-icons/vue3'"],
  id: 'dt-icon-${category}-${name}',
  metadata: { nestable: true, props: { component: '${component}' } },
}
`);
  written++;
}
console.log(`${TARGET.name}: ${written} icon templates in code-connect/generated/icons`);
if (skipped.length) console.log(`skipped ${skipped.length}:\n  ${skipped.join('\n  ')}`);
console.log(`(${readdirSync(OUT).length} files)`);
