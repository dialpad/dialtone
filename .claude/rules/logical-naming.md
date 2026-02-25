# Logical Naming Convention

## Direction Names

Use logical names in all new component code, e.g.:

- `start` / `end` (inline axis — replaces `left` / `right`)
- `blockStart` / `blockEnd` (block axis — replaces `top` / `bottom`)
- `startIcon` / `endIcon` (replaces `leftIcon` / `rightIcon` or `alphaIcon` / `omegaIcon`)

## Deprecated Slot Backward Compatibility

Use the `v-if`/`v-else` pattern (NOT nested slots) for deprecated slot fallbacks:

```vue
<!-- @slot Slot for start content -->
<slot v-if="$slots.start" name="start" />
<!-- @slot @deprecated Use start -->
<slot v-else name="left" />
```

For scoped slots, pass the same bindings to both:

```vue
<slot v-if="$slots.startIcon" name="startIcon" :icon-size="iconSize" />
<slot v-else name="leftIcon" :icon-size="iconSize" />
```

Use `$slots.xxx` for the inner choice (matches nested-slot behavior: an empty `#start` still suppresses `#left`). Use `hasSlotContent($slots.xxx)` for outer visibility guards that control wrapper element rendering.

## Deprecated Props

Use sentinel defaults with nullish coalescing:

- **String** deprecated props: `default: undefined`, resolve with `??`
- **Boolean** deprecated props: `default: null`, resolve with `??`

```js
// In props:
startClass: { type: String, default: '' },
/** @deprecated Use startClass */
leftClass: { type: String, default: undefined },

// In computed:
resolvedStartClass () {
  return this.leftClass ?? this.startClass;
}
```

## Deprecated Events

Emit both new and old event names:

```js
onStartClick () {
  this.$emit('start-clicked');
  this.$emit('alpha-clicked');
},
```
