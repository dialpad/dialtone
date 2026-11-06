# deprecated-tshirt-sizes

Detects usage of deprecated t-shirt size props (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`) on Dialtone components and points them at the current API.

## Rule Details

Dialtone components now use a numeric ordinal scale for raw size props. T-shirt sizes are supported as deprecated aliases but the current form is preferred.

For `DtText`, t-shirt sizes describe text composition and should move to `variant` when a supported text composition can be inferred. Numeric `size` remains valid for raw font-size control only when paired with `variant`, or with legacy `kind` while migrating older code.

This rule flags:

- `size="sm"` on most `dt-*` / `Dt*` components → `:size="200"`
- `size="sm"` on `dt-text` / `DtText` without `variant` or `kind` → manual error
- `kind="body" size="sm"` on `dt-text` / `DtText` → `variant="body-sm"`
- `kind="headline" size="2xl"` on `dt-text` / `DtText` → `variant="headline-2xl"`
- `label-size="xs"` on `dt-input`, `dt-select-menu`, etc. → `:label-size="100"`
- `speed="md"` on `dt-motion-text` → `:speed="300"`

This rule does NOT flag:

- Dynamic bindings (`:size="computedSize"`)
- Non-Dialtone components (`<my-button size="sm">`)
- Icon sizes (`size="200"` on `dt-icon`)

Static Text `size`-to-variant autofixes require one unambiguous kind/size pair. Spreads, dynamic arguments, composition conflicts and uncertain directives require manual review for this conversion. Any explicit variant prevents autofixing the Text `size` prop; the rule may report a deprecated size but does not autofix that override. Other size-related attributes keep their ordinary rule behavior. The opt-in `dialtone-migrate --only text-variant` stage also accepts numeric pairs and bound literals when available in the installed version.

For Text with `kind` or `variant`, template-literal text such as ``:size="`sm`"`` is not reported. Review these bindings manually.

## Options

No options.

## Examples

### Invalid

```vue
<dt-button size="sm">Click me</dt-button>
<dt-text size="sm">Body text</dt-text>
<dt-text kind="headline" size="xl">Headline</dt-text>
<dt-input label-size="xs" />
<dt-motion-text speed="lg" />
```

### Valid (auto-fixed)

```vue
<dt-button :size="200">Click me</dt-button>
<dt-text variant="headline-xl">Headline</dt-text>
<dt-input :label-size="100" />
<dt-motion-text :speed="400" />
```

## Size Mapping

| T-shirt | Numeric |
| ------- | ------- |
| xs      | 100     |
| sm      | 200     |
| md      | 300     |
| lg      | 400     |
| xl      | 500     |
| 2xl     | 600     |
| 3xl     | 700     |
