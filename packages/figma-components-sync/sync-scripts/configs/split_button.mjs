/**
 * DtSplitButton: a label button and a chevron button side by side, with a divider drawn by the
 * end half's `::before`.
 *
 * State is ONE axis, and hover and focus are measured on the start half only. The divider reacts
 * to either half (`.d-split-btn:has(:hover)` hides it for clear and muted), and measured, the two
 * halves give identical variants for every importance, so a start/end split would only double
 * the set. Pressing a half is not a state: `active` is `startActive` / `endActive`, a prop for a
 * button that stays pressed, and the end half's is the open dropdown.
 *
 * `showDivider` is not an axis: it only removes the divider of `clear`, and the layer can be
 * hidden by a consumer.
 */
export default {
  component: 'DtSplitButton', label: 'Place call', page: 'SplitButton', family: 'Buttons',
  snapTokens: true,
  // `.d-split-btn` is `align-items: stretch`: the end half fills the start half's height.
  flexLayout: true,
  axes: {
    kind: ['default', 'muted', 'critical', 'positive'],
    importance: ['clear', 'outlined', 'primary'],
    size: [100, 200, 300, 400, 500],
    // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
    state: ['default', 'hover', 'focus', 'disabled'],
  },
  // muted/primary is rejected by the component.
  invalid: c => c.kind === 'muted' && c.importance === 'primary',
  variantName: c => `kind=${c.kind}, importance=${c.importance}, size=${c.size}, state=${c.state}`,
  props: c => ({
    kind: c.kind, importance: c.importance, size: Number(c.size),
    ...(c.state === 'disabled' ? { disabled: true } : {}),
    endAriaLabel: 'More options',
  }),
  slots: () => [],
  stateTarget: '.d-split-btn__start',
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
};
