import { reactive } from 'vue';
import { getComponentInfo } from '@/src/lib/info';
import { shouldExclude } from '@/src/lib/exclusion_rules';
import { buildDependencyMap, shouldHideProp } from '@/src/lib/prop_dependencies';

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
  for (const group of MEMBER_GROUPS) {
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
 * Builds a renderable `{ info, options }` pair for a single variant. Used by the
 * spec sheet to render every variant at once; `options` exposes the same
 * `bindings.get()` shape the renderer expects.
 *
 * @param {object} component - The target component.
 * @param {object} documentation - The dialtone-vue documentation.
 * @param {object} variants - The variant bank for the component.
 * @param {string} variantName - The variant to build.
 * @returns {{ info: object, options: object }} The renderable state.
 */
export function buildVariantState (component, documentation, variants, variantName) {
  const info = buildVariantInfo(component, documentation, variants, variantName);
  const values = getInitialValues(info);

  // `options` is made reactive before the bindings closure captures it, so that
  // `options.props` reads inside `get()` go through Vue's dependency tracking.
  // Without this, onCellEvent mutations would not trigger re-renders in the spec sheet.
  const options = reactive({
    ...values,
    bindings: {
      get () {
        return { ...(options.props ?? {}), ...(options.attributes ?? {}) };
      },
    },
  });

  return { info, options };
}

/**
 * Computes the set of member names that are currently disabled for an info
 * object, given the live prop values. A member is disabled when an exclusion
 * rule hides it, or (props only) a prop-dependency hides it; required members
 * are never disabled. Shared by the single view and the spec sheet so both
 * filter the rendered component identically for a given set of values.
 *
 * @param {object} info - The info object (reads `exclusions`, `props`, `slots`).
 * @param {object} propValues - Map of current prop values ({ propName: value }).
 * @returns {Set<string>} The disabled member names.
 */
export function computeDisabledMembers (info, propValues) {
  const disabled = new Set();
  const exclusions = info.exclusions;
  const depMap = buildDependencyMap(info.props ?? []);

  for (const member of (info.props ?? [])) {
    if (member.required) continue;
    if (shouldExclude(member.name, 'props', exclusions, propValues) ||
      shouldHideProp(member.name, depMap, propValues)) {
      disabled.add(member.name);
    }
  }
  for (const member of (info.slots ?? [])) {
    if (member.required) continue;
    if (shouldExclude(member.name, 'slots', exclusions, propValues)) {
      disabled.add(member.name);
    }
  }
  return disabled;
}
