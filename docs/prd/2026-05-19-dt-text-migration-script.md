# DtText Migration Script

Created: 2026-05-19
Author: belu.montoya@dialpad.com
Category: Feature
Status: Final
Research: Quick

## Problem Statement

DtText is Dialtone's new typography primitive — the canonical way to apply text styles in consuming products going forward. Products currently express typography through a combination of composed style utilities (`d-headline--md`, `d-body--sm-compact`) and individual override utilities (`d-fw-bold`, `d-fc-tertiary`, `d-truncate`) applied directly to HTML elements. Migrating manually is error-prone and labour-intensive given the breadth of the pattern across codebases. A migration script following Dialtone's established codemod pattern gives every consuming product a fast, safe, automated first pass — matching how Dialtone has handled every prior migration (flex-to-stack, link-rendering, tshirt-to-numeric, etc.).

## Core User Flows

### Flow 1: Automated migration run

1. Product developer adds `@dialpad/dialtone-css` dependency (already present) — no extra install.
2. Runs `npx dialtone-migrate-typography --dry-run --cwd ./src` to preview changes.
3. Reviews the diff, then runs without `--dry-run` to apply.
4. Script rewrites `.vue` and `.html` files; adds import instructions per file where `DtText` registration is needed.
5. Developer runs their linter (`pnpm nx run <app>:lint`) to catch any flagged residual patterns.
6. Developer manually reviews files marked with `<!-- dt-text-migrate: review -->` comments.

### Flow 2: Partial / targeted run

1. Developer runs against a single file or subdirectory: `npx dialtone-migrate-typography --cwd ./src/components/callbar`.
2. Applies only to that scope; reports stats for the subset.

### Flow 3: /dt-migrate integration

1. Developer runs `/dt-migrate typography` in Claude Code (Dialtone project).
2. The `/dt-migrate` skill looks up `typography` in the table, confirms target directory, and shells out to `npx dialtone-migrate-typography`.

## Scope

### In Scope

- Standalone `.mjs` migration script: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs`
- Registered as `npx dialtone-migrate-typography` bin in `dialtone-css/package.json`
- **Input side — legacy patterns rewritten:**
  - Composed headline styles: `d-headline--sm/md/lg/xl/xxl` and their `-compact` variants, `-soft` variants, `-soft-compact` variants, and all legacy aliases (`d-headline-small`, `d-headline-medium`, etc.) → `kind="headline"` + `size` + optional `density`
  - Composed body styles: `d-body--sm/md` and `-compact` variants + aliases → `kind="body"` + `size` + optional `density`
  - Composed label styles: `d-label--sm/md`, `-compact`, `-plain`, `-plain-compact` variants + aliases → `kind="label"` + `size` + optional `density`
  - Composed code styles: `d-code--md` + alias → `kind="code" size="200"`; `d-code--sm` uses a font-size below DtText's minimum code size and is flagged with a comment instead of rewritten
  - Helper styles: `d-helper--sm/md` + aliases → approximated as `kind="body"` + `size` + `density` (no helper kind in DtText); output marked with `<!-- dt-text-migrate: review helper -->`
  - Color tone: `d-fc-{primary,secondary,tertiary,muted,disabled,placeholder,critical,critical-strong,positive,positive-strong,warning,info,info-strong,neutral-black,neutral-white}` → `tone` prop
  - Font weight overrides: `d-fw-bold/semibold/medium/normal` → `strength` prop
  - Line height overrides: `d-lh-100` through `d-lh-600` → `density` prop
  - Text truncation: `d-truncate` → `truncate` boolean prop
  - Text alignment: `d-ta-left/right/center/justify` → `align` prop (mapped to logical values: left→start, right→end)
- **Element rewrite:** bare `<p>`, `<span>`, `<div>`, `<h1>`–`<h6>`, `<label>` elements carrying any of the above classes get their tag replaced with `<dt-text as="{original-tag}">` (or just `<dt-text>` when the tag is `<span>`, since that is DtText's default)
- **Nested span collapse (safe subset):** a `<span>` directly inside a migrated parent that carries *only* recognised typography utility classes (and no other attributes — no `v-if`, `v-bind`, `@event`, `id`, `ref`, etc.) is collapsed to a nested `<dt-text>`; all other nested spans receive a `<!-- dt-text-migrate: review nested span -->` comment
- **Import injection notices:** per-file console output listing files that need `DtText` imported/registered (same pattern as flex-to-stack)
- CLI flags: `--cwd <path>`, `--dry-run`, `--yes`, `--help`
- `--remove-markers` mode to strip `<!-- dt-text-migrate: review -->` comments after manual review
- Entry in the `/dt-migrate` skill table (`.claude/skills/dt-migrate.md`)
- Entry in `dialtone-migration-helper` config if applicable (check `dialtone_migration_helper` to confirm)

### Explicitly Out of Scope

- `d-fs-*` (raw font-size utilities) — no DtText prop equivalent; these are escape-hatch overrides. The script flags them with a comment if found alongside a migrated element but does not rewrite them.
- `d-lh{N}` legacy pixel-indexed line-height classes (`d-lh0`, `d-lh8`, etc.) — deprecated separately; out of scope here.
- `d-ff-*` font-family overrides — no DtText prop; leave untouched.
- Dynamic class bindings (`:class="{ 'd-headline--md': condition }"`) — too complex to rewrite safely; flagged with a comment.
- TypeScript / JavaScript files (`.ts`, `.js`) — only `.vue` and `.html` templates.
- Generating an ESLint rule to enforce DtText usage — enforcement tooling is a follow-up PRD.
- CI/CD enforcement or pre-commit hooks — follow-up PRD.

## Technical Context

- **Location:** `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs` (same directory convention as all sibling scripts)
- **Bin registration:** add `"dialtone-migrate-typography": "./dist/js/dialtone_migrate_typography/index.mjs"` to `dialtone-css/package.json` `"bin"` block (same pattern as existing entries)
- **Implementation model:** closest analogs are `dialtone_migrate_flex_to_stack/index.mjs` (class combinations → component props) and `dialtone_migrate_link_rendering/index.mjs` (element tag replacement + attribute extraction). Both use pure Node.js, regex-based transforms, no external dependencies beyond `fs/promises`, `path`, `readline`.
- **Class-to-prop mapping table** (embed in script as a `const`):

  Validated against `packages/dialtone-tokens/tokens/theme/dp/default.json` and `packages/dialtone-vue/components/Text/TextConstants.js`. Sizes use DtText's numeric scale (100=xs … 700=3xl). `strength` and `density` are only emitted when the legacy token deviates from DtText's own default for that kind+size.

  | Legacy class | Aliases | kind | size | strength | density | notes |
  |---|---|---|---|---|---|---|
  | `d-headline--sm` | `d-headline-small` | headline | 100 | — | — | |
  | `d-headline--md` | `d-headline-medium` | headline | 300 | — | — | |
  | `d-headline--lg` | `d-headline-large` | headline | 500 | — | — | |
  | `d-headline--xl` | `d-headline-extra-large` | headline | 600 | — | — | |
  | `d-headline--xxl` | `d-headline-extra-extra-large` | headline | 700 | — | — | |
  | `d-headline--eyebrow` | `d-headline-eyebrow` | FLAG | — | — | — | `text-transform:uppercase` — no DtText prop; flag with `<!-- dt-text-migrate: review -->` |
  | `d-headline--sm-soft` | `d-headline-soft-small` | headline | 100 | medium | — | token uses `font.weight.medium` (500) |
  | `d-headline--lg-soft` | — | headline | 500 | medium | — | token uses `font.weight.medium` (500) |
  | `d-headline--sm-compact` | `d-headline-compact-small` | headline | 100 | — | 200 | |
  | `d-headline--md-compact` | `d-headline-compact-medium` | headline | 300 | — | 300 | |
  | `d-headline--lg-compact` | `d-headline-compact-large` | headline | 500 | — | 200 | |
  | `d-headline--xl-compact` | — | headline | 600 | — | 100 | |
  | `d-headline--xxl-compact` | — | headline | 700 | — | — | compact ≡ base (same `lh=200`); no density override |
  | `d-headline--sm-soft-compact` | `d-headline-compact-soft-small` | headline | 100 | medium | 200 | |
  | `d-headline--lg-soft-compact` | — | headline | 500 | medium | 200 | |
  | `d-body--md` | `d-body-base` | body | 300 | — | — | |
  | `d-body--sm` | `d-body-small` | body | 100 | — | — | |
  | `d-body--md-compact` | `d-body-compact` | body | 300 | — | 300 | |
  | `d-body--sm-compact` | `d-body-compact-small` | body | 100 | — | 200 | |
  | `d-label--md` | `d-label-base` | label | 300 | — | — | |
  | `d-label--sm` | `d-label-small` | label | 100 | — | — | |
  | `d-label--md-compact` | `d-label-compact` | label | 300 | — | 300 | |
  | `d-label--sm-compact` | `d-label-compact-small` | label | 100 | — | 200 | |
  | `d-label--md-plain` | `d-label-plain` | label | 300 | normal | — | token uses `font.weight.normal` (400) |
  | `d-label--md-plain-compact` | `d-label-compact-plain` | label | 300 | normal | 300 | |
  | `d-label--sm-plain` | `d-label-plain-small` | label | 100 | normal | — | |
  | `d-label--sm-plain-compact` | `d-label-compact-plain-small` | label | 100 | normal | 200 | |
  | `d-code--md` | `d-code-base` | code | 200 | — | — | |
  | `d-code--sm` | `d-code-small` | FLAG | — | — | — | `font.size.75` (~11px) below DtText's minimum code size; flag with `<!-- dt-text-migrate: review -->` |
  | `d-helper--md` | `d-helper-base` | body | 300 | — | 300 | ⚠️ approximation — no `helper` kind in DtText |
  | `d-helper--sm` | `d-helper-small` | body | 100 | — | 200 | ⚠️ approximation — no `helper` kind in DtText |

- **Override utility mappings:**
  - `d-fw-bold/semibold/medium/normal` → `strength="bold/semibold/medium/normal"`
  - `d-lh-100..600` → `density="100..600"`
  - `d-fc-{tone}` → `tone="{tone}"` (all tone values map 1:1)
  - `d-truncate` → boolean prop `truncate`
  - `d-ta-left` → `align="start"`, `d-ta-right` → `align="end"`, `d-ta-center` → `align="center"`, `d-ta-justify` → `align="justify"`
- **`as` prop:** set to the original HTML tag when it differs from `span` (DtText's default). `<p class="d-headline--md">` → `<dt-text as="p" kind="headline" size="300">`.
- **Existing test harness:** sibling scripts include `test.mjs` files. Follow the same pattern.

## Key Decisions

| Decision | Choice | Why |
|---|---|---|
| Script location and packaging | `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/`, `npx dialtone-migrate-typography` bin | Consistent with all 6 existing migration scripts; zero new infrastructure |
| Nested span collapse strategy | Collapse spans with *only* recognised typography classes; flag everything else with a comment | Automates the majority safe case (a `<span class="d-fw-normal">` next to text content) without risking breakage on spans with behaviour or other attributes |
| `d-fs-*` handling | Flag with comment, do not rewrite | No DtText prop equivalent; these are intentional escape-hatch overrides |
| Dynamic `:class` bindings | Flag with comment, do not rewrite | Regex-based transform cannot safely evaluate runtime expressions |
| `d-ta-left/right` → logical alignment | Map to `start`/`end` | Consistent with Dialtone's logical naming convention |
| eyebrow mapping | Flag with `<!-- dt-text-migrate: review -->` | Token uses `text-transform: uppercase` — no DtText prop equivalent; cannot be expressed as props |
| `-soft` variants → `strength` | Add `strength="medium"` | Token cross-reference: `typography.headline.sm-soft` uses `font.weight.medium` (500), not normal (400) |
| `-plain` variants → `strength` | Add `strength="normal"` | Token cross-reference: `typography.label.md-plain` uses `font.weight.normal` (400) |
| `d-code--sm` handling | Flag with `<!-- dt-text-migrate: review -->` | Token uses `font.size.75` (~11px), below DtText's minimum code size; no safe mapping |
| `d-helper--*` handling | Approximate as `kind="body"` + density; mark with `<!-- dt-text-migrate: review helper -->` | No `helper` kind in DtText; body+density gives visually close output but semantics differ |
