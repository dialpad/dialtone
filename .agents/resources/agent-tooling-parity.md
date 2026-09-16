# Agent Tooling Parity

Codex tooling is a first-class Dialtone agent harness alongside Claude tooling. This resource tracks how Codex stands up equivalent day-to-day workflows without treating Claude as deprecated or as the runtime source for Codex instructions.

| Existing agent/tooling surface                                      | Codex harness shape                                           | Decision                            | Rationale                                                                                                     | Validation                              |
| ------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `CLAUDE.md`                                                         | `AGENTS.md` plus focused `.agents/resources/**` files         | Peer equivalent                     | Codex needs a tiny default context and lazy-loaded resources while Claude keeps its own entrypoint.           | Contract eval checks routing/resources. |
| Claude review skill                                                 | `.agents/skills/review/SKILL.md`                              | Peer equivalent with rewrite        | Report-only review remains useful; Codex uses its own rule map and review constraints.                        | Contract eval plus rule-map check.      |
| Claude commit workflow and hooks                                    | `.agents/skills/commit/SKILL.md`                              | Peer equivalent with rewrite        | Commit safety is high-value; Jira creation is separate from commit flow.                                      | Contract eval.                          |
| Claude review-comment workflow                                      | `.agents/skills/pr-comments/SKILL.md`                         | Peer equivalent with rewrite        | Real inline comments and IDs are critical for review follow-up.                                               | Mocked comment fixture.                 |
| Claude PR fill command                                              | `.agents/skills/pr-create/SKILL.md` and `pr-template.md`      | Peer equivalent with rewrite        | PR creation should preserve ticket mode and avoid implicit Jira creation.                                     | PR template fixture.                    |
| Claude component workflow                                           | `.agents/skills/component-work/SKILL.md`                      | Peer equivalent with rewrite        | Keep artifact discipline without a giant orchestrator prompt.                                                 | Contract eval.                          |
| Claude rule files                                                   | `.agents/resources/rules/*.md` plus `rule-map.md`             | Stand up parallel Codex resources   | Codex should not require Claude files at runtime; Claude rules can still inform future Codex rule updates. Logical naming has a Codex resource because component APIs and Combinator search depend on it. | Contract eval verifies mapped files.    |
| Claude branch and PR guard hooks                                    | `project-start`, `commit`, `pr-prep`, and branch safety rules | Replace with explicit Codex skills  | Codex should surface safety decisions in the workflow instead of relying on hidden hook behavior.             | Project-start fixture.                  |
| Claude staging-to-next merge skill                                  | `.agents/skills/merge-next/SKILL.md`                          | Temporary peer equivalent           | Weekly synchronization needs the same merge-history, artifact freshness, approval, and push gates in both harnesses until `next` merges back into `staging`. | Behavior fixture plus contract eval.    |
| Claude doc sync enforcement                                         | `doc-sync-check` report/apply modes                           | Peer equivalent with rewrite        | Suggestions are useful; apply mode must be explicit.                                                          | Doc-sync fixture.                       |
| Dialtone design-system lookup tools                                 | `.codex/config.toml` plus `dialtone-lookup` skill             | Add Codex-native runtime support    | Codex should use local Dialtone MCP/CLI lookup before guessing about docs, APIs, tokens, utilities, or icons. | Contract eval plus CLI smoke.           |
| Claude PR prep coordinator                                          | `.agents/skills/pr-prep/SKILL.md`                             | Peer equivalent with simplification | PR readiness should be a direct skill, not a heavyweight agent.                                               | Contract eval.                          |
| Claude cleanup/janitor workflow                                     | Future cleanup skill or `pr-complete` note                    | Defer                               | Useful before merge, but not needed for this first core loop.                                                 | None yet.                               |
| Claude package-specific skills for tokens, icons, and utilities     | Future `token-work`, `icon-work`, `utility-work` skills       | Defer                               | Add after the core Codex loop stabilizes. First pilot should be `utility-work`.                               | Future fixture evals.                   |
| Claude shaping and breadboarding workflows                          | Future planning skills if repeated                            | Defer                               | High context cost; add only if repeated Codex use proves the need.                                            | None yet.                               |
| Claude configuration and Anthropic-practices review helper surfaces | No direct Codex peer in the first pass                        | Skip                                | The current Codex eval contracts and this resource capture the useful review criteria.                        | None.                                   |

## Rule parity obligation

When a `.claude/rules/*.md` file is added or renamed, add the matching
`.agents/resources/rules/*.md` peer in the same branch. If Codex should not get
an exact-name peer yet, record a Defer or Skip decision below and keep the eval
allowlist in `.agents/evals/run-skill-contract-evals.mjs` in sync with this
table.

| Claude rule                                   | Codex peer or status                    | Decision               | Rationale                                                                                                                                        |
| --------------------------------------------- | --------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.claude/rules/claude-config.md`              | No Codex peer                           | Skip                   | Claude runtime configuration does not apply to Codex runtime rules.                                                                              |
| `.claude/rules/css-specificity.md`            | No exact Codex peer yet                 | Defer                  | Codex CSS review currently routes through `css-utilities` and `design-tokens`; add a peer when specificity review becomes a repeated Codex need. |
| `.claude/rules/dialtone-query-core.md`        | `.agents/resources/rules/query-core.md` | Skip exact-name parity | Codex already has the shorter query-core peer, so an exact duplicate file would add routing noise.                                               |
| `.claude/rules/general-rules.md`              | `.agents/resources/rules/general.md`    | Skip exact-name parity | Codex uses a shorter general rule name in its rule map.                                                                                          |
| `.claude/rules/link-and-button-navigation.md` | No exact Codex peer yet                 | Defer                  | Fold into a future accessibility/navigation peer when Codex review needs it.                                                                     |
| `.claude/rules/slot-class-props.md`           | No exact Codex peer yet                 | Defer                  | Current Codex component guidance mentions slot-class impact; add a dedicated peer when slot-class reviews repeat.                                |

## Agent rule parity obligation

When an `.agents/resources/rules/*.md` file is added or renamed, add the
matching `.claude/rules/*.md` peer in the same branch. If Claude should not get
an exact-name peer, record a Codex-only or Skip decision below and keep the eval
allowlist in `.agents/evals/run-skill-contract-evals.mjs` in sync with this
table.

| Codex rule                                 | Claude peer or status                  | Decision               | Rationale                                                                                  |
| ------------------------------------------ | -------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `.agents/resources/rules/codex-tooling.md` | No Claude peer                         | Codex-only             | Codex runtime and skill guidance does not apply to Claude runtime rules.                   |
| `.agents/resources/rules/general.md`       | `.claude/rules/general-rules.md`       | Skip exact-name parity | Codex uses a shorter general rule name in its rule map.                                    |
| `.agents/resources/rules/query-core.md`    | `.claude/rules/dialtone-query-core.md` | Skip exact-name parity | Codex uses the shorter query-core name while Claude keeps the package-qualified rule name. |
