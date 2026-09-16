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

`DtcCombinator` currently handles `update:<prop>` events by writing the emitted
value back into `options.props` or `options.attributes` when the member exists.
This keeps v-model style components in sync with the rendered preview.

## Slots

`DtcRenderer` filters empty slot values before rendering and passes each
non-empty slot to `DtcNode` with the current slot bindings as scope.

`DtcNode` recursively parses the slot template and renders HTML tags, registered
library components, and nested content.

## Latent renderer menu

`renderer_menu.vue` and `renderer_button_bar.vue` still exist, and `renderer.vue`
keeps the menu imports commented out. The current live app does not mount them.
DLT-3498 tracks whether to rewire or remove them.
