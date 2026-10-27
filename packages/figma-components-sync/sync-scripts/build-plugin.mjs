/**
 * Generate a runnable Figma dev plugin that builds the component pages itself.
 *
 * WHY THIS EXISTS
 * The MCP `use_figma` sandbox has no `fetch` (probed: undefined), so a payload can
 * only reach it inside the tool-call string — which makes an assistant the transport
 * for every byte. A REAL Figma plugin does have `fetch` (via manifest
 * networkAccess.devAllowedDomains), so it can pull the payloads from a local server
 * directly. Same builder, same payloads, no copying.
 *
 * `plugin/code.js` is GENERATED from generic-builder.js so the two cannot drift.
 * Six of today's bugs were drift between a versioned file and what actually ran.
 *
 *   node sync-scripts/build-plugin.mjs                     # banner avatar radio
 *   node sync-scripts/build-plugin.mjs badge link toggle …  # any subset
 */
import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync, rmSync, readdirSync} from 'fs';
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { COMPONENTS } from './component-axes.mjs';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const HERE = `${ROOT}/sync-scripts`;
const SHARD_DIR = `${HERE}/build-data/shards`;
const PLUGIN_DIR = `${ROOT}/plugin`;
mkdirSync(PLUGIN_DIR, { recursive: true });
const LIMIT_KB = Number(process.env.LIMIT_KB || 200);   // a plugin fetch has no size problem
// Checkbox and Notice are in the default set because the resolver fixes (identity
// relative colours, multi-part shadow colour, outline as an inner shadow) change what
// they build to — their existing pages predate all three.
const argv = process.argv.slice(2);
// An icons-only build has no components, and "no arguments" already means "the default
// set" — so the empty case needs a way to say so out loud. Without it, `--icons` re-encoded
// five unrelated components and died on a staleness guard that was entirely correct.
const NO_COMPONENTS = argv.includes('--no-components');
const explicit = argv.filter(a => !a.startsWith('--'));
const names = NO_COMPONENTS ? []
  : explicit.length ? explicit
  : ['checkbox', 'notice', 'banner', 'avatar', 'radio'];

// Component shards are regenerated every run, so they are cleared. Icon shards are NOT:
// they are produced by build-icon-library.mjs, which runs BEFORE this script so that its
// manifest can reach index.json — wiping the directory deleted the payload this run was
// about to serve.
mkdirSync(SHARD_DIR, { recursive: true });
for (const f of readdirSync(SHARD_DIR)) {
  if (!/^icons-/.test(f)) rmSync(`${SHARD_DIR}/${f}`, { recursive: true, force: true });
}

const enc = (name, extra = []) =>
  execFileSync(process.execPath, ['sync-scripts/encode-build.mjs', name, ...extra], { cwd: ROOT });
const built = (name, k, n) =>
  `${HERE}/build-data/${name}${n > 1 ? `-${k}of${n}` : ''}-build.json`;

/**
 * The description a hand-built set carries ("DtChip. Props: variant (default | people), …
 * Slots: …"), written from the axes and slots this set was actually built from, so it
 * cannot drift from them.
 */
function describeSet (name, page, slotKeys) {
  const cfg = COMPONENTS[name] || COMPONENTS[name.replace(/-(merged|slots)$/, '')];
  if (!cfg) return null;
  const values = (vals) => {
    const nums = vals.every(v => typeof v === 'number');
    return nums && vals.length > 2 ? `${vals[0]} to ${vals[vals.length - 1]}` : vals.join(' | ');
  };
  const label = (key) => key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase().replace(/^./, c => c.toUpperCase());
  const props = Object.entries(cfg.axes).map(([axis, vals]) => `${axis} (${values(vals)})`).join(', ');
  const order = Object.keys(cfg.axes);
  const rank = (k) => (order.includes(k) ? order.indexOf(k) : order.length);
  const slots = [...slotKeys].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b)).map(label);
  return `Dt${page}. Props: ${props}.`
    + (slots.length ? ` Slots: ${slots.join(', ')} (icon swaps), label.` : ' Slots: label.');
}

const manifest = [];
for (const name of names) {
  enc(name);
  // Shard only if a single payload is genuinely unwieldy. With fetch there is no
  // per-call ceiling, so this is about plugin memory, not transport.
  let shards = Math.max(1, Math.ceil(statSync(built(name, 1, 1)).size / 1024 / LIMIT_KB));
  if (shards > 1) for (let k = 1; k <= shards; k++) enc(name, [`--shard=${k}/${shards}`]);

  let offset = 0;
  const entry = { component: name, shards: [] };
  const slotKeys = new Set();
  for (let k = 1; k <= shards; k++) {
    const src = built(name, k, shards);
    const p = JSON.parse(readFileSync(src, 'utf8'));
    const file = `${name}-${k}of${shards}.json`;
    const body = JSON.stringify(p);
    writeFileSync(`${SHARD_DIR}/${file}`, body);
    entry.page = p.page;
    for (const n of p.nodes) { if (n.sl) slotKeys.add(n.sl); if (n.sw) slotKeys.add(n.sw); }
    // A CONTENT FINGERPRINT per shard. The pipeline already refuses a spec older than
    // the code that produced it, but nothing said whether the Figma set on screen was
    // built from the payload now on disk — and after a long session that question came
    // up repeatedly with no way to answer it except guessing from timestamps. run-batch
    // records these on a successful build; check-all compares them before verifying, so
    // "am I checking stale work?" becomes a check instead of a hunch.
    entry.shards.push({ file, clear: k === 1, indexOffset: offset, rows: p.rows.length,
                        fingerprint: createHash('sha256').update(body).digest('hex').slice(0, 12) });
    offset += p.rows.length;
  }
  entry.variants = offset;
  entry.description = describeSet(name, entry.page, slotKeys);
  manifest.push(entry);
  console.log(`${name.padEnd(9)} page=${entry.page.padEnd(9)} ${offset} variants in ${shards} shard(s)`);
}
// The BUILDER's own fingerprint, alongside the payloads'. What lands on the canvas is a
// function of both, and the payload hash alone said "no rebuild needed" for three
// components whose output had in fact changed — the spread fix and the layout rewrite are
// builder edits, not data edits. A staleness guard that only watches the data answers a
// narrower question than the one being asked.
const builderHash = createHash('sha256')
  .update(readFileSync(`${HERE}/generic-builder.js`))
  // icon-builder.js lands on the canvas too, so it is part of what the fingerprint is
  // answering for. Watching only one of the two builders answers a narrower question.
  .update(readFileSync(`${HERE}/icon-builder.js`))
  .update(readFileSync(`${HERE}/slot-properties.js`)).digest('hex').slice(0, 12);
// The icon library is OPTIONAL and independent: it is built once, and every later
// component build reads its ids rather than rebuilding it. Its absence is normal.
let icons = null;
try { icons = JSON.parse(readFileSync(`${HERE}/build-data/icons-manifest.json`, 'utf8')); }
catch { /* not generated; components build without it */ }
writeFileSync(`${SHARD_DIR}/index.json`,
  JSON.stringify({ builder: builderHash, components: manifest, icons }, null, 2));

// ── generate code.js from the versioned builder ─────────────────────────────
const builder = readFileSync(`${HERE}/generic-builder.js`, 'utf8');
const iconBuilder = readFileSync(`${HERE}/icon-builder.js`, 'utf8');
const slotProps = readFileSync(`${HERE}/slot-properties.js`, 'utf8');
// Keep only the buildShard function; the trailing SHARDS loop is replaced by the
// plugin's own fetch-driven orchestration.
const fn = builder.slice(builder.indexOf('async function buildShard'), builder.lastIndexOf('const results = []'));

writeFileSync(`${PLUGIN_DIR}/code.js`, `/**
 * GENERATED by sync-scripts/build-plugin.mjs — do not edit.
 * The builder body below is copied verbatim from sync-scripts/generic-builder.js.
 */
// localhost, not 127.0.0.1: Figma's manifest validator rejects an IP literal in
// devAllowedDomains (Invalid value ... must be a valid URL), and a fetch has to match
// an allowlisted entry. The server binds BOTH loopback stacks, because localhost
// resolves to ::1 first on macOS and an IPv4-only bind would look like "server down".
const BASE = 'http://localhost:8931';

figma.showUI(__html__, { width: 360, height: 420 });

${fn}
${iconBuilder}
${slotProps}
/**
 * DOES THIS RUNTIME KEEP AN EFFECT'S SPREAD?
 *
 * Every remaining shadow finding is "expected N, got 0", and only where the builder
 * writes a RAW effect — where it applies an effect STYLE instead, the spread is right,
 * because a style holds its own numbers and the plugin only writes an id. Isolation
 * through \`use_figma\` says the write, the variable binding and the component conversion
 * all preserve spread perfectly. So the suspicion is the same one that produced B-82:
 * this runtime is not that runtime. Rather than guess, measure it HERE and report it.
 *
 * Three points, so the answer says WHERE a lost spread is lost rather than just that it
 * is: what a bare write reads back, what a built component holds before combining, and
 * what it holds after combineAsVariants.
 */
async function probeSpreadWrite () {
  try {
    // Non-zero on EVERY geometric field. Every shadow in the components built so far has
    // radius 0 and offset 0,0, so their data cannot say whether the runtime drops those
    // too — only that it drops spread. Ask directly instead of assuming.
    const mk = () => ({ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 1 },
      offset: { x: 2, y: 3 }, radius: 5, spread: 3, visible: true, blendMode: 'NORMAL' });
    // Concatenation, not a template literal: this function is generated INSIDE one, so a
    // dollar-brace here would be interpolated away by the generator (node --check on the
    // output is what catches it — the third time this file has bitten that way).
    const geom = (e) => (e ? 'spread ' + e.spread + ' radius ' + e.radius
      + ' offset ' + (e.offset ? e.offset.x + ',' + e.offset.y : '?') : 'none');
    const f = figma.createFrame();
    f.resize(20, 20);

    f.effects = [mk()];
    const literal = geom(f.effects[0]);

    // The builder's real path: bind the colour to a variable, then assign.
    let bound = null, boundCall = null, repaired = null;
    const vars = await figma.variables.getLocalVariablesAsync();
    const v = vars.find(x => x.resolvedType === 'COLOR');
    if (v && typeof figma.variables.setBoundVariableForEffect === 'function') {
      const e = figma.variables.setBoundVariableForEffect(mk(), 'color', v);
      boundCall = geom(e);              // what the call itself returned
      f.effects = [e];
      bound = geom(f.effects[0]);       // what the node kept
      // and the builder's repair: restore the geometry the call discarded
      const src = mk();
      f.effects = [{ ...e, offset: src.offset, radius: src.radius, spread: src.spread }];
      repaired = geom(f.effects[0])
        + (Object.keys((f.effects[0].boundVariables || {})).length ? ' (binding kept)' : ' (BINDING LOST)');
    }

    // and through the conversion every variant goes through
    const comp = figma.createComponentFromNode(f);
    const converted = geom(comp.effects[0]);
    comp.remove();
    return { wrote: 'spread 3 radius 5 offset 2,3', literal, boundCall, bound, repaired, converted };
  } catch (e) {
    return { error: String(e && e.message ? e.message : e) };
  }
}

const spreadsOf = (node) => (node && node.effects ? node.effects.map(e => e.spread) : null);
const firstWithEffects = (nodes) => nodes.find(c => c.effects && c.effects.length) || null;

/**
 * MODULE SCOPE, so the failure handler at the bottom can still post what was built.
 *
 * These lived inside main(), which meant a throw on the twentieth component discarded the
 * set ids of the nineteen that had succeeded: the canvas held them and nothing on disk knew
 * their ids, so the next run could not tell a built set from an absent one.
 */
var runReport = [];
var runRuntime = null;
var runIcons = null;

async function main () {
  const runtime = { apiVersion: figma.apiVersion || null, editorType: figma.editorType || null,
                    spreadProbe: await probeSpreadWrite() };
  runRuntime = runtime;
  const index = await (await fetch(BASE + '/shards/index.json')).json();
  const report = runReport;

  // Icons FIRST: a component that places an icon instance needs the icon component to
  // exist. Skipped entirely when no icon manifest was generated.
  let iconReport = null;
  if (index.icons) {
    const ids = {};
    let created = 0, updated = 0, unchanged = 0, boundFills = 0, defaultFillVar = null;
    const failures = [];
    for (const s of index.icons.shards) {
      const D = await (await fetch(BASE + '/shards/' + s.file)).json();
      figma.notify('icons ' + s.file, { timeout: 400 });
      const r = await buildIcons({ D });
      Object.assign(ids, r.ids);
      created += r.created; updated += r.updated; unchanged += r.unchanged || 0; boundFills += r.boundFills;
      defaultFillVar = r.defaultFillVar;
      for (const f of r.failures) failures.push(f);
    }
    iconReport = runIcons = { page: index.icons.page, expected: index.icons.total,
                   created, updated, unchanged, boundFills, defaultFillVar,
                   built: Object.keys(ids).length, ids, failures };
  }

  for (const comp of index.components) {
    let total = 0;
    const skipped = [];
    const traded = [];
    // Accumulated across shards: each shard carries only the derived variables it uses,
    // and the second shard legitimately finds the first shard's already created.
    const derived = { created: 0, updated: 0, reused: 0, collection: null };
    // Slot layers from every shard. Their component properties can only be added once the
    // variant SET exists, which is after all shards have built.
    const slotLayers = [];
    const textLayers = [];
    const iconFailed = [];
    /** Fonts this Figma install does not have, so the text was written in the default. */
    const fontFallbacks = [];
    const iconFills = { total: 0, applied: 0, noVectors: 0, examples: [] };
    for (const s of comp.shards) {
      const D = await (await fetch(BASE + '/shards/' + s.file)).json();
      figma.notify(comp.component + ' ' + s.file, { timeout: 400 });
      const r = await buildShard({ D, CLEAR: s.clear, INDEX_OFFSET: s.indexOffset });
      total += r.built;
      for (const L of (r.slotLayers || [])) slotLayers.push(L);
      for (const L of (r.textLayers || [])) textLayers.push(L);
      for (const f of (r.iconInstanceFailed || [])) iconFailed.push(f);
      if (r.iconFills) {
        iconFills.total += r.iconFills.total;
        iconFills.applied += r.iconFills.applied;
        iconFills.noVectors += r.iconFills.noVectors;
        for (const e of r.iconFills.examples) if (iconFills.examples.length < 3) iconFills.examples.push(e);
      }
      // A skipped binding means a token could not hold its measured value. Carry it into
      // the report rather than letting it vanish inside the shard result.
      for (const ff of (r.fontFallbacks || [])) if (!fontFallbacks.includes(ff)) fontFallbacks.push(ff);
      if (r.skippedBindingCount) {
        skipped.push({ file: s.file, count: r.skippedBindingCount, examples: r.skippedBindings });
      }
      // Provenance deliberately given up to keep the render right: an effect style whose
      // numbers disagreed with the measurement, or a multi-layer shadow whose single
      // token belongs to no identifiable layer. Both are correct choices and both cost
      // a binding, so both are reported.
      if (r.styleRejectedCount) {
        traded.push({ file: s.file, kind: 'effect style numbers disagree',
                      count: r.styleRejectedCount, examples: r.styleRejected });
      }
      if (r.unattributedShadowTokenCount) {
        traded.push({ file: s.file, kind: 'shadow token not attributable to a layer',
                      count: r.unattributedShadowTokenCount, examples: r.unattributedShadowTokens });
      }
      // B-90: this runtime dropped an effect's spread on assignment. Repaired means the
      // second write took; lost means it did not and the shadow is wrong on the canvas.
      if (r.effectSpreadRepairedCount) {
        traded.push({ file: s.file, kind: 'effect spread dropped by the runtime, repaired',
                      count: r.effectSpreadRepairedCount, examples: [] });
      }
      if (r.derivedVars) {
        derived.created += r.derivedVars.created || 0;
        derived.updated += r.derivedVars.updated || 0;
        derived.reused += r.derivedVars.reused || 0;
        if (r.derivedVars.collection) derived.collection = r.derivedVars.collection;
      }
      if (r.effectSpreadLostCount) {
        traded.push({ file: s.file, kind: 'EFFECT SPREAD LOST — not repairable in this runtime',
                      count: r.effectSpreadLostCount, examples: r.effectSpreadLost });
      }
    }

    // Combine into one variant set. Names come from the "prop=value, …" component
    // names the builder writes, so the axis names carry over untouched.
    const page = figma.root.children.find(p => p.name === comp.page);
    await figma.setCurrentPageAsync(page);
    const loose = page.children.filter(c => c.type === 'COMPONENT');
    // What a REAL built variant's effect holds, before anything is combined.
    const spreadBeforeCombine = spreadsOf(firstWithEffects(loose));
    let setId = null, variants = 0, properties = [], spreadAfterCombine = null, slotReport = null, textReport = null;
    if (loose.length) {
      const set = figma.combineAsVariants(loose, page);
      // Match the sets already built by hand: DtNotice, DtBanner, DtRadio, DtLink…
      // Naming it after the page instead would leave the file with two conventions.
      set.name = 'Dt' + comp.page;
      if (comp.description) set.description = comp.description;
      set.x = 0; set.y = 0;
      setId = set.id; variants = set.children.length;
      spreadAfterCombine = spreadsOf(firstWithEffects(set.children));
      // Reporting the property names is a nicety; it must never be able to end the run.
      // componentPropertyDefinitions THROWS on a set Figma considers malformed, and
      // optional chaining does not help because the getter itself raises. A whole batch
      // died here after Badge, leaving three components untouched.
      try { properties = Object.keys(set.componentPropertyDefinitions || {}); }
      catch (e) { properties = ['<unreadable: ' + (e && e.message ? e.message : e) + '>']; }

      const applied = await applySlotProperties(set, slotLayers, textLayers);
      slotReport = applied.slots;
      textReport = applied.texts;
    }
    report.push({ component: comp.component, page: comp.page, built: total, setId, variants, properties,
                  fontFallbacks: fontFallbacks,
                  skippedBindings: skipped, provenanceTraded: traded, derivedVars: derived,
                  spreadBeforeCombine, spreadAfterCombine, slots: slotReport, texts: textReport,
                  iconInstanceFailed: [...new Set(iconFailed)].slice(0, 10), iconFills });
    /**
     * POST THIS ONE NOW, rather than all of them at the end.
     *
     * The end-of-run POST is still sent and is still what tells run-batch the plugin is
     * done. This is about what survives when the run does NOT reach the end: a set id that
     * has been written to disk can be verified, rebuilt, or cleaned up later, and one that
     * only exists on the canvas cannot be told apart from a set that was never built.
     *
     * Failure here is deliberately ignored. The server may have been stopped, and losing
     * the incremental copy of a report that the final POST also carries is not a reason to
     * abandon a build that is going fine.
     */
    try {
      await fetch(BASE + '/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runtime: runtime, component: report[report.length - 1] }),
      });
    } catch (e) { /* server gone, or the run is being watched rather than driven */ }
  }

  // POST the result back so the set ids can be wired into the configs without
  // anyone reading them off the screen.
  try {
    await fetch(BASE + '/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ runtime, components: report, icons: iconReport }),
    });
  } catch (e) { /* server may be gone; the closePlugin message still carries it */ }

  const lines = report.map(r => r.page + ': ' + r.built + ' built, set ' + r.setId);
  if (iconReport) {
    lines.unshift('Icons: ' + iconReport.built + '/' + iconReport.expected + ' ('
      + iconReport.created + ' new, ' + iconReport.updated + ' updated'
      + (iconReport.failures.length ? ', ' + iconReport.failures.length + ' FAILED' : '') + ')');
  }
  figma.ui.postMessage({ type: 'result', lines, report, iconReport: iconReport || null });
}

/**
 * A FAILED RUN REPORTS WHAT IT BUILT.
 *
 * This used to close the plugin with the message and post nothing, so a JS error anywhere
 * in the build threw away every component that had already succeeded. run-batch then sat
 * waiting for a POST that was never coming.
 */
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'close') { figma.closePlugin(); return; }
  if (msg.type !== 'build') return;
  await main().catch(async (e) => {
    const msgText = (e && e.message ? e.message : String(e));
    try {
      await fetch(BASE + '/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runtime: runRuntime, components: runReport, icons: runIcons,
                               aborted: msgText }),
      });
    } catch (e2) { /* nothing left to try */ }
    figma.ui.postMessage({ type: 'error', error: 'FAILED after ' + runReport.length + ' component(s): ' + msgText });
  });
};
`);

writeFileSync(`${PLUGIN_DIR}/manifest.json`, JSON.stringify({
  name: 'Dialtone Components Sync',
  id: 'dialtone-components-sync',
  api: '1.0.0',
  main: 'code.js',
  ui: 'ui.html',
  editorType: ['figma'],
  networkAccess: {
    allowedDomains: ['none'],
    // Only the documented form. An IP literal is rejected outright by the validator,
    // and one bad entry fails the whole manifest — it is not skipped.
    devAllowedDomains: ['http://localhost:8931'],
    reasoning: 'Reads locally generated component build payloads from a dev server on this machine.',
  },
}, null, 2));

console.log(`\nwrote plugin/{manifest.json,code.js}`);
console.log(`wrote ${manifest.reduce((a, c) => a + c.shards.length, 0)} shard payload(s) + index.json to sync-scripts/build-data/shards/`);
