---
paths:
  - "packages/dialtone-vue/**"
  - "packages/dialtone-css/**"
  - "packages/dialtone-tokens/**"
  - "packages/dialtone-icons/**"
---

# Dialtone Code Review Rules

Dialtone-specific triggers for Agent A in the local `/review` pipeline. **Only add rules here for things CodeRabbit cannot catch** — general code quality, formatting, common Vue patterns, ARIA, testing, and breaking change detection are all covered by CodeRabbit. This file fills the gap.

As packages are audited, package-specific rules get added here under their own section.

**Rule format:** `[SEVERITY]` trigger — optional grep pattern — Fix.
**Only flag changed lines.** Pre-existing issues on unchanged lines are excluded.

---

## What NOT to Flag

- Anything ESLint, Stylelint, Prettier, or TypeScript catches — those run in CI
- Anything CodeRabbit covers: `validator` vs `validate`, event names, ARIA, breaking changes, hardcoded values, FTL strings, testing patterns, Storybook, tree-shaking, import style
- General code quality or standard patterns — CodeRabbit knows these

---

## HIGH SIGNAL Definition

Flag ONLY findings in one of these three categories:

1. **Compile / parse failures** — syntax errors, type errors, missing imports that prevent the build.
2. **Definite logic errors** — wrong results regardless of inputs. One-character bug test: would a single-character change expose this? If unsure, drop.
3. **Clear, quotable rule violations** — a rule in this file is unambiguously violated. Quote the exact rule and the exact offending line.

Evidence required: `file:line` citation, quoted rule text, or CodeGraph reference. Findings without evidence are dropped by the Validator.

---

## Vue Components (`packages/dialtone-vue/**`)

**[BLOCKING]** `$slots` accessed inside `computed()` — `$slots` is not reactive in Vue's computed cache, so the derived value will not update when slot presence changes.
Pattern: `computed\(.*\$slots` in `.vue` files.
Fix: Move `$slots` access to the template or a non-computed method.

**[IMPORTANT]** `class` prop does not accept all three binding forms: `String`, `Object`, `Array` — callers use all three.
Fix: `type: [String, Object, Array]`.

**[IMPORTANT]** New component is ≥ 70% functionally similar to an existing component in `packages/dialtone-vue/components/` — requires knowing the full 58+ component inventory.
Fix: Point to the existing component; suggest extending it.
