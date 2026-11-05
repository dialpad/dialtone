// Harness-owned cases, for states the Combinator presets don't reach (an open overlay, a checked box).
// Same shape as cases.mjs produces; Vue prop names. Workers never edit this file.
import { STANDARD_ATTRS } from './cases.mjs';

const anchor = { anchor: '<dt-button>Hover me</dt-button>' };
const tip = (name, props, attrs = {}) => ({ name, props: { open: true, message: 'This is a tooltip', ...props }, slots: anchor, attrs });
const box = (name, props) => ({ name, props: { label: 'Checkbox label', ...props }, slots: {}, attrs: {} });

export const EXTRA_CASES = {
  checkbox: [
    box('checked (harness)', { modelValue: true }),
    box('indeterminate (harness)', { indeterminate: true }),
    box('checked and indeterminate (harness)', { modelValue: true, indeterminate: true }),
    box('disabled (harness)', { disabled: true }),
    box('with error messages (harness)', { messages: [{ message: 'This field is required', type: 'critical' }] }),
  ],
  tooltip: [
    tip('open (harness)', {}),
    tip('open, inverted (harness)', { inverted: true }),
    tip('open, standard attrs (harness)', {}, STANDARD_ATTRS),
    tip('open, contentMode invert (harness)', { contentMode: 'invert' }),
    tip('open, no arrow (harness)', { showArrow: false }),
  ],
};
