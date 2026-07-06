# Logical Naming Rules

Apply when reviewing or editing Dialtone Vue component props, slots, events, prop values, docs, and Combinator variant data.

## New API names

Do not introduce physical direction names in new public component API:

- avoid `left`, `right`, `top`, `bottom`, `alpha`, and `omega`;
- use `start`, `end`, `blockStart`, `blockEnd`, `inlineStart`, and
  `inlineEnd` where direction matters.
- use full logical names for CSS geometry props, such as
  `insetBlockStart`, `insetInlineEnd`, `paddingBlockStart`, and
  `borderWidthInlineEnd`.

Examples:

- slots: `startIcon`, `endIcon`, `blockStart`, `blockEnd`;
- props: `startClass`, `endClass`, `startDisabled`;
- values: `start`, `end`, `blockStart`, `blockEnd`;
- events: `start-clicked`, `end-clicked`.

If touching a component that still has physical-only names, add logical alternatives with deprecated fallbacks instead of extending the physical API.

Do not add deprecated physical aliases for brand-new logical APIs.

## Deprecated slot fallbacks

Use a `v-if` / `v-else` pair for deprecated slot names. Do not nest slot fallbacks.

```vue
<!-- @slot Slot for start content -->
<slot v-if="$slots.start" name="start" />
<!-- @slot @deprecated Use start -->
<slot v-else name="left" />
```

For scoped slots, pass the same bindings to both names:

```vue
<slot v-if="$slots.startIcon" name="startIcon" :icon-size="iconSize" />
<slot v-else name="leftIcon" :icon-size="iconSize" />
```

Use `$slots.name` for the inner fallback choice. Use `hasSlotContent(...)` only for outer visibility guards that decide whether wrapper elements render.

## Deprecated props

Use sentinel defaults with nullish coalescing:

- string deprecated props: `default: undefined`, resolve with `??`;
- boolean deprecated props: `default: null`, resolve with `??`.

```js
startClass: { type: String, default: '' },
/** @deprecated Use startClass */
leftClass: { type: String, default: undefined },

resolvedStartClass () {
  return this.leftClass ?? this.startClass;
}
```

## Deprecated events

Emit both the new event and the deprecated event during the compatibility window:

```js
onStartClick () {
  this.$emit('start-clicked');
  this.$emit('alpha-clicked');
}
```

## Descriptions and docs

Identifiers stay logical. Descriptions should bridge the first logical direction mention to its LTR-default physical equivalent with an `(aka <physical>)` parenthetical.

| Logical phrase | Bridged form |
| --- | --- |
| `block-start side` | `block-start side (aka top)` |
| `block-end side` | `block-end side (aka bottom)` |
| `inline-start side` | `inline-start side (aka left)` |
| `inline-end side` | `inline-end side (aka right)` |
| `block axis` | `block axis (aka top/bottom)` |
| `inline axis` | `inline axis (aka left/right)` |

Use lowercase `aka`, place the parenthetical before the period, and bridge the first mention in a JSDoc block only.

## Combinator search

The Combinator option-bar search uses `packages/combinator/src/lib/logical_aliases.js` to map logical tokens to physical search aliases. `option_bar.vue` tokenizes camelCase member names and expands logical tokens through that map.

When adding new logical naming vocabulary, update `logical_aliases.js` so users can still search by familiar physical terms.

Single physical words such as `top` and `left` match logical prop names through `logical_aliases.js`. Do not repeat them as per-prop `searchKeywords`.

Search normalization strips spaces and hyphens, so `z index` and `z-index` already match `zIndex` with no keywords.

Add explicit `searchKeywords` only for multi-word phrases the name and aliases cannot derive, such as `padding left` or `sticky top`.
