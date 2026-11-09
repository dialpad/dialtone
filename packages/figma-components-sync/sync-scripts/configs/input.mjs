/**
 * DtInput as the single-line control: `type="text"`. The multi-line control is its own set,
 * `InputTextarea` (`input_textarea.mjs`), because a <textarea> has its own anatomy (minimum block
 * size, an asymmetric corner, an absolutely placed end icon).
 *
 * Axes are the PROP API (Input.vue's props block plus the messages mixin), not InputConstants.js.
 * Left out on purpose:
 *   - `type` values other than text: password, email, tel, number and search render exactly like
 *     text, and date, time, file and color draw native browser widgets Figma cannot reproduce.
 *   - T-shirt sizes, the `leftIcon` / `rightIcon` slots and the `.d-input--error` / `--success`
 *     classes: all deprecated in code. Sizes here are numeric, the slots are startIcon / endIcon.
 *   - `labelSize`, `labelStrength` and the `*Class` props: overrides and pass-through, not design.
 *   - `validate.length`: an extra description line, not part of the default design.
 *
 * THE BOX IS THE WRAPPER. Border, radius and background are painted by `.d-input__wrapper`; the
 * inner control is transparent with no border and paints text only. So hover and focus are forced
 * on the wrapper, not on the control. Focus is `:focus-within`, not `:focus-visible`.
 *
 * STATE AND VALIDATION ARE ONE REACHABILITY RULE, not a cross product. A validation border is
 * `!important` and beats hover; focus is `!important` and beats the validation border; disabled
 * beats everything. So hover, focus and disabled under a validation kind look the same as plain
 * hover, focus and disabled apart from the message row, and only seven combinations are distinct.
 * There is no `active` state: `input.less` has no :active rule, so it would be pixel-identical to
 * rest. An `info` message draws no border (INPUT_STATE_CLASSES has no `info`), so it is not a
 * validation value here.
 */
export default {
  component: 'DtInput', label: '', page: 'Input', family: 'Text fields',
  // Computed padding and radius at the nearest token (token-snap.mjs).
  snapTokens: true,
  // The wrapper is `display: inline-flex; inline-size: 100%` with the control at `flex: 1`: it
  // fills the row instead of being pinned at the width the harness measured.
  flexLayout: true,

  axes: {
    size: [100, 200, 300, 400, 500],
    // Reachable combinations only; see `invalid`.
    state: ['default', 'hover', 'focus', 'disabled'],
    validation: ['none', 'critical', 'warning', 'positive'],
    // Booleans that gate a real child element, kept as axes so both states are swept (B-11).
    showLabel: [true, false],
    description: [false, true],
    startIcon: [false, true],
    endIcon: [false, true],
  },

  // Hover, focus and disabled are only distinct without a validation kind.
  invalid: c => c.state !== 'default' && c.validation !== 'none',

  variantName: c => `size=${c.size}, state=${c.state}, validation=${c.validation}, `
    + `showLabel=${c.showLabel}, description=${c.description}, `
    + `startIcon=${c.startIcon}, endIcon=${c.endIcon}`,

  props: c => ({
    type: 'text',
    size: Number(c.size),
    disabled: c.state === 'disabled',
    label: 'Label',
    showLabel: c.showLabel,
    description: c.description ? 'Description' : '',
    modelValue: 'Value',
    // A bare string would read as `critical`; the kind is named so each one is explicit.
    messages: c.validation === 'none' ? [] : [{ message: 'Validation message', type: c.validation }],
  }),

  // The icon spans are `display: none` when empty, and filling one changes the width and the
  // inline margin, so each is an axis and the slot is filled only when its axis is on.
  slots: c => [c.startIcon && 'startIcon', c.endIcon && 'endIcon'].filter(Boolean),
  nativeSlots: ['startIcon', 'endIcon'],
  // The label, the description and the control's value are text the harness injects, so each
  // becomes a TEXT property. The value is a synthetic text layer (verify-harness `nativeValueNode`)
  // because a native control paints it from a property, not from a text node.
  textProps: { Label: 'Label', Description: 'Description', Value: 'Value' },

  // The styled, hoverable, focusable box is the wrapper.
  stateTarget: '.d-input__wrapper',
  pseudo: c => (c.state === 'hover' ? ['hover']
    : c.state === 'focus' ? ['focus', 'focus-within'] : []),
};
