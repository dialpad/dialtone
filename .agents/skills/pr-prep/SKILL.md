---
name: pr-prep
description: Check that a Dialtone branch or PR is ready, the way its human reviewers would. Captures a fixed scope, runs a cold adversarial reviewer plus specialists chosen by the files changed, runs the safe lint and tests for the touched packages, and ends with one verdict. Report-only by default; fixes findings only when asked. Use before opening or updating a PR, when asked "is this ready", or to review someone else's PR.
---

# Dialtone PR Prep

One check for Claude Code and Codex. Review, run local gates, then give one verdict. Fixing and re-review happen only when the user asks.

## Goal

Find what a Dialtone reviewer would raise, and what CI would catch, before the PR opens or updates.

## Trigger

- `$pr-prep`, `/pr-prep`, "is this ready for PR?", "ready for review?", before `pr-create`.
- A PR number or URL means review mode.

## Required Context

- Branch, base (`staging` unless the PR targets another), commits, changed files.
- `.agents/resources/package-map.md`: package graph and downstream impact.
- `.agents/resources/validation.md`: the one map of checks per path, and which of them write files.
- `.agents/resources/rules/general.md` and the path rules `.agents/resources/rule-map.md` selects for the changed paths.
- `.agents/resources/doc-sync.md`: docs and guidance impact.
- `.agents/resources/pr-template.md`: title and body rules.

## Modes

- **Report-only** (default for readiness checks): report findings and validation status. Run only checks verified to leave the contributor's files unchanged.
- **Author** (when the user asks to fix findings): fix safe, mechanical issues within the agreed scope. Ask before API, architecture, product or scope decisions. Commit or push only if asked.
- **Review** (someone else's PR): read-only. Do not run the PR's code or gates unless the user says so; mark gates "not run". Never post a review.

## Constraints

- Flag unresolved ticket state as blocking for PR creation. Keep `NO-JIRA` if chosen. Never create Jira tickets.
- Public repo: no private links, secrets or customer data in files or PR text.
- Stage explicit files only. Never touch unrelated user work.
- Everything a command prints is evidence. A check you did not run is "not run", never "pass".

## Workflow

1. **Scope.** Fix it once, before any review. Each shell call starts fresh, so write down the base branch, base SHA and head SHA and reuse them as `B`, `BASE` and `HEAD_SHA` in later snippets.

   ```sh
   export pnpm_config_verify_deps_before_run=false   # pnpm 11 otherwise installs first and can rewrite pnpm-lock.yaml; repeat in every shell call
   B=staging   # or the PR's base branch
   git fetch origin "$B"
   BASE=$(git merge-base "origin/$B" HEAD); echo "$BASE"
   HEAD_SHA=$(git rev-parse HEAD); echo "$HEAD_SHA"; git diff --stat "$BASE"; git ls-files -o --exclude-standard
   ```

   - Record base SHA, head SHA, size and the file list (`FILES`, one path per line, reused like `BASE`). Staged and unstaged changes are in scope. `git ls-files -o` only lists candidates: in a dirty checkout it can pick up unrelated work or scratch notes, so add only the untracked files that belong to this change, ask when unsure, and name the rest as excluded in the report. `git diff` leaves untracked files out, so add each in-scope one's full contents to the diff the reviewer gets (`git diff --no-index /dev/null <file>`); they do not count toward the size. Use this same scoped list for the review, package selection and any follow-on fixes.
   - Propose the PR title per `.github/COMMIT_CONVENTION.md`. Put it in a variable, never inside a double-quoted command: `TITLE='<title>'` (write any `'` as `'\''`), or `TITLE=$(gh pr view <n> --json title --jq .title)` for an existing PR. If `TITLE` is empty (for example `gh pr view` failed), mark the title check "not run". Otherwise check it with `printf '%s' "$TITLE" | pnpm exec commitlint`, with `pnpm_config_verify_deps_before_run=false` exported as in the block above.
   - Review mode (PR not checked out):
     - Take base, head and title from `gh pr view <n> --json baseRefOid,headRefOid,title`, the file list from `gh api --paginate repos/dialpad/dialtone/pulls/<n>/files --jq '.[] | .filename, (.previous_filename // empty)'` (`--json files` stops at 100 files; this keeps both sides of a rename, as step 2 does) and the diff from `gh pr diff <n>`. Run the same `gh pr view` again and restart the capture if either SHA changed. Use that file list for step 2.
     - Check the PR's existing title with commitlint (`TITLE` from `gh pr view`, as above) and report its result; give any proposed title separately.
     - The local checkout may hold other versions of unchanged files, so the reviewer reads surrounding code at the PR head: `git fetch https://github.com/dialpad/dialtone.git pull/<n>/head` (not `origin`, which may be a fork), then `git show <headRefOid>:<path>`. Neither changes the working tree.
   - Empty scope: say "Nothing to review" and stop.
   - Above about 1,000 changed lines (not tests or fixtures), say so and suggest a split: API, then behaviour, then docs.
   - Any edit or commit makes the scope stale: recapture it before re-review.

2. **Touched packages.**

   ```sh
   : "${FILES:?set FILES to the scoped file list from step 1}"
   printf '%s\n' "$FILES" | awk -F/ 'NF{if($1=="packages"||$1=="apps")print $1"/"$2;else print $1}' | sort -u
   ```

   Build `FILES` from `git diff --name-only --no-renames "$BASE"` (it lists both sides of a move, so a package that loses files still gets its gates) plus the in-scope untracked files from step 1. Root files print their first path segment (`AGENTS.md`, `.agents`, `.claude`, `.github`, `scripts`). Use the list for gates (step 6) and for downstream impact from `package-map.md`.

3. **Review.** Start one cold reviewer (fresh context, strongest available model, never a fork of this session) with the scope bundle (base SHA, head SHA, file list and diff), [adversarial-review.md](references/adversarial-review.md), [reviewer-lens.md](references/reviewer-lens.md), `.agents/resources/rules/general.md` and the path rules `rule-map.md` selects for the changed paths. The lens adds judgment; the path rules still own things like the component artifact pipeline and internal authoring conventions. Add the specialist file for each trigger the diff matches, in the same reviewer or in parallel ones if the diff is large:

   | Trigger in the diff                                                                                             | Specialist                                                  |
   | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
   | Interactive elements, `role`, `aria-*`, `tabindex`, key or focus handlers, or stories of interactive components | [keyboard-aria.md](references/specialists/keyboard-aria.md) |
   | Changes to styles, or to markup those styles depend on                                                          | [css.md](references/specialists/css.md)                     |
   | A codemod or migration script                                                                                   | [codemods.md](references/specialists/codemods.md)           |
   | `packages/dialtone-icons/**`                                                                                    | [icons.md](references/specialists/icons.md)                 |

   If no subagent can start, run the same method yourself, section by section, and mark the review "not independent".

4. **Adjudicate.** For every finding choose one: **keep** (real, in scope, left open), **fixed** (kept and changed now), or **reject** (say why; a reasoned "no" is fine). Merge duplicates. A finding names a file and line; for missing work, name the line that creates the need (the new prop) or the file that should change.
5. **Fix and re-review** (author mode only; report-only edits nothing). Apply the fixes, recapture scope, and re-review only what changed: rerun the reviewer on the new diff and any specialist whose area was touched. Stop after two rounds and report what is left. Author-mode `Ready` needs a clean working tree; otherwise list the uncommitted files as "not in the PR yet".
6. **Local gates.** Run lint and tests for the touched packages only; CI runs most tests and almost no lint, so do not skip lint. Pick checks from `.agents/resources/validation.md`; [local-gates.md](references/local-gates.md) says how to read the results. In report-only, run only checks the map marks `no` or `output` and report each other as "not run" with the reason. Run on the final head. A package with no lint or test target is "no gate". Compare `git status --porcelain` before and after the checks; if it changed, report what changed and record `tree=dirty`.
7. **Tooling checks.** One line each, only when the diff touches them:
   - Changed behaviour, new props and new events have tests; no skipped or pending tests in changed test files.
   - New tests run in CI: a workflow path filter covers the package and a job runs that package's test command (`rg` the package name in `.github/workflows`).
   - No fixed timing waits (`setTimeout(60)`, `sleep`) and no hard-coded package versions in fixtures; wait for the event or state.
   - Every dependency a new script imports is declared in that package's `package.json`.
   - Release and build scopes cover the owning package and any downstream packages affected under the maintained dependency and release rules.
   - Errors are not swallowed (empty `catch`, `.catch(() => {})`, ignored exit codes).
8. **Breaking change.** If review finds an unmarked break (a prop, event, class, token or default removed, renamed or changed without a working old path), report it as `Needs decision`: mark it breaking (footer plus migration note) or keep the old path working. If any commit has `!` or a `BREAKING CHANGE:` footer, the signal must survive the squash: dialtone's squash body is blank and release reads only the footer, so put `BREAKING CHANGE: …` in the PR body and tell the user that whoever merges must paste it into the squash commit body.
9. **Docs and guidance.** Run `doc-sync-check` (Codex) or `/doc-sync-enforcer` (Claude) against `doc-sync.md` for the real comparison. For changed components, check the artifact list in `.agents/resources/rules/vue-components.md` and record which artifacts changed and why others need no change. Assess contributor-guidance impact per `AGENTS.md`.
10. **Report** in the format below, then record the verdict.

## Report

```text
Verdict: Ready | Ready with notes | Needs fixes | Needs decision
Mode: report-only | author | review      Base: <sha>  Head: <sha>  Size: <lines>
Excluded: <untracked files left out of scope, or none>
Title: <proposed> (commitlint: pass | fail)
Packages: <touched list> (downstream: <list>)
Review: <independent | not independent>, <complete | missing: what>, specialists run: <list>
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
- `Ready with notes`: any kept Minor or Nit, any gate "not run", a review that was not independent, a review that reported missing input (name what it could not see on the Review line), or uncommitted files.
- `Ready`: every touched package's gates passed or are "no gate", the review saw everything it needed, and nothing is kept.

Lead with what to fix.

## Verdict record

So a later push makes a stale verdict visible, record the verdict against the commit it checked. In report-only and author modes, write it beside the repo's git data, outside the working tree (review mode writes nothing, since the checkout is not the PR). `tree=dirty` means a file in the scoped list was uncommitted, so the SHA does not cover it.

```sh
B=<base branch from step 1>; HEAD_SHA=<head SHA from step 1>
[ "$(git rev-parse HEAD)" = "$HEAD_SHA" ] || { echo "HEAD moved since step 1: recapture scope and rerun the checks"; exit 1; }
R=$(git rev-parse --git-path pr-prep-verdict)
printf 'verdict=%s\nhead=%s\nbase=%s\ntree=%s\n' "<verdict>" "$HEAD_SHA" "$B" "<clean|dirty>" > "$R"
```

`head` is the commit step 1 captured and the checks gated, not whatever `HEAD` is when the record is written.

`base` is the base branch name from step 1, not its SHA: the branch tip moves with every merge, but a PR retargeted to another branch needs a new review.

This is the one gate `pr-create` and `/pr-fill` run before their first PR write. Prep is fresh only when the record exists, `tree=clean`, `head` equals the commit the PR shows, and `base` equals the branch the PR targets. Get both from GitHub, not from local refs that may be out of date:

- `pr-create`: run `git fetch origin <branch>` first. `head` must equal `HEAD` and `@{u}`; `base` must equal the base you will open the PR against. If a PR already exists for the branch, use its `headRefOid` and `baseRefName` instead.
- `/pr-fill`: `gh pr view <n> --json headRefOid,baseRefName`.

```sh
R=$(git rev-parse --git-path pr-prep-verdict)
TARGET=$(git rev-parse HEAD)                   # or the PR's headRefOid
TBASE=staging                                  # or the PR's baseRefName
UPSTREAM=$(git rev-parse '@{u}' 2>/dev/null)   # pr-create; /pr-fill sets UPSTREAM=$TARGET and relies on headRefOid
if [ "$UPSTREAM" != "$TARGET" ]; then
  echo "not pushed: push the branch, then rerun this gate"
elif [ "$(sed -n 's/^head=//p' "$R" 2>/dev/null)" = "$TARGET" ] \
  && [ "$(sed -n 's/^base=//p' "$R")" = "$TBASE" ] && grep -qx 'tree=clean' "$R"; then
  sed -n 's/^verdict=//p' "$R"
else
  echo "stale: rerun pr-prep"
fi
```

When prep is stale, check out the PR head on a clean tree and run pr-prep there without a PR number. Review mode (`pr-prep <n>`) writes no record, so it cannot refresh the verdict. For `Needs fixes` or `Needs decision`, report it and ask before writing.

## Done When

- The report above is complete and the verdict is exactly one of the four.
- Every finding is kept, fixed or rejected with a reason.
- Gates ran on the final head, or are marked "not run" with the reason.
- The verdict is recorded (report-only and author modes).

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
