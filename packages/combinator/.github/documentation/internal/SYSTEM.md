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

The UI starts and resets to `default` unless the bank opts into
`defaults.metadata.initialPreset` with an existing named preset. An explicit
`preset` prop takes precedence, including an explicit `default`. Missing or invalid
requests use the preferred initial preset. This preference also
sets the baseline for detecting edits; it does not rename the `default` preset
or change its generated lookup identity. Filter Pill prefers `controlled default`
while preserving its legacy `default` configuration and `?preset=default` link.
The docs omit the preset query for the preferred initial preset.

Filter Pill preview identity uses the array shape of `options`. Editing an array
to `null` (or the reverse) creates a new preview instance, matching its new
configuration. Option replacements within controlled mode keep the same instance.

An opted-in bank may also provide `metadata.beforePreviewRemount(target,
{ signal })`. Return nothing when replacement is safe, or a promise that resolves
only after the outgoing target completes its cleanup. The renderer retains that
VNode, its bindings, slots, container and anchor while waiting; it suppresses
outgoing event write-back and applies only the latest requested replacement.
The hook must handle reopening until completion and release its watcher/listeners
on completion or when the abort signal fires during renderer disposal. If the
hook throws or its promise rejects, the renderer treats cleanup as incomplete:
it logs a warning, keeps the outgoing target mounted and live (including any
overlay or scroll lock it owns), and retries the hook on the next update or
reset. Renderer disposal still unmounts it; a failure settling after disposal
is ignored. This
metadata is passed only to the target renderer, never to the component or copied
preset payload.

The cleanup promise may resolve to a synchronous after-remount callback. The renderer calls it with the actual replacement component proxy only after successfully rendering the latest requested preview. Aborted or disposed work and failed renders do not run it. A callback failure logs a warning while leaving the replacement live and later updates available. Existing hooks resolving without a value keep their behavior. Filter Pill uses this callback to preserve the initiating control or replacement anchor focus after its outgoing overlay completes cleanup; later consumer focus takes priority.

Filter Pill captures its current Popover owner (directly or through Dropdown),
cancels selection without Apply, and waits for logical closure plus completed
focus and scroll cleanup. Ordinary selected/options/label/count updates preserve
the live instance. After an open preview finishes cleanup, the bank restores
focus to the initiating control or replacement anchor only when cleanup returned
focus to the outgoing anchor and no other control has taken focus. This gate
covers replacement within the same renderer;
ancestor teardown, route removal and shared scroll-lock ownership remain separate
lifecycle responsibilities.

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

Initial option values come from each member's `initialValue`. Plain objects and
arrays are copied in every bank so live edits do not mutate preset defaults.
Banks with `previewIdentity` also apply their opted-in cloning policy before
the plain-value copy.

Option-bar controls and code-panel slot editors emit a function through
`update:options`; the root applies it inside a guarded setter. Outside preset
application, the setter switches a named preset to custom and emits
`update:preset` with an empty string.

Preview `update:<prop>` events use the same setter only when their value differs
from the previous-value snapshot. Unchanged echoes preserve the selected preset;
in-place changes to plain objects and arrays are detected by that snapshot.
See [RENDERER](RENDERER.md#events) for event handling.

## Settings

`settings` stores cached values for root, code, renderer, and option-bar control
display settings.
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
