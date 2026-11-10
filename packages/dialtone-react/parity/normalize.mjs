// Canonical HTML for DOM parity (parity.md › DOM parity). Both runs, Vue and React, call capture() on
// their live jsdom document, so the same DOM always serializes to the same string.
// Plain JS on purpose: it runs unchanged under dialtone-vue's Vitest config and dialtone-react's.

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const BOOLEAN = new Set(['disabled', 'readonly', 'required', 'hidden', 'multiple', 'autofocus', 'open', 'novalidate', 'inert']);
// Attributes that can hold id references. aria-label & co. are text, so they're left alone.
const ID_REF_ATTRS = new Set(['id', 'for', 'href', 'xlink:href', 'headers', 'list', 'form', 'style', 'aria-activedescendant',
  'aria-controls', 'aria-describedby', 'aria-details', 'aria-errormessage', 'aria-flowto', 'aria-labelledby', 'aria-owns']);
const holdsIdRefs = name => ID_REF_ATTRS.has(name) || name.startsWith('data-') || /^(fill|stroke|clip-path|mask|filter|marker-\w+)$/.test(name);
// Attributes whose whole value is a list of id references, so a reference with no element can be told apart.
const REF_LIST_ATTRS = new Set(['for', 'headers', 'list', 'form', 'aria-activedescendant', 'aria-controls', 'aria-describedby',
  'aria-details', 'aria-errormessage', 'aria-flowto', 'aria-labelledby', 'aria-owns']);

/** The mount container each side renders into; unwrapped from the capture. */
export const ROOT_ID = 'parity-root';

// What id generators produce: Vue's getUniqueString (a prefix plus a module-level counter: dt12,
// DtPopover__anchor3) and React's useId (:r0: in 18, «r0» in 19.0–19.1, _r_0_ from 19.2). Components build ids
// from them (`listbox-${useId()}`, `${id}-panel`), so a token counts as generated when a React marker appears
// anywhere in it, or when one of its dash-separated parts is a Vue counter id. Only these, and values seen to change
// between two renders, are canonicalized when nothing has them as an id. The React side renders once, so it can't
// rely on the second check. Any other dangling reference is compared literally, so a port that points
// aria-controls at the wrong name fails.
const VUE_COUNTER_ID = /^(?:dt|Dt[A-Za-z]+__[A-Za-z]+)\d+$/;
const REACT_ID_MARKER = /:[rR]\w*:|«[rR]\w*»|_[rR]_\w*_/;
export const looksGenerated = token => REACT_ID_MARKER.test(token) || token.split('-').some(part => VUE_COUNTER_ID.test(part));

const unwrapRoot = node => node.nodeType === 1 && (node.id === ROOT_ID || node.hasAttribute('data-v-app'))
  ? [...node.childNodes].flatMap(unwrapRoot)
  : [node];

/**
 * Serializes everything under document.body: the mounted component plus anything it portalled.
 * @param {HTMLElement} body
 * @param {{ keepIds?: Iterable<string>, unstable?: Iterable<string> }} options ids the case passed in, which stay
 *   as they are; dangling references seen to change between two renders, which are canonicalized like generated ones
 */
export function capture (body, options = {}) {
  return normalize([...body.childNodes].flatMap(unwrapRoot), options);
}

/** Canonical HTML for a list of live nodes. */
export function normalize (nodes, { keepIds = [], unstable = [] } = {}) {
  const keep = new Set(keepIds);
  const changed = new Set(unstable);
  const ids = generatedIds(nodes, {
    // Element ids are always canonicalized: the references to them carry the structure.
    id: id => !keep.has(id),
    ref: token => !keep.has(token) && (looksGenerated(token) || changed.has(token)),
  }, counters());
  const rewrite = idRewriter(ids);
  return nodes.map(node => serialize(node, rewrite)).join('');
}

const counters = () => {
  let ids = 0; let refs = 0;
  return { id: () => `id-${++ids}`, ref: () => `ref-${++refs}` };
};

/**
 * Every id an element has and every token of an id-list attribute (aria-controls…) under `nodes`, in document
 * order. Comparing two renders of the same thing tells generated values (a counter moved on) from stable ones.
 * @param {Node[]} nodes
 */
export function idTokens (nodes) {
  const out = [];
  walk(nodes, node => {
    const id = node.getAttribute('id');
    if (id) out.push(id);
    for (const a of refAttributes(node)) out.push(...a.value.split(/\s+/).filter(Boolean));
  });
  return out;
}

/** idTokens for what capture() serializes. */
export const capturedIdTokens = body => idTokens([...body.childNodes].flatMap(unwrapRoot));

/**
 * Names for the ids in one case's slot content. One instance serves every slot and every scope render of the case,
 * so names never repeat when React puts those renders into one DOM, and a raw id seen in two renders (a listbox
 * id the component passes to one slot's scope and another's) gets the same name in both, so links between slots
 * resolve as they do in Vue's real render.
 */
export function slotIdNamer () {
  const names = new Map();
  let n = 0;
  return {
    has: raw => names.has(raw),
    name: raw => {
      if (!names.has(raw)) names.set(raw, `${SLOT_ID_PREFIX}${++n}`);
      return names.get(raw);
    },
  };
}

/** Placeholder names slotIdNamer() gives. The React side binds these to the ids its own render passes in scopes. */
export const SLOT_ID_PREFIX = 'slot-id-';
export const SLOT_ID = /^slot-id-\d+$/;

/**
 * Whether a raw id or reference in slot content gets a canonical name. Stable values (written in the template,
 * or derived from one, like DtTab's dt-tab-<id>) stay, so links between slots and from the case's own props keep
 * working; generated ones are renamed, because their raw values come from module-level counters and so depend on
 * what rendered before.
 * @param {{ keep: Set<string>, unstable: Set<string>, namer: ReturnType<typeof slotIdNamer> }} ctx
 */
export const isGeneratedIn = ({ keep, unstable, namer }) => token =>
  !keep.has(token) && (namer.has(token) || looksGenerated(token) || unstable.has(token));

/**
 * HTML for slot content handed to React: Vue's comments and data-v-* removed, generated ids renamed through the
 * case's namer.
 * @param {HTMLElement} element the host the slot rendered into
 * @param {{ keep: Set<string>, unstable: Set<string>, namer: ReturnType<typeof slotIdNamer> }} ctx
 *   ids the case passed in; ids and references that changed between two renders; the case's namer
 */
export function cleanHtml (element, ctx) {
  const nodes = [...element.childNodes];
  const generated = isGeneratedIn(ctx);
  const ids = generatedIds(nodes, { id: generated, ref: generated }, { id: ctx.namer.name, ref: ctx.namer.name });
  const rewrite = idRewriter(ids);
  return nodes.map(node => serialize(node, rewrite, { raw: true })).join('');
}

/** Slot HTML with every id and reference canonicalized locally: for telling whether two renders differ in structure. */
export function maskedHtml (element) {
  const nodes = [...element.childNodes];
  const ids = generatedIds(nodes, { id: () => true, ref: () => true }, counters());
  return nodes.map(node => serialize(node, idRewriter(ids), { raw: true })).join('');
}

const walk = (nodes, visit) => {
  const go = node => { if (node.nodeType === 1) { visit(node); node.childNodes.forEach(go); } };
  nodes.forEach(go);
};

// Attributes are visited by name, not DOM order, which differs between Vue and React.
const refAttributes = node => [...node.attributes].filter(a => REF_LIST_ATTRS.has(a.name))
  .sort((a, b) => (a.name < b.name ? -1 : 1));

// Raw ids → canonical names, by order of appearance: first the ids elements have, then references to ids no
// element has (aria-controls on a closed combobox). `rename` decides which get a name; `name` makes it.
function generatedIds (nodes, rename, name) {
  const ids = new Map();
  walk(nodes, node => {
    const id = node.getAttribute('id');
    if (id && !ids.has(id) && rename.id(id)) ids.set(id, name.id(id));
  });
  const elementIds = new Set();
  walk(nodes, node => { const id = node.getAttribute('id'); if (id) elementIds.add(id); });
  walk(nodes, node => {
    for (const token of refAttributes(node).flatMap(a => a.value.split(/\s+/)).filter(Boolean)) {
      if (!ids.has(token) && !elementIds.has(token) && rename.ref(token)) ids.set(token, name.ref(token));
    }
  });
  return ids;
}

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function idRewriter (ids) {
  if (!ids.size) return v => v;
  const escaped = [...ids.keys()].sort((a, b) => b.length - a.length).map(escapeRe);
  // A whole token, a #fragment or a url(#…) reference; never part of a longer word.
  const re = new RegExp(`(^|[\\s#(,])(${escaped.join('|')})(?=$|[\\s)",;])`, 'g');
  return value => value.replace(re, (_, before, id) => before + ids.get(id));
}

function serialize (node, rewrite, { raw = false } = {}) {
  if (node.nodeType === 3) {
    const text = raw ? node.data : node.data.replace(/\s+/g, ' ').trim();
    return escapeText(text);
  }
  if (node.nodeType !== 1) return ''; // comments (Vue's <!--v-if-->), processing instructions
  const tag = node.localName;
  const attrs = raw ? rawAttributes(node, rewrite) : canonicalAttributes(node, rewrite);
  const open = `<${tag}${attrs.map(([k, v]) => ` ${k}="${escapeAttr(v)}"`).join('')}>`;
  if (VOID.has(tag)) return open;
  const children = tag === 'textarea' && !raw ? '' : [...node.childNodes].map(c => serialize(c, rewrite, { raw })).join('');
  return `${open}${children}</${tag}>`;
}

function rawAttributes (el, rewrite) {
  return [...el.attributes].filter(a => !a.name.startsWith('data-v-'))
    .map(a => [a.name, holdsIdRefs(a.name) ? rewrite(a.value) : a.value]);
}

function canonicalAttributes (el, rewrite) {
  const out = [];
  for (const { name, value } of el.attributes) {
    if (name.startsWith('data-v-')) continue; // Vue's scoped-style and app markers
    let v = value;
    if (name === 'class') v = [...new Set(value.split(/\s+/).filter(Boolean))].sort().join(' ');
    else if (name === 'style') v = canonicalStyle(value);
    else if (BOOLEAN.has(name)) v = '';
    if ((name === 'class' || name === 'style') && !v) continue;
    if (holdsIdRefs(name)) v = rewrite(v);
    out.push([name, v]);
  }
  // Form controls: live state, not attributes (frameworks set value/checked as properties).
  const tag = el.localName;
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'option') {
    const drop = new Set(['value', 'checked', 'selected', 'indeterminate']);
    for (let i = out.length - 1; i >= 0; i--) if (drop.has(out[i][0])) out.splice(i, 1);
    if (tag === 'option') { if (el.selected) out.push(['data-parity-selected', 'true']); }
    else out.push(['data-parity-value', el.value]);
    if (tag === 'input' && (el.type === 'checkbox' || el.type === 'radio')) {
      out.push(['data-parity-checked', String(el.checked)]);
      if (el.indeterminate) out.push(['data-parity-indeterminate', 'true']);
    }
  }
  return out.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}

function canonicalStyle (value) {
  return value.split(';').map(d => d.trim()).filter(Boolean)
    .map(d => { const i = d.indexOf(':'); return `${d.slice(0, i).trim().toLowerCase()}: ${d.slice(i + 1).trim()}`; })
    .sort().map(d => `${d};`).join(' ');
}

const escapeText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** One tag or text per line, indented, so a failed comparison shows a readable line diff. */
export function pretty (html) {
  let depth = 0;
  return html.split(/(<[^>]+>)/).filter(Boolean).map(token => {
    if (token.startsWith('</')) return `${'  '.repeat(Math.max(0, --depth))}${token}`;
    const line = `${'  '.repeat(depth)}${token}`;
    if (token.startsWith('<') && !VOID.has(token.slice(1).split(/[\s>]/)[0])) depth++;
    return line;
  }).join('\n');
}
