# Dialtone Doc Sync

Use this resource from `doc-sync-check`, `pr-prep`, and component/package workflows. The default mode is report-only.

## Source To Docs Map

| Source change                 | Expected docs to inspect                                                                                                                                                                                                                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/dialtone-tokens/**` | `packages/dialtone-docs/src/content/development/development-design-tokens.md`; `packages/dialtone-docs/src/content/architecture/architecture-design-token-pipeline.md`                                                                                                                                                               |
| `packages/dialtone-css/**`    | `packages/dialtone-docs/src/content/development/development-css-utilities.md`                                                                                                                                                                                                                                                        |
| `packages/dialtone-vue/**`    | `packages/dialtone-docs/src/content/development/development-component-workflow.md`; `packages/dialtone-docs/src/content/reference/reference-component-api-patterns.md`; `packages/dialtone-docs/src/content/reference/reference-accessibility-checklist.md`; `packages/dialtone-docs/src/content/development/development-testing.md` |
| `packages/dialtone-icons/**`  | `packages/dialtone-docs/src/content/development/development-icons.md`                                                                                                                                                                                                                                                                |
| `.github/workflows/**`        | `packages/dialtone-docs/src/content/workflows/workflow-ci-pipeline.md`                                                                                                                                                                                                                                                               |
| release config                | `packages/dialtone-docs/src/content/workflows/workflow-release-process.md`                                                                                                                                                                                                                                                           |
| branch strategy               | `packages/dialtone-docs/src/content/workflows/workflow-branch-strategy.md`                                                                                                                                                                                                                                                           |
| commit convention             | `packages/dialtone-docs/src/content/workflows/workflow-conventional-commits.md`                                                                                                                                                                                                                                                      |

## Report-Only Behavior

- Map changed source files to expected docs.
- Read source diff and target docs before suggesting updates.
- Classify each mapping as `up to date`, `likely stale`, `missing`, or `not needed`.
- Suggest concrete sections to inspect or update.
- Ask whether Codex should apply updates before editing docs.

## Apply Behavior

- Apply mode is allowed only after explicit user confirmation.
- Edit docs from actual source evidence only; do not invent behavior.
- Preserve frontmatter and human-authored sections.
- Update `last_updated` when changing `packages/dialtone-docs/src/content/**`.
- Report updated, skipped, and still-questionable docs.
