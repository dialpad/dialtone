# ESLint Rule for Removed Class Props on Dialtone Vue Components

Created: 2026-05-07
Author: belu.montoya@dialpad.com
Category: Infrastructure
Status: Final
Research: Standard
Jira: [DLT-3281](https://dialpad.atlassian.net/browse/DLT-3281)
Linked tickets: action item from [DLT-3100](https://dialpad.atlassian.net/browse/DLT-3100); codemod + docs portion absorbed into [DLT-3157](https://dialpad.atlassian.net/browse/DLT-3157)
Branch + PR title must reference `DLT-3281`

## Problem Statement

In DLT-3100, three structural class props (`rootClass`, `wrapperClass`, `containerClass` and their kebab-case variants) were removed from a set of Dialtone Vue components. The migration was scoped as three deliverables: a codemod, migration documentation, and an ESLint rule. The codemod (`dialtone-migrate-props`) and the migration guide (`/guides/migration/component-props/`) shipped via DLT-3157 and are live on `next`. The ESLint rule is the remaining deliverable.

The codemod is one-shot — it sweeps existing code once and exits. New code written after the migration can reintroduce the removed props with no feedback, because Vue silently ignores unknown props at runtime. Without an always-on guardrail, the codemod's work erodes over the deprecation window: developers who weren't around for the migration write the old prop names from memory, IDEs that cached older type definitions auto-complete them, copy-pasted snippets propagate them.

The ESLint rule is the ongoing guardrail. It catches removed-prop usage every save, every PR, every CI run, with an autofix that mirrors the codemod's rewrite logic. It exists to keep the deprecation effective, not to perform a one-time migration.

## Core User Flows

### Flow 1: Developer writes new code with a removed prop

1. Developer types `<dt-input root-class="d-w332" label="Email" />` in a `.vue` file.
2. ESLint runs on save (editor integration) or on commit (lint-staged).
3. Rule emits a warning: "DtInput does not accept a `root-class` prop. Use the `class` attribute instead. See [migration guide]."
4. Developer accepts the autofix in their editor (or runs `eslint --fix`) and the line becomes `<dt-input class="d-w332" label="Email" />`.

### Flow 2: PR contains legacy code that bypassed the codemod

1. CI runs `pnpm nx run dialtone-vue:lint` (or equivalent in a consumer repo) on a PR containing a stale `<dt-toggle wrapper-class="d-mt16" />`.
2. Lint reports the warning, surfaces it in the PR review.
3. Author runs `eslint --fix` locally; the line becomes `<dt-toggle class="d-mt16" />`.
4. Author commits the fix; PR proceeds.

### Flow 3: Future deprecation removes the same prop name from a different component

1. A future ticket removes `wrapperClass` from `dt-list-item`.
2. The next release of `@dialpad/dialtone-vue` regenerates `component-documentation.json` without `wrapperClass` on DtListItem.
3. `@dialpad/dialtone-query-core` re-exports the new data on its next release.
4. The rule starts firing on `<dt-list-item wrapper-class="x">` automatically — **no change to the eslint plugin's source code**.

## Scope

### In Scope

- A single new ESLint rule in `@dialpad/eslint-plugin-dialtone`.
- Rule name: `deprecated-class-props` (matches the plugin's `deprecated-*` convention).
- Detection: any `<dt-*>` or `<Dt*>` template tag carrying one of these attributes — `root-class` / `rootClass` / `wrapper-class` / `wrapperClass` / `container-class` / `containerClass` (static or `:`-bound) — when the corresponding component does not currently declare that prop in `component-documentation.json`.
- Severity: `warn` (per ticket).
- Single message format: "Dt[Name] does not accept a `[propName]` prop. Use the native `class` attribute instead. See: [migration-guide-url]"
- Autofix behavior, mirroring `applyRootClassRename` at `packages/dialtone-css/lib/build/js/dialtone_migrate_props/index.mjs:358-401`:
  - Static `<prop>="value"`, no existing `class` attribute → replace with `class="value"`.
  - Static `<prop>="value"` with existing `class="other"` → merge to `class="other value"`, remove the original prop.
  - Dynamic `:<prop>="expr"`, no existing `:class` binding → replace with `:class="expr"`.
  - Dynamic `:<prop>="expr"` with existing `:class="..."` → **no autofix**, warn only. (Two dynamic class bindings cannot be safely merged without changing semantics — manual merge required.)
- Data source: the `components` export from `@dialpad/dialtone-query-core`, which transitively re-exports `@dialpad/dialtone-vue/component-documentation.json`. Same package consumed by `dialtone-mcp-server` and `language-server`.
- Tests: Mocha + ESLint `RuleTester` with `vue-eslint-parser`, following the pattern at `packages/eslint-plugin-dialtone/tests/lib/rules/deprecated-stack-alignment-classes.js`. Run via `pnpm nx run eslint-plugin-dialtone:test`.
- Documentation: a new `docs/rules/deprecated-class-props.md` matching the format of existing rule docs (`docs/rules/deprecated-flex-gap-classes.md` and similar).
- Plugin recommended preset: `recommended: false` in rule meta — matches all 11 existing rules in this plugin.

### Explicitly Out of Scope

- A "deprecation registry" pattern across the design system — premature; this rule's needs are met by the existing `dialtone-query-core` data flow. Worth revisiting if a future deprecation has shape this approach can't model.
- Per-component prop maps hardcoded in the rule's source — replaced by data-driven lookup at lint time.
- Migration of any code in the Dialtone monorepo — handled by the codemod and migration docs, both already shipped.
- Other DLT-3157 deprecations (`hide-*` / `show-*` inversions, `show` → `open`, `title` → `header-text`, `validation-state` value renames, etc.) — different shapes, separate rules if pursued. This PRD covers only the class-props removal.
- Runtime introspection of `node_modules` outside `@dialpad/dialtone-query-core` — the query-core dependency is the only data path the rule needs.
- Backward-compatibility shims for older Dialtone versions — the rule reads whatever query-core's current snapshot says.

## Technical Context

- **Package location:** `packages/eslint-plugin-dialtone/`. Rule file: `lib/rules/deprecated-class-props.js`. Test: `tests/lib/rules/deprecated-class-props.js`. Docs: `docs/rules/deprecated-class-props.md`.
- **Existing rule patterns to follow:** `lib/rules/deprecated-flex-gap-classes.js` (uses `parserServices.defineTemplateBodyVisitor` with a `VAttribute` visitor) and `lib/rules/deprecated-stack-alignment-classes.js` (uses `VElement` visitor with attribute filtering on the start tag). Either visitor works; the second matches more closely because we need to look at multiple attributes per element (the offending prop *and* any existing `class` / `:class` for merge logic).
- **Test pattern:** see `tests/lib/rules/deprecated-stack-alignment-classes.js` — Mocha + `RuleTester` with `parser: require.resolve('vue-eslint-parser')`. Autofix tests use the `output` field on `invalid` cases.
- **Data dependency to add:** `@dialpad/dialtone-query-core` as a `dependency` (not `peerDependency`) of `@dialpad/eslint-plugin-dialtone`. The plugin currently has no external runtime data dependencies; this introduces one, but using the package every other internal tool already consumes.
- **Vue parser:** `vue-eslint-parser` is required for template body visitors. Already used in plugin tests via `require.resolve` but not declared as a `peerDependency`. Document the parser requirement in the rule's docs file (consumers using `eslint-plugin-vue` or any Vue lint config already have it).
- **Autofix idempotency:** ESLint runs fixers iteratively until output stabilizes. The fix function must be safe to re-apply — if the offending prop has already been removed from the tag, the rule's detection should not fire and no fix should be produced.
- **Component name resolution:** template tags can be `<dt-input>` (kebab-case) or `<DtInput>` (PascalCase). `component-documentation.json` keys components by `displayName` (e.g., `DtInput`). The rule must normalize both forms to look up the same component.
- **Cross-package impact:** single-package change in `eslint-plugin-dialtone`. No source changes in `dialtone-vue`, `dialtone-css`, `dialtone-tokens`, etc.

## Source-of-Truth Verification

This PRD was scoped against `git log -S` evidence rather than the codemod's per-component map or the migration docs' affected-component list. Confirmed findings on `staging` and `next`:

- **9 components had a deprecated class prop declared in source:** DtInput, DtBreadcrumbItem, DtSelectMenu, DtSplitButton (`rootClass` declared directly); DtCheckbox, DtRadio (`rootClass` inherited via `InputMixin` at `packages/dialtone-vue/common/mixins/input.js:114`); DtToggle (`wrapperClass`); DtCard (`containerClass`); DtFeedItemPill recipe (`wrapperClass`, confirmed by commits `65317831a` and `74f4a206f`).
- **4 components listed in the migration docs never had any of the three prop names** in any commit on any branch: DtAvatar, DtMotionText, DtFilterPill, DtModeIsland (`git log --all --oneline -S "rootClass" -- <component-dir>` returned 0 commits for each). Their inclusion in the docs is a defensive addition, not historical fact.
- **2 components currently still declare `wrapperClass` as a valid prop on `next`**, not deprecated and not in the migration docs: DtListItem (`packages/dialtone-vue/components/list_item/list_item.vue:144`), DtPopoverHeaderFooter (`packages/dialtone-vue/components/popover/popover_header_footer.vue:70`). The data-driven design handles these correctly without explicit configuration — the rule sees `wrapperClass` declared on these components and stays silent.

The data-driven design eliminates dependence on these counts being correct in the future. New deprecations of the same prop names on any component are picked up automatically; new components legitimately exposing these prop names are protected automatically.

## Key Decisions

| Decision | Choice | Why |
|---|---|---|
| Hardcoded component list vs data-driven | Data-driven via `@dialpad/dialtone-query-core` | Existing pattern in this monorepo (`dialtone-mcp-server`, `language-server`). No hand-maintained list. Future deprecations of these prop names are auto-covered. Correctly handles components like DtListItem and DtPopoverHeaderFooter that still legitimately declare `wrapperClass`. |
| One rule vs two rules | One rule | The deprecation case (prop was removed) and the "never existed" case (prop was never declared) both reduce to the same fix — rename to `class` — and the same suggestion. No value in splitting. Simpler config for consumers. |
| Severity | `warn` | Per ticket. Consumer code with these props doesn't crash; Vue silently ignores them. A warning is the right urgency for a quality issue, not a runtime error. |
| Inclusion in `recommended` preset | `recommended: false` | Matches all 11 existing rules in this plugin. Consumers opt in explicitly via their ESLint config. |
| Autofix on `:prop="expr"` + existing `:class="..."` | Warn only, no fix | Two dynamic class bindings cannot be safely merged without changing semantics. Mirrors the codemod's manual-review case. Manual merge is the only safe path. |
| Component-name maintenance in rule source | None | The 13-component list (or any future variant) is never referenced in the rule's code. Inclusion is computed at lint time from `components` data. |
| Bundling vs runtime resolution of component data | Via query-core (build-time bundled by query-core) | Matches `dialtone-mcp-server` and `language-server` exactly. No new module-resolution code paths. |

## Acceptance Criteria

The rule is complete when:

- It is exported from `@dialpad/eslint-plugin-dialtone` and auto-loaded via the plugin's existing `requireindex` index.
- Running `pnpm nx run eslint-plugin-dialtone:test` passes, including new tests for: each prop name (3 props × 2 casings × 2 binding forms = 12 cases), each fix scenario (no existing class, existing static class, existing dynamic class), and the "no fix when both `:prop` and `:class` exist" case.
- Running the rule against a fixture file containing the failure modes from the migration-docs examples produces the expected warnings and autofixes.
- `docs/rules/deprecated-class-props.md` exists and follows the existing rule-docs format.
- The plugin builds without warnings: `pnpm nx run eslint-plugin-dialtone:lint`.
- A consumer test (manual): `eslint --fix` on a sample `.vue` file containing `<dt-input root-class="d-w332">` produces `<dt-input class="d-w332">`.

## Research Findings

(Standard tier — web research summary)

- **`vue-eslint-parser` API:** the canonical entry point is `context.parserServices.defineTemplateBodyVisitor(visitor, scriptVisitor?)`. Template AST nodes carry: `node.directive` (boolean — true for `:`-bound and `@`-bound), `node.key.name` (static attribute name), `node.key.argument.name` (directive argument like `root-class` in `:root-class`), and `node.value.value` / `node.value.expression` (literal vs expression). Range information available for `fixer.replaceTextRange(node.range, newText)`.
- **Closest prior art:** `eslint-plugin-vue/lib/rules/no-deprecated-slot-attribute.js` (rewrites `slot="x"` to `v-slot:x`) and `eslint-plugin-vue/lib/rules/attribute-hyphenation.js` (renames camelCase attributes). Pattern is well-trodden — VAttribute visitor + range-based fixer + idempotent detection because the offending pattern is gone after fix.
- **No prior art** for ESLint plugins reading their host design system's component metadata at lint time was found in published packages. The pattern this PRD proposes — read the build artifact your design system already generates — is novel for a public eslint plugin but standard for tools authored alongside the system being linted, exactly how `language-server` and `dialtone-mcp-server` already work in this repo.
- **Idempotency:** ESLint's autofix loop applies `fix` functions iteratively until output is stable. The rule is naturally idempotent because once `root-class` is renamed to `class`, the rule's detector no longer matches the tag, so no further fix is produced.
- **`vue-eslint-parser` peer-dep stance:** consumers of the plugin already configure `vue-eslint-parser` for any Vue lint setup. The rule docs should mention the parser requirement as a prerequisite without forcing the plugin to declare a strict peer dependency that would conflict with consumer-managed versions.

## Notes for `/spec`

- Implementation should TDD — start with one failing case (`<dt-input root-class="x">` → expect warning + autofix to `class="x"`), then add cases incrementally per the acceptance-criteria matrix.
- Reference implementations in this repo: `lib/rules/deprecated-flex-gap-classes.js`, `lib/rules/deprecated-stack-alignment-classes.js`. Reference test setup: `tests/lib/rules/deprecated-stack-alignment-classes.js`.
- The class-merging logic at `packages/dialtone-css/lib/build/js/dialtone_migrate_props/index.mjs:358-401` is the canonical reference for the autofix's edge cases. The ESLint version uses AST nodes and ranges instead of regex but produces the same output.
- Migration-guide URL for the rule message: the docs at `apps/dialtone-documentation/docs/guides/migration/component-props/index.md` will publish to `https://dialtone.dialpad.com/guides/migration/component-props/` — confirm exact URL during implementation.
- `@dialpad/dialtone-query-core` exposes `Component[]` typed as `{ displayName, props?: ComponentProp[], ... }` (see `packages/dialtone-query-core/src/types.ts`). Each prop has a `name` field. Lookup pattern: `components.find(c => c.displayName === 'DtInput')?.props?.some(p => p.name === 'rootClass')`.
