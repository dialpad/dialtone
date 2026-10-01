/**
 * Generate the payload that builds Dialtone's icons as Figma components.
 *
 * WHY A LIBRARY AT ALL. A slot that a designer can only toggle is half a slot — the other
 * half is choosing what goes in it. Figma's INSTANCE_SWAP property needs real components
 * to swap between, so the icons have to exist as components before any slot can offer them.
 *
 * SEPARATE COMPONENTS, NOT A VARIANT SET. An instance swap picks a component; a variant set
 * would make the designer pick the set and then dig for a variant. The `category/name`
 * naming is what gives the picker its grouping, which is how every real icon library does it.
 *
 * The per-icon decisions (themeable? flattenable? is the clip real?) all live in
 * icon-svg.mjs, with the measurements that settled them.
 */

import './pin-cwd.mjs';
import { readdirSync, readFileSync, writeFileSync, statSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { prepareIcon, themeableFills } from './icon-svg.mjs';

const ICONS_PKG = '../dialtone-icons';
const SRC = `${ICONS_PKG}/src/svg/icons`;
const SHARD_DIR = 'sync-scripts/build-data/shards';
const PAGE = 'Icons';
/** Keep each shard comfortably inside one fetch. Payloads are pure text, so this is size. */
const SHARD_KB = 150;

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir).sort()) {
    const p = `${dir}/${e}`;
    statSync(p).isDirectory() ? walk(p, out) : e.endsWith('.svg') && out.push(p);
  }
  return out;
};

const themeable = themeableFills(`${ICONS_PKG}/gulpfile.cjs`);
const files = walk(SRC);
if (!files.length) throw new Error(`no icons under ${SRC}`);

const icons = [];
const problems = [];
for (const f of files) {
  // `<category>/<name>` — the slash is what groups them in Figma's picker.
  const rel = f.slice(SRC.length + 1).replace(/\.svg$/, '');
  if (!rel.includes('/')) { problems.push(`${rel}: not inside a category directory`); continue; }
  try {
    const p = prepareIcon(readFileSync(f, 'utf8'), themeable);
    // A content hash, so a rebuild can leave an unchanged component completely alone.
    // See the note in icon-builder.js: replacing a component's children destroys every
    // instance override that pointed at them.
    const hash = createHash('sha256')
      .update(`${p.svg}|${p.flatten}|${p.width}x${p.height}`).digest('hex').slice(0, 16);
    icons.push({ name: rel, svg: p.svg, flatten: p.flatten, mono: p.mono, w: p.width, h: p.height, hash });
  } catch (e) { problems.push(`${rel}: ${e.message}`); }
}
// An icon that cannot be prepared must not be silently absent from the library — a missing
// icon looks exactly like an icon nobody has drawn yet.
if (problems.length) {
  throw new Error(`${problems.length} icon(s) could not be prepared:\n  ` + problems.join('\n  '));
}

// Validate here, not downstream. `preflight.mjs` reasons about component payloads and has
// nothing to say about icons, so this is the only place the icon payload gets checked — and
// a payload nobody checked is how a 100x100 dot reached the canvas once already.
const bad = [];
const seen = new Set();
for (const ic of icons) {
  if (!ic.svg || !/<svg[\s>]/.test(ic.svg)) bad.push(`${ic.name}: no <svg> element survived preparation`);
  if (!(ic.w > 0 && ic.h > 0)) bad.push(`${ic.name}: viewBox is ${ic.w}x${ic.h}`);
  if (!/^[^/]+\/[^/]+$/.test(ic.name)) bad.push(`${ic.name}: name is not exactly <category>/<icon>`);
  if (seen.has(ic.name)) bad.push(`${ic.name}: duplicate name — one would silently overwrite the other`);
  seen.add(ic.name);
  if (ic.flatten && !ic.mono) bad.push(`${ic.name}: marked flattenable but not monochrome`);
}
if (bad.length) throw new Error(`icon payload rejected (${bad.length}):\n  ` + bad.join('\n  '));

mkdirSync(SHARD_DIR, { recursive: true });
const shards = [];
let cur = [], curBytes = 0;
for (const ic of icons) {
  const b = JSON.stringify(ic).length;
  if (cur.length && curBytes + b > SHARD_KB * 1024) { shards.push(cur); cur = []; curBytes = 0; }
  cur.push(ic); curBytes += b;
}
if (cur.length) shards.push(cur);

const manifest = { page: PAGE, total: icons.length, shards: [] };
shards.forEach((group, i) => {
  const file = `icons-${i + 1}of${shards.length}.json`;
  const body = JSON.stringify({ page: PAGE, clear: i === 0, icons: group });
  writeFileSync(`${SHARD_DIR}/${file}`, body);
  manifest.shards.push({
    file, count: group.length, clear: i === 0,
    hash: createHash('sha256').update(body).digest('hex').slice(0, 12),
  });
});
writeFileSync('sync-scripts/build-data/icons-manifest.json', JSON.stringify(manifest, null, 2));

const mono = icons.filter(i => i.mono).length;
const flat = icons.filter(i => i.flatten).length;
console.log(`icons        : ${icons.length} in ${new Set(icons.map(i => i.name.split('/')[0])).size} categories`);
console.log(`themeable    : ${mono}  (fill rewritten to currentColor by the Vue build)`);
console.log(`flattened    : ${flat} to a single \`Icon\` vector — ${mono - flat} kept structured (real clip)`);
console.log(`full-colour  : ${icons.length - mono} kept structured`);
console.log(`payload      : ${shards.length} shard(s) -> ${SHARD_DIR}/icons-*of${shards.length}.json`);
