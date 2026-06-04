# ESLint Plugin Rules

Apply to `packages/eslint-plugin-dialtone/**`.

## Rule Work

- Register new rules in the established package entrypoints.
- Keep rule metadata, messages, docs, and tests in sync.
- Tests should cover valid and invalid cases with focused assertions.

## Verification

- Run `pnpm nx run eslint-plugin-dialtone:test` after rule changes.
