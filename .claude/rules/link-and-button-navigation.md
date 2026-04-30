# DtLink and DtButton Navigation

In Vue templates, prefer DtButton and DtLink with the `to` / `href` props over raw `<a>` or `<router-link>` elements carrying `d-btn` / `d-link` classes. Prefer the `underline` prop on DtLink over `d-td-*` text-decoration utility classes.

This rule applies to **Vue templates only**. Raw `<a class="d-btn">` patterns in non-Vue contexts (server-rendered HTML, framework boundaries where DtButton/DtLink aren't importable) are intentional workarounds and should remain.

## Navigation rendering (DLT-3033, DLT-3034)

| When | Use | Renders |
| --- | --- | --- |
| Internal SPA navigation | `<dt-button :to="…">` / `<dt-link :to="…">` | `<router-link>` |
| External link or hash anchor | `<dt-button href="…">` / `<dt-link href="…">` | `<a>` |
| Plain action button (no nav) | `<dt-button>` (no `to`/`href`) | `<button>` |

Prefer `to` over `href` for internal destinations. `href` is correct for external links and any case that requires a full document load.

```vue
<!-- ❌ avoid -->
<a class="d-btn d-btn--critical" href="/delete">Delete</a>
<router-link class="d-link d-link--muted" :to="route">Help</router-link>

<!-- ✅ prefer -->
<dt-button kind="critical" href="/delete">Delete</dt-button>
<dt-link tone="muted" :to="route">Help</dt-link>
```

## Underline behavior on DtLink (DLT-3035)

Use the `underline` boolean prop (default `true`) instead of `d-td-*` utility classes.

```vue
<!-- ❌ avoid -->
<dt-link href="/x" class="d-td-none h:d-td-underline">Quiet link</dt-link>

<!-- ✅ prefer -->
<dt-link href="/x" :underline="false">Quiet link</dt-link>
```

## Migration

Existing patterns in a Vue codebase: `npx dialtone-migrate-link-rendering --cwd ./src`. The ESLint rule `dialtone/deprecated-link-styling-classes` flags any reintroduction.
