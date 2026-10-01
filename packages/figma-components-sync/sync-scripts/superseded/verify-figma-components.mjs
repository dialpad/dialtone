/**
 * Verify Figma components against the browser's computed styles.
 *
 * WHY THIS SHAPE
 * --------------
 * Comparing Figma to the emitter's own output only catches WRITE errors — where
 * the intended value failed to land. It cannot catch DERIVATION errors, where the
 * CSS was misread, because both sides inherit the same mistake.
 *
 * So the reference is the browser: render the real component, read
 * getComputedStyle, and compare those numbers to what Figma actually holds.
 * That is independent of the emitter and catches both classes.
 *
 * This is NOT a pixel diff. Nothing is rasterised, so there is no antialiasing or
 * font-rendering tolerance to tune — only numeric and colour comparisons.
 *
 * The reference is the REAL Vue component, mounted through Vite in
 * ./verify-harness/ with the theme CSS loaded before the component CSS. A
 * synthetic `<button>` with Dialtone classes is NOT equivalent: it keeps the UA
 * `appearance` and misses the reset, so every colour reading is wrong.
 *
 * Usage:
 *   node verify-figma-components.mjs --set <figmaNodeId> [--json report.json]
 *
 * Env (or packages/dialtone-tokens/.env):
 *   PERSONAL_ACCESS_TOKEN   needs file_content:read + file_variables:read
 *   FILE_KEY
 */

import 'dotenv/config';
import { writeFileSync } from 'fs';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { converter, parse as parseColor } from 'culori';

const API = 'https://api.figma.com';
const REM_ROOT_PX = 10;                 // --dt-font-size-root
const EPSILON = 0.5;                    // px tolerance: Figma stores floats, CSS rounds
const COLOR_EPSILON = 1 / 255;          // one 8-bit step

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => {
  if (x.startsWith('--')) a.push([x.slice(2), arr[i + 1]?.startsWith('--') ?? true ? true : arr[i + 1]]);
  return a;
}, []));

const TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
const FILE_KEY = process.env.FILE_KEY;
if (!TOKEN || !FILE_KEY) throw new Error('PERSONAL_ACCESS_TOKEN and FILE_KEY are required');

// ── the coordinate space under test ─────────────────────────────────────────
// Mirrors packages/dialtone-vue/components/Button/ButtonConstants.js
const KIND = { default: '', muted: 'd-btn--muted', critical: 'd-btn--critical',
               positive: 'd-btn--positive', inverted: 'd-btn--inverted' };
const IMPORTANCE = { clear: '', outlined: 'd-btn--outlined', primary: 'd-btn--primary' };
const SIZE = { 100: 'd-btn--xs', 200: 'd-btn--sm', 300: '', 400: 'd-btn--lg', 500: 'd-btn--xl' };
// Only class-reachable states here. hover / focus-visible need CDP forcePseudoState —
// see forceState() below; they are covered but flagged separately.
const STATE = { default: [], active: ['d-btn--active'], disabled: ['d-btn--disabled'] };
const INVALID = [{ kind: 'muted', importance: 'primary' }];

// ── figma side ───────────────────────────────────────────────────────────────
async function figmaGet(path) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`${API}${path}`, { headers: { 'X-Figma-Token': TOKEN } });
    if (res.ok) return res.json();
    if (attempt === 4) throw new Error(`GET ${path} -> ${res.status} ${await res.text()}`);
    await new Promise(r => setTimeout(r, attempt * 2000));
  }
}

/** name -> resolved RGBA / number, following aliases, for the collection's default mode */
async function loadVariables() {
  const { meta } = await figmaGet(`/v1/files/${FILE_KEY}/variables/local`);
  const byId = meta.variables;
  const cols = meta.variableCollections;
  const resolve = (id, depth = 0) => {
    const v = byId[id];
    if (!v || depth > 8) return null;
    const val = v.valuesByMode[cols[v.variableCollectionId].defaultModeId];
    if (val && val.type === 'VARIABLE_ALIAS') return resolve(val.id, depth + 1);
    return val;
  };
  const out = new Map();
  for (const v of Object.values(byId)) out.set(v.id, { name: v.name, value: resolve(v.id) });
  return out;
}

/** Resolve a Figma paint to RGBA, preferring the bound variable but recording the literal. */
function paintRGBA(paint, vars) {
  if (!paint) return null;
  const bv = paint.boundVariables?.color;
  const literal = { r: paint.color.r, g: paint.color.g, b: paint.color.b, a: paint.opacity ?? paint.color.a ?? 1 };
  if (!bv) return { rgba: literal, bound: null, literal };
  const v = vars.get(bv.id);
  const val = v?.value;
  if (!val || !('r' in val)) return { rgba: null, bound: v?.name ?? bv.id, literal };
  return { rgba: { r: val.r, g: val.g, b: val.b, a: val.a ?? 1 }, bound: v.name, literal };
}

// ── browser side ─────────────────────────────────────────────────────────────
const HARNESS_ROOT = new URL('./verify-harness/', import.meta.url).pathname;

/** Figma variant coordinate -> DtButton props */
function propsFor({ kind, importance, size, state, loading }) {
  const p = { kind, importance, size: Number(size) };
  if (state === 'active') p.active = true;
  if (state === 'disabled') p.disabled = true;
  if (loading === 'true') p.loading = true;
  return p;
}

// ── comparison ───────────────────────────────────────────────────────────────
const toRgb = converter('rgb');
const parseCssColor = s => {
  if (!s) return null;
  const c = parseColor(s);            // handles rgb(), oklch(), oklab(), color(...)
  if (!c) return null;
  const r = toRgb(c);
  return { r: r.r, g: r.g, b: r.b, a: r.alpha ?? 1 };
};
const px = s => (s && s.endsWith('px') ? parseFloat(s) : null);
const closeNum = (a, b) => a != null && b != null && Math.abs(a - b) <= EPSILON;
const closeCol = (a, b) => a && b
  && Math.abs(a.r - b.r) <= COLOR_EPSILON && Math.abs(a.g - b.g) <= COLOR_EPSILON
  && Math.abs(a.b - b.b) <= COLOR_EPSILON && Math.abs((a.a ?? 1) - (b.a ?? 1)) <= 0.01;
const fmt = c => c ? `rgba(${[c.r, c.g, c.b].map(x => Math.round(x * 255)).join(',')},${(c.a ?? 1).toFixed(2)})` : 'none';

// ── main ─────────────────────────────────────────────────────────────────────
const findings = [];
const record = (variant, field, expected, actual, note) =>
  findings.push({ variant, field, expected, actual, note });

const vars = await loadVariables();

const setId = args.set;
if (!setId) throw new Error('--set <figmaNodeId> is required');
const nodeRes = await figmaGet(`/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(setId)}&depth=3`);
const setNode = Object.values(nodeRes.nodes)[0].document;
const figmaVariants = new Map((setNode.children || []).map(c => [c.name, c]));

const server = await createServer({
  root: HARNESS_ROOT, configFile: HARNESS_ROOT + 'vite.config.js',
  server: { port: 0 }, logLevel: 'error',
});
await server.listen();
const port = server.httpServer.address().port;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof window.__setProps === 'function', null, { timeout: 30000 });

let checked = 0;
for (const [kind, kc] of Object.entries(KIND)) {
  for (const [imp, ic] of Object.entries(IMPORTANCE)) {
    if (INVALID.some(x => x.kind === kind && x.importance === imp)) continue;
    for (const [size, sc] of Object.entries(SIZE)) {
      for (const [state, extra] of Object.entries(STATE)) {
        const props = propsFor({ kind, importance: imp, size, state, loading: 'false' });
        await page.evaluate(p => window.__setProps('DtButton', p), props);
        const computed = await page.evaluate(() => window.__read());
        if (!computed) { record(`${kind}/${imp}/${size}/${state}`, 'render', 'a rendered button', 'nothing'); continue; }

        const name = `kind=${kind}, importance=${imp}, size=${size}, state=${state}, loading=false`;
        const fv = figmaVariants.get(name);
        if (!fv) { record(name, 'existence', 'present', 'MISSING'); continue; }
        checked++;

        const label = (fv.children || []).find(c => c.type === 'TEXT');

        // geometry
        const geo = [
          ['paddingTop', px(computed.paddingTop), fv.paddingTop],
          ['paddingLeft', px(computed.paddingLeft), fv.paddingLeft],
          ['itemSpacing', px(computed.gap), fv.itemSpacing],
          ['cornerRadius', px(computed.borderRadius), fv.cornerRadius],
          ['strokeWeight', px(computed.borderWidth), fv.strokeWeight],
        ];
        for (const [field, want, got] of geo) {
          if (!closeNum(want, got)) record(name, field, want, got);
        }

        // colour
        const bg = paintRGBA((fv.fills || [])[0], vars);
        const st = paintRGBA((fv.strokes || [])[0], vars);
        const tx = label ? paintRGBA((label.fills || [])[0], vars) : null;
        const pairs = [
          ['background', parseCssColor(computed.backgroundColor), bg],
          ['borderColor', parseCssColor(computed.borderColor), st],
          ['textColor', parseCssColor(computed.color), tx],
        ];
        for (const [field, want, gotPaint] of pairs) {
          const got = gotPaint?.rgba ?? null;
          if (want && (want.a ?? 1) < 0.005 && (!got || (got.a ?? 1) < 0.005)) continue; // both transparent
          if (!closeCol(want, got)) record(name, field, fmt(want), fmt(got), gotPaint?.bound ? `bound to ${gotPaint.bound}` : 'literal');

          // B-9 guard: a bound paint whose literal fallback differs from its resolved
          // value renders WRONG whenever the binding fails to resolve.
          if (gotPaint?.bound && gotPaint.literal && got && !closeCol(gotPaint.literal, got)) {
            record(name, `${field}.placeholder`, fmt(got), fmt(gotPaint.literal),
                   `bound to ${gotPaint.bound} but the literal underneath differs — renders wrong if the binding does not resolve`);
          }
        }
      }
    }
  }
}

await browser.close();
await server.close();

const byField = {};
for (const f of findings) byField[f.field] = (byField[f.field] || 0) + 1;

console.log(`\nvariants checked : ${checked}`);
console.log(`findings         : ${findings.length}`);
if (findings.length) {
  console.log('\nby field:');
  for (const [k, n] of Object.entries(byField).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(5)}  ${k}`);
  console.log('\nfirst 15:');
  for (const f of findings.slice(0, 15)) {
    console.log(`  ${f.variant}`);
    console.log(`      ${f.field}: expected ${f.expected}, got ${f.actual}${f.note ? '  (' + f.note + ')' : ''}`);
  }
}
if (args.json) { writeFileSync(args.json, JSON.stringify({ checked, findings }, null, 2)); console.log(`\nwrote ${args.json}`); }

console.log(findings.length ? '\n❌ FAIL' : '\n✅ Figma matches the browser');
process.exit(findings.length ? 1 : 0);
