# Dialtone

The monorepo for Dialpad's design system Dialtone.

## About this repo

The @dialpad/dialtone repository is a monorepo composed of independently released Dialtone NPM packages.

The following is a list of packages included in this monorepo. Note that libraries (packages folder) are separated from apps (apps folder):

```sh
dialtone/
|--- .github                    # Github configuration and workflows
|--- apps                       # Apps
  |--- dialtone-documentation   # Documentation site
|--- packages                   # NPM packages
  |--- dialtone                 # Dialtone CSS library
  |--- dialtone-icons           # Dialtone SVG icons library
  |--- dialtone-tokens          # Dialtone tokens library
  |--- eslint-plugin-dialtone   # Custom ESLint rules for Dialtone users
|--- scripts                    # Shared scripts
```

## Tooling

- We use [pnpm](https://pnpm.io) for managing workspaces

If you do not have pnpm installed, you can install it with:

```bash
npm install -g pnpm
```

- We use [Nx](https://nx.dev/) as build system for improved speed and easier monorepo administration.
nx is installed as a dev dependency in the root of the project.

## Quick start

Once pnpm is installed, in the monorepo root run:

```bash
pnpm install
```

This will install the dependencies for all packages.

In order to run dialtone locally, you can use:

```bash
# This will start the server for the documentation site and the library so it is live updated with any changes.
pnpm run start:dialtone
```

Access the local server at `http://localhost:4000`

For dialtone vue 2 storybook and library run:

```bash
pnpm run start:dialtone-vue2
```

Access the local storybook server for Dialtone Vue 2 via `http://localhost:9010/`

For dialtone vue 3 storybook and library run:

```bash
pnpm run start:dialtone-vue3
```

Access the local storybook server for Dialtone Vue 3 via `http://localhost:9011/`

## Local development

Use the `--filter` flag to run commands
for a specific package or app.

### Adding dependencies for individual packages

```bash
pnpm add <dependency> --filter <package/app>
```

To install a local dependency, just add the `--workspace` flag

```bash
pnpm add <dependency> --filter <package/app> --workspace
```

### Running commands for individual packages

You can run commands like `build`, `test`, `start` from
the root of the project with:

```bash
pnpm nx <command> <package/app>
```

Example:

```bash
pnpm nx build dialtone-documentation
```

### Releasing

```bash
pnpm run release:all
```

This will automatically release all packages that need to be released.
