---
title: "DtChip: interactive defaults to false"
description: "DtChip's interactive prop default changed from true to false. Chips now render as non-interactive <span> elements by default. Chips that are meant to be clickable must opt in with :interactive=\"true\"."
keywords: ["clickable", "selection", "span", "non-interactive", "default false"]
---

## TLDR

> [!CRITICAL] Breaking Change
> `DtChip`'s `interactive` prop default changed from `true` to `false`. Chips that are meant to be clickable must now explicitly pass `:interactive="true"`.

Previously, every `<dt-chip>` without an explicit `interactive` prop rendered as a `<button>` with hover, focus, and pointer styles — even when the chip had no click handler and was purely decorative. This caused chips to appear clickable when they did nothing, which is misleading to users and a screen reader accessibility problem.

## What Changed

| | Before | After |
| --- | --- | --- |
| Default HTML element | `<button>` | `<span>` |
| Default `interactive` | `true` | `false` |
| Hover/focus/active styles | Present by default | Only when `:interactive="true"` |

The close button on chips is **unaffected** — it always renders as a `<button>` regardless of `interactive`.

## Migration

Run the migration script from your project root:

```bash
npx dialtone-migrate-chip-interactive --cwd ./src
```

The script:
- **Auto-adds** `:interactive="true"` to chips that have a `@click` handler or a `v-on` object binding.
- **Warns** about chips with no `interactive` prop and no detected click handler — these need manual review.

Add `--dry-run` to preview changes without writing files. Add `--yes` to apply without prompting.

For chips flagged in warnings, decide:

- **Display-only chip** (no click handler, not keyboard-navigable) — no change needed. The chip now correctly renders as a `<span>`.
- **Clickable chip** (has `@click`, keyboard nav, or must be focusable) — add `:interactive="true"`.

```html
<!-- Before: rendered as <button> by default -->
<dt-chip>Label</dt-chip>

<!-- After: renders as <span> by default — correct for display-only chips -->
<dt-chip>Label</dt-chip>

<!-- Clickable chip — must opt in -->
<dt-chip :interactive="true" @click="onChipClick">Label</dt-chip>
```

## Close Button

The close button (`showClose`) is not affected by this change. A chip with `showClose` and `interactive` both at their defaults renders the chip body as a `<span>` and the close button as a `<button>`.

```html
<!-- Close button always renders as <button> regardless of interactive -->
<dt-chip @close="onRemove">Label</dt-chip>
```
