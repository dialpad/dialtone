---
type: workflow
category: workflows
keywords: [workflows, index, release, branch-strategy, conventional-commits, component-lifecycle, figma-sync, ci-pipeline]
ai_summary: Index of workflow documentation for Dialtone covering releases, branching, commit conventions, component lifecycle, Figma sync, and CI pipeline.
last_updated: 2026-03-04
---

# Workflow Documentation

Process and workflow documentation for contributing to and releasing the Dialtone design system.

## Documents

- [Release Process](./workflow-release-process.md) — Tuesday cron schedule, semantic-release per package, tag format, changelog generation, and the staging-to-production auto-merge
- [Branch Strategy](./workflow-branch-strategy.md) — staging as the main branch, PR flow, production fast-forward, deploy previews, and required checks before merge
- [Conventional Commits](./workflow-conventional-commits.md) — Commit format with JIRA requirement, the 11 allowed types, version bump mapping, and breaking change syntax
- [Component Lifecycle](./workflow-component-lifecycle.md) — The three component status values (ready, beta, planned), where they are set, and how they surface in the documentation site
- [Figma Sync](./workflow-figma-sync.md) — The two sync scripts, what each does, required environment variables, and when to run each direction
- [CI Pipeline](./workflow-ci-pipeline.md) — All GitHub Actions workflows, required checks before merge, deployment destinations, and secrets reference
