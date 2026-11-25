# Renderer

The renderer displays the target component in its current `options` state.

## Mounted structure

`DtcRenderer` passes bindings, events, disabled members, and rendered slots into
`DtcRendererTarget`.

`DtcNode` renders slot template strings and can resolve components from the
`library` prop.

## Target rendering

`DtcRendererTarget` uses Vue's `h(...)` and `render(...)` APIs rather than a
normal template component. It does this so it can catch render errors from
invalid component combinations and replace them with a `DtNotice`.

The target vnode receives the current app context. This lets rendered target
components and nested slot nodes resolve globally registered components,
directives, and provides.

## Bindings

Bindings come from `options.bindings.get()`, which combines props and
attributes. Before rendering, `DtcRendererTarget` filters out any binding whose
member name is in `disabledMembers`.

## Events

The renderer converts `info.events` into Vue listeners named
`on${Capitalize(event)}`. When an event fires, the renderer emits `event` to
`DtcCombinator`.

`DtcCombinator` compares `update:<prop>` events for existing prop or attribute
members against a snapshot of their previous values. Unchanged echoes are ignored.
Changed values are written back into `options.props` or `options.attributes`
through the guarded options setter. Outside preset application, this switches a
named preset to custom and emits `update:preset` with an empty string.

See [USAGE](../USAGE.md#selecting-a-preset) for comparison semantics and
[SYSTEM](SYSTEM.md#options) for the options update paths.

## Slots

`DtcRenderer` filters empty slot values before rendering and passes each
non-empty slot to `DtcNode` with the current slot bindings as scope.

`DtcNode` compiles each slot template as a Vue component with the current slot
bindings as data. An optional slot `scopeName` also exposes the complete binding
object under that name; existing top-level variables remain available. Both the
single preview and spec sheet use this behavior. See [slot configuration](CODE_PANEL.md#slots).

## Latent renderer menu

`renderer_menu.vue` and `renderer_button_bar.vue` still exist, and `renderer.vue`
keeps the menu imports commented out. The current live app does not mount them.
DLT-3498 tracks whether to rewire or remove them.
