# Dialtone Design System

Dialtone is Dialpad's design system — a monorepo providing tokens, CSS utilities, Vue components, documentation, and developer tooling for building consistent UIs across Dialpad products.

## Monorepo Structure

```text
packages/
  dialtone-tokens/       # Design tokens (color, space, typography, shadows) → JSON/CSS/iOS/Android
  dialtone-css/          # CSS utility classes built with gulp + Less
  dialtone-vue/          # Vue 3 component library (58+ components)
  dialtone-icons/        # SVG icons → Vue components (vue2/, vue3/, android/)
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

### Test Frameworks

- **Vue components**: Vitest + @vue/test-utils — `pnpm nx run dialtone-vue:test`
- **ESLint plugin**: Mocha — `pnpm nx run eslint-plugin-dialtone:test`
- **PostCSS plugin**: Jest — `pnpm nx run postcss-responsive-variations:test`
- **Stylelint plugin**: Node test runner — `pnpm nx run stylelint-plugin-dialtone:test`

## Commit Convention

Format: `<type>(<scope>): <jira> <subject>`

See [COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md) for full details.

**Types**: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

**Scope**: Lowercase kebab-case. Use component name, package name, or omit. Multiple scopes separated by comma.

**Jira**: Required. Use `DLT-XXX` ticket ID, or `NO-JIRA` if none. Multiple tickets separated by spaces.

**Subject**: Imperative, present tense. No capitalized first letter. No trailing period.

**Examples**:

```text
feat(select-menu): DLT-123 add leftIcon prop
fix(combobox, combobox-with-popover): DLT-456 fix keyboard navigation
chore: NO-JIRA update dependencies
```

**Release-triggering types**: `feat` (MINOR), `fix`/`perf`/`refactor` (PATCH). `BREAKING CHANGE:` in footer → MAJOR.

**Parser regex**: `^(\w*)(?:\((.+)\))?: ((?:NO-JIRA|[A-Z]{2,}-\d+)(?: [A-Z]{2,}-\d+)*) (.+)$`

## PR Conventions

- PR title must follow the same commit convention format
- Use `/pr-fill` to auto-generate PR description from the template
- Never include `Co-Authored-By` lines in commits or PR bodies
- When changes span multiple packages, note cross-package impact in the PR description
- Flag which documentation artifacts need updating

## Jira

- Project: **DLT** (Dialtone)
- All work requires a Jira ticket — create one via the Atlassian MCP if none exists
- Ticket URL format: `https://dialpad.atlassian.net/browse/DLT-XXX`

## Vue Conventions

### New Components — Composition API

All new Vue components MUST use Composition API with `<script setup>`:

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

defineSlots<{
  default(): any;
  headerContent(): any;
}>();
</script>
```

### Existing Components — Options API

Existing components use Options API with `compatConfig: { MODE: 3 }`. Do NOT convert existing components to Composition API unless explicitly tasked to do so.

### Conventions

- **Props**: Use `validator` (NOT `validate` — Vue silently ignores `validate`). Reference `*_constants.js` for allowed values. Add JSDoc with `@values` annotation.
- **Events**: `update:modelValue` for v-model. `update:open` for Popover/Collapsible/ImageViewer/FilterPill. `update:show` for Modal/Tooltip/Toast (legacy inconsistency — don't change).
- **Slots**: `headerContent`/`footerContent` for overlays (Popover, Hovercard). `header`/`footer` for structural (Card, Modal).
- **Sizes**: `xs`/`sm`/`md`/`lg`/`xl` for interactive components. `100`-`800` numeric for icons.
- **Visibility toggles**: `hideX` (negative polarity) is the dominant pattern.
- **Mixins**: Legacy shared behavior (`InputMixin`, `CheckableMixin`, `GroupableMixin`, `MessagesMixin`). Understand them, but use composables for new work.

## Separation of Concerns

Vue components must follow clear separation:

- **Template**: Presentation only — conditional rendering, loops, event binding. No complex expressions (use computed). No API calls.
- **Script**: All logic — computed properties, watchers, methods, state management. Composables for reusable logic (new) or mixins (legacy).
- **Styles**: Scoped styles or Dialtone utility classes. Reference design tokens (`var(--dt-*)`). Never hardcode colors, spacing, or typography. No `!important` except in utility definitions.

## CSS Utilities

- Located in `packages/dialtone-css/lib/build/less/utilities/`
- Naming: `d-<property><value>` pattern (e.g., `d-p8`, `d-d-flex`, `d-w100p`)
- Always reference tokens via `var(--dt-*)` custom properties
- Built with gulp + Less, ships as one monolithic CSS file
- No `sideEffects: false` — not tree-shakeable by JS bundlers

## Design Tokens

- Located in `packages/dialtone-tokens/tokens/`
- Hierarchy: `base/` (default.json + dark.json) → `components/<name>/` → `theme/<brand>/`
- Naming: `dtColor*`, `dtSpace*`, `dtFont*`, `dtSize*`
- Always maintain dark mode counterpart when adding/editing tokens
- Build outputs: CSS custom properties, docs JSON, iOS/Android platform outputs
- Figma sync: `sync:tokens-to-figma` / `sync:figma-to-tokens`

## Documentation Pipeline (6 Artifacts)

When creating or updating a component, ALL of these must stay in sync:

1. **Vue source** — Component implementation in `packages/dialtone-vue/components/`
2. **Tests** — `.test.js` files using Vitest + @vue/test-utils
3. **Storybook stories** — Stories in component directory, `.stories.js` + `.mdx` docs
4. **Component docs JSON** — Generated by `scripts/build-dialtone-vue-docs.mjs` → `component-documentation.json`
5. **VuePress documentation** — Page in `apps/dialtone-documentation/docs/`, sidebar entry in `_data/site-nav.json`
6. **MCP server data** — `packages/dialtone-mcp-server/src/data.ts` imports from docs JSON

## Known Issues

- **`validate` vs `validator`**: 8 instances across 6 files use the incorrect `validate` key, which Vue silently ignores. Use `validator` for all prop validation.
- **`show` vs `open` naming**: Modal/Tooltip/Toast use `show`/`update:show` while Popover/Collapsible use `open`/`update:open`. This is a legacy inconsistency — follow existing pattern per component, don't mix.

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
