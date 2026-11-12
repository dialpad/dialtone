/**
 * DtInput and DtInputTextarea render `<dt-validation-messages>` as a child of their own template (there is no
 * slot for it), so the message row is an INSTANCE of the real DtValidationMessages set (built as its own
 * set), not re-measured anatomy. The input's `validation` axis names the message's type.
 *
 * With no validation there is no row: the container is an empty live region (zero height) and stays as it is.
 * DtValidationMessages must be built BEFORE any set that swaps to it.
 */
export const validationMessagesSwap = (c) => (c.validation === 'none' ? null : {
  selector: 'd-validation-message__container',
  component: 'validation_messages',
  variant: { type: c.validation },
});
