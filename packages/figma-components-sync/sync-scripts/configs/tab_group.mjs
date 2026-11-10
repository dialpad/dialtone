/**
 * DtTabGroup: the group, holding DtTab instances in one slot, "Tabs" (the way DtSegmentedControl holds its
 * items). Each tab is declared as an exemplar of the tab set (`swapTo`); the group draws its own bottom border
 * and the gap between tabs.
 *
 * Three tabs show by default, but the slot takes any number. Which tab is selected is NOT an axis: it is set
 * on the tab instances (see tab.mjs), which is also where the code reads it. The group's own props are.
 *
 * `outlined` and `orientation` are axes of the tab set too (see tab.mjs), so each tab here is the variant that
 * matches. A vertical group has no spread: `spread` only applies to a horizontal list.
 *
 * Build DtTab first: its variant ids are what these instances point at.
 */
const TABS = ['a', 'b', 'c'];
// Which default tab is selected (1-based).
const SELECTED = 1;

export default {
  component: 'DtTabGroup', label: '', page: 'TabGroup', family: 'Navigation',
  snapTokens: true,

  // How the set reads in Dev Mode (see code-connect.mjs). The tabs go in as the `tabs` slot's content, and the
  // selected one, which each tab's template reports, becomes `selected`.
  codeConnect: {
    source: 'packages/dialtone-vue/components/Tab/TabGroup.vue',
    label: false,
    slots: [{ figma: 'Tabs (Slot)', vue: 'tabs', when: 'always' }],
    pick: { attr: 'selected', from: 'panelId', when: 'selected' },
  },
  axes: {
    size: [100, 200, 300, 400, 500],
    kind: ['default', 'muted'],
    outlined: [false, true],
    orientation: ['horizontal', 'vertical'],
    spread: ['none', 'grow', 'equal'],
    borderless: [false, true],
  },
  invalid: c => c.orientation === 'vertical' && c.spread !== 'none',
  // A spread group fills the space it is given (see verify-harness/tab-list.css); the others hug their tabs.
  containerClass: c => (c.spread !== 'none' && c.orientation !== 'vertical' ? 'dt-harness-tab-spread' : ''),
  variantName: c => `size=${c.size}, kind=${c.kind}, outlined=${c.outlined}, orientation=${c.orientation}, `
    + `spread=${c.spread}, borderless=${c.borderless}`,
  props: c => ({
    selected: TABS[SELECTED - 1],
    size: Number(c.size),
    kind: c.kind,
    outlined: c.outlined,
    orientation: c.orientation,
    spread: c.spread,
    borderless: c.borderless,
    label: 'Tabs',
  }),
  // The tabs are the NAMED slot `tabs`, which the harness only renders when it is listed here (the default slot,
  // as on DtSegmentedControl, needs no entry).
  slots: () => ['tabs'],
  // Each tab is a native slot holding the tab instance that matches the variant (a swap property would be ONE
  // default across all the variants), and all of them share ONE slot so any number can be dropped in.
  nativeSlots: ['tabs.0', 'tabs.1', 'tabs.2'],
  slotGroups: { 'tabs.0': 'tabs', 'tabs.1': 'tabs', 'tabs.2': 'tabs' },
  slotLabels: { tabs: 'Tabs' },
  slotContent: c => ({
    tabs: TABS.map((id, i) => ({
      component: 'DtTab',
      props: { id: 'tab-' + id, panelId: id },
      text: 'Tab ' + (i + 1),
      swapTo: { component: 'tab', name: 'Tab ' + (i + 1), variant: {
        size: Number(c.size), selected: SELECTED === i + 1, kind: c.kind, outlined: c.outlined,
        orientation: c.orientation, state: 'default',
      } },
    })),
  }),
};
