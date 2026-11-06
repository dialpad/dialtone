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
  const names = Object.keys(variants).filter(name => name !== 'defaults' && name !== 'exclusions');
  const used = new Set();

  return Object.fromEntries(names.map(name => {
    const clean = getCombinatorPresetSlug(name);
    let slug = clean;
    if (!slug || used.has(slug)) {
      // Keep the first declared preset's existing link when a colliding preset is appended.
      // '~' cannot occur in a clean slug; short hashes avoid embedding whole names in fallbacks.
      let hash = 2166136261;
      for (const character of name) hash = Math.imul(hash ^ character.codePointAt(0), 16777619);
      const fallback = `${clean || 'preset'}~${(hash >>> 0).toString(36)}`;
      slug = fallback;
      let suffix = 2;
      while (used.has(slug)) slug = `${fallback}-${suffix++}`;
    }
    used.add(slug);
    return [name, slug];
  }));
}

export function getCombinatorPresetName (variants, slug) {
  if (typeof slug !== 'string') return 'default';

  return Object.entries(getCombinatorPresetSlugs(variants))
    .find(([, value]) => value === slug.toLowerCase())?.[0] ?? 'default';
}
