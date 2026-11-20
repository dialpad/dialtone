---
name: migration-work
description: Change something public (a prop, value, default, class, token, event or slot) without breaking consumers, and judge how a codemod must behave. Use when a public change might break existing usage, when deprecating something, or when reviewing a migration script.
---

# Dialtone Migration Work

## Goal

When something public changes, existing consumers keep working. If that is not possible, the break is labelled, documented and, where a script can do it safely, automated.

## Trigger

- A prop, allowed value, default, class, token, event or slot changes name, meaning or rendering.
- A deprecation, a removal or a `BREAKING CHANGE:` footer is on the table.
- A codemod or migration script is written or reviewed.

## Required Context

- `.agents/resources/validation.md`
- `.agents/resources/rules/logical-naming.md`: how deprecated slots, props and events are kept working.
- `.agents/resources/rules/vue-components.md`

## Constraints

### 1. Is it breaking?

It is breaking if consumers who changed nothing see a difference:

- an allowed value is removed;
- a prop, value, class, token or event is renamed or removed;
- a default changes;
- an existing value renders differently.

`.agents/skills/component-work/SKILL.md` says the same for removed values and changed defaults; this skill covers what to do next.

### 2. Keep old usage working (the default choice)

- The old value still renders the same and still passes the validator. Validators live in `packages/dialtone-vue/common/validators/` (for example `ordinalSizeValidator`, which accepts the deprecated t-shirt sizes) and in component constants, which mark the old entries `(deprecated)`.
- Deprecated slots, props and events follow `.agents/resources/rules/logical-naming.md`; do not invent a second pattern.
- Mark the old API: `@deprecated Use <replacement>` in the prop or slot JSDoc, as `Button.vue` and `Avatar.vue` do.
- Renamed classes and tokens keep both names, the old one marked deprecated. `packages/dialtone-css/lib/build/less/components/input.less` does this with a `// @deprecated Use .d-input--critical` comment above `.d-input--error`. No token deprecation marker was found in the repo; ask before inventing one.
- Warn at most once per message, in development only, naming the exact replacement. No shared deprecation helper exists, and most deprecated props carry only the JSDoc tag. When a runtime warning is wanted, copy the nearest patterns: the `process.env.NODE_ENV === 'production'` guard and a once-flag in `packages/dialtone-vue/components/Slider/Composables/UseSliderValue.js` (`warnGetValueTextOnce`), and a `watch` with `immediate: true` in `packages/dialtone-vue/components/Button/Button.vue` (`validatePropCombination`). Do not warn from a computed value or render path: it runs again whenever its inputs change, and in every instance (`DtText` warns from a computed value).
- Cases review has raised:
  - Removing a motion mode was flagged as breaking.
  - An old spinner was kept as an option instead of being replaced.
  - A rename wave missed old names. Before calling a rename done, grep the whole repo for every old name, including docs, stories, tests and Combinator variants.

### 3. If it must break

- The commit carries a `BREAKING CHANGE:` footer, whatever its type (`.github/COMMIT_CONVENTION.md`). `feat!:` does not work: the header pattern in `parser-preset.cjs` has no place for `!`.
- The footer must survive the merge. The repo's squash default keeps the PR title and drops the body, and the PR-title lint only reads the title, so nothing catches a lost footer. An earlier major release shipped as a minor this way. Put the footer in the PR description, and tell the merger to paste it into the squash message or merge without squashing.
- Add a migration guide page under `apps/dialtone-documentation/docs/guides/migration/<slug>/index.md` that lists every visible change. Match the existing pages, such as `chip-interactive` and `theme-to-mode`: frontmatter (`title`, `description`, `keywords`), a `## TLDR` that opens with a `> [!CRITICAL]` or `> [!WARNING]` callout, a before/after table under `## What Changed`, then `## Migration` with the command and before/after snippets.
- Register the page in two places: a row in the checklist tables of `apps/dialtone-documentation/docs/guides/migration/index.md`, and an entry in `apps/dialtone-documentation/docs/_data/site-nav.json`.

### 4. Codemod behaviour

This section is the single home for the rules. The reviewer lens is `.agents/skills/pr-prep/references/specialists/codemods.md`; use it, do not copy it.

- Change only what the target component owns.
- Keep explicit values. One codemod overwrote values the author had set on purpose.
- Insert a value only when sure. Otherwise leave the input as it is and report it.
- Skip spreads and other bindings it cannot read.
- Match markup, not text: one codemod renamed words inside quoted attribute values.
- A second run changes nothing, in output and in reports.
- One test fixture per case, including each case it must leave alone.

## Workflow

1. Decide whether the change is breaking (Constraints 1).
2. Prefer keeping old usage working (Constraints 2). Choose a break only when that is not possible, and say why.
3. For a break, write the footer, the guide page and its two registrations (Constraints 3).
4. If a script is part of the change, check it against Constraints 4 and the codemods lens.
5. Grep for every old name once more before calling the work done.

## Done When

- Old usage renders the same, with a test where the component has tests.
- The deprecation warning, if any, fires once and names the replacement.
- The guide page lists every visible change and is registered.
- The `BREAKING CHANGE:` footer is present if the change is breaking, and the merge route keeps it.
- A codemod's fixtures pass and a second run is a no-op.

## Verification

- Focused component tests, and the commands from `.agents/resources/validation.md`.
- Migration scripts: `node --test 'packages/dialtone-css/lib/build/js/**/*test.mjs'` (the `validation.md` row for `packages/dialtone-css/**`). No workflow under `.github/workflows/` runs these files, so run them locally and report the result in the PR.
- `pnpm nx run dialtone-documentation:lint` for the guide page, per `validation.md`.

## References

- `.agents/resources/validation.md`
- `.agents/resources/rules/logical-naming.md`
- `.agents/resources/rules/vue-components.md`
- `.agents/skills/pr-prep/references/specialists/codemods.md`: the reviewer lens for a codemod diff.
- `.github/COMMIT_CONVENTION.md`
- Script authoring, and registering a script with the master migration tool, is covered later in this skill.
