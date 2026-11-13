---
title: "Badge and Chip API updates"
description: "DtBadge gains kind groups and moves to variant/emphasis/label, and DtChip moves to variant/emphasis/startIcon/startAvatar with interactive-owned removal."
---

## TLDR

> [!WARNING] Breaking Change
> `DtBadge` now has a `kind` (`status`, `counter`, `release` or `lifecycle`; default `status`) and uses `variant`, `emphasis`, and `label`. `DtChip` now uses `variant`, `emphasis`, `startIcon`, `startAvatar` and `endIcon`, defaults `showClose` to `false`, and only renders removal controls when `interactive` is true.

Run both migration tools first:

```bash
npx dialtone-migrate-badge-api --cwd ./src
npx dialtone-migrate-chip-api --cwd ./src
```

## DtBadge

| Before | After |
| --- | --- |
| `text` | `label` |
| `type="default"` (or no `type`) | `kind="status" variant="neutral"` |
| `type="info"`, `positive`, `warning`, `critical` | `kind="status"` with the same variant |
| `type="bulletin"` | `kind="release" variant="pre-release"` |
| `type="bulletin"` with `subtle` | `kind="release" variant="pre-release" emphasis="base"` |
| `type="bulletin"` with `outlined` | `kind="release" variant="pre-release" emphasis="subtle"` (the purple fill is removed) |
| `kind="count"` | `kind="counter" variant="count"` |
| `kind="count"` with `type="bulletin"` | `kind="counter" variant="count" emphasis="strong"` |
| `kind="label"` | `kind="status"` |
| `#leftIcon` | `#startIcon` |
| `#rightIcon` | `#endIcon` |

`type="ai"` is not carried into the new Badge variant model. Use `DtChip emphasis="subtle"` for AI attribution.

The script maps each badge to the new `kind`, `variant` and `emphasis` closest to its current look, but one mapping changes the appearance on purpose. A `type="bulletin"` badge with `outlined` kept its purple fill and added an outline. `emphasis="subtle"` is an outline with no fill, so the migrated badge loses the fill. To keep the solid purple fill, use `emphasis="strong"` instead.

The deprecated `outlined` prop also renders a different class. It now renders `d-badge--legacy-outlined`, which only adds the outline and keeps the fill. `d-badge--outlined` now belongs to `emphasis="subtle"` and clears the fill. Update any CSS or tests that select `d-badge--outlined` on a badge that uses the `outlined` prop.

```vue
<!-- Before -->
<dt-badge type="bulletin" text="Beta">
  <template #startIcon="{ iconSize }">
    <dt-icon-sparkle :size="iconSize" />
  </template>
</dt-badge>

<!-- After -->
<dt-badge kind="release" variant="pre-release" label="Beta">
  <template #startIcon="{ iconSize }">
    <dt-icon-sparkle :size="iconSize" />
  </template>
</dt-badge>
```

The `startIcon` and `endIcon` slots, `iconSize`, and the `startIconClass` and `endIconClass` props stay as they are. New `leading` and `trailing` slots (with `leadingClass` and `trailingClass`) hold freeform content such as a nested badge, the same as on `DtButton`.

Badges are now organized in groups (`status`, `counter`, `release`, `lifecycle`) and `kind` names the group. `kind` defaults to `status`, so a plain badge is a neutral status badge. Badges in the other groups must declare `kind`. The `release` group holds the `pre-release` and `release` variants, for features that are or are not yet generally available. The `lifecycle` group is new and holds content states such as `draft`, `edited`, `saved`, `published`, `archived` and `scheduled`. Nothing migrates to `lifecycle`, and the script leaves `lifecycle` content states untouched.

The migration script reads each badge's current `type`, `kind` and `variant`, and adds the matching `kind`, `variant` and `emphasis`. Run it on files from any earlier Badge API, including the interim `variant="base"` and `variant="lifecycle"` values. The interim stage variants map to the `release` group: `new`, `internal` and `early-access` become `variant="pre-release"`, and `recent` and `familiar` become `variant="release"`. This also applies to badges that already have `kind="lifecycle"` with one of those variants. Both release variants now default to `emphasis="strong"`, so `internal`, `early-access` and `familiar` badges without an explicit `emphasis` get `emphasis="base"` to keep their look, and an explicit `emphasis` is kept, except `emphasis="clear"`, which is removed (see below). `subtle` and `outlined` only ever applied to `type="bulletin"`; on other types they are removed with a warning because status badges have no outline.

The migration script leaves dynamic `:variant`/`:type` bindings untouched and warns, since it can't infer the group; add `kind` to those by hand. It also warns for dynamic `text` bindings, `type="ai"` (given `kind="status"`, no variant), `decoration`, `emphasis="clear"` (removed) and count badges with a non-default old `type`.

## DtChip

| Before | After |
| --- | --- |
| `#icon` | `#startIcon` |
| `#avatar` | `#startAvatar` |
| `iconClass` / `icon-class` | `startIconClass` / `start-icon-class` |
| `avatarClass` / `avatar-class` | `startAvatarClass` / `start-avatar-class` |
| omitted `size` | explicit `size="300"` from the codemod |
| omitted `showClose` | default is now `false` |
| `show-close` without `interactive` | warns and renders no remove button |
| `labelClass="d-chip__label--active"` | removed; warns. Use `emphasis="strong"` for a persistent selected look |

```vue
<!-- Before -->
<dt-chip>
  <template #icon>
    <dt-icon name="phone" size="200" />
  </template>
  Phone
</dt-chip>

<!-- After -->
<dt-chip size="300">
  <template #startIcon="{ iconSize }">
    <dt-icon name="phone" :size="iconSize" />
  </template>
  Phone
</dt-chip>
```

New `endIcon`, `leading`, and `trailing` slots (with `endIconClass`, `leadingClass`, and `trailingClass`) add an end icon and freeform content, the same as on `DtButton`. The icon slots pass an `iconSize` slot prop, the icon size designed for the chip `size`. Set the `icon-size` prop on the chip to override it.

Removal is part of the interactive contract:

```vue
<dt-chip interactive show-close remove-button-aria-label="Remove phone">
  Phone
</dt-chip>
```

The migration script warns for omitted `showClose`/`interactive`, explicit `show-close` without `interactive`, dynamic `show-close`, `d-chip__label--active` in a chip's attributes, and files that provide both old `icon` and `avatar` slots.

The `d-chip__label--active` class gave a chip a fixed filled look at rest. It is removed. Use `emphasis="strong"` for a persistent selected look, for example `:emphasis="selected ? 'strong' : 'base'"`; it may not match the old fill exactly. The script can't rewrite the class, so replace it where the warning points.
