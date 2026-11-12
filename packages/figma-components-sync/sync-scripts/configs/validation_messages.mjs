/**
 * DtValidationMessages: the message row an input shows under its control, as its own set. DtInput renders it
 * as a child (`<dt-validation-messages>`), and it is used on its own too, so the Figma Input sets hold it
 * rather than a copy of its row.
 *
 * The component takes an ARRAY of `{ message, type }`, one row each, stacked in a column. A set can show one
 * arrangement, so this one draws a single row; a second message is a second instance.
 *
 * Axes are the prop API: `type` is critical, warning, positive or info (the four the component maps to an
 * icon and a colour). The default per-type icon is part of each variant rather than a swap property: as one,
 * a single default would show on all four.
 */
export default {
  component: 'DtValidationMessages', label: '', page: 'ValidationMessages', family: 'Text fields',
  snapTokens: true,

  axes: {
    type: ['critical', 'warning', 'positive', 'info'],
  },
  variantName: c => `type=${c.type}`,
  props: c => ({
    validationMessages: [{ message: 'Validation message', type: c.type }],
  }),
  slots: () => [],
  // The message is text the harness injects, so it becomes a TEXT property.
  textProps: { 'Validation message': 'Message' },
};
