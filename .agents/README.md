# Dialtone Agent Resources

Use this as the routing table for repo-local Codex skills. Keep default context small: load a skill only when its trigger matches the task, then load only the resources that skill references.

## Skills

| Skill             | Trigger                                            | Purpose                                                                                         | Key resources                                                      | Eval     |
| ----------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------- |
| `project-start`   | `$project-start`, starting a task, branch setup    | Decide ticket mode, create/propose a Dialtone-style branch, and record the immediate work path. | `package-map.md`, `agent-tooling-parity.md`                        | behavior |
| `dialtone-lookup` | Dialtone API, docs, token, utility, or icon lookup | Ground design-system decisions in Dialtone MCP or CLI lookup tools before guessing.             | `dialtone-lookup.md`                                               | contract |
| `review`          | `$review`, "review my changes", "check this code"  | Report-only local review with lazy rule loading.                                                | `rule-map.md`                                                      | contract |
| `validate`        | `$validate`, "run checks", before commit/PR        | Map changed files to focused validation commands.                                               | `validation.md`, `package-map.md`                                  | fixture  |
| `commit`          | "stage", "commit", "ready to commit"               | Stage explicit files and create Dialtone-convention commits.                                    | `pr-template.md`                                                   | contract |
| `pr-prep`         | before opening/updating a PR                       | Report-only PR readiness check.                                                                 | `package-map.md`, `validation.md`, `doc-sync.md`, `pr-template.md` | contract |
| `pr-create`       | `$pr-create`, "open a PR", "fill PR body"          | Prepare and optionally create/update a PR after readiness is clear.                             | `pr-template.md`, `package-map.md`                                 | fixture  |
| `pr-comments`     | `$pr-comments`, `$address-review`, review feedback | Fetch real inline review comments, plan fixes, validate, and reply safely.                      | `rule-map.md`                                                      | fixture  |
| `pr-complete`     | after PR merge, branch closeout                    | Verify merge state, return to `staging`, and handle `NO-JIRA` closeout safely.                  | `package-map.md`                                                   | fixture  |
| `doc-sync-check`  | source changes that may affect AI docs             | Report missing/stale `dialtone-docs` updates and offer apply mode.                              | `doc-sync.md`                                                      | fixture  |
| `component-work`  | component creation/update, component API changes   | Keep Vue component, tests, stories, docs, and downstream data in sync.                          | `package-map.md`, `rule-map.md`, `validation.md`, `doc-sync.md`    | contract |
| `component-variant` | Combinator variant authoring for component changes | Keep `packages/combinator/src/variants/**` aligned with component props, slots, values, and thumbnails. | `rules/combinator-variants.md`, `package-map.md`, `rule-map.md` | contract |

## Resources

- `resources/package-map.md`: package graph and affected-area mapping.
- `resources/dialtone-lookup.md`: Dialtone MCP and CLI lookup routing.
- `resources/validation.md`: changed-path to validation-command mapping.
- `resources/rule-map.md`: lazy loading map for Codex-owned rule resources.
- `resources/rules/*.md`: focused review rules loaded by `rule-map.md`.
- `resources/doc-sync.md`: source package to `packages/dialtone-docs/src/content` mapping.
- `resources/pr-template.md`: PR title/body and public-safety expectations.
- `resources/agent-tooling-parity.md`: peer-harness decisions for Codex alongside existing agent tooling.

## Eval Commands

- `node .agents/evals/run-skill-contract-evals.mjs`
- `node .agents/skills/project-start/evals/run-project-start-evals.mjs`

All new or materially changed skills need eval coverage scaled to risk: static contract for low-risk skills, fixture behavior for workflows that can affect branches, commits, PRs, docs, or public replies.
