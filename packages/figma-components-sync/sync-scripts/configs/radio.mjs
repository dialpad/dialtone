/**
 * DtRadio.
 *
 * Axes come from the PROP API — Radio.vue's own props block plus the four mixins it
 * pulls in (InputMixin, CheckableMixin, GroupableMixin, MessagesMixin) — never from
 * RadioConstants.js, whose keys (`warning`, `critical`, `positive`) are CSS modifier
 * names — and those three modifiers do not exist in the built stylesheet at all.
 *
 * EXCLUDED, each one measured rather than reasoned about (anatomy diffed with the
 * class-name strings stripped, since a class name is not a painted pixel):
 *   validationState — its only effect is appending `d-radio--warning|critical|
 *     positive` to the input. `grep -o '\.d-radio[a-z-]*' dialtone.css` returns only
 *     d-radio, __copy, __input, __label, __messages, --disabled, -group and
 *     -group--disabled: no rule anywhere matches those three modifiers. All four
 *     values render identically to the default. The radio's visible validation
 *     signal comes entirely from `messages`, which is an axis.
 *   indeterminate — CheckableMixin declares it, but Radio.vue never binds it to the
 *     input and no `d-radio--indeterminate` rule exists. Identical to the default.
 *     (DtCheckbox is the opposite case: there it is bound and it paints a dash.)
 *   showMessages — identical to the default both with and without `messages`; the
 *     live-region container renders unconditionally at 0 height. Folded into
 *     `message: 'none'` rather than given an axis that duplicates it.
 *   labelStrength — measurably distinct (it changes font-weight), but it is a
 *     straight pass-through into the nested DtText: `:strength="labelStrength ??
 *     'normal'"`, with no radio-owned CSS keyed on the result. That is what
 *     separates it from labelSize, which `.d-radio__label.d-text-label--sm`
 *     answers with its own margin-block-start. Font weight belongs to the label's
 *     text style in Figma; as an axis it would 4x the set with typographic clones.
 *   label / name / value / description text — copy and identity, not variants.
 *   inputClass, labelClass, descriptionClass, messagesClass, labelChildProps,
 *     descriptionChildProps, messagesChildProps — pure pass-through.
 */
export default {
  component: 'DtRadio', label: 'Radio', page: 'Radio',
  figmaSetId: '286:13384',
  axes: {
    // CheckableMixin's `modelValue` is the checked axis. Plain boolean here, unlike
    // DtToggle's tri-state one: a radio has no indeterminate rendering (see below).
    modelValue: [false, true],
    disabled: [false, true],
    // Gates the label DtText entirely. Kept a variant axis rather than a Figma
    // boolean component property so the verifier actually renders both states —
    // a component property's non-default value is never swept (B-11).
    showLabel: [true, false],
    // Numeric keys only. TEXT_SIZE_MODIFIERS.label also accepts xs/sm/md/lg, which
    // are the deprecated t-shirt aliases of these same four values, so including
    // them would put four pairs of pixel-identical variants in the picker.
    labelSize: [100, 200, 300, 400],
    // Presence of the description DtText, which is a real node in .d-radio__messages
    // and shifts everything below it. Modelled as a boolean because the string's
    // content is copy, not a variant.
    description: [false, true],
    // The validation-message node is absent until `messages` is non-empty, and each
    // type paints a different icon and colour (d-validation-message--<type>). 'none'
    // also covers showMessages=false — measured identical to passing no messages.
    message: ['none', 'info', 'positive', 'warning', 'critical'],
    // No 'active': `.d-radio` has NO :active rule. Measured, :active alone and
    // hover+active are both byte-identical to the states they build on, so an
    // `active` variant would be a duplicate of default and of hover respectively.
    state: ['default', 'hover', 'focus'],
  },
  invalid: c =>
    // The hover rule is `.d-radio:not(:disabled):hover`, so a disabled radio renders
    // identically hovered — measured. A disabled <input> is also not focusable, so
    // neither interactive state is reachable while disabled. (CDP *can* force
    // :focus-visible onto a disabled input and it does repaint, which is exactly the
    // trap: the CSS defines the state but no prop or user can reach it.)
    (c.disabled === true && c.state !== 'default')
    // With the label suppressed there is no DtText for labelSize to size, and all
    // four values render identically — measured. 300 is kept because that is what
    // `labelSize ?? 300` resolves to, so it is the honest representative.
    || (c.showLabel === false && c.labelSize !== 300),
  // Deliberately NOT excluded: checked+hover, even though the twin DtCheckbox has to
  // exclude it. `.d-checkbox:checked` declares `border: 0`, so hover's border-color
  // lands on a collapsed border and paints nothing. `.d-radio:checked` instead
  // declares `border-color: transparent` and keeps the 1px width, and
  // `.d-radio:not(:disabled):hover` (0,3,0) outranks `.d-radio:checked` (0,2,0) —
  // measured, a checked radio gains a visible 1px ring at alpha .5 on hover.
  variantName: c => `modelValue=${c.modelValue}, disabled=${c.disabled}, showLabel=${c.showLabel}, ` +
    `labelSize=${c.labelSize}, description=${c.description}, message=${c.message}, state=${c.state}`,
  props: c => ({
    name: 'radio-group',
    value: 'value',
    // The harness fills the default slot from cfg.label, which wins over this prop.
    // Passed anyway so showLabel=false still produces the aria-label the component
    // requires — not a rendered property, so it cannot perturb a reading.
    label: 'Radio',
    modelValue: c.modelValue,
    disabled: c.disabled,
    showLabel: c.showLabel,
    labelSize: Number(c.labelSize),
    description: c.description ? 'Description' : '',
    messages: c.message === 'none' ? [] : [{ message: 'Validation message', type: c.message }],
  }),
  // `:focus` and `:focus-visible` are declared in the same rule, so they render
  // identically — measured. 'focus-visible' is the one that matches real keyboard
  // focus, so it is what gets forced.
  //
  // CAVEAT for whoever verifies this set: on an UNCHECKED radio, focus adds both an
  // inset box-shadow and `outline: 2px solid var(--dt-color-border-focus)`, and the
  // box-shadow half is compared. On a CHECKED radio the box-shadow is already there
  // at rest, so the outline is the ONLY difference — and verify-components.mjs
  // EXEMPTs outlineColor/outlineWidth on the premise that "Dialtone paints focus with
  // box-shadow; outline is always none". That premise does not hold for .d-radio.
  // The modelValue=true/state=focus variants are therefore real and visibly distinct,
  // but the verifier cannot currently see what makes them distinct.
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
  // The hoverable and focusable element is the <input class="d-radio">, three levels
  // below the root wrapper <div>. Forcing on the root — or on the <label
  // class="d-radio-group"> that looks like the component — leaves every hover and
  // focus variant rendering as default; verified both wrong targets separately.
  stateTarget: '.d-radio',
  // No rootClass: .d-radio-group declares `gap: var(--dt-spacing-100)` itself, and
  // the measured tree confirms it (16px input + 8px gap + 79.47px label = 103.47px
  // wrapper). Unlike DtToggle, this component needs nothing from the consumer.
  // No slots/slotPass either: both of DtRadio's slots (default, description) take
  // text, which the props already supply, and the harness fills slots with an icon.
};
