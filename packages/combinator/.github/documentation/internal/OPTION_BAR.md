# Option bar

The option bar lets users edit the target component's props, slots, and class
members. `DtcCombinator` mounts it unless `blueprint` mode is on.

## Mounted layout

`DtcOptionBar` renders a `DtTabGroup` with up to three tabs:

- Props
- Slots
- Class

The Class tab contains the native `class` attribute and props whose names end in
`Class`. The option bar separates class props from the main Props tab.

The option bar also has a search toggle. Search normalizes member names and
logical aliases, so physical terms such as `left`, `right`, `top`, and `bottom`
can find logical names such as `inlineStart` and `blockEnd`.

## Presets

`DtcCombinator` owns the preset dropdown, not `DtcOptionBar`. The root toolbar
shows it when the `variants` prop has more than one selectable preset. The
dropdown does not show `defaults` and `exclusions` as preset options.

Selecting a preset resets `options` from the active variant metadata. Manual
edits clear the selected preset label and show the state as custom.

## Member groups

Each tab renders `DtcOptionBarMemberGroup` for the relevant member list. Member
groups receive:

- members from `info`;
- current values from `options`;
- exclusion rules from `info.exclusions`;
- current prop values;
- current slot values;
- a control selector function.

The member group sorts controls so common props and slots appear first. It also
groups inferred dependent props after their parent, except class props stay in
the trailing class tier.

## Control selection

Props and attributes use `getBindingControls(...)`, which maps member types and
valid values to controls through `src/lib/control.js`.

Slots use:

- `icon-slot` when `isIconSlot(member)` is true;
- `slot` for all other slots.

See [CONTROLS](CONTROLS.md).

## Exclusions and dependencies

The option bar reads exclusion rules through `src/lib/exclusion_rules.js`.
Rules can disable a control, hide a control through the compatibility path,
clear a value, or disable specific enum values.

`src/lib/prop_dependencies.js` infers prop dependencies separately.
When a child prop depends on a falsy parent prop, the option bar disables the
child control.

The option bar disables slot-class props when their matching slot is empty.
`shouldDisableSlotClassProp(...)` defines the mapping.

See [EXCLUSIONS](EXCLUSIONS.md).

## Option bar control

`DtcOptionBarControl` wraps the underlying control component and adds the label,
badges, lock icon, RAW toggle for object/array controls, and tooltip from
member descriptions.

It only binds args that exist as props on the selected control component. Common
args include:

- `defaultValue`
- `validValues`
- `validTypes`
- `tags`
- `bindings`
- `tokenCategory`
- `propValues`
- `disabledValues`
- `clearable`

## Updates

Member value updates emit `update:member` from `DtcOptionBarMemberGroup`, then
`DtcOptionBar` writes into the correct `options` group through the root
`update:options` function.
