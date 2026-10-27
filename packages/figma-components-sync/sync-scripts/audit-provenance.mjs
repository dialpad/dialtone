/**
 * Audit Figma's bound variables against the token the BROWSER says is declared.
 *
 * The verifier compares rendered values, so a binding to the wrong variable passes
 * green whenever that variable happens to carry the right colour. That is how H-9
 * survived: `.d-link[disabled]` matched every link, and `--dt-color-link-disabled`
 * is a perfectly plausible colour for a link.
 *
 * This asks a different question — not "does it look right?" but "is it wired to
 * the token the stylesheet actually names?" The oracle is Chrome's own cascade
 * (CSS.getMatchedStylesForNode), so it is independent of our parser and catches
 * derivation errors, not just write errors.
 *
 * READ-ONLY. It changes nothing in the file.
 *
 *   node audit-provenance.mjs link --set 79:231
 *   node audit-provenance.mjs button --set 49:1142 --json out.json
 */
import './pin-cwd.mjs';   // launch directory must not matter
import 'dotenv/config';
import { writeFileSync } from 'fs';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { COMPONENTS } from './component-axes.mjs';
import { combosFor } from './combos.mjs';
import { fetchVariantsByName } from './figma-variants.mjs';
import { converter, parse as parseColor } from 'culori';
import { loadLibrary } from './remote-variables.mjs';
import { exemplarSlots } from './exemplar-slots.mjs';
import { figmaChildParts } from './figma-mapping.mjs';
import { tokensFor, tokensForPseudo, toFigmaName, shadowColorToken, shadowLayerColorTokens } from './cdp-provenance.mjs';

const API = 'https://api.figma.com';
const HARNESS = new URL('./verify-harness/', import.meta.url).pathname;
const TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
const FILE_KEY = process.env.FILE_KEY;
if (!TOKEN || !FILE_KEY) throw new Error('PERSONAL_ACCESS_TOKEN and FILE_KEY required');

const args = process.argv.slice(2);
const which = args.find(a => !a.startsWith('--'));
const setId = args[args.indexOf('--set') + 1];
const cfg = COMPONENTS[which];
const EXEMPLAR_SLOTS = exemplarSlots(cfg);
/** Declared exemplar slots, skipped and counted. */
const exemplars = [];
if (!cfg || !setId) throw new Error('usage: audit-provenance.mjs <component> --set <nodeId>');

async function figmaGet (path) {
  for (let i = 1; i <= 4; i++) {
    const r = await fetch(`${API}${path}`, { headers: { 'X-Figma-Token': TOKEN } });
    if (r.ok) return r.json();
    if (i === 4) throw new Error(`GET ${path} -> ${r.status}`);
    await new Promise(res => setTimeout(res, i * 2000));
  }
}

const varsRes = await figmaGet(`/v1/files/${FILE_KEY}/variables/local`);
const VM = varsRes.meta.variables;
const LIB = await loadLibrary(figmaGet, process.env.TOKENS_FILE_KEY);
// A remote variable is named through the library file by its key; an id with no key
// prefix that this file does not hold is an id local to the library.
const varName = id => (VM[id] ?? LIB?.fromRemote(id) ?? LIB?.VM[id])?.name ?? `«unknown ${id}»`;
// A variable that declares itself DERIVED is a deliberate stand-in for a value the
// CSS computes or hardcodes and Dialtone has no token for. Binding one is the
// intended outcome, not a mis-binding — but it is counted, never hidden.
const isDerived = name => Object.values(VM).some(v => v.name === name && (v.description || '').startsWith('DERIVED'));

// ── which Figma property carries which binding ──────────────────────────────
function figmaBindings (node) {
  const out = {};
  const bv = node.boundVariables || {};
  const paintVar = (paints, key) => {
    const p = (paints || [])[0];
    if (p && p.boundVariables && p.boundVariables.color) out[key] = varName(p.boundVariables.color.id);
  };
  paintVar(node.fills, node.type === 'TEXT' ? 'textColor' : 'background');
  paintVar(node.strokes, 'borderColor');
  for (const [figKey, ourKey] of Object.entries({
    paddingTop: 'paddingTop', paddingBottom: 'paddingBottom',
    paddingLeft: 'paddingLeft', paddingRight: 'paddingRight',
    itemSpacing: 'itemSpacing',
    minWidth: 'minWidth', minHeight: 'minHeight',
  })) {
    if (bv[figKey] && bv[figKey].id) out[ourKey] = varName(bv[figKey].id);
  }
  /**
   * PER SIDE AND PER CORNER, under REST's own names.
   *
   * REST nests these bindings in two containers keyed by SCREAMING_SNAKE property
   * names — `individualStrokeWeights.BORDER_TOP_WEIGHT`,
   * `rectangleCornerRadii.RECTANGLE_TOP_LEFT_CORNER_RADIUS` — while the plugin API,
   * the builder, and the spec all call them `strokeTopWeight` and `topLeftRadius`.
   * Reading the plugin-side name straight off `boundVariables` finds nothing, which is
   * how every correctly-bound border once audited as a baked literal.
   *
   * Both containers also appear at the top level on nodes where the four agree, so each
   * key is looked up in its container first and then directly.
   */
  const NESTED = {
    /**
     * WIDTH AND HEIGHT ARE `size.x` AND `size.y` HERE.
     *
     * The plugin API binds `width` and `height`; REST reports the result as
     * `boundVariables.size = { x, y }`. Reading the plugin-side names off a REST payload
     * found nothing, so DtLoader — which is made of nothing but icons — reported all 32 of
     * its size tokens as declared-but-unbound and compared 0 bindings across 8 variants,
     * three runs running, while the plugin API confirmed every one of them was bound.
     *
     * Seventh time a REST field under a different name has looked like a missing value. The
     * rule has stopped being about any single field: a name that crosses these two APIs is
     * assumed different until checked in the API being read.
     */
    width: ['size', 'x'],
    height: ['size', 'y'],
    strokeTopWeight: ['individualStrokeWeights', 'BORDER_TOP_WEIGHT'],
    strokeRightWeight: ['individualStrokeWeights', 'BORDER_RIGHT_WEIGHT'],
    strokeBottomWeight: ['individualStrokeWeights', 'BORDER_BOTTOM_WEIGHT'],
    strokeLeftWeight: ['individualStrokeWeights', 'BORDER_LEFT_WEIGHT'],
    topLeftRadius: ['rectangleCornerRadii', 'RECTANGLE_TOP_LEFT_CORNER_RADIUS'],
    topRightRadius: ['rectangleCornerRadii', 'RECTANGLE_TOP_RIGHT_CORNER_RADIUS'],
    bottomRightRadius: ['rectangleCornerRadii', 'RECTANGLE_BOTTOM_RIGHT_CORNER_RADIUS'],
    bottomLeftRadius: ['rectangleCornerRadii', 'RECTANGLE_BOTTOM_LEFT_CORNER_RADIUS'],
  };
  for (const [ourKey, [container, restKey]] of Object.entries(NESTED)) {
    const nested = (bv[container] || {})[restKey];
    const direct = bv[ourKey];
    const hit = (nested && nested.id) ? nested : ((direct && direct.id) ? direct : null);
    if (hit) out[ourKey] = varName(hit.id);
  }
  // EVERY effect, not just the first. This read `effects[0]` only, so any node with
  // more than one effect had its remaining effects never audited for token identity —
  // and the pass still reported "N/N bindings agree", which is how 8 comparisons
  // quietly vanished when a checkbox's outline moved to the front of the array.
  // A node can legitimately carry an unbound effect (an OS system colour has no
  // token), so the FIRST bound one is what the declaration is compared against.
  const bound = (node.effects || []).filter(e => e && e.boundVariables && e.boundVariables.color);
  if (bound.length) out.effect = varName(bound[0].boundVariables.color.id);
  if (bound.length > 1) out.effectExtra = bound.slice(1).map(e => varName(e.boundVariables.color.id));
  return out;
}

// ── run ─────────────────────────────────────────────────────────────────────
// Re-rooted, batched — see figma-variants.mjs. The set-rooted fetch this replaced
// truncated five levels below each variant, without saying so.
const figByName = await fetchVariantsByName(figmaGet, FILE_KEY, setId);

const server = await createServer({ root: HARNESS, configFile: HARNESS + 'vite.config.js', server: { port: 0 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();
const page = await browser.newPage();
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
  if (!nodeId) return null;
  if (pseudoClasses.length) {
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: pseudoClasses });
    forced = nodeId;
  }
  return nodeId;
}

const findings = [];
const allowances = [];
const stats = { compared: 0, agree: 0, figmaUnbound: 0, cssComputed: 0, currentColor: 0, derived: 0, structural: {} };

const TYPE_KEYS = new Set(['textColor', 'fontSize', 'fontWeight', 'lineHeight']);
/**
 * Why a DECLARED token has no Figma binding on this node — or null if it should
 * have had one. Each branch names a property of Figma's model, not a shortcut:
 * an unbound token that fits none of them is a genuine baked literal.
 */
function unbindableReason (key, declared, fig, domInfo) {
  // `size/radius/circle` is `50%`. A Figma FLOAT variable holds a number of pixels
  // and cannot hold a percentage, so the resolved px value is the ONLY
  // representation (build-spec records the same allowance as `unbindable`).
  const st = (domInfo && domInfo.style) || {};
  const RADIUS_CSS = {
    topLeftRadius: 'borderTopLeftRadius', topRightRadius: 'borderTopRightRadius',
    bottomRightRadius: 'borderBottomRightRadius', bottomLeftRadius: 'borderBottomLeftRadius',
  };
  if (RADIUS_CSS[key] && /%\s*$/.test(st[RADIUS_CSS[key]] || '')) {
    return 'percentage radius — no FLOAT variable can hold it';
  }
  // Type tokens live on the Figma TEXT node; on the FRAME that owns the text there is
  // no field to bind. The TEXT child is compared by the text-leaf branch below.
  if (TYPE_KEYS.has(key) && fig.type !== 'TEXT') {
    return 'type token belongs to the TEXT child, not this frame';
  }
  // No stroke to bind a weight or colour to. The VALUES pass is what proves the
  // absence is correct (it compares borderTopWidth); this only explains the gap.
  /**
   * A HUGGING AXIS HAS NO SIZE TO BIND.
   *
   * `min-inline-size` and an explicit `inline-size` are only expressible on the axis Figma
   * is not measuring from content: a bound width fixes the frame at the variable's value,
   * which is a size the component never declared. The builder binds these only on a pinned
   * axis for that reason, so the declaration is right and the absence is its consequence.
   */
  if ((key === 'minWidth' || key === 'minHeight')
      && (!fig.layoutMode || fig.layoutMode === 'NONE')) {
    // Figma rejects a minimum on a frame that is not auto-layout ("Can only set minWidth on
    // auto layout nodes and their children"), so the builder skips it there — the frame
    // already carries an explicit width and height and a floor is unexpressible.
    return 'Figma allows no minimum on a non-auto-layout frame';
  }
  if (['width', 'height', 'minWidth', 'minHeight'].includes(key)
      && fig.layoutMode && fig.layoutMode !== 'NONE') {
    const axisAuto = (key === 'width' || key === 'minWidth')
      ? (fig.layoutMode === 'HORIZONTAL' ? fig.primaryAxisSizingMode : fig.counterAxisSizingMode)
      : (fig.layoutMode === 'VERTICAL' ? fig.primaryAxisSizingMode : fig.counterAxisSizingMode);
    if (axisAuto !== 'FIXED') return 'this axis hugs its content — no fixed size to bind';
  }
  const SIDE_KEYS = new Set(['strokeTopWeight', 'strokeRightWeight',
    'strokeBottomWeight', 'strokeLeftWeight']);
  if ((SIDE_KEYS.has(key) || key === 'borderColor') && !((fig.strokes || []).length)) {
    return 'CSS paints no visible border, so Figma carries no stroke';
  }
  // B-33: a variable bound to Figma's `opacity` is read as a PERCENTAGE, so the builder
  // writes opacity as a literal on purpose (generic-builder.js:456). The declaration is
  // correct and the absence of a binding is the deliberate consequence.
  if (key === 'opacity') {
    return 'opacity is never bound — a bound opacity is read as a percentage (B-33)';
  }
  // No fill to bind a background to. Symmetric with the stroke case below, and safe for
  // the same reason: the VALUES pass compares backgroundColor on every node, so a missing
  // fill where CSS paints one is caught there. This only explains the gap.
  if (key === 'background' && !((fig.fills || []).length)) {
    return 'CSS paints no visible background, so Figma carries no fill';
  }
  // A zero padding is the absence of padding: the builder writes nothing and REST reports
  // no padding key, so there is no field carrying a value to bind. Checked against the
  // CSS rather than inferred from the missing binding.
  if (/^padding/.test(key) && parseFloat(st['padding' + (key.slice(7) || '')] || '') === 0) {
    return 'zero-valued padding — nothing is written, so there is no field to bind';
  }
  // Padding and gap are auto-layout FIELDS. On a frame Figma gave no layoutMode there is
  // nothing to bind a spacing variable to — REST does not even report the numbers (B-94,
  // the same shape on the values side). DtKeyboardShortcut's root is a `<kbd>`, which is
  // `display: inline`: the builder cannot express that as auto-layout, so its
  // `spacing/75` inline padding has no field to carry the token. The values pass still
  // proves the SPACE is right — it checks the child's offset instead — so what is
  // unverifiable here is the token's identity, not the geometry.
  if ((/^padding/.test(key) || key === 'itemSpacing') && (!fig.layoutMode || fig.layoutMode === 'NONE')) {
    return 'auto-layout field on a frame with no auto-layout — no property to bind to';
  }
  return null;
}
const COLOR_KEYS = new Set(['background', 'borderColor', 'textColor', 'effect']);
const unbound = [];

const toRgb = converter('rgb');
const col = s2 => { if (!s2) return null; const c = parseColor(s2); if (!c) return null;
  const r = toRgb(c); return { r: r.r, g: r.g, b: r.b, a: r.alpha ?? 1 }; };

/** The name the builder gives an anatomy node — `classes[0]`, else the tag. */
const nameOf = (n) => (n.classes && n.classes[0]) || n.tag;

/**
 * This node's Figma children, in Figma's order, decorated for CDP lookup.
 *
 * Membership and order come from figmaChildParts, shared with the values pass. This
 * function only adds what the identity pass needs on top: a `name` for the path, the
 * owning selector for a pseudo (whose declarations hang off its owner), and a marker
 * for the synthesised glyph, which has no DOM node to resolve at all.
 */
function figmaKidsOf (dom) {
  const parts = figmaChildParts(dom, col);
  const asPseudo = (pe) => ({ name: pe.pseudo, pseudo: pe.pseudo, ownerSelector: dom.selector });
  return [
    ...(parts.glyphRect ? [{ name: 'glyph', synthetic: true }] : []),
    ...parts.before.map(asPseudo),
    ...parts.elements.map(c => ({ ...c, name: nameOf(c) })),
    ...parts.after.map(asPseudo),
  ];
}

/** Every descendant of a DOM node, depth-first. */
function flattenDom (node) {
  const out = [];
  for (const c of node.children || []) { out.push(c); out.push(...flattenDom(c)); }
  return out;
}

/** Walk DOM (via CDP node ids) and Figma in parallel, comparing token identity. */
async function compare (variant, domNodeId, fig, path, domInfo) {
  // A declared exemplar is a real instance of another component, restyled by this one in
  // the browser and not in Figma, so its tokens legitimately differ from the measured render.
  // Not walked into: its Figma node may also be a native SLOT, one level the DOM does not have.
  if (domInfo && domInfo.dataSlot && EXEMPLAR_SLOTS.has(domInfo.dataSlot)) {
    exemplars.push({ variant, path, slot: domInfo.dataSlot });
    return;
  }
  if (!fig) return;
  // A native SLOT wraps the content it holds, a level the DOM does not have: the content is
  // what is compared. (A declared exemplar returned above, before this.)
  if (fig && fig.type === 'SLOT' && (fig.children || []).length === 1) fig = fig.children[0];
  const { tokens, computed, own, chain } = await tokensFor(cdp, domNodeId);
  // Figma binds shadow FIELDS; the CSS names one composite. Compare like with like.
  const compositeEffect = tokens.effect;
  if (tokens.effect) {
    const c = shadowColorToken(tokens.effect, own, chain);
    if (c) tokens.effect = c;
  }
  const figBind = figmaBindings(fig);

  // A node can carry MORE THAN ONE effect, and each one has its own colour token: a
  // focused checked radio paints the checked dot and the focus ring as two separate
  // inset shadows. B-74 taught the Figma side to read every effect; the CSS side kept
  // collapsing `box-shadow` to a single token, so the second binding read as
  // "bound but undeclared" on all 100 focus variants. Compare the two as SETS.
  const IS_COLOR_TOK = t => /(^|-)color(-|$)/.test(t || '');
  const cssEffects = new Set();
  if (tokens.effect) cssEffects.add(toFigmaName(tokens.effect));
  // EVERY layer's colour, not just the first. A composite like `--dt-shadow-focus-outset`
  // spells out one complete layer per ring, each with its own `-color`, and the builder
  // now binds each ring to its own token. Reducing the composite to a single colour here
  // would report the second ring's correct binding as "bound but undeclared".
  if (compositeEffect) {
    for (const t of shadowLayerColorTokens(compositeEffect, own, chain)) {
      if (t) cssEffects.add(toFigmaName(t));
    }
  }
  for (const t of (computed.effect && computed.effect.tokens) || []) {
    if (IS_COLOR_TOK(t)) cssEffects.add(toFigmaName(t));
  }
  // An `outline` is built as an extra inset/outset effect, so its colour belongs to
  // the same set (see figma-mapping.outlineAsShadow).
  if (tokens.outlineColor) cssEffects.add(toFigmaName(tokens.outlineColor));
  const figEffects = new Set([figBind.effect, ...(figBind.effectExtra || [])].filter(Boolean));
  if (cssEffects.size || figEffects.size) {
    for (const name of figEffects) {
      if (cssEffects.has(name)) { stats.compared++; stats.agree++; }
      else findings.push({ variant, path, key: 'effect', declared: '(none declared)', bound: name, kind: 'bound-but-undeclared' });
    }
    for (const name of cssEffects) {
      if (!figEffects.has(name)) { stats.figmaUnbound++; unbound.push({ variant, path, key: 'effect', declared: name }); }
    }
  }
  // Handled above as a set; keep them out of the scalar key loop. `outlineColor` was
  // folded into the effect set, and Figma has no outline-WIDTH field at all (the ring
  // is an effect whose spread carries the width), so comparing either as a scalar
  // double-counts the same declaration as both agreed and unbound.
  delete tokens.effect; delete figBind.effect; delete figBind.effectExtra;
  if (tokens.outlineColor) delete tokens.outlineColor;
  if (tokens.outlineWidth) delete tokens.outlineWidth;

  // A Figma node may deliberately stand in for a whole DOM subtree — the loading
  // spinner is one ELLIPSE where the DOM has d-loader > [track, icon]. The tokens
  // it should carry are declared on its descendants, not on the collapsed node, so
  // fold the subtree's declarations in before comparing.
  const figHasKids = ((fig.children || []).filter(c => c.visible !== false)).length > 0;
  if (!figHasKids && (domInfo.children || []).length) {
    for (const desc of flattenDom(domInfo)) {
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: cdpDoc.nodeId, selector: desc.selector });
      if (!nodeId) continue;
      const sub = await tokensFor(cdp, nodeId);
      for (const [k, v] of Object.entries(sub.tokens)) if (!tokens[k]) tokens[k] = v;
    }
  }

  const keys = new Set([...Object.keys(tokens), ...Object.keys(figBind)]);
  for (const key of keys) {
    // Text colour lives on the Figma TEXT child but is declared on the DOM element
    // that owns the text; handled by the text-leaf branch below.
    const declared = tokens[key] ? toFigmaName(tokens[key]) : null;
    const bound = figBind[key] || null;

    if (declared && bound) {
      stats.compared++;
      if (declared === bound) stats.agree++;
      // The transparent-border fold (see figma-mapping.transparentBorderFold) paints a
      // stroke in the BACKGROUND colour to stand in for the background showing through
      // a transparent border. The CSS names a border token — it just resolves to
      // transparent — so the two can never both be satisfied: binding the border token
      // makes the stroke transparent and the ring jumps back to the edge (measured).
      // Visual fidelity wins and the misattribution is recorded, not hidden.
      else if (key === 'borderColor' && bound === (tokens.background ? toFigmaName(tokens.background) : null)
               && (fig.effects || []).some(e => e.type === 'INNER_SHADOW')) {
        stats.agree++;
        allowances.push({ variant, path, key, declared, bound });
      }
      else findings.push({ variant, path, key, declared, bound, kind: 'wrong-token' });
    } else if (declared && !bound) {
      // "Declared but unbound" was ONE bucket of 9,760 on Radio, which is exactly the
      // shape of B-68 (every DtText colour a baked literal) — and exactly the shape of
      // a structural absence that can never be bound. Lumping them together means a
      // real baked literal can hide behind thousands of legitimate ones, so classify.
      const why = unbindableReason(key, declared, fig, domInfo);
      if (why) { (stats.structural[why] = (stats.structural[why] || 0) + 1); continue; }
      stats.figmaUnbound++;
      unbound.push({ variant, path, key, declared });
    } else if (!declared && bound) {
      // the CSS computes this (color-mix, relative colour, calc) — no single token
      if (computed[key]) { stats.cssComputed++; continue; }
      // `currentColor` inheritance: the loading spinner declares no colour of its
      // own — its SVG inherits the button's `color`. A binding to the inherited
      // text-colour token is therefore correct, not undeclared. Counted separately
      // rather than folded into `agree`, so the inference stays visible.
      const inherited = tokens.textColor ? toFigmaName(tokens.textColor) : null;
      if (COLOR_KEYS.has(key) && inherited && inherited === bound) { stats.currentColor++; continue; }
      if (isDerived(bound)) { stats.derived++; continue; }
      findings.push({ variant, path, key, declared: '(none declared)', bound, kind: 'bound-but-undeclared' });
    }
  }

  // children
  const figKids = (fig.children || []).filter(c => c.visible !== false);
  const domKids = figmaKidsOf(domInfo);
  if (domInfo.text && !domKids.length && figKids.length === 1 && figKids[0].type === 'TEXT') {
    const t = figmaBindings(figKids[0]);
    const declared = tokens.textColor ? toFigmaName(tokens.textColor) : null;
    if (declared && t.textColor) {
      stats.compared++;
      if (declared === t.textColor) stats.agree++;
      else findings.push({ variant, path: `${path}/label`, key: 'textColor', declared, bound: t.textColor, kind: 'wrong-token' });
    }
    return;
  }

  // An <svg> is imported whole (createNodeFromSvg), so Figma holds real vectors where
  // the DOM holds nothing — the harness stops at the SVG boundary on purpose. The values
  // pass records exactly this allowance rather than comparing the internals node-for-node;
  // descending here would compare a `Vector` against nothing and call it a defect, which
  // is what 1,300 structural disagreements across nine components turned out to be
  // once the deeper fetch made those vectors visible at all (B-105).
  if (domInfo.tag === 'svg') {
    const why = 'svg imported whole — internals are Figma vectors, not compared node-for-node';
    stats.structural[why] = (stats.structural[why] || 0) + figKids.length;
    return;
  }
  // Children are paired BY INDEX, so the two lists must be the same length. When they
  // were not, `Math.min` silently truncated and every index after the divergence
  // compared unrelated nodes — the audit reported a glyph's fill as a span's
  // background and still printed "N/N bindings agree" (B-103). A structural mismatch
  // invalidates everything below it, so say so and stop rather than compare noise.
  if (figKids.length !== domKids.length) {
    findings.push({ variant, path, key: 'childCount',
      declared: `${domKids.length} dom [${domKids.map(k => k.name).join(', ')}]`,
      bound: `${figKids.length} figma [${figKids.map(k => k.name).join(', ')}]`,
      kind: 'structure' });
    return;
  }
  const n = domKids.length;
  for (let i = 0; i < n; i++) {
    const kid = domKids[i];
    // A `background-image` glyph is a real Figma child with no DOM node behind it, so
    // there is nothing to resolve in CDP and nothing to read a declaration from — the
    // colour is declared on the PARENT, and the values pass is what compares it.
    if (kid.synthetic) {
      const why = 'background-image glyph — no DOM node of its own to declare a token';
      stats.structural[why] = (stats.structural[why] || 0) + 1;
      continue;
    }
    if (kid.pseudo) {
      // A pseudo has no node of its own; its declarations hang off the owner.
      const { nodeId: ownerId } = await cdp.send('DOM.querySelector', { nodeId: cdpDoc.nodeId, selector: kid.ownerSelector });
      if (!ownerId) continue;
      const pt = await tokensForPseudo(cdp, ownerId, kid.pseudo);
      if (pt.tokens.effect) {
        const c = shadowColorToken(pt.tokens.effect, pt.own || {}, pt.chain || []);
        if (c) pt.tokens.effect = c;
      }
      const fb = figmaBindings(figKids[i]);
      for (const key of new Set([...Object.keys(pt.tokens), ...Object.keys(fb)])) {
        const declared = pt.tokens[key] ? toFigmaName(pt.tokens[key]) : null;
        const bound = fb[key] || null;
        if (declared && bound) {
          stats.compared++;
          if (declared === bound) stats.agree++;
          else findings.push({ variant, path: `${path}/${kid.name}`, key, declared, bound, kind: 'wrong-token' });
        } else if (declared && !bound) {
          stats.figmaUnbound++; unbound.push({ variant, path: `${path}/${kid.name}`, key, declared });
        } else if (!declared && bound) {
          if (pt.computed && pt.computed[key]) stats.cssComputed++;
          else if (isDerived(bound)) stats.derived++;
          else findings.push({ variant, path: `${path}/${kid.name}`, key, declared: '(none declared)', bound, kind: 'bound-but-undeclared' });
        }
      }
      continue;
    }
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: cdpDoc.nodeId, selector: kid.selector });
    if (!nodeId) continue;
    await compare(variant, nodeId, figKids[i], `${path}/${kid.name}`, kid);
  }
}


const combos = combosFor(cfg);

let checked = 0;
for (const combo of combos) {
  const name = cfg.variantName(combo);
  const fig = figByName.get(name);
  if (!fig) continue;
  await page.evaluate(([c, p, o]) => window.__setProps(c, p, o),
    [cfg.component, cfg.props(combo), { label: cfg.label, slots: cfg.slots ? cfg.slots(combo) : [], slotContent: cfg.slotContent ? cfg.slotContent(combo) : undefined, rootClass: cfg.rootClass }]);
  activeCombo = combo;
  // forceState returns the node it FORCED, which is the stateTarget when a component
  // declares one — Toggle forces on `.d-toggle`, not the wrapper. Using that as the
  // comparison root silently walked the wrong tree.
  if (!await forceState(cfg.pseudo ? cfg.pseudo(combo) : [])) continue;
  const { nodeId: rootNodeId } = await cdp.send('DOM.querySelector',
    { nodeId: cdpDoc.nodeId, selector: '#root > *' });
  if (!rootNodeId) continue;
  await page.evaluate(() => { void document.querySelector('#root > *').offsetWidth; });
  // THE harness's tree — the same one build-spec measures and the builder builds from.
  // This used to be a second walk with its own rules; see figmaChildParts (B-103, B-105).
  const tree = await page.evaluate(() => window.__anatomy());
  if (!tree) continue;
  checked++;
  await compare(name, rootNodeId, fig, 'root', tree);
}

await browser.close();
await server.close();

const byKind = {};
for (const f of findings) byKind[f.kind] = (byKind[f.kind] || 0) + 1;
console.log(`\ncomponent      : ${which}`);
console.log(`variants       : ${checked}`);
console.log(`bindings compared : ${stats.compared}  (agree ${stats.agree})`);
console.log(`css-computed, no single token : ${stats.cssComputed}`);
console.log(`inherited via currentColor     : ${stats.currentColor}`);
console.log(`bound to a DERIVED variable    : ${stats.derived}`);
if (exemplars.length) console.log(`declared exemplar slots         : ${exemplars.length}  (not compared)`);
if (allowances.length) {
  const by = {};
  for (const a of allowances) {
    const k = `${a.path} · ${a.key}: figma binds ${a.bound} where css names ${a.declared}`;
    by[k] = (by[k] || 0) + 1;
  }
  console.log(`recorded allowances            : ${allowances.length}  (transparent-border fold)`);
  for (const [k, n] of Object.entries(by).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${String(n).padStart(5)}x  ${k}`);
  }
}
const structTotal = Object.values(stats.structural).reduce((a, b) => a + b, 0);
if (structTotal) {
  console.log(`unbindable by construction     : ${structTotal}`);
  for (const [why, n] of Object.entries(stats.structural).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${String(n).padStart(5)}x  ${why}`);
  }
}
console.log(`declared but unbound in figma : ${stats.figmaUnbound}`);
if (unbound.length) {
  const g = {};
  for (const u of unbound) { const k = `${u.path} · ${u.key} -> ${u.declared}`; g[k] = (g[k] || 0) + 1; }
  for (const [k, n] of Object.entries(g).sort((a, b) => b[1] - a[1]).slice(0, 12)) {
    console.log(`    ${String(n).padStart(4)}x  ${k}`);
  }
}
console.log(`\nDISAGREEMENTS  : ${findings.length}`);
if (findings.length) {
  for (const [k, n] of Object.entries(byKind)) console.log(`  ${String(n).padStart(5)}  ${k}`);
  // group identical (path,key,declared,bound) so a systemic error reads as one row
  const groups = new Map();
  for (const f of findings) {
    const k = `${f.path}|${f.key}|${f.declared}|${f.bound}`;
    if (!groups.has(k)) groups.set(k, { ...f, count: 0, example: f.variant });
    groups.get(k).count++;
  }
  console.log('\ndistinct disagreements:');
  for (const g of [...groups.values()].sort((a, b) => b.count - a.count)) {
    console.log(`  ${String(g.count).padStart(4)}x  ${g.path} · ${g.key}`);
    console.log(`         css declares : ${g.declared}`);
    console.log(`         figma bound  : ${g.bound}`);
    console.log(`         e.g. ${g.example}`);
  }
}
if (args.includes('--json')) {
  const f = args[args.indexOf('--json') + 1];
  writeFileSync(f, JSON.stringify({ checked, stats, findings }, null, 2));
  console.log(`\nwrote ${f}`);
}
/**
 * A ZERO DENOMINATOR IS NOT A PASS.
 *
 * `input/identity` printed `0/0 bindings agree` and the run counted it green. The audit was
 * pairing children against the wrong nodes, so it compared nothing at all — and a check
 * that compares nothing cannot fail. Nothing in the summary distinguished that from a check
 * that compared 1,840 bindings and agreed on every one (which is what the same component
 * reports now that the pairing is fixed).
 *
 * A component with genuinely no token-backed property is conceivable, so this says what it
 * measured rather than guessing: it fails, and the message names the shape of the bug.
 */
const emptyDenominator = checked > 0 && stats.compared === 0;
if (emptyDenominator) {
  console.log(`\n❌ compared 0 bindings across ${checked} variants — a check that compares `
    + `nothing cannot fail. Suspect the DOM/Figma pairing before believing this component `
    + `declares no tokens.`);
} else {
  console.log(findings.length ? '\n❌ token identity differs from the stylesheet' : '\n✅ every binding matches the declared token');
}
process.exit((findings.length || emptyDenominator) ? 1 : 0);
