/**
 * DOM-anatomy component extractor.
 *
 * The browser already implements the CSS cascade correctly, so we stop
 * reimplementing it. The DOM gives the tree, the parts, the layout and the
 * resolved values; the CSS/token layer is used for ONE thing — mapping a
 * resolved value back to the --dt-* token that produced it, so the Figma
 * property can be BOUND instead of baked.
 *
 *   node extract-anatomy.mjs [component…]
 */
import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { buildIndex, resolveNode } from './css-provenance.mjs';

const require = createRequire('/Users/paulojreis/Development/dialtone/packages/dialtone-tokens/');
const culori = require('culori');

const HARNESS = new URL('./verify-harness/', import.meta.url).pathname;

// ── the batch: axes taken from each <Name>Constants.js ──────────────────────
const COMPONENTS = {
  button: { component: 'DtButton', label: 'Button', axes: {
    kind: ['default', 'muted', 'critical', 'positive', 'inverted'],
    importance: ['clear', 'outlined', 'primary'],
    size: [100, 200, 300, 400, 500],
  // blockStartIcon/blockEndIcon add `d-btn--vertical` to the root, restacking the
  // whole button — that is a layout change, so it needs its own axis rather than a
  // boolean property. Deferred; startIcon/endIcon keep the button horizontal.
  }, slots: ['startIcon', 'endIcon'],
     invalid: [{ kind: 'muted', importance: 'primary' }] },
  badge: { component: 'DtBadge', label: 'Badge', axes: {
    type: ['default', 'info', 'positive', 'warning', 'critical', 'bulletin', 'ai'],
    kind: ['label', 'count'],
    subtle: [false, true],
    outlined: [false, true],
    decoration: ['', 'black-400','black-500','black-900','red-200','red-300','red-400',
      'purple-200','purple-300','purple-400','purple-500','blue-200','blue-300','blue-400',
      'green-300','green-400','green-500','gold-300','gold-400','gold-500',
      'magenta-200','magenta-300','magenta-400'],
  }, slots: ['startIcon', 'endIcon'],
     // Runtime-only exclusions: DtBadge logs these as console errors; neither
     // appears in BadgeConstants.js, so the cross-product has to be told.
     // Runtime-only exclusions. NONE appear in BadgeConstants.js — they exist only
     // as console.error guards in Badge.vue, so the cross-product must be told.
     invalid: [{ type: 'ai', kind: 'count' }],
     invalidFn: c =>
       (c.subtle === true && c.type !== 'bulletin') ||
       // validateDecorationPropCombination(): decoration requires kind 'label'
       // AND type 'default', and cannot coexist with startIcon/endIcon.
       (c.decoration !== '' && (c.kind !== 'label' || c.type !== 'default')),
     slotsFor: c => (c.decoration !== '' ? [] : ['startIcon', 'endIcon']) },
  link: { component: 'DtLink', label: 'Link', axes: {
    tone: ['', 'critical', 'warning', 'positive', 'info', 'muted', 'mention'],
    inverted: [false, true],
    underline: [true, false],
  }, extraProps: { href: '#' } },
  toggle: { component: 'DtToggle', label: 'Toggle', axes: {
    size: [200, 300], modelValue: [false, true, 'mixed'], disabled: [false, true],
  }},
  chip: { component: 'DtChip', label: 'Chip', axes: {
    size: [100, 200, 300], interactive: [false, true], disabled: [false, true], showClose: [true, false],
  }},
};

// ── reverse token index: resolved value -> candidate token names ────────────
const figma = JSON.parse(readFileSync('/tmp/dtv4.json', 'utf8')).meta;
const colls = figma.variableCollections;
function resolvedValue(v, depth = 0) {
  if (depth > 8) return null;
  const val = v.valuesByMode[colls[v.variableCollectionId].defaultModeId];
  if (val && val.type === 'VARIABLE_ALIAS') {
    const t = Object.values(figma.variables).find(x => x.id === val.id);
    return t ? resolvedValue(t, depth + 1) : null;
  }
  return val;
}
const colorKey = c => [c.r, c.g, c.b, c.a ?? 1].map(x => Math.round(x * 1000)).join(':');
const byColor = new Map(), byNumber = new Map();
for (const v of Object.values(figma.variables)) {
  const val = resolvedValue(v);
  if (val == null) continue;
  if (typeof val === 'object' && 'r' in val) {
    const k = colorKey(val);
    (byColor.get(k) || byColor.set(k, []).get(k)).push(v.name);
  } else if (typeof val === 'number') {
    (byNumber.get(val) || byNumber.set(val, []).get(val)).push(v.name);
  }
}

// Prefer the token whose name matches the property's semantic family, and
// semantic tokens over raw primitives. Ambiguity is real — several tokens share
// a value — so record every candidate and flag when the choice was not obvious.
const PREFER = {
  background: [/\/(background|surface)\//, /^color\//],
  textColor: [/\/(foreground|text)\//, /^color\//],
  borderColor: [/\/border\//, /^color\//],
  cornerRadius: [/radius/],
  strokeWeight: [/border/, /^size\//],
  paddingTop: [/^spacing\//, /^space\//, /^size\//],
  paddingRight: [/^spacing\//, /^space\//, /^size\//],
  paddingBottom: [/^spacing\//, /^space\//, /^size\//],
  paddingLeft: [/^spacing\//, /^space\//, /^size\//],
  itemSpacing: [/^spacing\//, /^space\//, /gap/],
  width: [/^size\//, /^layout\//], height: [/^size\//, /^layout\//],
  minWidth: [/^size\//, /^layout\//], minHeight: [/^size\//, /^layout\//],
  fontSize: [/font\/size/], fontWeight: [/font\/weight/],
};
function tokenFor(prop, value, isColor) {
  let cands = isColor ? (byColor.get(colorKey(value)) || []) : (byNumber.get(value) || []);
  if (!cands.length) return null;
  // Values collide across the token set, so a plain value->name lookup happily
  // returns a semantically wrong token with the right colour. Two guards:
  //  - drop `theme/*` (brand-theme scoped) unless nothing else matches. Without
  //    this, --dt-color-black-400 resolves to theme/presence/color/background/offline.
  //  - prefer component-scoped names over generic ones for that component.
  const nonTheme = cands.filter(n => !n.startsWith('theme/'));
  if (nonTheme.length) cands = nonTheme;
  for (const re of (PREFER[prop] || [])) {
    const hit = cands.filter(n => re.test(n));
    if (hit.length) return { token: hit.sort((a, b) => a.length - b.length)[0], candidates: cands.length, confident: true };
  }
  return { token: cands.sort((a, b) => a.length - b.length)[0], candidates: cands.length, confident: false };
}

const toRgb = culori.converter('rgb');
const parseCol = s => { const c = culori.parse(s); if (!c) return null; const r = toRgb(c);
  return { r: r.r, g: r.g, b: r.b, a: r.alpha ?? 1 }; };
const px = s => (typeof s === 'string' && s.endsWith('px') ? parseFloat(s) : null);

const COLOR_PROPS = { backgroundColor: 'background', color: 'textColor', borderTopColor: 'borderColor' };
const NUM_PROPS = { borderTopWidth: 'strokeWeight', borderTopLeftRadius: 'cornerRadius',
  paddingTop: 'paddingTop', paddingRight: 'paddingRight', paddingBottom: 'paddingBottom',
  paddingLeft: 'paddingLeft', columnGap: 'itemSpacing', fontSize: 'fontSize' };

/**
 * Turn one DOM node into a Figma-shaped spec, binding what it can.
 *
 * Only record a property the node ACTUALLY paints. getComputedStyle reports
 * inherited and default values on every node — borderTopColor defaults to
 * currentColor even at zero width, and color/fontSize inherit everywhere — so
 * reading them blindly binds text colour onto wrapper spans and <path> elements.
 */
const CSS_INDEX = buildIndex();
let provFromCss = 0, provFromValue = 0, provNone = 0;

/**
 * Provenance comes from the CSS, which NAMES the token. A value reverse-lookup is
 * only a fallback: values collide across the token set, so it returns the right
 * colour under the wrong name (--dt-color-black-400 -> theme/presence/...offline)
 * and a value-comparing verifier passes it green.
 */
function specFor(node, inheritedLocals = {}, state = null) {
  const s = node.style, out = { props: {}, unbound: {} };
  const hasBorder = (px(s.borderTopWidth) || 0) > 0;
  const hasText = !!node.text;

  const declared = resolveNode(CSS_INDEX, node.classes, state, inheritedLocals);
  const asFigmaName = t => t.replace(/^--dt-/, '').split('-').join('/');

  const skip = prop =>
    (['borderColor'].includes(prop) && !hasBorder) ||
    (['strokeWeight'].includes(prop) && !hasBorder) ||
    (['textColor', 'fontSize', 'fontWeight'].includes(prop) && !hasText);

  const bind = (prop, value, isColor) => {
    const dt = declared.tokens[prop];
    if (dt) { out.props[prop] = { token: asFigmaName(dt), source: 'css', confident: true }; provFromCss++; return; }
    const t = tokenFor(prop, value, isColor);
    if (t) { out.props[prop] = { ...t, source: 'value' }; provFromValue++; return; }
    out.unbound[prop] = value; provNone++;
  };

  for (const [css, prop] of Object.entries(COLOR_PROPS)) {
    if (skip(prop)) continue;
    const c = parseCol(s[css]);
    if (!c) continue;
    if ((c.a ?? 1) < 0.005) { out.unbound[prop] = 'transparent'; continue; }
    bind(prop, c, true);
  }
  for (const [css, prop] of Object.entries(NUM_PROPS)) {
    if (skip(prop)) continue;
    const n = px(s[css]);
    if (n == null || n === 0) continue;
    bind(prop, n, false);
  }
  // Dialtone paints some "borders" as inset box-shadows (.d-badge--outlined is
  // `box-shadow: 0 0 0 1px <colour> inset`), which is an INNER_SHADOW in Figma,
  // not a stroke. Reading only border-* misses them entirely.
  if (s.boxShadow && s.boxShadow !== 'none') {
    const inset = /\binset\b/.test(s.boxShadow);
    const col = parseCol((s.boxShadow.match(/(oklch\([^)]*\)|oklab\([^)]*\)|rgba?\([^)]*\)|#[0-9a-f]{3,8})/i) || [])[0]);
    const spread = (s.boxShadow.match(/(-?[\d.]+)px/g) || []).map(parseFloat);
    out.shadow = { inset, color: col, offsets: spread.slice(0, 4), raw: s.boxShadow.slice(0, 120) };
    if (col) { const t = tokenFor('borderColor', col, true); if (t) out.shadow.token = t.token; }
  }

  // a nested component announces itself by its root class — instance swap, not a flat frame
  const nested = node.classes.find(c => /^d-(btn|icon|avatar|badge|chip|link|toggle)$/.test(c));
  return {
    tag: node.tag, classes: node.classes, text: node.text, box: node.box,
    layout: { display: s.display, direction: s.flexDirection, align: s.alignItems, justify: s.justifyContent },
    nestedComponent: nested || null,
    ...out,
    // pass this node's locals down: Dialtone declares a local on the block and
    // consumes it on a child, so a child resolved in isolation sees nothing
    children: nested === 'd-icon' ? [] : node.children.map(c => specFor(c, declared.locals, state)),
  };
}

// ── run ─────────────────────────────────────────────────────────────────────
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(COMPONENTS);
const server = await createServer({ root: HARNESS, configFile: HARNESS + 'vite.config.js', server: { port: 0 }, logLevel: 'error' });
await server.listen();
const port = server.httpServer.address().port;
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof window.__anatomy === 'function', null, { timeout: 30000 });

// Merge with any previous run — writing only the requested components silently
// discarded the rest, which cost a re-extraction.
const OUT_PATH = new URL('./anatomy.json', import.meta.url).pathname;
let out = {};
try { out = JSON.parse(readFileSync(OUT_PATH, 'utf8')); } catch {}
for (const name of names) {
  const cfg = COMPONENTS[name];
  const axisNames = Object.keys(cfg.axes);
  const combos = axisNames.reduce((acc, a) =>
    acc.flatMap(prev => cfg.axes[a].map(v => ({ ...prev, [a]: v }))), [{}]);

  const variants = [];
  for (const combo of combos) {
    if ((cfg.invalid || []).some(inv => Object.entries(inv).every(([k, v]) => combo[k] === v))) continue;
    if (cfg.invalidFn && cfg.invalidFn(combo)) continue;
    // Render with EVERY slot filled: that tree contains every node the component
    // can produce. Slot-conditional nodes are then tagged so the builder can expose
    // them as boolean component properties instead of multiplying the variant count.
    const all = cfg.slotsFor ? cfg.slotsFor(combo) : (cfg.slots || []);
    await page.evaluate(([c, p, o]) => window.__setProps(c, p, o),
      [cfg.component, { ...cfg.extraProps, ...combo }, { label: cfg.label, slots: all }]);
    const full = await page.evaluate(() => window.__anatomy());
    if (!full) { variants.push({ ...combo, error: 'did not render' }); continue; }

    let bare = null;
    if (all.length) {
      await page.evaluate(([c, p, o]) => window.__setProps(c, p, o),
        [cfg.component, { ...cfg.extraProps, ...combo }, { label: cfg.label, slots: [] }]);
      bare = await page.evaluate(() => window.__anatomy());
    }
    const bareKeys = new Set();
    if (bare) (function collect (n) { bareKeys.add(n.classes.join('.') || n.tag); (n.children || []).forEach(collect); })(bare);

    const tree = specFor(full);
    (function tag (n) {
      const key = n.classes.join('.') || n.tag;
      if (bare && !bareKeys.has(key)) {
        const m = key.match(/icon-(left|right|top|bottom)|icon--(left|right|top|bottom)/);
        const map = { left: 'startIcon', right: 'endIcon', top: 'blockStartIcon', bottom: 'blockEndIcon' };
        n.conditionalOn = map[(m && (m[1] || m[2])) || ''] || 'slot';
      }
      (n.children || []).forEach(tag);
    })(tree);
    variants.push({ ...combo, tree });
  }
  out[name] = { component: cfg.component, axes: cfg.axes, variants };

  const count = n => 1 + (n.children || []).reduce((a, c) => a + count(c), 0);
  const bound = n => Object.keys(n.props).length + (n.children || []).reduce((a, c) => a + bound(c), 0);
  const unb = n => Object.keys(n.unbound).length + (n.children || []).reduce((a, c) => a + unb(c), 0);
  const shaky = n => Object.values(n.props).filter(p => !p.confident).length + (n.children || []).reduce((a, c) => a + shaky(c), 0);
  const nest = n => (n.nestedComponent && n.depth !== 0 ? 1 : 0) + (n.children || []).reduce((a, c) => a + nest(c), 0);
  const t0 = variants.find(v => v.tree)?.tree;
  console.log(`${name.padEnd(7)} ${String(variants.length).padStart(3)} variants | ${t0 ? count(t0) : 0} nodes/variant | bound ${variants.reduce((a, v) => a + (v.tree ? bound(v.tree) : 0), 0)} | unbound ${variants.reduce((a, v) => a + (v.tree ? unb(v.tree) : 0), 0)} | low-confidence ${variants.reduce((a, v) => a + (v.tree ? shaky(v.tree) : 0), 0)}`);
}

await browser.close(); await server.close();
writeFileSync(new URL('./anatomy.json', import.meta.url).pathname, JSON.stringify(out));
console.log('\nwrote anatomy.json');
