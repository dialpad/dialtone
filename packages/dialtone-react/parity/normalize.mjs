// Canonical HTML for DOM parity (parity.md › DOM parity). Both runs, Vue and React, call capture() on
// their live jsdom document, so the same DOM always serializes to the same string.
// Plain JS on purpose: it runs unchanged under dialtone-vue's Vitest config and dialtone-react's.

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const BOOLEAN = new Set(['disabled', 'readonly', 'required', 'hidden', 'multiple', 'autofocus', 'open', 'novalidate', 'inert']);
// Attributes that can hold id references. aria-label & co. are text, so they're left alone.
const ID_REF_ATTRS = new Set(['id', 'for', 'href', 'xlink:href', 'headers', 'list', 'form', 'style', 'aria-activedescendant',
  'aria-controls', 'aria-describedby', 'aria-details', 'aria-errormessage', 'aria-flowto', 'aria-labelledby', 'aria-owns']);
const holdsIdRefs = name => ID_REF_ATTRS.has(name) || name.startsWith('data-') || /^(fill|stroke|clip-path|mask|filter|marker-\w+)$/.test(name);

/** The mount container each side renders into; unwrapped from the capture. */
export const ROOT_ID = 'parity-root';

/**
 * Serializes everything under document.body: the mounted component plus anything it portalled.
 * @param {HTMLElement} body
 * @param {{ keepIds?: string[] }} options ids the case passed in, which stay as they are
 */
export function capture (body, { keepIds = [] } = {}) {
  const unwrap = node => node.nodeType === 1 && (node.id === ROOT_ID || node.hasAttribute('data-v-app'))
    ? [...node.childNodes].flatMap(unwrap)
    : [node];
  return normalize([...body.childNodes].flatMap(unwrap), { keepIds });
}

/** Canonical HTML for a list of live nodes. */
export function normalize (nodes, { keepIds = [] } = {}) {
  const keep = new Set(keepIds);
  const ids = new Map();
  const collect = node => {
    if (node.nodeType !== 1) return;
    const id = node.getAttribute('id');
    if (id && !keep.has(id) && !ids.has(id)) ids.set(id, `id-${ids.size + 1}`);
    node.childNodes.forEach(collect);
  };
  nodes.forEach(collect);
  const rewrite = idRewriter(ids);
  return nodes.map(node => serialize(node, rewrite)).join('');
}

/** HTML for slot content handed to React: Vue's comments and data-v-* removed, ids untouched. */
export function cleanHtml (element) {
  return [...element.childNodes].map(node => serialize(node, v => v, { raw: true })).join('');
}

function idRewriter (ids) {
  if (!ids.size) return v => v;
  const escaped = [...ids.keys()].sort((a, b) => b.length - a.length).map(id => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
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
  const attrs = raw ? rawAttributes(node) : canonicalAttributes(node, rewrite);
  const open = `<${tag}${attrs.map(([k, v]) => ` ${k}="${escapeAttr(v)}"`).join('')}>`;
  if (VOID.has(tag)) return open;
  const children = tag === 'textarea' && !raw ? '' : [...node.childNodes].map(c => serialize(c, rewrite, { raw })).join('');
  return `${open}${children}</${tag}>`;
}

function rawAttributes (el) {
  return [...el.attributes].filter(a => !a.name.startsWith('data-v-')).map(a => [a.name, a.value]);
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
