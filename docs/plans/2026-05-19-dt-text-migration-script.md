# DtText Migration Script Implementation Plan

Created: 2026-05-19
Author: belu.montoya@dialpad.com
Status: VERIFIED
Approved: Yes
Iterations: 0
Worktree: No
Type: Feature

## Summary

**Goal:** Build `npx dialtone-migrate-typography` — a Node.js codemod that rewrites legacy typography utility classes (`d-headline--*`, `d-body--*`, `d-fc-*`, `d-fw-*`, `d-truncate`, `d-ta-*`, etc.) on `<p>`/`<span>`/`<div>`/`<h1>`-`<h6>`/`<label>` to `<dt-text>` components with semantic props (`kind`, `size`, `density`, `strength`, `tone`, `truncate`, `align`).

## Out of Scope

- Tag rewriting on `<a>`, `<button>`, `<li>`, `<td>`, and other non-rewriteable elements — typography classes on these are left untouched silently. They carry semantic behavior beyond text and have no clean DtText receiver.
- `d-fs-*` (raw font-size), `d-ff-*` (font-family), and pixel-indexed `d-lh{N}` line-heights — flagged with a comment when adjacent to a migrated element, never rewritten.
- TypeScript / JavaScript files (`.ts`, `.js`) — only `.vue` and `.html` templates.
- ESLint rule enforcement and CI/CD gates — follow-up PRDs.

## Approach

**Chosen:** Standalone `.mjs` codemod following the `dialtone_migrate_chip_interactive` pattern — single `index.mjs` exporting `transformContent(content, opts)` for direct unit testing, with `maskInertContent`/`unmaskInertContent` to skip `<script>` blocks and HTML comments. Bin registered in `dialtone-css/package.json`.

**Why:** Closest structural analog among the six existing migration scripts — chip-interactive also exposes a testable `transformContent` and runs against a single `test.mjs` via `node --test`. Zero new infrastructure; aligns with the user's preference for a single test file. Tradeoff: regex-based parsing is less robust than a real Vue/HTML parser, but matches how every prior Dialtone migration has worked.

## Context for Implementer

The DtText prop surface lives in `packages/dialtone-vue/components/Text/TextConstants.js`. `size` is a numeric scale (100–700); body/label/code only accept 100–400 (700/600/500 are headline-only — `TEXT_HEADLINE_ONLY_SIZES`). `as` defaults to `'span'`, so only emit `as="..."` when the original tag is not `<span>`. `density` and `strength` are emitted **only when the legacy token deviates from DtText's defaults** for that kind+size — never as a no-op.

The class-to-prop mapping table is authoritative — it was validated against token files and TextConstants.js during PRD work. Do not re-derive values; copy the table from `docs/prd/2026-05-19-dt-text-migration-script.md`.

## Runtime Environment

- **Run command:** `node packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs --cwd <target>` (or `npx dialtone-migrate-typography --cwd <target>` after publishing)
- **Test command:** `node --test packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs`
- **Restart procedure:** N/A — one-shot CLI; re-invoke for each run.

## Assumptions

- The 31-row class-to-prop mapping in the PRD is authoritative (validated 2026-05-19 against `packages/dialtone-tokens/tokens/theme/dp/default.json` and `TextConstants.js`). All tasks depend on this.
- Consumers register components explicitly (`components: { DtText }` in Options API or named imports in Composition API), so per-file import-injection notices are actionable. Tasks 5 depends on this.
- `node --test` is the canonical test runner for migration scripts in this repo (confirmed by `chip-interactive/test.mjs` and `tshirt-to-numeric/test.mjs`). Task 1 depends on this.

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Regex-based parser mismatches on complex nested templates or attribute ordering | Medium | Medium | `maskInertContent` strips `<script>` blocks and HTML comments before regex passes; `findMatchingClosingTag` accounts for nesting depth; per-task tests include malformed/edge-case fixtures |
| Emit invalid prop combination (e.g., `kind="body" size="700"`) | Low | High | Mapping table is hardcoded — body/label/code rows never reference 500-700. Add a runtime assertion in `transformContent` that the chosen `size` is valid for the chosen `kind` per `TEXT_HEADLINE_ONLY_SIZES`; throw on mismatch |
| Performance regression on large monorepos (Beacon: 10k+ .vue files) | Medium | Low | Fast-path: skip any file whose content does not match the `d-headline\|d-body\|d-label\|d-code\|d-fw-\|d-fc-\|d-lh-\|d-truncate\|d-ta-` regex before invoking the full transform |

## File Structure

- `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs` (create) — CLI entry + `transformContent` exported transform function + mapping tables.
- `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs` (create) — single `node:test` test file covering all mapping rows + edge cases.
- `packages/dialtone-css/package.json` (modify) — add `"dialtone-migrate-typography"` row to `bin` block.
- `.claude/skills/dt-migrate.md` (modify) — add `typography` row to the migration table.

## Progress Tracking

- [x] Task 1: Scaffold CLI + bin registration + embedded mapping tables (stub transform)
- [x] Task 2: Composed-class transformation (headline/body/label/code → kind+size+density+strength)
- [x] Task 3: Override utility extraction (tone/strength/density/truncate/align) + already-DtText residual lift
- [x] Task 4: Nested-span collapse + dynamic `:class` and `d-fs-*` flagging
- [x] Task 5: Import-injection notices + `--remove-markers` cleanup mode + end-to-end pipeline
- [x] Task 6: Skill table entry in `.claude/skills/dt-migrate.md`

## Implementation Tasks

### Task 1: Scaffold CLI, bin registration, mapping tables, stub transform

**Objective:** Lay down the script skeleton — `parseArgs`, `findFiles`, `maskInertContent`/`unmaskInertContent`, `processFile`, `main`, exported `transformContent(content, opts)` returning `{ transformed: content, warnings: [], notes: [] }` (no-op). Embed all class-to-prop mapping tables as module-level `const` lookups. Register the bin. After this task, `npx dialtone-migrate-typography --help` and `--dry-run --cwd <dir>` work end-to-end and report zero changes.

**Files:**

- Create: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs`
- Create: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs`
- Modify: `packages/dialtone-css/package.json` (add bin entry at line 51-58 block, alphabetical position: between `dialtone-migrate-scrollbar-always` and `dialtone-migration-helper` — or at end of block, matching style of existing rows)

**Key Decisions / Notes:**

- Mirror `chip-interactive/index.mjs` structure: `parseArgs`, `findFiles`, `maskInertContent`/`unmaskInertContent`, `processFile`, `prompt`, `main`. Copy the color/log helpers verbatim — every sibling script duplicates them (no shared module exists, do NOT create one).
- Mapping tables: copy the 31-row table from `docs/prd/2026-05-19-dt-text-migration-script.md`. Encode as `COMPOSED_CLASS_MAP` (`{ [className]: { kind, size, density?, strength?, flag?: 'eyebrow' | 'code-sm' | 'helper' } }`) and `OVERRIDE_CLASS_MAP` (for `d-fw-*`, `d-fc-*`, `d-lh-*`, `d-truncate`, `d-ta-*`).
- CLI flags: `--cwd <path>`, `--dry-run`, `--yes`, `--help`, `--file <path>` (repeatable), `--remove-markers`, `--validate` — mirror chip-interactive's flag set; drop flex-to-stack's `--show-outline`/`--remove-outline`. (`--validate` was added during verification — see the "post-migration prop validation" pass below.)
- Add a runtime assertion at the bottom of `transformContent` that asserts emitted `(kind, size)` pairs honour `TEXT_HEADLINE_ONLY_SIZES = ['700','600','500']` from `packages/dialtone-vue/components/Text/TextConstants.js`. Mitigates risk #2.
- Fast-path regex check before invoking transform: `/d-headline|d-body|d-label|d-code|d-fw-|d-fc-|d-lh-|d-truncate|d-ta-|d-fs-/`. Skip files that don't match.

**Definition of Done:**

- [ ] `node packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs --help` prints usage and exits 0
- [ ] `node packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs --dry-run --cwd <empty-test-dir>` reports "0 files found / 0 changes"
- [ ] `npm pack` in `packages/dialtone-css` includes the new script under `lib/build/js/dialtone_migrate_typography/` (verify with `npm pack --dry-run | grep dialtone_migrate_typography`)
- [ ] Verify: `node --test packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs` (skeleton test that imports `transformContent` and asserts no-op on empty input — passes)

---

### Task 2: Composed-class transformation — headline/body/label/code → `<dt-text>` with kind+size+density+strength

**Objective:** Implement the core element-rewrite for composed typography classes. Detect elements among `{p, span, div, h1-h6, label}` carrying any composed class (`d-headline--*`, `d-body--*`, `d-label--*`, `d-code--md` and their aliases) and rewrite the opening + closing tag to `<dt-text as="...">` with `kind`/`size`/optional `density`/optional `strength` props. Handle the three FLAG rows (`d-headline--eyebrow`, `d-code--sm`, `d-helper--*`) per the PRD table — emit a `<!-- dt-text-migrate: review -->` comment instead of rewriting (helper variant emits `<!-- dt-text-migrate: review helper -->`). Drop recognized classes from the resulting class list; retain everything else.

**Files:**

- Modify: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs`
- Modify: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs`

**Key Decisions / Notes:**

- Element regex: `<(p|span|div|h[1-6]|label)([^>]*?)\bclass="([^"]*)"([^>]*?)(\/?)>` — list the 11 tags explicitly (no general element scan). Custom Vue components and non-rewriteable HTML tags MUST be skipped at this layer.
- `findMatchingClosingTag` from flex-to-stack (lines 334–387) can be ported as-is — same depth-counting algorithm needed here.
- When emitting `as="..."`, omit when the original tag is `span` (DtText default).
- Run the runtime kind+size assertion added in Task 1 before returning the transformed element.
- Skip elements whose `class` attribute is dynamic (`:class="..."` or `v-bind:class="..."`) — flagging dynamic classes is Task 4.

**Definition of Done:**

- [ ] All 31 mapping rows from the PRD have at least one input→output assertion in `test.mjs` — e.g., `<p class="d-headline--md">Hi</p>` → `<dt-text as="p" kind="headline" size="300">Hi</dt-text>`
- [ ] `<span class="d-body--sm">x</span>` → `<dt-text kind="body" size="100">x</dt-text>` (no `as` prop, default span)
- [ ] `d-headline--eyebrow` input emits `<!-- dt-text-migrate: review -->` and leaves the element unchanged; same for `d-code--sm`; `d-helper--*` emits `<!-- dt-text-migrate: review helper -->` AND rewrites to `kind="body"` with the approximated size+density (per PRD Key Decisions row)
- [ ] Mixed-class input (`d-headline--md d-mb-200`) drops `d-headline--md` and retains `d-mb-200` on the output `<dt-text>` via `class="d-mbe-200"`
- [ ] Verify: `node --test packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs`

---

### Task 3: Override utility extraction + already-DtText residual lift

**Objective:** Extract `d-fw-*`, `d-fc-*`, `d-lh-*`, `d-truncate`, `d-ta-*` into props on (a) elements being rewritten in Task 2 and (b) elements that are already `<dt-text>` carrying residual utility classes. For native non-rewriteable elements (`<a>`, `<button>`, `<li>`, `<td>`, etc.) carrying only override utilities, leave untouched silently (no flag, no class drop).

**Files:**

- Modify: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs`
- Modify: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs`

**Key Decisions / Notes:**

- Override → prop mappings (verified against `TEXT_STRENGTH_MODIFIERS`, `TEXT_DENSITY_MODIFIERS`, `TEXT_TONE_MODIFIERS`, `TEXT_ALIGN_MODIFIERS` in `TextConstants.js`):
  - `d-fw-bold|semibold|medium|normal` → `strength="..."`
  - `d-fc-{tone}` → `tone="..."` (15 values, all map 1:1 to keys of `TEXT_TONE_MODIFIERS`)
  - `d-lh-100..600` → `density="..."`
  - `d-truncate` → `truncate` (boolean prop, no value)
  - `d-ta-left` → `align="start"`, `d-ta-right` → `align="end"`, `d-ta-center` → `align="center"`, `d-ta-justify` → `align="justify"` (logical-naming convention, see `.claude/rules/logical-naming.md`)
- Already-DtText path: extend the element regex to also match `<dt-text` (and `<DtText` for PascalCase). When found, lift recognized classes into props, drop them from the class attribute. If the element has a `kind` prop already, preserve it; only lift overrides + `tone`/`truncate`/`align`.
- When a class clashes with an explicit prop already on the element (e.g., `<dt-text strength="bold" class="d-fw-normal">`), preserve the explicit prop and drop the class with a `<!-- dt-text-migrate: review conflicting class -->` comment.
- Non-rewriteable element fast path: if `tagName ∉ {p, span, div, h1-h6, label, dt-text, DtText}` AND it carries only override utilities (no composed class), do nothing — return unchanged.

**Definition of Done:**

- [ ] `<p class="d-fw-bold d-fc-tertiary">x</p>` → `<dt-text as="p" strength="bold" tone="tertiary">x</dt-text>`
- [ ] `<dt-text kind="body" class="d-fw-bold d-fc-tertiary">x</dt-text>` → `<dt-text kind="body" strength="bold" tone="tertiary">x</dt-text>` (residual lift)
- [ ] `<a class="d-fw-bold">link</a>` → unchanged (silent leave-alone)
- [ ] `<button class="d-truncate">btn</button>` → unchanged
- [ ] `<dt-text strength="bold" class="d-fw-normal">x</dt-text>` → unchanged class, comment emitted (conflicting class case)
- [ ] `d-ta-left` → `align="start"` (logical mapping verified)
- [ ] Verify: `node --test packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs`

---

### Task 4: Nested-span collapse + dynamic `:class` and `d-fs-*` flagging

**Objective:** When rewriting a parent element to `<dt-text>`, walk its captured body and collapse any direct-child `<span>` that carries **only** recognized typography classes (no `v-if`, `v-bind`, `@event`, `id`, `ref`, `:class` binding, `v-on`, custom attrs) into a nested `<dt-text>`. Any other nested `<span>` carrying typography classes gets a `<!-- dt-text-migrate: review nested span -->` comment. Separately, flag any `:class`/`v-bind:class` binding containing typography utilities with `<!-- dt-text-migrate: review dynamic class -->`, and any `d-fs-*` class with `<!-- dt-text-migrate: review d-fs-* -->`. None of these flagged patterns are rewritten.

**Files:**

- Modify: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs`
- Modify: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs`

**Key Decisions / Notes:**

- Safe-to-collapse predicate: span must have exactly one attribute (`class`), and every class must be in `COMPOSED_CLASS_MAP` ∪ `OVERRIDE_CLASS_MAP`. Any unrecognized class, any second attribute, any directive (`v-`/`@`/`:`/prefix) → not safe.
- Collapse only when the span is a direct child of a migrated parent (parent is being rewritten in the same pass). Spans elsewhere are out of scope — they're handled if they become direct children of a future migration target.
- `d-fs-*` flag is per-element, not per-class — one comment per element regardless of how many `d-fs-*` classes it carries.
- Dynamic class flag: detect both `:class="..."` and `v-bind:class="..."` containing any of the recognized class prefixes via the same fast-path regex used in Task 1.

**Definition of Done:**

- [ ] `<p class="d-headline--md"><span class="d-fw-bold">name</span></p>` → `<dt-text as="p" kind="headline" size="300"><dt-text strength="bold">name</dt-text></dt-text>`
- [ ] `<p class="d-headline--md"><span class="d-fw-bold" @click="x">name</span></p>` → parent rewritten, child gets `<!-- dt-text-migrate: review nested span -->` and is left untouched
- [ ] `<p :class="{ 'd-headline--md': condition }">x</p>` → unchanged content, `<!-- dt-text-migrate: review dynamic class -->` emitted
- [ ] `<p class="d-headline--md d-fs-150">x</p>` → parent rewritten without `d-fs-150` props, `<!-- dt-text-migrate: review d-fs-* -->` emitted; the `d-fs-150` class is retained on output (PRD: "flags but does not rewrite")
- [ ] Verify: `node --test packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs`

---

### Task 5: Import-injection notices, `--remove-markers` cleanup mode, end-to-end pipeline

**Objective:** When a file gains its first `<dt-text>`, detect whether `DtText` is already imported/registered and, if not, print per-file action-required instructions on stdout (same pattern as `flex-to-stack`'s `detectMissingStackImport` + `printImportInstructions`). Implement `--remove-markers` cleanup mode that strips all `<!-- dt-text-migrate: review ... -->` comments. Write a small end-to-end test that runs `transformContent` against a representative `.vue` file containing multiple patterns and asserts the final output matches a fixture.

**Files:**

- Modify: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/index.mjs`
- Modify: `packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs`

**Key Decisions / Notes:**

- Port `detectImportPattern` from flex-to-stack/index.mjs:1116-1134 verbatim — the `@/components/text` / `@dialpad/dialtone-vue` heuristic is identical for both.
- `--remove-markers` regex: `/\s*<!--\s*dt-text-migrate:[^>]*-->\s*/g` — replace with single space when between text, empty string when on its own line.
- End-to-end fixture: inline a ~30-line `.vue` template string covering (a) headline rewrite, (b) body rewrite with truncate+tone overrides, (c) already-DtText residual lift, (d) safe nested-span collapse, (e) unsafe nested span with comment, (f) dynamic `:class` flag, (g) `d-fs-*` flag, (h) non-rewriteable `<a class="d-fw-bold">` left alone. Assert byte-equal output.
- Summary output: print files-scanned, files-modified, changes-applied, files-needing-imports (with checklist), markers-flagged. Match chip-interactive's summary format.

**Definition of Done:**

- [ ] A `.vue` file lacking a DtText import that gets rewritten triggers the "ACTION REQUIRED: Add DtText import" stdout block with the correct suggested import path (`@/components/text` or `@dialpad/dialtone-vue` based on existing imports)
- [ ] A `.vue` file already containing `import { DtText } from '...'` does NOT trigger the action-required block
- [ ] `--remove-markers --dry-run --cwd <dir>` lists every file containing a marker; without `--dry-run`, all markers are removed
- [ ] End-to-end fixture test: 30-line mixed `.vue` input produces byte-equal expected output
- [ ] Verify: `node --test packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs`

---

### Task 6: `/dt-migrate` skill table entry

**Objective:** Add a `typography` row to the migration table in `.claude/skills/dt-migrate.md` so developers can discover and run the script via `/dt-migrate typography`.

**Files:**

- Modify: `.claude/skills/dt-migrate.md`

**Key Decisions / Notes:**

- Add after the `link-rendering` row (line 17) — same standalone-CLI category. Use the same column format: name, description, command.
- Description: "Migrates legacy typography utility classes (`d-headline--*`, `d-body--*`, `d-label--*`, `d-code--md`, `d-fw-*`, `d-fc-*`, `d-lh-*`, `d-truncate`, `d-ta-*`) on `<p>`/`<span>`/`<div>`/`<h1>`-`<h6>`/`<label>` elements to `<dt-text>` with semantic props. Flags `d-headline--eyebrow`, `d-code--sm`, `d-helper--*`, dynamic `:class` bindings, and `d-fs-*` for manual review."
- Command column: `npx dialtone-migrate-typography`
- `Trivial:` ≤ 5 net new lines (one table row), no new branch/loop/try, no new public symbol, no new error path; covered by manual `/dt-migrate` invocation in Task 5's verify step.

**Definition of Done:**

- [ ] Reading `.claude/skills/dt-migrate.md` shows the new `typography` row in alphabetical or end-of-table position
- [ ] Verify: `grep "dialtone-migrate-typography" .claude/skills/dt-migrate.md` returns the new row

---

## Autonomous Decisions

The following design choices were made automatically when not directly addressed by user questions:

- **Single test file, no example fixture files.** Per user answer to Batch 1 Q1. Test fixtures live inline as template strings in `test.mjs`, matching chip-interactive's style.
- **No shared helper module across migration scripts.** Every sibling script duplicates `findFiles`, color helpers, and prompt logic; we follow that convention rather than introducing a new shared module mid-migration-suite.
- **CLI flag set:** `--cwd`, `--dry-run`, `--yes`, `--help`, `--file`, `--remove-markers`. Omits flex-to-stack's `--validate`/`--show-outline` (no parallel use case for typography).
- **Marker comment vocabulary:** five distinct markers — `<!-- dt-text-migrate: review -->` (eyebrow, d-code--sm), `<!-- dt-text-migrate: review helper -->` (helper), `<!-- dt-text-migrate: review nested span -->`, `<!-- dt-text-migrate: review dynamic class -->`, `<!-- dt-text-migrate: review d-fs-* -->`, `<!-- dt-text-migrate: review conflicting class -->`. `--remove-markers` strips all of them.
- **Runtime assertion on kind+size validity** (added in Task 1) — emits via `throw new Error(...)` not silent skip, so consumers see a clear failure rather than DtText runtime validator errors.
