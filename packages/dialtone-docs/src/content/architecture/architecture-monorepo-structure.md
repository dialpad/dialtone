---
type: architecture
category: architecture
keywords: [monorepo, pnpm, nx, packages, apps, dialtone-vue, dialtone-css, dialtone-tokens, dialtone-icons, workspace]
ai_summary: Overview of the Dialtone pnpm+NX monorepo structure, its 12 packages, 1 app, and how they relate to each other.
last_updated: 2026-03-04
related_packages: [dialtone-vue, dialtone-css, dialtone-tokens, dialtone-icons, dialtone-emojis, dialtone-mcp-server]
---

# Monorepo Structure

Dialtone is a **pnpm workspace monorepo** managed by **NX 19**. All design system libraries, tooling, and documentation live in a single repository at `dialpad/dialtone`. The root package is `@dialpad/dialtone` (v9) which re-exports all packages as a convenience bundle.

## Why a Monorepo

All packages share the same versioning strategy, CI pipeline, and release cadence (every Tuesday 10:00 AM UTC via `semantic-release`). A monorepo ensures that a change touching tokens, CSS, and Vue components can be validated and released atomically — no cross-repo coordination needed.

## Top-Level Layout

```
dialtone/
├── packages/        # NPM-publishable libraries
├── apps/            # Deployable applications
├── scripts/         # Shared build scripts
├── common/          # Shared config files across packages
├── generator-dialtone/  # Yeoman generator for scaffolding new packages
└── .github/         # CI workflows, contributing guides
```

`pnpm-workspace.yaml` declares both `packages/*` and `apps/*` as workspace members. NX reads each package's `project.json` to understand build targets and dependencies.

## Packages

### Core Design System

These four packages form the foundation. They have a strict dependency order:

**`@dialpad/dialtone-tokens`** (v1) — the bottom of the stack. Design tokens generated from Figma via Style Dictionary. Outputs CSS custom properties, LESS variables, PostCSS variables, and JavaScript theme objects. Has no internal Dialtone dependencies.

**`@dialpad/dialtone-css`** (v8) — utility classes and component styles built with LESS, Gulp, and PostCSS. Depends on `dialtone-tokens` for all CSS variables. Outputs to `lib/dist/`.

**`@dialpad/dialtone-vue`** (v3) — 87 Vue 3 components. Depends on `dialtone-icons` and `dialtone-emojis` directly, and on `dialtone-css` and `dialtone-tokens` as peer dependencies. Component API docs are auto-generated via `vue-docgen-api` during the build step using `scripts/build-dialtone-vue-docs.mjs`. Outputs ESM and CJS formats to `dist/`.

**`@dialpad/dialtone-icons`** (v4) — 594 SVG icons available as raw SVG files and as Vue 3 components. Also exports a JSON keyword index for search. Has no internal Dialtone dependencies.

### Supporting Packages

**`@dialpad/dialtone-emojis`** — JSON emoji data consumed by `dialtone-vue`. No build step.

**`@dialpad/dialtone-mcp-server`** (v1) — Model Context Protocol server for AI assistants. Provides structured search across utilities (3,315 classes), tokens (5,691), components (87), and icons (594). Built with TypeScript and Rollup. Configured via `.mcp.json` at the repo root.

**`@dialpad/combinator`** — Vue component combinator tool for combining Dialtone Vue components programmatically. Depends on `dialtone-vue`, `dialtone-css`, and `dialtone-icons`.

**`@dialpad/dialtone-docs`** — This package. Generates AI-discoverable documentation from source files and validates documentation quality through automated tests.

### Linting and Tooling

**`eslint-plugin-dialtone`** — Custom ESLint rules enforcing correct Dialtone usage patterns. Tested with Mocha.

**`stylelint-plugin-dialtone`** — Custom Stylelint rules for CSS and LESS files.

**`postcss-responsive-variations`** — PostCSS plugin that generates responsive variants of utility classes.

**`@dialpad/language-server`** — Volar-based language tools for IDE autocompletion and validation when writing Dialtone code.

## Apps

**`dialtone-documentation`** (v1) — The public documentation site at [dialtone.dialpad.com](https://dialtone.dialpad.com). Built with VuePress 2. Contains 57+ component documentation pages, design guidelines, and utility references. Depends on all core packages as dev dependencies. Dev server runs on port 4000 via `nx run dialtone-documentation:start`.

## Package Dependency Graph

```
dialtone-tokens (standalone)
    └── dialtone-css
            └── dialtone-vue
                    ├── dialtone-icons (standalone)
                    └── dialtone-emojis (standalone)

combinator
    ├── dialtone-vue
    ├── dialtone-css
    └── dialtone-icons

dialtone-documentation (dev dependencies)
    ├── dialtone-vue
    ├── dialtone-css
    ├── dialtone-tokens
    ├── dialtone-icons
    └── combinator

dialtone-mcp-server (dev dependencies)
    ├── dialtone-css
    ├── dialtone-icons
    └── dialtone-vue
```

## Root Bundle

The root `@dialpad/dialtone` package bundles `dialtone-css`, `dialtone-tokens`, and `dialtone-vue` into a single installable package via a Gulp script (`gulpfile.cjs`). This lets teams install one package instead of three while still allowing individual package installs for tree-shaking.

```bash
# Single install (bundles CSS + tokens + Vue)
pnpm add @dialpad/dialtone

# Individual installs (recommended for tree-shaking)
pnpm add @dialpad/dialtone-vue @dialpad/dialtone-css @dialpad/dialtone-tokens
```

## NX Workspace Configuration

NX is configured via `nx.json` at the repo root. Each package defines its build targets in its own `project.json`. NX infers cross-package dependencies automatically from `package.json` imports and uses this graph to determine build order and what needs to be rebuilt after a change.

Key NX behaviors in this repo:
- Up to 5 tasks run in parallel during `nx run-many`
- Build outputs are cached locally; only changed packages rebuild
- `dependsOn` in `project.json` enforces explicit build ordering (e.g., `dialtone-vue:build` depends on `dialtone-icons:build`)

```bash
# Build all packages in dependency order
pnpm nx run-many --target=build

# Build a single package (NX handles deps automatically)
pnpm nx run dialtone-vue:build

# Run tests across all packages in parallel
pnpm nx run-many --target=test
```

Always use `nx run` instead of `pnpm run` to benefit from NX caching. Running `pnpm run` directly bypasses the cache and ignores dependency ordering.
