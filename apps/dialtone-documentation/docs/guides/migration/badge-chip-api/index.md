---
title: "Badge API updates"
description: "DtBadge gains kind groups and moves to variant/emphasis/label, with startIcon, endIcon, leading and trailing slots."
---

## TLDR

> [!WARNING] Breaking Change
> `DtBadge` now has a `kind` (`status`, `counter` or `lifecycle`; default `status`) and uses `variant`, `emphasis`, and `label`.

Run the migration tool first:

```bash
npx dialtone-migrate-badge-api --cwd ./src
```

## DtBadge

| Before | After |
| --- | --- |
| `text` | `label` |
| `type="default"` (or no `type`) | `kind="status" variant="neutral"` |
| `type="info"`, `positive`, `warning`, `critical` | `kind="status"` with the same variant |
| `type="bulletin"` | `kind="lifecycle" variant="new"` |
| `type="bulletin"` with `subtle` | `kind="lifecycle" variant="new" emphasis="base"` |
| `type="bulletin"` with `outlined` | `kind="lifecycle" variant="new" emphasis="subtle"` |
| `kind="count"` | `kind="counter" variant="count"` |
| `kind="count"` with `type="bulletin"` | `kind="counter" variant="count" emphasis="strong"` |
| `kind="label"` | `kind="status"` |
| `#leftIcon` | `#startIcon` |
| `#rightIcon` | `#endIcon` |

`type="ai"` is not carried into the new Badge variant model.

```vue
<!-- Before -->
<dt-badge type="bulletin" text="Beta">
  <template #startIcon="{ iconSize }">
    <dt-icon-sparkle :size="iconSize" />
  </template>
</dt-badge>

<!-- After -->
<dt-badge kind="lifecycle" variant="new" label="Beta">
  <template #startIcon="{ iconSize }">
    <dt-icon-sparkle :size="iconSize" />
  </template>
</dt-badge>
```

The `startIcon` and `endIcon` slots, `iconSize`, and the `startIconClass` and `endIconClass` props stay as they are. New `leading` and `trailing` slots (with `leadingClass` and `trailingClass`) hold freeform content such as a nested badge, the same as on `DtButton`.

Badges are now organized in groups (`status`, `counter`, `lifecycle`) and `kind` names the group. `kind` defaults to `status`, so a plain badge is a neutral status badge. Badges in the other groups must declare `kind`. The migration script reads each badge's current `type`, `kind` and `variant`, adds the matching `kind`, and keeps its look. Run it on files from any earlier Badge API, including the interim `variant="base"`/`lifecycle` values. The lifecycle variants are named for the stage of a feature (`internal`, `early-access`, `new`, `recent`, `familiar`), so after migrating, choose the variant that fits each badge. `subtle` and `outlined` only ever applied to `type="bulletin"`; on other types they are removed with a warning because status badges have no outline.

The migration script leaves dynamic `:variant`/`:type` bindings untouched and warns, since it can't infer the group; add `kind` to those by hand. It also warns for dynamic `text` bindings, `type="ai"` (given `kind="status"`, no variant), `decoration`, `emphasis="clear"` (removed) and count badges with a non-default old `type`.
