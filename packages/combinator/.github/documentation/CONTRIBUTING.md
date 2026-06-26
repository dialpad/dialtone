# Contribution guide

Dialtone Combinator lives in the Dialtone monorepo at
`packages/combinator`. Follow the root repository workflow for branch naming,
pull requests, and commit format.

## Before opening a pull request

Check whether the work already has a ticket or GitHub issue. If it does not,
create one through the normal Dialtone planning process before starting broad
changes.

For component API work, remember that Combinator variant files are part of the
component surface. Updating a Dialtone Vue component prop, slot, or supported
value usually requires an update to
`packages/combinator/src/variants/variants_<component>.js` and registration in
`packages/combinator/src/variants/variants.js`.

## Local commands

Run commands from the monorepo root unless the command uses `--dir`.

```bash
pnpm nx run dialtone-combinator:start
pnpm --dir packages/combinator test
pnpm --dir packages/combinator lint
pnpm nx run dialtone-combinator:build
```

The package `lint` script runs `eslint --fix src`. If you need a report-only
lint check, run ESLint directly:

```bash
pnpm --dir packages/combinator exec eslint src
```

## Pull request checklist

- Unit tests cover the changed behavior.
- Combinator tests pass locally.
- Run ESLint for touched Combinator files.
- The package builds when the change affects build output or imports.
- Update documentation when behavior, commands, settings, variants, or
  supported components change.

## Coding guidelines

Keep accessibility in mind for every feature and fix. Test keyboard behavior for
new interactive controls and use Dialtone Vue components and Dialtone utility
classes where they fit the UI.

The package uses flat ESLint config at
`packages/combinator/eslint.config.js`.

## Tests

Combinator has package-local Vitest tests under
`packages/combinator/src/**/*.test.js`. See
[internal/TESTING.md](internal/TESTING.md) for the current test map and command
notes.

## Breaking changes

The Dialtone documentation site and thumbnail tooling use Combinator.
Before changing public exports, props, variant behavior, or generated code
format, check the consumers and update their tests or docs in the same branch.

## Folder structure

See [OVERVIEW](OVERVIEW.md#folder-structure).

## Commit message convention

See [COMMIT_CONVENTION](COMMIT_CONVENTION.md).
