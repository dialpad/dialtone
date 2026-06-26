# Controls

Controls edit one member value. They are reusable Vue components under
`src/components/controls/`, and option-bar logic selects them.

The control map lives in `src/lib/control.js`.

## Control map contract

Each control map entry has:

- `component`: the Vue component to render;
- `default(...)`: the value to use when switching to that control.

Some entries also set `serialize: true`. Those controls receive serialized
values through `serializeControlValue(...)` and emit deserialized values through
`deserializeControlValue(...)`. This is used for the `UNSET` symbol that
represents an intentional `undefined`.

## Control inference

`getControlByMemberType(type, member)` maps docgen types and values to controls:

- mixed boolean enums (`true`, `false`, `mixed`) use `segmented`;
- boolean types use `boolean`;
- enums with up to five values and labels of four characters or fewer use
  `segmented`;
- larger enums use `selection`;
- strings without enum values use `string`;
- other known types use their matching control key.

`getControlByValue(value)` applies when the current value already implies a
better active control. `null`, `undefined`, and `UNSET` map to `null`.

## Current controls

- `base`: fallback string control for unsupported values. It forwards label,
  required, clearable, and default-value behavior to the string control.
- `null`: selects `null` or intentional `undefined`.
- `boolean`, `number`, `string`: primitive controls.
- `array`, `object`, `iterable`, `dynamic`: nested value controls.
- `slot`: edits slot template strings.
- `event`: displays event data when used by latent event-console code.
- `selection`: searchable value selection.
- `segmented`: compact selection for small enums.
- `icon-slot`: searchable Dialtone icon picker for icon-like slots.
- `suggestion`: standalone suggestion input used by the demo app's component
  picker. It delegates input behavior to the string control, including label,
  required, clearable, and `null` value state.

## Icon-slot control

`src/lib/icons.js` detects icon slots by name: `icon`, names ending in
`Icon`, and names ending in `Icons`.

`control_icon_slot.vue` renders a searchable selection of
`@dialpad/dialtone-icons` names. It converts the selected icon into a template
string such as:

```vue
<dt-icon-phone :size="iconSize" />
```

If the slot has a documented `iconSize`, `icon-size`, or `size` binding, the
generated template includes `:size="iconSize"`.

## Raw mode

`option_bar_control.vue` exposes a RAW editor for array and object controls. RAW
mode parses JSON5 with undefined support through `parseDocValue(...)`.

## Add a control

1. Add the control component under `src/components/controls/`.
2. Add a control map entry in `src/lib/control.js`.
3. Update option-bar control selection if the option bar should choose the new
   control automatically.
4. Add or update focused tests for the control and selection logic.

See [OPTION_BAR](OPTION_BAR.md#control-selection) for the option-bar side.
