---
title: "DtAvatar: Visual Refresh Updates"
description: "DtAvatar has been updated as part of the Dialtone visual refresh. Size prop moves to a numeric scale, group avatars gain full size support, iconSize is removed, and new color, iconOnly, and deactivated props are introduced."
---

## TLDR

> [!WARNING] Breaking Changes
>
> - `clickable` prop **renamed** to `interactive`
> - `iconSize` prop **removed** — icon size is now computed automatically from `size`
> - Group avatars no longer forced to `xs` — they now respect the `size` prop
> - Group count badge capping is size-aware: sizes 100–250 cap at `9+`, sizes 300+ cap at `99+`
> - Presence indicator only renders for sizes `100` - `500`

## Size Prop

`DtAvatar`'s `size` prop now uses a numeric 100–900 scale. T-shirt size strings are still accepted but deprecated and will be removed in a future major version.

**Important:** The default changed from the string `'md'` to the number `300`. If you use `DtAvatar` without a `size` prop, no change is needed. If you bind `size` dynamically, ensure your data is now a number.

| Old value | New value |
| --- | --- |
| `"xs"` | `100` |
| `"sm"` | `200` |
| `"md"` *(previous default)* | `300` *(new default)* |
| `"lg"` | `500` |
| `"xl"` | `800` |

Additional sizes with no t-shirt equivalent: `150`, `250`, `400`, `600`, `700`, `900`

### Migration examples

**Static string → static number**

```html
<!-- Before -->
<dt-avatar size="lg" />

<!-- After -->
<dt-avatar :size="500" />
```

**Conditional size**

```html
<!-- Before -->
<dt-avatar :size="isLarge ? 'lg' : 'md'" />

<!-- After -->
<dt-avatar :size="isLarge ? 500 : 300" />
```

**Dynamic bound prop**

```html
<!-- Before: avatarSize was the string 'md' -->
<dt-avatar :size="avatarSize" />

<!-- After: avatarSize is now the number 300 -->
<dt-avatar :size="avatarSize" />
```

## Group Avatars

Group avatars have two breaking changes.

**1. Size is no longer forced to `xs`.**

Previously, setting the `group` prop silently overrode the `size` prop and rendered the avatar at `xs` regardless of what you passed. That override is removed. Group avatars now render at whatever `size` you provide — or the default `300` if none is set.

If your group avatars were relying on the forced-`xs` behavior, you'll need to explicitly set `:size="100"` to preserve the previous appearance.

```html
<!-- Before: rendered at xs even though size="lg" was set -->
<dt-avatar full-name="Dialpad" :group="14" size="lg" />

<!-- After: renders at 500 — set size="100" to match old xs behavior -->
<dt-avatar full-name="Dialpad" :group="14" :size="100" />
```

**2. Count badge capping is now size-aware.**

Small avatars (sizes 100–250) cap the displayed count at `9+`. Larger avatars (sizes 300+) cap at `99+`. Previously the cap was always `99+` regardless of size.

## `clickable` → `interactive`

The `clickable` prop has been renamed to `interactive` to more accurately describe its effect: the avatar renders as a `<button>`, becomes keyboard-focusable, and participates in the page's tab order.

```html
<!-- Before -->
<dt-avatar full-name="Jane Doe" clickable @click="openProfile" />

<!-- After -->
<dt-avatar full-name="Jane Doe" interactive @click="openProfile" />
```

The [migration script](/guides/migration/component-props/#migration-script) (`dialtone-migrate-props`) handles this rename automatically.

## `iconSize` Removed

The `iconSize` prop has been removed. Icon size is now computed automatically based on the `size` prop and does not need to be specified.

```html
<!-- Before -->
<dt-avatar icon="person" icon-size="300" :size="300" />

<!-- After -->
<dt-avatar icon="person" :size="300" />
```

## New Props

The following props have been added and are available immediately — no migration required.

| Prop | Type | Description |
| --- | --- | --- |
| `family` | Number (1–12) | Color family (hue). 1=Red, 2=Orange, 3=Amber, 4=Yellow-Green, 5=Green, 6=Teal, 7=Cyan, 8=Blue, 9=Indigo, 10=Purple, 11=Magenta, 12=Pink |
| `variant` | Number (0–9) | Lightness/chroma variant within the family. 0=darkest, 9=lightest |
| `iconOnly` | Boolean | Renders the avatar with a transparent background, icon only |
| `deactivated` | Boolean | Renders the avatar in a desaturated/grayed-out state |

### Color prop (legacy)

The `color` prop remains supported for backward compatibility but is now considered legacy. It is converted internally to `family`/`variant` automatically — you do not need to migrate immediately, but we recommend moving to one of the new approaches.

**What the old `color` values meant**

The `color` prop accepted a numeric string in the format `family * 100 + variant * 10`. For example:

- `color="540"` → family `5` (Green), variant `4`
- `color="1020"` → family `10` (Purple), variant `2`
- `color="800"` → family `8` (Blue), variant `0` (darkest)

**What to use instead**

For most cases — user avatars where you want a consistent color tied to the person — use **`seed`**. Pass a unique identifier such as a user ID or email address. The same seed always produces the same family and variant, so the color is stable across renders without you needing to store or manage a color code.

```html
<!-- Before: hardcoded color code -->
<dt-avatar full-name="Dialpad" color="540" />

<!-- After: deterministic from user ID -->
<dt-avatar full-name="Dialpad" seed="user-12345" />
```

If you need explicit control over the exact color — for example, in a branded context or design system showcase — decode your old value and use `family`/`variant` directly:

```html
<!-- color="540" decoded: family=5, variant=4 -->
<dt-avatar full-name="Dialpad" :family="5" :variant="4" />
```

## Presence Indicator

The `presence` prop only renders for sizes **100–500**. Sizes 600 and above do not display presence regardless of the `presence` prop value.

## How to Find Usages

No automated migration tool. To find deprecated t-shirt size usages:

```bash
grep -rn 'size="xs\|size="sm\|size="md\|size="lg\|size="xl' src/
```

To find `iconSize` usages:

```bash
grep -rn 'icon-size\|iconSize' src/
```
