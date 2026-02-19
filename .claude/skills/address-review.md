---
description: "Address PR review comments end-to-end. Use '/address-review' for the current branch's PR, or '/address-review <PR_NUMBER>' for a specific PR. Fetches reviewer comments, makes code fixes, posts replies, and optionally commits."
---

# /address-review - PR Review Comment Workflow

## Usage

```text
/address-review [PR_NUMBER]
```

## Description

Fetches all pending review comments on a PR, categorizes them by file, applies code fixes, replies to each reviewer, and optionally commits and pushes. Designed for addressing a batch of review feedback in one pass.

## Workflow

### 1. Identify the PR

- If PR number provided: use it directly
- If no argument: detect from current branch via `gh pr view --json number`

### 2. Fetch Review Comments

```bash
gh api repos/dialpad/dialtone/pulls/{PR_NUMBER}/comments
```

Filter to actionable comments (skip resolved threads, "LGTM" comments, and your own replies):

```bash
gh api repos/dialpad/dialtone/pulls/{PR_NUMBER}/comments --jq '[.[] | select(.in_reply_to_id == null)] | group_by(.path) | .[] | {file: .[0].path, comments: [.[] | {id: .id, author: .user.login, body: .body, line: .line}]}'
```

### 3. Categorize and Plan

Group comments by file. For each comment, classify as:

- **Code fix needed** — Reviewer identified an inaccuracy, bug, or missing content
- **Clarification only** — Reviewer asked a question; no code change needed
- **Discussion** — Reviewer raised a design question needing user input

Present the plan to the user before making changes:

```text
## PR #N Review Comments (X total)

### Code fixes (Y comments)
1. file.md — [reviewer]: description of fix needed

### Clarifications (Z comments)
1. file.md — [reviewer]: question to answer

### Needs discussion (W comments)
1. file.md — [reviewer]: topic requiring decision
```

### 4. Apply Code Fixes

For each code fix:
- Read the target file
- Apply the edit
- Track the change for the commit message

Make all independent edits in parallel where possible.

### 5. Reply to Reviewers

For each comment:
- **Code fixes**: Reply confirming the fix was applied (e.g., "Fixed in this push — [brief description of change]")
- **Clarifications**: Reply with the answer
- **Discussion items**: Flag to user for their input before replying

Use threaded replies:

```bash
gh api repos/dialpad/dialtone/pulls/{PR_NUMBER}/comments/{COMMENT_ID}/replies -f body="..."
```

### 6. Commit and Push (with confirmation)

Ask the user if they want to commit and push. If yes:
- Stage only the modified files (never `git add -A`)
- Use commit message format: `chore: NO-JIRA address PR #N review comments`
- Follow all commit rules from `/commit` skill (no Co-Authored-By, no --no-verify)
- Push to remote

## Important Rules

- **Never reply before reading the file** — always understand context before responding
- **Group related comments** — if multiple reviewers flagged the same issue, fix once and reply to all
- **Don't over-fix** — only change what reviewers asked for, don't refactor surrounding code
- **Preserve reviewer tone** — match formality level in replies (casual reviewer gets casual reply)
- **Flag uncertainty** — if a comment is ambiguous, ask the user rather than guessing
