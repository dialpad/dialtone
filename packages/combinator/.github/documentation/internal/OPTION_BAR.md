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

The option bar also has a search toggle. Search normalizes member names,
variant `searchKeywords`, and logical aliases, so physical terms such as
`left`, `right`, `top`, and `bottom` can find logical names such as
`inlineStart` and `blockEnd`.
When search filters out the current tab, the selected panel follows the first
visible tab so the controls area does not point at a removed panel.

The option bar includes a settings icon button that opens
`DtcOptionBarSettings`. The popover edits persisted control-display settings:

- `Hide Deprecated`, on by default;
- `Hide Disabled`, off by default.

During normal browsing, those settings can hide deprecated or disabled controls.
During active search, matching controls hidden only by those display settings are
surfaced again. The controls keep their original state: deprecated controls keep
their badge, and disabled controls remain disabled.

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

Deprecated controls are detected from the component documentation generated from
JSDoc tags. Variant metadata should not mark a member deprecated.

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
