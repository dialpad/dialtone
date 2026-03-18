---
name: doc-sync-enforcer
description: Updates dialtone-docs content files when source code changes. Triggered by the pre-push-pr-guard hook or manually via /doc-sync-enforcer. Reads the edit tracker cache to know what changed, maps source packages to doc files, and updates them.
---

# Documentation Sync Enforcer

Updates `packages/dialtone-docs/src/content/` files to reflect source code changes across the Dialtone monorepo.

## When This Runs

- **Automatically** — triggered by `pre-push-pr-guard.sh` when code files were edited but corresponding docs were not
- **Manually** — via `/doc-sync-enforcer` command

## Source → Doc Mapping

| Source path | Doc file(s) in `packages/dialtone-docs/src/content/` |
|---|---|
| `packages/dialtone-tokens/` | `development/development-design-tokens.md`, `architecture/architecture-design-token-pipeline.md` |
| `packages/dialtone-css/` | `development/development-css-utilities.md` |
| `packages/dialtone-vue/` | `development/development-component-workflow.md`, `reference/reference-component-api-patterns.md`, `reference/reference-accessibility-checklist.md`, `development/development-testing.md` |
| `packages/dialtone-icons/` | `development/development-icons.md` |
| `.github/workflows/` | `workflows/workflow-ci-pipeline.md` |
| Release config changes | `workflows/workflow-release-process.md` |
| Branch strategy changes | `workflows/workflow-branch-strategy.md` |
| Commit convention changes | `workflows/workflow-conventional-commits.md` |

## Workflow

### Step 1 — Read the edit tracker

Read the session cache to find what was changed:

```
.claude/tsc-cache/<session_id>/edited-files.log    — every file edited this session
.claude/tsc-cache/<session_id>/missing-docs.txt    — mappings flagged by the hook
.claude/tsc-cache/<session_id>/affected-repos.txt  — which packages were touched
```

The `edited-files.log` format is `timestamp:filepath:repo` — extract the filepaths.

### Step 2 — For each mapping, read source and doc

For each entry in `missing-docs.txt`:

1. **Read the changed source files** from `edited-files.log` that belong to the flagged package
2. **Read the existing doc file** from `packages/dialtone-docs/src/content/`
3. **Understand what changed** — new files added, APIs modified, configs changed, patterns introduced

### Step 3 — Determine if update is needed

Not every code change needs a doc update:

- **Bug fix / formatting** — skip, note it
- **New feature / API / config** — update the relevant section
- **Removed feature** — remove or update the section
- **New file / pattern** — add to the doc if significant

### Step 4 — Update the doc file

When updating a doc file:

1. **Preserve the existing structure** — the doc has `##` sections that are independently searchable
2. **Update only the sections affected** by the source code changes
3. **Update the `last_updated` frontmatter field** to today's date
4. **Never invent information** — only document what exists in the actual code
5. **Keep the same writing style** — concise, technical, grep-friendly

### Frontmatter format

Every doc file has YAML frontmatter that must be preserved:

```yaml
---
type: guide|reference|workflow|architecture|standard
category: development|architecture|workflows|reference|standards
keywords:
  - keyword1
  - keyword2
  - keyword3
ai_summary: "One-line summary, max 150 characters"
last_updated: "2026-03-13"
related_packages:
  - "@dialpad/package-name"
---
```

Required fields: `type`, `category`, `keywords` (3+), `ai_summary` (≤150 chars), `last_updated`.

### Step 5 — Report what was done

After updating, print a summary:

```
📚 Doc Sync Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Updated:
   development-design-tokens.md — added new spacing token section
   architecture-design-token-pipeline.md — updated build step 3

⏭️  Skipped (trivial changes):
   development-css-utilities.md — bug fix only, no doc impact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Rules

- **Never invent functionality** — only document what exists in the actual code
- **Read the source files first** — don't guess what changed, read the actual diff or file
- **Preserve human-authored content** — when updating, never remove existing sections unless the feature was removed
- **Keep docs under 350 lines** — if longer, the doc is trying to cover too much
- **Use actual package names and technical terms** — content must be grep-friendly (no placeholders)
- **File naming convention** — kebab-case with category prefix: `development-component-workflow.md`
