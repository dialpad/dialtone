# Tests

Combinator uses Vitest for package-local unit tests. Test files live under
`packages/combinator/src/**/*.test.js`.

## Commands

From the monorepo root:

```bash
pnpm --dir packages/combinator test
pnpm --dir packages/combinator exec vitest run src/lib/exclusion_rules.test.js
pnpm --dir packages/combinator exec vitest run src/components/option_bar/option_bar_member_group.test.js
```

`pnpm nx run dialtone-combinator:test` is also available through the Nx project
and depends on `dialtone-vue:build`.

## Current test areas

The package currently has tests for:

- base app behavior;
- root Combinator behavior;
- code editor behavior;
- controls;
- event console components;
- option bar behavior;
- renderer target behavior;
- node rendering;
- control selection;
- exclusion rules;
- info processing;
- prop dependency inference;
- utility functions.

## Test setup

Vitest config lives in `packages/combinator/vite.config.js`. The package setup
file is `packages/combinator/tests/setupTests.js`.

Use focused tests for changes in `src/lib/**` and component tests for mounted UI
behavior. When a variant rule changes control availability or generated code,
prefer a focused test around the rule engine or member group rather than a broad
snapshot.

## Add tests

- Put tests beside the code under test.
- Use existing test utilities from `src/lib/test/utils_test.js` when mounting
  Combinator components.
- Cover both positive and negative rule paths for exclusions and dependencies.
- Run `git diff --check` after documentation edits and before handing off.
