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

1. **Scope.** Fix it once, before any review. Each shell call starts fresh, so write down the base SHA and reuse it as `BASE` in later snippets.

   ```sh
   B=staging   # or the PR's base branch
   git fetch origin "$B"
   BASE=$(git merge-base "origin/$B" HEAD); echo "$BASE"
   git rev-parse HEAD; git diff --stat "$BASE"; git ls-files -o --exclude-standard
   ```

   - Record base SHA, head SHA, file list and size. Staged, unstaged and untracked files are all in scope. `git diff` leaves untracked files out, so add each one's full contents to the diff the reviewer gets (`git diff --no-index /dev/null <file>`); they do not count toward the size.
   - Propose the PR title per `.github/COMMIT_CONVENTION.md` and check it with `echo "<title>" | pnpm exec commitlint`.
   - Review mode (PR not checked out): take base, head and file list from `gh pr view <n> --json baseRefOid,headRefOid,files` and the diff from `gh pr diff <n>`, then run the same `gh pr view` again and restart the capture if either SHA changed; use that file list for step 2. The local checkout may hold other versions of unchanged files, so the reviewer reads surrounding code at the PR head: `git fetch https://github.com/dialpad/dialtone.git pull/<n>/head` (not `origin`, which may be a fork), then `git show <headRefOid>:<path>`. Neither changes the working tree.
   - Empty scope: say "Nothing to review" and stop.
   - Above about 1,000 changed lines (not tests or fixtures), say so and suggest a split: API, then behaviour, then docs.
   - Any edit or commit makes the scope stale: recapture it before re-review.

2. **Touched packages.**

   ```sh
   : "${BASE:?set BASE to the recorded base SHA}"
   { git diff --name-only --no-renames "$BASE"; git ls-files -o --exclude-standard; } \
     | awk -F/ '$1=="packages"||$1=="apps"{print $1"/"$2;next}{print $1}' | sort -u
   ```

   `--no-renames` lists both sides of a move, so a package that loses files still gets its gates. Root files print their first path segment (`AGENTS.md`, `.agents`, `.claude`, `.github`, `scripts`). Use the list for gates (step 6) and for downstream impact from `package-map.md`.

3. **Review.** Start one cold reviewer (fresh context, strongest available model, never a fork of this session) with the scope bundle (base SHA, head SHA, file list and diff), [adversarial-review.md](references/adversarial-review.md) and [reviewer-lens.md](references/reviewer-lens.md). Add the specialist file for each trigger the diff matches, in the same reviewer or in parallel ones if the diff is large:

   | Trigger in the diff                                                                                             | Specialist                                                  |
   | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
   | Interactive elements, `role`, `aria-*`, `tabindex`, key or focus handlers, or stories of interactive components | [keyboard-aria.md](references/specialists/keyboard-aria.md) |
   | `.less`, `.css` or `<style>` changes                                                                            | [css.md](references/specialists/css.md)                     |
   | A codemod or migration script                                                                                   | [codemods.md](references/specialists/codemods.md)           |
   | `packages/dialtone-icons/**`                                                                                    | [icons.md](references/specialists/icons.md)                 |

   If no subagent can start, run the same method yourself, section by section, and mark the review "not independent".

4. **Adjudicate.** For every finding choose one: **keep** (real, in scope, left open), **fixed** (kept and changed now), or **reject** (say why; a reasoned "no" is fine). Merge duplicates. A finding names a file and line; for missing work, name the line that creates the need (the new prop) or the file that should change.
5. **Fix and re-review** (author mode). Apply the fixes, recapture scope, and re-review only what changed: rerun the reviewer on the new diff and any specialist whose area was touched. Stop after two rounds and report what is left. Author-mode `Ready` needs a clean working tree; otherwise list the uncommitted files as "not in the PR yet".
6. **Local gates.** Run lint and tests for the touched packages only; CI runs most tests and almost no lint, so do not skip lint. Commands in [local-gates.md](references/local-gates.md). Run after fixes, on the final head. A package with no lint or test target is "no gate".
7. **Tooling checks.** One line each, only when the diff touches them:
   - Changed behaviour, new props and new events have tests; no skipped or pending tests in changed test files.
   - New tests run in CI: a workflow path filter covers the package and a job runs that package's test command (`rg` the package name in `.github/workflows`).
   - No fixed timing waits (`setTimeout(60)`, `sleep`) and no hard-coded package versions in fixtures; wait for the event or state.
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
Title: <proposed> (commitlint: pass | fail)
Packages: <touched list> (downstream: <list>)
Review: <independent | not independent>, specialists run: <list>
Findings:
  <id> <Major|Minor|Nit> <keep|fixed|reject> <file:line> <what a reviewer would ask> (<why, if rejected>)
Gates: <package: command: pass | fail | no gate | not run>   (list any "not run" first)
Tooling: <one line per check run>
Docs: <doc-sync result, artifacts>
Do by hand: <keyboard pass in Storybook for any changed interactive story, if applicable>
```

Precedence: `Needs decision` > `Needs fixes` > `Ready with notes` > `Ready`.

- `Needs decision`: a scope or API call that belongs to a person, including an unmarked break or unresolved ticket state.
- `Needs fixes`: a failed gate or tooling check, a commitlint failure on the title, a doc-sync item still needing review, or any kept, unfixed Major finding.
- `Ready with notes`: any kept Minor or Nit, any gate "not run", a review that was not independent, or uncommitted files.
- `Ready`: every touched package's gates passed or are "no gate", and nothing is kept.

Lead with what to fix.

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
