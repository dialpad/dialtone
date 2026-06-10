# Dialtone CLI Rules

Apply to `packages/dialtone-cli/**`.

## Scope

- The CLI is a thin interface over query-core.
- Search behavior changes belong in query-core unless the change is only argument parsing, formatting, or command wiring.

## Commands

- Validate arguments with clear user-facing errors.
- Keep command output stable and script-friendly.

## Verification

- Build the CLI after source changes.
- Run query-core tests when CLI changes depend on query behavior.
