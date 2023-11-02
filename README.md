# Dialtone

## About this repo

The dialtone repository is a monorepo composed of Dialtone NPM packages.

```sh
dialtone/
|--- .github                    # Github configuration and workflows
|--- packages                   # NPM packages
  |--- dialtone                 # Dialtone CSS library
  |--- dialtone-icons           # Dialtone SVG icons library
  |--- dialtone-tokens          # Dialtone tokens library
  |--- eslint-plugin-dialtone   # Dialtone tokens library
|--- scripts                    # Shared scripts
```

## Tooling
- We use [pnpm](https://pnpm.io) for managing workspaces
- We use [Nx](https://nx.dev/) as build system for improved speed and easier monorepo administration.

## Local development

Use the `--filter` flag to run commands
for a specific package or app.

### Adding dependencies

```bash
pnpm add <dependency> --filter <package/app> 
```

To install a local dependency, just add the `--workspace` flag

```bash
pnpm add <dependency> --filter <package/app> --workspace
```

### Running commands

You can run commands like `build`, `test`, `start` from
the root of the project with:

```bash
npx nx <command> <package/app>
```

### Releasing

```bash
pnpm run release
```