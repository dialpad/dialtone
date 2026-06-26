# Dialtone Combinator

Dialtone Combinator is the interactive playground package for Dialtone Vue components. It renders a selected component, exposes editable props and slots, and generates Vue template code from the current state.

## Features

- Renderer for the selected Dialtone Vue component.
- Option bar with Props, Slots, and Class tabs.
- Variant preset picker backed by `packages/combinator/src/variants/**`.
- Exclusion and dependency handling for invalid prop and slot combinations.
- Code panel that copies generated Vue template text from the data model.

## Documentation

- [Overview](.github/documentation/OVERVIEW.md)
- [Contributing](.github/documentation/CONTRIBUTING.md)
- [Usage](.github/documentation/USAGE.md)
- [Release process](.github/documentation/RELEASING.md)
- [Known issues](.github/documentation/KNOWN_ISSUES.md)

Internal maintainer docs live in
[.github/documentation/internal](.github/documentation/internal/).

## Install

Work from the Dialtone monorepo root:

```bash
pnpm i
```

## Run

```bash
pnpm nx run dialtone-combinator:start
```

The `start` target builds the Dialtone CSS, icons, tokens, and Vue packages, starts a watch for those packages, and runs the Combinator Vite dev server.

## Validate

```bash
pnpm --dir packages/combinator test
pnpm --dir packages/combinator lint
pnpm nx run dialtone-combinator:build
```

The package `lint` script runs ESLint with `--fix`.

## Links

- [Dialtone](https://github.com/dialpad/dialtone)
- [Dialtone Vue package](../dialtone-vue)
