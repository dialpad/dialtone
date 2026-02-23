# Dialtone Design System

Dialtone is Dialpad's design system — a monorepo providing tokens, CSS utilities, Vue components, documentation, and developer tooling for building consistent UIs across Dialpad products.

## Monorepo Structure

```text
packages/
  dialtone-tokens/       # Design tokens (color, space, typography, shadows) → JSON/CSS/iOS/Android
  dialtone-css/          # CSS utility classes built with gulp + Less
  dialtone-vue/          # Vue 3 component library (58+ components)
  dialtone-icons/        # SVG icons → Vue components (vue3/, android/)
  dialtone-emojis/       # Emoji assets
  dialtone-mcp-server/   # MCP server for Claude Code (component/utility/token search)
  language-server/       # LSP for IDE completions
  eslint-plugin-dialtone/    # ESLint rules for Dialtone usage
  stylelint-plugin-dialtone/ # Stylelint rules for Dialtone CSS
  postcss-responsive-variations/ # PostCSS plugin for responsive utility classes
  combinator/            # Visual regression testing tool
apps/
  dialtone-documentation/ # VuePress 2 documentation site
```

### Dependency Graph

```text
dialtone-tokens → dialtone-css → dialtone-vue → dialtone-documentation
                                              → dialtone-mcp-server
                                              → language-server
```

## Build Commands

All builds use Nx. Run from the repo root:

| Package | Build | Test | Lint |
| --------- | ------- | ------ | ------ |
| dialtone-tokens | `pnpm nx run dialtone-tokens:build` | — | — |
| dialtone-css | `pnpm nx run dialtone-css:build` | — | `pnpm nx run dialtone-css:lint` |
| dialtone-vue | `pnpm nx run dialtone-vue:build` | `pnpm nx run dialtone-vue:test` | `pnpm nx run dialtone-vue:lint` |
| dialtone-documentation | `pnpm nx run dialtone-documentation:build` | — | `pnpm nx run dialtone-documentation:lint` |
| dialtone-mcp-server | `pnpm nx run dialtone-mcp-server:build` | — | — |
| language-server | `pnpm nx run language-server:build` | — | — |
| eslint-plugin-dialtone | — | `pnpm nx run eslint-plugin-dialtone:test` (Mocha) | — |
| stylelint-plugin-dialtone | — | `pnpm nx run stylelint-plugin-dialtone:test` (node --test) | — |
| postcss-responsive-variations | — | `pnpm nx run postcss-responsive-variations:test` (Jest) | — |
| All | `pnpm nx run dialtone:build` | `pnpm nx run dialtone:test:all` | `pnpm nx run dialtone:lint:all` |

## Commit Convention

Format: `<type>(<scope>): <jira> <subject>`

See [COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md) for full details.

**Types**: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

**Scope**: Lowercase kebab-case. Use component name, package name, or omit. Multiple scopes separated by comma.

**Jira**: Required. Use `DLT-XXX` ticket ID, or `NO-JIRA` if none.

**Subject**: Imperative, present tense. No capitalized first letter. No trailing period.

**Examples**:

```text
feat(select-menu): DLT-123 add leftIcon prop
fix(combobox, combobox-with-popover): DLT-456 fix keyboard navigation
chore: NO-JIRA update dependencies
```

**Release-triggering types**: `feat` (MINOR), `fix`/`perf`/`refactor` (PATCH). `BREAKING CHANGE:` in footer → MAJOR.

## PR Conventions

- PR title must follow the same commit convention format
- Use `/pr-fill` to auto-generate PR description from the template
- Never include `Co-Authored-By` lines in commits or PR bodies
- When changes span multiple packages, note cross-package impact in the PR description

## Jira

- Project: **DLT** (Dialtone)
- All work requires a Jira ticket — create one via the Atlassian MCP if none exists
- The Atlassian MCP server is not bundled with this project — it must be configured per-user in your Claude Code MCP settings
- Ticket URL format: `https://dialpad.atlassian.net/browse/DLT-XXX`

## Vue Conventions (Summary)

- **New components**: Composition API with `<script setup lang="ts">`
- **Existing components**: Options API with `compatConfig: { MODE: 3 }` — do NOT convert unless explicitly asked
- **Props**: Use `validator` (NOT `validate` — Vue silently ignores `validate`)
- **Events**: `update:modelValue` for v-model; `update:open` for new overlays; `update:show` for legacy Modal/Tooltip/Toast

Detailed conventions are in path-scoped rules (`.claude/rules/vue-components.md`) that activate automatically when editing component files.

## Documentation Pipeline (6 Artifacts)

When creating or updating a component, ALL must stay in sync:

1. **Vue source** — `packages/dialtone-vue/components/`
2. **Tests** — `.test.js` using Vitest + @vue/test-utils
3. **Storybook stories** — `.stories.js` + `.mdx`
4. **Component docs JSON** — via `scripts/build-dialtone-vue-docs.mjs`
5. **VuePress documentation** — `apps/dialtone-documentation/docs/`, sidebar in `_data/site-nav.json`
6. **MCP server data** — `packages/dialtone-mcp-server/src/data.ts`

## Release Process

- Semantic-release runs on Tuesdays
- Release branches: `staging` (production), `beta`, `alpha`, `next` (prerelease)
- Workflow: feature branch → PR to `staging` → semantic-release → `production` fast-forward
- Config: `release-ci.config.cjs` per package

## Key Files Reference

| File | Purpose |
| ------ | --------- |
| `commitlint.config.cjs` | Commit format rules |
| `parser-preset.cjs` | Commit message parser regex |
| `.github/COMMIT_CONVENTION.md` | Commit convention documentation |
| `.github/pull_request_template.md` | PR template |
| `common/components_list.js` | All 58+ component filenames |
| `scripts/build-dialtone-vue-docs.mjs` | Generates component-documentation.json |
| `packages/dialtone-css/gulpfile.cjs` | CSS build pipeline |
| `packages/dialtone-tokens/tokens/$metadata.json` | Token sets build order |
| `apps/dialtone-documentation/docs/_data/site-nav.json` | Sidebar navigation |
