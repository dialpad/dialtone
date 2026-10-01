/**
 * DtTextList.
 *
 * The first component whose content is a LIST of child components: the default slot wants
 * DtTextListItem children, and an empty list has no geometry worth syncing. That is what
 * the harness `slotContent` array support was added for.
 *
 * NOT SWEPT: `marker` and `markerTone`. Without a custom marker the bullet is a CSS
 * `::marker` pseudo-element, which the harness does not read and Figma has no equivalent
 * for — so every marker variant would arrive pixel-identical to its neighbours and a set of
 * eighteen would describe four. The custom-marker path renders a real
 * `span.d-text-list__item-marker`, which IS measurable; sweeping it needs per-item named
 * slot support, and that is the next thing to add here rather than a reason to fake it now.
 */
const ITEMS = [
  { component: 'DtTextListItem', text: 'First item' },
  { component: 'DtTextListItem', text: 'Second item' },
  { component: 'DtTextListItem', text: 'Third item' },
];

export default {
  component: 'DtTextList', label: '', page: 'TextList',
  figmaSetId: '286:5417',

  axes: {
    // Changes the element (ul vs ol) and the marker the browser draws.
    type: ['unordered', 'ordered'],
    // The gap between items is the component's own painted spacing.
    gap: [100, 300],
  },

  props: c => ({ type: c.type, gap: c.gap }),
  slotContent: () => ({ default: ITEMS }),

  variantName: c => `type=${c.type}, gap=${c.gap}`,
};
