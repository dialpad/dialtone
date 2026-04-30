---
title: Migrating Anchor and Router Patterns to DtButton and DtLink
description: DtButton and DtLink now render as router-link or anchor when you pass to or href. DtLink underline behavior is now a prop. A migration script handles the most common patterns.
---

## TLDR

- Workarounds like `<a class="d-btn">` and `<router-link class="d-btn">` are replaced by `<dt-button href="…">` and `<dt-button :to="…">`.
- Workarounds like `<a class="d-link">` and `<router-link class="d-link">` are replaced by `<dt-link href="…">` and `<dt-link :to="…">`.
- DtLink: `d-td-*` text-decoration utility classes are replaced by the `:underline="false"` prop.
- Modifier classes (`d-btn--lg`, `d-link--muted`, etc.) get extracted into the matching props automatically.
- One command does the migration: `npx dialtone-migrate-link-rendering`.

## Why

DtButton and DtLink hardcoded their root element. Consuming products worked around that with `<a class="d-btn">` and `<router-link class="d-link">` patterns that duplicated component internals and drifted out of sync as the components changed.

[DtButton](/components/button.md) and [DtLink](/components/link.md) now accept `to` and `href` props. DtLink also has a new `underline` boolean prop. This page shows how to migrate.

## DtButton: Anchor and Router-Link Rendering

DtButton now supports `to`, `href`, `target`, `rel`, and `replace` props.

| Prop | Renders | Use case |
| --- | --- | --- |
| `to` | `<router-link>` | Internal SPA navigation |
| `href` | `<a>` | External or hash links |
| neither | `<button>` | Plain actions (unchanged default) |

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<a class="d-btn" href="/settings">Settings</a>

<a
  class="d-btn d-btn--lg d-btn--critical"
  href="/delete-account"
>
  Delete account
</a>

<router-link class="d-btn" to="/dashboard">
  Dashboard
</router-link>

<router-link
  class="d-btn d-btn--outlined"
  :to="{ name: 'profile' }"
>
  Profile
</router-link>
```

</div>
<div>

**After**

```vue
<dt-button href="/settings">Settings</dt-button>

<dt-button
  :size="400"
  kind="critical"
  href="/delete-account"
>
  Delete account
</dt-button>

<dt-button to="/dashboard">
  Dashboard
</dt-button>

<dt-button
  importance="outlined"
  :to="{ name: 'profile' }"
>
  Profile
</dt-button>
```

</div>
</div>

> [!INFO] Modifier classes are extracted to props
> The migration script reads `d-btn--*` modifiers and writes the equivalent prop. Sizes `d-btn--xs/sm/lg/xl` map to `:size="100/200/400/500"`. `d-btn--outlined` maps to `importance="outlined"`. `d-btn--{muted,critical,positive,inverted,unstyled}` map to `kind="…"`. `d-btn--circle` / `d-btn--active` / `d-btn--loading` become bare boolean attrs. The renames `d-btn--danger` to `kind="critical"` and `d-btn--success` to `kind="positive"` are applied in the same pass.

## DtLink: Anchor and Router-Link Rendering

DtLink now supports `to`, `href`, and `replace`.

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<a class="d-link" href="/help">Help</a>

<a
  class="d-link d-link--muted"
  href="/changelog"
>
  Changelog
</a>

<router-link class="d-link" to="/profile">
  Profile
</router-link>

<router-link
  class="d-link d-link--critical"
  :to="route"
>
  Critical action
</router-link>
```

</div>
<div>

**After**

```vue
<dt-link href="/help">Help</dt-link>

<dt-link
  tone="muted"
  href="/changelog"
>
  Changelog
</dt-link>

<dt-link to="/profile">
  Profile
</dt-link>

<dt-link
  tone="critical"
  :to="route"
>
  Critical action
</dt-link>
```

</div>
</div>

> [!INFO] Tone modifiers and renames
> `d-link--{tone}` modifiers map to `tone="…"` directly. `d-link--danger` becomes `tone="critical"` and `d-link--success` becomes `tone="positive"`.

## DtLink: Underline as a Prop

`d-td-*` and `h:d-td-*` utility classes on DtLink are replaced by the `underline` boolean prop. Default `true` is rest-underlined with no hover underline. `:underline="false"` flips to no rest underline, with underline appearing on hover.

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-link
  href="/quiet"
  class="d-td-none h:d-td-underline"
>
  Quiet link
</dt-link>

<dt-link
  href="/default"
  class="d-td-underline h:d-td-none"
>
  Default styling (redundant)
</dt-link>
```

</div>
<div>

**After**

```vue
<dt-link
  href="/quiet"
  :underline="false"
>
  Quiet link
</dt-link>

<dt-link href="/default">
  Default styling (redundant)
</dt-link>
```

</div>
</div>

## Migration Script

```bash
npx dialtone-migrate-link-rendering --cwd ./src
```

The script walks `.vue` files by default. Add `--include-markdown` to also walk `.md` files (useful for projects with VuePress documentation containing live Vue examples). Use `--dry-run` to preview, `--yes` to skip the confirmation prompt, and `--only=button-nav,link-nav,underline` to run a subset.

What the script preserves:

- **Vendor classes**: `d-btn--brand`, `d-btn--google`, `d-btn--o365`, `d-btn--linkedin` stay on the resulting tag's `class` attribute. They are CSS-only modifiers with no prop equivalent.
- **CSS-only DtLink modifiers**: `d-link--disabled`, `d-link--inverted-disabled` stay on `class`.
- **Custom user classes**: anything that isn't a recognized `d-btn--*` / `d-link--*` modifier is left alone.

What the script flags for manual review:

| Pattern | Reason |
| --- | --- |
| Dynamic `:class="expr"` alongside a static class with `d-btn` / `d-link` / `d-td-*` | Can't merge expressions safely |
| `<router-link custom v-slot="…">` wrapping `<dt-button>` / `<dt-link>`, or `<router-link custom class="d-btn">` directly | Custom slot semantics don't transfer to DtButton/DtLink |
| Responsive `d-td-*` variants (e.g. `sm:d-td-none`) on DtLink | The boolean prop has no responsive form |

Static and dynamic `to` / `href` bindings are migrated 1:1: `:to="route"` becomes `<dt-button :to="route">`, `:href="url"` becomes `<dt-link :href="url">`.

## Hover Behavior Note

The DtLink `underline` prop has two settings: `true` (default) gives rest-underlined with no hover underline; `false` gives no rest underline with hover underline. Some `d-td-*` patterns can't be expressed with either setting. For example, `d-td-none` alone applies `text-decoration: none !important` in both rest and hover. The migration writes the closest match (`:underline="false"`) and adds a per-file note. Spot-check those tags if hover styling is load-bearing in your UI.

## ESLint Rule

`deprecated-link-styling-classes` flags any reintroduction of the legacy patterns in Vue templates.

```js
// eslint.config.js (flat config)
import dialtone from '@dialpad/eslint-plugin-dialtone';

export default [
  {
    plugins: { dialtone },
    rules: {
      'dialtone/deprecated-link-styling-classes': 'warn',
    },
  },
];
```
