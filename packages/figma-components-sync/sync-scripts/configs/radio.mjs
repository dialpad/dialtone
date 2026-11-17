/**
 * DtRadio. Axes are the prop API (Radio.vue plus InputMixin, CheckableMixin, GroupableMixin and MessagesMixin),
 * never RadioConstants.js (its keys are CSS modifiers that have no rule). Validation shows ONLY through the
 * message row, so `message` is the axis and the row is an instance of DtValidationMessages
 * (see validation-messages-swap.mjs).
 *
 * Excluded, each measured earlier rather than reasoned about:
 *   - `validationState`: appends a class with no CSS rule; renders as the default.
 *   - `indeterminate`: declared by the mixin, never bound by Radio.vue and no rule exists; renders as the default.
 *   - `showMessages`: identical to the default; the live-region container renders at zero height regardless.
 *   - `labelSize` (100 to 400): changes the label's margin and font size, but is a pass-through to the label text
 *     and would multiply the set by four. `labelStrength`: a pass-through to the text style.
 *   - label, name, value, description text: copy and identity, not variants.
 *
 * Deliberately NOT excluded: checked + hover. `.d-radio:checked` keeps a transparent 1px border and
 * `.d-radio:not(:disabled):hover` outranks it, so a checked radio gains a visible ring on hover (measured), unlike
 * the checkbox. Focus uses an `outline` as well as an inset shadow; the verifier exempts outlines, so a checked
 * radio's focus ring is not compared and should be looked at in Figma.
 */
import { validationMessagesSwap } from '../validation-messages-swap.mjs';

export default {
  component: 'DtRadio', label: 'Radio', page: 'Radio', family: 'Selection controls',
  snapTokens: true,

  // How the set reads in Dev Mode (see code-connect.mjs).
  codeConnect: {
    source: 'packages/dialtone-vue/components/Radio/Radio.vue',
  },

  axes: {
    modelValue: [false, true],
    disabled: [false, true],
    showLabel: [true, false],
    description: [false, true],
    message: ['none', 'critical', 'warning', 'positive', 'info'],
    // No `active`: `.d-radio` has no :active rule.
    state: ['default', 'hover', 'focus'],
  },
  // Hover is `:not(:disabled):hover` and a disabled input cannot take focus.
  invalid: c => c.disabled === true && c.state !== 'default',
  variantName: c => `modelValue=${c.modelValue}, disabled=${c.disabled}, showLabel=${c.showLabel}, `
    + `description=${c.description}, message=${c.message}, state=${c.state}`,
  props: c => ({
    name: 'radio-group',
    value: 'value',
    // The harness fills the default slot; this keeps an accessible name when the label is hidden.
    label: 'Radio',
    modelValue: c.modelValue,
    disabled: c.disabled,
    showLabel: c.showLabel,
    description: c.description ? 'Description' : '',
    messages: c.message === 'none' ? [] : [{ message: 'Validation message', type: c.message }],
  }),
  // The message row is an instance of DtValidationMessages (build that set first).
  anatomySwap: validationMessagesSwap,
  // `:focus` and `:focus-visible` share a rule; the latter matches real keyboard focus.
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
  // The hoverable, focusable element is the <input class="d-radio">, three levels below the root wrapper.
  stateTarget: '.d-radio',
};
