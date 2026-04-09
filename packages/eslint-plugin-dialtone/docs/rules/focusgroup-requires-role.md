# focusgroup-requires-role

Warns when `v-dt-focusgroup` is used on an element without a `role` attribute. Screen readers need a role to announce the widget correctly.

## Rule Details

### What the rule flags

- Elements with `v-dt-focusgroup` that have no `role` attribute (static or dynamic)

### What the rule does NOT flag

- Elements with `v-dt-focusgroup` that have a static `role` attribute
- Elements with `v-dt-focusgroup` that have a dynamic `:role` binding
- Elements without `v-dt-focusgroup`

## Examples

### Invalid

```vue
<div v-dt-focusgroup="'horizontal'">
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
