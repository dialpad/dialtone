/**
 * Check a build payload BEFORE it is pasted into Figma.
 *
 * Writing first and inspecting after is how the 100x100 dot, the 1200px checkbox and
 * the negative padding all reached the canvas. Every failure mode found that way is
 * an assertion here, so the next one is caught before anything is created.
 *
 *   node sync-scripts/preflight.mjs notice checkbox radio banner avatar
 */
import './pin-cwd.mjs';   // launch directory must not matter
import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import { fetchPublishedTokenKeys } from './library-tokens.mjs';

const TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
const FILE_KEY = process.env.FILE_KEY;
if (!TOKEN || !FILE_KEY) throw new Error('PERSONAL_ACCESS_TOKEN and FILE_KEY required');

const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables/local`,
  { headers: { 'X-Figma-Token': TOKEN } });
if (!res.ok) throw new Error(`variables fetch -> ${res.status}`);
const META = (await res.json()).meta;
const VM = META.variables;
const varNames = new Set(Object.values(VM).map(v => v.name));

// This file links the Dialtone Design Tokens library rather than owning the
// variables locally — see library-tokens.mjs. A name resolvable that way is just
// as buildable as a local one, so it counts here too.
for (const name of (await fetchPublishedTokenKeys(TOKEN, process.env.TOKENS_FILE_KEY)).keys()) {
  varNames.add(name);
}

// No names is a usage error: the loop below would check nothing and print "all payloads clean".
if (!process.argv.slice(2).length) {
  console.error('usage: preflight.mjs <component…>');
  process.exit(2);
}

let failed = 0;
for (const name of process.argv.slice(2)) {
  const path = `sync-scripts/build-data/${name}-build.json`;
  if (!existsSync(path)) { console.log(`${name}: NO PAYLOAD at ${path}`); failed++; continue; }
  const D = JSON.parse(readFileSync(path, 'utf8'));
  const problems = [];
  const note = (label, list) => { if (list.length) problems.push(`${label}: ${list.length}  e.g. ${list.slice(0, 2).join(' | ')}`); };

  // 1. every token must exist, or the builder throws on the first node that uses it
  note('token missing from Figma', D.toks.filter(t => t && !varNames.has(t)));

  // 2. Figma rejects a negative padding outright
  note('negative padding', D.nodes.filter(n => ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight']
    .some(k => n[k] && n[k][0] < 0)).map(n => n.n));

  // 3. A CHILDLESS FRAME WITH A ZERO BOX. The builder resizes to `box[0] || 1`, so a zero
  //    measurement becomes a phantom 1x1 node that nothing in the DOM corresponds to.
  //
  //    This was two rules. One required the frame to paint nothing as well, which let a
  //    painted zero-box frame through for no reason; the other required auto-layout, which
  //    was the narrower half of the same failure. Both were describing `resize(1,1)`.
  //
  //    NOT gated on hug: the builder demotes any frame with no layout children to
  //    layoutMode NONE and resizes it to its measured box, so a childless auto-layout frame
  //    with a real box is correct. Asserting otherwise flagged 9 correct Avatar nodes.
  note('childless frame with a zero box', D.nodes.filter(n => n.t === 'FRAME'
    && !(n.kids || []).length && (!n.box[0] || !n.box[1]))
    .map(n => `${n.n} ${n.box.join('x')}`));

  // 4. createNodeFromSvg needs parseable source. Sources are INTERNED in D.svgs and
  // referenced by index, so the check has to resolve through that table — reading
  // n.svg went stale the moment the encoder started deduplicating them, and every
  // component failed on sources that were in fact present and valid.
  note('SVG node with no usable source', D.nodes.filter(n => n.t === 'SVG')
    .filter(n => {
      const src = (D.svgs || [])[n.s];
      return !(src && /<svg[\s>]/i.test(src) && /<\/svg>/i.test(src));
    }).map(n => n.n));

  // 5. A missing `rel` now MEANS [0,0] — the encoder omits a zero offset rather than
  // spelling it out on every node, and the builder defaults it. So the real defect is
  // a malformed coordinate, not an absent one.
  note('malformed rel', D.nodes.filter(n => n.rel !== undefined
    && !(Array.isArray(n.rel) && n.rel.length === 2 && n.rel.every(v => typeof v === 'number' && Number.isFinite(v))))
    .map(n => `${n.n} ${JSON.stringify(n.rel)}`));

  // 6. combineAsVariants requires distinct names, and silently mangles duplicates.
  //
  //    Checked against `rowNames`, which is what the builder actually writes. This used to
  //    re-derive the name from `axisVals`, and the two are NOT the same string: DtBadge's
  //    `decoration` axis maps '' to 'none', so the authoritative name is `decoration=none`
  //    while the derived one is `decoration=`. The assertion was validating a name Figma
  //    never sees, so a genuine collision in `rowNames` would have passed it. Rule 11 was
  //    already reading the right field; this one was not.
  const authoritativeNames = D.rowNames || D.rows.map(([combo]) =>
    D.axisNames.map((a, k) => `${a}=${D.axisVals[k][combo[k]]}`).join(', '));
  const dupes = authoritativeNames.filter((x, i) => authoritativeNames.indexOf(x) !== i);
  note('duplicate variant name', [...new Set(dupes)]);

  // 7. every row must resolve every axis; an out-of-range index yields "prop=undefined"
  note('unresolved axis value', D.rows.filter(([combo]) =>
    combo.some((v, k) => D.axisVals[k][v] === undefined)).map(([c]) => JSON.stringify(c)));

  // 8. a text node with nothing in it renders as a blank box
  note('empty TEXT node', D.nodes.filter(n => n.t === 'TEXT' && !(n.tx || '').trim()).map(n => n.n));

  // 9. A fully transparent node that also holds NOTHING contributes neither paint nor
  //      layout, and is a capture mistake. Transparency alone is not: DtButton's loading
  //      state sets `opacity: 0` on `.base-button__label` while leaving it in flow, so
  //      the button keeps its width while the spinner shows — and Figma needs that node
  //      for the same reason. Measured across the 560 Button variants, transparent-node
  //      presence matches `loading=true` exactly, 0 mismatches.
  //      The original rule asserted "nothing is deliberately opacity 0", which is a claim
  //      about Dialtone that Dialtone does not honour — the same mistake as exempting
  //      `outline` on the belief that focus is always a box-shadow.
  note('fully transparent AND empty node', D.nodes.filter(n =>
    n.opacity && n.opacity[0] === 0
    && !(n.kids || []).length
    && !(n.tx || '').trim()).map(n => n.n));

  // 10. Figma cannot hold an EMPTY variant property value. Given `decoration=` it does
  //     not reject the component — it silently rewrites the name to
  //     `Property 1=type=default, …`, so the set ends up with two different property key
  //     shapes and is permanently malformed: every later read of
  //     componentPropertyDefinitions throws "Component set has existing errors", which is
  //     what killed a whole plugin run after Badge. Rule 7 (duplicate names) and rule 8
  //     (unresolved axis value) both pass, because '' is neither duplicated nor undefined.
  note('variant name with an empty value', authoritativeNames.filter(n =>
    n.split(',').some(seg => {
      const eq = seg.indexOf('=');
      return eq < 0 || !seg.slice(eq + 1).trim();
    })).slice(0, 200));

  // 11. rowNames must line up with rows, or variants get each other's names
  if (D.rowNames && D.rowNames.length !== D.rows.length) {
    problems.push(`rowNames/rows length mismatch: ${D.rowNames.length} vs ${D.rows.length}`);
  }

  // 12. SYNTHESISED variables are written into the file's variable set, not just onto
  //     the canvas, so they get the same scrutiny as anything else. A duplicate name with
  //     different values would make the second write silently overwrite the first; a
  //     missing mode value would leave the variable half-defined and resolve to black.
  {
    const byName = new Map();
    const bad = [];
    for (const dv of (D.dvars || [])) {
      const ok = Array.isArray(dv.light) && dv.light.length === 4
        && Array.isArray(dv.dark) && dv.dark.length === 4
        && dv.light.every(Number.isFinite) && dv.dark.every(Number.isFinite);
      if (!ok) { bad.push(`${dv.name}: malformed values`); continue; }
      if (!/^derived\//.test(dv.name || '')) bad.push(`${dv.name}: not namespaced under derived/`);
      if (!String(dv.desc || '').startsWith('DERIVED')) bad.push(`${dv.name}: description does not start with DERIVED`);
      const prev = byName.get(dv.name);
      const sig = dv.light.join(',') + '|' + dv.dark.join(',');
      if (prev && prev !== sig) bad.push(`${dv.name}: same name, two different colour pairs`);
      byName.set(dv.name, sig);
      // A variable whose two modes are equal earns nothing a literal could not do.
      if (dv.light.join(',') === dv.dark.join(',')) bad.push(`${dv.name}: light and dark are identical`);
    }
    note('derived variable problem', bad);
  }

  // 13. Every referenced IMAGE must exist where the plugin will fetch it. The bytes are
  //     served from build-data/assets/, so a missing file surfaces as an HTTP 404 in the
  //     middle of a build — after the page has been cleared — instead of here, before
  //     anyone clicks.
  note('image source not on disk', (D.imgs || [])
    .filter(src => !existsSync(`sync-scripts/build-data/assets/${String(src).replace(/^\//, '')}`))
    .map(src => `${src} (expected at build-data/assets/)`));

  const widths = [...new Set(D.rows.map(r => D.nodes[r[1]].box[0]))].sort((a, b) => a - b);
  const status = problems.length ? 'FAIL' : 'ok';
  if (problems.length) failed++;
  console.log(`\n${name.padEnd(10)} ${status}  ${D.rows.length} variants, ${D.nodes.length} nodes, `
    + `${D.toks.length} tokens, ${(D.dvars || []).length} synthesised, `
    + `root width ${widths[0]}–${widths[widths.length - 1]}`);
  for (const p of problems) console.log(`   ✗ ${p}`);
}
console.log(failed ? `\n❌ ${failed} payload(s) with problems` : '\n✅ all payloads clean');
process.exit(failed ? 1 : 0);
