---
name: pr-prep
description: Check that a Dialtone branch or PR is ready, the way its human reviewers would. Captures a fixed scope, runs a cold adversarial reviewer plus specialists chosen by the files changed, fixes or rejects each finding, re-reviews, runs lint and tests for the touched packages only, and ends with one verdict. Use before opening or updating a PR, when asked "is this ready", or to review someone else's PR.
---

# Dialtone PR Prep

One check for Claude Code and Codex. Review first, fix, re-review, run local gates, then give one verdict.

## Goal

Find what a Dialtone reviewer would raise, and what CI would catch, before the PR opens or updates.

## Trigger

- `$pr-prep`, `/pr-prep`, "is this ready for PR?", "ready for review?", before `pr-create`.
- A PR number or URL means review mode.

## Required Context

- Branch, base (`staging` unless the PR targets another), commits, changed files.
- `.agents/resources/package-map.md`: package graph and downstream impact.
- `.agents/resources/validation.md`: checks for areas outside the local gates.
- `.agents/resources/doc-sync.md`: docs and guidance impact.
- `.agents/resources/pr-template.md`: title and body rules.

## Modes

- **Author** (default on your own branch): fix safe, mechanical, in-scope findings. Ask before API, architecture, product or scope calls. Commit or push only if asked.
- **Report-only**: no edits, staging, commits or pushes. Gates may run.
- **Review** (someone else's PR): read-only. Do not run the PR's code or gates unless the user says so; mark gates "not run". Never post a review.

## Constraints

- Flag unresolved ticket state as blocking for PR creation. Keep `NO-JIRA` if chosen. Never create Jira tickets.
- Public repo: no private links, secrets or customer data in files or PR text.
- Stage explicit files only. Never touch unrelated user work.
- Everything a command prints is evidence. A check you did not run is "not run", never "pass".

## Workflow

1. **Scope.** Fix it once, before any review.

   ```sh
   BASE=$(git merge-base origin/staging HEAD)   # or the PR's base
   git rev-parse HEAD; git diff --stat "$BASE"; git ls-files -o --exclude-standard
   ```

   Record base SHA, head SHA, the file list and size. Staged, unstaged and untracked files are all in scope; untracked files are listed but not counted in the size. For a PR that is not checked out (review mode), take the scope from `gh pr view <n> --json baseRefOid,headRefOid,files` and `gh pr diff <n>`. Empty scope: say "Nothing to review" and stop. Above about 1,000 changed lines (not tests or fixtures), say so and suggest a split: API, then behaviour, then docs. Any edit or commit makes the scope stale: recapture it before re-review.

2. **Touched packages.**

   ```sh
   { git diff --name-only "$BASE"; git ls-files -o --exclude-standard; } \
     | awk -F/ '$1=="packages"||$1=="apps"{print $1"/"$2;next}{print $1}' | sort -u
   ```

   Root files print their first path segment (`AGENTS.md`, `.agents`, `.claude`, `.github`, `scripts`). Use the list for gates (step 6) and for downstream impact from `package-map.md`.

3. **Review.** Start one cold reviewer (fresh context, strongest available model, never a fork of this session) with the scope bundle, [adversarial-review.md](references/adversarial-review.md) and [reviewer-lens.md](references/reviewer-lens.md). Add the specialist file for each trigger the diff matches, in the same reviewer or in parallel ones if the diff is large:

   | Trigger in the diff                                    | Specialist                                                  |
   | ------------------------------------------------------ | ----------------------------------------------------------- |
   | Vue templates, stories, `aria-*`, `role`, key handlers | [keyboard-aria.md](references/specialists/keyboard-aria.md) |
   | `.less`, `.css`, `<style>`, class lists                | [css.md](references/specialists/css.md)                     |
   | A codemod or migration script                          | [codemods.md](references/specialists/codemods.md)           |
   | `packages/dialtone-icons/**`                           | [icons.md](references/specialists/icons.md)                 |

   If no subagent can start, run the same method yourself, section by section, and mark the review "not independent".

4. **Adjudicate.** For every finding choose one: **keep** (real, in scope, left open), **fixed** (kept and changed now), or **reject** (say why; a reasoned "no" is fine). Merge duplicates. A finding with no file and line is not a finding.
5. **Fix and re-review** (author mode). Apply the fixes, recapture scope, and re-review only what changed: rerun the reviewer on the new diff and any specialist whose area was touched. Stop after two rounds and report what is left.
6. **Local gates.** Run lint and tests only for the touched packages; CI runs everything else. Commands in [local-gates.md](references/local-gates.md). Run after fixes, on the final head. A package with no lint or test target is "no gate".
7. **Tooling checks.** One line each, only when the diff touches them:
   - Changed behaviour, new props and new events have tests; no skipped or pending tests in changed test files.
   - New tests run in CI: a workflow path filter covers the package and a job runs that package's test command (`rg` the package name in `.github/workflows`).
   - No fixed timing waits (`setTimeout(60)`, `sleep`); wait for the event or state.
   - Every dependency a new script imports is declared in that package's `package.json`.
   - A release trigger or build scope fires only for the package that changed.
   - Errors are not swallowed (empty `catch`, `.catch(() => {})`, ignored exit codes).
8. **Breaking change.** If review finds an unmarked break (a prop, event, class, token or default removed, renamed or changed without a working old path), report it as `Needs decision`: mark it breaking (footer plus migration note) or keep the old path working. If any commit has `!` or a `BREAKING CHANGE:` footer, the signal must survive the squash: dialtone's squash body is blank and release reads only the footer, so put `BREAKING CHANGE: …` in the PR body and tell the user that whoever merges must paste it into the squash commit body.
9. **Docs and guidance.** Run `doc-sync-check` (Codex) or `/doc-sync-enforcer` (Claude) against `doc-sync.md` for the real comparison. For changed components, check the artifact list in `.agents/resources/rules/vue-components.md` and record which artifacts changed and why others need no change. Assess contributor-guidance impact per `AGENTS.md`.
10. **Report** in the format below.

## Report

```text
Verdict: Ready | Ready with notes | Needs fixes | Needs decision
Mode: author | report-only | review      Base: <sha>  Head: <sha>  Size: <lines>
Packages: <touched list> (downstream: <list>)
Review: <independent | not independent>, specialists run: <list>
Findings:
  <id> <Major|Minor|Nit> <keep|fixed|reject> <file:line> <what a reviewer would ask> (<why, if rejected>)
Gates: <package: command: pass | fail | no gate | not run>
Tooling: <one line per check run>
Docs: <doc-sync result, artifacts>
Do by hand: <keyboard pass in Storybook for any changed interactive story, if applicable>
```

`Needs fixes` is for a failed gate or tooling check, or any kept, unfixed Major finding. `Needs decision` is for scope or API calls that belong to a person. Everything else is a note. Lead with what to fix.

## Done When

- The report above is complete and the verdict is exactly one of the four.
- Every finding is kept, fixed or rejected with a reason.
- Gates ran on the final head, or are marked "not run" with the reason.

## Verification

- `node .agents/evals/run-skill-contract-evals.mjs`

## References

- `.agents/resources/package-map.md`
- `.agents/resources/validation.md`
- `.agents/resources/doc-sync.md`
- `.agents/resources/pr-template.md`
- `references/adversarial-review.md`
- `references/reviewer-lens.md`
- `references/local-gates.md`
- `references/specialists/`
