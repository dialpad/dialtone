import './pin-cwd.mjs';   // launch directory must not matter
import { fileURLToPath } from 'url';
/**
 * Rasterise the SAME variants from the harness and from Figma, side by side.
 *
 * Every other check here is numeric — nothing is ever rendered, so nothing can catch
 * a defect that lives between the properties being compared. That blind spot is real:
 * a human eye found Chip's overlapping close button and Toggle's missing gap on runs
 * the verifier called clean, and both turned out to be whole classes of unchecked
 * property rather than one-off slips.
 *
 * Deliberately NOT a pixel-diff with a threshold. Figma's text shaper and Chrome's
 * disagree by ~2px on advance width, and antialiasing differs everywhere, so a
 * numeric diff is mostly noise. This produces a contact sheet to LOOK at.
 *
 *   node sync-scripts/visual-compare.mjs checkbox --set 132:350 --limit 12
 */
import 'dotenv/config';
import { writeFileSync, mkdirSync } from 'fs';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { COMPONENTS } from './component-axes.mjs';
import { combosFor, containerClassOf } from './combos.mjs';
import { flagValue } from './cli-args.mjs';

const args = process.argv.slice(2);
const which = args.find(a => !a.startsWith('--'));
const setId = flagValue(args, '--set');
const LIMIT = Number(flagValue(args, '--limit') || 12);
const MODE = args.includes('--dark') ? 'dark' : null;
// A 16px component tells you nothing at 1:1. --zoom scales BOTH sides equally with
// nearest-neighbour, which is what makes a 2px focus ring on a checkbox visible at
// all — the first sheet looked like the ring was missing when it was simply too small.
const ZOOM = Number(flagValue(args, '--zoom') || 1) || 1;
const MATCH = flagValue(args, '--match') ? new RegExp(flagValue(args, '--match')) : null;
if (!which || !setId) throw new Error('usage: visual-compare.mjs <component> --set <nodeId> [--limit N] [--dark]');

const cfg = COMPONENTS[which];
if (!cfg) throw new Error(`no config for "${which}"`);
const TOKEN = process.env.PERSONAL_ACCESS_TOKEN, FILE_KEY = process.env.FILE_KEY;
if (!TOKEN || !FILE_KEY) throw new Error('PERSONAL_ACCESS_TOKEN and FILE_KEY required');
const api = async (p) => {
  const r = await fetch(`https://api.figma.com${p}`, { headers: { 'X-Figma-Token': TOKEN } });
  if (!r.ok) throw new Error(`GET ${p} -> ${r.status}`);
  return r.json();
};

// ── which variants, and what they are called on both sides ──────────────────
const combos = combosFor(cfg);
const byName = new Map(combos.map(c => [cfg.variantName(c), c]));

const set = Object.values((await api(`/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(setId)}&depth=1`)).nodes)[0].document;
const pairs = (set.children || [])
  .filter(c => byName.has(c.name))
  .filter(c => !MATCH || MATCH.test(c.name))
  .filter((_, i, all) => all.length <= LIMIT || i % Math.ceil(all.length / LIMIT) === 0)
  .slice(0, LIMIT);
if (!pairs.length) throw new Error('no Figma variant names matched the config — check the set id');

// Figma renders images in the collection's DEFAULT mode, so a dark comparison needs
// the mode stamped on the nodes themselves. Stated rather than silently ignored.
if (MODE) console.log('NOTE: Figma image export uses the default variable mode; a dark\n'
  + '      comparison needs an explicit mode set on the nodes first.');

const imgs = await api(`/v1/images/${FILE_KEY}?ids=${pairs.map(p => encodeURIComponent(p.id)).join(',')}&format=png&scale=2`);

// ── harness screenshots of the same variants ────────────────────────────────
const HARNESS = fileURLToPath(new URL('./verify-harness/', import.meta.url));
const server = await createServer({ root: HARNESS, configFile: HARNESS + 'vite.config.js', server: { port: 0 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
await page.goto(`http://localhost:${server.httpServer.address().port}/`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof window.__anatomy === 'function', null, { timeout: 30000 });
if (MODE) await page.evaluate(m => window.__setMode(m), MODE);

const cdp = await page.context().newCDPSession(page);
await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
const { root: doc } = await cdp.send('DOM.getDocument', { depth: -1 });
let forced = null;
async function forceState (pseudo, combo) {
  if (forced) { await cdp.send('CSS.forcePseudoState', { nodeId: forced, forcedPseudoClasses: [] }).catch(() => {}); forced = null; }
  const sel = typeof cfg.stateTarget === 'function' ? cfg.stateTarget(combo) : cfg.stateTarget;
  const target = sel ? `#root > * ${sel}, #root > *${sel}` : '#root > *';
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: doc.nodeId, selector: target });
  if (nodeId && pseudo.length) { await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: pseudo }); forced = nodeId; }
}

mkdirSync('sync-scripts/build-data/visual', { recursive: true });
const rows = [];
for (const p of pairs) {
  const combo = byName.get(p.name);
  await page.evaluate(([c, pr, o]) => window.__setProps(c, pr, o),
    [cfg.component, cfg.props(combo), { label: cfg.label, slots: cfg.slots ? cfg.slots(combo) : [],
      // The same render the builder and the verifier use. Without it the harness side of the
      // sheet omits a declared slot's content (Notice's and Banner's action button), so the
      // Figma side looked like it had something extra.
      slotContent: cfg.slotContent ? cfg.slotContent(combo) : undefined, rootClass: cfg.rootClass, containerClass: containerClassOf(cfg, combo) }]);
  await forceState(cfg.pseudo ? cfg.pseudo(combo) : [], combo);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const el = await page.$('#root > *');
  const shot = await el.screenshot();
  const bb = await el.boundingBox();
  rows.push({ name: p.name, w: Math.round(bb ? bb.width : 100),
    harness: 'data:image/png;base64,' + shot.toString('base64'), figma: imgs.images[p.id] });
}

// ── one contact sheet, rendered by the browser and screenshotted ────────────
const html = `<style>
  body{margin:0;font:11px/1.4 ui-monospace,monospace;background:#fff;color:#111}
  .row{border-bottom:1px solid #e5e5e5;padding:10px 12px}
  .name{color:#666;margin-bottom:6px;word-break:break-all}
  .pair{display:flex;gap:24px;align-items:flex-start}
  .cell{display:flex;flex-direction:column;gap:4px}
  .tag{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#999}
  img{display:block;image-rendering:pixelated;outline:1px dashed #ddd}
  .z img{transform-origin:top left}
</style>` + rows.map(r => `<div class="row"><div class="name">${r.name}</div><div class="pair">
  <div class="cell"><div class="tag">harness</div><img src="${r.harness}" style="width:${r.w * ZOOM}px"></div>
  <div class="cell"><div class="tag">figma</div><img src="${r.figma}" style="width:${r.w * ZOOM}px"></div>
</div></div>`).join('');

const sheet = await browser.newPage({ viewport: { width: 1400, height: 800 }, deviceScaleFactor: 1 });
await sheet.setContent(html);
await sheet.waitForLoadState('networkidle');
const out = `sync-scripts/build-data/visual/${which}${MODE ? '-dark' : ''}.png`;
await sheet.screenshot({ path: out, fullPage: true });
await browser.close(); await server.close();
console.log(`${rows.length} variant pairs -> ${out}`);
