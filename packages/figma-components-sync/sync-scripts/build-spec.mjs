/**
 * Build a Figma component-set spec from the real rendered component.
 *
 * Two sources, each used for what only it can answer:
 *   - the BROWSER gives the tree, which nodes exist in this variant, their order,
 *     and every resolved value. It implements the cascade correctly; we do not.
 *   - the STYLESHEET gives token identity. A value cannot be reversed into a token
 *     name — 1,591 tokens collide on value — so provenance comes from what the CSS
 *     declares for the node's real class list.
 *
 * Emits both the token name AND the resolved colour for every bound property,
 * because `setBoundVariableForPaint` keeps a literal underneath the binding and
 * passing a placeholder there is what painted 1,390 paints black (B-9).
 *
 *   node build-spec.mjs link          -> link-spec.json
 */
import './pin-cwd.mjs';   // launch directory must not matter
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { converter, parse as parseColor, clampChroma, displayable } from 'culori';
import { tokensFor, tokensForPseudo, toFigmaName, shadowColorToken,
  shadowLayerColorTokens } from './cdp-provenance.mjs';
import { COMPONENTS } from './component-axes.mjs';
import { combosFor } from './combos.mjs';
import { defaultCombo } from './default-variant.mjs';
import { SIDE_CSS_WIDTHS, figmaTextDecoration, borderColorKey, marginFoldable, margins, hasMargin, outlineAsShadow, parentMarginFold, paintsNothing, transparentBorderFold, pseudoPaintsGlyph, resolvePercentRadius, figmaFamilyFor } from './figma-mapping.mjs';

const HARNESS = fileURLToPath(new URL('./verify-harness/', import.meta.url));
const toRgb = converter('rgb');

const which = process.argv[2];
if (!which) throw new Error('usage: build-spec.mjs <component>');

const cfg = COMPONENTS[which];
if (!cfg) throw new Error(`no build config for "${which}"`);
// The standalone `--slots` build is gone: it produced a second variant set that `--merged`
// supersedes, and every component now uses either the merged or the axis model. What remains
// of it is `cfg.slotPass`, which names the slots a MERGED build fills for its second render.
// --merged measures BOTH renders per variant and emits one tree, with the slot content
// marked. That is what lets a single Figma set carry the slot layers behind a BOOLEAN
// property instead of needing a second set nobody can toggle into.
// A config with `merged: true` is built merged by default and lands on its OWN page under its
// own name (no ' Merged' suffix, no `-merged` file); `--merged` on any other component builds the
// separate trial set it always did.
const MERGED = process.argv.includes('--merged') || !!cfg.merged;
const MERGED_TRIAL = MERGED && !cfg.merged;
if (MERGED && !cfg.slotPass) throw new Error(`${which} declares no slotPass, so there is nothing to merge`);

// ── colour handling ─────────────────────────────────────────────────────────
// Figma stores sRGB. Dialtone authors in oklch and some values fall outside the
// sRGB gamut, so they are chroma-clamped rather than channel-clipped.
function toFigmaRGB (css) {
  if (!css) return null;
  const c = parseColor(css);
  if (!c) return null;
  // culori's second argument is the MODE whose chroma channel gets binary-searched,
  // not the target gamut. Passing 'rgb' asks it to reduce a channel rgb does not
  // have, so it silently degenerates to per-channel clipping — 8 ΔE00 away from the
  // 'oklch' result, which is what the token emitter writes and what Figma stores.
  const mapped = displayable({ mode: 'rgb', ...toRgb(c) }) ? toRgb(c) : toRgb(clampChroma(c, 'oklch'));
  return {
    r: Math.min(1, Math.max(0, mapped.r)),
    g: Math.min(1, Math.max(0, mapped.g)),
    b: Math.min(1, Math.max(0, mapped.b)),
    a: c.alpha ?? 1,
  };
}
/** Split `box-shadow` on top-level commas only — `rgba(0, 0, 0, .2)` must stay whole. */
function splitShadowLayers (v) {
  const out = []; let depth = 0, cur = '';
  for (const ch of v) {
    if (ch === '(') depth++; else if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
const shadowColorOf = raw => (raw.match(/(oklch\([^)]*\)|oklab\([^)]*\)|rgba?\([^)]*\)|#[0-9a-f]{3,8})/i) || [])[0];
/**
 * The four lengths of one box-shadow layer: offsetX, offsetY, blur, spread.
 *
 * These were never captured. The builder hardcoded all four to zero, so an inset ring
 * — `box-shadow: inset 0 0 0 1px …`, which is how Notice and Banner draw their border —
 * came out with spread 0 and rendered NOTHING. The verifier could not catch it either:
 * it compared only the effect's type and colour.
 *
 * Chrome normalises the computed value to `<color> <x> <y> <blur> <spread> [inset]`,
 * so removing the colour function and the `inset` keyword leaves the lengths in order.
 */
function shadowGeometry (raw) {
  const bare = raw
    .replace(/(oklch|oklab|rgba?|hsla?|color)\([^)]*\)/gi, ' ')
    .replace(/\binset\b/i, ' ')
    .replace(/#[0-9a-f]{3,8}/gi, ' ');
  const nums = (bare.match(/-?[\d.]+px/g) || []).map(parseFloat);
  return { x: nums[0] || 0, y: nums[1] || 0, blur: nums[2] || 0, spread: nums[3] || 0 };
}
const px = s => (typeof s === 'string' && s.endsWith('px') ? parseFloat(s) : null);
// The SAME thresholds verify-components compares colours with (CEPS = 1.5/255, alpha
// 0.02). "Mode-varying" has to mean "a difference the checks would notice": Toggle's
// `color/surface/bold` differs between modes by 0.003 per channel — under one 8-bit step —
// and a tighter epsilon here synthesised two variables for a colour the verifier already
// considered identical, which is exactly the junk that makes generated data untrustworthy.
const CEPS = 1.5 / 255;
const sameRGBA = (a, b) => !!a && !!b && ['r', 'g', 'b'].every(k => Math.abs(a[k] - b[k]) <= CEPS)
  && Math.abs((a.a ?? 1) - (b.a ?? 1)) <= 0.02;
const tokenName = t => t.replace(/^--dt-/, '').split('-').join('/');

/**
 * The shadow's colour token, however provenance happened to resolve it.
 *
 * `shadowColorToken()` expects a COMPOSITE token (`--dt-shadow-small`) and digs the
 * `-color` reference out of it. Since resolveDeclared learned to pull the colour
 * straight out of a multi-part `box-shadow`, it now sometimes hands over a colour
 * token already — and the composite digger returned null for it, leaving Notice's 40
 * inset rings untokened even though the token was sitting right there.
 */
const IS_COLOR_TOKEN = t => /(^|-)color(-|$)/.test(t || '');
const shadowToken = (eff, own, chain) => {
  if (!eff) return null;
  return IS_COLOR_TOKEN(eff) ? eff : shadowColorToken(eff, own, chain);
};

// ── spec assembly ───────────────────────────────────────────────────────────
const COLOR_PROPS = { backgroundColor: 'background', color: 'textColor', borderTopColor: 'borderColor' };
/**
 * Per side and per corner, matching cdp-provenance's keys.
 *
 * One width and one radius stood for all four until DtSplitButton, whose halves each drop
 * their inner border and square their inner corners. A quarter of the geometry was measured
 * and the rest assumed to match it.
 */
/** The CSS side widths, in the order the Figma keys below list them. */
const SIDE_WIDTHS = {
  borderTopWidth: 'strokeTopWeight', borderRightWidth: 'strokeRightWeight',
  borderBottomWidth: 'strokeBottomWeight', borderLeftWidth: 'strokeLeftWeight',
};
const CORNER_RADII = {
  borderTopLeftRadius: 'topLeftRadius', borderTopRightRadius: 'topRightRadius',
  borderBottomRightRadius: 'bottomRightRadius', borderBottomLeftRadius: 'bottomLeftRadius',
};
const NUM_PROPS = {
  ...SIDE_WIDTHS, ...CORNER_RADII,
  paddingTop: 'paddingTop', paddingRight: 'paddingRight',
  paddingBottom: 'paddingBottom', paddingLeft: 'paddingLeft',
  columnGap: 'itemSpacing', fontSize: 'fontSize',
  // Emitted only on a WRAP layout — filtered below, because Figma has no
  // counterAxisSpacing without one.
  rowGap: 'counterAxisSpacing',
  // Read by the harness, encoded by encode-build, and compared by verify-components
  // since B-11 — but never PRODUCED here, so every min-* constraint was silently
  // absent until Banner used one: `.d-banner__dialog` declares `min-height: 50px`
  // and its hug frame settled at 42 (26px button + 8/8 padding). `auto` and `0`
  // fall out through px()==null and the zero guard, so only real floors are emitted.
  minWidth: 'minWidth', minHeight: 'minHeight',
};

/**
 * Turn one DOM node into a Figma-shaped spec.
 *
 * Provenance comes from CDP (the browser's own cascade), so `tokens` holds only
 * what this node DECLARES — plus the four properties that genuinely inherit.
 * That distinction matters: getComputedStyle reports `color` and `font-size` on
 * every element, so reading values alone would emit a text colour on frames that
 * paint no text and bind them to a token they never referenced.
 */
async function specForNode (cdp, cdpDoc, node, depth = 0, coordPlaced = true) {
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: cdpDoc.nodeId, selector: node.selector });
  const prov = nodeId ? await tokensFor(cdp, nodeId) : { tokens: {}, computed: {}, own: {}, chain: [] };
  const declared = prov.tokens;
  const s = node.style;
  const props = {};

  const paintsText = !!node.text;

  for (const [css, key] of Object.entries(COLOR_PROPS)) {
    // only record what this node actually paints
    if (key === 'textColor' && !paintsText) continue;
    const rgba = toFigmaRGB(s[css === 'borderTopColor' ? borderColorKey(s) : css]);
    if (!rgba) continue;
    if (rgba.a < 0.005) continue;                        // transparent is an absence
    /**
     * ANY side, not the top one.
     *
     * "No stroke to paint" used to mean `border-top-width: 0`, which was true of every
     * component while borders were uniform. DtBanner draws a border on its BLOCK-END edge
     * and nothing else, so its colour was dropped, the builder painted no stroke at all,
     * and 320 `strokeBottomWeight` findings said Figma had 0 where the browser had 1.
     *
     * Invisible until the widths became per-side: before that, both sides agreed the
     * component had no border, and agreeing is not the same as being right.
     */
    if (key === 'borderColor' && !SIDE_CSS_WIDTHS.some(w => px(s[w]))) continue;
    props[key] = { rgba, token: declared[key] ? toFigmaName(declared[key]) : null };
    // No token means Figma can only bake a literal — unless a variable is synthesised for
    // it, which needs the dark value too. Recorded only when it actually differs; a
    // mode-invariant computed colour is served perfectly well by a literal.
    if (!props[key].token) {
      const ds = darkBySelector.get(node.selector);
      const darkRgba = ds ? toFigmaRGB(ds[css]) : null;
      if (darkRgba && !sameRGBA(rgba, darkRgba)) {
        props[key].rgbaDark = darkRgba;
        // The tokens the CSS expression is BUILT from. Not a binding — provenance, so a
        // synthesised variable can say what produced it instead of appearing from nowhere.
        const sources = ((prov.computed[key] || {}).tokens || []).map(toFigmaName);
        if (sources.length) props[key].derivedFrom = sources;
      }
    }
  }

  /**
   * DID CSS PIN THIS AXIS, OR DOES THE CONTENT DETERMINE IT?
   *
   * A Figma frame hugs or is fixed; CSS makes the same choice, and the builder has been
   * inferring it from the children's measured sizes. That inference cannot see text: the
   * group-count badge is an explicit 16px square whose label Figma shapes to 18, so the
   * frame hugged its way to 18 while every measured box said 16 (158 findings). Reading
   * the DECLARATION answers the question directly — and `own` already holds every
   * declared property, because provenance needs it for tokens.
   *
   * `fit-content`/`max-content`/`min-content` are hug semantics spelled out in CSS, so
   * they are NOT a pin; `auto` is the absence of one.
   */
  const HUGGISH = /^(auto|fit-content|max-content|min-content)/;
  const pinnedAxis = (names) => names.some((p) => {
    const decl = prov.own[p];
    return !!decl && !HUGGISH.test(String(decl.value).trim());
  });
  if (pinnedAxis(['width', 'inline-size'])) props.sizedW = true;
  if (pinnedAxis(['height', 'block-size'])) props.sizedH = true;

  /**
   * THE SIZE ITSELF, where a token names it and binding cannot change it.
   *
   * `sizedW`/`sizedH` above answer hug-or-fixed. This answers a different question: the
   * fixed size is a number the builder writes, and Dialtone usually names it
   * (`inline-size: var(--dt-layout-25)` on a checkbox, `var(--dt-icon-size-400)` on the
   * toggle knob). Unnamed, it is baked, and the `layout/*` scale never reaches Figma.
   *
   * TWO CONDITIONS, both necessary. The axis has to be pinned, because binding a variable
   * to the width of a hugging frame pins it — a size the component did not ask for. And
   * the computed size has to equal the measured box, which is what makes the binding
   * inert: the builder resizes to the box either way, so the variable only labels a number
   * that was already going to be written. Where they differ (a flexed item, a clamped
   * min-width) the variable would move the geometry, and per the standing rule the number
   * is never adapted to fit the model.
   */
  for (const [axis, css, names, pinned, measured] of [
    ['width', 'width', ['width', 'inline-size'], props.sizedW, node.box && node.box.w],
    ['height', 'height', ['height', 'block-size'], props.sizedH, node.box && node.box.h],
  ]) {
    if (!pinned || !declared[axis]) continue;
    const used = px(s[css]);
    if (used == null || measured == null || Math.abs(used - measured) > 0.5) continue;
    /**
     * A FLOOR OR A CLAMP THAT IS DOING THE WORK.
     *
     * Both directions, and both are real. `.d-keyboard-shortcut__icon` declares
     * `block-size: var(--dt-icon-size-100)` — 12px — and comes out 16.8 tall because
     * `min-block-size: 1lh` wins; Chip's `> .d-icon` declares 14px and comes out 12 because
     * `max-inline-size: var(--chip-icon-size)` wins. Either way the computed size equals the
     * measured box, so the value guard above is satisfied, and either way the token behind
     * the declaration names a number that is NOT what got rendered. Binding it moves the
     * geometry: 4.8px up on the icon, 2px down on the chip.
     *
     * Read from the computed style rather than from `props`, because the minimums are
     * emitted by the NUM_PROPS loop further down and are not here yet, and the maxima are
     * never emitted at all.
     *
     * Where a constraint equals the used size, the constraint IS the size and the declared
     * size is something the layout overruled. Skipping costs only the coincidence where a
     * size equals its own bound.
     */
    const bounds = axis === 'width' ? ['minWidth', 'maxWidth'] : ['minHeight', 'maxHeight'];
    if (bounds.some((b) => { const v = px(s[b]); return v != null && Math.abs(v - used) <= 0.5; })) continue;
    props[axis] = { value: used, token: toFigmaName(declared[axis]) };
  }

  for (const [css, key] of Object.entries(NUM_PROPS)) {
    if (key === 'fontSize' && !paintsText) continue;
    const n = px(s[css]);
    if (n == null) continue;
    const isRadius = Object.values(CORNER_RADII).includes(key);
    const isStroke = Object.values(SIDE_WIDTHS).includes(key);
    // A zero is an absence everywhere except a radius, where a DECLARED zero is a real
    // decision — DtSplitButton squares two corners on purpose, and dropping the zero would
    // leave the builder to inherit a rounded corner from nowhere.
    if (n === 0 && !isRadius) continue;
    if (isStroke && n === 0) continue;
    if (isRadius && n === 0 && !declared[key]) continue;
    props[key] = { value: n, token: declared[key] ? toFigmaName(declared[key]) : null };
  }

  /**
   * `itemSpacing` is Figma's MAIN-axis gap, and CSS's main-axis gap is `row-gap` on a
   * column and `column-gap` on a row. Reading `column-gap` unconditionally is right for
   * every component measured so far — they all lay out in rows, and the shorthand `gap`
   * sets both — but a column spacing itself with `row-gap` alone would report no gap
   * here AND none in Figma, and the verifier compares against `column-gap` too, so both
   * sides would agree on zero while the browser spaced its children. Nothing currently
   * hits this (0 vertical flex nodes across all ten specs); it is fixed because the
   * failure mode is the invisible kind, not because it is failing.
   */
  if (s.flexDirection === 'column' && /flex|grid/.test(s.display || '')) {
    const rg = px(s.rowGap);
    if (rg) props.itemSpacing = { value: rg, token: declared.itemSpacing ? toFigmaName(declared.itemSpacing) : null };
    else delete props.itemSpacing;
  }

  // A PERCENTAGE radius returns null from px(), so `border-radius: 50%` — which is
  // how the chip's close button is made circular — was silently dropped.
  /**
   * `counterAxisSpacing` IS THE CROSS GAP OF A WRAPPING LAYOUT, and nothing otherwise.
   *
   * Figma applies it only when `layoutWrap` is WRAP. On a single-line flex row the CSS
   * `row-gap` is still reported — `gap: 24px` sets both axes — so emitting it unfiltered
   * would ask the builder to apply a property with no meaning on that frame.
   *
   * For a COLUMN flex the cross axis is the inline one, so the cross gap is `column-gap`,
   * whose token provenance records under `itemSpacing`. The same value under the `gap`
   * shorthand, which is what every Dialtone component uses.
   */
  {
    const wraps = /wrap/.test(s.flexWrap || '') && s.flexWrap !== 'nowrap';
    // A COLUMN that wraps has no Figma equivalent — `layoutWrap` exists only on a
    // horizontal layout — so no cross gap is emitted for one. Emitting it anyway would ask
    // the builder for something Figma refuses, and then leave the identity audit looking at
    // a declared token that could never have been bound.
    if (!wraps || s.flexDirection === 'column') {
      delete props.counterAxisSpacing;
    } else if (props.counterAxisSpacing && !props.counterAxisSpacing.token
               && props.itemSpacing && props.itemSpacing.value === props.counterAxisSpacing.value) {
      /**
       * The `gap` SHORTHAND names one token and sets both axes.
       *
       * Provenance maps `gap` to `itemSpacing`, so a component written as
       * `gap: var(--dt-spacing-300)` — which is all of them — leaves the cross gap with the
       * right number and no token, and it bakes as a literal. Only claimed when the two
       * values agree, which is the only case where the shorthand can be what produced it.
       */
      props.counterAxisSpacing.token = props.itemSpacing.token;
    }
  }

  /**
   * ONCE ONE CORNER OR SIDE IS SET, ALL FOUR MUST BE.
   *
   * A zero on its own is an absence: a node with no radius anywhere needs none recorded. A
   * zero NEXT TO a non-zero is a shape — DtSplitButton's halves square their inner corners
   * deliberately — and Figma needs all four numbers to express it, because an unset corner
   * falls back to the uniform value rather than to zero.
   *
   * Keyed on the shape rather than on whether a token was found. The gate used to ask
   * `!declared[key]`, which worked only while a zeroed corner still carried the shorthand's
   * token; once provenance correctly stopped attributing `radius/xs` to a corner set to 0,
   * every squared corner vanished from the spec instead.
   */
  for (const group of [CORNER_RADII, SIDE_WIDTHS]) {
    const keys = Object.values(group);
    if (keys.some(k => props[k] && props[k].value > 0)) {
      for (const k of keys) if (!props[k]) props[k] = { value: 0, token: null };
    }
  }


  for (const [css, key] of Object.entries(CORNER_RADII)) {
    if (props[key]) continue;
    const resolved = resolvePercentRadius(s[css], node.box.w, node.box.h);
    if (resolved != null) {
      // The declared token is `size/radius/circle: 50%`. A Figma corner radius is a
      // number of pixels and a FLOAT variable cannot hold a percentage, so this is
      // genuinely unbindable — the resolved px value is the only representation.
      // Provenance is still recorded, just not as a binding.
      props[key] = {
        value: resolved,
        token: null,
        declaredToken: declared[key] ? toFigmaName(declared[key]) : null,
        unbindable: 'percentage radius cannot be a Figma FLOAT variable',
        fromPercent: s[css],
      };
    }
  }

  // Figma has no per-child margin. Folded into this node's OWN padding when it
  // paints nothing itself — visually identical, and the only expressible form.
  // Recorded as an unrepresentable divergence otherwise, never silently dropped.
  // A coordinate-placed child needs no fold at all: its measured offset already
  // includes its margins, so folding would count the space twice.
  const m = margins(s);
  if (hasMargin(m) && !coordPlaced) {
    if (marginFoldable(s)) {
      const add = (k, v) => { if (!v) return; props[k] = props[k] || { value: 0, token: null }; props[k].value += v; props[k].marginFold = (props[k].marginFold || 0) + v; };
      add('paddingTop', m.top); add('paddingRight', m.right);
      add('paddingBottom', m.bottom); add('paddingLeft', m.left);
    }
    // A PAINTED child is deliberately not recorded here — its parent absorbs the
    // margin below. Recording it in both places produced 44 "unrepresentable"
    // allowances on Badge for spacing that was representable and simply missing.
  }

  // The other half of the fold: margins belonging to painted CHILDREN, which cannot
  // grow their own padding without growing what they paint. A leading margin on the
  // first child is parent padding, a trailing one on the last child likewise, and
  // anything between siblings is itemSpacing.
  // Only an AUTO-LAYOUT parent needs to absorb its children's margins. A frame that
  // places children by coordinate already has them.
  const selfIsFlex = /flex|grid/.test(s.display || '');
  const pf = selfIsFlex
    ? parentMarginFold(s, (node.children || []).filter(c => c.style.display !== 'none'))
    : { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, itemSpacing: 0, unrepresentable: [] };
  const addPad = (k, v) => {
    if (!v) return;
    props[k] = props[k] || { value: 0, token: null };
    props[k].value += v;
    props[k].childMarginFold = (props[k].childMarginFold || 0) + v;
  };
  addPad('paddingTop', pf.paddingTop); addPad('paddingRight', pf.paddingRight);
  addPad('paddingBottom', pf.paddingBottom); addPad('paddingLeft', pf.paddingLeft);
  if (pf.itemSpacing) addPad('itemSpacing', pf.itemSpacing);
  if (pf.unrepresentable.length) props.marginUnrepresentable = { notes: pf.unrepresentable };

  // A FOLDED value is no longer the token's value, and a bound Figma variable
  // overwrites the literal underneath it — so binding here would silently discard
  // the fold and render the unfolded number. Provenance is kept, the binding is not.
  // (Same reasoning as the percentage radius: recorded, just not as a binding.)
  for (const [k, v] of Object.entries(props)) {
    if (!v || typeof v !== 'object' || !v.token) continue;
    const folded = (v.marginFold || 0) + (v.childMarginFold || 0);
    if (!folded) continue;
    v.declaredToken = v.token;
    v.token = null;
    v.unbindable = `folded +${folded}px of margin; a bound variable would overwrite the folded literal`;
  }

  // A real focus ring on some components — checkbox's checked state — mapped to the
  // same outset zero-blur DROP_SHADOW shape Dialtone's shadow/focus token uses.
  const ol = outlineAsShadow(s);
  if (ol) {
    const rgba = toFigmaRGB(ol.color);
    const sysColor = (prov.computed.outlineColor || {}).systemColor;
    if (rgba && rgba.a >= 0.005) {
      props.outline = {
        spread: ol.spread,
        inset: ol.inset,
        rgba,
        token: declared.outlineColor ? toFigmaName(declared.outlineColor) : null,
        // `CanvasText` and friends are resolved by the OS, not by a token, and Figma
        // has no equivalent. Baking the light value is how checkbox's dark focus ring
        // came out black where the browser paints white. Recorded, never bound.
        ...(sysColor ? { systemColor: sysColor, unbindable: `${sysColor} is an OS system colour with no Figma equivalent` } : {}),
      };
    }
  }

  const opacity = parseFloat(s.opacity);
  if (!Number.isNaN(opacity) && opacity < 0.999) props.opacity = { value: opacity, token: declared.opacity ? toFigmaName(declared.opacity) : null };

  if (s.boxShadow && s.boxShadow !== 'none') {
    const composite = shadowToken(declared.effect, prov.own, prov.chain);
    // Every layer, not just the first. A multi-part box-shadow painted only its
    // opening layer in Figma, and any token colour on the rest went unbound. Layers
    // whose colour is fully transparent paint nothing and must not become effects
    // at all — an invisible shadow in Figma is still a shadow in the layers panel.
    // A colour token PER LAYER. `declared.effect` is a COMPOSITE
    // (`--dt-shadow-focus-outset`) whose value spells out two complete layers, each
    // with its own `-color` token; taking one colour for the whole shadow left the
    // second ring baked and mode-blind. Indexed against the layers BEFORE the
    // transparency filter, because the composite's layer order is what these align to.
    const layerTokens = declared.effect
      ? shadowLayerColorTokens(declared.effect, prov.own, prov.chain) : [];
    const layers = splitShadowLayers(s.boxShadow).map((raw, i) => {
      const rgba = toFigmaRGB(shadowColorOf(raw));
      const tok = layerTokens[i] || null;
      return { raw, inset: /inset/.test(raw), rgba, token: tok ? toFigmaName(tok) : null,
               ...shadowGeometry(raw) };
    }).filter(l => l.rgba && l.rgba.a >= 0.005);
    if (layers.length) {
      props.shadow = {
        inset: layers[0].inset,
        raw: s.boxShadow,
        token: composite ? toFigmaName(composite) : null,
        layers,
      };
    }
  }

  // A transparent border still offsets an inset shadow (see transparentBorderFold).
  // Reproduce it the only way Figma can: a stroke in the BACKGROUND colour at the
  // border width, and every inset layer's spread grown by that width.
  const tbf = transparentBorderFold(props);
  if (tbf) {
    props.borderColor = {
      rgba: props.background.rgba,
      token: props.background.token,
      fromTransparentBorder: tbf,
    };
    for (const l of props.shadow.layers) if (l.inset) l.spread += tbf;
  }

  const kids = [];

  // Pseudo-elements are real painted boxes that a DOM-only walk misses entirely —
  // `.d-toggle::after` IS the toggle knob. But they do NOT all come first: CSS paints
  // ::before BEFORE the element children and ::after AFTER them. Emitting both first
  // put DtToggle's knob where its icon container belongs and swapped every property
  // between the two, because the verifier (correctly) walks before / children / after.
  const beforeKids = [];
  const afterKids = [];
  for (const pe of node.pseudos || []) {
    const pTokens = nodeId ? (await tokensForPseudo(cdp, nodeId, pe.pseudo)).tokens : {};
    const pProps = {};
    for (const [css, key] of Object.entries(COLOR_PROPS)) {
      if (key === 'textColor') continue;                 // pseudo carries no text here
      const rgba = toFigmaRGB(pe.style[css]);
      if (!rgba || rgba.a < 0.005) continue;
      // Any side, as above — a pseudo-element can carry a one-edge border too.
      if (key === 'borderColor' && !SIDE_CSS_WIDTHS.some(w => px(pe.style[w]))) continue;
      pProps[key] = { rgba, token: pTokens[key] ? toFigmaName(pTokens[key]) : null };
    }
    for (const [css, key] of Object.entries(NUM_PROPS)) {
      if (key === 'fontSize') continue;
      const n = px(pe.style[css]);
      if (n == null || (n === 0 && !Object.values(CORNER_RADII).includes(key))) continue;
      pProps[key] = { value: n, token: pTokens[key] ? toFigmaName(pTokens[key]) : null };
    }
    // A pseudo carries a percentage radius as often as an element does — DtToggle's
    // knob is `border-radius: 50%` — and without this it was built square.
    for (const [css, key] of Object.entries(CORNER_RADII)) {
      if (pProps[key]) continue;
      const pr = resolvePercentRadius(pe.style[css], pe.box && pe.box.w, pe.box && pe.box.h);
      if (pr == null) continue;
      pProps[key] = {
        value: pr,
        token: null,
        declaredToken: pTokens[key] ? toFigmaName(pTokens[key]) : null,
        unbindable: 'percentage radius cannot be a Figma FLOAT variable',
        fromPercent: pe.style[css],
      };
    }
    if (pe.style.boxShadow && pe.style.boxShadow !== 'none') {
      const composite = shadowToken(pTokens.effect, prov.own, prov.chain);
      pProps.shadow = {
        inset: /inset/.test(pe.style.boxShadow),
        raw: pe.style.boxShadow,
        token: composite ? toFigmaName(composite) : null,
      };
    }
    const pOpacity = parseFloat(pe.style.opacity);
    if (!Number.isNaN(pOpacity) && pOpacity < 0.999) pProps.opacity = { value: pOpacity, token: null };

    // `transform` moves a box after layout, and the indeterminate knob relies on it:
    // `inset-inline-start: 50%; transform: translate(-50%, 0)`. Reading the inset
    // alone put it 9px off. The computed transform is a resolved matrix, so the
    // translation is its last two components.
    const m = /matrix\(([^)]+)\)/.exec(pe.style.transform || '');
    const t = m ? m[1].split(',').map(Number) : null;
    const tx = t && t.length === 6 ? t[4] : 0;
    const ty = t && t.length === 6 ? t[5] : 0;

    // A pseudo that paints nothing is not a node. `.d-toggle--small::before` is a
    // hit-area extender: positioned, sized, `content: ''`, and entirely invisible.
    // But "paints nothing" must include TEXT and a data-URI glyph: FilterPill's
    // `::before` is a literal "=" with no background at all, and requiring a
    // background dropped the only thing that pseudo-element existed to draw.
    const paintsGlyph = pseudoPaintsGlyph(pe);
    if (!paintsGlyph && !Object.keys(pProps).some(k => ['background', 'borderColor', 'shadow'].includes(k))) continue;

    /**
     * A PSEUDO HELD AT `opacity: 0` PAINTS NOTHING EITHER.
     *
     * It has a background, so the test above lets it through — but the CSS is deliberately
     * hiding it. DtTabGroup's list border is a positioned `::after` whose opacity is
     * `var(--tablist-border-opacity)`, which is 0 when the group is borderless;
     * DtSegmentedControl's item dividers are the same shape. Both then arrive in Figma as
     * invisible empty rectangles, which preflight rejects by name.
     *
     * NOT the same as DtButton's loading label, which is also `opacity: 0` and must be
     * kept: that one is IN FLOW and holds the button's width open while the spinner shows.
     * These are absolutely positioned and hold nothing, so they contribute neither paint
     * nor layout — the exact combination preflight rule 9 describes.
     */
    if (!paintsGlyph && Number(pe.style.opacity) === 0) continue;

    // A content-only pseudo carries its character as a TEXT child, exactly as an
    // element that holds text directly does — a Figma frame cannot be both.
    const pKids = [];
    if (pe.text && pe.text.trim()) {
      const pfs = px(pe.style.fontSize);
      const plh = px(pe.style.lineHeight);
      pKids.push({
        name: 'glyph',
        text: pe.text,
        isText: true,
        typography: {
          fontSize: pfs,
          fontWeight: Number(pe.style.fontWeight) || 400,
          lineHeightPct: plh && pfs ? Math.round((plh / pfs) * 1000) / 10 : null,
          family: figmaFamilyFor(pe.style.fontFamily),
        },
        props: { textColor: { rgba: toFigmaRGB(pe.style.color), token: pTokens.textColor ? toFigmaName(pTokens.textColor) : null } },
        children: [],
      });
    }
    // A pseudo-element has no DOM node, so nothing measured its position — it has to be
    // derived. CSS resolves an absolute offset against the containing block's PADDING
    // box, while a Figma child's x/y are relative to the parent FRAME (its border box),
    // so the parent's border width is part of the offset. Leaving it out put DtToggle's
    // knob 1px inside its track on both axes, on every one of its 72 variants. Real
    // element children need no such correction: their `rel` is measured from the parent
    // rect and already includes the border.
    //
    // Only start-anchored offsets are derived this way. Every pseudo in the system today
    // sets inline-start/block-start (measured); an END-anchored pseudo would need the
    // parent's width, and is left to the builder's MAX-constraint path rather than
    // guessed at here.
    const pInsetL = parseFloat((pe.inset || {}).inlineStart);
    const pInsetT = parseFloat((pe.inset || {}).blockStart);
    const pRel = (Number.isNaN(pInsetL) || Number.isNaN(pInsetT)) ? null : {
      x: +((px(s.borderLeftWidth) || 0) + pInsetL + tx).toFixed(2),
      y: +((px(s.borderTopWidth) || 0) + pInsetT + ty).toFixed(2),
    };

    (pe.pseudo === 'after' ? afterKids : beforeKids).push({
      name: pe.pseudo,
      isPseudo: true,
      absolute: true,
      box: pe.box,
      inset: pe.inset,
      rel: pRel,
      offset: { x: tx, y: ty },
      svg: pe.svg || null,
      props: pProps,
      children: pKids,
    });
  }
  kids.push(...beforeKids);

  for (const c of node.children || []) {
    if (paintsNothing(c)) continue;   // zero-area and empty: not a Figma node
    // A child is coordinate-placed when this node is not auto-layout, or when the
    // child takes itself out of flow. That decides whether its margin folds.
    const childCoord = !selfIsFlex || c.style.position === 'absolute';
    kids.push(await specForNode(cdp, cdpDoc, c, depth + 1, childCoord));
  }

  // A node that carries text but has no element children becomes a frame with a
  // single TEXT child in Figma — a frame cannot hold both text and padding.
  if (paintsText && !kids.length) {
    const lh = px(s.lineHeight);
    const fs = px(s.fontSize);
    kids.push({
      name: 'label',
      text: node.text,
      isText: true,
      typography: {
        fontSize: fs,
        fontWeight: Number(s.fontWeight) || 400,
        lineHeightPct: lh && fs ? Math.round((lh / fs) * 1000) / 10 : null,
        // The FAMILY, not just the size and weight. Without it the builder wrote every text
        // node in one hardcoded family and DtCodeblock's monospace label came out in SF Pro
        // Text — a difference the values pass could see and the builder could not.
        family: figmaFamilyFor(s.fontFamily),
        // Painted decoration, propagated from an ancestor if need be (see the harness).
        decoration: figmaTextDecoration(s) === 'NONE' ? null : figmaTextDecoration(s),
      },
      props: { textColor: props.textColor },
      children: [],
    });
    delete props.textColor;
    delete props.fontSize;
  }

  // ::after paints last — after the element children AND after the element's own
  // text. Appending here rather than with ::before is the whole point of the split.
  kids.push(...afterKids);

  // `currentColor` consumers: an inline SVG icon fills from the element's `color`,
  // and the chip's close glyph is exactly that. The node paints no text of its own,
  // so textColor is not recorded for it — but the colour still has to reach the
  // vector's fill in Figma.
  // The <svg> node itself counts. Since the harness stopped descending into SVGs,
  // an <svg> has no children, so a children-only test reported no vector on the very
  // node that IS one — and a `fill: currentColor` glyph would import black.
  const hasVector = (n) => n.tag === 'svg' || (n.children || []).some(c => c.tag === 'svg' || c.tag === 'path' || hasVector(c));
  const currentColor = hasVector(node)
    ? { rgba: toFigmaRGB(s.color), token: declared.textColor ? toFigmaName(declared.textColor) : null }
    : null;
  // A glyph's colour can be DERIVED too, and the synthesis missed it: the derived-variable
  // work covered background/textColor/borderColor but not the currentColor carried onto
  // the vectors inside an imported <svg>. Chip's disabled close icon is
  // `color-mix(… 65%)` of a token, so Figma baked the light value and the glyph could not
  // follow the mode — 9 dark findings, invisible until B-97 made the comparison reachable.
  if (currentColor && currentColor.rgba && !currentColor.token) {
    const ds = darkBySelector.get(node.selector);
    const darkRgba = ds ? toFigmaRGB(ds.color) : null;
    if (darkRgba && !sameRGBA(currentColor.rgba, darkRgba)) {
      currentColor.rgbaDark = darkRgba;
      const sources = ((prov.computed.textColor || {}).tokens || []).map(toFigmaName);
      if (sources.length) currentColor.derivedFrom = sources;
    }
  }

  return {
    name: node.classes[0] || node.tag,
    // An <img> is a resource, not a property. `objectFit` decides Figma's scaleMode:
    // `cover` crops to fill, which is what an avatar does.
    ...(node.imgSrc ? { image: { src: node.imgSrc, fit: node.objectFit || 'fill' } } : {}),
    currentColor,
    // The real SVG source. Figma imports it whole via createNodeFromSvg rather than
    // us reconstructing path data — which is why `defs`, `clipPath` and zero-size
    // `path` nodes no longer leak in as frames, and why the glyph is the actual glyph.
    svg: node.svg || null,
    svgRect: node.svgRect || null,
    tag: node.tag,
    classes: node.classes,
    // Only set on the slot CONTENT itself; the merge names the inserted wrapper from it.
    ...(node.dataSlot ? { dataSlot: node.dataSlot } : {}),
    // The Dialtone icon name, so the encoder can resolve this node to an icon-library
    // component and the builder can place a swappable instance of it.
    // `anatomySwap.icon` falls back to a class match when nothing rendered through the real
    // `<dt-icon>` mechanism (and so left no `data-name`) — DtLoader's masked arc, which is a
    // plain `<svg>`, not an icon-component usage. A real `data-name` wins where both exist.
    ...(node.dataName ? { iconName: node.dataName }
      : anatomySwap && anatomySwap.icon && node.classes && node.classes.includes(anatomySwap.selector)
        ? { iconName: anatomySwap.icon } : {}),
    /**
     * In the ORDINARY sweep, a filled slot's content is a visible, swappable node — the same
     * shape as a REPLACEMENT slot, so it reuses that marker: an INSTANCE_SWAP property and
     * no BOOLEAN, because presence is carried by the variant axis instead.
     *
     * Not in MERGED mode, where the merge marks the WRAPPER for the boolean and the builder
     * finds the instance inside it. Marking here as well would create a second swap property
     * for the same slot.
     */
    ...(node.dataSlot && !MERGED ? { slotSwap: node.dataSlot } : {}),
    // The Figma component this slot's content should be swappable FROM, if the config named
    // one. Carried as the declared combo; encode-build turns it into a node id.
    ...(node.dataSlot && slotSwapTargets[node.dataSlot]
      ? { slotSwapTo: slotSwapTargets[node.dataSlot] } : {}),
    // `cfg.anatomySwap`'s class-matched counterpart — same `slotSwapTo` shape, so
    // encode-build's resolution needs no changes to also handle this. Only for a
    // COMPONENT swap; an icon swap (above) uses `iconName` instead.
    ...(anatomySwap && anatomySwap.component && node.classes && node.classes.includes(anatomySwap.selector)
      ? { slotSwapTo: { component: anatomySwap.component, variant: anatomySwap.variant } } : {}),
    // A third `anatomySwap` kind: paint this node with a hand-tuned ANGULAR gradient instead
    // of its measured flat colour — DtLoader's arc, whose real look is a CSS conic-gradient
    // mask this pipeline cannot reproduce as a mask, but can reproduce as a gradient PAINT on
    // the arc's own geometry (see `gradientFill` in generic-builder.js for why this replaced
    // an earlier icon-library substitution: that fixed the missing fade but not the mismatched
    // stroke width, because it was a different hand-authored asset).
    ...(anatomySwap && anatomySwap.gradient && node.classes && node.classes.includes(anatomySwap.selector)
      ? { gradFill: true } : {}),
    layout: {
      display: s.display,
      direction: s.flexDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL',
      align: s.alignItems,
      justify: s.justifyContent,
      // Figma needs `layoutWrap: WRAP` before a counterAxisSpacing means anything, so the
      // flag has to reach the builder rather than being inferred from the gap's presence.
      wrap: /wrap/.test(s.flexWrap || '') && s.flexWrap !== 'nowrap',
    },
    box: node.box,
    rel: node.rel,
    // Absolutely-positioned elements must be placed, not flowed. The toggle's glyph
    // is `position: absolute` inside the track.
    absolute: s.position === 'absolute',
    props,
    children: kids,
  };
}

// ── run ─────────────────────────────────────────────────────────────────────
const server = await createServer({ root: HARNESS, configFile: HARNESS + 'vite.config.js', server: { port: 0 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();
// STATED, not inherited. `.d-banner` is `position: fixed; inset-inline: 0`, so its
// width IS the viewport — a Banner component is 1280 wide because this line says so,
// not because Playwright happens to default there.
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(`http://localhost:${server.httpServer.address().port}/`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof window.__anatomy === 'function', null, { timeout: 30000 });
/**
 * SET THE MODE ON THE DOCUMENT. This measures the light palette, and it has to say so.
 *
 * Dialtone's dark values live in `[data-dt-mode="light"|"dark"]` blocks; with no attribute
 * anywhere, some tokens resolve from `:root` in a form the stylesheet does not expect —
 * `--avatar-anchor-hue` comes out a COLOR rather than a number, `calc(<color> + 210)` is
 * invalid at computed-value time, and every avatar painted transparent.
 *
 * That was worked around by passing `data-dt-mode: 'light'` as a PROP on the avatar, which
 * put the attribute on the component's own root element — and an attribute there wins over
 * the document for that whole subtree. So the verifier's DARK run measured the avatar in
 * LIGHT, produced 366 findings, and every one of them blamed Figma for holding the correct
 * dark value. The attribute belongs to the document, never to the component.
 */
await page.evaluate(() => window.__setMode('light'));

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

/**
 * DARK VALUES, MEASURED AT BUILD TIME.
 *
 * A colour CSS computes from a token — `color-mix(… oklch(from var(--x) l calc(c - .08) h)
 * 65% …)`, or an avatar's `oklch(L C calc(<hue> + offset))` — has no token to bind, so
 * Figma can only hold a literal, and a literal cannot follow the mode. That was 504
 * findings. Synthesising a variable per distinct colour fixes it, but a variable needs a
 * value for BOTH modes and this script only ever measured light.
 *
 * Keyed by the node's `selector` rather than by walking two trees in parallel: the spec
 * tree is filtered (nodes that paint nothing are dropped) so its shape does not match the
 * raw anatomy's, and a positional walk would silently pair the wrong nodes.
 */
let darkBySelector = new Map();
/** slot name -> declared swap target, for the combo currently being measured. */
let slotSwapTargets = {};
/**
 * A FIXED SWAP, for a piece of a component's own anatomy rather than a designer-facing slot.
 *
 * `slotSwapTargets` above is keyed by a `data-slot` the harness injects around a CONFIG-
 * declared slot's exemplar content — it has no way to reach ordinary internal markup a
 * component always renders itself (DtButton's `.d-loader` while loading is never a slot).
 * `cfg.anatomySwap`, where declared, names a CSS class and a swap target directly; resolved
 * once per combo here, exactly like `slotSwapTargets`, and matched against `node.classes`
 * below instead of a `data-slot` attribute.
 */
let anatomySwap = null;
const indexDark = (node, into) => {
  if (!node) return into;
  if (node.selector) into.set(node.selector, node.style || {});
  for (const c of node.children || []) indexDark(c, into);
  for (const p of node.pseudos || []) if (p.selector) into.set(p.selector, p.style || {});
  return into;
};

/**
 * MERGE THE TWO RENDERS INTO ONE TREE.
 *
 * A slot's content only exists in the render where the slot is filled — and the WRAPPER the
 * component puts around it does not exist either, because components gate it on
 * `hasSlotContent`. So the slot content is exactly what the filled render has and the empty
 * one does not, which is a diff, not an attribute lookup.
 *
 * Children are aligned in ORDER by identity, the same way the checks pair them. Anything in
 * the filled render that does not match the next unconsumed base child is inserted content,
 * and gets `slot: '<name>'` from the `data-slot` marker somewhere inside it.
 *
 * SHARED nodes keep their BASE geometry, deliberately. The merged Figma variant renders
 * with its slots hidden by default, so the default state is the one whose numbers must be
 * exact; the shown state is produced by auto-layout re-flowing when the layer is made
 * visible, which is why the slot's parent has to hug (verified separately).
 */
const nodeIdentity = (n) => `${n.name}\u0000${n.tag}`;

/**
 * MARK A SLOT'S DEFAULT CONTENT AS SWAPPABLE.
 *
 * Some slots override content the component draws itself — DtNotice's `icon` replaces the
 * kind glyph. Those slots are never filled by the sweep, because the SET should show the
 * default; but the default is already an instance of an icon-library component, so it can
 * carry an INSTANCE_SWAP and let a designer change it without entering the instance.
 *
 * The config names the WRAPPER whose icon is that default (`slotDefaults`), because nothing
 * in the measurement identifies it: unlike injected slot content it carries no `data-slot`.
 *
 * Checked first, not assumed: binding two variants' icons to one INSTANCE_SWAP does NOT
 * force them both to the property's single default — DtNotice's base kept `alerts/bell`
 * while critical kept `alerts/alert-circle`. Had it collapsed them, this would have traded
 * five distinct kind glyphs for one convenience.
 */
function markSlotDefaults (tree, slotDefaults) {
  if (!slotDefaults) return;
  const findIcon = (n) => (n.iconName ? n : (n.children || []).reduce((hit, c) => hit || findIcon(c), null));
  const walk = (n) => {
    for (const [slot, wrapperClass] of Object.entries(slotDefaults)) {
      if ((n.classes || [])[0] === wrapperClass) {
        const icon = findIcon(n);
        // No icon under the named wrapper means the config points at the wrong node, or the
        // component stopped drawing a default. Either way, silence would leave a slot the
        // designer cannot change while the config claims otherwise.
        if (!icon) throw new Error(`slotDefaults.${slot} names ".${wrapperClass}" but no node `
          + `under it resolves to an icon — the swap point cannot be placed`);
        icon.slotSwap = slot;
      }
    }
    for (const c of n.children || []) walk(c);
  };
  walk(tree);
}

/** The slot this inserted subtree belongs to, from the marker its content carries. */
function slotNameIn (node) {
  if (node.dataSlot) return node.dataSlot;
  for (const c of node.children || []) {
    const hit = slotNameIn(c);
    if (hit) return hit;
  }
  return null;
}

/**
 * Properties a shared node must have IDENTICALLY in both renders for a merged set to be
 * possible at all.
 *
 * A Figma component property can hide a layer and swap an instance. It cannot change a
 * frame's padding or its gap — those are frame properties, and while they can be bound to a
 * VARIABLE, no variable switches on a component property. So if the component adjusts its
 * own spacing in response to slot content, one variant cannot be right in both states.
 *
 * DtButton does exactly that: `button.less` reduces horizontal padding when an icon is
 * present so the optical spacing stays even. All 560 variants differ, by 2px a side. Built
 * as a merged set it produced 2,660 findings — and had the check not existed, it would have
 * produced 560 silently-too-wide icon buttons instead.
 *
 * The box is NOT in this list: a shared node's box is SUPPOSED to differ, because that is
 * the frame growing to fit the revealed layer.
 */
const MERGE_INVARIANT = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'itemSpacing'];

/** Divergences that make a merged set impossible; reported together, never one at a time. */
const mergeBlockers = [];

function mergeSlotTree (base, filled, path = 'root', variant = '?') {
  for (const k of MERGE_INVARIANT) {
    const a = (base.props || {})[k], b = (filled.props || {})[k];
    const av = a ? a.value : null, bv = b ? b.value : null;
    if (av !== bv) mergeBlockers.push({ path, prop: k, empty: av, filled: bv });
  }
  const bk = base.children || [];
  const fk = filled.children || [];
  const out = [];
  let bi = 0, fi = 0;
  const filledHasLater = (node, from) => fk.slice(from).some(x => nodeIdentity(x) === nodeIdentity(node));

  while (bi < bk.length || fi < fk.length) {
    /**
     * WHEN A NAME REPEATS, IDENTITY ALONE PICKS THE WRONG PAIR.
     *
     * DtNotice's actions area holds `base-button__button` TWICE in the filled render — the
     * button the `action` slot supplied, and the notice's own close button — and once in the
     * empty one. Matching greedily on identity paired the ACTION button against the CLOSE
     * button, descended into it, and reported a label inserted with no marker. Every step
     * followed correctly from the one before; the first step was wrong.
     *
     * Making the marker win outright was worse: `slotNameIn` searches the whole SUBTREE, so
     * every ANCESTOR of slot content became slot content and the root stopped descending
     * into `d-notice__icon` at all.
     *
     * What actually discriminates is whether the base child has somewhere else to go. If the
     * base child at `bi` has another candidate LATER in the filled list, then this filled
     * child is an insertion and the base child will be matched by that later one. If it does
     * not, this really is the pair — which is why a replacement slot still descends normally.
     */
    const fSlot = fi < fk.length ? slotNameIn(fk[fi]) : null;
    const bSlot = bi < bk.length ? slotNameIn(bk[bi]) : null;
    /**
     * THE SAME SLOT CONTENT IN BOTH RENDERS IS NOT AN INSERTION.
     *
     * DtBanner fills its `action` slot in the ORDINARY sweep too, because whether the action
     * shows is already a variant axis (`showAction`) — so both renders contain it, and the
     * only thing a designer would change is WHAT it is. Treating it as inserted made the
     * aligner consume the filled action button, then pair the base action button against the
     * close button, and fail three levels down comparing a label to an icon.
     *
     * Matched and marked SWAPPABLE: presence is governed elsewhere, content is not.
     */
    const sameSlotInBoth = !!fSlot && bSlot === fSlot;
    const baseHasLaterHome = bi < bk.length && filledHasLater(bk[bi], fi + 1);
    if (sameSlotInBoth && nodeIdentity(bk[bi]) === nodeIdentity(fk[fi])) {
      out.push({ ...mergeSlotTree(bk[bi], fk[fi], `${path}/${fk[fi].name}`, variant), slotSwap: fSlot });
      bi++; fi++;
      continue;
    }
    if (!(fSlot && baseHasLaterHome) && bi < bk.length && fi < fk.length
        && nodeIdentity(bk[bi]) === nodeIdentity(fk[fi])) {
      out.push(mergeSlotTree(bk[bi], fk[fi], `${path}/${fk[fi].name}`, variant));
      bi++; fi++;
      continue;
    }
    if (fi < fk.length) {
      const slot = fSlot;
      // An inserted subtree with no marker is not slot content — it is a node that appears
      // for some other reason, and silently treating it as a slot would put a layer behind
      // a component property that has nothing to do with it.
      if (!slot) {
        // Naming the variant matters: the same path fails on some combinations and not
        // others, and without it the only way to find out which is to add this line.
        throw new Error(`[${variant}] ${path}: the slot render inserted "${fk[fi].name}" but `
          + `nothing inside it carries a data-slot marker, so no component property can own it`);
      }
      // TWO KINDS OF SLOT, and they need different Figma properties.
      //
      // ADDITIVE: nothing renders when the slot is empty (Badge's startIcon). The layer is
      // hidden by default and a BOOLEAN reveals it.
      //
      // REPLACEMENT: the component renders its OWN default and the slot content replaces it
      // (DtNotice draws a kind-specific icon; filling `icon` overrides it). A visibility
      // toggle cannot express "replace A with B" — an INSTANCE_SWAP can, and the default
      // that already renders IS its default value. So the base node is kept, VISIBLE, and
      // marked swappable; the filled render's content is discarded, because what a consumer
      // swaps in is their choice and not ours to bake.
      //
      // Told apart by whether the base child here has any counterpart left in the filled
      // render: if it does, this really is an insertion and the base child matches later.
      if (bi < bk.length && !filledHasLater(bk[bi], fi)) {
        out.push({ ...bk[bi], slotSwap: slot });
        bi++; fi++;
        continue;
      }
      out.push({ ...fk[fi], slot });
      fi++;
      continue;
    }
    // Base children left over with the filled render exhausted: something renders when the
    // slots are empty and vanishes when they are filled, with nothing taking its place.
    // Neither property can express that, so it must not pass quietly.
    throw new Error(`[${variant}] ${path}: [${bk.slice(bi).map(n => n.name).join(', ')}] render `
      + `when the slots are EMPTY and disappear when they are filled, with no slot content `
      + `replacing them — neither a visibility toggle nor a swap can express that`);
  }
  return { ...base, children: out };
}

const axisNames = Object.keys(cfg.axes);
const combos = combosFor(cfg);

/**
 * One render, measured in both modes, resolved to a spec tree.
 *
 * Extracted so a merged build can measure the SAME combo twice — once with its slots empty
 * and once filled — through one code path. Two copies of this would be two chances for the
 * empty and filled renders to be measured under subtly different conditions, and the
 * difference between them is the entire point of the merge.
 */
async function measure (combo, slots) {
  const sc = cfg.slotContent ? cfg.slotContent(combo) : {};
  slotSwapTargets = Object.fromEntries(
    Object.entries(sc).filter(([, v]) => v && v.swapTo).map(([k, v]) => [k, v.swapTo]));
  anatomySwap = cfg.anatomySwap ? cfg.anatomySwap(combo) : null;
  await page.evaluate(([c, p, o]) => window.__setProps(c, p, o),
    [cfg.component, cfg.props(combo), { label: cfg.label, slots, slotContent: cfg.slotContent ? cfg.slotContent(combo) : undefined, rootClass: cfg.rootClass }]);
  activeCombo = combo;
  // Re-forced after every remount: changing the slots remounts the component, which
  // invalidates the CDP node id the previous force was applied to.
  if (!await forceState(cfg.pseudo ? cfg.pseudo(combo) : [])) throw new Error('component did not render');
  await page.evaluate(() => { void document.querySelector('#root > *').offsetWidth; });
  const dom = await page.evaluate(() => window.__anatomy());
  if (!dom) throw new Error(`no anatomy for ${JSON.stringify(combo)}`);
  // Second read in dark, then back to light so the CDP cascade below is the light one.
  await page.evaluate(() => window.__setMode('dark'));
  await page.evaluate(() => { void document.querySelector('#root > *').offsetWidth; });
  const domDark = await page.evaluate(() => window.__anatomy());
  await page.evaluate(() => window.__setMode('light'));
  await page.evaluate(() => { void document.querySelector('#root > *').offsetWidth; });
  darkBySelector = indexDark(domDark, new Map());
  const tree = await specForNode(cdp, cdpDoc, dom);
  markSlotDefaults(tree, cfg.slotDefaults);
  return tree;
}

const variants = [];
/** Combos whose slots cannot be filled — reported, never silently absent. */
const slotless = [];
for (const combo of combos) {
  const emptySlots = cfg.slots ? cfg.slots(combo) : [];
  let tree = await measure(combo, emptySlots);
  // A combo the component REFUSES to render with its slots filled (DtBadge rejects
  // `decoration` alongside an icon) gets no slot layers at all. Skipping the filled render
  // is the point: rendering it anyway produced a component error, and merging whatever came
  // out of a refused render would put nonsense behind a component property. The variant
  // simply has no layer for the boolean to toggle, which is the truthful representation of
  // "this combination cannot have an icon".
  const slotsPossible = !(cfg.slotInvalid && cfg.slotInvalid(combo));
  if (MERGED && slotsPossible) {
    const filled = await measure(combo, cfg.slotPass);
    tree = mergeSlotTree(tree, filled, 'root',
      cfg.variantName ? cfg.variantName(combo) : JSON.stringify(combo));
  }
  if (MERGED && !slotsPossible) slotless.push(combo);
  variants.push({
    // cfg.variantName is the ONE authority for a variant's name, because the checks use
    // it to FIND the Figma variant. Deriving a second name here from the raw combo drifts
    // the moment a value needs sanitising: `badge.decoration` and `avatar.presence` both
    // carry '' , which cfg maps to 'none' and a naive join renders as `decoration=`.
    // Figma cannot hold an empty variant property value — it mangles the whole name to
    // `Property 1=type=default, …`, which makes the SET malformed and every later read of
    // componentPropertyDefinitions throw "Component set has existing errors".
    name: cfg.variantName ? cfg.variantName(combo) : axisNames.map(a => `${a}=${combo[a]}`).join(', '),
    combo,
    tree,
  });
}

// The variant the code renders with no props set. See default-variant.mjs.
const propDefaults = await page.evaluate(n => window.__propDefaults(n), cfg.component);
const defaultComboFound = defaultCombo(cfg, variants.map(v => v.combo), propDefaults);
const defaultVariant = defaultComboFound ? variants.find(v => v.combo === defaultComboFound) : null;
// Figma's default variant is the TOP-LEFT one on the canvas, and the builder lays variants out in
// row order, so the default goes first. Everything else keeps its order.
if (defaultVariant) { variants.splice(variants.indexOf(defaultVariant), 1); variants.unshift(defaultVariant); }

await browser.close();
await server.close();

/**
 * REFUSE A MERGED SET THAT CANNOT BE RIGHT.
 *
 * Not a warning: a merged build whose parent spacing differs between states is wrong in one
 * of the two states no matter what is written, and the wrongness lands in an allowance list
 * where it reads as accepted. The fix is a real one — sweep slot presence as a variant AXIS,
 * so each state is measured in its own right — so say that here rather than build the set
 * and report 2,660 findings afterwards.
 */
/**
 * A NAMED EXCEPTION TO THE MERGE GUARD: `cfg.slotSpacingDrift`.
 *
 * Button cuts its x-padding by 2px a side when an icon is present, and a BOOLEAN cannot change a
 * padding, so a merged Button is wrong by that much in one of its two states. The guard refuses
 * that by default (see above). A config that has chosen to accept it names the properties; the
 * merged tree keeps the EMPTY render's spacing (the default state is then exact), and every
 * accepted divergence is counted here and written into the spec, so the verifier can expect
 * exactly it and every run can list it. Anything not named is still a blocker.
 */
const driftBound = cfg.slotSpacingDrift || {};   // { property: largest accepted difference in px }
const acceptedDrift = {};
for (let i = mergeBlockers.length - 1; i >= 0; i--) {
  const b = mergeBlockers[i];
  const bound = driftBound[b.prop];
  if (!bound || b.empty == null || b.filled == null || Math.abs(b.empty - b.filled) > bound + 0.01) continue;
  const k = `${b.path}|${b.prop}|${b.empty}|${b.filled}`;
  acceptedDrift[k] = (acceptedDrift[k] || 0) + 1;
  mergeBlockers.splice(i, 1);
}
const slotDrift = Object.entries(acceptedDrift).map(([k, count]) => {
  const [path, prop, empty, filled] = k.split('|');
  return { path, prop, empty: Number(empty), filled: Number(filled), count };
});

if (MERGED && mergeBlockers.length) {
  const byProp = {};
  for (const b of mergeBlockers) {
    const k = `${b.path} · ${b.prop}: ${b.empty} (empty) vs ${b.filled} (filled)`;
    byProp[k] = (byProp[k] || 0) + 1;
  }
  const lines = Object.entries(byProp).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([k, n]) => `  ${String(n).padStart(5)}x  ${k}`);
  throw new Error(`${which} cannot be a merged set: the component changes its OWN spacing when `
    + `its slots are filled, and no Figma component property can do that.\n`
    + `${mergeBlockers.length} divergence(s), most common:\n${lines.join('\n')}\n\n`
    + `Sweep slot presence as a variant AXIS instead — add the slot names to \`axes\` as `
    + `[false, true], give the config a \`slots\` function, and include them in \`variantName\`. `
    + `Each state is then measured in its own right and needs no merge at all.`);
}

// A slot spec builds a SEPARATE set on its OWN page. Sharing the page would have the
// slot build clear and replace the ordinary one — they are different renders of the same
// component (named slots filled vs. empty), and both have to exist to be compared.
const out = { component: which, vue: cfg.component,
  // The text the HARNESS supplied as the component's label. That is the text a consumer
  // would replace, so it is the one that becomes a Figma TEXT property — matching the
  // hand-built library, whose Button carries `Label#19528:0` bound to `characters`.
  label: cfg.label || null,
  // A merged build goes to its OWN page while the mechanism is being proven. Writing it
  // straight onto `cfg.page` would clear and replace a set that is currently verified
  // clean, and a merged set that turns out wrong would have cost the good one.
  page: cfg.page + (MERGED_TRIAL ? ' Merged' : ''), axes: cfg.axes,
  defaultVariant: defaultVariant ? defaultVariant.name : null,
  slotDrift: slotDrift.length ? slotDrift : undefined, variants };

/**
 * A VARIABLE CANNOT HOLD TWO NUMBERS.
 *
 * `.d-avatar__canvas-inner { inline-size: var(--dt-layout-100-percent) }` resolves to 16px
 * on a 16px avatar and 256px on a 256px one. Both readings are correct and the token is
 * the same, so emitting it asks Figma to bind one FLOAT variable to two values — which
 * preflight reports as `token missing from Figma: layout/100/percent`, since no such
 * variable exists or could.
 *
 * The test is the conflict itself, not the token's name or its CSS text. Two earlier
 * versions of this guard looked for a percent sign and found none: the declaration reads
 * `var(--dt-layout-100-percent)` and the computed value is already px, so `100%` appears
 * nowhere downstream of the cascade. What DOES survive is the contradiction, and it is
 * visible here because this is the first point that holds every variant at once.
 *
 * Only the token is dropped. Every value stays exactly as measured.
 */
{
  const seen = new Map();                                    // token -> Set of values
  const visit = (n, fn) => { fn(n); for (const c of n.children || []) visit(c, fn); };
  const NUMERIC = new Set(Object.values(NUM_PROPS).concat(['width', 'height']));
  for (const v of variants) {
    visit(v.tree, (n) => {
      for (const [k, p] of Object.entries(n.props || {})) {
        if (!NUMERIC.has(k) || !p || !p.token || typeof p.value !== 'number') continue;
        if (!seen.has(p.token)) seen.set(p.token, new Set());
        seen.get(p.token).add(p.value);
      }
    });
  }
  const conflicted = new Map();
  for (const [tok, vals] of seen) if (vals.size > 1) conflicted.set(tok, [...vals].sort((a, b) => a - b));
  if (conflicted.size) {
    let stripped = 0;
    for (const v of variants) {
      visit(v.tree, (n) => {
        for (const [k, p] of Object.entries(n.props || {})) {
          if (!NUMERIC.has(k) || !p || !p.token || !conflicted.has(p.token)) continue;
          p.unbindable = `${p.token} resolves to ${conflicted.get(p.token).join('/')} — not one number`;
          p.token = null;
          stripped++;
        }
      });
    }
    for (const [tok, vals] of conflicted) {
      console.log(`  ${tok} holds ${vals.join(', ')} across this component — dropped as a binding`);
    }
    console.log(`  ${stripped} property/properties keep their measured value as a literal`);
  }
}
// ONE canonical location. Writing here while encode-build.mjs preferred a copy in
// build-data/ meant a fresh spec was silently ignored in favour of a stale one — the
// checkbox glyph work rebuilt cleanly and then encoded from a spec that predated it.
const file = `sync-scripts/build-data/${which}${MERGED_TRIAL ? '-merged' : ''}-spec.json`;
if (MERGED) {
  // Counted per KIND, because they become different Figma properties: an additive layer
  // gets a BOOLEAN and starts hidden, a replacement point gets only an INSTANCE_SWAP and
  // stays visible. One number covering both would hide which is which.
  const tally = (node, out = { additive: 0, replacement: 0 }) => {
    if (node.slot) out.additive++;
    if (node.slotSwap) out.replacement++;
    for (const c of node.children || []) tally(c, out);
    return out;
  };
  const t = variants.reduce((a, v) => { const x = tally(v.tree); a.additive += x.additive; a.replacement += x.replacement; return a; },
    { additive: 0, replacement: 0 });
  const carrying = variants.filter(v => { const x = tally(v.tree); return x.additive || x.replacement; }).length;
  console.log(`merged     : ${carrying} of ${variants.length} variant(s) carry slots `
    + `(${t.additive} additive layer(s), ${t.replacement} replacement swap point(s)); `
    + `${slotless.length} cannot (slotInvalid)`);
  for (const d of slotDrift) {
    console.log(`drift      : ${String(d.count).padStart(4)}x ${d.path} ${d.prop} ${d.empty} (empty) vs ${d.filled} (filled) `
      + `— accepted by slotSpacingDrift, the merged set keeps ${d.empty}`);
  }
}
mkdirSync(dirname(file), { recursive: true });   // a standalone build may run before build-data exists
writeFileSync(file, JSON.stringify(out));

// coverage report — how much of the geometry and colour is token-backed
let bound = 0, unbound = 0;
const walk = n => {
  for (const [k, v] of Object.entries(n.props || {})) {
    if (k === 'shadow') continue;
    if (v && v.token) bound++; else unbound++;
  }
  (n.children || []).forEach(walk);
};
variants.forEach(v => walk(v.tree));
console.log(`${which}: ${variants.length} variants of ${combos.length} planned`);
console.log(`properties: ${bound} token-backed, ${unbound} literal (${(100 * bound / (bound + unbound)).toFixed(1)}% bound)`);
console.log(`wrote ${file}`);
