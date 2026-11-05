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

/** Ids the case passed in stay as they are; generated ones are canonicalized. */
export const keepIdsOf = c => [c.attrs.id, c.props.id].filter(id => typeof id === 'string');

/** kebab-case unit id → Vue directory and component name: validation-messages → ValidationMessages. */
export const pascal = id => id.replace(/(^|-)([a-z0-9])/g, (_, __, ch) => ch.toUpperCase());
