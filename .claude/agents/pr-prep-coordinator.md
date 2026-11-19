---
description: 'Pre-PR validation agent. Runs the shared pr-prep skill before creating a pull request.'
tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Task
memory:
  scope: project
---

# PR Prep Coordinator Agent

Run the `pr-prep` skill (`.agents/skills/pr-prep/SKILL.md`) and follow it as written. It owns scope, review, gates, the verdict and the record that `pr-create` and `/pr-fill` check. This agent adds no checks of its own: in report-only mode, run only the checks the skill and `.agents/resources/validation.md` allow.
