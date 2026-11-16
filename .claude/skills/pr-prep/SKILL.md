---
name: pr-prep
description: Check that a Dialtone branch or PR is ready, the way its human reviewers would. Captures a fixed scope, runs a cold adversarial reviewer plus specialists chosen by the files changed, fixes or rejects each finding, re-reviews, runs lint and tests for the touched packages only, and ends with one verdict. Use before opening or updating a PR, when asked "is this ready", or to review someone else's PR.
---

Load `.agents/skills/pr-prep/SKILL.md` and follow it. It is the single source for this skill; this wrapper adds no rules.
