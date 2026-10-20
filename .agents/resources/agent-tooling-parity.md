# Agent Tooling Parity

Codex tooling is a first-class Dialtone agent harness alongside Claude tooling. Shared contributor policy lives in neutral resources; client entrypoints retain their own loading and workflows. Neither client requires the other client's runtime configuration.

## Client Loading Baseline

Checked October 20, 2026, against the repository configuration, Codex CLI 0.163.0,
Claude Code 2.1.304 and their official documentation. This is a source and loading
contract check, not a model-behavior evaluation or a claim about every client.

| Client/surface                 | Repository entrypoint                                       | Loading and limits                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Codex instructions             | Root `AGENTS.md`; `.agents/README.md` routes task resources | Codex loads the instruction chain from the repository root to its working directory. The README and routed resources are read when instructed; they are not automatically injected just because they exist.                                                                                                                                                           |
| Codex skills                   | `.agents/skills/<name>/SKILL.md`                            | Native skill metadata is discovered along the repository path; the body loads when the skill is selected. Selection depends on the task and model.                                                                                                                                                                                                                    |
| Claude Code instructions/rules | Root `CLAUDE.md`; `.claude/rules/*.md`                      | Claude loads `CLAUDE.md`, whose `@AGENTS.md` import includes the shared baseline. Rules without `paths` load at launch; scoped rules load for matching files. Component-local `CLAUDE.md` imports the shared Vue resource on matching subtree work; scoped adapters retain their names. Ordinary links are not imports. Local or managed settings can affect loading. |
| Claude Code skills/commands    | `.claude/skills/<name>/SKILL.md`; `.claude/commands/*.md`   | Directory skills and legacy command files have native client support. Existing `.claude/skills/<name>.md` files are reference workflows: read them explicitly when a task points to them; do not assume native skill discovery.                                                                                                                                       |
| Cursor/Windsurf                | No repository-managed adapter in this baseline              | No loading or behavior claim. Add an adapter only for a named contributor need, after checking that client's current mechanism. Installation alone does not establish that need.                                                                                                                                                                                      |

The default Codex instruction budget is 32 KiB for the combined chain; global
instructions and overrides also matter. Neither client treats instruction prose
as an access-control mechanism. Keep approvals, trust and tool permissions in
their owning configuration. A correct path or passing contract check does not
prove that a particular session used or followed the guidance.

Sources: [Codex instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md),
[Codex skills](https://learn.chatgpt.com/docs/build-skills),
[Claude memory/rules](https://code.claude.com/docs/en/memory) and
[Claude skills](https://code.claude.com/docs/en/skills).

## Contributor Coverage

These seven areas reuse the maintained sources below; they are not a second copy
of package commands or component APIs.

| Requirement                                 | Owning source                                                                                                                                                    |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Package layout and downstream relationships | [Package map](package-map.md); root `CLAUDE.md` monorepo overview                                                                                                |
| Build, test and lint selection              | [Validation map](validation.md); root `CLAUDE.md` build table and package `project.json` targets                                                                 |
| Commit convention and ticket choice         | [Commit convention](../../.github/COMMIT_CONVENTION.md); native [Codex commit workflow](../skills/commit/SKILL.md) and Claude commit reference                   |
| Vue conventions                             | [Shared Vue conventions and artifact pipeline](rules/vue-components.md); Codex rule map and Claude path-scoped adapters; actual source/constants and lookup data |
| pnpm and lockfile policy                    | Root `AGENTS.md` (imported by `CLAUDE.md`); repository `package.json` package-manager declaration                                                                |
| Branch, staging and user-work safeguards    | Root `AGENTS.md` (imported by `CLAUDE.md`); the owning project-start/commit workflows                                                                            |
| Key references and task routing             | [Codex routing table](../README.md); root `CLAUDE.md` key-file references and path-scoped rules                                                                  |

## Shared Policy and Client Adapters

| Topic                                                             | Maintained policy                              | How each client reaches it                                                                                                                                            |
| ----------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch, Git, tickets, pnpm, public safety and instruction impacts | Root [AGENTS.md](../../AGENTS.md)              | Codex's native instruction chain; Claude's documented `@AGENTS.md` import in root `CLAUDE.md`.                                                                        |
| Vue API, slot classes, sizes and component artifacts              | [Shared Vue resource](rules/vue-components.md) | Codex's rule map and component-work resources; Claude's component-local `CLAUDE.md` imports it when working in that subtree. Scoped rule adapters retain their names. |
| Client workflows, settings, permissions and skill discovery       | Existing native client files                   | Kept separate. Shared `.agents/resources` content is reference policy, not Codex runtime configuration.                                                               |

Only these topics are consolidated here. Other rules, package/build summaries
and native/legacy skill workflows retain their existing ownership. Detailed
navigation and CSS-specificity coverage remains deferred in the table below.
Root and nested CLAUDE imports are documented client behavior. Codex task-resource
reads still depend on the assistant following instructions. Structural checks establish the
routes, not observed model compliance. No symlinks or generated copies are used.

## Instruction Maintenance

At planning and PR readiness, check whether the change affects contributor
commands, authoring, validation, generation, lookup, release or workflow advice.
Update the owning rules/resources and required peers in the same PR. Record
**updated**, **no change needed** with a reason, or **deferred** with an issue,
owner and delivery gate. Reassess after material review or integration changes.
Do not defer ordinary feature-owned updates to a permanent maintenance ticket.

Maintain shared policy in its owning resource and keep client-specific workflows
in their existing trees. Update each required entrypoint when changing a route;
a shared resource does not require a second copy of its policy. Other paired
rules remain independent unless their scope explicitly selects consolidation. This obligation does not require edits to every instruction file,
new hooks, a scheduled audit or copied API inventories. Consumer setup guidance
is a separate surface and needs its own impact assessment.

## Workflow Parity

| Existing agent/tooling surface                                      | Codex harness shape                                           | Decision                                | Rationale                                                                                                                                                                        | Validation                              |
| ------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `CLAUDE.md`                                                         | `AGENTS.md` plus focused `.agents/resources/**` files         | Peer equivalent                         | Both clients share the short AGENTS baseline; Claude imports it and retains native workflow context. Codex keeps lazy task routing.                                              | Contract eval checks routing/resources. |
| Claude review skill                                                 | `.agents/skills/review/SKILL.md`                              | Peer equivalent with rewrite            | Report-only review remains useful; Codex uses its own rule map and review constraints.                                                                                           | Contract eval plus rule-map check.      |
| Claude commit workflow and hooks                                    | `.agents/skills/commit/SKILL.md`                              | Peer equivalent with rewrite            | Commit safety is high-value; Jira creation is separate from commit flow.                                                                                                         | Contract eval.                          |
| Claude review-comment workflow                                      | `.agents/skills/pr-comments/SKILL.md`                         | Peer equivalent with rewrite            | Real inline comments and IDs are critical for review follow-up.                                                                                                                  | Mocked comment fixture.                 |
| Claude PR fill command                                              | `.agents/skills/pr-create/SKILL.md` and `pr-template.md`      | Peer equivalent with rewrite            | PR creation should preserve ticket mode and avoid implicit Jira creation.                                                                                                        | PR template fixture.                    |
| Claude component workflow                                           | `.agents/skills/component-work/SKILL.md`                      | Peer equivalent with rewrite            | Keep artifact discipline without a giant orchestrator prompt.                                                                                                                    | Contract eval.                          |
| Claude rule files                                                   | `.agents/resources/rules/*.md` plus `rule-map.md`             | Shared Vue policy; other peers retained | The component-local CLAUDE import loads shared Vue policy; other topics retain current peers. Codex does not require Claude runtime files. Logical naming has a routed resource. | Contract eval verifies mapped files.    |
| Claude branch and PR guard hooks                                    | `project-start`, `commit`, `pr-prep`, and branch safety rules | Replace with explicit Codex skills      | Codex should surface safety decisions in the workflow instead of relying on hidden hook behavior.                                                                                | Project-start fixture.                  |
| Claude staging-to-next merge skill                                  | `.agents/skills/merge-next/SKILL.md`                          | Temporary peer equivalent               | Weekly synchronization needs the same merge-history, artifact freshness, approval, and push gates in both harnesses until `next` merges back into `staging`.                     | Behavior fixture plus contract eval.    |
| Claude doc sync enforcement                                         | `doc-sync-check` report/apply modes                           | Peer equivalent with rewrite            | Suggestions are useful; apply mode must be explicit.                                                                                                                             | Doc-sync fixture.                       |
| Dialtone design-system lookup tools                                 | `.codex/config.toml` plus `dialtone-lookup` skill             | Add Codex-native runtime support        | Codex should use local Dialtone MCP/CLI lookup before guessing about docs, APIs, tokens, utilities, or icons.                                                                    | Contract eval plus CLI smoke.           |
| Claude PR prep coordinator                                          | `.agents/skills/pr-prep/SKILL.md`                             | Peer equivalent with simplification     | PR readiness should be a direct skill, not a heavyweight agent.                                                                                                                  | Contract eval.                          |
| Claude cleanup/janitor workflow                                     | Future cleanup skill or `pr-complete` note                    | Defer                                   | Useful before merge, but not needed for this first core loop.                                                                                                                    | None yet.                               |
| Claude package-specific skills for tokens, icons, and utilities     | Future `token-work`, `icon-work`, `utility-work` skills       | Defer                                   | Add after the core Codex loop stabilizes. First pilot should be `utility-work`.                                                                                                  | Future fixture evals.                   |
| Claude shaping and breadboarding workflows                          | Future planning skills if repeated                            | Defer                                   | High context cost; add only if repeated Codex use proves the need.                                                                                                               | None yet.                               |
| Claude configuration and Anthropic-practices review helper surfaces | No direct Codex peer in the first pass                        | Skip                                    | The current Codex eval contracts and this resource capture the useful review criteria.                                                                                           | None.                                   |

## Rule parity obligation

When a `.claude/rules/*.md` file is added or renamed, add the matching
`.agents/resources/rules/*.md` peer in the same branch. If Codex should not get
an exact-name peer yet, record a Defer or Skip decision below and keep the eval
allowlist in `.agents/evals/run-skill-contract-evals.mjs` in sync with this
table.

| Claude rule                                   | Codex peer or status                    | Decision               | Rationale                                                                                                                                                                                        |
| --------------------------------------------- | --------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.claude/rules/claude-config.md`              | No Codex peer                           | Skip                   | Claude runtime configuration does not apply to Codex runtime rules.                                                                                                                              |
| `.claude/rules/css-specificity.md`            | No exact Codex peer yet                 | Defer                  | Codex CSS review currently routes through `css-utilities` and `design-tokens`; add a peer when specificity review becomes a repeated Codex need.                                                 |
| `.claude/rules/dialtone-query-core.md`        | `.agents/resources/rules/query-core.md` | Skip exact-name parity | Codex already has the shorter query-core peer, so an exact duplicate file would add routing noise.                                                                                               |
| `.claude/rules/general-rules.md`              | `.agents/resources/rules/general.md`    | Skip exact-name parity | Codex uses a shorter general rule name in its rule map.                                                                                                                                          |
| `.claude/rules/link-and-button-navigation.md` | No exact Codex peer yet                 | Defer                  | Fold into a future accessibility/navigation peer when Codex review needs it.                                                                                                                     |
| `.claude/rules/slot-class-props.md`           | Shared `rules/vue-components.md`        | Skip exact-name parity | Full slot-class policy is in the shared Vue resource. Claude imports it through component-local instructions; the old rule file remains a scoped adapter. Codex already routes to that resource. |

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
