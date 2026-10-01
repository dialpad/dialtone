/**
 * DtSegmentedControl.
 *
 * Content is DtSegmentedControlItem children in the default slot. Three items, because the
 * middle one is the only one with a neighbour on both sides and that is where the divider
 * and corner treatment differ.
 *
 * `modelValue` selects an item by value, so the selected state is swept through the parent
 * rather than by setting a prop on a child.
 */
/**
 * `label` is the ARIA label; the visible text is the item's default slot, which is why each
 * item carries both. Setting only `label` produced three empty buttons — a 54x14 control
 * with no text in it — and every check passed, because the browser and Figma agreed
 * perfectly about a component rendering nothing. Same shape as B-104.
 */
const ITEMS = [
  { component: 'DtSegmentedControlItem', props: { value: 'one', label: 'One' }, text: 'One' },
  { component: 'DtSegmentedControlItem', props: { value: 'two', label: 'Two' }, text: 'Two' },
  { component: 'DtSegmentedControlItem', props: { value: 'three', label: 'Three' }, text: 'Three' },
];

export default {
  component: 'DtSegmentedControl', label: '', page: 'SegmentedControl',
  figmaSetId: '286:5658',

  axes: {
    size: [100, 200, 300, 400, 500],
    // Changes the layout axis, so the whole anatomy.
    orientation: ['horizontal', 'vertical'],
    // Removes the container's own border and background.
    borderless: [false, true],
  },

  props: c => ({
    id: 'sc',
    ariaLabel: 'Segmented control',
    modelValue: 'one',
    size: c.size,
    orientation: c.orientation,
    borderless: c.borderless,
  }),
  slotContent: () => ({ default: ITEMS }),

  variantName: c => `size=${c.size}, orientation=${c.orientation}, borderless=${c.borderless}`,
};
