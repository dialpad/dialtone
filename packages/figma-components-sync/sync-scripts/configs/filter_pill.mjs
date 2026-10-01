/**
 * DtFilterPill.
 *
 * Axes are the PROP API (FilterPill.vue's props block). The pill is a DtButton
 * wearing `.d-filter-pill__primary` at `importance="outlined"`, so the styled and
 * focusable element is that button, not the `.d-filter-pill` root.
 *
 * Deliberately NOT swept:
 *   useDropdown  — pinned false. True renders a POPOVER, and a popover mounts in
 *                  a portal outside `#root`, which is where the harness roots its
 *                  anatomy walk (`#root > *`). An open dropdown is therefore not
 *                  measurable by this pipeline today; sweeping it would silently
 *                  spec the closed pill twice.
 *   startTooltipText / endTooltipText — same reason: a tooltip is a portal.
 *   popover*     — configuration for a thing that is out of scope here.
 *   deferSelection — behaviour on interaction, not a painted state.
 */
export default {
  component: 'DtFilterPill', label: '', page: 'FilterPill',
  figmaSetId: '286:15027',

  axes: {
    disabled: [false, true],
    // A separate axis from `disabled`: readOnly sets aria-disabled without the
    // native disabled attribute, so it is a different selector and potentially
    // a different paint.
    readOnly: [false, true],
    // Gates the clear affordance entirely — a variant axis so the false case is
    // swept rather than hidden behind a BOOLEAN property (B-11).
    showClear: [true, false],
    // `modelValue` is an ARRAY of selected filters, not a boolean — passing a
    // boolean throws `this.filters.filter is not a function` and the render dies.
    // Empty vs non-empty is what drives `isActive` and therefore
    // `.d-filter-pill--selected`, so the axis is modelled as that distinction.
    selected: [false, true],
    state: ['default', 'hover', 'focus'],
  },

  invalid: c => {
    // A disabled DtButton is not hoverable and cannot take focus.
    if (c.disabled && c.state !== 'default') return true;
    return false;
  },

  props: c => ({
    label: 'Filter',
    useDropdown: false,
    disabled: c.disabled,
    readOnly: c.readOnly,
    showClear: c.showClear,
    modelValue: c.selected ? [{ label: 'One', value: '1' }] : [],
  }),

  stateTarget: '.d-filter-pill__primary',
  pseudo: c => (c.state === 'hover' ? ['hover']
    : c.state === 'focus' ? ['focus', 'focus-visible'] : []),

  variantName: c => `disabled=${c.disabled}, readOnly=${c.readOnly}, `
    + `showClear=${c.showClear}, selected=${c.selected}, state=${c.state}`,
};
