# DLT-3281 ESLint Rule: deprecated-class-props Implementation Plan

Created: 2026-05-07
Author: belu.montoya@dialpad.com
Status: COMPLETE
Approved: Yes
Iterations: 1
Worktree: No
Type: Feature
Jira: [DLT-3281](https://dialpad.atlassian.net/browse/DLT-3281)
PRD: [docs/prd/2026-05-07-eslint-deprecated-class-props.md](../prd/2026-05-07-eslint-deprecated-class-props.md)
Branch: `feat/dlt-3281-eslint-deprecated-class-props` (off `staging`)

## Summary

**Goal:** Add an ESLint rule `deprecated-class-props` to `@dialpad/eslint-plugin-dialtone` that flags `<dt-*>` template usage of `rootClass` / `wrapperClass` / `containerClass` (and kebab variants) when the target component does not currently declare that prop, with autofix to rename to the native `class` attribute and merge into existing class bindings.

**Architecture:** Single Vue-template rule following the established `parserServices.defineTemplateBodyVisitor` pattern. Component-prop data is read at rule-load time directly from the JSON artifact published by `@dialpad/dialtone-vue` (`./component-documentation.json`). No hardcoded component lists. No deprecation registry. The rule's inclusion logic is computed from the live JSON snapshot at lint time.

**Tech Stack:** ESLint rule (CommonJS), `vue-eslint-parser` for template AST, Mocha + ESLint `RuleTester` for tests, `proxyquire` to inject controlled component-data fixtures into tests. New peer dependencies: `@dialpad/dialtone-vue` (for the JSON in production), `vue-eslint-parser` (for the visitor). New dev dependencies: `vue-eslint-parser` (so the plugin's own test run can resolve it without relying on workspace hoisting), `proxyquire` (for mocking the JSON import in tests).

## Scope

### In Scope

- A single ESLint rule named `deprecated-class-props` under `packages/eslint-plugin-dialtone/lib/rules/deprecated-class-props.js`.
- Detection of any `<dt-*>` or `<Dt*>` template tag with a `root-class` / `rootClass` / `wrapper-class` / `wrapperClass` / `container-class` / `containerClass` attribute (static or `:`-bound) when the target component does NOT declare the prop in `component-documentation.json`.
- Autofix that renames the offending attribute to `class` (or `:class` for dynamic bindings), merging into an existing class binding when present, per the algorithm in `packages/dialtone-css/lib/build/js/dialtone_migrate_props/index.mjs:358-401`.
- One conservative non-fix case: dynamic `:<prop>="expr"` + existing `:class="..."` — warn only, no autofix.
- Severity: `warn`.
- Single message format: `"Dt[Name] does not accept a `[propName]` prop. Use the native `class` attribute instead. See: https://dialtone.dialpad.com/guides/migration/component-props/"`.
- Tests covering: 12 detection cases for DtInput (3 prop bases × 2 casings × 2 binding forms — DtInput is the post-deprecation anchor in the test fixture); 4 autofix scenarios (static-no-class, static-with-class, dynamic-no-class, dynamic-with-class-warn-only); 1 regression case (DtListItem with `wrapperClass` must NOT trigger). All tests run against a controlled fixture data source via `proxyquire` — never against the live workspace JSON.
- Documentation file `docs/rules/deprecated-class-props.md` matching the format of existing rule docs.
- Add `@dialpad/dialtone-vue` and `vue-eslint-parser` to the plugin's `peerDependencies`. Add `vue-eslint-parser` and `proxyquire` to `devDependencies`.

### Out of Scope

- Conversion of the eslint plugin from CJS to ESM. (Considered as an alternative; rejected because direct JSON import sidesteps the ESM/CJS friction without the conversion cost.)
- Modifications to `@dialpad/dialtone-query-core`. (The plugin doesn't consume it.)
- A "deprecation registry" pattern across the design system. (Premature — the rule's needs are met by the existing JSON artifact.)
- Migration of any code in this monorepo. (The codemod and migration docs already shipped.)
- Other DLT-3157 deprecations (`hide-*` / `show` / `title` / `validation-state` value renames). (Different shapes, separate rules if pursued.)
- Automatic addition of the rule to the plugin's `recommended` preset. (Matches existing convention — opt-in only.)
- Adding `vue-eslint-parser` as a runtime `dependency` (vs `peerDependency`). (PeerDep matches consumer-managed parser convention.)

## Approach

**Chosen:** Data-driven rule reading `@dialpad/dialtone-vue/component-documentation.json` directly via the package's `exports` subpath.

**Why:** Three real integration paths exist (direct JSON, ESM-convert plugin to use query-core, build-time snapshot). Direct JSON is the smallest surface area, has no ESM/CJS friction, tracks the consumer's installed dialtone-vue version, and uses the same data source query-core itself uses internally. Cost: introduces a new peerDependency on `@dialpad/dialtone-vue`. Benefit: zero plugin conversion, zero new patterns, full data-driven correctness including future-proofing against component changes.

**Alternatives considered:**

- **Convert plugin to ESM, consume query-core directly** — rejected. 11-file conversion plus test infra changes plus consumer compatibility risk on older ESLint versions. Disproportionate to the goal.
- **Bundle a build-time JSON snapshot into the plugin** — rejected. Introduces a duplicate-snapshot pattern not used elsewhere; data can drift from the consumer's installed dialtone-vue. Direct JSON via exports is strictly better.

## Context for Implementer

### Patterns to follow

- **Visitor pattern:** `lib/rules/deprecated-stack-alignment-classes.js:50-108` — uses `VElement` visitor, looks at `node.startTag.attributes`, finds attributes by `attr.key.name === '<name>'`. This is the right pattern for our rule because we need to inspect multiple attributes per element (the offending prop AND any existing `class` / `:class` for merge logic).
- **Simpler attribute pattern (alternative to consider):** `lib/rules/deprecated-flex-gap-classes.js:27-43` — uses `VAttribute` visitor for single-attribute rules. Probably insufficient for our needs because of cross-attribute merge logic, but worth keeping in mind.
- **Test setup:** `tests/lib/rules/deprecated-stack-alignment-classes.js:14-22` — Mocha + `RuleTester` instantiated with `parser: require.resolve('vue-eslint-parser')`. Use `output` field on `invalid` cases to assert autofix output.
- **Plugin auto-load:** `lib/index.js:19` does `module.exports.rules = requireIndex(__dirname + "/rules")`. Just save `deprecated-class-props.js` in `lib/rules/` and it picks up automatically — no index registration needed.

### Conventions

- File names: kebab-case. Rule file: `deprecated-class-props.js`. Test file: `deprecated-class-props.js`. Docs file: `deprecated-class-props.md`.
- Rule meta `type: 'suggestion'`, `recommended: false`, `fixable: 'code'`.
- Message keys are camelCase string identifiers (`messages: { propRemoved: '...' }`).
- Rule docs URL convention: `https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-class-props.md`.

### Key files

- `packages/eslint-plugin-dialtone/lib/rules/deprecated-class-props.js` — the rule (create).
- `packages/eslint-plugin-dialtone/tests/lib/rules/deprecated-class-props.js` — tests (create).
- `packages/eslint-plugin-dialtone/docs/rules/deprecated-class-props.md` — docs (create).
- `packages/eslint-plugin-dialtone/package.json` — modify to add peerDependencies.
- `packages/dialtone-vue/dist/component-documentation.json` — read-only data source. Shape: `Component[]` where `Component = { displayName: string, props?: { name: string, ... }[], ... }` per `packages/dialtone-query-core/src/types.ts:43-65`.
- `packages/dialtone-css/lib/build/js/dialtone_migrate_props/index.mjs:358-401` — reference implementation of `applyRootClassRename` with the canonical merge logic (regex-based; we reimplement using AST ranges but produce identical output).

### Gotchas

- **Component name resolution:** template tags can be `<dt-input>` (kebab) or `<DtInput>` (PascalCase). `component-documentation.json` keys components by `displayName` (`DtInput`). Normalize the tag name to PascalCase before lookup. Example: `dt-feed-item-pill` → `DtFeedItemPill`.
- **Prop name normalization:** templates can use `root-class` or `rootClass`; `component-documentation.json` stores props in camelCase (`rootClass`). Normalize the attribute name to camelCase before lookup.
- **Vue `inheritAttrs` default-true class merging:** when consumers add `class="x"` to a Dialtone component, Vue's framework-level merge handles forwarding regardless of whether the component has explicit `$attrs.class` plumbing. This is what makes the rename mechanically safe across all flagged components — verified during PRD source-of-truth investigation.
- **Idempotent autofix:** ESLint applies fixes iteratively until output is stable. The rule is naturally idempotent — once `root-class` is renamed to `class`, the rule's detection no longer matches the tag, so no further fix is produced.
- **`requireIndex` only loads `.js` files in `lib/rules/`:** don't accidentally save the rule with a different extension or in a subdirectory.
- **`vue-eslint-parser` availability:** the rule's tests will fail if `vue-eslint-parser` isn't resolvable. The plugin already uses `require.resolve('vue-eslint-parser')` in existing tests, so it should already be available in the workspace's `node_modules`. Double-check during Task 1.
- **JSON `exports` subpath:** `@dialpad/dialtone-vue` exports `./component-documentation.json` (verified at `packages/dialtone-vue/package.json`). The Node `require()` resolver respects exports maps — this works in modern Node. If the consumer's installed dialtone-vue is older and lacks this export, `require()` will throw. Wrap the import in a try/catch and have the rule degrade to no-op when data is unavailable (log once, do not flag anything).

### Domain context

- The migration this rule guards (DLT-3100) removed `rootClass`, `wrapperClass`, and `containerClass` from a set of components. The codemod and migration docs already shipped via DLT-3157. This rule is the ongoing guardrail.
- Consumers of `@dialpad/eslint-plugin-dialtone` are typically Dialpad product teams whose Vue projects already use `eslint-plugin-vue` and therefore already have `vue-eslint-parser` available. Adding `vue-eslint-parser` as a peerDependency formalizes the existing implicit assumption.
- The data-driven design means: DtListItem and DtPopoverHeaderFooter (which still declare `wrapperClass` legitimately on `next`) are NOT flagged. Future deprecations of these prop names on any component are picked up automatically without rule code changes.

## File Structure

- `packages/eslint-plugin-dialtone/lib/rules/deprecated-class-props.js` (create) — rule logic. Visitor + detection + autofix. Module-level cache of components data.
- `packages/eslint-plugin-dialtone/tests/lib/rules/deprecated-class-props.js` (create) — Mocha + RuleTester suite covering detection, autofix, and regression.
- `packages/eslint-plugin-dialtone/docs/rules/deprecated-class-props.md` (create) — rule documentation following the format of `docs/rules/deprecated-flex-gap-classes.md`.
- `packages/eslint-plugin-dialtone/package.json` (modify) — add `@dialpad/dialtone-vue` and `vue-eslint-parser` to `peerDependencies`.

## Assumptions

- **Assumption A1:** In production (when consumers install the plugin alongside `@dialpad/dialtone-vue`), the published dialtone-vue package contains `dist/component-documentation.json` and exposes it via the `./component-documentation.json` exports subpath. — Supported by `packages/dialtone-vue/package.json` (`"./component-documentation.json": "./dist/component-documentation.json"` in `exports`). The file is a build artifact (`dist/` is in build output), so it is present in the *published* package but is regenerated by `pnpm nx run dialtone-vue:build` for local consumers. Tasks 2, 3 depend on this for production behavior. **Tests do NOT depend on this** — they use a controlled fixture via `proxyquire` (Assumption A6).
- **Assumption A2:** `Component[]` shape in the JSON matches `packages/dialtone-query-core/src/types.ts:58-65` — `{ displayName, props?: { name, ... }[], ... }`. — Supported by reading the JSON and the `vue-docgen-api` extraction in `scripts/build-dialtone-vue-docs.mjs`. Tasks 2, 3, 4 depend on this.
- **Assumption A3:** `vue-eslint-parser` is resolvable in workspaces that consume the plugin AND in the plugin's own test environment. — Currently it works because `vue-eslint-parser` is hoisted into the workspace's `node_modules` as a transitive dependency. To formalize this for both audiences, Task 1 adds it to BOTH `peerDependencies` (consumer-facing) AND `devDependencies` (plugin's own test runs). Without the devDep, strict pnpm hoisting would break the plugin's tests. Tasks 2-5 depend on this.
- **Assumption A4:** Mocha + `eslint`'s `RuleTester` with `parser` option works for ESLint 7+. — Supported by the existing test file `tests/lib/rules/deprecated-stack-alignment-classes.js` using exactly this pattern with the workspace's installed `eslint ^9.33.0`. Task 2's test setup depends on this.
- **Assumption A5:** Vue's default `inheritAttrs: true` correctly merges consumer `class` onto the component's resolved root element across all 13 affected components. — Supported by PRD source-of-truth verification across all 13 components. Task 3's autofix correctness depends on this.
- **Assumption A6:** `proxyquire` reliably stubs JSON-file imports in CommonJS tests. — Standard pattern for ESLint rule testing. Tasks 2-4 depend on this for deterministic test behavior independent of workspace branch state. Tests construct an explicit `MOCK_COMPONENTS` fixture representing the post-deprecation state (DtInput WITHOUT `rootClass`, DtListItem WITH `wrapperClass`, etc.) and inject it via `proxyquire` when loading the rule.

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Older dialtone-vue installed in consumer's repo lacks the JSON exports subpath | Low | Medium | Defensive load in rule's module init: try/catch the `require`. On failure, set components to empty array. Rule never fires on missing data. Surface a one-time `console.warn` so the consumer learns of the version mismatch. (Verified in Task 2.) |
| In a clean checkout / CI without `dialtone-vue:build` having run, the live JSON is absent — production-mode rule would no-op silently | Medium | Low | Tests use mocked fixture (not the live JSON), so test runs are unaffected. For end-to-end verification in CI, ensure `dialtone-vue:build` runs before the plugin's test target — or accept the no-op as graceful degradation since the rule's only role in this state is "do nothing" (no consumer code to lint). |
| Branch state mismatch — we're on `feat/dlt-3281...` off `staging`, where deprecated props are STILL declared | Low | Low | Tests use post-deprecation fixture data via proxyquire — completely decoupled from the workspace's actual `dist/component-documentation.json`. Production behavior on consumer machines uses *their* installed dialtone-vue, which will be the post-deprecation version once Dialtone v10 ships. |
| Component-name normalization edge case (e.g. tag has unusual casing) | Low | Low | Implement explicit kebab-to-PascalCase function. Test with `<dt-feed-item-pill>`, `<DtFeedItemPill>`, `<dt-input>`, `<DtInput>`. Out-of-set tags (e.g. `<custom-element>`) skip lookup entirely — only `dt-*`/`Dt*` tags are inspected. |
| Autofix introduces a syntax error in some edge case | Low | High | TDD — every fix scenario has a test asserting exact output. The fixer uses range-based replacement that operates at AST-known boundaries; the codemod's algorithm has been deployed and proven. Manual smoke test in Task 6 catches anything the unit tests miss. |
| Multi-fix interactions on a tag with both an offending prop AND multi-line `class` formatting | Medium | Low | Use AST node `range` from `vue-eslint-parser` rather than regex on raw text. The visitor sees structured nodes regardless of source formatting. Test multi-line case explicitly. |
| ESLint version compatibility (plugin supports `eslint >= 7`) | Low | Medium | `parserServices.defineTemplateBodyVisitor` and the `RuleTester` API used here have been stable since ESLint 6. `context.sourceCode ?? context.getSourceCode()` (already used by existing rules) handles ESLint 8+ transition. No new compatibility surface. |
| Regression — silently breaking existing rules during refactor | Very Low | Medium | This task adds a new rule and modifies only `package.json`. No existing rule code is touched. Run full plugin test suite in Task 6. |

## Goal Verification

### Truths

1. T-001: Running `pnpm nx run eslint-plugin-dialtone:test` on the new test file produces 0 failures.
2. T-002: With MOCK_COMPONENTS injected via proxyquire (DtInput WITHOUT rootClass), the rule reports a warning on `<dt-input root-class="d-w332" />`.
3. T-003: With the same MOCK_COMPONENTS, the rule's autofix output for `<dt-input root-class="d-w332" />` is `<dt-input class="d-w332" />`.
4. T-004: With the same MOCK_COMPONENTS (DtListItem WITH wrapperClass), the rule reports NO warning on `<dt-list-item wrapper-class="d-pt8" />`.
5. T-005: With the same MOCK_COMPONENTS, the rule warns on `<dt-input :root-class="dynExpr" :class="otherExpr" />` but produces no autofix output (left unchanged).
6. T-006: The full plugin test suite passes — all 11 existing rule tests + the new test file — confirming no regression.
7. T-007: `pnpm nx run eslint-plugin-dialtone:lint` (markdownlint on docs) passes for the new `deprecated-class-props.md`.

### Artifacts

- `packages/eslint-plugin-dialtone/lib/rules/deprecated-class-props.js` — the rule.
- `packages/eslint-plugin-dialtone/tests/lib/rules/deprecated-class-props.js` — the test suite.
- `packages/eslint-plugin-dialtone/docs/rules/deprecated-class-props.md` — the documentation.
- `packages/eslint-plugin-dialtone/package.json` — peerDependencies updated.

## Progress Tracking

- [x] Task 1: Add peerDependencies and verify install
- [x] Task 2: Implement rule detection logic with module-level data load
- [x] Task 3: Implement autofix for static and dynamic class-prop renames
- [x] Task 4: Add regression tests for currently-valid components (DtListItem, DtPopoverHeaderFooter)
- [x] Task 5: Write rule documentation
- [x] Task 6: Manual smoke test on a fixture file and run full plugin suite

**Total Tasks:** 6 | **Completed:** 6 | **Remaining:** 0

## Implementation Tasks

### Task 1: Add peerDependencies and verify install

**Objective:** Declare the rule's two new peer dependencies in the plugin's `package.json` and confirm they resolve cleanly in the workspace.

**Dependencies:** None.
**Mapped Truths:** T-006.

**Files:**

- Modify: `packages/eslint-plugin-dialtone/package.json`

**Key Decisions / Notes:**

- Add to `peerDependencies`:
  - `"@dialpad/dialtone-vue": "workspace:^3"` — matches the convention used by `dialtone-query-core` (workspace devDep) and `language-server` (workspace runtime dep).
  - `"vue-eslint-parser": ">=9"` — version range that supports `defineTemplateBodyVisitor` and matches what `eslint-plugin-vue` v9+ requires.
- Add to `devDependencies` (in addition to existing `mocha`):
  - `"vue-eslint-parser": ">=9"` — required so the plugin's own `RuleTester` setup can resolve the parser without depending on workspace hoisting (per spec-review must_fix #3).
  - `"proxyquire": "^2.1.3"` — required by Task 2's tests to stub the `@dialpad/dialtone-vue/component-documentation.json` import with a controlled fixture, decoupling tests from workspace branch state.
- Do NOT touch `dependencies` (still just `requireindex`).
- Existing `peerDependencies.eslint` (`">=7"`) stays.

**Definition of Done:**

- [ ] `package.json` has both new entries in `peerDependencies` and both new entries in `devDependencies`.
- [ ] `pnpm install` from the repo root completes without warnings related to the plugin.
- [ ] `require.resolve('vue-eslint-parser')` and `require.resolve('proxyquire')` both succeed when run from `packages/eslint-plugin-dialtone/`.
- [ ] No diagnostics errors in `package.json`.

**Verify:**

- `pnpm install` (run from repo root)
- `cd packages/eslint-plugin-dialtone && node -e "require.resolve('vue-eslint-parser'); require.resolve('proxyquire'); console.log('OK')"` → prints `OK`

### Task 2: Implement rule detection logic with module-level data load

**Objective:** Create the rule file with detection only (no autofix yet). Load `component-documentation.json` once at module init, build a normalized lookup, and report a warning whenever an offending attribute appears on a Dialtone tag whose component does NOT declare that prop.

**Dependencies:** Task 1.
**Mapped Truths:** T-002, T-004, T-006.

**Files:**

- Create: `packages/eslint-plugin-dialtone/lib/rules/deprecated-class-props.js`
- Create: `packages/eslint-plugin-dialtone/tests/lib/rules/deprecated-class-props.js`

**Key Decisions / Notes:**

- **Visitor:** use `parserServices.defineTemplateBodyVisitor({ VElement(node) { ... } })`. We need access to the start tag's full attribute list to support cross-attribute merge logic in Task 3 — `VElement` gives us `node.startTag.attributes`. Pattern matches `lib/rules/deprecated-stack-alignment-classes.js:50-108`.
- **Tag detection:** match `node.rawName` or `node.name` against `^dt-` (kebab) or `^Dt[A-Z]` (PascalCase). Skip non-Dialtone tags entirely.
- **Tag-name normalization:** kebab-to-PascalCase function. Example: `dt-feed-item-pill` → `DtFeedItemPill`. Reuse Vue's standard conversion: split on `-`, capitalize each segment, join.
- **Attribute matching:** for each attribute in `node.startTag.attributes`, check if the attribute name (or directive argument for `:`-bound) matches one of the 6 deprecated names (3 props × 2 casings). Use a const set. Example for static: `attr.directive === false && attr.key.name === 'root-class'`. For dynamic: `attr.directive === true && attr.key.argument?.name === 'root-class'`.
- **Module-level data load (defensive):** at the top of the rule file, attempt `require('@dialpad/dialtone-vue/component-documentation.json')` inside try/catch. On failure, set `components = []` and emit `console.warn('[eslint-plugin-dialtone] Could not load component-documentation.json from @dialpad/dialtone-vue. The deprecated-class-props rule will be skipped.')` once. The `require` call is what tests will stub via `proxyquire` — the rule must use this exact import path (no indirection) so the stub matches.
- **Lookup helper:** `componentDeclaresProp(displayName, propName)` — `components.find(c => c.displayName === displayName)?.props?.some(p => p.name === propName) ?? false`. Cache the lookup if perf shows up as an issue (premature for now — N=~60 components, list traversal is fine).
- **Reporting:** report on the offending `VAttribute` node. Message: `"DtFoo does not accept a 'rootClass' prop. Use the native 'class' attribute instead. See: https://dialtone.dialpad.com/guides/migration/component-props/"`.
- **No fix in this task** — `meta.fixable: null` for now. Task 3 flips to `'code'` and adds the fixer.
- **Test setup:** mirror `tests/lib/rules/deprecated-stack-alignment-classes.js` AND inject mocked component data via `proxyquire`:
  ```js
  const proxyquire = require('proxyquire').noCallThru();
  const MOCK_COMPONENTS = [
    { displayName: 'DtInput', props: [{ name: 'label' }, { name: 'value' }] },          // post-deprecation: no rootClass
    { displayName: 'DtListItem', props: [{ name: 'wrapperClass' }, { name: 'label' }] }, // currently declares wrapperClass
    { displayName: 'DtToggle', props: [{ name: 'label' }, { name: 'showLabel' }] },     // post-deprecation: no wrapperClass
    { displayName: 'DtCard', props: [{ name: 'header' }, { name: 'footer' }] },         // post-deprecation: no containerClass
    { displayName: 'DtAvatar', props: [{ name: 'fullName' }, { name: 'interactive' }] }, // never had rootClass
    { displayName: 'DtFeedItemPill', props: [{ name: 'kind' }] },                       // post-deprecation: no wrapperClass
  ];
  const rule = proxyquire('../../../lib/rules/deprecated-class-props', {
    '@dialpad/dialtone-vue/component-documentation.json': MOCK_COMPONENTS,
  });
  const ruleTester = new RuleTester({ parser: require.resolve('vue-eslint-parser'), parserOptions: { ecmaVersion: 'latest' } });
  ```
  All test cases run against `MOCK_COMPONENTS` — the rule's behavior is fully deterministic regardless of what's in `packages/dialtone-vue/dist/component-documentation.json` on the current branch.
- **Tests for this task — detection cases only:**
  - Valid cases (should NOT report):
    - `<dt-input class="x" />` — using `class` is correct
    - `<dt-input :class="expr" />` — using `:class` is correct
    - `<dt-input />` — no offending attribute
    - `<div root-class="x" />` — not a Dialtone tag
    - `<dt-list-item wrapper-class="x" />` — DtListItem declares `wrapperClass` in MOCK
    - `<dt-list-item :wrapper-class="cls" />` — same, dynamic form
  - Invalid cases (should report 1 warning each — DtInput as anchor):
    - `<dt-input root-class="x" />` — static kebab
    - `<dt-input rootClass="x" />` — static camel
    - `<dt-input :root-class="expr" />` — dynamic kebab
    - `<dt-input :rootClass="expr" />` — dynamic camel
    - `<DtInput rootClass="x" />` — PascalCase tag, camelCase attr
    - `<dt-toggle wrapper-class="x" />` — different prop, different component (DtToggle in MOCK has no wrapperClass)
    - `<dt-card container-class="x" />` — third prop, third component (DtCard in MOCK has no containerClass)
    - `<dt-feed-item-pill wrapper-class="x" />` — multi-segment kebab tag normalization check
    - `<dt-avatar root-class="x" />` — the "never had it" case (DtAvatar in MOCK has no rootClass)
    - `<dt-list-item root-class="x" />` — sanity check that DtListItem is not blanket-skipped (it has wrapperClass but NOT rootClass)

**Definition of Done:**

- [ ] Rule file exists, exports valid `RuleModule` shape.
- [ ] All detection test cases pass.
- [ ] No regression in other plugin tests.
- [ ] `requireindex` auto-loads the rule (no manual registration needed; verify by running the test).

**Verify:**

- `pnpm nx run eslint-plugin-dialtone:test` — full suite passes including the new test file.
- Spot check: `node -e "console.log(require('@dialpad/eslint-plugin-dialtone').rules['deprecated-class-props'])"` from the repo root should print the rule object.

### Task 3: Implement autofix for static and dynamic class-prop renames

**Objective:** Add the autofix logic per the four rename scenarios from the PRD and the codemod's `applyRootClassRename`. Update rule meta `fixable: 'code'`.

**Dependencies:** Task 2.
**Mapped Truths:** T-003, T-005, T-006.

**Files:**

- Modify: `packages/eslint-plugin-dialtone/lib/rules/deprecated-class-props.js`
- Modify: `packages/eslint-plugin-dialtone/tests/lib/rules/deprecated-class-props.js`

**Key Decisions / Notes:**

- **Reference algorithm:** `packages/dialtone-css/lib/build/js/dialtone_migrate_props/index.mjs:358-401` (`applyRootClassRename`). We reimplement with AST ranges instead of regex.
- **Four scenarios:**
  1. **Static, no existing class** → replace the offending attribute with `class="<value>"`. Single `fixer.replaceText(node, 'class="<value>"')`.
  2. **Static, with existing `class="other"`** → drop the offending attribute and append the value to the existing class. Two-edit fix: `fixer.removeRange(<offending-range-with-leading-whitespace>)` + `fixer.replaceText(<existing-class-node>, 'class="other <value>"')`. Use `fixer.replaceTextRange` covering the union of both ranges if ESLint complains about overlapping fixes.
  3. **Dynamic, no existing `:class`** → replace with `:class="<expr>"`. Single replacement.
  4. **Dynamic, with existing `:class`** → emit warning only (no fix). The fix function returns `null` for this case. Test asserts `output: null` (or absent).
- **Whitespace handling:** when removing an attribute that's preceded by whitespace, include the whitespace in the removal so the resulting tag doesn't have a double space. Use `sourceCode.getTokenBefore(attr)` to find the preceding whitespace boundary.
- **Existing-class detection:** before fixing, scan `node.startTag.attributes` for an attribute matching `attr.key.name === 'class'` (static) or `attr.directive && attr.key.argument?.name === 'class'` (dynamic). Match the offending prop's binding form to the appropriate target (static prop merges into static class; dynamic prop merges into dynamic class).
- **Test cases for this task:**
  - Static, no class: `<dt-input root-class="d-w332" />` → `<dt-input class="d-w332" />`
  - Static, with class: `<dt-input class="other" root-class="d-w332" />` → `<dt-input class="other d-w332" />`
  - Static, with class (other order): `<dt-input root-class="d-w332" class="other" />` → `<dt-input class="other d-w332" />`
  - Dynamic, no :class: `<dt-input :root-class="cls" />` → `<dt-input :class="cls" />`
  - Dynamic, with :class: `<dt-input :root-class="cls" :class="other" />` → unchanged, warning only.
  - Idempotency: running fix twice on the static-no-class case still yields the static-no-class fixed output.

**Definition of Done:**

- [ ] `meta.fixable` set to `'code'`.
- [ ] All four autofix scenarios produce the expected output (or no output for the warn-only case).
- [ ] Idempotency test passes.
- [ ] No regression in other plugin tests.

**Verify:**

- `pnpm nx run eslint-plugin-dialtone:test` — passes.
- `node -e "..."` snippet running the rule on a string with `root-class` and `class` and asserting fixed output shape.

### Task 4: Add regression and idempotency assertions

**Objective:** Lock in the data-driven correctness with explicit assertions that components currently declaring these props are NOT flagged, and that the autofix is idempotent.

**Dependencies:** Tasks 2 and 3.
**Mapped Truths:** T-004, T-006.

**Files:**

- Modify: `packages/eslint-plugin-dialtone/tests/lib/rules/deprecated-class-props.js`

**Key Decisions / Notes:**

- The DtListItem regression cases were already added in Task 2's valid array (the MOCK_COMPONENTS fixture includes DtListItem with `wrapperClass`). This task adds **assertion comments** documenting their regression intent and adds two additional checks:
  - **Idempotency:** an explicit test that runs the rule's fix once on `<dt-input root-class="x" />`, takes the output, runs the rule again on that output, and asserts no further fix is produced.
  - **Mock-shape sanity:** a unit-level test that the rule's `componentDeclaresProp` lookup helper returns `true` for `('DtListItem', 'wrapperClass')` and `false` for `('DtInput', 'rootClass')` against MOCK_COMPONENTS. This tests the lookup function in isolation without the visitor.
- DtPopoverHeaderFooter was originally proposed as a second regression anchor but is **dropped from the test fixture**: on `staging` (the branch we're targeting), the component does NOT declare `wrapperClass` — that declaration is only on `next`. Including it would cause a test failure as soon as the workspace branch state changed. DtListItem alone is the regression anchor; it declares `wrapperClass` on both `staging` and `next`.
- Add a code comment in the test file at the top of the regression assertions: `// Regression — components currently declaring these prop names must NOT be flagged. Source-of-truth: dialtone-vue components/list_item/list_item.vue (wrapperClass declared at line 143 on staging).`

**Definition of Done:**

- [ ] DtListItem regression cases are explicitly commented in the test file as regression assertions.
- [ ] Idempotency test passes (running fix twice yields the same output).
- [ ] Lookup-function unit test passes.
- [ ] No regression in other plugin tests.

**Verify:**

- `pnpm nx run eslint-plugin-dialtone:test` — passes.

### Task 5: Write rule documentation

**Objective:** Create `docs/rules/deprecated-class-props.md` matching the format of existing rule docs.

**Dependencies:** Tasks 2 and 3 (so the doc accurately describes the implemented behavior).
**Mapped Truths:** T-007.

**Files:**

- Create: `packages/eslint-plugin-dialtone/docs/rules/deprecated-class-props.md`

**Key Decisions / Notes:**

- Follow the format of `docs/rules/deprecated-flex-gap-classes.md` and `docs/rules/deprecated-stack-alignment-classes.md`.
- Required sections:
  - Title: `# Detects deprecated structural class props on Dialtone components (deprecated-class-props)`
  - Rationale (1-2 paragraphs): explain why these props were removed (DLT-3100), why the rule exists (ongoing guardrail), link to migration guide.
  - Examples — `## Rule Details` with subsections:
    - Examples of **incorrect** code (3-4 examples covering kebab/camel/static/dynamic).
    - Examples of **correct** code (the same examples after fix).
    - "When the rule does NOT fire" — examples of currently-valid usages (DtListItem with `wrapper-class`).
  - Autofix behavior — `## Auto-fix` section listing the four scenarios.
  - References — link to the migration guide URL, link to the dialtone-vue components docs.
- Lint with markdownlint via `pnpm nx run eslint-plugin-dialtone:lint`.

**Definition of Done:**

- [ ] File exists and follows the required structure.
- [ ] All code examples in the doc are valid Vue templates that the rule would correctly handle.
- [ ] Markdownlint passes (`pnpm nx run eslint-plugin-dialtone:lint`).

**Verify:**

- `pnpm nx run eslint-plugin-dialtone:lint`

### Task 6: Mocha integration smoke test and run full plugin suite

**Objective:** Confirm the rule behaves correctly on a multi-line, realistic template fixture in a single Mocha integration block, and that the full plugin test suite passes with no regressions. Avoids the ESLint 9 flat-config incompatibility of a raw CLI invocation.

**Dependencies:** Tasks 1-5.
**Mapped Truths:** T-001, T-002, T-003, T-005, T-006.

**Files:**

- Modify: `packages/eslint-plugin-dialtone/tests/lib/rules/deprecated-class-props.js` — add a final `describe('integration smoke test', ...)` block.

**Key Decisions / Notes:**

- ESLint 9 flat config has dropped the legacy CLI flags (`--no-eslintrc`, `--rule` as CLI string, `--plugin`). The workspace runs `eslint ^9.33.0`, so a CLI smoke test would require constructing a temporary flat config file. Simpler and more reliable: write the smoke test as another `RuleTester` block with multi-statement code samples.
- Smoke test shape (added to the same test file using the same MOCK_COMPONENTS):
  ```js
  ruleTester.run('deprecated-class-props (integration)', rule, {
    valid: [
      {
        code: `<template>
          <dt-input class="d-pl8" />
          <dt-list-item wrapper-class="d-pt8" />
        </template>`,
      },
    ],
    invalid: [
      {
        code: `<template>
          <dt-input root-class="d-w332" label="Email" />
          <dt-toggle wrapper-class="d-mt16" />
          <dt-card container-class="d-mbs-300" />
          <dt-avatar root-class="d-mr8" />
          <dt-input :root-class="myClass" />
          <dt-input :root-class="myClass" :class="otherClass" />
          <dt-list-item wrapper-class="d-pt8" />
          <dt-input class="d-pl8" root-class="d-w332" />
        </template>`,
        errors: 7, // every <dt-*> line above except <dt-list-item>
        output: `<template>
          <dt-input class="d-w332" label="Email" />
          <dt-toggle class="d-mt16" />
          <dt-card class="d-mbs-300" />
          <dt-avatar class="d-mr8" />
          <dt-input :class="myClass" />
          <dt-input :root-class="myClass" :class="otherClass" />
          <dt-list-item wrapper-class="d-pt8" />
          <dt-input class="d-pl8 d-w332" />
        </template>`, // exact post-fix output, including the unchanged warn-only line
      },
    ],
  });
  ```
- Run full plugin test suite: `pnpm nx run eslint-plugin-dialtone:test`. Expect: all 11 existing rule tests + new test file pass, 0 failures.
- This integration block lives in the same test file as the unit cases — no separate fixture file, no separate ESLint invocation. It exercises the rule end-to-end through the same data path consumers will use, with realistic multi-line input.

**Definition of Done:**

- [ ] Integration smoke test produces 7 errors and the exact expected post-fix output.
- [ ] `pnpm nx run eslint-plugin-dialtone:test` passes (0 failures across all rule test files).
- [ ] `pnpm nx run eslint-plugin-dialtone:lint` passes.
- [ ] Plan moved to `Status: COMPLETE` once all tasks above are done.

**Verify:**

- `pnpm nx run eslint-plugin-dialtone:test`
- `pnpm nx run eslint-plugin-dialtone:lint`

## Open Questions

None at this time. All design decisions resolved during PRD and Step 7.

## Deferred Ideas

- **Inclusion in the plugin's `recommended` preset.** Existing rules all opt out (`recommended: false`); follow that convention for now. A future plugin-wide review could decide to enable selected rules in `recommended`.
- **Sunset path for the rule.** Once the deprecation window closes (e.g., 6 months after Dialtone v10 GA), this rule could be removed. Not actionable now but worth tracking — add a CHANGELOG note when removing.
- **Rule schema/options.** Currently no options needed. If consumers later want to disable the autofix per-project (e.g., to manually review every change), we could add `{ autofix: 'always' | 'never' }`. Defer until requested.
- **A general "deprecation registry" pattern across the design system.** Worth revisiting when a future deprecation has a shape this rule's data-driven approach can't model (e.g., requires historical "what was removed" data not derivable from current source).
