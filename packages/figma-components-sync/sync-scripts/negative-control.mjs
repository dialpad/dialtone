/**
 * Systematic negative control for verify-components.mjs.
 *
 * WHY THIS EXISTS
 *
 * The verifier's trustworthiness used to be established by hand: pick three to five
 * properties, corrupt them in Figma, check the run goes red. That method has a hole,
 * and it cost real time. `paddingRight` was captured by the harness and never
 * compared; because the first component's padding is symmetric, checking
 * `paddingLeft` looked equivalent. Four rounds of hand-picked corruptions missed it,
 * because a hand-picked corruption can only test a property someone thought to
 * corrupt — and the consequence was a component that verified clean while its close
 * button overlapped its text by 16px.
 *
 * The coverage guard in verify-components.mjs (`const EXEMPT`) closed the
 * "captured but never compared" hole: every property the harness READS must now be
 * compared or explicitly exempted. It does not prove that a comparison which exists
 * actually FIRES. That is this file's job.
 *
 * HOW
 *
 * Not by writing to Figma. Mutating the real file to test the checker is the fragile
 * approach being replaced, and it is only ever as complete as the person's
 * imagination. Instead this works at the data layer:
 *
 *   1. capture the real Figma node tree and the real browser anatomy, once, using
 *      the same REST call and the same verify-harness the verifier itself uses;
 *   2. enumerate every field name the comparison engine can emit, BY PARSING IT —
 *      so a comparison added tomorrow shows up here as an uncovered field rather
 *      than being silently untested;
 *   3. for each field, perturb the captured FIGMA-side data by an amount well past
 *      tolerance, one node at a time, and re-run the REAL compareNode;
 *   4. assert a finding naming that field came out.
 *
 * A `no` in the table is a comparison that does not fire. That is the most valuable
 * output this script has, so misses are diagnosed rather than merely counted: a
 * perturbation that never fired because the component has no such property is not
 * the same thing as a comparison that is dead.
 *
 *   node sync-scripts/negative-control.mjs badge
 *   node sync-scripts/negative-control.mjs button --mode Dark
 *   node sync-scripts/negative-control.mjs button --set 561:49545 --variants 20
 */
import './pin-cwd.mjs';   // launch directory must not matter
import 'dotenv/config';
import { readFileSync, writeFileSync } from 'fs';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { parse as parseColor } from 'culori';

import { COMPONENTS } from './component-axes.mjs';
import { combosFor } from './combos.mjs';
import { fetchVariantsByName } from './figma-variants.mjs';
import { matchedFor } from './cdp-provenance.mjs';
// The REAL comparison engine, never a copy. A copy would only ever verify the copy.
import {
  compareNode, figmaGet, findings, resetComparisonState, paintRGBA, setSlotPass,
} from './verify-components.mjs';

// This harness never runs the slot pass: it is measuring which comparisons fire, and
// SLOT_PASS changes which Figma children are walked. Stated explicitly rather than
// inherited from whatever flags happen to be on THIS script's argv.
setSlotPass(false);

const HARNESS = new URL('./verify-harness/', import.meta.url).pathname;
const FILE_KEY = process.env.FILE_KEY;

// ── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name, dflt) => { const i = argv.indexOf(`--${name}`); return i < 0 ? dflt : argv[i + 1]; };
const VALUED = new Set(['--set', '--mode', '--variants']);
const positional = argv.filter((a, i) => !a.startsWith('--') && !VALUED.has(argv[i - 1]));
const which = positional[0];
if (!which) throw new Error(`usage: negative-control.mjs <component> [--set <nodeId>] [--mode Light|Dark] [--variants N]`);
const cfg = COMPONENTS[which];
if (!cfg) throw new Error(`no verifier config for "${which}" — known: ${Object.keys(COMPONENTS).join(', ')}`);
const SET_ID = flag('set', cfg.figmaSetId);
if (!SET_ID) throw new Error(`${which} has no figmaSetId; pass --set`);
const MODE = flag('mode', 'Light');
const LIMIT = Number(flag('variants', 0)) || 0;

// ── field inventory, parsed out of the engine ───────────────────────────────
/**
 * Every field name `rec()` can emit, derived from the source rather than typed here.
 *
 * A hand-written list is the same failure mode as a hand-picked corruption: it only
 * covers what someone remembered. Parsing means a comparison added to
 * verify-components.mjs and not given a perturbation here becomes a hard error, the
 * same way an unexempted READ property is a hard error over there.
 */

/**
 * Comments have to go before anything is parsed.
 *
 * The engine is heavily commented and its prose contains apostrophes — "Button's
 * padding". A scanner that tracks quote state reads that as the start of a string
 * literal and swallows everything up to the next quote, which is the opening quote
 * of a field name. Stripping first is what makes the rest of this parsing honest.
 */
function stripComments (src) {
  let out = '', q = null, i = 0;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (q) {
      out += c;
      if (c === '\\') { out += n ?? ''; i += 2; continue; }
      if (c === q) q = null;
      i++; continue;
    }
    if (c === `'` || c === '"' || c === '`') { q = c; out += c; i++; continue; }
    if (c === '/' && n === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && n === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    out += c; i++;
  }
  return out;
}

const ENGINE_SRC = (() => {
  const src = readFileSync(new URL('./verify-components.mjs', import.meta.url), 'utf8');
  const cut = src.indexOf('// ── exported surface ──');
  if (cut < 0) throw new Error('could not find the engine/CLI boundary in verify-components.mjs');
  return stripComments(src.slice(0, cut));   // the CLI's own rec() calls are not compareNode's business
})();

/** Substring from `open` (a bracket) through its match, brackets included. */
function balanced (src, open) {
  let depth = 0, q = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
    if (c === `'` || c === '"' || c === '`') { q = c; continue; }
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) { depth--; if (depth === 0) return src.slice(open, i + 1); }
  }
  throw new Error('unbalanced bracket while parsing the engine');
}
/** Top-level comma-separated pieces of a bracketed group. */
function pieces (group) {
  const out = []; let depth = 0, q = null, start = 1;
  for (let i = 0; i < group.length; i++) {
    const c = group[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
    if (c === `'` || c === '"' || c === '`') { q = c; continue; }
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) { depth--; if (depth === 0) { out.push(group.slice(start, i)); break; } }
    else if (c === ',' && depth === 1) { out.push(group.slice(start, i)); start = i + 1; }
  }
  return out;
}
const quoted = s => [...s.matchAll(/'([A-Za-z]+)'/g)].map(m => m[1]);

/** Resolve an identifier passed as rec()'s `field` back to the literals it can hold. */
function literalsFor (name, at = ENGINE_SRC.length) {
  // NEAREST DECLARATION BEFORE THE CALL, not the first in the file. Two different loops
  // in the engine bind `k` — the padding/spacing comparison and the shadow-geometry one —
  // so resolving globally produced `innerShadowpaddingTop`: the shadow prefix from one
  // loop and the field name from the other. An identifier has to be read in the scope
  // that the rec() call actually sits in.
  const nearest = (re) => {
    let best = null;
    for (const m of ENGINE_SRC.matchAll(re)) {
      if (m.index >= at) break;
      best = m;
    }
    return best;
  };
  // `for (const [k, domV, figV] of [ [ 'paddingTop', … ], … ])` — the field is the
  // FIRST element of each tuple, so only that element is read. Taking every quoted
  // string in the array would drag in 'ELLIPSE', 'WRAP' and friends.
  const loop = nearest(new RegExp(`for \\(const \\[${name}\\b[^\\]]*\\] of (\\[)`, 'g'));
  if (loop) {
    const arr = balanced(ENGINE_SRC, loop.index + loop[0].length - 1);
    return pieces(arr).flatMap((tuple) => {
      if (!tuple.includes('[')) return [];              // trailing comma leaves an empty piece
      const head = pieces(balanced(tuple, tuple.indexOf('[')))[0] || '';
      // `cond ? 'counterAxisSpacing' : null` — the field is the consequent.
      const q = head.includes('?') ? quoted(head.slice(head.lastIndexOf('?'))) : quoted(head);
      if (q.length !== 1) throw new Error(`cannot read one field name out of tuple head: ${head.trim()}`);
      return q;
    });
  }
  const decl = nearest(new RegExp(`const ${name} = ([^;\\n]+)`, 'g'));
  // Expand, not just read quotes: `const label = … ? \`${field}[${i}]\` : field` holds no
  // quoted string at all, and returning [] from here is what made EMITTED throw.
  if (decl) return expandExpr(decl[1], 1, decl.index);
  return null;
}

/**
 * A field name is INDEXED when the engine reports one of several layers:
 * `dropShadow[1]Spread`. The index is not part of the comparison's identity — the same
 * code path emits it with and without — so it is stripped on both sides: out of the
 * enumerated names here, and out of a finding's name when matching. Otherwise a
 * perturbation would have to be written per layer index.
 */
const baseField = f => String(f).replace(/\[\d*\]/g, '');

/** Find a top-level `?` … `:` and return both arms, or null. */
function splitTernary (e) {
  let depth = 0, quote = null, q = -1;
  for (let i = 0; i < e.length; i++) {
    const ch = e[i];
    if (quote) { if (ch === quote && e[i - 1] !== '\\') quote = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) depth--;
    else if (ch === '?' && depth === 0 && e[i + 1] !== '.' && e[i + 1] !== '?') { q = i; break; }
  }
  if (q < 0) return null;
  depth = 0; quote = null;
  for (let i = q + 1; i < e.length; i++) {
    const ch = e[i];
    if (quote) { if (ch === quote && e[i - 1] !== '\\') quote = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) depth--;
    else if (ch === ':' && depth === 0) return { a: e.slice(q + 1, i), b: e.slice(i + 1) };
  }
  return null;
}

/**
 * Every literal string an expression passed to rec() as `field` can evaluate to.
 *
 * The engine builds some of those names rather than writing them out —
 * `layers.length > 1 ? \`${field}[${i}]\` : field` and \`${label}${k}\` — and this file
 * refused to run rather than guess, which is the right failure but meant the shadow
 * comparisons went untested for as long as they have existed. That includes the Spread
 * comparison, which is where B-90 was eventually found by accident.
 */
function expandExpr (expr, depth = 0, at = ENGINE_SRC.length) {
  const e = String(expr).trim();
  if (!e || depth > 5) return [];
  const lit = /^'([A-Za-z]+)'$/.exec(e);
  if (lit) return [lit[1]];
  const tern = splitTernary(e);
  if (tern) return [...new Set([...expandExpr(tern.a, depth + 1, at), ...expandExpr(tern.b, depth + 1, at)])];
  if (e.startsWith('`') && e.endsWith('`')) {
    const inner = e.slice(1, -1);
    let combos = [''];
    const re = /\$\{([^}]*)\}/g;
    let last = 0, m;
    while ((m = re.exec(inner)) !== null) {
      const text = inner.slice(last, m.index);
      const parts = expandExpr(m[1], depth + 1, at);
      // An unresolvable placeholder is a loop INDEX, which baseField strips anyway.
      const opts = parts.length ? parts : [''];
      combos = combos.flatMap(c => opts.map(o => c + text + o));
      last = re.lastIndex;
    }
    const tail = inner.slice(last);
    return [...new Set(combos.map(c => c + tail))];
  }
  if (/^(null|undefined)$/.test(e)) return [];
  if (/^[A-Za-z_$][\w$]*$/.test(e)) return literalsFor(e, at) || [];
  return quoted(e);
}

const EMITTED = (() => {
  const out = new Set();
  for (const m of ENGINE_SRC.matchAll(/\brec\s*\(/g)) {
    const call = balanced(ENGINE_SRC, m.index + m[0].length - 1);
    const field = (pieces(call)[2] || '').trim();
    const resolved = expandExpr(field, 0, m.index).map(baseField).filter(Boolean);
    if (!resolved.length) {
      throw new Error(`negative-control cannot enumerate the field names this rec() can emit: ${field}`);
    }
    resolved.forEach(f => out.add(f));
  }
  return [...out];
})();

// ── perturbations ───────────────────────────────────────────────────────────
const px = s => (typeof s === 'string' && s.endsWith('px') ? parseFloat(s) : null);
const alpha = (s) => { const c = s && parseColor(s); return c ? (c.alpha ?? 1) : 0; };
const SHAPES = ['VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'STAR', 'LINE', 'POLYGON', 'RECTANGLE'];
const num = s => !Number.isNaN(parseFloat(s));
/** A node the walk will give an `expectedRel` to, and therefore compare a coordinate for. */
const positionedChild = d => !d.__isRoot && d.style.position === 'absolute'
  && (d.__isPseudo ? (d.__painted && num(d.inset?.inlineStart) && num(d.inset?.blockStart)) : true);
const SVG_TAGS = ['path', 'svg', 'circle', 'rect', 'polygon', 'ellipse'];
const isAuto = n => n.layoutMode === 'HORIZONTAL' || n.layoutMode === 'VERTICAL';

/** Repaint a paint far outside tolerance, keeping its alpha so hue is what fails. */
function hostilePaint (p) {
  const cur = paintRGBA(p, MODE) || { r: 0, g: 0, b: 0, a: 1 };
  const magentaish = cur.r > 0.5 && cur.b > 0.5 && cur.g < 0.5;
  const far = magentaish ? { r: 0.15, g: 0.9, b: 0.15 } : { r: 1, g: 0, b: 1 };
  delete p.boundVariables;                 // a bound paint would resolve back to the token
  p.color = { ...far, a: cur.a };
  p.opacity = cur.a;
  return true;
}
const bump = (n, k, by) => { n[k] = (typeof n[k] === 'number' ? n[k] : 0) + by; return true; };

/**
 * One entry per field the engine can emit.
 *
 *   expect  — the field name a finding must carry for this to count as caught
 *   what    — the perturbation, for the report
 *   target  — which Figma nodes it can be applied to
 *   apply   — mutate the (cloned) node; return false to skip
 *   domPre  — which DOM nodes make the comparison reachable at all. Only used to
 *             DIAGNOSE a miss: zero matching DOM nodes means the component has no
 *             such property, which is a coverage limit, not a dead comparison.
 */
const PERTURBATIONS = [
  { expect: 'existence', what: 'delete the variant node outright', nullRoot: true,
    domPre: () => true,
    note: 'reachable only with no Figma node at all; the CLI reports its own "existence" '
      + 'finding for a missing variant and never calls compareNode, and the recursive walk '
      + 'stops at min(figKids, domKids), so inside compareNode this branch is dead code — '
      + 'childCount is what actually covers a missing node' },
  { expect: 'childCount', what: 'remove the last child of a frame',
    target: n => (n.children || []).length > 0,
    apply: n => { n.children.pop(); return true; },
    domPre: d => (d.children || []).length > 0 },
  { expect: 'background', what: 'frame fill -> hostile colour (hue flipped)',
    target: n => n.type !== 'TEXT' && !SHAPES.includes(n.type) && !!(n.fills || [])[0],
    apply: n => hostilePaint(n.fills[0]),
    domPre: d => alpha(d.style.backgroundColor) >= 0.005 },
  { expect: 'svgFill', what: 'shape fill -> hostile colour (hue flipped)',
    target: n => SHAPES.includes(n.type) && !!(n.fills || [])[0],
    apply: n => hostilePaint(n.fills[0]),
    domPre: d => SVG_TAGS.includes(d.tag) && alpha(d.style.fill) >= 0.005 },
  { expect: 'textColor', what: 'TEXT fill -> hostile colour (hue flipped)',
    target: n => n.type === 'TEXT' && !!(n.fills || [])[0],
    apply: n => hostilePaint(n.fills[0]),
    domPre: d => !!d.text },
  { expect: 'fontSize', what: 'TEXT fontSize +4px',
    target: n => n.type === 'TEXT' && typeof n.style?.fontSize === 'number',
    apply: n => bump(n.style, 'fontSize', 4),
    domPre: d => !!d.text },
  { expect: 'fontWeight', what: 'TEXT fontWeight stepped (400 <-> 700)',
    // The REST API reports a number here; the plugin API reports a style name, and
    // the engine reads both through FIGMA_WEIGHT. Step whichever form arrives.
    target: n => n.type === 'TEXT' && ['number', 'string'].includes(typeof n.style?.fontWeight),
    apply: (n) => {
      const w = n.style.fontWeight;
      n.style.fontWeight = typeof w === 'number' ? (w >= 600 ? 400 : 700) : (w === 'Bold' ? 'Regular' : 'Bold');
      return true;
    },
    domPre: d => !!d.text,
    note: 'compared on BOTH text branches — the ordinary TEXT node and the shortcut for a '
      + 'DOM node that carries text directly. It was once only on the first, the mirror of '
      + 'the lineHeight hole; both are closed, and this note records that the pair is now '
      + 'checked wherever text is' },
  { expect: 'lineHeight', what: 'TEXT lineHeightPx +6px',
    target: n => n.type === 'TEXT' && typeof n.style?.lineHeightPx === 'number',
    apply: n => bump(n.style, 'lineHeightPx', 6),
    domPre: d => !!d.text && !(d.children || []).length,
    note: 'compared on BOTH text branches. It used to be only on the shortcut branch, so a '
      + 'component whose label is a nested element never had its line-height checked; the '
      + 'ordinary TEXT-node branch compares it too now. Kept as a note because the pair '
      + '(weight, line-height) is easy to add to one branch and forget on the other' },
  /**
   * ONE PERTURBATION PER SIDE. A single `strokeWeight` bump proved the check saw the top
   * edge and said nothing about the other three, which is the same blind spot that let
   * SplitButton's zeroed inner border pass. Each side is corrupted on its own, through
   * `individualStrokeWeights` — the container REST uses when the four disagree, which is
   * exactly the state being tested.
   */
  ...[['strokeTopWeight', 'borderTopWidth'], ['strokeRightWeight', 'borderRightWidth'],
    ['strokeBottomWeight', 'borderBottomWidth'], ['strokeLeftWeight', 'borderLeftWidth'],
  ].map(([key, css]) => ({
    expect: key, what: `${key} +3px (or a 3px stroke added)`,
    target: n => n.type !== 'TEXT',
    apply: (n) => {
      const s = (n.strokes || [])[0];
      if (!s || (paintRGBA(s, MODE)?.a ?? 1) < 0.005) {
        n.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }];
        n.strokeWeight = 0;
      }
      const base = typeof n.strokeWeight === 'number' ? n.strokeWeight : 0;
      const isw = Object.assign({
        strokeTopWeight: base, strokeRightWeight: base,
        strokeBottomWeight: base, strokeLeftWeight: base,
      }, n.individualStrokeWeights || {});
      isw[key] = (typeof isw[key] === 'number' ? isw[key] : base) + 3;
      n.individualStrokeWeights = isw;
      return true;
    },
    // The DOM must have a readable width on THIS side, or the expectation is 0 either
    // way and a +3 on a side nobody looks at proves nothing.
    domPre: d => px(d.style[css]) != null })),

  { expect: 'borderColor', what: 'stroke paint -> hostile colour (hue flipped)',
    target: n => n.type !== 'TEXT' && !!(n.strokes || [])[0],
    apply: n => hostilePaint(n.strokes[0]),
    domPre: d => px(d.style.borderTopWidth) > 0 && alpha(d.style.borderTopColor) >= 0.005 },
  ...['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].map(k => ({
    expect: k, what: `${k} +5px`,
    target: n => n.type !== 'TEXT',
    apply: n => bump(n, k, 5),
    domPre: () => true,
  })),
  { expect: 'itemSpacing', what: 'itemSpacing +5px',
    target: n => n.type !== 'TEXT',
    apply: n => bump(n, 'itemSpacing', 5),
    domPre: d => px(d.style.columnGap) != null },
  /**
   * THE SLOT ASSERTIONS. These four exist because of B-108: the merged Badge built, toggled,
   * and put the icon on top of the label, and every value check passed because the DEFAULT
   * state was correct and nothing looked at the other one.
   *
   * All four are gated on a node having a `visible: false` child, and no captured node has
   * one — the sets these are captured from predate merged builds. So each perturbation
   * OPENS the gate as well as breaking the thing: it hides a child, then introduces the
   * fault. That is legitimate here for the same reason counterAxisSpacing's is — the gate is
   * Figma-side data a build could get wrong, and a perturbation that cannot be applied where
   * it is applied proves nothing.
   */
  { expect: 'slotLayout', what: 'a hidden child added to a frame whose layoutMode is NONE',
    target: n => (n.children || []).length > 0 && n.type !== 'TEXT',
    apply: (n) => { n.children[0].visible = false; n.layoutMode = 'NONE'; return true; },
    domPre: d => (d.children || []).length > 0,
    note: 'a hidden layer in a coordinate-placed frame cannot flow when revealed, which is '
      + 'exactly how the first merged Badge overlapped its own label' },
  { expect: 'slotAxisSizing',
    what: 'a hidden child, a pinned primary axis, and a box too small for the filled render',
    target: n => (n.children || []).length > 0 && isAuto(n) && n.absoluteBoundingBox,
    apply: (n) => {
      n.children[0].visible = false;
      n.primaryAxisSizingMode = 'FIXED';
      // Shrink the stored box so the filled DOM is demonstrably larger: that is the
      // condition the comparison tests, so the perturbation has to create it.
      n.absoluteBoundingBox = { ...n.absoluteBoundingBox, width: 1, height: 1 };
      return true;
    },
    domPre: d => (d.children || []).length > 0,
    slotPass: true,
    note: 'auto-layout is not enough — a pinned axis cannot grow, so revealing the layer '
      + 'changes nothing about the size. Only reachable in the FILLED sub-pass, which is where '
      + '"the frame has to grow" can be known at all' },
  { expect: 'slotToggle', what: 'a hidden child with no `visible` property reference',
    target: n => (n.children || []).length > 0 && isAuto(n),
    apply: (n) => {
      const k = n.children[0];
      k.visible = false;
      delete k.componentPropertyReferences;
      return true;
    },
    domPre: d => (d.children || []).length > 0,
    note: 'a layer nobody can reveal is a layer that is missing, and it is geometrically '
      + 'indistinguishable from a correct one' },
  { expect: 'slotSwap', what: 'a hidden child holding an INSTANCE with no `mainComponent` reference',
    target: n => (n.children || []).length > 0 && isAuto(n),
    apply: (n) => {
      const k = n.children[0];
      k.visible = false;
      k.componentPropertyReferences = { visible: 'Fake toggle#1:0' };
      // Fabricated on purpose: no captured set contains an INSTANCE, and the question this
      // comparison answers is "when a slot holds an instance, is it swappable" — so the
      // instance is part of the CONDITION, not part of the fault.
      k.children = [{ id: 'fake', name: 'fake-instance', type: 'INSTANCE', visible: true, children: [] }];
      return true;
    },
    domPre: d => (d.children || []).length > 0,
    note: 'an icon nobody can change is a slot in name only; the INSTANCE is fabricated '
      + 'because it is the precondition, not the defect' },
  { expect: 'counterAxisSpacing', what: 'layoutWrap -> WRAP with counterAxisSpacing +7px',
    target: n => isAuto(n),
    apply: (n) => { n.layoutWrap = 'WRAP'; return bump(n, 'counterAxisSpacing', 7); },
    domPre: d => px(d.style.rowGap) != null,
    note: 'the comparison is gated on layoutWrap, so the perturbation has to open the gate '
      + 'as well as change the value — both are Figma-side data a build could get wrong' },
  // AUTO-LAYOUT only, on both sides. Figma accepts a minimum solely on an auto-layout
  // frame, and the engine gates the comparison the same way — so perturbing a fixed frame
  // could never produce a finding, and the run reported a GAP on Toggle (90 nodes reached,
  // nothing fired) for a comparison that was behaving exactly as designed. A perturbation
  // has to be applicable where it is applied, or its miss says nothing.
  // BUMP an existing minimum; do not invent one. The comparison skips whenever the DOM
  // side is null (`if (k == null || domV == null) continue`), because a CSS element with no
  // min-width and a Figma frame with no minWidth agree — so setting 500 on a frame whose
  // DOM counterpart has no minimum could never fire, and the run called that a GAP on
  // Toggle with 24 nodes reached. Requiring a number on the Figma side aims the
  // perturbation at the pairs where both sides have something to disagree about.
  { expect: 'minWidth', what: 'an existing minWidth +500px (auto-layout only)',
    target: n => n.type !== 'TEXT' && isAuto(n) && typeof n.minWidth === 'number',
    apply: n => bump(n, 'minWidth', 500),
    domPre: d => px(d.style.minWidth) > 0 },
  { expect: 'minHeight', what: 'an existing minHeight +500px (auto-layout only)',
    target: n => n.type !== 'TEXT' && isAuto(n) && typeof n.minHeight === 'number',
    apply: n => bump(n, 'minHeight', 500),
    domPre: d => px(d.style.minHeight) > 0 },
  /**
   * ONE PERTURBATION PER CORNER, for the same reason as the sides above: the old single
   * `cornerRadius` bump could not tell a check that reads one corner from a check that
   * reads four. Written as the per-corner field, which is what REST reports once the
   * corners differ.
   */
  ...[['topLeftRadius', 'borderTopLeftRadius'], ['topRightRadius', 'borderTopRightRadius'],
    ['bottomRightRadius', 'borderBottomRightRadius'],
    ['bottomLeftRadius', 'borderBottomLeftRadius'],
  ].map(([key, css]) => ({
    expect: key, what: `${key} +7px`,
    target: n => n.type !== 'TEXT' && !['ELLIPSE', 'VECTOR', 'LINE', 'POLYGON', 'STAR'].includes(n.type),
    apply: (n) => {
      const base = typeof n[key] === 'number' ? n[key]
        : (typeof n.cornerRadius === 'number' ? n.cornerRadius : 0);
      n[key] = base + 7;
      return true;
    },
    // A pill radius clamps in CSS and stays literal in Figma, so it is skipped.
    domPre: d => px(d.style[css]) != null && px(d.style[css]) < 999 })),
  // Only a positioned CHILD carries a comparable coordinate: the walk sets
  // `expectedRel` on absolutely-positioned element children and on PAINTED
  // pseudo-elements whose insets parse. The chip's `.d-chip__close::before` is an
  // invisible click-target extension — absolute, but painting nothing, so it is
  // never turned into a child and its coordinate is not a missed comparison.
  { expect: 'insetEnd', what: 'absoluteBoundingBox.x +6px',
    target: n => !!n.absoluteBoundingBox,
    apply: n => bump(n.absoluteBoundingBox, 'x', 6),
    domPre: d => positionedChild(d) && d.anchor === 'end' },
  { expect: 'x', what: 'absoluteBoundingBox.x +6px',
    target: n => !!n.absoluteBoundingBox,
    apply: n => bump(n.absoluteBoundingBox, 'x', 6),
    domPre: d => positionedChild(d) && d.anchor !== 'end' },
  { expect: 'y', what: 'absoluteBoundingBox.y +6px',
    target: n => !!n.absoluteBoundingBox,
    apply: n => bump(n.absoluteBoundingBox, 'y', 6),
    domPre: d => positionedChild(d) },
  { expect: 'height', what: 'absoluteBoundingBox.height +5px',
    target: n => n.type !== 'TEXT' && !!n.absoluteBoundingBox,
    apply: n => bump(n.absoluteBoundingBox, 'height', 5),
    domPre: d => d.style.display !== 'inline' },
  { expect: 'opacity', what: 'opacity -> 0.42',
    target: () => true,
    apply: (n) => { n.opacity = 0.42; return true; },
    domPre: () => true },
  { expect: 'direction', what: 'layoutMode flipped (HORIZONTAL <-> VERTICAL)',
    target: n => isAuto(n),
    apply: (n) => { n.layoutMode = n.layoutMode === 'HORIZONTAL' ? 'VERTICAL' : 'HORIZONTAL'; return true; },
    domPre: d => /flex|grid/.test(d.style.display) },
  { expect: 'counterAxisAlign', what: 'counterAxisAlignItems flipped (CENTER <-> MIN)',
    target: n => isAuto(n),
    apply: (n) => { n.counterAxisAlignItems = n.counterAxisAlignItems === 'CENTER' ? 'MIN' : 'CENTER'; return true; },
    domPre: d => !['normal', 'stretch', 'baseline'].includes(d.style.alignItems) },
  { expect: 'primaryAxisAlign', what: 'primaryAxisAlignItems flipped (CENTER <-> MAX)',
    target: n => isAuto(n),
    apply: (n) => { n.primaryAxisAlignItems = n.primaryAxisAlignItems === 'CENTER' ? 'MAX' : 'CENTER'; return true; },
    domPre: d => /flex|grid/.test(d.style.display) && d.style.justifyContent !== 'normal' },
  { expect: 'innerShadow', what: 'all effects removed',
    target: n => (n.effects || []).length > 0,
    apply: (n) => { n.effects = []; return true; },
    domPre: d => d.style.boxShadow && d.style.boxShadow !== 'none' && /inset/.test(d.style.boxShadow) },
  { expect: 'dropShadow', what: 'all effects removed',
    target: n => (n.effects || []).length > 0,
    apply: (n) => { n.effects = []; return true; },
    domPre: d => d.style.boxShadow && d.style.boxShadow !== 'none' && !/inset/.test(d.style.boxShadow) },
  { expect: 'shadow', what: 'a DROP_SHADOW effect added',
    target: n => (n.effects || []).length === 0,
    apply: (n) => {
      n.effects = [{ type: 'DROP_SHADOW', visible: true, color: { r: 0, g: 0, b: 0, a: 0.5 },
        offset: { x: 0, y: 2 }, radius: 4, blendMode: 'NORMAL' }];
      return true;
    },
    domPre: d => !d.style.boxShadow || d.style.boxShadow === 'none' },
  /**
   * EIGHTEEN comparisons this control could not reach until the enumerator learned the
   * engine's BUILT field names. Two matter more than the rest: `dropShadowSpread` /
   * `innerShadowSpread` is where B-90 lived (298 findings) and `layoutMode` is where the
   * double spinner lived (420 findings). Both fired in anger without ever having been
   * proven to fire, which is the thing this file exists to prevent.
   */
  { expect: 'fontFamily', what: 'TEXT fontFamily -> a face nothing declares',
    target: n => n.type === 'TEXT' && typeof n.style?.fontFamily === 'string',
    apply: (n) => { n.style.fontFamily = 'Comic Sans MS'; return true; },
    domPre: d => !!d.text },
  ...['svgWidth', 'svgHeight'].map(k => ({
    expect: k, what: `${k === 'svgWidth' ? 'width' : 'height'} of an imported <svg> +6px`,
    target: n => !!n.absoluteBoundingBox,
    apply: n => bump(n.absoluteBoundingBox, k === 'svgWidth' ? 'width' : 'height', 6),
    // Only reachable where the DOM node IS an svg: the engine compares its box and
    // returns before any other comparison on that subtree.
    domPre: d => d.tag === 'svg',
  })),
  { expect: 'width', what: 'absoluteBoundingBox.width +6px on a PINNED axis',
    // Compared only where the width is a number the builder wrote rather than one the
    // text engine produced: layout NONE, or a FIXED axis.
    target: n => !!n.absoluteBoundingBox
      && (!n.layoutMode || n.layoutMode === 'NONE'
        || (n.layoutMode === 'HORIZONTAL' && n.primaryAxisSizingMode === 'FIXED')
        || (n.layoutMode === 'VERTICAL' && n.counterAxisSizingMode === 'FIXED')),
    apply: n => bump(n.absoluteBoundingBox, 'width', 6),
    domPre: d => d.tag !== 'svg' && d.style.display !== 'inline' },
  // Inverted with the comparison it tests. The builder now COUNTS the stroke in the layout,
  // because a CSS border adds to a shrink-to-fit box; the fold that made `false` correct is
  // gone. So the fault to inject is switching it off, not on.
  { expect: 'strokesIncludedInLayout', what: 'strokesIncludedInLayout -> false on a stroked auto-layout frame',
    target: n => n.type !== 'TEXT' && !!n.layoutMode && n.layoutMode !== 'NONE'
      && !!(n.strokes || []).length,
    apply: (n) => { n.strokesIncludedInLayout = false; return true; },
    domPre: d => px(d.style.borderTopWidth) > 0 && alpha(d.style.borderTopColor) >= 0.005 },
  { expect: 'clipsContent', what: 'clipsContent -> false on a frame carrying an inset ring',
    target: n => (n.effects || []).some(e => e.type === 'INNER_SHADOW'),
    apply: (n) => { n.clipsContent = false; return true; },
    domPre: d => /inset/.test(d.style.boxShadow || '') },
  { expect: 'outline', what: 'every effect removed from a node the CSS gives an outline',
    target: n => (n.effects || []).length > 0,
    apply: (n) => { n.effects = []; return true; },
    domPre: d => d.style.outlineStyle && d.style.outlineStyle !== 'none' && px(d.style.outlineWidth) > 0 },
  // EVERY zero-radius effect, not the first. The engine picks which effect the outline
  // claims by colour, and a focused Radio carries an outline AND an inset shadow — so
  // perturbing only the first often moved the one the outline branch does not read.
  // Excluding nodes that also have a box-shadow (the first attempt) made these
  // unreachable on the one component in the set that has a real CSS outline; the matcher
  // only requires the expected field to be PRESENT, so extra findings cost nothing.
  { expect: 'outlineWidth', what: 'spread +4px on every zero-radius effect',
    target: n => (n.effects || []).some(e => (e.radius ?? 0) < 0.5),
    apply: (n) => n.effects.filter(x => (x.radius ?? 0) < 0.5)
      .map(e => bump(e, 'spread', 4)).some(Boolean),
    domPre: d => d.style.outlineStyle && d.style.outlineStyle !== 'none' && px(d.style.outlineWidth) > 0 },
  { expect: 'outlineColor', what: 'every zero-radius effect colour -> hostile (hue flipped)',
    target: n => (n.effects || []).some(e => (e.radius ?? 0) < 0.5 && e.color),
    apply: (n) => n.effects.filter(x => (x.radius ?? 0) < 0.5 && x.color)
      .map(e => hostilePaint(e)).some(Boolean),
    domPre: d => d.style.outlineStyle && d.style.outlineStyle !== 'none' && px(d.style.outlineWidth) > 0 },
  ...[['INNER_SHADOW', 'innerShadow', true], ['DROP_SHADOW', 'dropShadow', false]]
    .flatMap(([type, prefix, isInset]) => ([
      ['OffsetX', e => bump(e.offset, 'x', 5)],
      ['OffsetY', e => bump(e.offset, 'y', 5)],
      ['Blur', e => bump(e, 'radius', 7)],
      ['Spread', e => bump(e, 'spread', 4)],
    ].map(([suffix, mutate]) => ({
      expect: `${prefix}${suffix}`,
      what: `${isInset ? 'inset' : 'outset'} shadow ${suffix.toLowerCase()} shifted`,
      target: n => (n.effects || []).some(e => e.type === type && e.offset),
      apply: (n) => mutate(n.effects.find(e => e.type === type && e.offset)),
      // A box-shadow of the matching kind must exist, or the engine never pairs an
      // effect with a layer and the geometry is never reached.
      domPre: d => !!d.style.boxShadow && d.style.boxShadow !== 'none'
        && isInset === /inset/.test(d.style.boxShadow),
    })))),
  // An <img> is the only thing here whose content is a RESOURCE. Both of these guard
  // B-98, where an empty Figma frame agreed with a rendered photograph because no
  // comparison read anything that differed.
  { expect: 'imageFill', what: 'the IMAGE paint removed from an <img> node',
    target: n => (n.fills || []).some(f => f.type === 'IMAGE'),
    apply: (n) => { n.fills = []; return true; },
    domPre: d => String(d.tag || '').toLowerCase() === 'img' },
  { expect: 'imageScaleMode', what: 'IMAGE scaleMode flipped (FILL <-> FIT)',
    target: n => (n.fills || []).some(f => f.type === 'IMAGE'),
    apply: (n) => {
      const f = n.fills.find(x => x.type === 'IMAGE');
      f.scaleMode = f.scaleMode === 'FILL' ? 'FIT' : 'FILL';
      return true;
    },
    domPre: d => String(d.tag || '').toLowerCase() === 'img' },
  { expect: 'layoutMode', what: 'auto-layout forced onto a frame whose CSS children overlap',
    target: n => n.type !== 'TEXT',
    apply: (n) => { n.layoutMode = 'HORIZONTAL'; return true; },
    // The spinner is the overlap case: `.d-loader` is a grid holding a track ring and an
    // arc at the same offset, which auto-layout would lay side by side.
    domPre: d => (d.classes || []).includes('d-loader') },
];

// Both directions, so the inventory cannot drift from the perturbations:
{
  const covered = new Set(PERTURBATIONS.map(p => p.expect));
  const missing = EMITTED.filter(f => !covered.has(f));
  if (missing.length) {
    throw new Error('The engine can report these fields and this negative control never perturbs them:\n  '
      + missing.join('\n  ') + '\nAdd a perturbation, or the comparison is untested.');
  }
  const stale = [...covered].filter(f => !EMITTED.includes(f));
  if (stale.length) throw new Error(`perturbations for fields the engine no longer emits: ${stale.join(', ')}`);
}

// `--list-fields` answers "what can the engine report, and is each one perturbed?"
// without paying for a browser — the cheap check to run in CI or after editing the
// engine.
if (argv.includes('--list-fields')) {
  // TAB-separated: a name longer than the pad width runs straight into the description
  // otherwise, and the concatenation then reads as a field name that does not exist.
  for (const p of PERTURBATIONS) console.log(`${p.expect}\t${p.what}`);
  console.log(`\n${EMITTED.length} fields emittable, all perturbed`);
  process.exit(0);
}

// ── capture ─────────────────────────────────────────────────────────────────
/**
 * Capture the real thing ONCE: the Figma node tree over REST, and the browser anatomy
 * from the same harness the verifier itself renders in.
 *
 * Everything after this point is pure data. The perturbations mutate a structuredClone,
 * never Figma — which is the whole reason this approach replaced corrupting the real file
 * by hand: it cannot damage the thing it is testing against, and it can afford to try
 * every field on every node rather than the handful someone thought to try.
 */
async function capture () {
  // verify-components reads its slot mode from ITS OWN process.argv, which is THIS
  // script's argv once imported. State it rather than inheriting an accident.
  setSlotPass(false);

  // The SAME fetch verify-components uses. A control that captures a shallower tree
  // than the check runs on can never perturb a field that only exists deeper — it would
  // report "all comparisons fire" about data the real pass does not see.
  const figByName = await fetchVariantsByName(figmaGet, FILE_KEY, SET_ID);

  const server = await createServer({ root: HARNESS, configFile: HARNESS + 'vite.config.js',
    server: { port: 0 }, logLevel: 'error' });
  await server.listen();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`http://localhost:${server.httpServer.address().port}/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => typeof window.__anatomy === 'function', null, { timeout: 30000 });

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root: cdpDoc } = await cdp.send('DOM.getDocument', { depth: -1 });

  let forced = null;
  // which variant is being rendered, so a combo-dependent stateTarget can resolve
  let activeCombo = {};
  async function forceState (pseudoClasses) {
    if (forced) {
      await cdp.send('CSS.forcePseudoState', { nodeId: forced, forcedPseudoClasses: [] }).catch(() => {});
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

  // The mode is set on the DOCUMENT. An attribute on the component's own root element
  // redeclares that palette for its whole subtree and defeats the other mode (B-95).
  await page.evaluate((m) => window.__setMode(m === 'Light' ? 'light' : 'dark'), MODE);

    const combos = combosFor(cfg);

  /**
   * SAMPLE ACROSS THE SPACE, not the first N.
   *
   * `--variants 24` used to take the first 24 combos, and combos are generated by nesting
   * the axes — so every one of them carries the FIRST value of every later axis. On Radio
   * that meant no `state=focus` variant, and Radio's focus ring is the one real CSS
   * `outline` in the set: all three outline comparisons reported "this component has no
   * such property" about a component that plainly has it. Striding makes a small sample
   * span every axis value, which is the point of sampling.
   */
  const sampled = LIMIT && LIMIT < combos.length
    ? Array.from({ length: LIMIT }, (_, i) => combos[Math.floor(i * combos.length / LIMIT)])
    : combos;

  const out = [];
  for (const combo of sampled) {
    const name = cfg.variantName(combo);
    const fig = figByName.get(name);
    if (!fig) continue;
    await page.evaluate(([c, p, o]) => window.__setProps(c, p, o),
      [cfg.component, cfg.props(combo),
        { label: cfg.label, slots: cfg.slots ? cfg.slots(combo) : [], rootClass: cfg.rootClass }]);
    activeCombo = combo;
    if (!await forceState(cfg.pseudo ? cfg.pseudo(combo) : [])) continue;
    await page.evaluate(() => { void document.querySelector('#root > *').offsetWidth; });
    const dom = await page.evaluate(() => window.__anatomy());
    if (!dom) continue;
    out.push({ name, dom, fig });
  }

  await browser.close();
  await server.close();
  return out;
}

/**
 * Wrap the Figma tree so the run can tell "the comparison looked at this node and said
 * nothing" apart from "the walk never got there".
 *
 * That distinction is the most useful thing this script reports: a perturbation that
 * fired nothing because the component has no such property is not a dead comparison,
 * and only reachability separates the two.
 */
function instrument (node, visited, cache = new Map()) {
  if (!node || typeof node !== 'object') return node;
  if (cache.has(node)) return cache.get(node);
  const proxy = new Proxy(node, {
    get (t, k) {
      // Reading ANY property is what "reached" means: the engine inspects `type` and
      // `name` while deciding whether to descend, and a node it never touched cannot
      // have been compared. `visited` holds the RAW target, because the caller asks
      // `visited.has(perturbed)` about the node it mutated, not about a proxy.
      visited.add(t);
      const v = t[k];
      // Children are proxied lazily, and creating a proxy is not a read — so a child
      // counts as reached only once the comparison actually looks at it.
      if (k === 'children' && Array.isArray(v)) return v.map(c => instrument(c, visited, cache));
      return v;
    },
  });
  cache.set(node, proxy);
  return proxy;
}

const treePaths = (n, path = [], out = []) => {
  out.push(path);
  (n.children || []).forEach((c, i) => treePaths(c, [...path, i], out));
  return out;
};
const nodeAt = (root, path) => path.reduce((n, i) => n.children[i], root);
/**
 * Every box the walk can see, flattened, each tagged with what the walk will make of
 * it. Pseudo-elements are real painted boxes with no DOM node, and whether one is
 * PAINTED decides whether the walk treats it as a child at all.
 */
const flatDom = (d, out = [], isRoot = true) => {
  out.push({ ...d, __isRoot: isRoot, __isPseudo: false, __painted: true });
  for (const pe of d.pseudos || []) {
    const painted = alpha(pe.style.backgroundColor) >= 0.005 || (pe.style.boxShadow && pe.style.boxShadow !== 'none');
    out.push({ ...pe, tag: pe.pseudo, classes: [pe.pseudo], children: [], text: null,
      __isRoot: false, __isPseudo: true, __painted: !!painted });
  }
  (d.children || []).forEach(c => flatDom(c, out, false));
  return out;
};
const key = f => `${f.variant}|${f.path}|${f.field}`;

function runComparison (cap, figRoot) {
  resetComparisonState();
  compareNode(cap.name, cap.dom, figRoot, 'root', MODE);
  return findings.map(f => ({ ...f }));
}

const captured = await capture();
if (!captured.length) throw new Error('captured no variants — nothing to test');

const baseline = [];
for (const cap of captured) baseline.push(...runComparison(cap, cap.fig));
const baselineKeys = new Set(baseline.map(key));

const results = [];
for (const p of PERTURBATIONS) {
  const domOpportunities = captured.reduce((n, c) => n + flatDom(c.dom).filter(p.domPre).length, 0);
  let applications = 0, reached = 0, caught = null;
  const otherFields = new Set();

  outer:
  for (const cap of captured) {
    for (const path of treePaths(cap.fig)) {
      const clone = structuredClone(cap.fig);
      let figRoot;
      const visited = new Set();
      let perturbed = null;
      if (p.nullRoot) {
        if (path.length) continue;          // the whole node is what goes missing
        figRoot = undefined;
      } else {
        perturbed = nodeAt(clone, path);
        if (!p.target(perturbed) || !p.apply(perturbed)) continue;
        figRoot = instrument(clone, visited);
      }
      applications++;
      /**
       * Some comparisons only exist in the FILLED sub-pass of a merged check — `slotAxisSizing`
       * asks whether a frame that has to grow can, and "has to grow" is only knowable there.
       * A perturbation can declare that it needs that mode, and it is set for the length of
       * this one comparison and restored afterwards, so no other perturbation inherits it.
       *
       * Without this, the perturbation could not fire at all and the control reported it as a
       * GAP — correctly. The alternative would have been to leave the comparison untested and
       * the inventory technically satisfied, which is the state this whole script exists to
       * make impossible.
       */
      if (p.slotPass) setSlotPass(true);
      const out = runComparison(cap, figRoot).filter(f => !baselineKeys.has(key(f)));
      if (p.slotPass) setSlotPass(false);
      if (perturbed && visited.has(perturbed)) reached++;
      const hit = out.find(f => baseField(f.field) === p.expect);
      if (hit) {
        caught = { variant: cap.name, at: hit.path, expected: hit.expected, actual: hit.actual };
        break outer;
      }
      out.forEach(f => otherFields.add(baseField(f.field)));
    }
  }
  results.push({ p, caught, applications, reached, domOpportunities, otherFields: [...otherFields] });
}

// ── report ──────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
console.log(`\ncomponent : ${which}   (set ${SET_ID})`);
console.log(`mode      : ${MODE}`);
console.log(`variants  : ${captured.length} captured`);
console.log(`baseline  : ${baseline.length} findings before any perturbation`);
console.log(`fields    : ${EMITTED.length} emittable by the engine, ${PERTURBATIONS.length} perturbations\n`);

console.log(`${pad('property', 20)}${pad('perturbation', 52)}${pad('caught', 8)}first fired at`);
console.log('-'.repeat(118));
for (const r of results) {
  console.log(`${pad(r.p.expect, 20)}${pad(r.p.what, 52)}${pad(r.caught ? 'yes' : 'NO', 8)}${r.caught ? r.caught.at : ''}`);
}
console.log('-'.repeat(118));
const misses = results.filter(r => !r.caught);
console.log(`${results.length - misses.length} of ${results.length} comparisons fired\n`);

/**
 * A miss is not automatically a gap, and pretending otherwise would repeat exactly
 * the mistake this file exists to stop — a check that looks thorough and is not.
 * Four distinct causes, only the last of which indicts the verifier.
 */
function diagnose (r) {
  if (r.domOpportunities === 0) {
    return ['not exercised', `no DOM node in ${captured.length} variants meets the precondition — this component has no such property`];
  }
  if (r.applications === 0) return ['not applied', 'no Figma node matched the perturbation target'];
  if (r.reached === 0) return ['unreachable', `${r.applications} nodes perturbed, none of them reached by the walk`];
  return ['GAP', `${r.applications} nodes perturbed, ${r.reached} reached by the walk, no finding named "${r.p.expect}"`];
}
const gaps = [];
if (misses.length) {
  console.log('misses, diagnosed:');
  for (const r of misses) {
    const [verdict, why] = diagnose(r);
    if (verdict === 'GAP') gaps.push(r.p.expect);
    console.log(`  ${pad(r.p.expect, 20)}${pad(verdict, 14)}${why}`);
    if (r.otherFields.length) console.log(`  ${' '.repeat(34)}the same perturbation did trigger: ${r.otherFields.join(', ')}`);
    if (r.p.note) console.log(`  ${' '.repeat(34)}note: ${r.p.note}`);
  }
  console.log('');
}

// `--json <path>` writes the run as data. Union coverage across components is the whole
// point of running this per component, and scraping a column-aligned table for it is how
// I mis-read `outline` for `outlineWidth` and a padded name for a field that never existed.
if (argv.includes('--json')) {
  const out = argv[argv.indexOf('--json') + 1];
  writeFileSync(out, JSON.stringify({
    component: which, mode: MODE, variants: captured.length,
    fields: results.map(r => ({
      expect: r.p.expect, what: r.p.what, caught: !!r.caught,
      verdict: r.caught ? 'fired' : diagnose(r)[0],
      applications: r.applications, reached: r.reached,
      domOpportunities: r.domOpportunities, otherFields: r.otherFields,
    })),
  }, null, 2));
  console.log(`\nwrote ${out}`);
}

const caveats = results.filter(r => r.caught && r.p.note);
if (caveats.length) {
  console.log('caught, with a caveat:');
  for (const r of caveats) console.log(`  ${r.p.expect}: ${r.p.note}`);
  console.log('');
}

console.log('gaps (a comparison that exists and does not fire):');
console.log(gaps.length ? gaps.map(g => `  ${g}`).join('\n') : '  none');
console.log(gaps.length ? '\n❌ FAIL' : '\n✅ every reachable comparison fired');
process.exit(gaps.length ? 1 : 0);
