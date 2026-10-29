/**
 * Which variant a component should default to in Figma: the one its CODE renders with no props.
 *
 * Shared by the spec builder (which writes the answer into the payload) and the verifier (which
 * checks the built set against it), so the two cannot disagree about what "the default" means.
 *
 * Each axis takes the component's own prop default when it names one (`importance: 'primary'`,
 * `size: 300`), `default` for a `state` axis, and the first value otherwise (slot-presence axes
 * have no prop and start at false). When that exact combination cannot exist, the closest variant
 * that can is used, so a default the component rejects never leaves the set without one.
 */
export function wantedDefaults (cfg, propDefaults) {
  const out = {};
  for (const [axis, vals] of Object.entries(cfg.axes)) {
    const fromProp = propDefaults[axis];
    const hit = fromProp === undefined ? undefined : vals.find(v => String(v) === String(fromProp));
    out[axis] = hit !== undefined ? hit
      : (axis === 'state' && vals.includes('default') ? 'default' : vals[0]);
  }
  return out;
}

/** The combo, from `combos`, that best matches the wanted defaults. */
export function defaultCombo (cfg, combos, propDefaults) {
  const wanted = wantedDefaults(cfg, propDefaults);
  const score = c => Object.keys(wanted).filter(a => String(c[a]) === String(wanted[a])).length;
  return combos.reduce((best, c) => (!best || score(c) > score(best) ? c : best), null);
}

/**
 * Findings for a set whose variant-property DEFAULTS are not the wanted variant's values.
 *
 * Figma's default variant is the TOP-LEFT variant on the canvas, not the first layer, and each
 * variant property's default is read from it. So the truth to compare is the set's own
 * `componentPropertyDefinitions[property].defaultValue`, which is what a designer gets on
 * dropping the component in. (Layer order was compared first and passed on a set whose real
 * default was a different variant.) `wantName` is the wanted variant's name, `Key=Value, ...`.
 *
 * A pure function on purpose: the comparison is made once per SET, outside the per-node walk the
 * negative control perturbs, so the control calls this directly to prove it fires.
 */
export function defaultVariantFindings (wantName, definitions) {
  if (!wantName) return [];
  const out = [];
  for (const part of wantName.split(', ')) {
    const i = part.indexOf('=');
    if (i < 1) continue;
    const key = part.slice(0, i), value = part.slice(i + 1);
    const def = (definitions || {})[key];
    const got = def && def.type === 'VARIANT' ? String(def.defaultValue) : undefined;
    if (got !== value) {
      out.push({ variant: '(set)', path: `set/${key}`, field: 'defaultVariant', expected: `${key}=${value}`, actual: `${key}=${got === undefined ? 'unreadable' : got}` });
    }
  }
  return out;
}
