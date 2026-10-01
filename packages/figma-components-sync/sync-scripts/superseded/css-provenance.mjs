/**
 * CSS-declared token provenance.
 *
 * A value reverse-lookup cannot establish provenance: 1,591 tokens collide heavily
 * on value, so `--dt-color-black-400` happily resolves to
 * `theme/presence/color/background/offline` or `color/surface/strong/inverted`.
 * Both are the right colour and the wrong token, and a value-comparing verifier
 * passes them green.
 *
 * The CSS already names the token —
 *   .d-badge--decorate-black-400 { --badge-decorative-color: var(--dt-color-black-400) }
 *   .d-badge__decorative        { background-color: var(--badge-decorative-color) }
 * — so provenance is a cascade resolution over the node's REAL class list (from the
 * DOM), not a guess from its computed value.
 *
 *   const idx = buildIndex();
 *   resolveNode(idx, ['d-badge', 'd-badge--decorate-black-400'], null)
 *     -> { background: '--dt-color-black-400', ... }
 */
import { readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire('/Users/paulojreis/Development/dialtone/packages/dialtone-tokens/');
const postcss = require('postcss');

const CSS_PATH = '/Users/paulojreis/Development/dialtone/packages/dialtone-css/lib/dist/dialtone.css';

export const PAINTED = {
  color: 'textColor', 'background-color': 'background', background: 'background',
  'border-color': 'borderColor', 'border-top-color': 'borderColor',
  'border-width': 'strokeWeight', 'border-top-width': 'strokeWeight',
  'border-radius': 'cornerRadius', 'border-top-left-radius': 'cornerRadius',
  padding: '@padding', 'padding-inline': 'paddingH', 'padding-block': 'paddingV',
  'padding-top': 'paddingTop', 'padding-right': 'paddingRight',
  'padding-bottom': 'paddingBottom', 'padding-left': 'paddingLeft',
  'padding-inline-start': 'paddingLeft', 'padding-inline-end': 'paddingRight',
  'padding-block-start': 'paddingTop', 'padding-block-end': 'paddingBottom',
  gap: 'itemSpacing', 'column-gap': 'itemSpacing', 'row-gap': 'counterAxisSpacing',
  'inline-size': 'width', 'block-size': 'height',
  'min-inline-size': 'minWidth', 'min-block-size': 'minHeight',
  width: 'width', height: 'height',
  'font-size': 'fontSize', 'font-weight': 'fontWeight', 'line-height': 'lineHeight',
  'letter-spacing': 'letterSpacing', opacity: 'opacity', 'box-shadow': 'effect',
};

const STATES = ['hover', 'active', 'focus-visible', 'focus', 'disabled', 'checked', 'indeterminate'];
const tokenOf = t => {
  if (t.startsWith('.')) return { cls: t.slice(1) };
  if (t.startsWith('[')) {
    const m = t.match(/^\[([a-z-]+)(?:=['"]?([^'"\]]*)['"]?)?\]$/);
    return m ? { attr: m[1], val: m[2] ?? null } : { never: true };
  }
  if (t.startsWith(':')) return { state: STATES.find(s => t === ':' + s) || null, never: !STATES.includes(t.slice(1)) };
  if (/^[a-z][a-z0-9]*$/.test(t)) return { tag: t };
  return { never: true };
};

/**
 * Parse one selector into a per-node matcher.
 *
 * A node is matched by its own class list plus a little context: its tag, its
 * attributes and its children's classes. That is enough to evaluate the three
 * functional pseudo-classes Dialtone leans on:
 *
 *   :where(.a, .b)          zero-specificity disjunction
 *   :is(a, button, [role])  disjunction over tags/classes/attributes
 *   :has(> .d-chip__close)  a predicate on CHILDREN, not on this node
 *
 * Dropping them is not safe: Chip resolves almost nothing without :is and :has,
 * because every interactive rule is `.d-chip__label:is(a, button, …)` and every
 * size local is set by `.d-chip:has(> .d-chip__close--xs)`. Genuinely
 * unresolvable selectors are still counted, never silently ignored.
 */
function parseSel(sel) {
  if (/::/.test(sel)) return { skip: 'pseudo-element' };

  // :has() first — its argument describes children, so it must come out before
  // the combinator test below, which would otherwise read `>` as a descendant.
  const hases = [];
  let work = sel;
  for (const m of [...work.matchAll(/:has\(([^()]*)\)/g)]) {
    const arg = m[1].trim();
    hases.push({
      direct: arg.startsWith('>'),
      any: arg.replace(/^>/, '').split(',').map(t => t.trim()).map(t => {
        const cls = [...t.matchAll(/\.([a-z0-9_-]+)/g)].map(x => x[1]);
        return { classes: cls, state: (t.match(new RegExp(`:(${STATES.join('|')})`)) || [])[1] || null };
      }).filter(x => x.classes.length || x.state),
    });
  }
  work = work.replace(/:has\([^()]*\)/g, '');

  const nots = new Set();
  for (const m of work.matchAll(/:not\(([^()]*)\)/g)) m[1].split(',').forEach(t => nots.add(t.trim()));

  // :where() and :is() are the same disjunction here; they differ only in
  // specificity, which is tracked separately.
  const wheres = [];
  for (const m of work.matchAll(/:(?:where|is)\(([^()]*)\)/g)) {
    wheres.push(m[1].split(',').map(t => tokenOf(t.trim())));
  }
  const isCount = [...work.matchAll(/:is\(/g)].length;

  let bare = work.replace(/:not\([^()]*\)/g, '').replace(/:(?:where|is)\([^()]*\)/g, '');

  // Bare attribute selectors are REQUIREMENTS, not decoration. Ignoring them made
  // `.d-link[disabled]` match every link, so a default link resolved its text
  // colour to --dt-color-link-disabled. Invisible to a value-comparing verifier,
  // because the wrong token still carries a plausible colour.
  const attrReqs = [];
  for (const m of bare.matchAll(/\[([a-z-]+)(?:([~^$*|]?=)['"]?([^'"\]]*)['"]?)?\]/g)) {
    attrReqs.push({ name: m[1], op: m[2] || null, val: m[3] ?? null });
  }
  bare = bare.replace(/\[[^\]]*\]/g, '');

  if (/[\s>+~]/.test(bare.trim())) return { skip: 'descendant' };

  const classes = new Set();
  for (const m of bare.matchAll(/\.([a-z0-9_-]+)/g)) {
    classes.add(m[1]);
    // BEM modifiers are used standalone, so a modifier implies its block
    const b = m[1].match(/^([a-z0-9-]+?)--/);
    if (b) classes.add(b[1]);
  }
  if (!classes.size && !hases.length) return { skip: 'no class' };

  const state = (bare.match(new RegExp(`:(${STATES.join('|')})`)) || [])[1] || null;
  return { classes, state, nots, wheres, hases, attrReqs,
           spec: classes.size + (state ? 1 : 0) + nots.size + isCount + hases.length + attrReqs.length };
}

export function buildIndex (cssPath = CSS_PATH) {
  const root = postcss.parse(readFileSync(cssPath, 'utf8'));
  const rules = [];
  const skipped = { 'pseudo-element': 0, descendant: 0, 'no class': 0 };
  let order = 0;

  root.walkRules(rule => {
    const locals = {}, painted = {};
    rule.walkDecls(d => {
      if (d.prop.startsWith('--')) locals[d.prop] = d.value;
      else if (PAINTED[d.prop]) painted[PAINTED[d.prop]] = d.value;
    });
    if (!Object.keys(locals).length && !Object.keys(painted).length) return;

    for (const sel of rule.selectors) {
      const p = parseSel(sel);
      if (p.skip) { skipped[p.skip]++; continue; }
      rules.push({ ...p, locals, painted, order: order++ });
    }
  });
  return { rules, skipped };
}

/**
 * Does this rule match the node?
 * `ctx` carries what a class list alone cannot answer: the node's tag and
 * attributes (for `:is(a, button, [role='button'])`) and its children's class
 * lists (for `:has(> .x)`).
 */
const matchToken = (t, classes, state, ctx) => {
  if (t.never) return false;
  if (t.cls) return classes.has(t.cls);
  if (t.tag) return ctx.tag === t.tag;
  if (t.attr) return t.val == null ? ctx.attrs[t.attr] != null : ctx.attrs[t.attr] === t.val;
  return t.state === state;
};

const applies = (r, classes, state, ctx) => {
  for (const c of r.classes) if (!classes.has(c)) return false;
  if (r.state && r.state !== state) return false;
  for (const n of r.nots) {
    if (n.startsWith('.') && classes.has(n.slice(1))) return false;
    if (n.startsWith(':') && n.slice(1) === state) return false;
  }
  for (const a of r.attrReqs || []) {
    const have = ctx.attrs[a.name];
    if (have === undefined) return false;
    if (a.val != null && a.op === '=' && String(have) !== a.val) return false;
  }
  for (const g of r.wheres) if (!g.some(t => matchToken(t, classes, state, ctx))) return false;
  for (const h of r.hases || []) {
    const pool = h.direct ? ctx.children : ctx.descendants;
    const hit = h.any.some(want => pool.some(kid =>
      want.classes.every(c => kid.has(c))));
    if (!hit) return false;
  }
  return true;
};

/**
 * Resolve a node's declared token per Figma property.
 * `inherited` carries locals from ancestors: Dialtone declares a local on the block
 * and consumes it on a child, so a child resolved in isolation sees nothing.
 */
export function resolveNode (index, classList, state = null, inherited = {}, ctx = {}) {
  const classes = new Set(classList);
  const nodeCtx = {
    tag: ctx.tag || null,
    attrs: ctx.attrs || {},
    children: (ctx.children || []).map(c => new Set(c)),
    descendants: (ctx.descendants || ctx.children || []).map(c => new Set(c)),
  };
  const locals = { ...inherited }, painted = {};

  for (const r of index.rules
    .filter(r => applies(r, classes, state, nodeCtx))
    .sort((a, b) => a.spec - b.spec || a.order - b.order)) {
    Object.assign(locals, r.locals);
    Object.assign(painted, r.painted);
  }

  // Expand component-local custom properties until only --dt-* remain.
  const expand = (v) => {
    let out = v, guard = 0;
    while (/var\(\s*--(?!dt-)/.test(out) && guard++ < 12) {
      out = out.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,([^)]*))?\)/g, (m, name, fallback) => {
        if (name.startsWith('--dt-')) return m;
        return locals[name] ?? (fallback != null ? fallback : `«${name}»`);
      });
    }
    return out;
  };

  if (painted['@padding']) {
    // Expand BEFORE splitting. `padding: var(--link-padding)` is a single part
    // until the local resolves to `var(--dt-spacing-1) var(--dt-spacing-25)`;
    // splitting first collapsed both axes onto one unresolvable value and every
    // mention-tone padding came back untokened.
    const parts = expand(painted['@padding']).trim().match(/var\([^)]*\)|[^\s]+/g) || [];
    if (parts.length >= 2) { painted.paddingV = parts[0]; painted.paddingH = parts[1]; }
    else if (parts.length === 1) { painted.paddingV = painted.paddingH = parts[0]; }
    delete painted['@padding'];
  }

  const tokens = {}, computed = {};
  for (const [prop, raw] of Object.entries(painted)) {
    const v = expand(raw);
    const dt = [...v.matchAll(/var\(\s*(--dt-[a-z0-9-]+)\s*\)/g)].map(m => m[1]);
    if (dt.length === 1 && /^var\(\s*--dt-[a-z0-9-]+\s*\)$/.test(v.trim())) tokens[prop] = dt[0];
    else computed[prop] = { raw: v.trim(), tokens: dt };
  }
  return { tokens, computed, locals };
}
