const COMPONENT_COMBINATOR_NAME_RE = /^Dt[A-Z][A-Za-z0-9]*$/;

export function getComponentCombinatorName (frontmatter = {}) {
  const componentName = frontmatter?.combinator;

  if (typeof componentName !== 'string') return null;
  return COMPONENT_COMBINATOR_NAME_RE.test(componentName) ? componentName : null;
}

export function getCombinatorPresetSlug (name) {
  return name.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function getCombinatorPresetSlugs (variants) {
  return Object.fromEntries(
    Object.keys(variants)
      .filter(name => name !== 'defaults' && name !== 'exclusions')
      .map(name => [name, getCombinatorPresetSlug(name)]),
  );
}

export function getCombinatorInitialPresetName (variants) {
  const preferred = variants.defaults?.metadata?.initialPreset;
  return typeof preferred === 'string' && preferred && Object.hasOwn(getCombinatorPresetSlugs(variants), preferred)
    ? preferred : 'default';
}

export function getCombinatorPresetName (variants, slug) {
  const initialPreset = getCombinatorInitialPresetName(variants);
  if (typeof slug !== 'string' || !slug) return initialPreset;

  return Object.entries(getCombinatorPresetSlugs(variants))
    .find(([, value]) => value === slug.toLowerCase())?.[0] ?? initialPreset;
}
