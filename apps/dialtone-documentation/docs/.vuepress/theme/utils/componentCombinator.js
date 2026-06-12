const COMPONENT_COMBINATOR_NAME_RE = /^Dt[A-Z][A-Za-z0-9]*$/;

export function getComponentCombinatorName (frontmatter = {}) {
  const componentName = frontmatter?.combinator;

  if (typeof componentName !== 'string') return null;
  return COMPONENT_COMBINATOR_NAME_RE.test(componentName) ? componentName : null;
}
