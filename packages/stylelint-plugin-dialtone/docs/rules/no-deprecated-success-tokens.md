# Detects usage of deprecated success color tokens (no-deprecated-success-tokens)

Success-named color tokens (`--dt-color-foreground-success-*`, `--dt-color-surface-success-*`, `--dt-color-border-success-*`, `--dt-color-link-success-*`) have been deprecated in favor of `positive`-named tokens. This rule detects usage of deprecated success tokens and suggests the equivalent positive token.

## Rule Details

This rule aims to detect and prevent usage of deprecated `--dt-color-<role>-success-*` tokens, where `<role>` is one of `foreground`, `surface`, `border`, or `link`.

Examples of **incorrect** code for this rule:

```css
.card {
  background-color: var(--dt-color-surface-success);
  border-color: var(--dt-color-border-success-subtle);
  color: var(--dt-color-foreground-success-strong);
}

.card a {
  color: var(--dt-color-link-success);
}

.card-inverted {
  color: var(--dt-color-foreground-success-inverted);
}
```

Examples of **correct** code for this rule:

```css
.card {
  background-color: var(--dt-color-surface-positive);
  border-color: var(--dt-color-border-positive-subtle);
  color: var(--dt-color-foreground-positive-strong);
}

.card a {
  color: var(--dt-color-link-positive);
}

.card-inverted {
  color: var(--dt-color-foreground-positive-inverted);
}
```

## Migration

Use the migration tool to automatically convert all success color tokens to positive color tokens:

```bash
npx dialtone-migration-helper --config success-to-positive
```
