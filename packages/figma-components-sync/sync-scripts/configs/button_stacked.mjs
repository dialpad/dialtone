/**
 * DtButton with its icon stacked above or below the label: its own Figma set, `DtButtonStacked`.
 *
 * `blockStartIcon` and `blockEndIcon` put the icon on the block axis (aka above / below the label),
 * and `isVerticalIconLayout()` then flips the button to a column. That changes the layout
 * direction and the spacing, which no component property can do, so it cannot be a toggle on
 * DtButton and is a different design surface, like the circular button.
 *
 * Which end the icon sits at is an axis, `blockIcon`. The icon is always present (a stacked
 * button with no icon is just a button), so it is a swap property per end and not a toggle.
 *
 * NO `loading` AXIS, deliberately. Crossing loading with the rest and with the two ends gives
 * about 1,120 variants, past Figma's 1,000-variant performance warning. Without it the set is
 * 700. The cost is chosen: this set does not show a loading stacked button, which is not a
 * documented case. DtButton and DtButtonIcon cover loading.
 */
export default {
  component: 'DtButton', label: 'Button', page: 'ButtonStacked',
  figmaSetId: '592:18916',
  axes: {
    kind: ['default', 'muted', 'critical', 'positive', 'inverted'],
    importance: ['clear', 'outlined', 'primary'],
    size: [100, 200, 300, 400, 500],
    // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
    state: ['default', 'hover', 'active', 'focus', 'disabled'],
    // Logical names, as .claude/rules/logical-naming.md requires: block-start is above the label
    // and block-end below it in a horizontal writing mode.
    blockIcon: ['blockStart', 'blockEnd'],
  },
  // The component rejects muted/primary for every shape.
  invalid: c => c.kind === 'muted' && c.importance === 'primary',
  variantName: c => `kind=${c.kind}, importance=${c.importance}, size=${c.size}, state=${c.state}, `
    + `blockIcon=${c.blockIcon}`,
  props: c => ({
    kind: c.kind, importance: c.importance, size: Number(c.size),
    ...(c.state === 'active' ? { active: true } : {}),
    ...(c.state === 'disabled' ? { disabled: true } : {}),
  }),
  // The icon, in the slot for its end. Always filled.
  slots: c => [c.blockIcon === 'blockStart' ? 'blockStartIcon' : 'blockEndIcon'],
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
};
