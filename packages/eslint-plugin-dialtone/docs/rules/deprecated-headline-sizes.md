# deprecated-headline-sizes

Detects usage of deprecated headline sizes (`xxl`, `xxxl`) and the old `d-text-headline--xxl` / `d-text-headline--xxxl` utility classes.

## Rule Details

Headline sizes `xxl` and `xxxl` were renamed to `2xl` and `3xl`. For `DtText`, those legacy size values describe text composition and should move to the `variant` prop.

This rule flags:

- `size="xxl"` on `dt-text` / `DtText` -> `variant="headline-2xl"`
- `kind="headline" size="xxxl"` on `dt-text` / `DtText` -> `variant="headline-3xl"`
- `size="xxxl"` on non-DtText components -> `size="3xl"`
- `d-text-headline--xxl` -> `d-text-headline--2xl`
- `d-text-headline--xxxl` -> `d-text-headline--3xl`

This rule does NOT flag:

- `d-headline--xxl` legacy utility classes
- Existing `DtText` variants such as `variant="headline-2xl"`
- Existing renamed sizes such as `size="2xl"`

## Options

No options.

## Examples

### Invalid

```vue
<dt-text kind="headline" size="xxl">Headline</dt-text>
<my-heading size="xxxl">Headline</my-heading>
<div class="d-text-headline--xxl">Headline</div>
```

### Valid (auto-fixed)

```vue
<dt-text variant="headline-2xl">Headline</dt-text>
<my-heading size="3xl">Headline</my-heading>
<div class="d-text-headline--2xl">Headline</div>
```

## Size Mapping

| Deprecated | Current |
| ---------- | ------- |
| xxl        | 2xl     |
| xxxl       | 3xl     |
