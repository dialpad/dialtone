# deprecated-tshirt-sizes

Detects usage of deprecated t-shirt size props (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`) on Dialtone components and auto-fixes to the numeric scale (`100`, `200`, `300`, `400`, `500`, `600`, `700`).

## Rule Details

Dialtone components now use a numeric ordinal scale for size props. T-shirt sizes are supported as deprecated aliases but the numeric form is preferred.

This rule flags:

- `size="sm"` on any `dt-*` / `Dt*` component → `:size="200"`
- `label-size="xs"` on `dt-input`, `dt-select-menu`, etc. → `:label-size="100"`
- `speed="md"` on `dt-motion-text` → `:speed="300"`

This rule does NOT flag:

- Dynamic bindings (`:size="computedSize"`)
- Non-Dialtone components (`<my-button size="sm">`)
- Icon sizes (`size="200"` on `dt-icon`)

## Options

No options.

## Examples

### Invalid

```vue
<dt-button size="sm">Click me</dt-button>
<dt-text size="xl">Headline</dt-text>
<dt-input label-size="xs" />
<dt-motion-text speed="lg" />
```

### Valid (auto-fixed)

```vue
<dt-button :size="200">Click me</dt-button>
<dt-text :size="500">Headline</dt-text>
<dt-input :label-size="100" />
<dt-motion-text :speed="400" />
```

## Size Mapping

| T-shirt | Numeric |
|---------|---------|
| xs | 100 |
| sm | 200 |
| md | 300 |
| lg | 400 |
| xl | 500 |
| 2xl | 600 |
| 3xl | 700 |
