---
description: "Run Dialtone migration tools for token and utility renames. Use '/dt-migrate' to see available migrations, or '/dt-migrate <name>' to run a specific one (e.g., '/dt-migrate color-stops')."
---

# Dialtone Migration Skill

## Available Migrations

| Migration | Description | Command |
| --- | --- | --- |
| `color-stops` | Renames irregular color stops (250, 350, 425, etc.) to standard 12-stop scale | `npx dialtone-migration-helper` → "color stops" |
| `base-to-semantic` | Replaces base color utilities and CSS tokens with semantic equivalents | `npx dialtone-migration-helper` → "base to semantic" |
| `space-to-size` | Renames `var(--dt-space-*)` to `var(--dt-size-*)` | `npx dialtone-migration-helper` → "space to size" |
| `size-to-layout` | Routes `var(--dt-size-*)` to `--dt-spacing-*` / `--dt-layout-*` / `--dt-size-border-*` / `--dt-size-radius-*` based on CSS property context. Covers off-scale pixel-indexed exceptions (1/2/8/20/24 px → `--dt-layout-Npx`) in layout context | `npx dialtone-migration-helper` → "size to layout" |
| `utility-class-to-token-stops` | Rewrites legacy pixel-indexed utility class names (`d-h16`, `d-p8`) to token-stop-based names (`d-h-25`, `d-p-100`). Covers off-scale pixel-indexed exceptions (`d-w1` → `d-w-1px`, `d-h24` → `d-h-24px`, etc.) | `npx dialtone-migration-helper` → "utility class to token stops" |
| `hsl-to-oklch` | Migrates consumer HSL channel variable patterns to OKLCH relative color syntax or plain `var()` | `npx dialtone-migration-helper` → "hsl to oklch" |
| `link-rendering` | Migrates `<a class="d-btn">`, `<router-link class="d-link">`, etc. to `<dt-button>` / `<dt-link>` with `to`/`href` props. Also extracts `d-btn--*` / `d-link--*` modifiers into corresponding props (size, kind, importance, tone) and converts `d-td-*` classes on DtLink to the `underline` prop. Standalone CLI, not a config of `dialtone-migration-helper`. | `npx dialtone-migrate-link-rendering` |
| `typography` | Migrates legacy typography utility classes (`d-headline--*`, `d-body--*`, `d-label--*`, `d-code--md`, `d-fw-*`, `d-fc-*`, `d-lh-*`, `d-truncate`, `d-ta-*`) on `<p>`/`<span>`/`<div>`/`<h1>`-`<h6>`/`<label>` elements to `<dt-text>` with semantic props. Flags `d-headline--eyebrow`, `d-code--sm`, `d-helper--*`, dynamic `:class` bindings, and `d-fs-*` for manual review. | `npx dialtone-migrate-typography` |

## Usage

### `/dt-migrate`

List all available migrations with descriptions.

### `/dt-migrate <name>`

Run the specified migration:

1. Confirm the target directory with the user (default: `./src`)
2. Look up `<name>` in the table above. If the Command column shows `npx dialtone-migration-helper`, run that command and select the named config interactively. If the Command column shows a different `npx <name>` invocation (a standalone CLI — e.g., `link-rendering` runs `npx dialtone-migrate-link-rendering`), run the command shown directly with `--cwd <dir>` instead.
3. Report the number of files changed and matches replaced
4. Suggest running linters after migration to catch remaining manual fixes

### `/dt-migrate <name> --dry-run`

Preview changes without applying them.

### `/dt-migrate color-stops --merge-from staging`

Run merge-scoped color-stops migration. Use during a `staging`→`next` merge to
avoid re-running the migration on already-migrated files:

1. Computes the merge base between HEAD and `staging`
2. Classifies files as **safe** (changed only on staging) or **overlap** (changed on both)
3. Automatically migrates safe files
4. Performs line-level analysis on overlap files and flags any staging-added lines
   that still contain old color stops for manual review

```sh
node scripts/merge-migrate-color-stops.mjs --merge-from staging
```

### `/dt-migrate color-stops --merge-from staging --dry-run`

Preview the merge-scoped migration without modifying any files.

```sh
node scripts/merge-migrate-color-stops.mjs --merge-from staging --dry-run --verbose
```

**Options:** `--merge-from <branch>` (default: `staging`), `--dry-run`, `--force` (skip prompt), `--verbose` (show flagged lines).

> Note: `scripts/merge-migrate-color-stops.mjs` is a temporary script for the staging→next migration period. Delete it once the migration is complete.

## Migration Helper Location

Configs: `packages/dialtone-css/lib/build/js/dialtone_migration_helper/configs/`
Tests: `packages/dialtone-css/lib/build/js/dialtone_migration_helper/tests/`

## Post-Migration

After running any migration, recommend:

- Run ESLint: `pnpm nx run <project>:lint` to catch remaining base color usage
- Run Stylelint to catch remaining `var(--dt-color-{color}-{stop})` in CSS
- Review any unmapped patterns flagged by linters for manual resolution
