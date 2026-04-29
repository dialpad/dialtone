# deprecated-success-color-classes

Detects usage of deprecated `success`-named color utility classes (`d-bgc-success*`, `d-bc-success*`, `d-fc-success*`) and recommends the `positive`-named replacements.

## Rule Details

The semantic-color tokens were renamed from `success` to `positive` to better describe their intent. The deprecated `success`-named classes still resolve at runtime via aliases, but new code should use the `positive`-named replacements and existing code should be migrated.

This rule flags:

- `d-bgc-success`, `d-bgc-success-subtle`, `d-bgc-success-strong`, `d-bgc-success-opaque`, plus the `-inverted`, `-subtle-inverted`, `-strong-inverted`, `-opaque-inverted`, `-subtle-opaque`, and `-subtle-opaque-inverted` variants.
- `d-bc-success*` (border color) with the same suffixes.
- `d-fc-success*` (font/foreground color) with the same suffixes. The foreground variants are already deprecated as part of the broader base-color cleanup, but this rule covers them here because consumers still use them.

The matcher anchors at token boundaries so unrelated continuations such as `d-bgc-success-foo` are NOT flagged.

This rule does NOT flag:

- The migrated `positive`-named classes (`d-bgc-positive`, `d-bc-positive-strong`, `d-fc-positive-inverted`, etc.).
- Plain English uses of the word "success" without the `d-{role}-` prefix (`<div class="success">`).
- Other semantic colors (`d-bgc-critical`, `d-bgc-warning`, `d-bgc-other`).

## Where the rule scans

- `class="..."` attributes in Vue templates (handled by the Vue template AST).
- `:class="..."` / `v-bind:class="..."` dynamic bindings — string literals inside arrays, objects, ternaries, and template literals are all scanned. Fully dynamic class names (`'d-bgc-' + variant`) cannot be resolved without runtime knowledge.
- String literals and template literals inside `<script>` blocks and plain `.js`/`.ts` files that look like utility-class strings.

## Auto-fix

This rule is not auto-fixable. Run the migration helper to rewrite occurrences in bulk:

```sh
npx dialtone-migration-helper --config success-to-positive
```

## Options

No options.

## Examples

### Incorrect

```vue
<template>
  <div class="d-bgc-success">Saved</div>
  <div class="d-bc-success-subtle">Bordered</div>
  <div class="d-fc-success-strong">Strong</div>
  <div :class="['d-bgc-success']">Bound</div>
</template>
```

### Correct

```vue
<template>
  <div class="d-bgc-positive">Saved</div>
  <div class="d-bc-positive-subtle">Bordered</div>
  <div class="d-fc-positive-strong">Strong</div>
  <div :class="['d-bgc-positive']">Bound</div>
</template>
```

## Class Mapping

| Deprecated | Replacement |
| --- | --- |
| `d-bgc-success` | `d-bgc-positive` |
| `d-bgc-success-subtle` | `d-bgc-positive-subtle` |
| `d-bgc-success-strong` | `d-bgc-positive-strong` |
| `d-bgc-success-opaque` | `d-bgc-positive-opaque` |
| `d-bgc-success-inverted` | `d-bgc-positive-inverted` |
| `d-bgc-success-subtle-inverted` | `d-bgc-positive-subtle-inverted` |
| `d-bgc-success-strong-inverted` | `d-bgc-positive-strong-inverted` |
| `d-bgc-success-opaque-inverted` | `d-bgc-positive-opaque-inverted` |
| `d-bgc-success-subtle-opaque` | `d-bgc-positive-subtle-opaque` |
| `d-bgc-success-subtle-opaque-inverted` | `d-bgc-positive-subtle-opaque-inverted` |
| `d-bc-success*` | `d-bc-positive*` (same suffixes) |
| `d-fc-success*` | `d-fc-positive*` (same suffixes) |
