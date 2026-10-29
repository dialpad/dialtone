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
import 'dotenv/config';
import { createHash } from 'crypto';
import { fetchPublishedTokenKeys } from './library-tokens.mjs';
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

/** See the note on the hash below. */
const ICON_BUILDER_VERSION = 1;
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
    //
    // Every input that changes the BUILT component belongs in the hash, or a change to it
    // leaves a stale icon looking current. `flatten` already implies `mono`, so `mono` is added
    // only where flatten does not carry it (a themeable icon that has real clips and is
    // therefore not flattened), and the builder version only once it moves past 1, so adding
    // either does not invalidate the 600-odd icons it would not change. Bump
    // ICON_BUILDER_VERSION whenever icon-builder.js changes what it writes: every icon is then
    // rebuilt on the next run, which replaces each one's children, so rebuild the components
    // that use them afterwards.
    const hash = createHash('sha256')
      .update(`${p.svg}|${p.flatten}|${p.width}x${p.height}`
        + (p.mono && !p.flatten ? '|mono' : '')
        + (ICON_BUILDER_VERSION > 1 ? `|v${ICON_BUILDER_VERSION}` : ''))
      .digest('hex').slice(0, 16);
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

// The default fill variable, by its published key, for a file that links the tokens library
// rather than owning the variables (see icon-builder.js). Without credentials the icons are
// still built, with a literal fill, and that is said out loud.
const FILL_VAR_NAME = 'color/foreground/primary';   // must match DEFAULT_FILL_VAR in icon-builder.js
let fillVarKey = null;
if (process.env.PERSONAL_ACCESS_TOKEN && process.env.TOKENS_FILE_KEY) {
  fillVarKey = (await fetchPublishedTokenKeys(process.env.PERSONAL_ACCESS_TOKEN, process.env.TOKENS_FILE_KEY))
    .get(FILL_VAR_NAME) || null;
}
if (!fillVarKey) {
  console.log(`note         : no published key for ${FILL_VAR_NAME} (set PERSONAL_ACCESS_TOKEN and TOKENS_FILE_KEY); `
    + 'icons fall back to the local variable, or a literal fill');
}

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
let indexOffset = 0;   // icons in the shards before this one: the builder places each icon by its GLOBAL slot
shards.forEach((group, i) => {
  const file = `icons-${i + 1}of${shards.length}.json`;
  const body = JSON.stringify({ page: PAGE, clear: i === 0, fillVarKey, indexOffset, icons: group });
  indexOffset += group.length;
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
