/**
 * DtSegmentedControlItem: one segment of a DtSegmentedControl, as its own set so the group can hold
 * three instances of it (the way DtNotice holds a DtButton).
 *
 * An item is a DtButton (kind muted, importance clear), and what makes it a segment comes from the
 * group it sits in, not from its own props: its SIZE and whether it is SELECTED are read from an
 * injected context. Mounted alone it would always be the default size and always unselected, so the
 * context is provided here (`__provide`, see the harness) for each variant.
 *
 * Selected is its own axis, not a state: a selected item is `active`, and it is the one that stays
 * pressed while the others are hovered or focused.
 */
export default {
  component: 'DtSegmentedControlItem', label: 'Item', page: 'SegmentedControlItem', family: 'Navigation',
  snapTokens: true,
  // Its icons are boolean properties and its edge slots are native slots, as on DtButton: it renders
  // a DtButton and takes the same `startIcon`, `endIcon`, `leading` and `trailing` slots.
  merged: true,
  slotPass: ['startIcon', 'endIcon'],
  edgeSlots: { gap: 2 },
  slotSpacingDrift: { paddingLeft: 2, paddingRight: 2, itemSpacing: 2 },

  // How the set reads in Dev Mode (see code-connect.mjs). The item's `value` is what the group's v-model matches,
  // and Figma has no property for it, so it is made from the label; the item hands `{ value, selected }` to the
  // group's template, which writes the selected one as `model-value`.
  codeConnect: {
    source: 'packages/dialtone-vue/components/SegmentedControl/SegmentedControlItem.vue',
    derive: [{ name: 'value', attr: 'value', from: 'Label' }],
    expose: [{ name: 'value' }, { name: 'selected', axis: 'Selected', is: true }],
    icons: [
      { vue: 'startIcon', swap: 'Start Icon Choice', toggle: 'Start Icon' },
      { vue: 'endIcon', swap: 'End Icon Choice', toggle: 'End Icon' },
    ],
    slots: [
      { figma: 'Leading (Slot)', vue: 'leading', when: 'content' },
      { figma: 'Trailing (Slot)', vue: 'trailing', when: 'content' },
    ],
  },
  axes: {
    size: [100, 200, 300, 400, 500],
    selected: [false, true],
    // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
    state: ['default', 'hover', 'focus', 'disabled'],
    // The divider the group draws in the gap before an item (every item but the first). It is part of the
    // item so that an item dropped in after the others brings its own.
    divider: [false, true],
  },
  // The group hides the divider next to a selected, hovered or focused item, so those cannot show one:
  // the same variant as without it.
  invalid: c => c.divider && (c.selected || c.state === 'hover' || c.state === 'focus'),
  variantName: c => `size=${c.size}, selected=${c.selected}, state=${c.state}, divider=${c.divider}`,
  // The item's corners and its divider come from CSS VARIABLES the group element defines
  // (--radius-segmented-control-item, --padding-segmented-control), so alone it measured square. The group's
  // classes go on the surface the item is mounted on; the divider needs the harness's own rule (see
  // verify-harness/segmented-control-divider.css).
  containerClass: c => `d-segmented-control d-segmented-control--${{ 100: 'xs', 200: 'sm', 300: 'md', 400: 'lg', 500: 'xl' }[c.size]}`
    + (c.divider ? ' dt-harness-divider' : ''),
  props: c => ({
    value: 'a',
    ...(c.state === 'disabled' ? { disabled: true } : {}),
    // The group's side of the conversation: what the item injects.
    __provide: {
      SEGMENTED_CONTROL_CONTEXT_KEY: { selected: c.selected ? 'a' : '', disabled: false, size: Number(c.size), labelClass: '' },
    },
  }),
  slots: () => [],
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
};
