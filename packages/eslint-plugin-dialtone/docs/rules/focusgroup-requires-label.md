# focusgroup-requires-label

Warns when `v-dt-focusgroup` is used on an element without `aria-label` or `aria-labelledby`. Screen readers need an accessible name to identify the widget.

## Rule Details

### What the rule flags

- Elements with `v-dt-focusgroup` that have no `aria-label` or `aria-labelledby` attribute (static or dynamic)

### What the rule does NOT flag

- Elements with `v-dt-focusgroup` that have a static `aria-label` or `aria-labelledby`
- Elements with `v-dt-focusgroup` that have a dynamic `:aria-label` or `:aria-labelledby` binding
- Elements without `v-dt-focusgroup`

## Examples

### Invalid

```vue
<div role="toolbar" v-dt-focusgroup="'horizontal'">
  <button>A</button>
  <button>B</button>
</div>
```

### Valid

```vue
<div role="toolbar" v-dt-focusgroup="'horizontal'" aria-label="Actions">
  <button>A</button>
  <button>B</button>
</div>
```
