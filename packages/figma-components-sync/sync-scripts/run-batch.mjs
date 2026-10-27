/**
 * One command for a whole build batch. The only manual step left is clicking Run.
 *
 *   node sync-scripts/run-batch.mjs toggle badge chip button avatar
 *
 * WHAT IS AND IS NOT AUTOMATABLE
 * A Figma dev plugin can only be launched from the desktop UI — there is no API to
 * start one, and the REST API is read-only for canvas content (which is the whole
 * reason this pipeline needs a plugin or `use_figma` at all). So exactly one step is
 * irreducibly human: Plugins → Development → Dialtone Spec Builder. Everything on
 * either side of it is done here:
 *
 *   1  re-measure any spec older than the code that produces it
 *   2  encode, shard, and regenerate the plugin from generic-builder.js
 *   3  preflight every payload BEFORE anyone clicks anything
 *   4  serve the payloads and wait
 *   5  … click Run in Figma …
 *   6  write the returned set ids into the right config file
 *   7  run check-all and print the result
 *
 * Step 6 is the one that most deserves automating: it was a hand copy of ids read off
 * a screen into two different files, and a wrong id makes the checks verify the wrong
 * set — which reads as a clean pass on work that was never looked at.
 */
import './pin-cwd.mjs';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, utimesSync } from 'fs';
import { extname, normalize } from 'path';
import { execFileSync, spawnSync } from 'child_process';

const HERE = new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const DIR = `${HERE}/build-data/`;
const PORT = Number(process.env.PORT || 8931);

const args = process.argv.slice(2);
const names = args.filter(a => !a.startsWith('--'));
const SKIP_VERIFY = args.includes('--no-verify');
const WANT_VISUAL = args.includes('--visual');
// The icon library is a build of its own: 617 components with no variants, no spec and
// nothing to verify against the browser. It can ride along with a component build (one
// click) or be built alone with no component names at all.
const WANT_ICONS = args.includes('--icons');
if (!names.length && !WANT_ICONS) {
  console.error('usage: run-batch.mjs <component…> [--no-verify] [--visual]');
  console.error('       run-batch.mjs --icons            (build the icon component library)');
  process.exit(2);
}

const run = (script, argv, opts = {}) =>
  execFileSync(process.execPath, [`sync-scripts/${script}`, ...argv], { encoding: 'utf8', ...opts });

// ── 1. re-measure anything stale ────────────────────────────────────────────
// encode-build refuses a spec older than the code that produced it, and rightly: a
// stale spec silently encodes yesterday's measurements. But refusing is only the right
// answer when a human is watching — here the fix is mechanical, so do it and say so.
// `component-axes.mjs` and each `configs/*.mjs` are producers too — they're WHAT gets
// measured (axes, invalid combinations, props), not just HOW. Missing here once already:
// adding Button's circle/link/linkKind/linkUnderline axes left the spec reporting
// "current" at the old 2,240-variant count, because nothing watched the one file that
// actually changed.
const CONFIG_DIR = `${HERE}/configs`;
const configFiles = existsSync(CONFIG_DIR)
  ? readdirSync(CONFIG_DIR).filter(f => f.endsWith('.mjs')).map(f => `${CONFIG_DIR}/${f}`)
  : [];
const PRODUCERS = ['build-spec.mjs', 'verify-harness/main.js', 'figma-mapping.mjs',
  'cdp-provenance.mjs', 'component-axes.mjs']
  .map(f => `${HERE}/${f}`).filter(existsSync).concat(configFiles);
const newestProducer = Math.max(...PRODUCERS.map(f => statSync(f).mtimeMs));

// `<component>-merged` is the SAME component measured twice, slots empty and slots filled,
// emitted as one tree so a single set can carry the slot layers behind component properties.
// It replaced a `-slots` suffix that built a second set nobody could toggle.
const mergedOf = (name) => (name.endsWith('-merged') ? name.slice(0, -'-merged'.length) : null);

console.log('── 1. specs ' + '─'.repeat(58));
for (const name of names) {
  const spec = `${DIR}${name}-spec.json`;
  const stale = !existsSync(spec) || statSync(spec).mtimeMs < newestProducer;
  if (!stale) { console.log(`  ${name.padEnd(14)} current`); continue; }
  console.log(`  ${name.padEnd(14)} re-measuring (spec predates the pipeline)…`);
  const t = Date.now();
  const mergedBase = mergedOf(name);
  run('build-spec.mjs', mergedBase ? [mergedBase, '--merged'] : [name],
      { stdio: ['ignore', 'ignore', 'inherit'] });
  console.log(`  ${name.padEnd(14)} measured in ${Math.round((Date.now() - t) / 1000)}s`);
}

// ── 2. encode + shard + regenerate the plugin ───────────────────────────────
console.log('\n── 2. payloads ' + '─'.repeat(55));
if (WANT_ICONS) process.stdout.write(run('build-icon-library.mjs', []));
process.stdout.write(run('build-plugin.mjs', names.length ? names : ['--no-components']));

// ── 3. preflight before anyone clicks ──────────────────────────────────────
// Cheaper to fail here than to leave a half-built page behind: a plugin run is not
// atomic the way a use_figma call is.
const index = JSON.parse(readFileSync(`${DIR}shards/index.json`, 'utf8'));
const preflightNames = index.components.flatMap(c =>
  c.shards.length === 1 ? [c.component] : c.shards.map((_, i) => `${c.component}-${i + 1}of${c.shards.length}`));
console.log('\n── 3. preflight ' + '─'.repeat(54));
// With no components, `preflight.mjs` with no arguments checks EVERY payload on disk —
// which would report on whatever was built last, not on this run. An icons-only build has
// nothing here to check: build-icon-library.mjs validates its own payload at generation,
// where the data is, and refuses to write one it cannot vouch for.
if (!preflightNames.length) {
  console.log('  no component payloads in this build — icon payload validated at generation');
} else {
  const pf = spawnSync(process.execPath, ['sync-scripts/preflight.mjs', ...preflightNames], { encoding: 'utf8' });
  process.stdout.write((pf.stdout || '').split('\n').filter(l => /ok |✗|❌|✅/.test(l)).join('\n') + '\n');
  if (pf.status !== 0) {
    console.error('\npreflight failed — not starting the server. Fix the payloads first.');
    process.exit(1);
  }
}

// ── 6. write the returned set ids into the configs ─────────────────────────
/**
 * A component's `figmaSetId` lives in one of two shapes, and the id must land in the
 * one that `check-all` actually reads:
 *   configs/<name>.mjs        — one file per component (avatar, banner, checkbox, …)
 *   component-axes.mjs        — the built-in configs on a single line each
 * Replacements are anchored on the component name so a second component's id can
 * never be overwritten by a loose match.
 */
/**
 * Write a config file WITHOUT changing its modified time.
 *
 * The producers list below treats a newer config as a reason to re-measure, and rightly:
 * an edit to the axes changes what is measured. But recording a built set's Figma id is not
 * such an edit, and it was writing into those same files, so every successful build made
 * the next run re-measure for about six minutes for nothing.
 */
function writeKeepingMtime (path, content) {
  const { atime, mtime } = statSync(path);
  writeFileSync(path, content);
  utimesSync(path, atime, mtime);
}

function writeSetId (component, setId) {
  // A merged build writes `figmaMergedSetId` and deliberately does NOT touch `figmaSetId`: it
  // lands on its own page, and overwriting the id would point every existing check at a set
  // nothing had verified yet.
  const base = component.endsWith('-merged') ? component.slice(0, -'-merged'.length) : null;
  if (base) {
    const key = 'figmaMergedSetId';
    const perFile = `${HERE}/configs/${base}.mjs`;
    if (existsSync(perFile)) {
      let s = readFileSync(perFile, 'utf8');
      s = new RegExp(`${key}:\\s*'[^']*'`).test(s)
        ? s.replace(new RegExp(`${key}:\\s*'[^']*'`), `${key}: '${setId}'`)
        : s.replace(/(\n\s*figmaSetId:\s*'[^']*',)/, `$1\n  ${key}: '${setId}',`);
      writeKeepingMtime(perFile, s);
      return `configs/${base}.mjs (${key})`;
    }
    const axes = `${HERE}/component-axes.mjs`;
    let s = readFileSync(axes, 'utf8');
    const dt = 'Dt' + base[0].toUpperCase() + base.slice(1);
    const line = new RegExp(`(component:\\s*'${dt}'[^\\n]*?${key}:\\s*')[^']*(')`);
    if (line.test(s)) s = s.replace(line, `$1${setId}$2`);
    else {
      const anchor = new RegExp(`(component:\\s*'${dt}'[^\\n]*?figmaSetId:\\s*'[^']*',)`);
      if (!anchor.test(s)) throw new Error(`cannot find a config for ${dt} to attach ${key}`);
      s = s.replace(anchor, `$1 ${key}: '${setId}',`);
    }
    writeKeepingMtime(axes, s);
    return `component-axes.mjs (${key})`;
  }

  const perFile = `${HERE}/configs/${component}.mjs`;
  if (existsSync(perFile)) {
    const before = readFileSync(perFile, 'utf8');
    let s = before;
    if (/figmaSetId:\s*'[^']*'/.test(s)) {
      s = s.replace(/figmaSetId:\s*'[^']*'/, `figmaSetId: '${setId}'`);
    } else if (/^\s*\/\/\s*figmaSetId:.*$/m.test(s)) {
      s = s.replace(/^(\s*)\/\/\s*figmaSetId:.*$/m, `$1figmaSetId: '${setId}',`);
    } else {
      // Insert after `page: '…',` WHEREVER it sits. The previous pattern required a
      // newline before it, so a config written as
      //   component: 'DtPresence', label: '', page: 'Presence',
      // matched nothing at all — and this function then wrote the file back unchanged
      // and reported success. Six components built correctly and check-all refused to
      // start because not one id had been recorded.
      s = s.replace(/(page:\s*'[^']*',)/, `$1\n  figmaSetId: '${setId}',`);
    }
    /**
     * NEVER report a write that did not happen. A silent no-op here costs a whole rebuild
     * to discover, and the failure surfaces far from its cause.
     *
     * "Unchanged because the value is ALREADY this id" is a different thing from
     * "unchanged because nothing matched", and treating them the same made this function
     * throw the moment it was called twice with the same id — which is exactly what
     * incremental reporting does, once from `/progress` and once from the final loop.
     * Checked against the id rather than against a flag, so it is true no matter who
     * wrote it or when.
     */
    if (s === before && !new RegExp(`figmaSetId:\\s*'${setId}'`).test(before)) {
      throw new Error(`could not write figmaSetId into configs/${component}.mjs — `
        + `no 'figmaSetId' and no \`page: '…',\` to anchor to. Set id was ${setId}.`);
    }
    writeKeepingMtime(perFile, s);
    return `configs/${component}.mjs`;
  }

  const axes = `${HERE}/component-axes.mjs`;
  let s = readFileSync(axes, 'utf8');
  const dt = 'Dt' + component[0].toUpperCase() + component.slice(1);
  // Anchor on `component: 'DtX'` and rewrite only the id on that same line.
  const line = new RegExp(`(component:\\s*'${dt}'[^\\n]*?figmaSetId:\\s*')[^']*(')`);
  if (line.test(s)) {
    s = s.replace(line, `$1${setId}$2`);
  } else {
    const noId = new RegExp(`(component:\\s*'${dt}',[^\\n]*?page:\\s*'[^']*',)`);
    if (!noId.test(s)) throw new Error(`cannot find a config for ${dt} in component-axes.mjs`);
    s = s.replace(noId, `$1 figmaSetId: '${setId}',`);
  }
  writeKeepingMtime(axes, s);
  return 'component-axes.mjs';
}

// ── 4/5. serve, and wait for the one manual step ───────────────────────────
const TYPES = { '.json': 'application/json', '.png': 'image/png' };
let resolveReport;
const reported = new Promise((r) => { resolveReport = r; });

/**
 * MAKE ONE COMPONENT'S BUILD DURABLE.
 *
 * Two writes decide whether a built set can be found again: its id in the config, and its
 * payload fingerprint in `built-from.json` so a later check can tell whether it is
 * verifying this payload or an older one. Both used to happen only after the whole run
 * reported, which meant a crash on the last component left nineteen sets on the canvas
 * that nothing on disk could name.
 *
 * Idempotent on purpose. `/progress` calls it as each component lands and the final loop
 * calls it again for every component in the report, so a plugin too old to post progress
 * behaves exactly as it did before, and a plugin that posts both writes the same bytes
 * twice.
 */
function recordBuilt (r) {
  if (!r || !r.setId) return null;
  const where = writeSetId(r.component, r.setId);
  const stamp = existsSync(`${DIR}built-from.json`)
    ? JSON.parse(readFileSync(`${DIR}built-from.json`, 'utf8'))
    : {};
  const entry = index.components.find(c => c.component === r.component);
  stamp[r.component] = {
    setId: r.setId,
    variants: r.variants,
    fingerprints: (entry ? entry.shards : []).map(s => s.fingerprint),
    builder: index.builder || null,
  };
  writeFileSync(`${DIR}built-from.json`, JSON.stringify(stamp, null, 2));
  return where;
}

/** Components that reported individually, so a run that never reaches /results is not lost. */
const progress = [];

const handler = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  /**
   * One component, posted the moment it finished. Deliberately does NOT resolve the run:
   * `/results` is still the signal that the plugin is done, and resolving here would end
   * the run after the first component reported.
   */
  if (req.method === 'POST' && req.url === '/progress') {
    let body = '';
    req.on('data', d => { body += d; });
    req.on('end', () => {
      res.writeHead(200); res.end('ok');
      let one = null;
      try { one = JSON.parse(body).component; } catch (e) { return; }
      if (!one) return;
      progress.push(one);
      const where = recordBuilt(one);
      console.log(`  ${String(one.component).padEnd(18)} ${String(one.built).padStart(4)} built`
        + `  set ${one.setId}${where ? '  → ' + where : '  (NO SET)'}`);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/results') {
    let body = '';
    req.on('data', d => { body += d; });
    req.on('end', () => {
      writeFileSync(`${DIR}plugin-results.json`, body);
      res.writeHead(200); res.end('ok');
      try { resolveReport(JSON.parse(body)); }
      catch (e) { resolveReport({ parseError: String(e), body }); }
    });
    return;
  }

  const rel = normalize(decodeURIComponent((req.url || '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const file = DIR + rel.replace(/^\//, '');
  // .png as well as .json: the plugin fetches the avatar bytes from here, because
  // base64 in the payload would be larger than everything else in a shard combined.
  const ext = extname(file);
  if (!file.startsWith(DIR) || !['.json', '.png'].includes(ext) || !existsSync(file)) {
    res.writeHead(404); return res.end('not found');
  }
  res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream' });
  res.end(readFileSync(file));
};

// Both loopback stacks: `localhost` resolves to ::1 first on macOS, and Figma's
// manifest validator rejects an IP literal in devAllowedDomains — so the plugin must
// fetch `http://localhost:8931`, and an IPv4-only bind would fail in a way that looks
// exactly like the server not running. Loopback only.
const servers = ['127.0.0.1', '::1'].map((host) => {
  const s = createServer(handler);
  s.on('error', (e) => { if (e.code !== 'EADDRNOTAVAIL' && e.code !== 'EAFNOSUPPORT') throw e; });
  s.listen(PORT, host);
  return s;
});

servers[0].on('listening', () => {
  const total = index.components.reduce((a, c) => a + c.variants, 0);
  console.log('\n── 4. serving ' + '─'.repeat(56));
  const what = [`${index.components.length} components, ${total} variants`];
  if (index.icons) what.push(`${index.icons.total} icons`);
  console.log(`  http://localhost:${PORT}  •  ${what.join('  •  ')}`);
  console.log('\n── 5. YOUR TURN ' + '─'.repeat(54));
  console.log('  In the Figma DESKTOP app, in the scratch file:');
  console.log('      Plugins → Development → Dialtone Components Sync');
  console.log('\n  (First time only: Plugins → Development → Import plugin from manifest…');
  console.log('   → plugin/manifest.json)');
  console.log('\n  Waiting for the plugin to report back…  ctrl-C to abandon.');
});

// The plugin now posts `{ runtime, components }` so it can report facts about the
// SANDBOX it ran in, not just what it built — the two runtimes that run this builder have
// already disagreed once (strokesIncludedInLayout, B-82) and a runtime difference is
// invisible from this side. A bare array is still accepted so an older plugin build works.
const posted = await reported;
const report = Array.isArray(posted) ? posted
  : (posted && Array.isArray(posted.components) ? posted.components : null);
const runtime = (posted && !Array.isArray(posted) && posted.runtime) || null;
/**
 * The plugin now posts on its way out of a FAILURE too, carrying whatever it had built.
 * Said plainly and early: a run that reports eleven of twenty components otherwise reads
 * as a run of eleven components, and the nine that are missing look like a choice.
 */
const aborted = (posted && !Array.isArray(posted) && posted.aborted) || null;
if (aborted) {
  console.log(`\n❌ the plugin FAILED partway: ${aborted}`);
  console.log(`   ${(report || []).length} component(s) built before it stopped; their ids and`);
  console.log('   fingerprints are already on disk, so re-running builds only what is missing.');
}
for (const s of servers) s.close();

if (!report) {
  console.error('\nthe plugin POSTed something unparseable:', posted && posted.parseError);
  console.error(((posted && posted.body) || '').slice(0, 400));
  process.exit(1);
}

// ── icons ──────────────────────────────────────────────────────────────────
// Persisted as a NAME -> ID map, because that is what a later component build needs to
// place an instance. Written before the component report so a partial run still leaves the
// library usable, and merged rather than replaced: a rerun of a few shards must not erase
// the ids of icons it did not touch.
const iconReport = (posted && !Array.isArray(posted) && posted.icons) || null;
if (iconReport) {
  console.log('\n── icons ' + '─'.repeat(61));
  const LIB = `${DIR}icon-library.json`;
  let lib = { page: iconReport.page, defaultFillVar: iconReport.defaultFillVar, ids: {} };
  try { lib = { ...lib, ...JSON.parse(readFileSync(LIB, 'utf8')) }; } catch { /* first build */ }
  lib.ids = { ...lib.ids, ...iconReport.ids };
  lib.page = iconReport.page;
  lib.defaultFillVar = iconReport.defaultFillVar;
  writeFileSync(LIB, JSON.stringify(lib, null, 2));
  console.log(`  ${iconReport.built}/${iconReport.expected} on page "${iconReport.page}"`
    + `  (${iconReport.created} new, ${iconReport.updated} updated, ${iconReport.unchanged || 0} untouched)`);
  // An UPDATED icon has had its children replaced, which discards every instance override
  // that pointed at them. Untouched icons keep theirs. Saying which is which is the only
  // warning anyone gets before a component's icons silently revert to the library colour.
  if (iconReport.updated) {
    console.log(`  ⚠ ${iconReport.updated} icon(s) had their artwork replaced — any component `
      + `placing them needs rebuilding, or its icons keep the library's own colour`);
  }
  console.log(`  ${iconReport.boundFills} vector fill(s) bound to `
    + (iconReport.defaultFillVar || 'NOTHING — the default colour variable was not found'));
  console.log(`  ${Object.keys(lib.ids).length} icon id(s) on record -> build-data/icon-library.json`);
  if (iconReport.built !== iconReport.expected) {
    console.log(`  ⚠ ${iconReport.expected - iconReport.built} icon(s) did not build`);
  }
  for (const f of iconReport.failures.slice(0, 10)) console.log(`     ✗ ${f.name}: ${f.error}`);
  if (!iconReport.defaultFillVar) {
    console.log('  ⚠ a bare icon instance will carry a literal black fill, not a themed one');
  }
}

if (runtime) {
  console.log('\n── runtime ' + '─'.repeat(59));
  console.log(`  plugin API ${runtime.apiVersion || '?'}   editor ${runtime.editorType || '?'}`);
  const p = runtime.spreadProbe || {};
  console.log(`  effect spread written 3 → literal ${p.literal}, bound-call ${p.boundCall}, `
    + `on node ${p.bound}, after component conversion ${p.converted}`
    + (p.error ? `  (probe error: ${p.error})` : ''));
}

console.log('\n── 6. set ids ' + '─'.repeat(56));
const built = [];
for (const r of report) {
  if (!r.setId) {
    console.log(`  ${String(r.component).padEnd(9)} NO SET — ${r.built} loose components on ${r.page}.`);
    console.log('             combineAsVariants found a duplicate variant name; nothing written.');
    continue;
  }
  const where = recordBuilt(r);
  console.log(`  ${r.component.padEnd(9)} ${String(r.built).padStart(4)} built  set ${r.setId}  → ${where}`);
  // A real variant's effect spread, before and after combineAsVariants. Says whether a
  // lost spread was never written or was dropped by the combine.
  if (r.spreadBeforeCombine || r.spreadAfterCombine) {
    console.log(`             effect spread: built ${JSON.stringify(r.spreadBeforeCombine)}`
      + ` → after combine ${JSON.stringify(r.spreadAfterCombine)}`);
  }
  // Deliberate trades the builder made, printed HERE rather than buried in the results
  // JSON: each one keeps the pixels right at the cost of a token binding, so it is
  // exactly the kind of thing that should never be discovered later by accident.
  // Synthesised variables are written into the file's VARIABLE SET, not just onto the
  // canvas — the one thing this pipeline does that outlives a page rebuild. Always
  // printed, never buried.
  const dv = r.derivedVars;
  if (dv && (dv.created || dv.updated || dv.reused)) {
    console.log(`             variables: ${dv.created} created, ${dv.updated} updated, `
      + `${dv.reused} unchanged  → "${dv.collection}"`);
  }
  for (const t of (r.provenanceTraded || [])) {
    console.log(`             ! ${t.count}x ${t.kind}`);
    for (const ex of (t.examples || []).slice(0, 2)) console.log(`                 ${ex}`);
  }
  // A font this Figma install does not have. Printed rather than buried: the component
  // renders in the wrong face and looks fine, which is the hardest kind of wrong to notice.
  if ((r.fontFallbacks || []).length) {
    console.log(`             ! font not available, wrote the default instead: ${r.fontFallbacks.join(', ')}`);
  }
  for (const s of (r.skippedBindings || [])) {
    console.log(`             ! ${s.count}x binding skipped (token cannot hold the measured value)`);
    for (const ex of (s.examples || []).slice(0, 2)) console.log(`                 ${ex}`);
  }
  built.push(r.component);
}

// `recordBuilt` has already written each component's id and fingerprint — once as it
// landed, and again in the loop above. This only says so.
if (built.length) {
  console.log(`\n  recorded payload fingerprints → build-data/built-from.json`);
}

// Reported BEFORE the verification guard. Both of these blocks used to sit after it,
// so `--no-verify` — which is how every merged build runs — skipped the only account of
// what had just been built, including the warning that it is unverified. A report that
// vanishes on the path that needs it most is worse than no report.
for (const r of report.filter(x => (x.slots && x.slots.length) || (x.texts && x.texts.length))) {
  console.log(`\n── properties: ${r.component} ` + '─'.repeat(Math.max(4, 45 - r.component.length)));
  for (const sl of r.slots) {
    const bits = [];
    if (sl.boolProp) bits.push(`toggle "${sl.boolProp}"`);
    if (sl.swapAxis && sl.swapCount > 1) bits.push(`${sl.swapCount} swaps, one per ${sl.swapAxis}: ${sl.swapProp}`);
    else if (sl.swapProp) bits.push(`swap "${sl.swapProp}"`);
    if (!bits.length) bits.push('NO PROPERTY CREATED');
    console.log(`  ${sl.slot.padEnd(12)} ${sl.kind.padEnd(12)} ${sl.layers} layer(s)  ${bits.join('  ')}`);
    if (sl.error) console.log(`     ✗ could not add the property: ${sl.error}`);
    if (sl.bindError) console.log(`     ✗ could not bind a layer: ${sl.bindError}`);
    // A swap with no default means the icon was never resolved to a library component, so
    // the designer gets a layer they cannot change. That is a silent downgrade unless said.
    if (sl.swapProp && sl.varies) {
      // The component renders a DIFFERENT default per variant; the set shows one. Stated on
      // every build because no numeric check sees it: an SVG's internals are imported whole
      // and never compared shape-for-shape, so a bell where the browser draws an
      // alert-circle produces no finding. The raster is the only check that would notice.
      console.log(`     ⚠ shows ONE default across all variants, though the component renders `
        + `${sl.varies} different ones (accepted: a panel control was preferred to per-variant `
        + `accuracy here). No numeric check sees this — only the raster.`);
    }
    if (!sl.swapProp) {
      console.log(`     ⚠ no swap property — this slot's content cannot be changed`);
    }
  }
  for (const t of (r.texts || [])) {
    console.log(`  ${('text:' + t.name).padEnd(12)} ${'—'.padEnd(12)} ${t.layers} layer(s)  `
      + (t.prop ? `field "${t.prop}" default "${t.defaultText}"` : 'NO PROPERTY CREATED'));
    if (t.error) console.log(`     ✗ could not add the property: ${t.error}`);
    if (t.bindError) console.log(`     ✗ could not bind a layer: ${t.bindError}`);
  }
  if (r.iconFills && r.iconFills.total) {
    const f = r.iconFills;
    const bad = f.total - f.applied;
    console.log(`  ${('icon fills').padEnd(12)} ${String(f.applied) + '/' + String(f.total)} override(s) took`
      + (f.noVectors ? `, ${f.noVectors} instance(s) exposed no VECTOR` : ''));
    if (bad) {
      console.log(`     ✗ ${bad} instance fill override(s) did NOT stick — the icon keeps the library's colour`);
      for (const e of f.examples) {
        console.log(`        wrote ${JSON.stringify(e.wrote)} read ${JSON.stringify(e.read)} (vectors: ${e.vectors})`);
      }
    }
  }
  if ((r.iconInstanceFailed || []).length) {
    console.log(`  ⚠ ${r.iconInstanceFailed.length} icon id(s) the payload named are not in this file`);
  }
}

// check-all speaks in COMPONENT names: `badge-slots` and `badge-merged` are other builds of
// `badge`, and check-all decides which passes to run from the ids on the config. A merged
// build now HAS a check — `verify-components --merged`, reading `figmaMergedSetId` — so it
// is verified like anything else rather than excluded with a warning.
const toVerify = [...new Set(built.map(n => mergedOf(n) || n))];

// ── 7. verify ──────────────────────────────────────────────────────────────
if (SKIP_VERIFY || !built.length) {
  // "nothing was built" is wrong for an icons-only run, and a misleading summary is how a
  // half-finished build gets mistaken for a finished one.
  const why = SKIP_VERIFY ? ' (--no-verify)'
    : iconReport ? ' (icons have no browser render to verify against)'
    : ' (nothing was built)';
  console.log(`\nskipping verification${why}.`);
  process.exit(built.length === report.length ? 0 : 1);
}
console.log('\n── 7. verifying ' + '─'.repeat(54));
// STREAM it. Capturing stdout buffers every progress line until the child exits, and
// verifying 1,300 variants in two colour modes through a real browser takes tens of
// minutes — so a working run looked indistinguishable from a hung one. Only the exit
// status is needed here, and `inherit` still provides that.
const totalVariants = report.reduce((a, r) => a + (r.variants || 0), 0);
console.log(`  ${built.length} build(s), ${totalVariants} variants, each rendered in light AND dark.`);
console.log('  This is the slow part — expect minutes, not seconds. Progress prints per pass.\n');
// ── slot properties ────────────────────────────────────────────────────────

// check-all speaks in COMPONENT names, not payload names: `badge-slots` is a second build
// of `badge`, and asking check-all about it would throw "unknown component". Map back to
// the base and dedupe — verifying `badge` now also runs its slot pass, because the id this
// run just wrote is exactly what that pass was waiting for.
const chk = spawnSync(process.execPath, ['sync-scripts/check-all.mjs', ...toVerify], { stdio: 'inherit' });

if (WANT_VISUAL) {
  console.log('\n── 8. contact sheets ' + '─'.repeat(49));
  // Use the already-parsed report rather than re-reading the file: its shape changed
  // when the plugin started reporting runtime facts alongside the components.
  for (const r of report.filter(x => x.setId)) {
    const v = spawnSync(process.execPath,
      ['sync-scripts/visual-compare.mjs', r.component, '--set', r.setId, '--limit', '8', '--zoom', '4'],
      { encoding: 'utf8' });
    process.stdout.write('  ' + (v.stdout || v.stderr || '').trim() + '\n');
  }
}

process.exit(chk.status === 0 && built.length === report.length ? 0 : 1);
