# System

The Combinator system is driven by three root data objects:

- `info`: processed component metadata;
- `options`: reactive current values;
- `settings`: cached UI and code-display preferences.

`DtcCombinator` owns those objects and passes them into the renderer, option bar,
and code panel.

## Info

`info` is derived from the target component and its Dialtone Vue documentation.
`DtcCombinator` treats it as immutable after initialization.

Format:

```js
{
  displayName: 'DtButton',
  props: [member, member],
  slots: [member, member],
  attributes: [member, member],
  events: [member, member],
  exclusions: [rule, rule],
  members: {
    enumerate(handler) {},
  },
  bindings: {
    get() {},
    enumerate(handler) {},
  },
}
```

`src/lib/info.js` and `src/lib/info_extend.js` handle the main processing:

- clone the documentation input before mutation;
- rename model props from the `@model` tag;
- add HTML attribute members from `@property ... attribute` tags;
- add the native `class` attribute for components that support root class;
- parse member type strings;
- normalize boolean enum values;
- read default prop values from the component;
- add labels from member names.

The Combinator merges variant data into `info` by member name. It merges
`defaults` before the selected preset and copies `exclusions` to
`info.exclusions`.

## Options

`options` is the reactive value map that the renderer, option bar, and code
panel use.

Format:

```js
{
  props: {
    disabled: false,
  },
  attributes: {
    class: '',
  },
  slots: {
    default: 'Label',
  },
  bindings: {
    get() {},
    enumerate(handler) {},
  },
}
```

Initial option values come from each member's `initialValue`.

Child components do not mutate `options` directly. They emit a function through
`update:options`; the root applies that function inside a guarded setter. Manual
edits clear the selected variant label.

## Settings

`settings` stores cached values for root, code, and renderer settings.
`DtcCombinator` initializes the model from `src/settings.json` and
localStorage-backed refs.

See [SETTINGS](SETTINGS.md).

## Disabled members

`disabledMembers` is a computed `Set` in `DtcCombinator`. It includes optional
props and slots that these rules disable:

- exclusion rules;
- inferred prop dependencies;
- slot-class dependency rules.

The root passes disabled members to the renderer and code panel so they suppress
invalid or inactive members from the preview and generated code.

See [EXCLUSIONS](EXCLUSIONS.md).

## Render flow

1. The root computes `info` from documentation and variants.
2. The root initializes `options` from `info`.
3. The option bar edits `options`.
4. The renderer passes current bindings and slots to the target component.
5. The code panel generates Vue template text from the same `info` and
   `options`.

This keeps preview state and copied code tied to the same source data.
