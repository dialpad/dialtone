# Dialtone

The monorepo for Dialpad's design system Dialtone.

All packages of the monorepo are combined into a single Dialtone package for ease of use, however all separate packages of dialtone are also deployed individually. If you would like to use an individual package rather than the combined Dialtone package, you can find documentation for each package in the readme under the respective packages folder. The below usage instructions are for the combined package.

## Usage

### Install it via NPM:

#### Vue 3

```shell
npm install @dialpad/dialtone@next @tiptap/vue-3
```

#### Vue 2

```shell
npm install @dialpad/dialtone@next @linusborg/vue-simple-portal @tiptap/vue-2
```

### Import packages:

#### Dialtone CSS

Dialtone CSS includes all utility classes as well as tokens.

- CSS

```css
@import "@dialpad/dialtone/css";
```

- Javascript

```js
import "@dialpad/dialtone/css";
```

If you are using the Vue components, then import either Vue 2 or Vue 3 css:

- CSS

```css
@import "@dialpad/dialtone/vue2/css";
/* Or */
@import "@dialpad/dialtone/vue3/css";
```

- Javascript

```js
import "@dialpad/dialtone/vue2/css";
/* Or */
import "@dialpad/dialtone/vue3/css";
```

#### Dialtone icons

- Vue 2:

```js
// Named import
import { DtIconArrowUp } from '@dialpad/dialtone-icons/vue2';

// Default import (Prefered if using webpack as it is tree-shakeable by default)
import DtIconArrowUp from '@dialpad/dialtone-icons/vue2/arrow-up';
```

- Vue 3:

```js
// Named import
import { DtIconArrowUp } from '@dialpad/dialtone-icons/vue3';

// Default import (Prefered if using webpack as it is tree-shakeable by default)
import DtIconArrowUp from '@dialpad/dialtone-icons/vue3/arrow-up';
```

#### Dialtone Vue components

- Vue 2

```js
// Named import
import { DtButton } from "@dialpad/dialtone/vue2"

// Default import (Prefered if using webpack as it is tree-shakeable by default)
import { DtButton } from "@dialpad/dialtone/vue2/lib/button"
```

- Vue 3

```js
// Named import
import { DtButton } from "@dialpad/dialtone/vue3"

// Default import (Prefered if using webpack as it is tree-shakeable by default)
import { DtButton } from "@dialpad/dialtone/vue3/lib/button"
```

## About this repo

The @dialpad/dialtone repository is a monorepo composed of Dialtone NPM packages and apps.

The following is a list of packages included in this monorepo. Note that libraries (packages folder) are separated from
apps (apps folder):

```text
dialtone/
|--- .github                      # Github configuration and workflows
|--- apps                         # Apps
  |--- dialtone-documentation     # Documentation site
|--- packages                     # NPM packages
  |--- dialtone-css               # CSS library
  |--- dialtone-emojis            # Emoji assets
  |--- dialtone-vue2              # Vue component library compatible with vue@2
  |--- dialtone-vue3              # Vue component library compatible with vue@3
  |--- dialtone-icons             # SVG icons library
  |--- dialtone-tokens            # Tokens library
  |--- eslint-plugin-dialtone     # Custom ESLint rules for Dialtone users
  |--- stylelint-plugin-dialtone  # Custom Stylelint rules for Dialtone users
|--- scripts                      # Shared scripts
```

## Contributing

Please read our [contributing guide](.github/CONTRIBUTING.md) **before submitting a pull request**.

### Quick start

If you would like to contribute to Dialtone without having to do any local environment setup, you can use GitHub
Codespaces. You can initialize a new Codespace by clicking the green "Code" button at the top right of the Dialtone
GitHub page.

![Creating a codespace](./.github/new_codespace.png)

Please see the [Codespaces docs](./.github/codespaces.md) for more information.

### Local development

#### PNPM

PNPM (Performant NPM) is a package management solution designed to address the challenges posed by
traditional package managers.

We use PNPM to manage everything related to NPM, **adding, installing, removing and publishing packages**.

You will need to install PNPM locally to contribute to this project. <https://pnpm.io/installation>

##### Installation

```bash
npm install -g pnpm
```

##### Do

Use PNPM to manage package dependencies

```bash
pnpm add eslint --filter dialtone-icons
```

##### Don't

Run package scripts with PNPM, this will not use NX cache and pipelines,
so you might end up missing dependencies that needed to be built before.

```bash
pnpm run --filter dialtone-css build
```

#### NX

Nx is a build system with built-in tooling and advanced CI capabilities.
It helps you maintain and scale monorepos, both locally and on CI.

NX manages the scheduling and caching of our PNPM scripts.

We still rely on the package installation and package linking mechanism that PNPM workspaces provide us,
but use Nx instead to **run our tasks in the most efficient way**.

One of the main benefits of adding Nx to our PNPM workspace is speed via caching.

Running commands via NX will enable us to do several things:

- Setup the project dependencies to other projects command,
if they need to run before a specific command.
- Improve the speed of the command execution by saving its output to cache.
- Run the command on the [affected](https://nx.dev/nx-api/nx/documents/affected) projects only.

⚠️ You can run the commands with PNPM too, but it's not advisable as You'll lose the advantages that NX provides.

For more information, check [setup a monorepo with PNPM workspaces and NX](https://blog.nrwl.io/setup-a-monorepo-with-pnpm-workspaces-and-speed-it-up-with-nx-bc5d97258a7e#d69f)

##### Installation

It is recommended to install NX globally via:

```bash
pnpm add --global nx@latest
```

##### Do

Use NX to run scripts, this will use cache, improve the performance,
and build any dependency needed before running your command.

```bash
nx run dialtone-css:build
```

##### Don't

Try installing packages with NX, this doesn't work at all, please use PNPM instead.

```bash
nx add eslint --filter dialtone-icons
```

#### Running the projects

First, install the dependencies for all the monorepo packages and apps.

```bash
pnpm install
```

##### Dialtone documentation site

```bash
nx start:dialtone
```

This will start the documentation site and watch the library for changes, it will be live updated with any changes.

Access the local server at `http://localhost:4000`

##### Dialtone Vue 2 storybook

```bash
nx start:dialtone-vue2
```

Access the local storybook server for Dialtone Vue 2 via `http://localhost:9010/`

##### Dialtone Vue 3 storybook

```bash
nx start:dialtone-vue3
```

Access the local storybook server for Dialtone Vue 3 via `http://localhost:9011/`

#### Common Commands

##### Production build the root project

```bash
nx build
```

##### Run all Vue unit tests

```bash
nx test
```

##### Run Vue 2 tests

```bash
nx test dialtone-vue2
```

##### Run Vue 3 tests

```bash
nx test dialtone-vue3
```

Use the `--filter` flag to run commands for a specific package or app.

##### Adding dependencies for individual packages

```bash
pnpm add <dependency> --filter <package or app name>
```

Example:

```bash
pnpm add eslint --filter dialtone-icons
```

To install a local dependency, just add the `--workspace` flag

```bash
pnpm add <dependency> --filter <package or app name> --workspace
```

Example:

```bash
pnpm add @dialpad/dialtone-tokens --filter dialtone-icons --workspace
```

##### Running commands for individual packages

You can run commands like `build`, `test`, `start` for individual packages from
the root of the project with:

```bash
nx <command> <package/app>
```

Example:

```bash
nx build dialtone-documentation
```

### Releasing

Running these commands will call [release.sh](./scripts/release.sh) which
automatically release all packages that need to be released.

Once done, a GitHub Action will be triggered, you can check the progress here:
[release.yml](https://github.com/dialpad/dialtone/actions/workflows/release.yml)

If something goes wrong, and you need to re-run the release, you can run the workflow manually through the `Run workflow`
option on GitHub.

Select the `production` branch and pass the `commit SHA` which you would like to be the base to detect the changes or
choose a `package` to release individually.

#### Production

This can only be run while on **staging** branch. After running the command, it will execute the following steps:

1. Run build on the affected projects to improve the speed of the next step.
2. Run release-local script on the affected projects to verify and increase the version according to commits.
3. Merge `staging` version changes to `production`
4. Push `production` branch.
   - A GHA will publish the release on npm and GitHub with `@latest` tag.
5. Merge changes from `production` back to `staging`

```bash
nx run release
```

#### Alpha/Beta

Needs to be run while on your feature branch. After running the command, it will execute the following steps:

1. Delete local and remote `alpha/beta` branch.
2. Checkout to a clean `alpha/beta` branch and push to origin.
3. Run build on the affected projects to improve the speed of the next step.
4. Run release-local script on the affected projects to verify and increase the version according to commits.
5. Push updated `alpha/beta` branch to origin.
   - A GHA will publish the release on npm and GitHub with `@alpha` or `@beta` tag.
6. Merge changes from `alpha/beta` back to your feature branch.

```bash
nx run dialtone:release:alpha
```

```bash
nx run dialtone:release:beta
```
