/**
 * DtInput as the multi-line control: `type="textarea"`. Its own set because the element differs:
 * a <textarea> has a minimum block size per size, an asymmetric end corner, a top-aligned start
 * icon and an absolutely placed end icon, none of which the single-line control has.
 *
 * No icon axes: no story combines an icon with a textarea. Everything else follows `input.mjs`,
 * including why the state and validation axes are one reachability rule and why the wrapper, not
 * the control, is the state target.
 */
export default {
  component: 'DtInput', label: '', page: 'InputTextarea', family: 'Text fields',
  snapTokens: true,
  flexLayout: true,
  // `min-block-size` is 40 at size 100 (`calc(layout-75 - spacing-100)`, no token) and a spacing or
  // layout token elsewhere (80, 12, 14, 48), none of which belongs on the layout scale it would snap
  // to: snapping moved 40 to 48 and made the control 8px too tall. It is left exact.
  noSnap: ['minHeight'],

  axes: {
    size: [100, 200, 300, 400, 500],
    state: ['default', 'hover', 'focus', 'disabled'],
    validation: ['none', 'critical', 'warning', 'positive'],
    showLabel: [true, false],
    showDescription: [false, true],
  },

  invalid: c => c.state !== 'default' && c.validation !== 'none',

  variantName: c => `size=${c.size}, state=${c.state}, validation=${c.validation}, `
    + `showLabel=${c.showLabel}, showDescription=${c.showDescription}`,

  props: c => ({
    type: 'textarea',
    size: Number(c.size),
    disabled: c.state === 'disabled',
    label: 'Label',
    showLabel: c.showLabel,
    description: c.showDescription ? 'Description' : '',
    modelValue: 'Value',
    messages: c.validation === 'none' ? [] : [{ message: 'Validation message', type: c.validation }],
  }),

  textProps: { Label: 'Label', Description: 'Description', Value: 'Value' },

  stateTarget: '.d-input__wrapper',
  pseudo: c => (c.state === 'hover' ? ['hover']
    : c.state === 'focus' ? ['focus', 'focus-within'] : []),
};
