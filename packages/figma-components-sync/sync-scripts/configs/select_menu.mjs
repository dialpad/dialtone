/**
 * DtSelectMenu.
 *
 * Axes are the PROP API (SelectMenu.vue's props block plus the input and messages
 * mixins it composes). The root is a bare wrapper; the styled control is the
 * inner `<select class="d-select">`, which is what `stateTarget` points at.
 *
 * `options` is a DATA prop, not a variant axis: the number of options changes the
 * dropdown's contents, which a closed <select> does not paint. Two options are
 * passed so the control is real, and the count is held constant.
 *
 * WHAT THIS SET DOES NOT SHOW. A native <select> draws its own interior: the option list
 * is a UA popup, and each <option> measures 0x0, so the harness treats the control as an
 * opaque leaf. The options are still passed — Chrome sizes the control to its widest
 * option, so without them every variant would be the wrong width — but what Figma carries
 * is the control BOX, not the list inside it. Same reason configs/input.mjs excludes the
 * native date, time, file and colour inputs outright.
 *
 * The `options` prop feeds the component's DEFAULT slot, which is why it matters here:
 * while the harness passed an empty default slot (`label: ''`), it shadowed that slot and
 * all 80 variants rendered an empty select — narrower than any real one, and passing every
 * check because both sides agreed about it (B-104).
 */
export default {
  component: 'DtSelectMenu', label: '', page: 'SelectMenu',
  figmaSetId: '286:18625',

  axes: {
    size: ['xs', 'sm', 'md', 'lg', 'xl'],
    disabled: [false, true],
    // Gates the label element entirely — a variant axis rather than a Figma
    // BOOLEAN property so the false case is swept (B-11).
    showLabel: [true, false],
    // Presence of description copy: it adds an element, so it is an anatomy
    // change rather than a text change.
    description: [false, true],
    state: ['default', 'hover', 'focus'],
  },

  invalid: c => {
    // A disabled control cannot be hovered (the rule is :not(:disabled):hover)
    // and cannot take focus, so neither state is reachable there.
    if (c.disabled && c.state !== 'default') return true;
    return false;
  },

  props: c => ({
    label: 'Label',
    showLabel: c.showLabel,
    description: c.description ? 'Description copy' : '',
    size: c.size,
    disabled: c.disabled,
    options: [{ label: 'One', value: '1' }, { label: 'Two', value: '2' }],
    modelValue: '1',
  }),

  stateTarget: '.d-select',
  pseudo: c => (c.state === 'hover' ? ['hover']
    : c.state === 'focus' ? ['focus', 'focus-visible'] : []),

  variantName: c => `size=${c.size}, disabled=${c.disabled}, showLabel=${c.showLabel}, `
    + `description=${c.description}, state=${c.state}`,
};
