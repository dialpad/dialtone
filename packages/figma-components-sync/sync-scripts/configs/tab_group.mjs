/**
 * DtTabGroup.
 *
 * The GROUP, not DtTab on its own. A tab in isolation has no selected sibling, no list
 * border to sit against and no spread behaviour — the things `tabs.less` actually paints
 * live on the group and are only visible with several tabs in it.
 *
 * Three tabs with the first selected: `selected` on the group names a tab by id, so the
 * selected and unselected treatments are both present in every variant rather than being
 * their own axis.
 */
const TABS = [
  { component: 'DtTab', props: { id: 'one', panelId: 'p1' }, text: 'One' },
  { component: 'DtTab', props: { id: 'two', panelId: 'p2' }, text: 'Two' },
  { component: 'DtTab', props: { id: 'three', panelId: 'p3' }, text: 'Three' },
];

export default {
  component: 'DtTabGroup', label: '', page: 'TabGroup',
  figmaSetId: '286:6034',

  axes: {
    size: [100, 200, 300, 400, 500],
    // `none` hugs each tab, `grow` and `equal` distribute the row differently.
    spread: ['none', 'grow', 'equal'],
    // Removes the list's own border, which is a different box.
    borderless: [false, true],
  },

  props: c => ({
    label: 'Tabs',
    selected: 'one',
    size: c.size,
    spread: c.spread,
    borderless: c.borderless,
  }),
  slotContent: () => ({ default: TABS }),

  variantName: c => `size=${c.size}, spread=${c.spread}, borderless=${c.borderless}`,
};
