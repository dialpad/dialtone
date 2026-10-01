/**
 * DtCheckbox.
 *
 * Axes are the PROP API (Checkbox.vue's own props block plus InputMixin /
 * CheckableMixin / MessagesMixin, which it mixes in), never
 * CheckboxConstants.js — that file only maps validation states to CSS modifier
 * names, and those modifiers turn out not to exist (see validationState below).
 *
 * The root element is a bare <div> that carries nothing but $attrs; the styled,
 * hoverable, focusable element is the inner <input class="d-checkbox">.
 */
export default {
  component: 'DtCheckbox', label: 'Checkbox', page: 'Checkbox',
  figmaSetId: '286:7743',

  axes: {
    // The v-model prop. `checked` is NOT a prop — the doc examples pass it as a
    // bare attribute that falls through $attrs onto the native input. modelValue
    // is the prop API, so it is the axis.
    modelValue: [false, true],
    // A second boolean rather than a third value of modelValue: unlike DtToggle,
    // whose modelValue is genuinely tri-state ('mixed'), DtCheckbox exposes
    // indeterminate as its own prop, bound to the input's `indeterminate` DOM
    // property. Measured at 4x DPR the dash glyph and the check glyph are
    // different pixels, so this is a real axis — even though the anatomy walk
    // cannot see it, because `background-image` (which is what paints both
    // glyphs) is not in the harness READ list.
    indeterminate: [false, true],
    disabled: [false, true],
    // Gates the label DtText entirely. Kept as a variant axis rather than a
    // Figma component property so the false case is actually swept (B-11).
    showLabel: [true, false],
    // Presence of description copy, not its text. A string prop, but only
    // empty-vs-non-empty changes the anatomy: it adds a second DtText inside
    // .d-checkbox__messages. Modelled as a boolean for that reason.
    description: [false, true],
    // No 'active': measured, hover and hover+active are the same pixels in every
    // combination. radio-checkbox.less defines no :active rule for .d-checkbox.
    state: ['default', 'hover', 'focus'],
  },

  invalid: c => {
    // `:indeterminate` and `:checked` have equal specificity and the
    // indeterminate rule is later in radio-checkbox.less, so it wins outright:
    // indeterminate+checked is pixel-identical to indeterminate alone. The
    // component agrees — emitValue() forces checked=false out of indeterminate.
    if (c.indeterminate && c.modelValue) return true;
    // The hover rule is `.d-checkbox:not(:disabled):hover`, so it cannot match a
    // disabled input; and a native <input disabled> can never be focused, so
    // :focus-visible is unreachable there too. Forcing either through CDP paints
    // a state no user can reach.
    if (c.disabled && c.state !== 'default') return true;
    // Hover's ONLY effect is border-color, and `:checked` / `:indeterminate` both
    // declare `border: 0` — so on a checked or indeterminate box the hover
    // affordance lands on a collapsed border and paints nothing. Measured: same
    // pixels as rest. Without this the set would carry pixel-identical pairs.
    if (c.state === 'hover' && (c.modelValue || c.indeterminate)) return true;
    return false;
  },

  variantName: c => `modelValue=${c.modelValue}, indeterminate=${c.indeterminate}, disabled=${c.disabled}, showLabel=${c.showLabel}, description=${c.description}, state=${c.state}`,

  props: c => ({
    // The harness fills the default slot, which overrides `{{ label }}`, so this
    // never changes the visible text. It is here because with showLabel=false
    // the label element is dropped and `label` becomes the input's aria-label —
    // without it the rendered checkbox has no accessible name at all.
    label: 'Checkbox',
    modelValue: c.modelValue,
    indeterminate: c.indeterminate,
    disabled: c.disabled,
    showLabel: c.showLabel,
    description: c.description ? 'Description' : '',
  }),

  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),

  // Every state rule is written against `.d-checkbox` — the <input>, nested two
  // levels under the root <div class> that only carries $attrs. Forcing on the
  // root would make `.d-checkbox:not(:disabled):hover` and
  // `.d-checkbox:focus-visible` never match, and the focus ring (an inset
  // box-shadow on the input) would be silently absent from every focus variant.
  stateTarget: '.d-checkbox',

  // No `slots`: the only named slot is `description`, and the harness fills named
  // slots with a DtIconClose — an icon is not description copy. The `description`
  // prop renders the same DtText with real text, so the axis drives that instead.
  // No `slotPass`: DtCheckbox has no icon slots.
  // No `rootClass`: .d-checkbox-group supplies its own gap (--dt-spacing-100)
  // between the box and the label, so it does not depend on a consumer class the
  // way DtToggle does.
};
