# DLT-3290: Review Rules Sync

Created: 2026-04-10
Status: PENDING
Type: Feature

## Problem

Review rules now live in three places that drift independently:

1. `.claude/rules/code-review.md` (+ `vue-components.md`, `css-utilities.md`, `design-tokens.md`) — source of truth for Claude Code local development
2. `.coderabbit.yaml` path_instructions — condensed rules for CodeRabbit PR reviews
3. `.github/workflows/claude-code-review.yml` prompt — condensed rules for Claude CI review

When a rule is added or updated in one place, the others must be updated to match. Currently this is manual and will drift.

## Proposed Solution

Extend the existing doc-sync pattern (edit tracker hook → pre-push guard → enforcer skill) to cover review rule files. When a rule source file is edited, the pre-push guard detects the change and triggers Claude to update the condensed versions in the other two targets.

### Source → Target Mapping

| Source | Targets |
|--------|---------|
| `.claude/rules/code-review.md` | `.coderabbit.yaml`, workflow prompt |
| `.claude/rules/vue-components.md` | `.coderabbit.yaml` Vue section, workflow Vue section |
| `.claude/rules/css-utilities.md` | `.coderabbit.yaml` CSS section |
| `.claude/rules/design-tokens.md` | `.coderabbit.yaml` tokens section |
| `.claude/rules/icons.md` | `.coderabbit.yaml` icons section |

## Status

Awaiting analysis of Claude and CodeRabbit review behavior on this PR before planning implementation.
