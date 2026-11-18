---
name: pr-prep
description: Check that a Dialtone branch or PR is ready, the way its human reviewers would. Captures a fixed scope, runs a cold adversarial reviewer plus specialists chosen by the files changed, runs the safe lint and tests for the touched packages, and ends with one verdict. Report-only by default; fixes findings only when asked. Use before opening or updating a PR, when asked "is this ready", or to review someone else's PR.
---

Load `.agents/skills/pr-prep/SKILL.md` and follow it. It is the single source for this skill; this wrapper adds no rules. Links under `references/` are relative to `.agents/skills/pr-prep/`; all other paths are from the repo root.
