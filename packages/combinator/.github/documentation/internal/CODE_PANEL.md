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

`code_editor_tag_attributes.vue` hides bindings when:

- the value is `null`;
- the value is `NaN`;
- the value matches the member default and verbose mode is off;
- the member name is in `disabledMembers`.

Verbose mode shows default-value bindings but still respects disabled members.

## Slots

`DtcCodeEditor` reads slot content from `options.slots`. It renders the default
slot as direct content and wraps named slots in `<template #name>`.

For scoped slots, `DtcCodeEditor` checks which documented bindings appear in the
slot template string and writes the matching scope expression.

## Copy behavior

The Copy button writes `copyText`, a plain-text template built from `info` and
`options`. It does not read DOM text, so layout or flex indentation does not
change clipboard output.

The Copy JSON button writes a variant preset fragment from non-empty current
options. It skips disabled members.

## Latent event console

`components/event_console/**` can still display captured event payloads and
recursively inspect arrays, objects, functions, strings, elements, and primitive
values. The live code panel no longer mounts it. DLT-3498 tracks whether to
rewire or remove this latent subsystem.
