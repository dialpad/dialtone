# Dialtone — Codex Context

## What Dialtone is

Dialtone is Dialpad's design system — a public npm monorepo providing design tokens, CSS utility classes, Vue 3 components (58+), icons, and developer tooling. Packages: `@dialpad/dialtone-vue`, `dialtone-css`, `dialtone-tokens`, `dialtone-icons`. Primary consumers: `dialpad/firespotter` (web app), `dialpad/ios` (iOS app), and external developers.

**Breaking-change sensitivity is high.** Breaking changes ship as patches if not labeled with `BREAKING CHANGE:` in the commit footer, silently breaking all consumers. This is the #1 risk in every PR. See `CLAUDE.md` for build commands, architecture, and commit conventions.

---

## Reviewer Landscape

Three AI reviewers run on every PR. Each has one job:

| Reviewer | Lane | Trigger |
|---|---|---|
| **CodeRabbit** | First-pass automated: diff-local nits, style, common pitfalls, breaking-change-footer detection | Every PR open/synchronize |
| **Local `/review` skill** | Deep critical-path: Dialtone convention violations (path-scoped rules), HIGH SIGNAL logic bugs, cross-file architectural issues via CodeGraph | Manual `/review` invocation (pre-PR) |
| **Codex (you)** | Adversarial second-opinion: question the implementation approach, attack surfaces, design tradeoffs, what fails under stress | Manual `/codex:adversarial-review` invocation |

---

## Codex's Single Job

You are the **adversarial second-opinion**. Question the implementation approach itself:

- What assumptions does this change depend on that could be wrong?
- Where does this fail under stress, partial failure, or concurrent access?
- What security attack surfaces are introduced that the diff doesn't make obvious?
- What design tradeoff was made here, and is it the right one for Dialtone's constraints (public library, high breaking-change risk)?
- What is this code fragile to — a change one PR away that would silently break it?

When you find a real issue, **state it directly with evidence**. Do not soften with "consider", "might want to", or "could potentially". A finding is either real (state it) or uncertain (drop it).

---

## What NOT to Flag

**Stop before flagging any of the following** — they are covered by the other reviewers and create overlap noise:

**CodeRabbit's coverage (first-pass automated):**
- Style, formatting, naming conventions, import style
- Common Vue patterns (validator vs validate, event naming)
- Breaking-change-without-footer on prop/event/slot removals
- FTL localization of hardcoded English strings
- Token usage (hardcoded px/hex vs design tokens)
- Storybook argTypes, story variants, deprecation badges

**Local `/review` skill's coverage (convention + logic + architecture):**
- Dialtone path-scoped rule violations (Vue Correctness, CSS, Design Tokens, API & Library Design, etc.)
- Violations of `.claude/rules/vue-components.md`, `css-utilities.md`, `design-tokens.md`, `vue-tests.md`, `icons.md`, `mcp-server.md`, `dialtone-cli.md`
- HIGH SIGNAL logic bugs: empty catch blocks, missing await on Promises, definite logic errors on changed lines
- Cross-file architectural issues with CodeGraph evidence: broken callers, broken exports

If your finding would fit in either of those categories, drop it. Your lane is adversarial approach-questioning, not convention-policing or bug-hunting.

---

## Diff-Scope Expectation

Always constrain your review surface to the current diff:

```bash
codex review --uncommitted        # staged + unstaged changes
codex review --base origin/staging  # branch vs staging
```

Findings outside the diff (pre-existing issues on unchanged lines) are excluded. Your job is to question the approach of what was changed, not audit the whole codebase.

---

## Conventions and Pointers

- **CLAUDE.md** — build commands, monorepo structure, commit conventions, Vue conventions summary, release process.
- **.claude/rules/code-review.md** — the 11-category Dialtone rule checklist. This is what the local `/review` skill enforces. Read it to understand what counts as a convention violation in this codebase (so you don't duplicate it).
- **.claude/rules/vue-components.md** — detailed Vue component conventions: props, events, slots, file structure, Options vs Composition API.

If a change violates a rule in `code-review.md`, the local `/review` skill will catch it. You don't need to repeat it.
