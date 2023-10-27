# Design system monorepo

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

As we have projects with the same name over `package.json` to release the package to npm,
you need to specify the relative path to that project when installing packages unless
you want to install the dependency to both, e.g:

This command will install <dependency> on both `packages/dialtone-icons-vue2` and `packages/dialtone-icons-vue3`

```bash
pnpm add <dependency> --filter @dialpad/dialtone-icons -D
```

Use relative path if you want to install the dependency on just one project instead. 

```bash
pnpm add <dependency> --filter './packages/dialtone-icons-vue2' -D
```

### Running commands

You can run commands like `build`, `test`, `start` from
the root of the project with:

```bash
npx nx <command> <package/app>
```
