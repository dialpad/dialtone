---
type: standard
category: standards
keywords: [ai-documentation, searchability, completeness, structure, frontmatter, naming-conventions, validation, content-quality]
ai_summary: Standards for creating AI-discoverable documentation in Dialtone — searchability, completeness, structure, and validation rules.
last_updated: 2026-03-09
last_verified: 2026-04-27
---

# AI Documentation Standards for Dialtone

> **Standards for making Dialtone documentation discoverable and usable by AI assistants**

These standards ensure AI assistants (Claude Code, GitHub Copilot, Cursor, Windsurf) working in the Dialtone repository can discover and understand documentation efficiently through text search, file existence checks, and structured metadata.

---

## Three Core Principles

### 1. Searchability (Grep-able Content)

**What it means:** Content uses actual component names, package names, and technical terms

**Why it matters:** AI assistants use text search (grep) to find relevant documentation. Generic terms like "the component" or "this system" are not discoverable.

**Examples:**

Good — Searchable:
```markdown
DtButton is a Vue 3 component from @dialpad/dialtone-vue package.
It integrates with dialtone-css utility classes and uses Dialtone design tokens.
Built with VuePress and deployed via GitHub Actions.
```

Bad — Not searchable:
```markdown
The button is a component from our Vue library.
It uses our CSS classes and tokens.
Built with our static site generator and deployed automatically.
```

**How to apply:**
- Use exact package names: `@dialpad/dialtone-vue`, `dialtone-css`, `dialtone-tokens`
- Use exact component names: `DtButton`, `DtModal`, `DtInput` (not "button component")
- Use technical terms: `VuePress`, `pnpm workspace`, `NX`, `vue-docgen-api`
- Use actual file/directory names: `apps/dialtone-documentation/docs/`
- Write naturally — AI uses full-text search, not just keyword matching

---

### 2. Completeness (Documentation Exists)

**What it means:** Every major system, package, and workflow has corresponding documentation

**Why it matters:** AI assistants need context for all parts of the monorepo to understand the codebase structure and make correct changes.

**How to apply:**
- Every package in `packages/` gets AI context doc
- Every major system (build, release, docs) has a guide
- Every workflow (PR, deployment, publishing) is documented

---

### 3. Structure (Organized Metadata)

**What it means:** Standardized YAML frontmatter with required fields

**Why it matters:** AI assistants parse metadata for categorization, indexing, and discovery. Consistent structure enables automated validation and better search.

**Required fields:**

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `type` | string | Document type | Must be one of: architecture, development, workflow, reference, standard, guide, template |
| `category` | string | Document category | Should match or be plural of type |
| `keywords` | array | Searchable terms | Minimum 3 items |
| `ai_summary` | string | Concise description | Maximum 150 characters |

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `last_updated` | string | YYYY-MM-DD format. Set when the file is edited. |
| `last_verified` | string | YYYY-MM-DD format. Set when a human re-reads the document and confirms it is still accurate — distinct from `last_updated`, which only records edits. Expected on all `standards/` documents; optional elsewhere. By convention, bump only after substantive review (not just housekeeping edits). |
| `related_packages` | array | Package names this doc relates to |
| `related_docs` | array | Links to related documentation |

---

## Content Quality

### Provide Complete Information
- Document all public APIs, components, and features
- Include usage examples with actual, runnable code
- Explain both "what" and "why" (not just "how")
- Document edge cases, gotchas, and common mistakes

### Keep Content Current
- Update docs when code changes
- Include `last_updated` dates in frontmatter
- Mark deprecated features clearly with alternatives
- Remove obsolete documentation (don't leave outdated info)

### Write Substantively
- **No placeholder content** ("TODO", "Coming soon", "TBD")
- **No empty sections** (remove section if not ready)
- **Provide context and background** (not just API lists)
- **Include real examples** (not pseudo-code or comments)

---

## File Naming Conventions

All documentation files use **kebab-case** naming with category prefix:

| Category | Pattern | Example |
|----------|---------|---------|
| Architecture | `architecture-[name].md` | `architecture-monorepo-structure.md` |
| Development | `development-[area].md` | `development-component-workflow.md` |
| Workflow | `workflow-[process].md` | `workflow-release-process.md` |
| Reference | `reference-[topic].md` | `reference-component-api-patterns.md` |
| Standard | `standard-[name].md` | `standard-ai-documentation.md` |

Each category directory has an `INDEX.md` that lists all documents with brief descriptions.

---

## Validation Rules

### Automated Checks

**YAML Frontmatter:**
- Syntax is valid YAML
- All required fields present (`type`, `category`, `keywords`, `ai_summary`)
- `type` matches allowed values
- `keywords` is array with 3+ items
- `ai_summary` is ≤150 characters

**File Structure:**
- Files use kebab-case naming
- Files in correct directory for their `category`
- INDEX.md files exist in each category directory

**Content:**
- No placeholder content ("TODO", "TBD", "Coming soon")
- No empty sections (heading with no content)
- Minimum content length (>200 words for substantive docs)
- Code blocks have language specified

---

## Quick Checklist

When creating or updating documentation:

**Searchability:**
- [ ] Uses actual package/component names (not generic terms)
- [ ] Uses technical terms (VuePress, pnpm, NX, vue-docgen-api, etc.)
- [ ] Includes searchable keywords in natural language

**Completeness:**
- [ ] Covers all aspects of the topic (no major gaps)
- [ ] Includes code examples that are complete and runnable
- [ ] Documents edge cases and common issues
- [ ] Links to related documentation

**Structure:**
- [ ] YAML frontmatter includes all required fields
- [ ] Keywords array has minimum 3 items
- [ ] ai_summary is under 150 characters
- [ ] Filename uses kebab-case with category prefix

**Content Quality:**
- [ ] No placeholders, TODOs, or "Coming soon"
- [ ] No empty sections
- [ ] Technical information is accurate and current
- [ ] Writing is clear and concise
