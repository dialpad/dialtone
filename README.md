# Dialtone

The monorepo for Dialpad's design system Dialtone.

All separate packages of dialtone are also deployed individually.
If you would like to use an individual package rather than the combined Dialtone package,
you can find documentation for each package in the following table.

## Usage

The below usage instructions are for the combined package.

### Install it via NPM:

#### Vue 3

```shell
npm install @dialpad/dialtone@latest @tiptap/vue-3
```

#### Vue 2

```shell
npm install @dialpad/dialtone@latest @linusborg/vue-simple-portal @tiptap/vue-2
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

#### Dialtone Tokens

Dialtone tokens doesn't have a default export, so you need to access
the files directly as following:

- CSS

```css
@import "@dialpad/dialtone/tokens/variables-light.css" // Light tokens
@import "@dialpad/dialtone/tokens/variables-dark.css" // Dark tokens
```

- LESS

```less
@import "@dialpad/dialtone/tokens/variables-light.less" // Light tokens
@import "@dialpad/dialtone/tokens/variables-dark.less" // Dark tokens
```

- JSON

```js
import "@dialpad/dialtone/tokens/tokens-light.json" // Light tokens
import "@dialpad/dialtone/tokens/tokens-dark.json" // Dark tokens
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

### Available packages

| Name                                                             | Description                                                                                                                                        | Version                                                                                                   |
|------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| [Dialtone](README.md)                                            | Combined package containing the latest versions of the libraries for ease of use                                                                   | ![NPM Version](https://img.shields.io/npm/v/%40dialpad%2Fdialtone?logo=npm&color=7C52FF)                  |
| [Dialtone CSS](packages/dialtone-css/README.md)                  | Classes or styles used within Dialtone should be stored here and documented on our site under `apps/dialtone-documentation`                        | ![NPM Version](https://img.shields.io/npm/v/%40dialpad%2Fdialtone-css?logo=npm&color=7C52FF)              |
| [Dialtone emojis](packages/dialtone-emojis/README.md)            | Emoji assets                                                                                                                                       | ![NPM Version](https://img.shields.io/npm/v/%40dialpad%2Fdialtone-emojis?logo=npm&color=7C52FF)           |
| [Dialtone icons](packages/dialtone-icons/README.md)              | Resources needed to implement icons on your application that conform to Dialpad’s design principles and best practices                             | ![NPM Version](https://img.shields.io/npm/v/%40dialpad%2Fdialtone-icons?logo=npm&color=7C52FF)            |
| [Dialtone tokens](packages/dialtone-tokens/README.md)            | Design tokens for Dialpad's design system Dialtone and everything related to building and publishing them                                          | ![NPM Version](https://img.shields.io/npm/v/%40dialpad%2Fdialtone-tokens?logo=npm&color=7C52FF)           |
| [Dialtone vue 2](packages/dialtone-vue2/README.md)               | Vue components library to simplify and standardize the use of common UI patterns and behaviour across all Dialpad projects (compatible with Vue 2) | ![NPM Version](https://img.shields.io/npm/v/%40dialpad%2Fdialtone-vue?logo=npm&color=7C52FF)              |
| [Dialtone vue 3](packages/dialtone-vue3/README.md)               | Vue components library to simplify and standardize the use of common UI patterns and behaviour across all Dialpad projects (compatible with Vue 3) | ![NPM Version](https://img.shields.io/npm/v/%40dialpad%2Fdialtone-vue/vue3?logo=npm&color=7C52FF)         |
| [ESlint plugin](packages/eslint-plugin-dialtone/README.md)       | ESLint plugin containing rules to help developers maintain dialtone recommended practices                                                          | ![NPM Version](https://img.shields.io/npm/v/%40dialpad%2Feslint-plugin-dialtone?logo=npm&color=7C52FF)    |
| [Stylelint plugin](packages/stylelint-plugin-dialtone/README.md) | StyleLint plugin containing rules to help developers maintain dialtone recommended practices for CSS                                               | ![NPM Version](https://img.shields.io/npm/v/%40dialpad%2Fstylelint-plugin-dialtone?logo=npm&color=7C52FF) |

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

Currently, Dialtone packages are being release in two different ways: `scheduled` and `manually`.
The `scheduled` release will only release changes to `production` while `manually` you can choose to release
`alpha`, `beta` or `next` branches.

#### Production

##### Scheduled

On every Tuesday at 10:00 am UTC, [release action](.github/workflows/release.yml) will trigger the production release process which
automatically release all packages that need to be released following the next steps:

1. Run the `nx release` on every project.
2. Merge the release commits created by the semantic release bot on `staging` to `production` branch.
3. Push the `production` branch.
4. An [action](https://github.com/dialpad/dialtone/actions/workflows/publish.yml) will publish the packages with its corresponding tag.

##### Manually

In case you need to release earlier than the next scheduled date, you can trigger the release via `Run workflow` on [GitHub](https://github.com/dialpad/dialtone/actions/workflows/release.yml).

  1. Select `staging` branch.
  2. Select the `package` that you want to release or leave it empty to release all of them.

This will trigger the [release action](.github/workflows/release.yml), release changes on `staging` and automatically publish the selected packages following the next steps:

1. Run the `nx release` on selected packages (all if `package` is empty).
2. Merge the release commits created by the semantic release bot on `staging` to `production` branch.
3. Push the `production` branch.
4. An [action](https://github.com/dialpad/dialtone/actions/workflows/publish.yml) will publish the packages with its corresponding tag.

```bash
nx run release
```

#### Alpha/Beta/Next

##### Manually

1. Merge your changes to the branch you want to release, commit and push to origin.
2. Go to [GitHub](https://github.com/dialpad/dialtone/actions/workflows/release.yml) and click on `Run workflow`.
3. Select `alpha`, `beta` or `next` branch.
4. Select the `package` that you want to release or leave it empty to release all of them.

This will trigger the [release action](.github/workflows/release.yml), release changes on the selected branch and automatically publish the selected packages following the next steps:

1. Run the `nx release` on selected packages (all if `package` is empty).
2. An [action](https://github.com/dialpad/dialtone/actions/workflows/publish.yml) will publish the packages with its corresponding tag.
