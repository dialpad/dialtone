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
- **Events**: `update:modelValue` for v-model; `update:open` for all overlay visibility (Modal, Tooltip, Toast, Popover, Dropdown, etc.)

Detailed conventions are in path-scoped rules (`.claude/rules/vue-components.md`) that activate automatically when editing component files.

## Documentation Pipeline (7 Artifacts)

When creating or updating a component, ALL must stay in sync:

1. **Vue source** — `packages/dialtone-vue/components/`
2. **Tests** — `.test.js` using Vitest + @vue/test-utils
3. **Storybook stories** — `.stories.js` + `.mdx`
4. **Component docs JSON** — via `scripts/build-dialtone-vue-docs.mjs`
5. **VuePress documentation** — `apps/dialtone-documentation/docs/`, sidebar in `_data/site-nav.json`. Use fenced ` ```vue demo ` blocks for code examples (see `.claude/rules/documentation-writing.md`)
6. **MCP server data** — `packages/dialtone-mcp-server/src/data.ts`
7. **Component wall thumbnail** — auto-generated PNG at `apps/dialtone-documentation/docs/.vuepress/public/assets/images/components/<slug>-{light,dark}.png`. Run `pnpm nx run dialtone-documentation:thumbs` to regen (pre-commit hook fires automatically on relevant staged changes). If the Combinator default doesn't render well as a thumbnail, author an override at `apps/dialtone-documentation/thumbs/<slug>.vue` — see `apps/dialtone-documentation/thumbs/README.md`. Preview live at `pnpm nx run dialtone-documentation:thumbs:preview` (picker at `/`, full grid at `/?gallery`).
7. **Public docs JSON** — `packages/dialtone-docs/dist/public-docs.json`, built by `packages/dialtone-docs/src/generators/build-public-docs.mjs` from `apps/dialtone-documentation/docs/**/*.md`. Consumed by `dialtone-mcp-server` (`search_documentation` tool) and `dialtone-cli` (`dialtone docs`) via `@dialpad/dialtone-query-core`. Rebuilt automatically when `pnpm nx run dialtone-docs:build` runs (NX watches `apps/dialtone-documentation/docs/**/*.md` as an input).

## Release Process

- Semantic-release runs on Tuesdays
- Release branches: `staging` (production), `beta`, `alpha`, `next` (prerelease)
- Workflow: feature branch → PR to `staging` → semantic-release → `production` fast-forward
- Config: `release-ci.config.cjs` per package

## Doc Sync Tooling

Hooks and tools that keep `packages/dialtone-docs/src/content/` in sync with source code changes. Requires the `dialtone-docs` package (PR #1051) to be merged.

### How it works

1. **Edit tracker** (`.claude/hooks/post-tool-use-tracker.sh`) — PostToolUse hook that silently logs every file edit to `.claude/tsc-cache/<session>/edited-files.log` with affected packages and NX commands.
2. **Pre-push guard** (`.claude/hooks/pre-push-pr-guard.sh`) — PreToolUse hook on Bash that fires on `git push` / `gh pr create`. Maps source packages to doc content files. Denies push if docs are missing and triggers the enforcer.
3. **Doc sync enforcer** — Skill (`/doc-sync-enforcer`) that reads the edit log, maps changes to `dialtone-docs` content files, and updates them.
4. **Doc janitor** — Agent (`/doc-janitor`) that sweeps stale artifacts (plan files, session files, backups) before merging.

### Package → doc mapping

| Source package | Doc content file |
| --- | --- |
| `packages/dialtone-tokens/` | `development-design-tokens.md`, `architecture-design-token-pipeline.md` |
| `packages/dialtone-css/` | `development-css-utilities.md` |
| `packages/dialtone-vue/` | `development-component-workflow.md`, `reference-component-api-patterns.md` |
| `packages/dialtone-icons/` | `development-icons.md` |
| `.github/workflows/` | `workflow-ci-pipeline.md` |

### Session cache

All tracking data lives in `.claude/tsc-cache/<session>/` (gitignored):
- `edited-files.log` — tab-separated: `timestamp\tfilepath\trepo`
- `affected-repos.txt` — one package per line
- `commands.txt` — NX build/test commands for affected packages
- `missing-docs.txt` — written by the guard when docs are missing
- `push-done` / `pr-create-done` — marker files to avoid re-checking

### Standards freshness

**`.github/workflows/standards-freshness.yml`** runs on every PR that touches `packages/dialtone-docs/src/content/standards/**`. It checks whether any standard has `last_verified` older than 90 days and posts a PR comment listing stale docs if found. Non-blocking — posts a comment, does not fail the check.

The 90-day cadence aligns with the ~13-week AI citation decay window documented in `packages/dialtone-docs/src/content/standards/standard-geo-optimization.md`. To pass the check, re-read the standard and bump its `last_verified` date in frontmatter. See `standard-ai-documentation.md` for the field spec.

Run locally: `pnpm nx run dialtone-docs:check-freshness`

## CodeRabbit Config

`.coderabbit.yaml` controls path filters, reviewer routing, and per-path review guidance.

Keep it in sync when:
- A new package is added → add a `path_instructions` entry and any `path_filters` exclusion for build output
- A `.claude/rules/*.md` file is added/renamed → update the `Follow the conventions in …` reference in the matching `path_instructions` entry
- Team member joins → add handle to `reviews.suggested_reviewers_instructions` and `.github/CODEOWNERS`
- Team member leaves → remove handle from both `reviews.suggested_reviewers_instructions` and `.github/CODEOWNERS`
- A new cross-repo relationship is established → add to `knowledge_base.linked_repositories`

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
| `apps/dialtone-documentation/docs/.vuepress/plugins/markdown-it-fenced-demo.js` | Fenced ` ```vue demo ` → `<code-example>` transform |
| `apps/dialtone-documentation/docs/.vuepress/plugins/markdown-it-notice.js` | GFM `> [!KIND]` alerts → `<dt-notice>` transform |
| `scripts/migrate-code-examples.mjs` | Migration script: `<code-example>` → fenced demo syntax |
