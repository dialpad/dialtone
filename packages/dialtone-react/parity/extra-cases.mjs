// Harness-owned cases, for states the Combinator presets don't reach (an open overlay, a checked box), and for components
// with no presets at all (DtCodeblock, DtComboboxMultiSelect, DtResizable).
// Same shape as cases.mjs produces; Vue prop names. Ports never edit this file.
import { STANDARD_ATTRS } from './cases.mjs';

const anchor = { anchor: '<dt-button>Hover me</dt-button>' };
const tip = (name, props, attrs = {}) => ({ name, props: { open: true, message: 'This is a tooltip', ...props }, slots: anchor, attrs });
const box = (name, props) => ({ name, props: { label: 'Checkbox label', ...props }, slots: {}, attrs: {} });
const code = (name, props, attrs = {}) => ({ name, props: { text: 'const answer = 42;', ...props }, slots: {}, attrs });
const resizable = (name, props, attrs = {}) => ({ name, props, slots: {}, attrs });
const multi = (name, props, attrs = {}) => ({ name, props: { label: 'Fruits', ...props }, slots: {}, attrs });

export const EXTRA_CASES = {
  checkbox: [
    box('checked (harness)', { modelValue: true }),
    box('indeterminate (harness)', { indeterminate: true }),
    box('checked and indeterminate (harness)', { modelValue: true, indeterminate: true }),
    box('disabled (harness)', { disabled: true }),
    box('with error messages (harness)', { messages: [{ message: 'This field is required', type: 'critical' }] }),
  ],
  // DtCodeblock has no Combinator presets, so these are all its cases.
  codeblock: [
    code('default (harness)', {}),
    code('bordered (harness)', { bordered: true }),
    code('size 100 (harness)', { size: 100 }),
    code('size 400 (harness)', { size: 400 }),
    code('size xs (harness)', { size: 'xs' }),
    code('size lg (harness)', { size: 'lg' }),
    // No multi-line case: capture() collapses whitespace in every text node, <pre> included, so it would check nothing
    // the default case doesn't. Ported tests cover how text renders.
    code('standard attrs (harness)', {}, STANDARD_ATTRS),
  ],
  // Combinator lists DtComboboxMultiSelect as unsupported. These keep the list closed: open, the popover's DOM differs in
  // DtComboboxWithPopover and DtPopover, which need fixing in those units first.
  'combobox-multi-select': [
    multi('default (harness)', {}),
    multi('selected items (harness)', { selectedItems: ['Apple', 'Banana'] }),
    multi('max selected exceeded (harness)', {
      selectedItems: ['Apple', 'Banana'], maxSelected: 1, maxSelectedMessage: [{ message: 'Pick one fruit', type: 'critical' }],
    }),
    multi('disabled, size 100, chip max width (harness)', { disabled: true, size: 100, selectedItems: ['Apple'], chipMaxWidth: '80px' }),
    multi('hidden label, description (harness)', { showLabel: false, description: 'Pick the ones you like' }),
    multi('standard attrs (harness)', {}, STANDARD_ATTRS),
  ],
  // DtResizable has no Combinator presets either. Slots reach the port as static HTML, not live panels and handles, so
  // these check the container's own DOM; the ported tests cover panels and handles.
  resizable: [
    resizable('default (harness)', {}),
    resizable('column (harness)', { direction: 'column' }),
    resizable('storage key (harness)', { storageKey: 'parity-layout' }),
    resizable('standard attrs (harness)', {}, STANDARD_ATTRS),
  ],
  tooltip: [
    tip('open (harness)', {}),
    tip('open, inverted (harness)', { inverted: true }),
    tip('open, standard attrs (harness)', {}, STANDARD_ATTRS),
    tip('open, contentMode invert (harness)', { contentMode: 'invert' }),
    tip('open, no arrow (harness)', { showArrow: false }),
  ],
};
