# Exclusions and dependencies

Exclusions prevent invalid or misleading component states in the option bar,
renderer, and generated code. They live in component variant files under
`src/variants/variants_<component>.js`.

The rule engine lives in `src/lib/exclusion_rules.js`. Prop dependency inference
lives in `src/lib/prop_dependencies.js`.

## Rule shape

Each exclusion rule has conditions and effects:

```js
{
  when: { kind: 'muted' },
  disableValues: { props: { importance: ['primary'] } },
}
```

Conditions can be literal values or predicate functions:

```js
{
  when: { href: value => !!value },
  hide: { props: ['type'] },
}
```

Slot conditions use `whenSlots`:

```js
{
  whenSlots: { icon: value => !value },
  disable: { props: ['iconClass'] },
}
```

`whenSlots` only evaluates when the caller provides slot values.

## Effects

### `hide`

Marks a member as hidden through the compatibility API. Current option-bar code
treats `hide` as a disabled signal when calculating disabled controls and disabled
members.

```js
{
  when: { link: true },
  hide: { props: ['importance', 'kind', 'circle'] },
}
```

### `disable`

Disables controls without clearing the value.

```js
{
  when: { useDropdown: true },
  disable: { props: ['deferSelection'] },
}
```

### `disableValues`

Disables specific selectable values for a prop. The engine stores values as
strings in the disabled set before passing them to selection controls.

```js
{
  when: { kind: 'muted' },
  disableValues: { props: { importance: ['primary'] } },
}
```

Mutual exclusions need both directions:

```js
{
  when: { kind: 'muted' },
  disableValues: { props: { importance: ['primary'] } },
},
{
  when: { importance: 'primary' },
  disableValues: { props: { kind: ['muted'] } },
}
```

### `clear`

Clears a member value by writing `null` when the rule matches.
The option bar applies clear effects after dependency values change; `clear`
should not rewrite the initial component default baseline on mount.

```js
{
  when: { borderWidth: value => !value },
  clear: { props: ['borderColor'] },
}
```

Use `clear` only when the existing value creates invalid generated code or
an invalid preview. A rule can pair `clear` with `disable` to both reset and
lock a control at once.

## Disabled members

`DtcCombinator` computes `disabledMembers` from:

- exclusion rules;
- inferred prop dependencies;
- slot-class dependencies.

The renderer and code editor filter out disabled members so inactive
members do not appear in the preview or copied template.

The option bar still renders disabled controls by default so users can see why a
value is unavailable. When `settings.controls.hideInactive` is enabled, disabled
controls are hidden during normal browsing. Active search can surface matching
disabled controls again, but they remain disabled and the renderer/code editor
still suppress them through `disabledMembers`.

## Prop dependencies

Prop dependencies do not need variant rules. `buildDependencyMap(...)` infers
parent-child relationships from:

- descriptions such as `Only applies when the \`link\` prop is true`;
- child prop names that start with a boolean parent name at a camel-case
  boundary, such as `linkKind` depending on `link`.

When the parent value is falsy, `shouldHideProp(...)` disables the child control.

## Slot-class dependencies

`shouldDisableSlotClassProp(...)` disables slot-class props when their slot is
empty. Current mappings include:

- `blockEndIconClass` -> `blockEndIcon`
- `blockStartIconClass` -> `blockStartIcon`
- `endIconClass` -> `endIcon`
- `iconClass` -> `icon`
- `leadingClass` -> `leading`
- `startIconClass` -> `startIcon`
- `trailingClass` -> `trailing`

`src/lib/utils.js` hardcodes these dependencies.

## Authoring notes

- Match member names exactly to docgen output. The variant merge ignores unknown
  names.
- Use string token values for token-numbered props, for example `'200'`, not
  `200`.
- Keep mechanical exclusion behavior here. The component-contributor contract is
  documented separately in the mirrored `combinator-variants` agent rules.
