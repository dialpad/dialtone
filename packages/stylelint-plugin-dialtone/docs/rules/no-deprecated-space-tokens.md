# Detects usage of deprecated space tokens (no-deprecated-space-tokens)

Space tokens (`--dt-space-*`) have been deprecated in favor of size tokens (`--dt-size-*`). This rule detects usage of deprecated space tokens and suggests the equivalent size token.

## Rule Details

This rule aims to detect and prevent usage of deprecated `--dt-space-*` tokens.

Examples of **incorrect** code for this rule:

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

Use the migration tool to automatically convert all space tokens to size tokens:

```bash
npx dialtone-migration-helper --cwd ./src
# Select "space-to-size" from the config list
```

For more details, see the [migration guide](https://dialtone.dialpad.com/about/whats-new/posts/2026-1-13.html).
