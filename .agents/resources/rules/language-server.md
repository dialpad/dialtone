# Language Server Rules

Apply to `packages/language-server/**`.

## Architecture

- Language-server behavior depends on Dialtone data sources and query behavior.
- Keep protocol-facing responses stable and quiet.
- Do not write debug output to stdout in server code.

## Data

- When completions or docs lookup depend on generated data, update or rebuild the owning package instead of editing generated output directly.

## Verification

- Build the language server after source changes.
- Run relevant query-core validation when data/search behavior changes.
