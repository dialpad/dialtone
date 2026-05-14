# Logical Naming Convention

## Enforcement

**Never introduce physical direction names** (`left`, `right`, `top`, `bottom`, `alpha`, `omega`) in new component slots, props, events, or prop values. Always use logical equivalents (`start`, `end`, `blockStart`, `blockEnd`).

When reviewing code or creating new components:

- New slots must use logical names: e.g. `startIcon`, `endIcon`, `start`, `end`, `blockStart`, `blockEnd`
- New props must use logical names: e.g. `startClass`, `endClass`, `startDisabled`, etc.
- New prop values for positioning must be logical: e.g. `start`, `end`, `blockStart`, `blockEnd`
- New events must use logical names: e.g. `start-clicked`, `end-clicked`
- If touching a component that still has physical-only names, add logical alternatives with deprecated fallbacks.

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

## Description Prose

**Identifiers stay logical. Descriptions become bilingual.**

When writing a JSDoc comment, slot description, or doc-page prose that mentions a logical direction, always add the LTR-default physical equivalent as an `(aka <physical>)` parenthetical. This helps consumers mid-migration anchor the logical term to a physical one without requiring them to look it up.

| Logical phrase in description | Bridged form |
|-------------------------------|--------------|
| `block-start side` / `block-start edge` | `block-start side (aka top)` |
| `block-end side` / `block-end edge` | `block-end side (aka bottom)` |
| `inline-start side` / `inline-start edge` | `inline-start side (aka left)` |
| `inline-end side` / `inline-end edge` | `inline-end side (aka right)` |
| `block axis` | `block axis (aka top/bottom)` |
| `inline axis` | `inline axis (aka left/right)` |

Rules:

- Parenthetical is lowercase: `(aka top)` not `(AKA top)`
- Placed inside the sentence, before the period: `… side (aka top). Overrides…`
- Bridge the first mention in a JSDoc block only — leave subsequent `Overrides …` sentences as-is
- Drop legacy qualifiers: `(top/bottom in horizontal writing mode)` → `(aka top/bottom)`, `in LTR` → delete

## Combinator Filter

The Combinator prop/slot search uses `packages/combinator/src/lib/logical_aliases.js` as its canonical alias map. The `filterMembers` function in `option_bar.vue` tokenizes prop/slot names, expands each logical token via this map, and matches the union against the search query. This means searching `"top"` finds `borderWidthBlockStart`, `paddingBlockStart`, etc. automatically.

**When adding new logical-naming vocabulary** (e.g. a new axis concept beyond `block`/`inline`), add the new token and its physical aliases to `logical_aliases.js`. No per-component or per-prop changes needed — the filter picks it up automatically for any component that uses the new token in its prop/slot names.
