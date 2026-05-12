---
paths:
  - "packages/dialtone-vue/**"
  - "packages/dialtone-css/**"
  - "packages/dialtone-tokens/**"
  - "packages/dialtone-icons/**"
---

# Code Review Rules

Dialtone code review checklist. Each rule is an objective trigger for the local `/review` pipeline (Agents A/B/C) and for human reviewers.

**Rule format:** `[SEVERITY]` trigger — optional grep pattern — Fix.
**Evidence required on every finding:** file:line citation, quoted rule text, or CodeGraph reference.
**Only flag changed lines.** Pre-existing issues on unchanged lines are excluded.

---

## What NOT to Flag

Stop before flagging any of the following — they are excluded from this pipeline:

- **Pre-existing issues** — code that was wrong before this PR; flag only what the PR introduced.
- **Pedantic nitpicks** — issues a senior engineer wouldn't call out in a real review.
- **Linter / typechecker-catchable issues** — formatting, unused variables, type errors. These run in CI. Do not duplicate CI.
- **General code quality / test coverage** — unless a specific rule below directly names it.
- **CLAUDE.md-mentioned issues silenced via lint-ignore** — already acknowledged; no value in repeating.
- **Changes in functionality that are likely intentional** — anything clearly related to the PR's stated purpose.
- **Issues on lines the PR did not modify** — line must appear in `git diff $BASE...HEAD`.
- **Style or formatting** — handled by Prettier / Stylelint / ESLint. These run in CI.
- **Anything CodeRabbit would catch on first pass** — diff-local nits, common Vue patterns, import style. CodeRabbit already reviews every PR. Add signal, not noise.

---

## HIGH SIGNAL Definition

Flag ONLY findings in one of these three categories. Anything outside is NOISE:

1. **Compile / parse failures** — syntax errors, type errors, missing imports, unresolved references. The code would fail to build.
2. **Definite logic errors** — code that will produce wrong results regardless of inputs. A one-character bug test: would a single-character change expose this? If unsure, don't flag.
3. **Clear, quotable rule violations** — a rule in this file (or a path-scoped `.claude/rules/*.md` rule) is unambiguously violated. Quote the exact rule and the exact offending line.

---

## Evidence Requirements

Every finding must include at least ONE of:
- `file:line` citation (e.g., `packages/dialtone-vue/components/button/button.vue:42`)
- Quoted rule text (e.g., `Rule: "Props must use 'validator', not 'validate'"`)
- CodeGraph reference (e.g., `codegraph_callers(syncState) returned 5 callers in packages/dialtone-vue`)

Findings without evidence are invalid and must be dropped by the Validator.

---

## 1. Reuse & Duplication

**[IMPORTANT]** Component too similar to existing one in the system.
Pattern: check if a component with ≥ 70% overlapping props/behavior already exists in `packages/dialtone-vue/components/`.
Fix: Point to the existing component; suggest extending it.

**[IMPORTANT]** Repeated code that should be extracted into a reusable function or composable.
Pattern: the same logic block (≥ 5 lines) appears in 2+ places in the diff.
Fix: Extract into a shared utility under `packages/dialtone-vue/utils/` or a composable.

---

## 2. Code Quality & Readability

**[IMPORTANT]** Dead code, unused variables, or unnecessary complexity introduced in the diff.
Pattern: variables declared but never read, branches that are always false, commented-out code blocks.
Fix: Remove dead code; simplify.

**[IMPORTANT]** Swallowed errors / silent failure — empty catch blocks, `.catch(() => {})`, unlogged rejections.
Pattern: `catch\s*\([^)]*\)\s*\{\s*\}` or `.catch\((?:\(\)\s*=>\s*\{\s*\}|\s*\(\)\s*=>\s*undefined)`.
Fix: Log the error or re-throw it. Silent failures hide production bugs.

**[NIT]** Complex logic without an explanatory comment.
Fix: Add a 1-line comment explaining the WHY (not the what).

---

## 3. Vue Correctness

**[BLOCKING]** Prop uses `validate:` instead of `validator:` — Vue silently ignores `validate`.
Pattern: `^\s*validate:\s*(?:function|\()` in `.vue` files.
Fix: Rename to `validator:`.

**[BLOCKING]** `$slots` used inside a `computed()` property — `$slots` is not reactive in computed.
Pattern: `computed\(.*\$slots` in `.vue` files.
Fix: Use `$slots` in templates or in non-computed methods only.

**[IMPORTANT]** New component uses Options API instead of Composition API with `<script setup lang="ts">`.
Pattern: `export default \{` in a new `.vue` file.
Fix: Use `<script setup lang="ts">`. Exception: existing components using Options API with `compatConfig: { MODE: 3 }` — do NOT flag conversions of those.

**[IMPORTANT]** Event name deviates from convention — `update:modelValue` for v-model, `update:open` for overlay visibility.
Fix: Rename to the canonical event name. Breaking event renames need `BREAKING CHANGE:` footer.

**[IMPORTANT]** Component styles written inline in `<style>` inside a `packages/dialtone-vue` component — styles belong in `packages/dialtone-css/`.
Fix: Move to `packages/dialtone-css/`; use `d-*` utility classes in templates.

**[NIT]** Boolean prop uses wrong prefix convention — general booleans use `is/has/show`; visibility toggles use `hideX` negative polarity.
Fix: Rename to match convention (e.g., `hideClose`, `hasHeader`).

See `.claude/rules/vue-components.md` for full Vue conventions.

---

## 4. CSS / Styling

**[BLOCKING]** Raw hex/rgb values, hardcoded `px`, or inline `z-index` — must use design tokens.
Pattern: `(?:color|background|border):\s*#[0-9a-fA-F]{3,6}` or `\b\d+px\b` in `.less` / `.css` / Vue `<style>`.
Fix: Replace with `var(--dt-color-*)`, `var(--dt-space-*)`, `var(--dt-size-*)`, `var(--dt-z-index-*)`, `var(--dt-radius-*)`.

**[IMPORTANT]** Deep CSS selectors (nesting beyond 2 levels) — use flat selectors.
Pattern: 3+ levels of CSS nesting.
Fix: Flatten the selector.

**[NIT]** BEM naming deviation in component styles.
Fix: Follow BEM (`block__element--modifier`).

See `.claude/rules/css-utilities.md` for token reference and naming conventions.

---

## 5. Design Tokens

**[BLOCKING]** Token references non-existent token or uses a base palette color instead of a semantic token.
Pattern: `var(--dt-color-[a-z]+-[0-9]{3})` (base palette) in component-level token files — component tokens must reference semantic (`--dt-color-*`) tokens, not base.
Fix: Reference the semantic token.

**[BLOCKING]** New token missing dark mode override in `dark.json`.
Fix: Add the dark mode value.

**[IMPORTANT]** New token not defined across all 8 themes (Dialpad Light/Dark, T-Mobile Light/Dark, Expressive Light/Dark, Expressive Small Light/Dark).
Fix: Add to all 8 theme files.

**[IMPORTANT]** Token naming deviates from camelCase + category prefix convention (`dtColor*`, `dtSpace*`, `dtFontSize*`, `dtFontWeight*`, `dtShadow*`, `dtRadius*`, `dtSize*`).
Fix: Rename to follow convention.

See `.claude/rules/design-tokens.md` for full token conventions.

---

## 6. API & Library Design

**[BLOCKING]** Prop, event, or slot removed or renamed without `BREAKING CHANGE:` footer in commit message. Uncategorized breaking changes ship as patches.
Pattern: look for removed / renamed props in `.vue` diff without `BREAKING CHANGE` anywhere in the commit message.
Fix: Add `BREAKING CHANGE: <description>` footer or restore the removed item.

**[BLOCKING]** New export added with `fix:` commit type instead of `feat:`. New exports are minor, not patch.
Fix: Change commit type to `feat:`.

**[IMPORTANT]** Class prop does not accept all three types: `String`, `Object`, `Array`.
Fix: Change prop type to `[String, Object, Array]`.

**[IMPORTANT]** Exported symbol not added to the package's index or entry point.
Fix: Export from the appropriate barrel file.

---

## 7. Testing

**[IMPORTANT]** Non-trivial logic change has no corresponding test.
Fix: Add a test covering the new behavior.

**[NIT]** Test has multiple unrelated assertions — one assertion per test keeps failures targeted.
Fix: Split into separate `it()` blocks.

**[NIT]** `it.each` not used for a group of tests with identical structure but different inputs.
Fix: Use `it.each([...])`.

See `.claude/rules/vue-tests.md` for test framework details and patterns.

---

## 8. Storybook & Documentation

**[IMPORTANT]** New or modified prop not documented in argTypes in the component's `.stories.js`.
Fix: Add the prop to `argTypes` with description and default value.

**[IMPORTANT]** New component variant has no Story.
Fix: Add a Story for the variant.

**[NIT]** Deprecated component or prop missing a deprecation badge in the Story.
Fix: Add `badges: [BADGE.DEPRECATED]` to the Story meta.

**[IMPORTANT]** Component doc page is missing a required section: overview, usage example, variants, props table, events table, slots table, or accessibility notes.
Fix: Add the missing section.

---

## 9. Internationalization & Assets

**[BLOCKING]** User-facing English string hardcoded in a component — must use FTL localization keys.
Pattern: hardcoded string literals in Vue templates (e.g., `aria-label="Close"`, button text) that are not wrapped in `$t(...)` or a localization call.
Fix: Replace with an FTL key and add the key to the relevant `.ftl` file.

**[IMPORTANT]** Image referenced from an external URL instead of stored locally.
Fix: Download and store the asset in the appropriate `packages/` directory.

---

## 10. Accessibility

**[BLOCKING]** ARIA attribute used incorrectly — wrong role, missing required attribute, invalid `aria-*` value, or `aria-modal` without proper focus management and focus-trap.
Pattern: `aria-modal` without a focus-trap, `role="dialog"` without `aria-labelledby` / `aria-describedby`, missing focus management on overlay open/close.
Fix: Correct the ARIA usage and focus management per the ARIA spec. Reference: `.claude/rules/vue-components.md`.

**[IMPORTANT]** Interactive element not keyboard-navigable — missing `tabindex`, focus management for focus-trap on modal, or `keydown` handler.
Fix: Add keyboard support. Overlays require focus-trap and focus management; custom interactive elements require `tabindex="0"` and `keydown` handling.

**[IMPORTANT]** Screen reader announcement missing for a dynamic state change — use `aria-live` for live regions.
Fix: Add `aria-live="polite"` (or `"assertive"` for urgent updates) to the container.

**[IMPORTANT]** Insufficient color contrast — does not meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text / UI components).
Fix: Use a Dialtone semantic token that meets the contrast requirement.

---

## 11. Cross-Package & Performance

**[BLOCKING]** Change in one package has undeclared impact on a consumer package (`dialpad/firespotter`, `dialpad/ios`, external npm users) without a `BREAKING CHANGE:` footer.
Fix: Add `BREAKING CHANGE:` footer or make the change backward-compatible.

**[IMPORTANT]** Non-tree-shakeable import added at a package entry point (wildcard re-export or side-effect import).
Pattern: `export \*` or `import '...'` (side-effect import) in `index.ts` / `main.ts`.
Fix: Use named exports; defer side-effect imports to usage sites.

**[IMPORTANT]** XSS risk via `v-html` with unescaped user input, or `innerHTML` assigned directly from user data.
Pattern: `v-html` combined with a prop or variable that flows from user input.
Fix: Sanitize the input or avoid `v-html` / `innerHTML` with user-controlled data.

**[IMPORTANT]** Unnecessary re-render introduced — expensive computed or watcher without memoization on a hot path.
Fix: Use `computed()` (cached) over methods for expensive derivations; use `v-memo` for list items.
