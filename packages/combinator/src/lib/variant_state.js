import { getComponentInfo } from '@/src/lib/info';

const MEMBER_GROUPS = ['slots', 'props', 'attributes', 'events'];

/**
 * Shallow-clones member arrays and their objects so that variant overrides
 * never mutate the shared documentation prop.
 *
 * @param {object} info - The info object to clone.
 * @returns {object} A cloned info object.
 */
export function cloneInfoMembers (info) {
  const cloned = { ...info };
  for (const group of ['props', 'slots', 'attributes', 'events']) {
    if (cloned[group]) {
      cloned[group] = cloned[group].map(m => ({ ...m }));
    }
  }
  return cloned;
}

/**
 * Merges variant override data into an info object.
 *
 * @param {object} info - The info object to merge into.
 * @param {object} variantData - The variant data to merge.
 */
export function mergeVariantData (info, variantData) {
  if (!variantData) return;
  Object.entries(variantData).forEach(([memberGroup, members]) => {
    if (memberGroup === 'exclusions') return;
    Object.entries(members).forEach(([memberName, member]) => {
      const infoMember = info[memberGroup]?.find(m => m.name === memberName);
      if (infoMember) Object.assign(infoMember, member);
    });
  });
}

/**
 * Builds the merged info object for a single variant (defaults + named variant).
 *
 * @param {object} component - The target component.
 * @param {object} documentation - The dialtone-vue documentation.
 * @param {object} variants - The variant bank for the component.
 * @param {string} variantName - The variant to build.
 * @returns {object} The merged, cloned info object.
 */
export function buildVariantInfo (component, documentation, variants, variantName) {
  const info = cloneInfoMembers(getComponentInfo(component, documentation));
  mergeVariantData(info, variants?.defaults);
  mergeVariantData(info, variants?.[variantName]);
  info.exclusions = variants?.exclusions ?? [];
  return info;
}

/**
 * Gets the initial values for each member group from an info object.
 *
 * @param {object} info - The info object.
 * @returns {object} A map of member group -> { memberName: initialValue }.
 */
export function getInitialValues (info) {
  const values = {};
  for (const group of MEMBER_GROUPS) {
    for (const member of (info[group] ?? [])) {
      values[group] = values[group] || {};
      values[group][member.name] = member.initialValue;
    }
  }
  return values;
}

/**
 * Builds a renderable `{ info, options }` pair for a single variant, with optional
 * binding overrides applied on top of the variant's authored values. Used by the
 * spec sheet to render every variant at once; `options` exposes the same
 * `bindings.get()` shape the renderer expects.
 *
 * @param {object} component - The target component.
 * @param {object} documentation - The dialtone-vue documentation.
 * @param {object} variants - The variant bank for the component.
 * @param {string} variantName - The variant to build.
 * @param {object} [overrides] - Global binding overrides ({ props, attributes }) applied on top.
 * @returns {{ info: object, options: object }} The renderable state.
 */
export function buildVariantState (component, documentation, variants, variantName, overrides = {}) {
  const info = buildVariantInfo(component, documentation, variants, variantName);
  const values = getInitialValues(info);
  if (overrides.props) values.props = { ...(values.props ?? {}), ...overrides.props };
  if (overrides.attributes) values.attributes = { ...(values.attributes ?? {}), ...overrides.attributes };

  const options = {
    ...values,
    bindings: {
      get () {
        return { ...(values.props ?? {}), ...(values.attributes ?? {}) };
      },
    },
  };

  return { info, options };
}
