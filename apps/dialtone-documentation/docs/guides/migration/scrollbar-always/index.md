---
title: "Scrollbar: :never renamed to :always"
description: "The v-dt-scrollbar directive argument :never and the DtBox scrollbar=\"never\" prop value have been renamed to :always and scrollbar=\"always\" to reflect their actual meaning."
---

## TLDR

> [!CRITICAL] Breaking Change
> The `v-dt-scrollbar:never` directive argument and the `DtBox` `scrollbar="never"` prop value have been renamed to `:always` and `"always"`. Run the migration script to update your code automatically.

## Why

`v-dt-scrollbar:never` was confusing — "never" implied the scrollbar would never appear, when it actually meant "never auto-hide", i.e., the scrollbar is **always visible**. The rename to `:always` expresses the intent directly.

## What Changed

| Before | After |
| --- | --- |
| `v-dt-scrollbar:never` | `v-dt-scrollbar:always` |
| `scrollbar="never"` (DtBox) | `scrollbar="always"` (DtBox) |

All other directive arguments (`leave`, `scroll`, `move`) and DtBox scrollbar values are unchanged.

## Migration

Run the migration script from your project root:

```bash
npx dialtone-migrate-scrollbar-always --cwd ./src
```

The script replaces all occurrences of `v-dt-scrollbar:never` and `scrollbar="never"` in `.vue` and `.html` files. Add `--dry-run` to preview changes without writing files. Add `--yes` to apply without prompting.

```html
<!-- Before -->
<div v-dt-scrollbar:never>...</div>
<dt-box scrollbar="never">...</dt-box>

<!-- After -->
<div v-dt-scrollbar:always>...</div>
<dt-box scrollbar="always">...</dt-box>
```
