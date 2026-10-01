/**
 * Verify Figma component sets against the browser, tree-aware and multi-component.
 *
 * Supersedes verify-figma-components.mjs, which only knew Button and only compared
 * the root plus its first text node. Real components have children that carry their
 * own tokens (d-badge__label, d-badge__decorative), so the comparison walks both
 * trees in parallel.
 *
 * The reference is the REAL Vue component rendered through ./verify-harness/.
 * Not a pixel diff: nothing is rasterised, so there is no antialiasing or
 * font-rendering tolerance — only numeric and colour comparison.
 *
 *   node verify-components.mjs badge --set <nodeId>
 *   node verify-components.mjs button --set <nodeId>
 */
import './pin-cwd.mjs';   // launch directory must not matter
import 'dotenv/config';
import { writeFileSync, readFileSync, realpathSync } from 'fs';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { converter, parse as parseColor, clampChroma, displayable, differenceCiede2000 } from 'culori';

const API = 'https://api.figma.com';
const EPS = 0.6;              // px — Figma stores floats, CSS rounds
const SIZE_EPS = 1.0;         // px — Chrome and Figma shape text slightly differently
// REST returns float32, so a difference of exactly SIZE_EPS arrives as 1.000000610351562
// and fails a `> 1.0` test. Radio's label is 23.39 against 22.39 — one pixel, which this
// tolerance exists to forgive — and it failed on 320 variants for want of this slop.
const FLOAT_SLOP = 0.01;
const CEPS = 1.5 / 255;       // ~one 8-bit step
const HARNESS = new URL('./verify-harness/', import.meta.url).pathname;

const TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
const FILE_KEY = process.env.FILE_KEY;
if (!TOKEN || !FILE_KEY) throw new Error('PERSONAL_ACCESS_TOKEN and FILE_KEY required');

/**
 * Is this file the process entry point, or was it imported?
 *
 * negative-control.mjs imports the comparison engine below in order to re-run it
 * against DELIBERATELY CORRUPTED Figma data and prove each comparison actually
 * fires. It must be able to do that without the CLI sweep — and without the CLI
 * behaviour changing by one character. So everything above this line is library;
 * everything under `── run ──` is the command, and runs only when invoked directly.
 */
const IS_CLI = (() => {
  try { return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; }
})();

const args = process.argv.slice(2);
const which = args.find(a => !a.startsWith('--'));
// `indexOf(...) + 1` is 0 when the flag is absent, so a forgotten --set silently used
// the COMPONENT NAME as a node id and failed with a REST 400 instead of the usage line.
const setId = args.includes('--set') ? args[args.indexOf('--set') + 1] : undefined;
if (IS_CLI && (!which || !setId)) throw new Error('usage: verify-components.mjs <component> --set <nodeId>');

/**
 * Whether the CURRENT sub-pass renders with slots filled. Set by the merged sweep below and
 * by the negative control; no longer a CLI flag. The standalone `--slots` mode built a second
 * variant set that `--merged` supersedes, and it verified nothing once every component moved
 * to either the merged or the axis model.
 */
let SLOT_PASS = false;
// --merged checks ONE set in both of its states; see SLOT_STATES below.
const MERGED = args.includes('--merged');
/** Importers state the slot mode explicitly rather than inheriting THEIR argv. */
export const setSlotPass = (v) => { SLOT_PASS = !!v; };

import { COMPONENTS } from './component-axes.mjs';
import { combosFor } from './combos.mjs';
import { fetchVariantsByName } from './figma-variants.mjs';
import { matchedFor, resolveDeclared } from './cdp-provenance.mjs';
import { marginFoldable, margins, hasMargin, outlineAsShadow, parentMarginFold, paintsNothing, flowChildren, figmaChildParts, transparentBorderFoldOf, pseudoPaintsGlyph, resolvePercentRadius, figmaFamilyFor } from './figma-mapping.mjs';

const cfg = COMPONENTS[which];
/**
 * Slots whose content the config declares as a swappable exemplar (`slotContent(...).swapTo`).
 * Combo-independent: a slot either is an exemplar or is not, so the first combo answers it.
 */
const EXEMPLAR_SLOTS = new Set();
if (cfg && cfg.slotContent) {
  try {
    const probe = Object.fromEntries(Object.keys(cfg.axes).map(a => [a, cfg.axes[a][0]]));
    for (const [slot, spec] of Object.entries(cfg.slotContent(probe) || {})) {
      if (spec && spec.swapTo) EXEMPLAR_SLOTS.add(slot);
    }
  } catch { /* a config that cannot be probed declares no exemplars */ }
}
if (IS_CLI && !cfg) throw new Error(`no verifier config for "${which}"`);

// ── figma ───────────────────────────────────────────────────────────────────
async function figmaGet (path) {
  for (let i = 1; i <= 4; i++) {
    const r = await fetch(`${API}${path}`, { headers: { 'X-Figma-Token': TOKEN } });
    if (r.ok) return r.json();
    if (i === 4) throw new Error(`GET ${path} -> ${r.status}`);
    await new Promise(res => setTimeout(res, i * 2000));
  }
}
const varsRes = await figmaGet(`/v1/files/${FILE_KEY}/variables/local`);
const VM = varsRes.meta.variables, VC = varsRes.meta.variableCollections;
/**
 * Resolve a variable in a NAMED mode.
 *
 * Alias chains cross collections, and each collection has its own mode ids, so a
 * chain must be followed by mode NAME. Following it by the target collection's
 * default mode would silently read Light values while claiming to check Dark —
 * the same class of false-green this file exists to prevent.
 */
function varValue (id, modeName, d = 0) {
  const v = VM[id]; if (!v || d > 8) return null;
  const coll = VC[v.variableCollectionId];
  const mode = coll.modes.find(m => m.name === modeName);
  const val = v.valuesByMode[(mode || { modeId: coll.defaultModeId }).modeId];
  if (val && val.type === 'VARIABLE_ALIAS') return varValue(val.id, modeName, d + 1);
  return val;
}
/** Returns the paint's colour in `modeName`, plus whether it is variable-bound. */
function paintRGBA (p, modeName) {
  if (!p) return null;
  const bv = p.boundVariables?.color;
  if (bv) {
    const v = varValue(bv.id, modeName);
    if (!v || !('r' in v)) return null;
    return { r: v.r, g: v.g, b: v.b, a: v.a ?? 1, bound: true };
  }
  // NOT EVERY PAINT HAS A COLOUR. An IMAGE paint (and a gradient) has none, and this
  // function assumed SOLID from the day it was written — which was safe only while the
  // builder painted nothing but solids. The moment B-98's image import landed, the first
  // fill on 144 avatar nodes became an IMAGE and the background comparison crashed on
  // `p.color.r`, taking the whole pass down with a TypeError rather than a finding.
  // A paint with no colour has no RGBA; say so and let the caller decide.
  if (p.type && p.type !== 'SOLID') return null;
  if (!p.color) return null;
  // A literal paint carries one colour for every mode. If it matches in Light and
  // not in Dark, the value is baked rather than wrong — reported distinctly.
  return { r: p.color.r, g: p.color.g, b: p.color.b, a: p.opacity ?? p.color.a ?? 1, bound: false };
}

// ── comparison ──────────────────────────────────────────────────────────────
const toRgb = converter('rgb');
const toOklch = converter('oklch');
const col = s => { if (!s) return null; const c = parseColor(s); if (!c) return null; const r = toRgb(c); return { r: r.r, g: r.g, b: r.b, a: r.alpha ?? 1 }; };
const px = s => (typeof s === 'string' && s.endsWith('px') ? parseFloat(s) : null);
const near = (a, b) => a != null && b != null && Math.abs(a - b) <= EPS;
const dE = differenceCiede2000();
const FIGMA_WEIGHT = { Thin: 100, ExtraLight: 200, Light: 300, Regular: 400, Medium: 500,
  Semibold: 600, SemiBold: 600, Bold: 700, ExtraBold: 800, Black: 900 };
// CSS flex alignment -> Figma auto-layout alignment
const ALIGN = { 'flex-start': 'MIN', start: 'MIN', 'flex-end': 'MAX', end: 'MAX',
  center: 'CENTER', baseline: 'BASELINE', stretch: 'MIN',
  'space-between': 'SPACE_BETWEEN', normal: 'MIN' };
/**
 * Colour equality, gamut-aware.
 *
 * Dialtone authors in oklch and some hover/active colours fall OUTSIDE sRGB —
 * `critical/clear:hover` computes to r=258.6/255. Figma can only store sRGB, so
 * the emitter gamut-maps on the way in and the browser gamut-maps at paint time,
 * by different algorithms. Comparing raw channels then reports a difference that
 * no one can see and neither side can avoid.
 *
 * So: in-gamut colours are compared strictly, channel by channel. Out-of-gamut
 * colours are chroma-clamped and compared perceptually (ΔE00 ≤ 1.0, the standard
 * just-noticeable threshold). This keeps full strictness everywhere precision is
 * actually achievable instead of loosening the check globally to absorb 10 variants.
 */
const nearC = (a, b) => {
  if (!a || !b) return false;
  if (Math.abs((a.a ?? 1) - (b.a ?? 1)) > 0.02) return false;
  if (['r','g','b'].every(k => Math.abs(a[k] - b[k]) <= CEPS)) return true;
  const ac = { mode: 'rgb', r: a.r, g: a.g, b: a.b };
  if (displayable(ac)) return false;                 // in gamut: strict result stands
  // 'oklch', not 'rgb': culori binary-searches the chroma channel of the mode named
  // here, and an rgb object has none — so 'rgb' degenerated to per-channel clipping
  // and compared against a colour neither side produces (8 ΔE00 off on a saturated red).
  return dE(toRgb(clampChroma(toOklch(ac), 'oklch')), { mode: 'rgb', r: b.r, g: b.g, b: b.b }) <= 1.0;
};
/**
 * Split a `box-shadow` value into its comma-separated layers.
 *
 * A naive `.split(',')` tears `rgba(0, 0, 0, .2)` and `oklch(0 0 0 / .3)` apart, so
 * only commas at paren depth zero count.
 */
function splitShadowLayers (v) {
  const out = []; let depth = 0, cur = '';
  for (const ch of v) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
const shadowColor = raw => (raw.match(/(oklch\([^)]*\)|oklab\([^)]*\)|rgba?\([^)]*\)|#[0-9a-f]{3,8})/i) || [])[0];
/**
 * The four lengths of one box-shadow layer, in Chrome's normalised order.
 *
 * Nothing compared these. An effect matched on type and colour alone, so an inset
 * ring emitted with spread 0 — invisible — passed as correct. This is the hole the
 * systematic negative control named but could not detect: there was no field for a
 * comparison nobody had written.
 */
function shadowGeom (raw) {
  const bare = raw
    .replace(/(oklch|oklab|rgba?|hsla?|color)\([^)]*\)/gi, ' ')
    .replace(/\binset\b/i, ' ')
    .replace(/#[0-9a-f]{3,8}/gi, ' ');
  const n = (bare.match(/-?[\d.]+px/g) || []).map(parseFloat);
  return { x: n[0] || 0, y: n[1] || 0, blur: n[2] || 0, spread: n[3] || 0 };
}
const fmt = c => c ? `rgba(${[c.r,c.g,c.b].map(x=>Math.round(x*255)).join(',')},${(c.a??1).toFixed(2)})` : 'none';

/**
 * Coverage guard.
 *
 * `paddingRight` was captured by the harness and never compared. Because Button's
 * padding is symmetric, checking `paddingLeft` looked equivalent — so Chip's
 * reserved right-hand gutter went unchecked and its close button overlapped the
 * text by 16px across a run that reported 0 findings. Four rounds of negative
 * controls missed it, because a hand-picked corruption can only test a property
 * someone thought to corrupt.
 *
 * So: every property the harness reads must either be compared or be listed here
 * with a reason. Adding one to READ without handling it is now an error.
 */
const EXEMPT = {
  position: 'used to detect absolute positioning, not a painted property',
  display: 'used to gate the inline box-model allowance and flex checks',
  transform: 'folded into the expected offset for absolutely-positioned boxes',
  overflow: 'Figma clipsContent is a build choice, not a rendered CSS value to match',
  visibility: 'used to drop screen-reader-only nodes before they can become Figma nodes',
  clipPath: 'used to drop screen-reader-only nodes before they can become Figma nodes',
  content: 'gates whether a pseudo-element exists; its literal is compared as that node\'s text',
  backgroundImage: 'a data-URI glyph is imported as a vector child and compared as one',
  backgroundPosition: 'used to place the glyph child; compared as that child\'s x / y',
  backgroundSize: 'used to size the glyph child; compared as that child\'s box',
  stroke: 'SVG stroke is unused by these components — only fill paints',
  insetInlineStart: 'used to compute the expected offset, compared via x / insetEnd',
  insetInlineEnd: 'used to compute the expected offset, compared via x / insetEnd',
  insetBlockStart: 'used to compute the expected offset, compared via y',
  insetBlockEnd: 'used to compute the expected offset, compared via y',
  width: 'reported not failed — set by the text engine on a hug frame (see box spread)',
  // Read to tell whether a clamp, rather than the declared size, is what produced the used
  // size — which decides whether a size token may be bound. Figma has maxWidth/maxHeight
  // fields, but the builder sets neither: a clamp that is already binding has been folded
  // into the measured box, and one that is not would need a larger box to have any effect.
  maxWidth: 'used to decide whether a declared size token is bindable; never written to Figma',
  maxHeight: 'used to decide whether a declared size token is bindable; never written to Figma',
  alignItems: 'compared as counterAxisAlign on auto-layout frames',
  justifyContent: 'compared as primaryAxisAlign on auto-layout frames',
  flexDirection: 'compared as direction on auto-layout frames',
  flexWrap: 'gates whether rowGap is meaningful; not itself a painted value',
};
const COMPARED = new Set(['flexWrap', 'backgroundColor', 'color', 'borderTopColor',
  // Each side and each corner, separately. The three non-top widths sat in EXEMPT
  // ("folded into padding; compared via borderTopWidth") — both halves of which have
  // since stopped being true: the padding fold is gone, and a per-side stroke weight is
  // its own comparison.
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'columnGap', 'rowGap', 'minWidth', 'minHeight', 'height', 'fontSize', 'fontWeight',
  'lineHeight', 'opacity', 'boxShadow', 'fill', 'fontFamily', 'outlineStyle',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'outlineColor', 'outlineWidth', 'outlineOffset']);
{
  const harness = readFileSync(new URL('./verify-harness/main.js', import.meta.url), 'utf8');
  const block = /const READ = \[([\s\S]*?)\];/.exec(harness);
  if (!block) throw new Error('could not find the harness READ list');
  const read = [...block[1].matchAll(/'([a-zA-Z]+)'/g)].map(m => m[1]);
  const unhandled = read.filter(p => !COMPARED.has(p) && !EXEMPT[p]);
  if (unhandled.length) {
    throw new Error('These properties are captured but neither compared nor exempted:\n  '
      + unhandled.join('\n  ')
      + '\nAdd a comparison, or add an entry to EXEMPT saying why not.');
  }
}

/**
 * Font FAMILY was never compared — not once, on any component.
 *
 * A side-by-side render made the text look different, which nearly got reported as
 * "the builder hardcodes SF Pro Text but Dialtone ships Season Sans". It does not:
 * Dialtone's stack starts at `-apple-system`, which IS SF Pro on macOS, so the
 * builder is right and the residual difference is the known shaper delta. But nothing
 * would have told us if that stopped being true.
 *
 * What this can and cannot check: CSS names a STACK, and which member the browser
 * actually used is not exposed. So this asserts Figma uses the family the first
 * resolvable stack entry maps to — a stated assumption, not a measurement.
 */
// The map itself now lives in figma-mapping.mjs, so the BUILDER resolves the family the
// same way this check expects it — they disagreed, and only this side knew.
function checkFontFamily (variant, path, s, figNode) {
  const want = figmaFamilyFor(s.fontFamily);
  const got = figNode.style?.fontFamily;
  if (!want || !got) return;
  if (want !== got) rec(variant, path, 'fontFamily', want, got);
}

const findings = [];
const allowed = [];   // deliberate divergences, reported but not failures
const sizeSpread = { width: 0, height: 0 };
const rec = (variant, path, field, expected, actual, note) =>
  findings.push({ variant, path, field, expected, actual, note });

/** Walk DOM node and Figma node in parallel; Figma nodes hidden by a component property are skipped. */
function compareNode (variant, dom, fig, path, MODE, figParentBox) {
  // FIRST, before any comparison: a declared exemplar is not the measured render. Placed
  // last once already, which let the colour comparisons fire before it was reached.
  /**
   * A DECLARED EXEMPLAR IS NOT COMPARED AGAINST THE RENDER.
   *
   * Where a config declares `slotContent[...].swapTo`, the set deliberately holds an INSTANCE
   * of that component rather than a rebuilt copy of what was measured — so a designer can
   * change it from the panel. The two are genuinely different things: DtNotice restyles its
   * action button (`notice.less`: `.d-btn { color: var(--notice-color-text) }`), so the
   * standalone Button variant carries 93,92,88 where the in-notice render is 37,35,32, and
   * its label shapes 1.85px wider in Figma's text engine than in Chrome's.
   *
   * Accepted deliberately: the content is an exemplar, and whatever a designer swaps in will
   * be styled however they style it. Chasing in-context fidelity on a placeholder is chasing
   * the wrong thing.
   *
   * Keyed on the CONFIG's declaration, not on the Figma node carrying a swap reference. A
   * rule keyed on the reference was tried and withdrawn: it silenced 60 real findings on
   * DtBadge, whose slot icon IS the measured content and must be compared.
   */
  if (dom.dataSlot && EXEMPLAR_SLOTS.has(dom.dataSlot)) {
    allowed.push({ variant, path,
      reason: `slot "${dom.dataSlot}" holds a declared exemplar component — an instance a `
        + 'designer replaces, not a copy of the measured render' });
    return;
  }

  if (!fig) { rec(variant, path, 'existence', dom.classes.join('.') || dom.tag, 'no figma node'); return; }
  const s = dom.style;

  // Deliberate simplifications: one Figma node standing for a whole DOM subtree.
  // Their GEOMETRY cannot be compared — the loading spinner is a stroked arc in
  // Figma and a mask-clipped SVG in the DOM, so a 2px stroke faces a 0px border —
  // but their COLOUR still must match, and that is the part that goes wrong (B-9).
  // Recorded, not skipped silently.
  /**
   * The COLLAPSED-LEAF allowance is gone, and deliberately.
   *
   * It existed for one case — `.d-loader`, which Figma held as a single arc where the DOM
   * has a track plus an icon — and it only ever applied while the Figma node had no
   * children. Since the builder learned to place overlapping children by coordinate, that
   * loader is always a frame with two SVG children, so the branch became unreachable:
   * negative-control reported `collapsedColor` as a GAP with 73 nodes reached and no
   * finding. A dormant allowance is worse than no allowance — if the builder ever collapses
   * a subtree again, this one would silently skip the node's geometry AND both children,
   * which is exactly how 210 loading Buttons came to render two spinners under a clean
   * pass. Re-add it deliberately, with a condition, if collapsing ever returns.
   */

  // An <svg> is imported into Figma whole (createNodeFromSvg), so its internals are
  // never walked and never compared node-for-node. Descending into it used to emit
  // `defs`, `clipPath` and zero-size `path` frames as real nodes, and left the actual
  // glyph outline to be hand-reconstructed. Box and COLOUR are still checked.
  if (dom.tag === 'svg') {
    allowed.push({ variant, path, reason: 'svg imported whole — internals are Figma vectors, not compared node-for-node' });
    if (fig.absoluteBoundingBox && dom.box) {
      if (Math.abs(dom.box.w - fig.absoluteBoundingBox.width) > SIZE_EPS) rec(variant, path, 'svgWidth', dom.box.w, fig.absoluteBoundingBox.width);
      if (Math.abs(dom.box.h - fig.absoluteBoundingBox.height) > SIZE_EPS) rec(variant, path, 'svgHeight', dom.box.h, fig.absoluteBoundingBox.height);
    }
    /**
     * B-97: THE GLYPH'S COLOUR, which nothing has checked since this branch was written.
     *
     * `svgFill` existed to catch exactly this — an early negative control set an icon
     * fill to magenta and the run still passed — but it compares a DOM node whose tag is
     * `path`/`circle`/`rect`, and those only ever occur INSIDE an `<svg>`, which this
     * `return` means the walk never enters. Measured across ten components: 33 shape
     * nodes perturbed on Chip, 22 on Banner, 12 on Button, ZERO reached anywhere. So no
     * icon's colour was verified on any component, in either mode.
     *
     * The comparison belongs here, where the walk still is: an inline glyph fills from
     * the element's `color` (the builder carries that onto every vector as `d.cc`), so
     * the expected colour should appear on SOME vector inside the imported frame. Asking
     * "does the glyph carry this colour anywhere" rather than matching vector-for-vector
     * keeps the existing allowance honest — the internals really are not compared
     * node-for-node — while still catching a magenta icon.
     */
    /**
     * NOT for a background-image glyph. The synthesised node for one (see the `glyph`
     * child built further down) carries its OWNER's style, so `s.fill` is the CSS default
     * `black` rather than anything the glyph paints — and the glyph's real colour is baked
     * into the data URI, not taken from `currentColor`. Comparing them faulted all 48 of
     * Checkbox's correct white checkmarks against a black that nothing paints.
     */
    const isBackgroundGlyph = (dom.classes || []).includes('glyph');
    const wantGlyph = isBackgroundGlyph ? null : (col(s.fill) || col(s.color));
    if (wantGlyph && (wantGlyph.a ?? 1) >= 0.005) {
      const paints = [];
      const collect = (n, d) => {
        // Strokes count too: a line icon carries its colour there, and the question is
        // whether the colour is present at all, not which property holds it.
        for (const f of [...(n.fills || []), ...(n.strokes || [])]) {
          const p = paintRGBA(f, MODE);
          if (p && (p.a ?? 1) >= 0.005) paints.push(p);
        }
        if (d > 0) for (const k of (n.children || [])) collect(k, d - 1);
      };
      collect(fig, 6);
      if (!paints.length) {
        /**
         * NO PAINT ANYWHERE. Two very different situations, and they must not share an
         * answer — this comparison has now been wrong in both directions.
         *
         * It began as an ALLOWANCE blaming our own depth-6 fetch, which was true at the
         * time. B-101 re-rooted the fetch so the whole subtree arrives, and the excuse
         * expired — but the text stayed, quietly excusing 35 avatar glyphs on grounds that
         * no longer existed.
         *
         * Reporting them all then produced a FALSE finding: every one was `presence=away`,
         * whose `<svg>` is EMPTY on purpose. Presence.vue says so outright — "the `away`
         * and `offline` states do not render a glyph" — and the dot's colour alone carries
         * the meaning. The element still has a CSS `color`, so the check wanted a paint for
         * a shape that does not exist.
         *
         * So the question is not "is there paint" but "is there anything to paint":
         *   geometry present, no paint  -> B-99's shape, an invisible icon. A finding.
         *   no geometry at all          -> an empty element. Nothing to compare.
         */
        const svgHasGeometry = /<(path|circle|rect|ellipse|line|polyline|polygon|use|image|text)\b/
          .test(dom.svg || '');
        if (svgHasGeometry) {
          rec(variant, path, 'svgFill', fmt(wantGlyph), 'NO PAINT ANYWHERE IN THE SUBTREE',
              'the SVG has geometry but nothing paints it at any depth');
        } else {
          allowed.push({ variant, path,
            reason: 'the SVG element is empty — no geometry, so there is no glyph to colour' });
        }
      } else if (!paints.some(p => nearC(wantGlyph, p))) {
        rec(variant, path, 'svgFill', fmt(wantGlyph),
          paints.map(fmt).slice(0, 3).join(' / '),
          paints.every(p => !p.bound) ? 'baked literal' : undefined);
      }
    }
    return;
  }

  // background — Figma paints it on the frame
  const domBg = col(s.backgroundColor);
  const figBg = paintRGBA((fig.fills || [])[0], MODE);
  const bgTransparent = !domBg || (domBg.a ?? 1) < 0.005;
  if (!bgTransparent && !nearC(domBg, figBg)) {
    rec(variant, path, 'background', fmt(domBg), fmt(figBg), figBg && !figBg.bound ? 'baked literal' : undefined);
  }

  /**
   * B-98: an `<img>`'s PIXELS are not imported, and nothing said so.
   *
   * Found by rasterising, not by comparing: an Avatar with `content=image` shows the
   * image in the browser and an empty frame in Figma, and every numeric check passed
   * because an `<img>` has no `background-color` — so the colour comparison skips on
   * BOTH sides and the two agree about a property neither uses. The pixels come from a
   * resource no comparison reads.
   *
   * Recorded as an allowance rather than a finding, on the same footing as `svg imported
   * whole`: it is an omission in what the builder reproduces, and the point is that it
   * stops being invisible. Importing the bytes as an IMAGE fill is the fix if these
   * variants are ever meant to look right.
   */
  if (String(dom.tag || '').toLowerCase() === 'img') {
    const figPaints = (fig.fills || []).filter(f => f.visible !== false);
    const img = figPaints.find(f => f.type === 'IMAGE');
    if (!img) {
      // Was an allowance while the builder imported nothing; now that it does, an <img>
      // with no IMAGE fill is a defect. This is the only comparison here that checks a
      // RESOURCE rather than a property, which is precisely why its absence hid so well.
      rec(variant, path, 'imageFill', 'an IMAGE paint',
        figPaints.map(f => f.type).join('+') || 'no fill at all');
    } else {
      // `object-fit: cover` crops to fill; anything else must not crop silently.
      const wantScale = (dom.objectFit === 'cover') ? 'FILL' : 'FIT';
      if (img.scaleMode !== wantScale) {
        rec(variant, path, 'imageScaleMode', `${wantScale} (object-fit: ${dom.objectFit || 'fill'})`, img.scaleMode);
      }
    }
  }

  // The DOM-tag branch that used to emit `svgFill` here is gone: it tested for a node
  // whose tag is `path`/`circle`/`rect`, which only occur inside an `<svg>` — and the
  // `<svg>` branch above returns before the walk can enter one. The comparison now lives
  // there, against the imported frame's descendant paints, where it is reachable.


  // text colour lives on the TEXT node in Figma
  if (dom.text && fig.type === 'TEXT') {
    const domFg = col(s.color), figFg = paintRGBA((fig.fills || [])[0], MODE);
    if (!nearC(domFg, figFg)) rec(variant, path, 'textColor', fmt(domFg), fmt(figFg), figFg && !figFg.bound ? 'baked literal' : undefined);
    if (!near(px(s.fontSize), fig.style?.fontSize)) rec(variant, path, 'fontSize', px(s.fontSize), fig.style?.fontSize);
    // A bold label would otherwise pass as regular: weight was captured, never compared.
    const domWeight = Number(s.fontWeight);
    const figWeight = FIGMA_WEIGHT[fig.style?.fontWeight] ?? fig.style?.fontWeight;
    if (domWeight && typeof figWeight === 'number' && Math.abs(domWeight - figWeight) > 1) {
      rec(variant, path, 'fontWeight', domWeight, figWeight);
    }
    // lineHeight was in COMPARED but only ever checked on the OTHER text branch, so
    // the coverage guard read green while this path never looked at it. The same
    // shape as paddingRight: present in the compared set, dead on the branch that runs.
    const domLh = px(s.lineHeight), figLh = fig.style?.lineHeightPx;
    if (domLh != null && figLh != null && !near(domLh, figLh)) rec(variant, path, 'lineHeight', domLh, figLh);
    checkFontFamily(variant, path, s, fig);
  }

  // Strokes were never compared at all until now — every outlined button's border
  // went unchecked while the run reported green. Same blind-spot family as B-11.
  if (fig.type !== 'TEXT') {
    // A transparent border paints nothing, so Figma needs no stroke for it. Dialtone
    // gives every button a 1px border and makes it transparent for `clear`, purely
    // so the box size stays constant across importances (D-7).
    // Compare only what is actually PAINTED, symmetrically on both sides. Dialtone
    // gives every button a 1px border and makes it transparent for `clear`, purely
    // to keep the box size constant across importances (D-7); Figma mirrors some of
    // those as transparent strokes and omits others. Neither paints anything, so
    // neither should register — while a genuinely missing border still does.
    // Figma also reports strokeWeight: 1 on nodes carrying no strokes at all.
    const domBorderVisible = (col(s.borderTopColor)?.a ?? 0) >= 0.005;
    // A transparent border that offsets an inset shadow IS reproduced in Figma — as a
    // stroke in the background colour (see transparentBorderFold). Expect it, or the
    // fix reads as a defect and the defect reads as correctness.
    const tbf = transparentBorderFoldOf({
      borderWidth: px(s.borderTopWidth) || 0,
      borderAlpha: col(s.borderTopColor)?.a ?? 0,
      hasInsetShadow: /inset/.test(s.boxShadow || ''),
      hasBackground: (col(s.backgroundColor)?.a ?? 0) >= 0.005,
    });
    const domW = (domBorderVisible || tbf) ? (px(s.borderTopWidth) || 0) : 0;
    const figStroke = paintRGBA((fig.strokes || [])[0], MODE);
    const figVisible = !!figStroke && (figStroke.a ?? 1) >= 0.005;
    /**
     * EACH SIDE COMPARED SEPARATELY.
     *
     * `strokeWeight` alone described the top edge and assumed the other three matched, which
     * is true of every symmetrical component and false of DtSplitButton: each half declares
     * `border-inline-end: 0`, so 140 frames carried a border down an edge that has none and
     * nothing reported it.
     *
     * REST omits a zero, and reports `individualStrokeWeights` when the four differ, so an
     * absent side reads through the uniform value and then through zero.
     */
    /**
     * The same vocabulary split on the stroke side. REST names these `top`/`right`/
     * `bottom`/`left`; the plugin API names them `strokeTopWeight`/… Both are accepted
     * because both are real, and the container is absent entirely when the four agree — so
     * a lookup falls to the uniform `strokeWeight` and then to zero.
     */
    const isw = fig.individualStrokeWeights || {};
    const SHORT = { strokeTopWeight: 'top', strokeRightWeight: 'right',
      strokeBottomWeight: 'bottom', strokeLeftWeight: 'left' };
    const uniform = typeof fig.strokeWeight === 'number' ? fig.strokeWeight : 0;
    // Written as a tuple ARRAY rather than an object map because negative-control.mjs
    // parses this file for every field name rec() can emit, and a tuple head is a shape
    // it reads. Object.entries() of a map declared elsewhere is not: it would throw
    // rather than enumerate, and these four comparisons would have no perturbation.
    for (const [figKey, cssKey] of [
      ['strokeTopWeight', 'borderTopWidth'], ['strokeRightWeight', 'borderRightWidth'],
      ['strokeBottomWeight', 'borderBottomWidth'], ['strokeLeftWeight', 'borderLeftWidth'],
    ]) {
      const domSide = (domBorderVisible || tbf) ? (px(s[cssKey]) || 0) : 0;
      const iswVal = typeof isw[figKey] === 'number' ? isw[figKey]
        : (typeof isw[SHORT[figKey]] === 'number' ? isw[SHORT[figKey]] : undefined);
      const figSide = figVisible ? (iswVal === undefined ? uniform : iswVal) : 0;
      if (!near(domSide, figSide)) rec(variant, path, figKey, domSide, figSide);
    }
    if (domW > 0) {
      const domBd = tbf ? col(s.backgroundColor) : col(s.borderTopColor);
      if (!nearC(domBd, figStroke)) {
        rec(variant, path, 'borderColor', fmt(domBd), fmt(figStroke), figStroke && !figStroke.bound ? 'baked literal' : undefined);
      }
    }
    /**
     * THE STROKE MUST BE COUNTED IN THE LAYOUT.
     *
     * A CSS border adds to a shrink-to-fit border-box element, and this flag is Figma's
     * equivalent. The builder sets it explicitly because the two runtimes disagree on the
     * default — the desktop plugin turns it on, `use_figma` leaves it off — so the same
     * builder produced two geometries and every plugin-built stroked frame came out 2px
     * short (B-82). Asserted directly rather than inferred from a height difference, which
     * only works while that difference happens to exceed SIZE_EPS.
     *
     * The expectation is INVERTED from what it was. It used to demand `false`, because the
     * builder folded the border into padding and including the stroke would have
     * double-counted. That fold is gone: it forced padding to be written as a literal, and
     * a hard-coded 10 where the stylesheet says `spacing/75` is exactly what this pipeline
     * exists to avoid.
     */
    if (!fig.strokesIncludedInLayout && fig.layoutMode && fig.layoutMode !== 'NONE' && domW > 0
        && (px(s.borderTopWidth) || px(s.borderLeftWidth))) {
      rec(variant, path, 'strokesIncludedInLayout',
        'true (a CSS border adds to a shrink-to-fit box, so the stroke must count)', false);
    }
  }

  if (fig.type !== 'TEXT') {
    // A CSS border adds to an auto-height element's box; a Figma stroke does not
    // add to an auto-layout frame's size. Figma therefore folds the border width
    // into padding, so the expected padding is CSS padding PLUS the border on that
    // side. Without this the whole set reads 2px short (see the height check below).
    // The fold exists because Figma auto-layout ignores strokes when sizing itself.
    // A FIXED-size frame is explicit about its size and draws the stroke inside, which
    // is exactly CSS border-box on an explicitly sized element — the toggle's track.
    // So the fold applies only where Figma is actually hugging its content.
    /**
     * NO BORDER IN THE PADDING EXPECTATION.
     *
     * The builder used to fold the border width into padding so an auto-layout frame would
     * reproduce the CSS box, and this expectation had to match. It no longer does: the stroke
     * is counted in the layout (`strokesIncludedInLayout`), which is what CSS does to a
     * shrink-to-fit border-box element, and padding is left carrying only what the stylesheet
     * declares so it can be bound to the token that declared it.
     *
     * Kept as named zeroes rather than deleted from the four expressions below, so the shape
     * of the sum stays readable next to the margin folds that are still real.
     */
    const bT = 0, bR = 0, bB = 0, bL = 0;
    // Figma has no per-child margin. Where the child paints nothing of its own the
    // margin folds into that child's OWN padding — visually identical and fully
    // expressible. Where it does paint, folding would grow the painted box instead
    // of the space around it, so the divergence is recorded rather than absorbed.
    // Uncaptured entirely, this is how Notice silently lost 28px of spacing.
    // `expectedRel` is set exactly when this node is placed by coordinate, and that
    // coordinate already includes its margins — so no fold, or the space counts twice.
    const coordPlaced = !!dom.expectedRel;
    const m = margins(s);
    const foldM = hasMargin(m) && marginFoldable(s) && !coordPlaced;
    // A painted child's margin is NOT recorded here: parentMarginFold below is the
    // authority on it, and either absorbs it into the parent or reports precisely
    // why it cannot. Recording it in both places printed 44 allowances for spacing
    // that was, in fact, representable and simply missing.
    const [mT, mR2, mB2, mL] = foldM ? [m.top, m.right, m.bottom, m.left] : [0, 0, 0, 0];
    // A painted child cannot absorb its own margin, so the parent absorbs it here.
    const pf = /flex|grid/.test(s.display || '')
      ? parentMarginFold(s, (dom.children || []).filter(c => c.style.display !== 'none'))
      : { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, itemSpacing: 0, unrepresentable: [] };
    for (const why of pf.unrepresentable) allowed.push({ variant, path, reason: why });
    /**
     * REST DOES NOT REPORT PADDING ON A FRAME WITHOUT AUTO-LAYOUT.
     *
     * Measured both ways: the plugin API reads back the 6px this builder wrote on
     * `d-chip__avatar`, and the REST node for that same frame has no `layoutMode` and no
     * padding keys at all — so `fig.paddingRight ?? 0` was 0 against a CSS 6 on 39 nodes
     * (78 findings). The same shape as B-77, where REST nested stroke weights under
     * `individualStrokeWeights` and every correct border read as absent.
     *
     * Padding on such a frame is inert: Figma places its children by coordinate, and the
     * measured `rel` those coordinates come from already includes the padding. So the
     * information IS still checked — as the child's x/y, which this verifier compares for
     * every coordinate-placed child. That is the reason this is an exemption and not a
     * blind spot, and it is recorded rather than skipped in silence.
     */
    const paddingReadable = !!fig.layoutMode && fig.layoutMode !== 'NONE';
    if (!paddingReadable && ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
      .some(k => (px(s[k]) ?? 0) > 0)) {
      allowed.push({ variant, path, reason: 'padding on a non-auto-layout frame — REST does not report it; checked as the child offset instead' });
    }
    for (const [k, domV, figV] of [
      // ALL FOUR SIDES. Only top and left were compared, and because Button's padding
      // is symmetric that was indistinguishable from checking both — while Chip
      // reserves a right-hand gutter for its close button (24px vs 10px) that went
      // unchecked, so the button overlapped the text by 16px on a "clean" run.
      [paddingReadable ? 'paddingTop' : null, (px(s.paddingTop) ?? 0) + bT + mT + pf.paddingTop, fig.paddingTop ?? 0],
      [paddingReadable ? 'paddingBottom' : null, (px(s.paddingBottom) ?? 0) + bB + mB2 + pf.paddingBottom, fig.paddingBottom ?? 0],
      [paddingReadable ? 'paddingLeft' : null, (px(s.paddingLeft) ?? 0) + bL + mL + pf.paddingLeft, fig.paddingLeft ?? 0],
      [paddingReadable ? 'paddingRight' : null, (px(s.paddingRight) ?? 0) + bR + mR2 + pf.paddingRight, fig.paddingRight ?? 0],
      // Inert unless the box is actually flex/grid — see the builder's note. Comparing
      // it on a block box faults Figma for correctly ignoring a gap CSS also ignores.
      // Figma's itemSpacing is the MAIN-axis gap, and CSS's main-axis gap is `row-gap`
      // on a column, `column-gap` on a row. Reading columnGap either way compared
      // Figma's main axis against CSS's cross axis on every column — invisible while
      // `gap` sets both, and silently agreeing on zero for a row-gap-only column.
      // A gap paints BETWEEN siblings, so on a box with fewer than two flow children it
      // paints nothing — and the builder correctly leaves such a frame without auto-layout,
      // where Figma reports itemSpacing 0. Comparing there faulted 16 read-only FilterPills
      // for a `column-gap: 5.5px` that has nothing to sit between (B-102). Gated on the DOM
      // rather than on `fig.layoutMode`: the layoutMode assertion only fires in the other
      // direction (overlap present, auto-layout set), so a Figma-side gate would go quiet
      // exactly when the builder got auto-layout wrong.
      [/flex|grid/.test(s.display || '') && flowChildren(dom).length > 1 ? 'itemSpacing' : null,
        (px(s.flexDirection === 'column' ? s.rowGap : s.columnGap) ?? 0) + pf.itemSpacing,
        fig.itemSpacing ?? 0],
      // The CROSS-axis gap only paints if something wraps. Figma applies
      // counterAxisSpacing only with layoutWrap: WRAP, so on a single line the value is
      // inert on both sides and comparing it is noise.
      // Horizontal only, matching what Figma can hold: `layoutWrap` exists on a HORIZONTAL
      // layout and nowhere else, so a wrapping CSS column has no cross gap to compare.
      [((s.flexWrap === 'wrap' || fig.layoutWrap === 'WRAP') && fig.layoutMode === 'HORIZONTAL')
        ? 'counterAxisSpacing' : null,
        px(s.flexDirection === 'column' ? s.columnGap : s.rowGap), fig.counterAxisSpacing ?? 0],
      // A zero minimum is the absence of a constraint — the same thing Figma's null
      // means — so only a real minimum is worth comparing.
      // Figma accepts a minimum only on an auto-layout frame; a FIXED frame carries an
      // explicit size instead, so expecting one there faults the builder for obeying
      // the platform (DtToggle's track is a fixed 36x18 with `min-width: 36px`).
      [fig.layoutMode && fig.layoutMode !== 'NONE' ? 'minWidth' : null,
        px(s.minWidth) || null, typeof fig.minWidth === 'number' ? fig.minWidth : null],
      [fig.layoutMode && fig.layoutMode !== 'NONE' ? 'minHeight' : null,
        px(s.minHeight) || null, typeof fig.minHeight === 'number' ? fig.minHeight : null],
      // ELLIPSE/VECTOR/LINE have no corners; comparing 0 against undefined is noise
      // The REST API omits zero-valued properties, so a 0 radius comes back
      // undefined rather than 0. Shapes without corners are skipped outright.
      // A PERCENTAGE radius left px() returning null, so the expectation was null and
      // the comparison was skipped — on every node in the system. Resolve it instead.
      // Corners are compared below, one at a time.
    ]) {
      if (k == null || domV == null) continue;
      if (!near(domV, figV)) rec(variant, path, k, domV, figV);
    }

    /**
     * EACH CORNER COMPARED SEPARATELY.
     *
     * `borderTopLeftRadius` against `fig.cornerRadius` described one corner of four. That is
     * every component until DtSplitButton, whose halves square their inner corners: 115 came
     * out rounded and the check agreed with all of them.
     *
     * REST reports `rectangleCornerRadii` when the corners differ and omits it when they do
     * not, so an absent entry reads through the uniform value.
     */
    if (!['ELLIPSE', 'VECTOR', 'LINE', 'POLYGON', 'STAR'].includes(fig.type)) {
      /**
       * REST REPORTS MIXED CORNERS AS AN ARRAY, and only then.
       *
       * A node whose four corners agree comes back as `cornerRadius: 4`. A node whose
       * corners differ comes back as `rectangleCornerRadii: [4, 0, 0, 4]` — top-left,
       * top-right, bottom-right, bottom-left, clockwise — with NO `cornerRadius` and no
       * per-corner properties at all. The plugin API, meanwhile, exposes
       * `topLeftRadius`/`topRightRadius`/… and no array.
       *
       * Reading the plugin-side names against a REST payload therefore found nothing, fell
       * through to a `cornerRadius` that mixed nodes do not carry, and reported 0. Every
       * asymmetric corner in the library: 920 findings on DtSplitButton and 512 on DtInput,
       * against a canvas the plugin API confirms was built correctly.
       *
       * Sixth time a missing REST field has looked like a missing value.
       */
      const rcr = Array.isArray(fig.rectangleCornerRadii) ? fig.rectangleCornerRadii : null;
      const uniformR = typeof fig.cornerRadius === 'number' ? fig.cornerRadius : 0;
      const CORNER_ORDER = ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'];
      for (const [figKey, cssKey] of [
        ['topLeftRadius', 'borderTopLeftRadius'], ['topRightRadius', 'borderTopRightRadius'],
        ['bottomRightRadius', 'borderBottomRightRadius'],
        ['bottomLeftRadius', 'borderBottomLeftRadius'],
      ]) {
        const raw = s[cssKey];
        const domR = px(raw) ?? resolvePercentRadius(raw, dom.box && dom.box.w, dom.box && dom.box.h);
        if (domR == null) continue;
        // A pill radius clamps to half the height in CSS but stays literal in Figma.
        if (domR >= 999) continue;
        const fromArray = rcr ? rcr[CORNER_ORDER.indexOf(figKey)] : undefined;
        const figR = typeof fromArray === 'number' ? fromArray
          : (typeof fig[figKey] === 'number' ? fig[figKey] : uniformR);
        if (!near(domR, figR)) rec(variant, path, figKey, domR, figR);
      }
    }
  }

  // Position of an absolutely-positioned box. Auto-layout children are placed by
  // layout, so only absolute ones carry a meaningful coordinate — and the toggle's
  // knob IS one: moving it is the difference between an on and an off switch.
  if (dom.expectedRel && figParentBox && fig.absoluteBoundingBox) {
    const fb = fig.absoluteBoundingBox;
    // Compare the offset from the edge the CSS actually anchors to. The chip's close
    // button is placed by `inset-inline-end`, so its distance from the RIGHT edge is
    // the specified quantity; its left offset depends on a hug-contents width, which
    // differs between Chrome and Figma's text shaper and so is not comparable.
    const anchor = dom.inset || {};
    const rightAnchored = dom.anchor === 'end' && anchor.inlineEnd && anchor.inlineEnd !== 'auto';
    if (rightAnchored) {
      const want = parseFloat(anchor.inlineEnd);
      const got = (figParentBox.x + figParentBox.width) - (fb.x + fb.width);
      if (!Number.isNaN(want) && !near(want, got)) rec(variant, path, 'insetEnd', want, +got.toFixed(2));
    } else if (!near(dom.expectedRel.x, fb.x - figParentBox.x)) {
      rec(variant, path, 'x', dom.expectedRel.x, +(fb.x - figParentBox.x).toFixed(2));
    }
    if (!near(dom.expectedRel.y, fb.y - figParentBox.y)) {
      rec(variant, path, 'y', dom.expectedRel.y, +(fb.y - figParentBox.y).toFixed(2));
    }
  }

  // Opacity. Only disabled variants carry it (the toggle dims its whole track), so
  // it was never exercised until a negative control removed one.
  const domOpacity = parseFloat(s.opacity);
  const figOpacity = typeof fig.opacity === 'number' ? fig.opacity : 1;
  if (!Number.isNaN(domOpacity) && Math.abs(domOpacity - figOpacity) > 0.01) {
    rec(variant, path, 'opacity', domOpacity, figOpacity);
  }

  // Auto-layout alignment. A frame that centres where the CSS starts shifts every
  // child, and nothing compared it.
  if (fig.layoutMode === 'HORIZONTAL' || fig.layoutMode === 'VERTICAL') {
    const domIsRow = s.flexDirection !== 'column';
    const figIsRow = fig.layoutMode === 'HORIZONTAL';
    if (/flex|grid/.test(s.display) && domIsRow !== figIsRow) {
      rec(variant, path, 'direction', domIsRow ? 'HORIZONTAL' : 'VERTICAL', fig.layoutMode);
    }
    // `normal` is flex's stretch; Figma expresses stretch through the CHILD's
    // layoutSizing, not the parent's alignment enum, so there is nothing to compare.
    const wantCounter = (s.alignItems === 'normal' || s.alignItems === 'stretch')
      ? null : ALIGN[s.alignItems];
    const gotCounter = fig.counterAxisAlignItems || 'MIN';
    if (wantCounter && wantCounter !== 'BASELINE' && wantCounter !== gotCounter) {
      rec(variant, path, 'counterAxisAlign', `${s.alignItems} -> ${wantCounter}`, gotCounter);
    }
    // justify-content only means anything on a flex/grid container; `normal` on a
    // non-flex box is not an alignment the Figma enum can disagree with.
    const wantPrimary = /flex|grid/.test(s.display) && s.justifyContent !== 'normal'
      ? ALIGN[s.justifyContent] : null;
    const gotPrimary = fig.primaryAxisAlignItems || 'MIN';
    if (wantPrimary && wantPrimary !== gotPrimary) {
      rec(variant, path, 'primaryAxisAlign', `${s.justifyContent} -> ${wantPrimary}`, gotPrimary);
    }
  }

  // Rendered box size. Nothing compared width or height before, which is precisely
  // why every button sat 2px shorter than production without a single finding.
  // Text advance differs slightly between Chrome and Figma's shaper, so the
  // tolerance is looser here than for declared values — and the largest deviation
  // seen is reported, so a loose tolerance cannot quietly hide a real drift.
  /**
   * IN THE FILLED SUB-PASS, A FRAME WITH A HIDDEN SLOT LAYER HAS NO COMPARABLE BOX.
   *
   * REST reports the geometry Figma has STORED, and a hidden child is excluded from
   * auto-layout — so `absoluteBoundingBox` is the size of the DEFAULT state, while the DOM
   * here is the FILLED render. The two numbers describe different states of the same frame.
   *
   * It went wrong both ways at once. Width is only compared on a pinned axis, so on a
   * hugging frame the 34px difference between Badge's 52 and 86 was absorbed into the
   * "reported only — text shaping" spread, which then printed **38.00px** as though a font
   * engine were responsible. And height IS compared strictly, so the first slot layer taller
   * than its content would have produced a false finding on every variant.
   *
   * Not re-derived, either: predicting the grown size means reimplementing Figma's layout
   * engine in the checker, and the whole point of measuring is to avoid that. What covers
   * the growth instead is `slotAxisSizing` — the frame must be able to grow — and the slot
   * layers' own boxes, which ARE stored correctly and are compared.
   */
  /**
   * WHY THERE IS NO "SKIP EVERY SWAP POINT" RULE HERE.
   *
   * A swap point can hold two quite different things, and a `mainComponent` reference does
   * not say which. On an ADDITIVE slot (DtBadge's startIcon) the file stores the content the
   * harness injected, and comparing the filled render against it is exactly right. On a
   * REPLACEMENT slot (DtNotice's kind icon) the file stores the component's OWN default, and
   * comparing the injected content against it is meaningless — `height: expected 14, got 20`.
   *
   * A rule keyed on the reference alone was tried and withdrawn: it silenced 60 REAL findings
   * on Badge, where the builder had failed to override an instance's fill and every icon was
   * carrying the icon library's default colour instead of the badge's.
   *
   * No component currently needs the replacement case: the only merged set is DtBadge, whose
   * slots are all additive. When one does, the fix is for the FILLED sub-pass to leave
   * replacement slots empty — the DOM then shows the same default the file stores — not to
   * stop comparing.
   */
  const boxIsDefaultState = SLOT_PASS && (fig.children || []).some(c => c.visible === false);
  if (boxIsDefaultState) {
    allowed.push({ variant, path,
      reason: 'filled sub-pass: REST reports this frame at its DEFAULT size because a slot '
        + 'layer is hidden — the grown box is covered by slotAxisSizing instead' });
  }
  if (!boxIsDefaultState && fig.absoluteBoundingBox && dom.box && fig.type !== 'TEXT') {
    // A folded margin is part of the Figma frame but not of the DOM border box, so
    // the expected size grows by exactly what was folded in.
    const fm = (marginFoldable(s) && !dom.expectedRel) ? margins(s) : { top: 0, right: 0, bottom: 0, left: 0 };
    // The parent already includes an absorbed child margin in its rendered box, so
    // unlike the child's own fold this one adds nothing to the expected size.
    const wDiff = Math.abs((dom.box.w + fm.left + fm.right) - fig.absoluteBoundingBox.width);
    const hDiff = Math.abs((dom.box.h + fm.top + fm.bottom) - fig.absoluteBoundingBox.height);
    if (wDiff > sizeSpread.width) sizeSpread.width = wDiff;
    if (hDiff > sizeSpread.height) sizeSpread.height = hDiff;

    // HEIGHT is deterministic — padding plus the text style's line-height — so it
    // is compared strictly, and it is what caught the missing border.
    //
    // Except on a pure `display: inline` box. `.d-link--unstyled` is `all: unset`,
    // which makes it inline, and getBoundingClientRect() then measures the font's
    // content box (18px) rather than the line box (25.6px). Figma has no inline
    // concept — its frame height IS the line box — so the two numbers describe
    // different things. Recorded as an allowance, not skipped silently.
    if (s.display === 'inline') {
      allowed.push({ variant, path, reason: 'display:inline — DOM measures the content box, Figma the line box' });
    } else if (hDiff > SIZE_EPS + FLOAT_SLOP) {
      rec(variant, path, 'height', dom.box.h + fm.top + fm.bottom, fig.absoluteBoundingBox.height);
    }

    // WIDTH of a hug-contents frame is set by the text engine, and Figma's shaper
    // measures ~2.3px wider than Chrome's for the same string and face. Failing on
    // that would be comparing two font engines, not checking our own work — and it
    // is not a silent skip: horizontal padding is compared directly above, and the
    // observed spread is always printed. Note this difference had been MASKING the
    // missing border, which is why the fold looked unnecessary from width alone.
    //
    // A PINNED axis is a different matter. The builder now fixes the axes CSS
    // constrains rather than hugging them (an icon avatar is an explicit 16px square
    // around a 10px glyph), and a pinned width owes nothing to the text engine — it is
    // a number the builder wrote down. So compare it, and keep the exemption for the
    // hugging case it was actually written for.
    // `!fig.layoutMode`, not `=== 'NONE'`: REST OMITS layoutMode on a frame with no
    // auto-layout (the same reporting quirk as B-94's padding), so the strict comparison
    // was false for every plain frame and width went unchecked on all of them. It fired
    // on Button only because Button's label is a FIXED auto-layout frame — one component's
    // shape hiding the hole, which is the exact failure this negative control exists for.
    const pinnedWidth = !fig.layoutMode || fig.layoutMode === 'NONE'
      || (fig.layoutMode === 'HORIZONTAL' && fig.primaryAxisSizingMode === 'FIXED')
      || (fig.layoutMode === 'VERTICAL' && fig.counterAxisSizingMode === 'FIXED');
    if (pinnedWidth && s.display !== 'inline' && wDiff > SIZE_EPS + FLOAT_SLOP) {
      rec(variant, path, 'width', dom.box.w + fm.left + fm.right, fig.absoluteBoundingBox.width);
    }
  }

  // box-shadow -> INNER_SHADOW (inset) or DROP_SHADOW (outset).
  // Checking only the inset case is what let the focus ring sit as a DROP_SHADOW
  // across 140 variants without producing a single finding.
  const effectColor = (e) => (e.boundVariables?.color
    ? (() => { const v = varValue(e.boundVariables.color.id, MODE); return v && 'r' in v ? { r: v.r, g: v.g, b: v.b, a: v.a ?? 1 } : null; })()
    : e.color);
  // An outline is a genuine focus ring on some components — checkbox's checked state
  // uses one — and maps to an outset DROP_SHADOW with zero blur and spread
  // width + offset. It had been EXEMPT on the belief that Dialtone always paints
  // focus with box-shadow, which is a claim about the design system that the design
  // system does not honour.
  const wantOutline = outlineAsShadow(s);
  const claimed = new Set();
  const hasBoxShadow = !!(s.boxShadow && s.boxShadow !== 'none');
  if (wantOutline) {
    const want = col(wantOutline.color);
    // A negative outline-offset draws the ring INSIDE the box, so it is an inner
    // shadow. Looking only for an outset one made the comparison miss it entirely.
    const wantType = wantOutline.inset ? 'INNER_SHADOW' : 'DROP_SHADOW';
    // Match by COLOUR first. A focus ring and an inset outline can both be
    // INNER_SHADOW with the same spread and radius, so shape cannot tell them apart —
    // pairing by array order compared each against the other's colour and produced
    // two findings where there was no defect at all.
    const cands = (fig.effects || []).filter(x => x.type === wantType && (x.radius ?? 0) < 0.5 && !claimed.has(x));
    // Colour first; then BOUNDNESS. An OS system colour cannot be bound to a variable,
    // so when the outline is one it must be the unbound candidate. Falling back to
    // cands[0] claimed the bound focus ring instead and pushed the black outline onto
    // the ring's own check — 8 findings from one mis-pairing.
    const wantBound = !dom.systemColorOutline;
    const e = cands.find(x => nearC(want, effectColor(x)))
           || cands.find(x => !!(x.boundVariables || {}).color === wantBound)
           || cands[0];
    if (!e) {
      rec(variant, path, 'outline', `${wantType} spread ${wantOutline.spread} ${fmt(want)}`,
          (fig.effects || []).map(x => x.type).join('+') || 'none');
    } else {
      claimed.add(e);
      if (!near(wantOutline.spread, e.spread ?? 0)) rec(variant, path, 'outlineWidth', wantOutline.spread, e.spread ?? 0);
      // An OS system colour (CanvasText and friends) has no token and no Figma
      // equivalent — the platform picks its value, so it cannot follow a mode.
      // Reported as a limit, not faulted as a defect.
      if (dom.systemColorOutline) {
        allowed.push({ variant, path, reason: 'outline colour is the OS system colour ' + dom.systemColorOutline + ' — no Figma equivalent' });
      } else if (!nearC(want, effectColor(e))) {
        rec(variant, path, 'outlineColor', fmt(want), fmt(effectColor(e)));
      }
    }
  }
  // Figma does not render an INNER_SHADOW on a frame that does not clip. A node that
  // needs an inset ring and has clipping off paints nothing, with effect data that
  // matches the browser perfectly — so this is checked structurally rather than by
  // comparing values.
  if (wantOutline?.inset || /inset/.test(s.boxShadow || '')) {
    const insetInFigma = (fig.effects || []).some(e => e.type === 'INNER_SHADOW');
    if (insetInFigma && fig.clipsContent === false) {
      rec(variant, path, 'clipsContent', 'true (an inset shadow does not render without clipping)', false);
    }
  }
  // Recomputed here because the border block above is inside a different scope.
  const insetSpreadFold = transparentBorderFoldOf({
    borderWidth: px(s.borderTopWidth) || 0,
    borderAlpha: col(s.borderTopColor)?.a ?? 0,
    hasInsetShadow: /inset/.test(s.boxShadow || ''),
    hasBackground: (col(s.backgroundColor)?.a ?? 0) >= 0.005,
  });
  if (hasBoxShadow) {
    // A multi-layer box-shadow paints every layer. Comparing only the first left the
    // rest — including token-coloured layers — entirely unbound and unchecked. Layers
    // whose colour is fully transparent paint nothing and must NOT become effects.
    const layers = splitShadowLayers(s.boxShadow)
      .map(raw => ({ raw, inset: /inset/.test(raw), color: col(shadowColor(raw)), g: shadowGeom(raw) }))
      .filter(l => l.color && (l.color.a ?? 1) >= 0.005);
    if (!layers.length && (fig.effects || []).some(x => ['INNER_SHADOW', 'DROP_SHADOW'].includes(x.type) && !claimed.has(x))) {
      rec(variant, path, 'shadow', 'all layers transparent', (fig.effects || []).map(x => x.type).join('+'));
    }
    for (const [i, layer] of layers.entries()) {
      const wantType = layer.inset ? 'INNER_SHADOW' : 'DROP_SHADOW';
      const field = layer.inset ? 'innerShadow' : 'dropShadow';
      const cands = (fig.effects || []).filter(x => x.type === wantType && !claimed.has(x));
      const e = cands.find(x => nearC(layer.color, effectColor(x))) || cands[0];
      if (!e) {
        const wrong = (fig.effects || []).map(x => x.type).join('+') || 'none';
        rec(variant, path, layers.length > 1 ? `${field}[${i}]` : field, `${wantType} ${fmt(layer.color)}`, wrong);
      } else {
        claimed.add(e);
        const got = effectColor(e);
        const label = layers.length > 1 ? `${field}[${i}]` : field;
        if (!nearC(layer.color, got)) rec(variant, path, label, fmt(layer.color), fmt(got));
        // Geometry, which nothing checked: an inset ring with spread 0 is invisible.
        for (const [k, want, gotV] of [
          ['OffsetX', layer.g.x, e.offset?.x ?? 0],
          ['OffsetY', layer.g.y, e.offset?.y ?? 0],
          ['Blur', layer.g.blur, e.radius ?? 0],
          // An inset layer's spread is grown by a folded transparent border, because
          // CSS clips the shadow to the padding box while Figma grows it from the
          // shape edge (see transparentBorderFold).
          ['Spread', layer.g.spread + (layer.inset ? insetSpreadFold : 0), e.spread ?? 0],
        ]) {
          if (!near(want, gotV)) rec(variant, path, `${label}${k}`, want, gotV);
        }
      }
    }
  } else if (!wantOutline && (fig.effects || []).some(x => ['INNER_SHADOW', 'DROP_SHADOW'].includes(x.type))) {
    rec(variant, path, 'shadow', 'none', (fig.effects || []).map(x => x.type).join('+'));
  }

  /**
   * A HIDDEN SLOT LAYER IS ONLY USABLE IF REVEALING IT CAN CHANGE THE FRAME.
   *
   * This is B-108, asserted. The merged Badge built, toggled, and put the icon ON TOP of
   * the label: the root came out `layoutMode: NONE`, so children sat at fixed coordinates
   * and making one visible changed nothing but what was painted over what. Every value
   * check passed — the default state was correct, and no check looked at the other state.
   *
   * Two things have to hold, and they are different failures:
   *   - the parent must be auto-layout at all, or a revealed layer cannot flow;
   *   - the axis it grows along must be AUTO, or the frame cannot get bigger.
   * REST omits a sizing mode that is AUTO, hence the default.
   *
   * Checked from the FIGMA side alone, so it runs in either sub-pass and needs no DOM
   * counterpart — the question is about the file's own internal consistency.
   */
  {
    const hiddenKids = (fig.children || []).filter(c => c.visible === false);
    if (hiddenKids.length) {
      if (!fig.layoutMode || fig.layoutMode === 'NONE') {
        rec(variant, path, 'slotLayout',
            'auto-layout (a hidden slot layer must be able to flow when revealed)', 'NONE',
            `${hiddenKids.length} hidden layer(s): ${hiddenKids.map(k => k.name).join(', ')}`);
      } else {
        const isRow = fig.layoutMode === 'HORIZONTAL';
        const primary = fig.primaryAxisSizingMode || 'AUTO';
        // Only where the frame actually HAS to grow. A pinned axis is not a defect on a frame
        // whose size the CSS fixes and whose slot layer fits inside it — demanded
        // unconditionally, this would fault every such frame for obeying its own stylesheet.
        // Known from the FILLED sub-pass alone: that is where the DOM is bigger than the box
        // Figma has stored, which is precisely "it needs to grow and cannot".
        const needsToGrow = SLOT_PASS && dom.box && fig.absoluteBoundingBox
          && (isRow ? dom.box.w > fig.absoluteBoundingBox.width + 1
                    : dom.box.h > fig.absoluteBoundingBox.height + 1);
        if (primary !== 'AUTO' && needsToGrow) {
          rec(variant, path, 'slotAxisSizing',
              `AUTO on the ${isRow ? 'horizontal' : 'vertical'} axis, so revealing a slot layer resizes the frame`,
              primary, `the filled render is ${isRow ? dom.box.w : dom.box.h}px on this axis `
              + `but the frame is pinned at ${isRow ? fig.absoluteBoundingBox.width : fig.absoluteBoundingBox.height}px`);
        }
      }
      // A layer nobody can reveal is a layer that is simply missing, and it looks identical
      // to a correct one in every geometric check.
      for (const k of hiddenKids) {
        const refs = k.componentPropertyReferences || {};
        if (!refs.visible) {
          rec(variant, `${path}/${k.name}`, 'slotToggle',
              'a BOOLEAN component property bound to `visible`', 'nothing — the layer cannot be revealed');
        }
        // And an icon nobody can change is a slot in name only.
        const inst = k.type === 'INSTANCE' ? k
          : (k.children || []).find(c => c.type === 'INSTANCE');
        if (inst && !(inst.componentPropertyReferences || {}).mainComponent) {
          rec(variant, `${path}/${k.name}/${inst.name}`, 'slotSwap',
              'an INSTANCE_SWAP property bound to `mainComponent`', 'nothing — the content cannot be changed');
        }
      }
    }
  }
  const figKids = (fig.children || []).filter(c => SLOT_PASS || c.visible !== false);
  // Pseudo-elements paint as children even though no DOM walk lists them: ::before
  // before the element children, ::after after. The toggle's KNOB is `::after`, so
  // without this the track reports one child where Figma correctly has two.
  // Membership and order come from figmaChildParts — the single authority, shared with
  // the identity audit. A pseudo that paints nothing but a character (FilterPill's
  // literal "=") or nothing but a data-URI glyph is included there; requiring a
  // background or a shadow dropped both, and with them the only thing they drew.
  const parts = figmaChildParts(dom, col);
  const paintedPseudos = [...parts.before, ...parts.after];
  // CSS places an absolute child from the PADDING box; Figma from the frame box, so
  // the parent's border width is part of the expected offset.
  const parentBorderL = px(s.borderLeftWidth) || 0;
  const parentBorderT = px(s.borderTopWidth) || 0;
  const matrixOffset = (tf) => {
    const m = /matrix\(([^)]+)\)/.exec(tf || '');
    const t = m ? m[1].split(',').map(Number) : null;
    return t && t.length === 6 ? { x: t[4], y: t[5] } : { x: 0, y: 0 };
  };
  const asChild = (pe) => {
    const off = matrixOffset(pe.style.transform);
    const insetL = parseFloat((pe.inset || {}).inlineStart);
    const insetT = parseFloat((pe.inset || {}).blockStart);
    return {
      classes: [pe.pseudo], tag: pe.pseudo, style: pe.style, box: pe.box,
      // Whitespace content is not a glyph (see pseudoPaintsGlyph), so it must not be
      // expected as a TEXT child either — or the verifier would demand the very layer
      // the spec builder correctly stopped emitting.
      children: [], text: (pe.text && pe.text.trim()) ? pe.text : null, svg: pe.svg || null, pseudos: [],
      expectedRel: Number.isNaN(insetL) || Number.isNaN(insetT) ? null : {
        x: parentBorderL + insetL + off.x,
        y: parentBorderT + insetT + off.y,
      },
    };
  };
  // `display: none` children still exist in the DOM but paint nothing — the
  // indeterminate toggle hides its glyph that way. This is the symmetric
  // counterpart to skipping Figma nodes with visible === false.
  // Inside a NONE-layout Figma frame every child is placed by coordinate, so every
  // child's position is a real thing to check — not only the absolute ones.
  const figPlacesByCoord = !(fig.layoutMode === 'HORIZONTAL' || fig.layoutMode === 'VERTICAL');
  const visibleKids = parts.elements
    .map(c => ((c.style.position === 'absolute' || figPlacesByCoord) && c.rel
      ? { ...c, expectedRel: c.rel } : c));
  // A glyph painted through `background-image` has no DOM node, but Figma imports it
  // as a vector CHILD. Without this the child counts disagree — and before the glyph
  // was captured at all, checkbox's checked, indeterminate and unchecked states were
  // byte-identical, three states rendering as one.
  if (parts.unrepresentableGlyph) {
    allowed.push({ variant, path, reason: `glyph placement: ${parts.unrepresentableGlyph}` });
  }
  const gr = parts.glyphRect;
  const glyphKid = gr
    ? [{ classes: ['glyph'], tag: 'svg', style: dom.style, box: { w: gr.w, h: gr.h },
         children: [], text: null, pseudos: [], svg: dom.svg,
         expectedRel: { x: gr.x, y: gr.y } }]
    : [];
  let domKids = [
    ...glyphKid,
    ...parts.before.map(asChild),
    ...visibleKids,
    ...parts.after.map(asChild),
  ];

  // A DOM node can carry text directly (DtLink renders its slot straight into the
  // <a>), but a Figma frame cannot hold both text and padding — it needs a TEXT
  // child. Compare that child against the parent's own text properties rather
  // than reporting a phantom childCount mismatch.
  if (dom.text && !domKids.length && figKids.length === 1 && figKids[0].type === 'TEXT') {
    const figText = figKids[0];
    const domFg = col(s.color), figFg = paintRGBA((figText.fills || [])[0], MODE);
    if (!nearC(domFg, figFg)) rec(variant, `${path}/label`, 'textColor', fmt(domFg), fmt(figFg), figFg && !figFg.bound ? 'baked literal' : undefined);
    if (!near(px(s.fontSize), figText.style?.fontSize)) rec(variant, `${path}/label`, 'fontSize', px(s.fontSize), figText.style?.fontSize);
    // The mirror of the gap above: this branch checked lineHeight and not weight.
    const domW2 = Number(s.fontWeight);
    const figW2 = FIGMA_WEIGHT[figText.style?.fontWeight] ?? figText.style?.fontWeight;
    if (domW2 && typeof figW2 === 'number' && Math.abs(domW2 - figW2) > 1) {
      rec(variant, `${path}/label`, 'fontWeight', domW2, figW2);
    }
    const domLh = px(s.lineHeight), figLh = figText.style?.lineHeightPx;
    if (domLh != null && figLh != null && !near(domLh, figLh)) rec(variant, `${path}/label`, 'lineHeight', domLh, figLh);
    checkFontFamily(variant, `${path}/label`, s, figText);
    return;
  }
  // A wrong auto-layout choice is invisible to every VALUE check, because two separate
  // and individually reasonable tolerances cover for it: a hug frame's WIDTH is not
  // compared (Chrome and Figma shape text differently), and a child's POSITION is not
  // compared when Figma flows it. So when the builder made `.d-loader` a horizontal row,
  // its width doubled and its children moved 18px apart with nothing to say so — 210
  // loading Buttons rendered two spinners side by side.
  // Assert the STRUCTURE instead: children the browser measured as OVERLAPPING cannot be
  // laid out by Figma auto-layout, which would separate them.
  {
    const flowKids = flowChildren(dom);
    const ov = flowKids.some((a, i) => flowKids.some((b, j) => j > i
      && a.rel.x < b.rel.x + b.box.w - 0.01 && b.rel.x < a.rel.x + a.box.w - 0.01
      && a.rel.y < b.rel.y + b.box.h - 0.01 && b.rel.y < a.rel.y + a.box.h - 0.01));
    if (ov && fig.layoutMode && fig.layoutMode !== 'NONE') {
      rec(variant, path, 'layoutMode',
        'NONE (children overlap in CSS; auto-layout would separate them)', fig.layoutMode);
    }
  }

  if (figKids.length !== domKids.length) {
    rec(variant, path, 'childCount', domKids.length, figKids.length,
        `dom [${domKids.map(k => k.classes.join('.') || k.tag).join(', ')}] vs figma [${figKids.map(k => k.name).join(', ')}]`);
  }
  const n = Math.min(figKids.length, domKids.length);
  for (let i = 0; i < n; i++) compareNode(variant, domKids[i], figKids[i], `${path}/${domKids[i].classes.join('.') || domKids[i].tag}`, MODE, fig.absoluteBoundingBox);
}

// ── exported surface ────────────────────────────────────────────────────────
/**
 * Everything above is the comparison engine; everything below is the command.
 *
 * negative-control.mjs re-runs `compareNode` over captured-then-corrupted Figma
 * data to prove each comparison is live. It gets the REAL function, never a copy —
 * a copy would only ever verify the copy.
 */
export { compareNode, figmaGet, findings, allowed, sizeSpread, varValue, paintRGBA };
/** Wipe the accumulators so one process can run the comparison many times over. */
export function resetComparisonState () {
  findings.length = 0;
  allowed.length = 0;
  sizeSpread.width = 0;
  sizeSpread.height = 0;
}

if (IS_CLI) {
  // ── run ─────────────────────────────────────────────────────────────────────
// Variants are fetched RE-ROOTED, in batches — see figma-variants.mjs. Fetching
  // the set itself caps the depth five levels below each variant and truncates
  // silently, which reads downstream as a defect in the work (B-101).
  const figByName = await fetchVariantsByName(figmaGet, FILE_KEY, setId);

  const server = await createServer({ root: HARNESS, configFile: HARNESS + 'vite.config.js', server: { port: 0 }, logLevel: 'error' });
  await server.listen();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.httpServer.address().port}/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => typeof window.__anatomy === 'function', null, { timeout: 30000 });

  /**
   * Force :hover / :focus-visible via CDP.
   *
   * These states are unreachable by adding a class, and the previous verifier's
   * comment claimed a forceState() that was never written — so every hover and
   * focus-visible variant in the Figma file went unchecked while the run reported
   * green. The node id must be re-resolved on each call: the harness remounts the
   * component when the slot set or key changes, which invalidates the old id.
   */
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  // Resolve the document ONCE. Every DOM.getDocument invalidates all previously
  // issued node ids, so re-fetching it per call means the clear lands on a
  // different id than the force did — the forced state then leaks into every
  // later variant. Verified: same-id force/clear works, fresh-id does not.
  const { root: cdpDoc } = await cdp.send('DOM.getDocument', { depth: -1 });
  let forced = null;   // { nodeId } currently carrying a forced state
  // which variant is being rendered, so a combo-dependent stateTarget can resolve
  let activeCombo = {};
  async function forceState (pseudoClasses) {
    if (forced) {
      await cdp.send('CSS.forcePseudoState', { nodeId: forced, forcedPseudoClasses: [] })
        .catch(() => {});          // node may be gone after a remount
      forced = null;
    }
    // Force the state on the element that actually receives it — not always the root.
    const sel = typeof cfg.stateTarget === 'function' ? cfg.stateTarget(activeCombo) : cfg.stateTarget;
    const target = sel ? `#root > * ${sel}, #root > *${sel}` : '#root > *';
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: cdpDoc.nodeId, selector: target });
    if (!nodeId) return false;
    if (pseudoClasses.length) {
      await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: pseudoClasses });
      forced = nodeId;
    }
    return true;
  }

  /**
   * Which edge an absolutely-positioned element is anchored to.
   *
   * Chrome resolves BOTH inset-inline-start and -end to used values once the element
   * has a definite width, so computed styles cannot tell the two apart: the chip's
   * close button reports start=41.34 end=2, and the toggle's glyph reports
   * start=24 end=6. Only the DECLARED property says which one the author meant, and
   * that distinction matters because Figma's hug width differs from Chrome's, so
   * exactly one of the two offsets is stable.
   */
  async function annotateAnchors (node) {
    // Also: is this node's outline colour an OS SYSTEM colour? getComputedStyle
    // resolves `CanvasText` to rgb(0,0,0), so the rendered value alone cannot tell —
    // only the declaration can, and Figma has no way to represent it. Without this
    // the checkbox's dark focus ring reads as a defect rather than as a platform limit.
    if (node.style && node.selector && (parseFloat(node.style.outlineWidth) || 0) > 0) {
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: cdpDoc.nodeId, selector: node.selector });
      if (nodeId) {
        const { own, chain } = await matchedFor(cdp, nodeId);
        // Use the SAME resolver the spec builder uses. Hand-parsing the declaration
        // missed the `outline` shorthand path that resolveDeclared already handles.
        const sys = (resolveDeclared(own, chain).computed.outlineColor || {}).systemColor;
        if (sys) node.systemColorOutline = sys;
      }
    }
    if (node.style && node.style.position === 'absolute' && node.selector) {
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: cdpDoc.nodeId, selector: node.selector });
      if (nodeId) {
        const { own } = await matchedFor(cdp, nodeId);
        const declaredEnd = own['inset-inline-end'] || own['right'] || (own.inset ? { value: own.inset.value } : null);
        const declaredStart = own['inset-inline-start'] || own['left'];
        node.anchor = declaredStart ? 'start' : (declaredEnd ? 'end' : 'start');
      }
    }
    for (const c of node.children || []) await annotateAnchors(c);
  }

    const allCombos = combosFor(cfg);
  /**
   * A MERGED set holds BOTH renders in one place, so it takes both to check.
   *
   * Empty sub-pass: the browser renders with its slots empty, and Figma's hidden layers are
   * excluded — which is the ordinary values pass, unchanged.
   * Filled sub-pass: the browser renders with its slots filled, and the hidden layers are
   * included — the same comparison, against the state a designer reaches by toggling.
   *
   * Nothing else about the engine changes. The one switch is whether a `visible: false`
   * Figma child counts as a child, and `figKids` already keyed that off SLOT_PASS.
   */
  const SLOT_STATES = MERGED ? [false, true] : [false];

  /**
   * Sweep every variant once per MODE.
   *
   * Dark was never checked before, and that is exactly where B-16 hid: two tokens
   * identical in Light and opposite in Dark, passing a light-only sweep green while
   * four badges were wired to render white-on-light.
   */
  const MODES = args.includes('--light-only') ? ['Light'] : ['Light', 'Dark'];
  const perMode = {};
  let checked = 0;

  for (const slotState of SLOT_STATES) {
  SLOT_PASS = slotState;
  // slotInvalid prunes only the FILLED sweep: those combos have no slot layers to check.
  const combos = allCombos.filter(c => !(SLOT_PASS && cfg.slotInvalid && cfg.slotInvalid(c)));
  const stateLabel = MERGED ? (SLOT_PASS ? 'Filled ' : 'Empty ') : '';
  for (const MODE of MODES) {
    const before = findings.length;
    await page.evaluate((m) => window.__setMode(m === 'Light' ? 'light' : 'dark'), MODE);
    let seen = 0;
    for (const combo of combos) {
      const name = cfg.variantName(combo);
      const fig = figByName.get(name);
      if (!fig) { if (MODE === MODES[0]) rec(name, '', 'existence', 'variant present', 'MISSING'); continue; }
      await page.evaluate(([c, p, o]) => window.__setProps(c, p, o), [cfg.component, cfg.props(combo), { label: cfg.label, slots: SLOT_PASS ? cfg.slotPass : (cfg.slots ? cfg.slots(combo) : []), slotContent: cfg.slotContent ? cfg.slotContent(combo) : undefined, rootClass: cfg.rootClass }]);
        activeCombo = combo;
      const pseudo = cfg.pseudo ? cfg.pseudo(combo) : [];
      if (!await forceState(pseudo)) { rec(name, '', 'render', 'a rendered component', 'nothing'); continue; }
      // forcePseudoState does not itself flush style; read only after a recalc
      await page.evaluate(() => { void document.querySelector('#root > *').offsetWidth; });
      const dom = await page.evaluate(() => window.__anatomy());
      if (!dom) { rec(name, '', 'render', 'a rendered component', 'nothing'); continue; }
      await annotateAnchors(dom);
      seen++;
      compareNode(name, dom, fig, 'root', MODE);
    }
    for (let i = before; i < findings.length; i++) findings[i].mode = stateLabel + MODE;
    perMode[stateLabel + MODE] = { variants: seen, findings: findings.length - before };
    // The FIRST sub-pass of the FIRST mode is the headline count. Gating on `!SLOT_PASS`
    // once reported "0 variants checked" beside a detail line saying 30 —
    // the summary is the part anyone reads, so it has to be the true one.
    if (MODE === MODES[0] && slotState === SLOT_STATES[0]) checked = seen;
  }
  }

  await browser.close(); await server.close();

  const byField = {};
  for (const f of findings) byField[f.field] = (byField[f.field] || 0) + 1;
  console.log(`\ncomponent : ${which}${MERGED ? '  [merged: both slot states]' : ''}`);
  console.log(`variants  : ${checked} checked of ${allCombos.length} expected`);
  console.log(`findings  : ${findings.length}`);
  console.log(`box spread: height ${sizeSpread.height.toFixed(2)}px (checked, tolerance ${SIZE_EPS}px)   width ${sizeSpread.width.toFixed(2)}px (reported only — text shaping)`);
  console.log('by mode   : ' + Object.entries(perMode).map(([m, v]) => `${m} ${v.findings} findings over ${v.variants} variants`).join('   |   '));
  const baked = findings.filter(f => f.note === 'baked literal').length;
  if (baked) console.log(`            ${baked} of those are baked literals — a fixed colour cannot follow a mode`);
  if (allowed.length) {
    const byReason = {};
    for (const a of allowed) byReason[a.reason] = (byReason[a.reason] || 0) + 1;
    console.log('allowed   : ' + Object.entries(byReason).map(([r, n]) => `${n}x ${r}`).join('; '));
  }
  if (findings.length) {
    console.log('\nby field:');
    for (const [k, n] of Object.entries(byField).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${k}`);
    console.log('\nfirst 12:');
    for (const f of findings.slice(0, 12)) {
      console.log(`  ${f.variant}`);
      console.log(`      ${f.path} · ${f.field}: expected ${f.expected}, got ${f.actual}${f.note ? '  (' + f.note + ')' : ''}`);
    }
  }
  const outFile = args[args.indexOf('--json') + 1];
  if (args.includes('--json')) { writeFileSync(outFile, JSON.stringify({ checked, perMode, findings }, null, 2)); console.log(`\nwrote ${outFile}`); }
  console.log(findings.length ? '\n❌ FAIL' : '\n✅ Figma matches the browser');
  process.exit(findings.length ? 1 : 0);
}
