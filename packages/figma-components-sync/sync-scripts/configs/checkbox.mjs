/**
 * DtCheckbox. Axes are the prop API (Checkbox.vue plus the InputMixin, CheckableMixin and MessagesMixin it mixes
 * in), never CheckboxConstants.js: that file maps validation states to CSS modifiers, and those modifiers have
 * no rule in the stylesheet. Validation shows ONLY through the message row, so `message` is the axis and the row
 * is an instance of DtValidationMessages (see validation-messages-swap.mjs).
 *
 * The root is a bare <div> that carries nothing but $attrs; the styled, hoverable, focusable element is the
 * inner <input class="d-checkbox"> (`stateTarget`).
 *
 * Left out: `labelSize` and `labelStrength` (pass-through to the label text), `value`, `name` and the model
 * (behaviour), and the validation-state classes (no CSS).
 *
 * The check and dash glyphs are data-URI SVGs whose colour changes with the mode and is baked from the light
 * render; the verifier does not compare the colour of a background-image glyph, so check the dark mode by eye.
 */
import { validationMessagesSwap } from '../validation-messages-swap.mjs';

export default {
  component: 'DtCheckbox', label: 'Checkbox', page: 'Checkbox', family: 'Selection controls',
  snapTokens: true,

  // How the set reads in Dev Mode (see code-connect.mjs).
  codeConnect: {
    source: 'packages/dialtone-vue/components/Checkbox/Checkbox.vue',
  },

  axes: {
    // `checked` is not a prop (it falls through $attrs); the v-model is the prop API.
    modelValue: [false, true],
    // Its own prop, bound to the input's `indeterminate` DOM property: the dash and the check are different pixels.
    indeterminate: [false, true],
    disabled: [false, true],
    showLabel: [true, false],
    // Presence of the description copy, not its text: it adds a second text node in the messages block.
    description: [false, true],
    message: ['none', 'critical', 'warning', 'positive', 'info'],
    // No `active`: radio-checkbox.less has no :active rule for .d-checkbox.
    state: ['default', 'hover', 'focus'],
  },
  invalid: c => {
    // The indeterminate rule is later and equal in specificity, so indeterminate + checked is indeterminate.
    if (c.indeterminate && c.modelValue) return true;
    // Hover is `:not(:disabled):hover` and a disabled input cannot take focus.
    if (c.disabled && c.state !== 'default') return true;
    // Hover only changes the border colour, and :checked / :indeterminate declare `border: 0`.
    if (c.state === 'hover' && (c.modelValue || c.indeterminate)) return true;
    return false;
  },
  variantName: c => `modelValue=${c.modelValue}, indeterminate=${c.indeterminate}, disabled=${c.disabled}, `
    + `showLabel=${c.showLabel}, description=${c.description}, message=${c.message}, state=${c.state}`,
  props: c => ({
    // The harness fills the default slot; this keeps an accessible name when the label is hidden.
    label: 'Checkbox',
    modelValue: c.modelValue,
    indeterminate: c.indeterminate,
    disabled: c.disabled,
    showLabel: c.showLabel,
    description: c.description ? 'Description' : '',
    messages: c.message === 'none' ? [] : [{ message: 'Validation message', type: c.message }],
  }),
  // The message row is an instance of DtValidationMessages (build that set first).
  anatomySwap: validationMessagesSwap,
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
  stateTarget: '.d-checkbox',
};
