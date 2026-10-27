/**
 * Encode a browser-measured spec into a compact, GENERIC Figma build payload.
 *
 * Until now every component had a bespoke encoder and a bespoke plugin script. That
 * does not scale past a handful, and each hand-written builder was its own chance to
 * introduce a defect the verifier then had to find. This produces one shape that a
 * single generic builder can walk.
 *
 * The saving is structural: most variants share most of their subtree, so nodes are
 * deduplicated by deep equality and variants reference them by index.
 *
 *   node encode-build.mjs <component>     -> build-data/<component>-build.json
 */
import './pin-cwd.mjs';   // launch directory must not matter
import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { COMPONENTS } from './component-axes.mjs';
import { fetchPublishedTokenKeys } from './library-tokens.mjs';

const which = process.argv[2];
if (!which) throw new Error('usage: encode-build.mjs <component>');

// A single location, deliberately. The previous two-candidate search preferred a
// stale copy in build-data/ over the freshly written one and reported nothing about
// which it had used, so a rebuilt spec could be encoded away entirely.
// `<name>-merged` and `<name>-slots` are payload names, not flags — the suffix already
// selects the spec and the output, exactly as it does for a slot build. A parallel `--merged`
// flag would be a second way to say the same thing, and the two could disagree.
const specPath = `sync-scripts/build-data/${which}-spec.json`;
if (!existsSync(specPath)) throw new Error(`no spec at ${specPath} — run build-spec.mjs ${which} first`);
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
{
  // Staleness is the failure mode here, so say plainly what was read and how old it
  // is relative to the code that produces it.
  const specAge = statSync(specPath).mtimeMs;
  const newer = ['build-spec.mjs', 'verify-harness/main.js', 'figma-mapping.mjs',
  'cdp-provenance.mjs']
    .map(f => new URL(`./${f}`, import.meta.url).pathname)
    .filter(f => existsSync(f) && statSync(f).mtimeMs > specAge);
  console.log(`spec: ${specPath}  (${new Date(specAge).toISOString().slice(0, 19).replace('T', ' ')})`);
  if (newer.length) {
    throw new Error(`this spec is OLDER than ${newer.map(f => f.split('/').pop()).join(', ')}.\n`
      + `Re-run: node sync-scripts/build-spec.mjs ${which.replace(/-(merged|slots)$/, '')}`
      + `${/-merged$/.test(which) ? ' --merged' : ''}`);
  }
}

// ── shared tables ───────────────────────────────────────────────────────────
const toks = [];
const cols = [];
const nodes = [];
const svgs = [];
/**
 * Image SOURCES, interned. Only the path travels in the payload — the bytes do not.
 * The Dialtone avatar is 193KB, which as base64 is larger than the whole rest of a
 * shard, so the plugin fetches it from the same dev server it fetches payloads from.
 */
const imgs = [];
const ii = (src) => {
  if (!src) return -1;
  let i = imgs.indexOf(src);
  if (i < 0) { imgs.push(src); i = imgs.length - 1; }
  return i;
};
/**
 * Intern an SVG source, stripped of attributes the Figma importer ignores.
 *
 * The payload can only reach the plugin by being pasted inline (the sandbox has no
 * `fetch`), so its size is the real constraint on how many calls a page takes.
 * `class`, `data-*`, `aria-hidden` and `role` cost ~100 bytes per icon and change
 * nothing about the imported geometry.
 */
const si = (src) => {
  if (!src) return -1;
  let clean = src
    .replace(/\s(?:class|aria-hidden|role|focusable)="[^"]*"/g, '')
    .replace(/\sdata-[a-z-]+="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // Dialtone mints a FRESH clipPath id per icon instance (`dt-icon4a`, `dt-icon5a`,
  // …), so twenty byte-identical glyphs interned as twenty separate entries — in
  // banner shard 2 that alone was ~11KB of a 35KB payload. Each createNodeFromSvg
  // call parses its own document, so ids only need to be unique WITHIN one SVG:
  // renumbering them from `a` per glyph is safe and lets the duplicates collapse.
  const ids = [];
  clean = clean.replace(/id="([^"]+)"/g, (m, id) => {
    if (!ids.includes(id)) ids.push(id);
    return `id="i${ids.indexOf(id)}"`;
  });
  clean = clean.replace(/url\(#([^)]+)\)/g, (m, id) => {
    const k = ids.indexOf(id);
    return k < 0 ? m : `url(#i${k})`;
  });
  let i = svgs.indexOf(clean);
  if (i < 0) { svgs.push(clean); i = svgs.length - 1; }
  return i;
};
const key = (v) => JSON.stringify(v);

const ti = (t) => {
  if (!t) return -1;
  let i = toks.indexOf(t);
  if (i < 0) { toks.push(t); i = toks.length - 1; }
  return i;
};
const ci = (c) => {
  if (!c) return -1;
  const v = [+c.r.toFixed(6), +c.g.toFixed(6), +c.b.toFixed(6), +(c.a ?? 1).toFixed(4)];
  const k = key(v);
  let i = cols.findIndex(x => key(x) === k);
  if (i < 0) { cols.push(v); i = cols.length - 1; }
  return i;
};
const ni = (node) => {
  const k = key(node);
  let i = nodes.findIndex(x => key(x) === k);
  if (i < 0) { nodes.push(node); i = nodes.length - 1; }
  return i;
};

// ── one node -> its deduplicated descriptor ─────────────────────────────────
const COLOR_KEYS = new Set(['background', 'textColor', 'borderColor']);
const NUM_KEYS = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'itemSpacing', 'counterAxisSpacing', 'opacity', 'fontSize', 'minWidth', 'minHeight',
  // Structural size. Emitted by build-spec only where the axis is pinned and the token's
  // value already equals the measured box, so carrying it here cannot move any geometry.
  'width', 'height',
  // Per side and per corner. One of each used to stand for all four, which described a
  // quarter of DtSplitButton's geometry and assumed the rest matched.
  'strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight',
  'topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'];

/**
 * SYNTHESISED VARIABLES for colours CSS computes and no token names.
 *
 * `color-mix(in oklch, oklch(from <token> l calc(c - .08) h) 65%, transparent)` and
 * `oklch(L C calc(<hue> + offset))` are real colour decisions with a light and a dark
 * value, and Figma can hold either a variable or a literal — so a literal is wrong in one
 * of the two modes, every time. 504 findings said so. build-spec now measures both modes
 * for exactly these colours; this turns each distinct one into a variable.
 *
 * Grouped by (source tokens, property, colour pair) so two roles that happen to share a
 * value stay separate variables — a design system aliases; it does not merge.
 *
 * Naming: from the SOURCE token when that discriminates within this component, which is
 * the case for Button (each kind has its own foreground/background token). Avatar's 120
 * backgrounds all derive from the single `avatar/anchor/hue`, so there the source says
 * nothing and the light value is the only honest discriminator.
 */
const dvars = [];
const dvarIndex = new Map();
const SCOPES = {
  background: ['FRAME_FILL', 'SHAPE_FILL'],
  textColor: ['TEXT_FILL'],
  borderColor: ['STROKE_COLOR'],
};
const FIG_PROP = { background: 'fill', textColor: 'text', borderColor: 'stroke' };
const hex6 = c => ['r', 'g', 'b'].map(k => Math.round(c[k] * 255).toString(16).padStart(2, '0')).join('');
const o = c => Math.round((c.a ?? 1) * 100);
const dvarKey = (key, p) => `${(p.derivedFrom || []).join('+')}|${key}|${hex6(p.rgba)}|${o(p.rgba)}|${hex6(p.rgbaDark)}|${o(p.rgbaDark)}`;

/** Count how many distinct groups each single source token accounts for. */
const sourceGroups = new Map();
{
  const seen = new Set();
  const walk = (n) => {
    if (!n) return;
    // currentColor counts as a `textColor` group: a glyph's colour is the element's
    // `color`, and leaving it out of this pre-pass would push every derived glyph colour
    // onto the hex-name fallback even where its source token discriminates perfectly.
    const candidates = [...[...COLOR_KEYS].map(k => [k, (n.props || {})[k]]),
      ['textColor', n.currentColor]];
    for (const [key, p] of candidates) {
      if (!p || p.token || !p.rgbaDark) continue;
      const k = dvarKey(key, p);
      if (seen.has(k)) continue;
      seen.add(k);
      const src = (p.derivedFrom || []).length === 1 ? p.derivedFrom[0] : null;
      if (src) sourceGroups.set(src, (sourceGroups.get(src) || 0) + 1);
    }
    for (const c of n.children || []) walk(c);
  };
  for (const v of spec.variants) walk(v.tree);
}

function dvarFor (key, p) {
  const k = dvarKey(key, p);
  if (dvarIndex.has(k)) return dvarIndex.get(k);
  const src = (p.derivedFrom || []).length === 1 ? p.derivedFrom[0] : null;
  const comp = String(spec.page || spec.component || 'component').toLowerCase();
  const name = (src && sourceGroups.get(src) === 1)
    ? `derived/${src}/o${o(p.rgba)}`
    : `derived/${comp}/${FIG_PROP[key]}/${hex6(p.rgba)}-o${o(p.rgba)}`;
  const from = (p.derivedFrom || []).join(', ');
  const i = dvars.length;
  dvars.push({
    name,
    light: [+p.rgba.r.toFixed(6), +p.rgba.g.toFixed(6), +p.rgba.b.toFixed(6), +(p.rgba.a ?? 1).toFixed(4)],
    dark: [+p.rgbaDark.r.toFixed(6), +p.rgbaDark.g.toFixed(6), +p.rgbaDark.b.toFixed(6), +(p.rgbaDark.a ?? 1).toFixed(4)],
    scopes: SCOPES[key] || ['ALL_SCOPES'],
    // The description MUST start with DERIVED: audit-provenance already recognises that
    // prefix and reports such bindings on their own line ("bound to a DERIVED variable"),
    // so this plugs into the existing convention instead of inventing a second one.
    desc: `DERIVED — CSS computes this colour${from ? ' from ' + from : ''} and no token names`
      + ` the result, so no published token can be bound to it.`
      + ` Light #${hex6(p.rgba)} / Dark #${hex6(p.rgbaDark)}`
      + `${o(p.rgba) < 100 ? ` at ${o(p.rgba)}% opacity` : ''}.`
      + ` Created by the code→Figma sync; regenerated from the component's own render.`,
  });
  dvarIndex.set(k, i);
  return i;
}


/**
 * THE ICON LIBRARY, for resolving a measured icon to a component a designer can swap.
 *
 * Absent until the library has been built, and that is fine: a slot layer with no resolved
 * component still renders as an imported SVG, it just cannot be swapped. What must NOT
 * happen is resolving to the WRONG icon, so an ambiguous name is reported rather than
 * guessed — `close` exists once, but a last-segment match is only safe while that holds.
 */
let ICON_LIB = { ids: {} };
try { ICON_LIB = JSON.parse(readFileSync('sync-scripts/build-data/icon-library.json', 'utf8')); }
catch { /* library not built yet */ }
const ICON_BY_SLUG = new Map();
for (const full of Object.keys(ICON_LIB.ids || {})) {
  const leaf = full.split('/')[1];
  if (!ICON_BY_SLUG.has(leaf)) ICON_BY_SLUG.set(leaf, []);
  ICON_BY_SLUG.get(leaf).push(full);
}
/**
 * A SLOT'S SWAP TARGET — the Figma component a designer starts from.
 *
 * Icons resolve through `icon-library.json`; a component slot has no such file, so the
 * target set is read straight from the file it is already built in. The config states the
 * FULL variant combo, so nothing here is inferred — the only step is combo -> that
 * component's own `variantName` -> the node id Figma gave that variant.
 *
 * WHAT THIS IS NOT: evidence about the slot's API. DtNotice's `action` is a bare slot whose
 * doc comment offers a link as its example, so the button is a chosen exemplar and a starting
 * point for a swap, not a required type. A Figma set can only show one thing.
 *
 * Absent or unresolvable is fine and reported: the slot then has no swap property, which
 * run-batch already says out loud per slot.
 */
const swapTargets = new Map();     // "component|variantName" -> node id
const swapUnresolved = new Set();
/**
 * The variant name a swap target is stored AND looked up under, so the two cannot differ.
 *
 * An axis the config does not name takes its DEFAULT (first value). Button gained circle,
 * link, linkKind and linkUnderline after Banner and Notice named their action variant, and
 * a name built without them matched nothing: the action silently lost its swap.
 */
function swapVariantName (target, variant) {
  const defaults = Object.fromEntries(Object.entries(target.axes).map(([a, vals]) => [a, vals[0]]));
  return target.variantName({ ...defaults, ...variant });
}
async function resolveSwapTargets (nodes) {
  const wanted = new Map();        // component key -> Set(variantName)
  for (const n of nodes) {
    if (!n.slotSwapTo) continue;
    const cfgKey = n.slotSwapTo.component;
    const target = COMPONENTS[cfgKey];
    if (!target || !target.figmaSetId) { swapUnresolved.add(`${cfgKey}: no config or no figmaSetId`); continue; }
    const vn = swapVariantName(target, n.slotSwapTo.variant);
    if (!wanted.has(cfgKey)) wanted.set(cfgKey, new Set());
    wanted.get(cfgKey).add(vn);
  }
  for (const [cfgKey, names] of wanted) {
    const setId = COMPONENTS[cfgKey].figmaSetId;
    try {
      const r = await fetch(`https://api.figma.com/v1/files/${process.env.FILE_KEY}`
        + `/nodes?ids=${encodeURIComponent(setId)}&depth=1`,
        { headers: { 'X-Figma-Token': process.env.PERSONAL_ACCESS_TOKEN } });
      if (!r.ok) throw new Error(`${r.status}`);
      const j = await r.json();
      const doc = (j.nodes[setId] || {}).document;
      const byName = new Map(((doc && doc.children) || []).map(c => [c.name, c.id]));
      for (const vn of names) {
        const id = byName.get(vn);
        if (id) swapTargets.set(`${cfgKey}|${vn}`, id);
        else swapUnresolved.add(`${cfgKey} has no variant "${vn}"`);
      }
    } catch (e) {
      swapUnresolved.add(`${cfgKey}: could not read set ${setId} (${e.message})`);
    }
  }
}

const iconUnresolved = new Set();
const iconAmbiguous = new Set();
function iconIdFor (name) {
  if (!name) return null;
  const slug = String(name).trim().toLowerCase().replace(/\s+/g, '-');
  const hits = ICON_BY_SLUG.get(slug) || [];
  if (!hits.length) { if (Object.keys(ICON_LIB.ids || {}).length) iconUnresolved.add(name); return null; }
  if (hits.length > 1) { iconAmbiguous.add(`${name} -> ${hits.join(', ')}`); return null; }
  return ICON_LIB.ids[hits[0]];
}

function encodeNode (n) {
  const p = n.props || {};
  const out = { n: n.name || n.tag || 'node' };
  // Slot markers travel as single letters like everything else in this payload.
  //   sl = an ADDITIVE slot root: hidden by default, revealed by a BOOLEAN property
  //   sw = a REPLACEMENT point: stays visible, governed only by an INSTANCE_SWAP
  //   ic = the icon-library component this node should be an INSTANCE of
  if (n.slot) out.sl = n.slot;
  if (n.slotSwap) out.sw = n.slotSwap;
  // tp = this TEXT node becomes a component TEXT property under this name. Matched on the
  // label the harness injected rather than on position: a component can render its label
  // at any depth (DtBadge nests it two frames down), and guessing by depth would bind the
  // property to whatever text happened to be there.
  if (n.text && spec.label && n.text === spec.label) out.tp = 'Label';
  const icId = iconIdFor(n.iconName);
  if (icId) out.ic = icId;
  // A declared swap target wins: the node becomes an instance of that component rather than
  // a rebuilt copy of the anatomy that was measured.
  if (n.slotSwapTo) {
    const t = COMPONENTS[n.slotSwapTo.component];
    const hit = t && swapTargets.get(`${n.slotSwapTo.component}|${swapVariantName(t, n.slotSwapTo.variant)}`);
    if (hit) out.ic = hit;
  }

  if (n.tag === 'svg' && n.svg) {
    // Handed to Figma whole. Reconstructing path data by hand produced glyphs that
    // visibly differed from Dialtone's; importing the real source cannot.
    out.t = 'SVG';
    out.s = si(n.svg);
    out.box = [n.box ? n.box.w : 0, n.box ? n.box.h : 0];
    if (n.rel && (n.rel.x || n.rel.y)) out.rel = [n.rel.x, n.rel.y];
    if (n.absolute) out.abs = 1;
    // `g` = paint this glyph with the hand-tuned angular gradient instead of a flat fill.
    // See `anatomySwap.gradient` in build-spec.mjs and `gradientFill` in generic-builder.js.
    if (n.gradFill) out.g = 1;
    if (n.currentColor && n.currentColor.rgba) {
    out.cc = [ci(n.currentColor.rgba), ti(n.currentColor.token)];
    // Third slot, exactly as for the colour props: a glyph colour CSS computes needs a
    // synthesised variable or it cannot follow the mode. `paint()` reads it already.
    if (!n.currentColor.token && n.currentColor.rgbaDark) out.cc.push(dvarFor('textColor', n.currentColor));
  }
    /**
     * The SIZE, which this branch returned before ever reaching the numeric props below.
     *
     * An imported SVG is handed to Figma whole, so most numeric properties are meaningless
     * on it — but its width and height are exactly as declared, and Dialtone names them
     * (`inline-size: var(--dt-icon-size-100)`). Dropped here, the token existed in the spec,
     * never reached the payload, and the builder had nothing to bind: DtLoader is made of
     * nothing but icons, so it declared 32 size tokens and bound zero, and the identity pass
     * compared 0 bindings across 8 variants.
     *
     * Three separate fixes went to the frame branch, the instance branch and the builder's
     * SVG branch before it turned out the values never left the encoder.
     *
     * `opacity` belongs here for the same reason: DtLoader's track ring is an ordinary
     * `<svg>` with a perfectly ordinary `opacity: var(--dt-opacity-200)` rule — nothing
     * masked, nothing exotic — and it still came back fully opaque on the built canvas,
     * because this branch returns before the generic `NUM_KEYS` loop below (which is where
     * `opacity` is normally copied) ever runs.
     */
    for (const k of ['width', 'height', 'opacity']) {
      if (p[k] && p[k].value != null) out[k] = [p[k].value, ti(p[k].token)];
    }
    return out;
  }

  if (n.isText) {
    out.t = 'TEXT';
    out.tx = n.text;
    const ty = n.typography || {};
    out.ty = [ty.fontSize ?? null, ty.fontWeight ?? null, ty.lineHeightPct ?? null];
    // A fourth slot, pushed only when the family is not the builder's default — same
    // omit-the-default rule as everywhere else here, so ordinary text stays three long.
    if (ty.family && ty.family !== 'SF Pro Text') out.ty.push(ty.family);
  } else if (n.isPseudo) {
    out.t = 'PSEUDO';
    out.pseudo = n.name;
  } else {
    out.t = 'FRAME';
  }

  // colours carry BOTH the resolved value and the token: the literal beneath a bound
  // paint must be the real colour, or an unresolved binding paints black (B-9).
  for (const k of COLOR_KEYS) {
    if (!p[k] || !p[k].rgba) continue;
    out[k] = [ci(p[k].rgba), ti(p[k].token)];
    // Third slot: index into `dvars`, for a colour that has no token but does have a
    // measured dark value. The builder creates the variable and binds the paint to it.
    if (!p[k].token && p[k].rgbaDark) out[k].push(dvarFor(k, p[k]));
  }
  // an inline SVG fills from `color`; the node itself paints no text
  if (n.currentColor && n.currentColor.rgba) {
    out.cc = [ci(n.currentColor.rgba), ti(n.currentColor.token)];
    // Third slot, exactly as for the colour props: a glyph colour CSS computes needs a
    // synthesised variable or it cannot follow the mode. `paint()` reads it already.
    if (!n.currentColor.token && n.currentColor.rgbaDark) out.cc.push(dvarFor('textColor', n.currentColor));
  }

  for (const k of NUM_KEYS) {
    if (!p[k] || p[k].value == null) continue;
    out[k] = [p[k].value, ti(p[k].token)];
    // Third slot: how much of this padding is the node's OWN margin, folded in. The
    // builder's hug prediction needs it, because a folded margin grows the node BEYOND
    // its CSS box — so the box cannot be used to predict the content extent without
    // subtracting the fold again. `childMarginFold` is deliberately NOT included: a
    // child's margin is space inside this node's box already.
    if (p[k].marginFold) out[k].push(p[k].marginFold);
  }
  // An <img>: the source index and the fit mode, so the builder can create an IMAGE fill.
  // `n.image`, not `p.image`: build-spec puts this on the NODE, beside `currentColor`,
  // because an <img>'s source is not a style property. Reading it off `props` emitted
  // nothing at all and preflight had no reference to complain about.
  if (n.image && n.image.src) out.im = [ii(n.image.src), n.image.fit === 'cover' ? 1 : 0];
  // Which axes CSS pinned with an explicit size, so the builder fixes them instead of
  // hugging content Figma measures differently (text, above all).
  if (p.sizedW) out.pw = 1;
  if (p.sizedH) out.ph = 1;
  if (p.shadow) {
    out.sh = [p.shadow.inset ? 1 : 0, ti(p.shadow.token)];
    // Every layer, so a multi-part shadow paints as many effects as the CSS does.
    // 7th slot: this LAYER's own colour token. A composite shadow token spells out a
    // full layer per ring, each with its own `-color`, so the shadow-wide token in
    // `out.sh` cannot speak for more than one of them.
    if (p.shadow.layers) out.shl = p.shadow.layers.map(l =>
      [l.inset ? 1 : 0, ci(l.rgba), l.x, l.y, l.blur, l.spread, ti(l.token)]);
  }
  // An outline is an outset DROP_SHADOW with zero blur and spread = width + offset.
  if (p.outline) out.ol = [ci(p.outline.rgba), ti(p.outline.token), p.outline.spread, p.outline.inset ? 1 : 0];

  const lay = n.layout || {};
  // 'normal' is absent from the builder's ALIGN map, so it is already a no-op — '' is
  // the same behaviour in a third of the bytes, across every node in the table.
  const noop = v => (!v || v === 'normal' || v === 'stretch' ? '' : v);
  out.lay = [
    /flex|grid/.test(lay.display || '') ? (lay.direction === 'VERTICAL' ? 'V' : 'H') : 'N',
    noop(lay.align), noop(lay.justify),
  ];
  // A fourth slot, pushed only when the layout wraps AND is horizontal — the same
  // "omit the default" rule the rest of this encoder follows, so every non-wrapping node
  // stays three elements long.
  //
  // Horizontal only because Figma has no other kind: `layoutWrap = WRAP` on a vertical
  // frame is refused by name. A CSS column that wraps into columns is a real thing the
  // browser does and a thing this payload cannot ask for, so it is not asked for. The
  // builder guards the same condition, which is defence in depth rather than duplication —
  // this one keeps the instruction out, that one survives a payload that has it anyway.
  if (lay.wrap && out.lay[0] === 'H') out.lay.push('W');
  out.box = [n.box ? n.box.w : 0, n.box ? n.box.h : 0];
  // The measured parent-relative offset is carried for EVERY node, not only absolute
  // ones. A `display: block` container becomes a Figma frame with layoutMode NONE,
  // which does not stack its children — without this, block siblings all land at 0,0
  // and Checkbox printed its description on top of its label.
  if (n.rel && (n.rel.x || n.rel.y)) out.rel = [n.rel.x, n.rel.y];
  if (n.absolute) {
    out.abs = 1;
    if (n.inset) out.inset = [n.inset.inlineStart, n.inset.inlineEnd, n.inset.blockStart, n.inset.blockEnd];
  }
  if (n.isPseudo) {
    out.abs = 1;
    // Prefer the spec's resolved `rel`, which includes the parent's border width. The
    // inset+transform synthesis below is measured from the PADDING box and so lands a
    // border-width short; it survives only as a fallback for specs written before
    // build-spec started resolving this.
    if (n.rel) {
      out.rel = [n.rel.x, n.rel.y];
    } else {
      const off = n.offset || { x: 0, y: 0 };
      out.rel = [
        parseFloat((n.inset || {}).inlineStart || 0) + off.x,
        parseFloat((n.inset || {}).blockStart || 0) + off.y,
      ];
    }
  }

  // A glyph painted through `background-image` has no DOM node of its own, but it
  // is a real painted thing and becomes a vector CHILD in Figma. First, so it sits
  // behind the element's own content exactly as a background does.
  // Intrinsic size and centred placement, not the element box — a background glyph
  // does not stretch to its element (`background-size: auto`).
  const gr = n.svgRect;
  const glyph = (n.svg && n.tag !== 'svg' && gr && !gr.unrepresentable)
    ? [ni({ n: 'glyph', t: 'SVG', s: si(n.svg), box: [gr.w, gr.h], abs: 1, rel: [gr.x, gr.y] })]
    : [];
  out.kids = [...glyph, ...(n.children || []).map(c => ni(encodeNode(c)))];
  return out;
}

// Sharding happens HERE, not at build time, because slicing rows in the plugin still
// ships the whole node table. The Figma sandbox has no `fetch` (probed: undefined),
// so every payload is pasted inline and its size is the binding constraint.
// Each shard re-derives its own tables and therefore carries only what it uses.
const shardArg = process.argv.find(a => a.startsWith('--shard='));
if (shardArg) {
  const [k, n] = shardArg.slice(8).split('/').map(Number);
  if (!(k >= 1 && k <= n)) throw new Error('--shard=k/n with 1 <= k <= n');
  const per = Math.ceil(spec.variants.length / n);
  spec.variants = spec.variants.slice((k - 1) * per, k * per);
  console.log(`shard ${k}/${n}: ${spec.variants.length} variants`);
}

const axisNames = Object.keys(spec.axes);
const norm = v => (v === true ? 'true' : v === false ? 'false' : String(v));
const axisVals = axisNames.map(a => spec.axes[a].map(norm));

// Resolved BEFORE encoding, because encodeNode is synchronous and the lookup is a fetch.
{
  const all = [];
  const walk = (n) => { all.push(n); for (const c of n.children || []) walk(c); };
  for (const v of spec.variants) walk(v.tree);
  if (all.some(n => n.slotSwapTo)) await resolveSwapTargets(all);
}

const rows = spec.variants.map(v => [
  axisNames.map((a, i) => axisVals[i].indexOf(norm(v.combo[a]))),
  ni(encodeNode(v.tree)),
]);

// Carry the RESOLVED variant names rather than letting the builder re-derive them from
// axisVals. Two independent name generators is one too many: the builder's join cannot
// know that '' means 'none', and a name Figma rejects poisons the whole component set.
const rowNames = spec.variants.map(v => v.name);

// This file consumes the Dialtone Design Tokens library rather than owning the
// variables locally (see library-tokens.mjs), so the plugin needs the import key
// for any token this file cannot resolve on its own — restricted to names this
// payload actually uses, not the library's full 837.
const publishedKeys = await fetchPublishedTokenKeys(process.env.PERSONAL_ACCESS_TOKEN, process.env.TOKENS_FILE_KEY);
const tokKeys = Object.fromEntries(toks
  .filter(t => publishedKeys.has(t))
  .map(t => [t, publishedKeys.get(t)]));

// Slots the builder makes NATIVE (Figma SLOT) instead of an INSTANCE_SWAP, per the config.
const nativeSlots = (COMPONENTS[which.replace(/-(merged|slots)$/, '')] || {}).nativeSlots || [];
const payload = { component: spec.component, page: spec.page, axisNames, axisVals, toks, tokKeys, nativeSlots, cols, svgs, imgs, nodes, rows, rowNames, dvars };
const shardSuffix = shardArg ? `-${shardArg.slice(8).replace('/', 'of')}` : '';
const outPath = `sync-scripts/build-data/${which}${shardSuffix}-build.json`;
writeFileSync(outPath, JSON.stringify(payload));

const bytes = readFileSync(outPath).length;
console.log(`${which}: ${rows.length} variants`);
console.log(`  distinct nodes : ${nodes.length}  (deduplicated from the full trees)`);
console.log(`  tokens         : ${toks.length}`);
console.log(`  synthesised    : ${dvars.length} derived variable(s)`);
console.log(`  colours        : ${cols.length}`);
// Slot layers and their resolved icons, reported because an unresolved one is a slot the
// designer cannot swap — a silent downgrade from "pick any icon" to "this icon forever".
{
  const t = { additive: 0, replacement: 0, withComponent: 0 };
  const walk = (r) => { for (const n of r) {
    if (n.sl) t.additive++;
    if (n.sw) t.replacement++;
    if (n.ic) t.withComponent++;
  } };
  walk(nodes);
  if (t.additive || t.replacement) {
    console.log(`  slots          : ${t.additive} additive, ${t.replacement} replacement; `
      + `${t.withComponent} resolved to an icon-library component`);
  }
  const swapped = nodes.filter(n => n.sl || n.sw).filter(n => n.ic).length;
  if (swapTargets.size || swapUnresolved.size) {
    console.log(`  slot swaps      : ${swapTargets.size} target(s) resolved to a component id`);
    for (const u of swapUnresolved) console.log(`  ⚠ unresolved swap target — the slot will have no swap: ${u}`);
  }
  if (iconUnresolved.size) {
    console.log(`  ⚠ ${iconUnresolved.size} icon name(s) not in the library: `
      + [...iconUnresolved].slice(0, 8).join(', '));
  }
  for (const a of iconAmbiguous) console.log(`  ⚠ ambiguous icon name — not resolved: ${a}`);
}
console.log(`  payload        : ${(bytes / 1024).toFixed(1)} KB -> ${outPath}`);
if (bytes > 900_000) {
  console.log('  WARNING: over ~900KB is too large to embed in one plugin call; shard it.');
}
