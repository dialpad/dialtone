---
description: Run a local code review using the 3-agent + validator pipeline against Dialtone rules. Reviews staged/unstaged changes with confidence-scored findings.
---

Run the **review** skill to check changed code through the Dialtone review pipeline (Conventions + Bugs/Logic + Architecture agents, then a batched Validator with confidence threshold 80%).

## Usage

- `/review` — Review all changed files (full 3-agent pipeline)
- `/review <area>` — Focus on one area: `vue`, `css`, `api`, `testing`, `storybook`, `i18n`, `accessibility`

**Removed:** `/review <file>` mode — run `/review` on a branch where only that file has changed instead.
