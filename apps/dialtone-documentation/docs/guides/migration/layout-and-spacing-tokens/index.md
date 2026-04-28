---
title: Migrating Layout and Spacing Tokens
description: The --dt-size-* and --dt-space-* token families are being replaced by two purpose-built systems — --dt-layout-* for structural sizing and --dt-spacing-* for whitespace.
---

## TLDR

> [!WARNING]
> **Breaking change:** Two token families are being deprecated in favor of purpose-built replacements.
>
> - `--dt-size-*` → `--dt-layout-*` for layout use (widths, heights — 64px base unit)
> - `--dt-space-*` → `--dt-spacing-*` for spacing use (padding, margin, gap — 8px base unit)
> - Old tokens still compile (deprecated aliases) but will be removed in a future major version
> - Migration tool available: `npx dialtone-migration-helper`
> - The previous `space-to-size` config has been **removed** — use the new configs instead

## Why Two Systems?

Spacing and layout have fundamentally different size requirements, and a single token scale can't serve both well at the same time.

Spacing — padding, margin, gap — operates at small increments. You need 2px, 4px, 6px, 8px, 12px. An 8px base unit gives you exactly that: logical, fine-grained steps at the low end of the scale where whitespace decisions actually live. Layout — widths, heights, structural dimensions — operates at much larger values where that same granularity isn't useful. A 64px base unit produces a scale that matches how layout sizes actually work in practice.

The old `--dt-size-*` and `--dt-space-*` tokens were the same values shared across both contexts. This worked reasonably well at the low end of the scale — those small stops mapped well enough to spacing use cases — but once you reached the larger values, the scale became awkward. There was a jarring jump around the 600px range where the stops shifted into territory that only made sense for layout, yet the tokens carried no signal about which context they belonged to. The intent was blurred. Spacing and layout are different efforts, and they deserve different tools.

- **`--dt-spacing-*`** — 8px base unit, fine-grained steps for padding, margin, gap, and inset
- **`--dt-layout-*`** — 64px base unit, larger steps for widths, heights, and structural dimensions

## `--dt-layout-*` Tokens

Use layout tokens for `width`, `height`, `min-width`, `max-width`, `min-height`, `max-height`, and similar structural properties.

**Base unit:** `--dt-layout-base` = 64px. Scale stops multiply the base (e.g., `layout-100` = 64px, `layout-200` = 128px).

### Mapping from `--dt-size-*`

| Old Token | Old Value | New Token | New Value |
| --- | --- | --- | --- |
| `--dt-size-500` | 16px | `--dt-layout-25` | 16px |
| `--dt-size-600` | 32px | `--dt-layout-50` | 32px |
| `--dt-size-650` | 48px | `--dt-layout-75` | 48px |
| `--dt-size-700` | 64px | `--dt-layout-100` | 64px |
| `--dt-size-750` | 96px | `--dt-layout-150` | 96px |
| `--dt-size-800` | 128px | `--dt-layout-200` | 128px |
| `--dt-size-850` | 192px | `--dt-layout-300` | 192px |
| `--dt-size-900` | 256px | `--dt-layout-400` | 256px |
| `--dt-size-950` | 384px | `--dt-layout-600` | 384px |
| `--dt-size-1000` | 512px | `--dt-layout-800` | 512px |
| `--dt-size-1050` | 768px | `--dt-layout-1200` | 768px |
| `--dt-size-1100` | 1024px | `--dt-layout-1600` | 1024px |

### Nearest-neighbor mappings

These old tokens have no exact equivalent in the new scale. The migration tool maps them to the closest available stop.

| Old Token | Old Value | New Token | New Value | Δ |
| --- | --- | --- | --- | --- |
| `--dt-size-825` | 164px | `--dt-layout-250` | 160px | 4px |
| `--dt-size-875` | 216px | `--dt-layout-350` | 224px | 8px |
| `--dt-size-905` | 264px | `--dt-layout-400` | 256px | 8px |
| `--dt-size-925` | 332px | `--dt-layout-500` | 320px | 12px |
| `--dt-size-975` | 464px | `--dt-layout-700` | 448px | 16px |
| `--dt-size-1020` | 628px | `--dt-layout-1000` | 640px | 12px |
| `--dt-size-1040` | 764px | `--dt-layout-1200` | 768px | 4px |
| `--dt-size-1060` | 828px | `--dt-layout-1300` | 832px | 4px |
| `--dt-size-1080` | 912px | `--dt-layout-1400` | 896px | 16px |

### Tokens converted to raw values

The following tokens exceed the layout scale (max `--dt-layout-1600` = 1024px) and have no token equivalent. The migration tool converts them to raw `rem` values and adds a `TODO` comment so they can be updated when a token is added.

| Old Token | Old Value | Migration output |
| --- | --- | --- |
| `--dt-size-1115` | 1140px | `71.25rem` |
| `--dt-size-1120` | 1268px | `79.25rem` |
| `--dt-size-1125` | 1280px | `80rem` |
| `--dt-size-1130` | 1340px | `83.75rem` |
| `--dt-size-1150` | 1536px | `96rem` |
| `--dt-size-1200` | 2048px | `128rem` |

If you need a token at one of these sizes, [open a request](https://github.com/dialpad/dialtone/issues).

## `--dt-spacing-*` Tokens

Use spacing tokens for `padding`, `margin`, `gap`, `inset`, and similar whitespace properties.

**Base unit:** `--dt-spacing-base` = 8px. Scale stops multiply the base (e.g., `spacing-100` = 8px, `spacing-200` = 16px).

### Mapping from `--dt-space-*`

| Old Token | Old Value | New Token | New Value |
| --- | --- | --- | --- |
| `--dt-space-0` | 0px | `--dt-spacing-0` | 0px |
| `--dt-space-100` | 1px | `--dt-spacing-1` | 1px |
| `--dt-space-200` | 2px | `--dt-spacing-25` | 2px |
| `--dt-space-300` | 4px | `--dt-spacing-50` | 4px |
| `--dt-space-350` | 6px | `--dt-spacing-75` | 6px |
| `--dt-space-400` | 8px | `--dt-spacing-100` | 8px |
| `--dt-space-450` | 12px | `--dt-spacing-150` | 12px |
| `--dt-space-500` | 16px | `--dt-spacing-200` | 16px |
| `--dt-space-525` | 20px | `--dt-spacing-250` | 20px |
| `--dt-space-550` | 24px | `--dt-spacing-300` | 24px |
| `--dt-space-600` | 32px | `--dt-spacing-400` | 32px |
| `--dt-space-625` | 42px | `--dt-spacing-525` | 42px |
| `--dt-space-650` | 48px | `--dt-spacing-600` | 48px |
| `--dt-space-700` | 64px | `--dt-spacing-800` | 64px |

Tokens at `--dt-space-720` (72px), `--dt-space-730` (84px), and `--dt-space-750` and above (96px+) have no spacing equivalent — values at this scale belong in `--dt-layout-*`. The migration tool leaves these unchanged for manual review.

## Migration Tool

Run the migration helper from your project root:

```bash
npx dialtone-migration-helper --cwd ./src
```

Two new configs are available:

- **`space-to-spacing`** — migrates `--dt-space-*` → `--dt-spacing-*`
- **`size-to-layout`** — migrates `--dt-size-*` → `--dt-layout-*` or `--dt-spacing-*` based on CSS property context (spacing properties route to `--dt-spacing-*`, layout properties route to `--dt-layout-*`)

To apply changes without interactive confirmation:

```bash
npx dialtone-migration-helper --cwd ./src --force
```

**Note:** The previous `space-to-size` config has been removed. If you previously ran it and are now on `--dt-size-*`, run `size-to-layout` next. If you still have `--dt-space-*` tokens, run `space-to-spacing` directly — you can skip `space-to-size` entirely.

## Lint Rule

A new stylelint rule `@dialpad/stylelint-plugin-dialtone/no-deprecated-size-tokens` warns on any remaining `--dt-size-*` or `--dt-space-*` usage after migration. The rule message points to the appropriate migration helper config.
