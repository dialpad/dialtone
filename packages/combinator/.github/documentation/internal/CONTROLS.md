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

## Explicit slider opt-in

For a property suited to exploration along a numeric scale, add editor metadata:

```js
progress: { slider: { min: 0, max: 100, step: 1, suffix: '%' } },
```

Search the variant files for `slider:` to find current adoptions. Eligibility
requires a scalar number without token metadata. An explicit numeric enum may
opt in only when its documented values cover the complete configured grid,
with no gaps or duplicates. Docgen reports those values as strings, so the
grid check converts them locally; other controls still receive the strings
(known debt, not intended design). Bounds and step must be finite, with a
positive finite span, a positive step no larger than the span, and a maximum
exactly reconstructable on the step grid. The optional suffix is a string.
Named presets replace this settings object shallowly; supply the complete
configuration when overriding it, or set `slider: null` to opt a preset out.
Metadata does not set a prop value.

A sibling prop can supply the maximum instead of a fixed `max`:

```js
activePage: { slider: { min: 1, maxProp: 'totalPages', step: 1 } },
```

`maxProp` reads the current canonical sibling value. It is mutually exclusive
with `max` and does not support enum properties. Missing, nonnumeric, off-grid,
or below-minimum maxima leave the editor noninteractive; a maximum equal to
the minimum shows the sole value without mounting DtSlider. On an explicit
edit to that sibling prop, an out-of-range numeric value on the step grid is
clamped within the new bounds in the same options update. Mounting, preset
selection, Reset, and external synchronization never trigger reconciliation.
The preview is recreated when a declared bound prop changes, so internal
component state follows the canonical values after recovery from invalid bounds.
Pagination uses this for `activePage`; its preview navigation event behavior
is unchanged.

DtSlider is the sole value editor, with its default tooltip readout and native
keyboard operation. It writes numeric values through the existing options
model. Off-grid or invalid parent values show a non-editable readout; they
never mount a normalizing slider or fall back to manual entry. Presets and
Reset can restore a valid value.

The slider uses the shared clearable shell, which handles required, disabled,
locked, and clearable state like other controls. Optional unset values show
Add. Only an explicit Add writes a value: the validated preset/default value,
or the grid minimum. Remove writes undefined to restore the component default;
zero remains a concrete value.

Keep segmented controls for small choice sets and selection controls for
categorical values. Numeric type or choice count alone never opts in.
Datepicker, Skeleton, and MotionText retain their existing controls.

Slider bounds define useful playground ranges, not new restrictions on
component APIs. Pagination's `without page numbers` preset uses 0, which is
off the odd 3–11 grid, so it opts out of the slider. Avatar disables `variant`
when an image or icon slot masks the color.

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
- `slider`: explicitly opted-in scalar scale using DtSlider and its tooltip readout.
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
