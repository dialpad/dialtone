# Code panel

The code panel shows generated Vue template code for the current target
component state. In the live app, it mounts `DtcCodeEditor` inside
`DtcCodePanel`.

The old event console components still exist under `components/event_console/`,
but `DtcCodePanel` and `DtcCombinator` do not mount them.

## Mounted structure

`DtcCodePanel` receives:

- `info`
- `options`
- `settings`
- `disabledMembers`
- `devMode`
- `hasChanges`
- `fullScreen`

It passes the relevant data into `DtcCodeEditor` and exposes an `overlay` slot
for callers. The current root component does not pass any overlay content.

## Code editor

`DtcCodeEditor` renders one root element for the target component. It derives the
tag name from `info.displayName` with `paramCase`.

The editor shows:

- visible props and attributes in the opening tag;
- slot content for non-empty slots;
- scoped slot bindings when the slot content references those bindings;
- a Copy button;
- in dev mode, a Copy JSON button when `hasChanges` is true.

## Visible attributes

Displayed and copied bindings are omitted when:

- the value is `null` or `undefined`;
- the value is `NaN`;
- the value matches the member default and verbose mode is off;
- the member name is in `disabledMembers`.

Verbose mode shows default-value bindings but still omits `null`, `undefined`,
and `NaN` values and disabled members.

## Slots

`DtcCodeEditor` reads slot content from `options.slots`. It wraps named slots in
`<template #name>`. Default-slot content that uses documented slot bindings gets
`<template #default="...">` in both displayed and copied code; ordinary default
content stays unwrapped.

For scoped slots, `DtcCodeEditor` checks which documented bindings appear in the
slot template string and writes the matching scope expression. A variant can set
`scopeName` on a named slot when its template needs the complete slot object, including
keys such as `aria-expanded` that are not JavaScript identifiers:

```js
export default {
  default: {
    slots: {
      anchor: {
        scopeName: 'anchorAttrs',
        initialValue: `<dt-button :aria-expanded="anchorAttrs['aria-expanded']">Actions</dt-button>`,
      },
    },
  },
};
```

Use the same slot metadata under `defaults.slots` to share it across presets.
The single preview and spec sheet expose that name, and displayed/copied code
uses `#anchor="anchorAttrs"`. Bind the needed fields explicitly; forwarding the
whole object can also forward Vue-reserved fields such as `ref`. Slots without
`scopeName` retain their existing destructured bindings.

## Copy behavior

The Copy button writes `copyText`, a plain-text template built from `info` and
`options`. It does not read DOM text, so layout or flex indentation does not
change clipboard output.

The Copy JSON button writes a variant preset fragment from current options.
It skips disabled members, undefined/NaN values, empty slots, and empty-string
or null bindings already equal to their component default. Explicit nondefault
empty strings and null values remain in the preset, including Filter Pill's
`selected` and `neutralValue` identities. It retains each slot's `scopeName` so
the preset keeps its binding when copied back into a variant bank.

An optional bank `copyNotice` is copied as a template comment and retained in
preset metadata; closing comment delimiters in the notice are escaped. The
notice describes missing application setup. Its mention of `v-model:selected`
does not add application state or an update handler to a configuration snapshot.

## Latent event console

`components/event_console/**` can still display captured event payloads and
recursively inspect arrays, objects, functions, strings, elements, and primitive
values. The live code panel no longer mounts it. DLT-3498 tracks whether to
rewire or remove this latent subsystem.
