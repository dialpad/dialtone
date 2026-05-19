---
paths:
  - ".claude/**"
---

# .claude/ Configuration Rules

Per-project Claude Code configuration: agents, commands, hooks, rules, skills, and settings. Everything here is checked into git so the whole team gets the same agent behavior.

## Directory Layout

```text
.claude/
├── agents/        # Subagents invoked by skills or via /agent
├── commands/      # Slash command triggers (thin invokers)
├── hooks/         # Shell scripts triggered by Claude Code events
├── rules/         # Path-scoped rule files (this directory)
├── skills/        # Reusable workflows (Markdown or directory with SKILL.md)
├── plans/         # Plan files (gitignored — local working state)
├── tsc-cache/     # Session cache (gitignored)
└── settings.json  # Project-level Claude Code settings
```

## Agents (`.claude/agents/`)

Subagent definitions as `.md` files with frontmatter:

```yaml
---
name: agent-name
description: "When to invoke this agent. Include <example> blocks showing trigger phrases."
tools: Bash, Read, Grep, Glob   # OR list form below
model: sonnet                    # sonnet | opus | haiku
color: green                     # purely cosmetic
---
```

Body is the system prompt for the subagent — written in second person ("You are…").

Rules:
- `name` MUST match the filename (`doc-janitor` → `doc-janitor.md`)
- `description` MUST include at least one `<example>` block so Claude can match natural-language triggers
- Subagents do NOT inherit project rules — they only see `~/.claude/rules/*.md` and `.claude/rules/*.md` files they explicitly read
- Keep tool lists minimal — least privilege

## Commands (`.claude/commands/`)

Slash command triggers as `.md` files. Filename = command name (`/review` → `review.md`).

Rules:
- Commands are thin invokers — they call a skill or agent. Business logic belongs in the skill, not the command.
- One sentence of context, then the trigger
- Don't duplicate skill documentation in the command — the skill is the single source of truth

## Hooks (`.claude/hooks/`)

Shell scripts triggered by Claude Code events (PreToolUse, PostToolUse, Stop, etc.). Registered in `settings.json`.

Rules:
- Always `#!/bin/bash` shebang + `set -e` for fail-fast
- Read tool info from stdin as JSON: `tool_info=$(cat); tool_name=$(echo "$tool_info" | jq -r '.tool_name')`
- Use `jq` for JSON parsing — already a dependency in CI
- Exit codes:
  - `0` — allow (default)
  - `2` — deny with message on stderr
- Stay fast — hooks run on every tool call. > 100ms is a problem.
- Hooks are project-local; for global behavior, use `~/.claude/hooks/`

## Rules (`.claude/rules/`)

Path-scoped review/development rules loaded by the `/review` skill and as context injection by Claude Code.

Rules:
- Every package-specific rule file has YAML frontmatter with a `paths:` field listing glob patterns:
  ```yaml
  ---
  paths:
    - "packages/dialtone-vue/**/*.vue"
  ---
  ```
- `general-rules.md` is the ONE exception — no `paths:` field, always loaded
- Rules are prescriptive: forward-looking guidance, not a description of every file
- One match in the codebase is enough to validate a pattern — bias toward adding rules, not removing them
- Keep each file scoped — `vue-components.md` for components, `vue-tests.md` for tests, etc. Don't pile unrelated rules into one file.

## Skills (`.claude/skills/`)

Reusable workflows. Two forms:

1. **Single-file skill**: `.claude/skills/<name>.md`
2. **Directory skill**: `.claude/skills/<name>/SKILL.md` (use when the skill needs supporting files)

Rules:
- Directory form is preferred when the skill loads other files (templates, sub-prompts, helper scripts)
- `SKILL.md` is the canonical entry — no `index.md`, no `README.md`
- Skill body is written as procedural instructions for Claude, not as user-facing documentation

## Settings (`.claude/settings.json`)

Project-level Claude Code settings. Common fields:

```json
{
  "permissions": { /* allow / deny rules */ },
  "hooks": { /* event → script mapping */ },
  "model": "sonnet",
  "env": { /* env vars injected into bash tool */ }
}
```

Rules:
- Local-only overrides go in `.claude/settings.local.md` or `.local.json` (gitignored)
- Don't commit secrets — `env` values are visible to anyone with repo access
- Adding a hook here without also adding the script in `hooks/` is broken — they ship together

## Cache & Working State (gitignored)

- `.claude/plans/` — local plan files
- `.claude/tsc-cache/<session>/` — per-session edit tracking
- `.claude/scheduled_tasks.lock` — runtime lock

These MUST stay gitignored. If you find one tracked, remove it.

## Anti-Patterns

- Duplicating logic between an agent and its caller skill — pick one place
- Hardcoding paths in agents/skills/hooks that break when the repo is cloned to a different location — use `$(git rev-parse --show-toplevel)` or relative paths
- Adding rules with no `paths:` and no `general-rules.md` exemption — they'd never load
- Skills with conflicting trigger phrases — be specific in descriptions to avoid ambiguous routing
- Hooks that write to stdout — only stderr is safe for hook output; stdout corrupts the JSON-RPC frame
- Commands with embedded logic — refactor into a skill, leave the command as a thin trigger
- Editing global Claude Code rules (`~/.claude/rules/*.md`) instead of project-scoped ones — global rules affect every project the user opens
