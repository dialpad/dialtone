# Codex Tooling Rules

Apply to `AGENTS.md`, `.agents/**`, and `.codex/**`.

## Harness Independence

- Codex tooling is a first-class harness alongside Claude tooling, not a replacement project.
- Active Codex skills and resources should reference `.agents/**` runtime files.
- Use `.codex/**` only for Codex runtime configuration such as MCP registration, hooks, command approval rules, permission profiles, or custom subagents.
- Existing `.claude/**` files may be source material or comparative evidence, but should not be required by Codex skills at runtime.
- Do not gate Codex validation on `.claude/**`; validate the Codex harness independently and update `.agents/resources/agent-tooling-parity.md` when a workflow intentionally mirrors or diverges from Claude behavior.
- Rule parity is the explicit cross-tree exception: when `.claude/rules/*.md` is added or renamed, add the peer `.agents/resources/rules/*.md` file or record a Defer/Skip decision in `.agents/resources/agent-tooling-parity.md`.

## Context Cost

- Keep `AGENTS.md` short and durable.
- Move task-specific detail into skills or resources.
- Keep skills focused on one job with goal, trigger, required context, constraints, workflow, done-when, verification, and references.

## Evals

- Every skill needs contract eval coverage.
- Risky workflows need fixture or behavior evals.
- Evals should prove behavior, not only the presence of reassuring wording.
- The skill contract eval enforces `.claude/rules` to `.agents/resources/rules` parity for exact-name peers, except for the Defer/Skip allowlist documented in `agent-tooling-parity.md`.
