# PostCSS Responsive Variations Rules

Apply to `packages/postcss-responsive-variations/**`.

## Plugin Behavior

- Preserve existing generated class naming semantics.
- Keep breakpoints mobile-first and aligned with Dialtone responsive utility conventions.
- Avoid broad output changes without fixture coverage.

## Verification

- Run `pnpm nx run postcss-responsive-variations:test` after plugin changes.
- Add or update fixtures for new generated patterns.
