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

## Usage

### `/dt-migrate`
List all available migrations with descriptions.

### `/dt-migrate <name>`
Run the specified migration:
1. Confirm the target directory with the user (default: `./src`)
2. Run `npx dialtone-migration-helper --cwd <dir>` and select the named config
3. Report the number of files changed and matches replaced
4. Suggest running linters after migration to catch remaining manual fixes

### `/dt-migrate <name> --dry-run`
Preview changes without applying them.

## Migration Helper Location
Configs: `packages/dialtone-css/lib/build/js/dialtone_migration_helper/configs/`
Tests: `packages/dialtone-css/lib/build/js/dialtone_migration_helper/tests/`

## Post-Migration
After running any migration, recommend:
- Run ESLint: `pnpm nx run <project>:lint` to catch remaining base color usage
- Run Stylelint to catch remaining `var(--dt-color-{color}-{stop})` in CSS
- Review any unmapped patterns flagged by linters for manual resolution
