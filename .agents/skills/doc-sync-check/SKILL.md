---
name: doc-sync-check
description: Check whether source changes need Dialtone AI docs updates. Use before PR prep/create or when source package behavior changes.
---

# Dialtone Doc Sync Check

## Goal

Report whether changed source files require updates to `packages/dialtone-docs/src/content/**`, suggest grounded updates, and ask before applying them.

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
- Do not edit docs unless the user explicitly confirms apply mode.
- Suggestions must be grounded in actual source diff and existing docs.
- Do not invent functionality.
- Preserve frontmatter and human-authored content.

## Workflow

1. Map changed files to docs using `doc-sync.md`.
2. Read source diff and expected docs.
3. Classify each mapping as `up to date`, `likely stale`, `missing`, or `not needed`.
4. Suggest concrete sections or updates.
5. Ask whether Codex should apply updates.
6. In apply mode, patch docs and update `last_updated` when content changes.

## Done When

- Every mapped source area has a doc-sync classification.
- Suggested updates name the target docs and source evidence.
- No docs were edited unless apply mode was explicitly confirmed.

## Verification

- `node .agents/evals/run-skill-contract-evals.mjs`
- `pnpm nx run dialtone-docs:build` when docs are edited.

## References

- `.agents/resources/doc-sync.md`
- `.agents/resources/validation.md`
