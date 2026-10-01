/**
 * DtDescriptionList.
 *
 * Content is an `items` PROP — an array of `{ term, description }` — not a slot, so like
 * DtCodeblock this needed no harness change.
 *
 * Two items rather than one: `gap` and `direction` both describe the space BETWEEN pairs,
 * and a list of one has no between.
 */
const ITEMS = [
  { term: 'Term', description: 'Description' },
  { term: 'Another', description: 'Second description' },
];

export default {
  component: 'DtDescriptionList', label: '', page: 'DescriptionList',
  figmaSetId: '286:5372',

  axes: {
    // The one axis that changes the anatomy rather than a value: row puts each term beside
    // its description, column stacks them.
    direction: ['row', 'column'],
    // Two points on the spacing scale, not all twenty-three. Every value binds the same
    // property to a different token, so the extra variants would demonstrate the scale
    // rather than the component.
    gap: [300, 500],
  },

  props: c => ({ items: ITEMS, direction: c.direction, gap: c.gap }),

  variantName: c => `direction=${c.direction}, gap=${c.gap}`,
};
