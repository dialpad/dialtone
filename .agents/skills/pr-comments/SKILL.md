---
name: pr-comments
description: Triage and address Dialtone GitHub PR review comments. Use when the user invokes $pr-comments, $address-review, or asks to handle review feedback.
---

# Dialtone PR Comments

## Goal

Fetch real review comments, make a grounded fix plan, implement narrowly, validate, and reply only when safe.

## Trigger

- `$pr-comments`
- `$address-review`
- "pull review comments"
- "address CodeRabbit comments"
- "handle PR feedback"

## Required Context

- PR number or current branch PR.
- GitHub inline review comments, preferably via `gh api repos/dialpad/dialtone/pulls/<PR>/comments` when comment IDs matter.
- Target files and diffs.
- `.agents/resources/rule-map.md`
- Relevant validation from `.agents/resources/validation.md`

## Constraints

- Fetch actual inline comments and IDs before planning.
- Do not rely on summary comments when inline comments are available.
- Plan before edits unless the user already approved a concrete plan.
- Keep fixes narrowly scoped to reviewer feedback.
- Do not post public replies until fixes are committed/pushed or the user explicitly asks for reply-only handling.
- If public writes fail or look risky, stop and ask before retrying.

## Workflow

1. Identify PR from input or current branch.
2. Fetch inline comments and group actionable top-level comments by file and line.
3. Classify each item as code fix, test fix, clarification, duplicate, or needs user decision.
4. Present a plan with comment IDs, paths, proposed actions, and validation.
5. Read target files before editing.
6. Implement narrowly and run focused validation.
7. Commit/push when requested.
8. Reply with concise evidence: what changed, commit SHA when available, and validation.

## Done When

- Every actionable comment is fixed, answered, deferred with reason, or awaiting a user decision.
- Validation evidence is recorded.
- Public replies are posted only after the safe-write boundary is satisfied.

## Verification

- `node .agents/evals/run-skill-contract-evals.mjs`
- Focused validation selected from `.agents/resources/validation.md`

## References

- `.agents/resources/rule-map.md`
- `.agents/resources/validation.md`
