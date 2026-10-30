---
name: doc-sync-check
description: Review maintained contributor guidance from an explicit source diff. Use before PR prep/create or when source package behavior changes.
---

# Dialtone Doc Sync Check

## Goal

Report maintained guidance that needs source review, record current semantic decisions, and ask before applying updates outside existing task authorization.

## Trigger

- `$doc-sync-check`
- Source changes in tokens, CSS, Vue, icons, CI, release, branch, or commit convention areas.
- Before `$pr-prep` or `$pr-create` when docs impact is unclear.

## Required Context

- Changed source files and diffs.
- Target docs from `.agents/resources/doc-sync.md`.
- Existing docs content before suggesting updates.

## Constraints

- Default mode is report-only.
- Apply edits only within existing explicit task authorization; otherwise ask for apply mode.
- Suggestions must be grounded in actual source diff and existing docs.
- Do not invent functionality.
- Preserve frontmatter and human-authored content.

## Workflow

1. Follow `.agents/resources/doc-sync.md`: run the command with an explicit merge-base/direct, staged or worktree boundary.
2. Read the relevant source diff and selected target sections from the reported context.
3. Record `reviewed`, `not-relevant` or `review-needed`, with resolved boundary, mapping ID, inspected locations and reason.
4. Reassess after relevant source, prose or map changes; a touched doc does not prove review.
5. Respect existing task authorization; ask before applying updates when necessary.
6. Preserve content/frontmatter and update `last_updated` for changed corpus prose.

## Done When

- Mapped and unmapped recognized paths have a current review outcome or explicit outstanding disposition.
- Suggested updates name the target docs and source evidence.
- Any applied edit was within explicit task authorization.

## Verification

- `node .agents/evals/run-skill-contract-evals.mjs`
- `pnpm nx run dialtone-docs:build` when docs are edited.

## References

- `.agents/resources/doc-sync.md`
- `.agents/resources/validation.md`
