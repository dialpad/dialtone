/**
 * The variant coordinate space a config describes.
 *
 * ONE COPY, on purpose. This expansion existed verbatim in five files — build-spec,
 * verify-components, audit-provenance, negative-control and visual-compare — which is fine
 * until the config shape changes. Making `invalid` optional then meant editing five places
 * and I edited one: every new component measured and built correctly, and all ten checks
 * died on `cfg.invalid is not a function` after the plugin had already run.
 *
 * The measure and the checks MUST expand the space identically, or they disagree about
 * which variants exist while both look right. That is a good reason for them to share the
 * code rather than each keep a copy of it.
 */

/**
 * @param cfg  a component config
 * @returns    every combination of its axes, minus the ones it calls impossible
 */
export function combosFor (cfg) {
  const combos = Object.keys(cfg.axes).reduce(
    (acc, a) => acc.flatMap(prev => cfg.axes[a].map(v => ({ ...prev, [a]: v }))),
    [{}]);
  // Optional, like `pseudo` and `slotContent`. Most configs have no impossible combinations
  // and should not have to say so.
  return cfg.invalid ? combos.filter(c => !cfg.invalid(c)) : combos;
}

/**
 * The class for the container the harness mounts a component in, or ''.
 *
 * Some variants only make sense on a particular surface (a link for dark backgrounds). The
 * container is NOT part of the measured tree, so the spec holds only the component and its colours;
 * it only gives the browser the surface the colours were designed for. A config declares it as a
 * string or as a function of the combo.
 */
export function containerClassOf (cfg, combo) {
  const c = cfg.containerClass;
  return (typeof c === 'function' ? c(combo) : c) || '';
}
