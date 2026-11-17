/**
 * DtSegmentedControl: the group, holding three DtSegmentedControlItem instances (the way DtNotice holds a
 * DtButton). Each item is declared as an exemplar of the item set (`swapTo`), so a designer edits them from
 * the panel; the group draws its own selection indicator and the dividers between items.
 *
 * Three items, fixed: the count is not a variant axis, and a Figma set can only show one arrangement. Which
 * item is selected is NOT an axis (see SELECTED); the group's own props are. The items' size and selected state are not props of
 * the item: the group tells them (see segmented_control_item.mjs), and here each instance is simply the item
 * variant that matches.
 *
 * Build DtSegmentedControlItem first: its variant ids are what these instances point at.
 */
const ITEMS = ['a', 'b', 'c'];
// Which default item is selected. It is not an axis: the group has any number of items, so a variant list could
// only ever cover the default three. Selection is set on the item instances (see segmented_control_item.mjs),
// which is also where the code keeps it.
const SELECTED = 1;

export default {
  component: 'DtSegmentedControl', label: '', page: 'SegmentedControl', family: 'Navigation',
  snapTokens: true,

  // How the set reads in Dev Mode (see code-connect.mjs). The items go in as the default slot's content, and the
  // selected one, which each item's template reports, becomes `model-value`.
  codeConnect: {
    source: 'packages/dialtone-vue/components/SegmentedControl/SegmentedControl.vue',
    label: false,
    slots: [{ figma: 'Items (Slot)', vue: 'default', when: 'always' }],
    pick: { attr: 'model-value', from: 'value', when: 'selected' },
  },
  axes: {
    orientation: ['horizontal', 'vertical'],
    size: [100, 200, 300, 400, 500],
    showDivider: [true, false],
    borderless: [false, true],
    spread: ['grow', 'evenly'],
  },
  variantName: c => `orientation=${c.orientation}, size=${c.size}, `
    + `showDivider=${c.showDivider}, borderless=${c.borderless}, spread=${c.spread}`,
  props: c => ({
    modelValue: ITEMS[SELECTED - 1],
    orientation: c.orientation,
    size: Number(c.size),
    showDivider: c.showDivider,
    borderless: c.borderless,
    spread: c.spread,
    ariaLabel: 'Options',
  }),
  slots: () => [],
  // Each item is a native slot holding the item instance that matches the variant. As a swap property it would
  // be ONE default across all the variants (every group showing the smallest unselected item), the trap
  // slot-properties.js documents; a slot's default content is per variant.
  nativeSlots: ['default.0', 'default.1', 'default.2'],
  // ...and all three share ONE slot, "Items", so a designer can add or remove items freely: the slot lays
  // them out the way the group did, and each item brings its own divider (see segmented_control_item.mjs).
  slotGroups: { 'default.0': 'items', 'default.1': 'items', 'default.2': 'items' },
  slotLabels: { items: 'Items' },
  slotContent: c => ({
    default: ITEMS.map((value, i) => ({
      component: 'DtSegmentedControlItem',
      props: { value },
      text: 'Item ' + (i + 1),
      swapTo: { component: 'segmented_control_item', name: 'Item ' + (i + 1), variant: {
        size: Number(c.size), selected: SELECTED === i + 1, state: 'default',
        // The group draws a divider before each item but the first, and hides it next to the selected one.
        divider: c.showDivider && i > 0 && SELECTED !== i + 1 && SELECTED !== i,
      } },
    })),
  }),
};
