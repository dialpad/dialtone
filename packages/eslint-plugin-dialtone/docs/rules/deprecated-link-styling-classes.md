# deprecated-link-styling-classes

Detects raw anchor / `router-link` elements that carry `d-btn` or `d-link` classes (a workaround for the pre-DLT-3009/DLT-3010 era when DtButton and DtLink couldn't render as anchors or router links), plus `<dt-link>` elements that carry `d-td-*` text-decoration utilities (replaced by the `underline` prop in DLT-3012).

## Rule Details

This rule flags Vue template patterns that should migrate to the new DtButton / DtLink component APIs. The codemod `npx dialtone-migrate-link-rendering` does the migration automatically — this rule prevents new code from re-introducing the legacy patterns.

### What it flags

- `<a class="…d-btn…">` — should use `<dt-button href="…">`.
- `<router-link class="…d-btn…">` — should use `<dt-button :to="…">`.
- `<a class="…d-link…">` — should use `<dt-link href="…">`.
- `<router-link class="…d-link…">` — should use `<dt-link :to="…">`.
- `<dt-link class="…d-td-…">` — should use the `underline` prop (`:underline="false"` for the no-underline-at-rest variant).

### Examples of **incorrect** code

```vue
<a class="d-btn d-btn--lg" href="/x">CTA</a>
<router-link class="d-btn" to="/x">Go</router-link>
<a class="d-link d-link--muted" href="/x">Help</a>
<router-link class="d-link" to="/x">Profile</router-link>
<dt-link href="/x" class="d-td-none h:d-td-underline">Quiet link</dt-link>
```

### Examples of **correct** code

```vue
<dt-button :size="400" href="/x">CTA</dt-button>
<dt-button :to="route">Go</dt-button>
<dt-link tone="muted" href="/x">Help</dt-link>
<dt-link :to="route">Profile</dt-link>
<dt-link href="/x" :underline="false">Quiet link</dt-link>
```

## When Not to Use

If a project is intentionally using `d-btn` or `d-link` classes on raw HTML in non-Vue contexts (server-rendered HTML, framework boundaries where `DtButton`/`DtLink` aren't importable), this rule will not fire because it only walks Vue template bodies.

## Migration

Run the codemod to fix all instances at once:

```sh
npx dialtone-migrate-link-rendering --cwd ./src
```

Use `--include-markdown` if your repo also has VuePress markdown files containing live Vue examples to migrate.

## Related

- [`dialtone-migrate-link-rendering`](https://www.npmjs.com/package/@dialpad/dialtone-css) — the migration codemod.
