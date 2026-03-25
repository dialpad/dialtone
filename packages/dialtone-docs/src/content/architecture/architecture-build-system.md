---
type: architecture
category: architecture
keywords: [nx, pnpm, build, workspace, project.json, package.json, gulp, semantic-release, new-package, add-package, workspace-protocol]
ai_summary: How the Dialtone build system works with NX and pnpm, and the exact steps to add a new package to the monorepo.
last_updated: 2026-03-04
related_packages: [dialtone-vue, dialtone-css, dialtone-tokens, dialtone-icons]
---

# Build System

Dialtone uses **NX 19** as the task orchestrator and **pnpm 9** as the package manager. NX handles build ordering, caching, and parallel execution. pnpm handles dependency installation and workspace linking.

## How NX Works Here

NX reads `nx.json` at the repo root and a `project.json` file inside every package. The `project.json` defines what targets (build, test, lint, publish) a package has and how to run them.

```json
// nx.json (root)
{
  "extends": "nx/presets/npm.json",
  "targetDefaults": {
    "build*": { "cache": true },
    "publish*": { "dependsOn": ["build", "^build"] }
  },
  "parallel": 5
}
```

Key behaviors:
- All `build` targets are **cached** — NX skips rebuilding if inputs haven't changed
- All `publish` targets automatically depend on `build` for that package and `^build` (build of all upstream packages)
- Up to **5 tasks run in parallel** by default

**Always use `nx run` or `pnpm nx run-many`, never `pnpm run` directly.** Running package scripts directly bypasses NX caching and dependency ordering.

```bash
# Correct — uses NX caching and ordering
pnpm nx run dialtone-vue:build
pnpm nx run-many --target=build

# Wrong — bypasses NX entirely
cd packages/dialtone-vue && pnpm run build
```

## pnpm Workspaces

`pnpm-workspace.yaml` at the repo root declares all workspace members:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/dialtone-icons/*'
  - 'packages/language-server/*'
  - 'generator-dialtone'
```

Packages reference each other using the **workspace protocol** in `package.json`:

```json
{
  "dependencies": {
    "@dialpad/dialtone-icons": "workspace:*",
    "@dialpad/dialtone-tokens": "workspace:*"
  }
}
```

`workspace:*` links to the local copy of that package regardless of version. During publishing, pnpm replaces this with the actual published version number automatically. Use `workspace:*` for dependencies and `workspace:^` when you want semver-compatible updates.

Nested packages (like `packages/dialtone-icons/vue3/`) need their own explicit entry in `pnpm-workspace.yaml`. A wildcard for the parent (`packages/*`) does **not** automatically pick up subdirectories.

## Build Order

NX derives the build order from the `dependsOn` field in each `project.json`. The current chain:

```
dialtone-tokens:build          (no dependencies — builds first)
       ↓
dialtone-css:build             (dependsOn: dialtone-tokens:build)
dialtone-icons:build           (no dependencies — builds in parallel with css)
       ↓
dialtone-vue:build             (dependsOn: dialtone-icons:build)
       ↓
dialtone-documentation:build  (dependsOn: all core packages)
```

`dialtone-vue:build` runs two commands sequentially:
1. `pnpm exec vite build` — compiles Vue components to `dist/`
2. `node ../../scripts/build-dialtone-vue-docs.mjs` — generates `dist/component-documentation.json` from JSDoc comments using `vue-docgen-api`

## Root Bundle (Gulp)

The root `@dialpad/dialtone` package aggregates individual package outputs via `gulpfile.cjs`. Running `nx run dialtone:build` triggers all package builds and then copies their `dist/` outputs into the root `/dist/`:

```
packages/dialtone-css/lib/dist/     → /dist/css/
packages/dialtone-tokens/dist/      → /dist/tokens/
packages/dialtone-vue/dist/         → /dist/vue3/
```

The root `package.json` exports everything from `/dist/`, so `@dialpad/dialtone` is a single-install convenience package. Individual packages remain independently installable.

## Yeoman Generator (Components, Not Packages)

The `generator-dialtone/` Yeoman generator creates **Vue components inside `dialtone-vue`** — not new workspace packages. Use it when adding a new component to the existing library:

```bash
cd packages/dialtone-vue
pnpm exec yo dialtone
```

It generates the `.vue` file, `index.js`, Vitest tests, Storybook stories, and MDX documentation. Do not use this for creating new packages.

---

## Adding a New Package

This is the complete process for adding a publishable package to the Dialtone monorepo. Every step is required. Missing any one of them causes NX to fail, releases to break, or pre-commit hooks to not run.

### Step 1 — Create the directory

```bash
mkdir -p packages/dialtone-{feature}/src
```

Replace `{feature}` with the kebab-case name (e.g., `dialtone-docs`, `dialtone-analytics`).

### Step 2 — package.json

Every publishable Dialtone package uses the `@dialpad/` scope and `"type": "module"`.

```json
{
  "name": "@dialpad/dialtone-{feature}",
  "version": "1.0.0",
  "description": "Description of what this package does",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "test": "vitest run",
    "lint": "eslint ."
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/dialpad/dialtone.git",
    "directory": "packages/dialtone-{feature}"
  },
  "license": "MIT",
  "sideEffects": false
}
```

If the package depends on another Dialtone package, add it using `workspace:*`:

```json
{
  "dependencies": {
    "@dialpad/dialtone-tokens": "workspace:*"
  }
}
```

If a script should be visible to NX as a target (and you want NX caching), add it to `nx.includedScripts`:

```json
{
  "nx": {
    "includedScripts": ["lint", "test"]
  }
}
```

### Step 3 — project.json

This is the most critical file. Without it NX does not know the package exists.

```json
{
  "name": "dialtone-{feature}",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "inputs": ["{projectRoot}/src/**/*", "{projectRoot}/package.json"],
      "outputs": ["{projectRoot}/dist"],
      "options": {
        "cwd": "{projectRoot}",
        "command": "pnpm exec vite build"
      }
    },
    "test": {
      "executor": "nx:run-script",
      "options": { "script": "test" }
    },
    "lint": {
      "executor": "nx:run-script",
      "options": { "script": "lint" }
    },
    "publish": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm publish --filter ./packages/dialtone-{feature}"
      }
    },
    "release": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm semantic-release-plus --extends ./packages/dialtone-{feature}/release-ci.config.cjs && sleep 3",
        "parallel": false
      }
    }
  }
}
```

**If your package must build after another package**, declare it explicitly:

```json
{
  "targets": {
    "build": {
      "dependsOn": ["dialtone-tokens:build"],
      "executor": "nx:run-commands",
      ...
    }
  }
}
```

**If your build has multiple sequential commands** (like dialtone-vue does), use `commands` (array) with `parallel: false`:

```json
{
  "options": {
    "cwd": "{projectRoot}",
    "commands": [
      "rm -rf dist",
      "pnpm exec vite build",
      "node ./post-build-script.mjs"
    ],
    "parallel": false
  }
}
```

The `inputs` and `outputs` fields tell NX what files to watch for cache invalidation. If `inputs` is missing, NX cannot cache the build correctly and will rebuild on every run.

### Step 4 — release-ci.config.cjs

Required for `semantic-release` to version and publish the package correctly:

```javascript
const name = 'dialtone-{feature}';
const srcRoot = `packages/${name}`;

module.exports = {
  pkgRoot: srcRoot,
  tagFormat: name + '/v${version}',
  commitPaths: [`${srcRoot}/*`],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'angular' }],
    ['@semantic-release/release-notes-generator', {
      config: '@dialpad/conventional-changelog-angular',
    }],
    ['@semantic-release/changelog', { changelogFile: `${srcRoot}/CHANGELOG.md` }],
    ['@dialpad/semantic-release-changelog-json', {
      changelogFile: `${srcRoot}/CHANGELOG.md`,
      changelogJsonFile: `${srcRoot}/CHANGELOG.json`,
    }],
    ['@semantic-release/npm', { npmPublish: false }],
    ['@semantic-release/git', {
      assets: [`${srcRoot}/CHANGELOG.md`, `${srcRoot}/package.json`],
    }],
  ],
};
```

The `tagFormat` must use the package name as prefix (e.g., `dialtone-docs/v1.0.1`). Without this, semantic-release cannot distinguish which package a git tag belongs to in the monorepo.

### Step 5 — .lintstagedrc.cjs

Required for pre-commit hooks to run linting on staged files in this package:

```javascript
const baseConfig = require('../../.lintstagedrc.js');
module.exports = { ...baseConfig };
```

### Step 6 — Install dependencies

From the **repo root**, not from inside the package:

```bash
pnpm install
```

Running `pnpm install` from inside a workspace package directory can corrupt the lockfile. Always install from root.

### Step 7 — Verify NX detects the package

```bash
pnpm nx show project dialtone-{feature}
```

This prints the resolved project configuration. If it errors, check that `project.json` has the correct `name` field and the directory is inside `packages/*`.

### Step 8 — Run the build

```bash
pnpm nx run dialtone-{feature}:build
```

---

## Required Files Summary

| File | Purpose | Required |
|------|---------|----------|
| `package.json` | Package identity, exports, dependencies | Yes |
| `project.json` | NX targets — build, test, publish, release | Yes |
| `release-ci.config.cjs` | Semantic-release versioning config | Yes |
| `.lintstagedrc.cjs` | Pre-commit lint hook config | Yes |
| `vite.config.js` | Vite build config (if using Vite) | If using Vite |
| `tsconfig.json` | TypeScript config (if using TypeScript) | If using TypeScript |

## Common Mistakes

**Missing `inputs`/`outputs` in project.json** — NX will not cache the build. Every run rebuilds from scratch. Always declare what files the build reads and where it writes.

**Running `pnpm install` from inside a package directory** — Corrupts the lockfile. Always run from the repo root.

**Using `pnpm run build` instead of `nx run package:build`** — Bypasses caching and dependency ordering. NX will not know to build upstream packages first.

**Forgetting `dependsOn` when your package imports another** — The build may succeed locally (because packages are already built) but fail in CI where nothing is pre-built.

**Adding a nested sub-package without updating `pnpm-workspace.yaml`** — pnpm will not link it as a workspace member. The `packages/*` glob does not recurse into subdirectories.
