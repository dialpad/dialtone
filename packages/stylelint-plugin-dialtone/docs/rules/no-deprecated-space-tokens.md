# Detects usage of deprecated space tokens (no-deprecated-space-tokens)

For the Dialtone 9 to 10 migration, legacy space tokens (`--dt-space-*`) use the preferred `space-to-spacing` route. This rule recommends an exact spacing equivalent when the CSS property supports it. Unsupported values, percentages and other property contexts require manual review.

## Rule Details

This rule aims to detect and prevent usage of deprecated `--dt-space-*` tokens.

Examples of **incorrect** code for this rule:

```css
.card {
  padding: var(--dt-space-400);
  margin-bottom: var(--dt-space-300);
  gap: var(--dt-space-200);
}

.overlap {
  margin-top: var(--dt-space-400-negative);
}
```

Examples of **correct** code for this rule:

```css
.card {
  padding: var(--dt-spacing-100);
  margin-bottom: var(--dt-spacing-50);
  gap: var(--dt-spacing-25);
}

.overlap {
  margin-top: var(--dt-spacing-100-negative);
}
```

## Migration

Run the binary exposed by `@dialpad/dialtone-css` and select the preferred configuration:

```bash
npx --package @dialpad/dialtone-css dialtone-migration-helper --cwd ./src
# Select "space-to-spacing" from the config list
```

`--dt-space-400` and `--dt-spacing-100` both represent 8px; keeping the old suffix would change the value. The negative variant follows the same route. Subpixel, percentage and out-of-scale values remain unchanged for manual review. Verify that the installed target provides the recommended token before migrating.

See the [layout and spacing migration guide](https://dialtone.dialpad.com/guides/migration/layout-and-spacing-tokens/).
