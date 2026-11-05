// Cases for DOM parity (parity.md › DOM parity): every Combinator preset for the unit, plus one standard
// attrs case. Workers never choose cases; a preset that can't run fails the gate unless it's a deviation.

/** Fallthrough attributes every component must route the way its Vue original does. */
export const STANDARD_ATTRS = {
  class: 'parity-class',
  style: 'margin-top: 1px',
  id: 'parity-id',
  'data-qa': 'parity-qa',
  'aria-label': 'Parity label',
};

const initialValues = group => Object.fromEntries(Object.entries(group ?? {})
  .filter(([, member]) => member && typeof member === 'object' && 'initialValue' in member)
  .map(([name, member]) => [name, member.initialValue]));

/** Combinator variants (packages/combinator/src/variants/variants_*.js) → cases. */
export function casesFrom (variants) {
  const defaults = variants.defaults ?? {};
  const cases = Object.entries(variants)
    .filter(([name]) => name !== 'defaults' && name !== 'exclusions')
    .map(([name, preset]) => ({
      name,
      props: { ...initialValues(defaults.props), ...initialValues(preset.props) },
      slots: { ...initialValues(defaults.slots), ...initialValues(preset.slots) },
      attrs: { ...initialValues(defaults.attributes), ...initialValues(preset.attributes) },
    }));
  const base = cases.find(c => c.name === 'default') ?? cases[0];
  if (base) cases.push({ ...base, name: 'standard attrs', attrs: { ...base.attrs, ...STANDARD_ATTRS } });
  return cases;
}

/**
 * Values the case passes in stay literal wherever they turn up as an id or a reference (an id attr, a panelId
 * prop, an aria-controls attr), so a port that drops or alters one fails. Everything else is canonicalized only
 * if it looks generated or changes between renders (normalize.mjs).
 */
export const keepIdsOf = c => [...Object.values(c.attrs), ...Object.values(c.props)]
  .flatMap(v => (Array.isArray(v) ? v : [v])).filter(v => typeof v === 'string').flatMap(v => v.split(/\s+/)).filter(Boolean);

/**
 * A slot scope as JSON-safe data, for the goldens and for matching scopes across Vue and React. Keys are sorted,
 * since the two sides build their scopes independently; functions, elements and cycles become markers.
 */
export function jsonSafe (value, seen = new WeakSet()) {
  if (value?.__v_isRef) return jsonSafe(value.value, seen); // templates read a ref in a scope as its value
  const marker = markerFor(value, seen);
  if (marker !== undefined) return marker;
  if (value === null || typeof value !== 'object') return value;
  seen.add(value);
  const out = Array.isArray(value)
    ? value.map(v => jsonSafe(v ?? null, seen))
    : Object.fromEntries(Object.keys(value).sort().filter(k => value[k] !== undefined)
      .map(k => [k, jsonSafe(value[k], seen)]));
  seen.delete(value); // a cycle is a value inside itself; the same object twice side by side isn't one
  return out;
}

const MARKERS = { function: () => '[function]', symbol: String, bigint: String };
// A Vue vnode, a React element or a DOM node: too big, and not what a slot's output depends on as data.
const isElement = value => Boolean(value.__v_isVNode || value.$$typeof || value.nodeType);

function markerFor (value, seen) {
  if (MARKERS[typeof value]) return MARKERS[typeof value](value);
  if (value === null || typeof value !== 'object') return undefined;
  if (isElement(value)) return '[element]';
  return seen.has(value) ? '[circular]' : undefined;
}

/** Scopes match across Vue and React when these strings are equal. */
export const scopeKey = scope => JSON.stringify(jsonSafe(scope)) ?? '';

const mapStrings = (value, fn) => (typeof value === 'string' ? fn(value)
  : Array.isArray(value) ? value.map(v => mapStrings(v, fn))
    : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, fn)]))
      : value);

/**
 * A recorded scope for the goldens: jsonSafe, with every generated id in it (inputProps' aria-controls, a listbox
 * id) replaced by the case's slot-id name, the same name the slot HTML uses for it. The React side binds each name
 * to whatever its own render passes there (bindScope), so ids can differ but links can't.
 * @param {unknown} scope
 * @param {(token: string) => boolean} generated normalize.mjs isGeneratedIn() for the case
 * @param {{ name: (raw: string) => string }} namer the case's slotIdNamer()
 */
export const canonicalScope = (scope, generated, namer) => mapStrings(jsonSafe(scope),
  s => s.split(/(\s+)/).map(t => (t.trim() && generated(t) ? namer.name(t) : t)).join(''));

/**
 * Matches a scope React passed against a golden one. Equal except where the golden has a slot-id name: there the
 * React value must be a single token, the same one wherever that name recurs and a different one for each name.
 * Returns name → React value, or null when the scopes differ.
 * @param {unknown} scope jsonSafe() of React's scope
 * @param {unknown} golden canonicalScope() of Vue's
 * @param {RegExp} placeholder normalize.mjs SLOT_ID
 */
export function bindScope (scope, golden, placeholder) {
  const bound = new Map();
  const taken = new Set();
  const token = (a, g) => {
    if (!placeholder.test(g)) return a === g;
    if (bound.has(g)) return bound.get(g) === a;
    if (taken.has(a)) return false; // two names, one id: the port merged ids Vue kept apart
    bound.set(g, a); taken.add(a);
    return true;
  };
  const string = (a, g) => {
    if (typeof a !== 'string') return false;
    const as = a.split(/(\s+)/); const gs = g.split(/(\s+)/);
    return as.length === gs.length && gs.every((t, i) => token(as[i], t));
  };
  const object = (a, g) => {
    if (!a || typeof a !== 'object' || Array.isArray(a)) return false;
    const keys = Object.keys(g);
    return Object.keys(a).length === keys.length && keys.every(k => Object.hasOwn(a, k) && match(a[k], g[k]));
  };
  const match = (a, g) => {
    if (typeof g === 'string') return string(a, g);
    if (Array.isArray(g)) return Array.isArray(a) && a.length === g.length && g.every((v, i) => match(a[i], v));
    if (g && typeof g === 'object') return object(a, g);
    return a === g;
  };
  return match(scope, golden) ? bound : null;
}

/** kebab-case unit id → Vue directory and component name: validation-messages → ValidationMessages. */
export const pascal = id => id.replace(/(^|-)([a-z0-9])/g, (_, __, ch) => ch.toUpperCase());
