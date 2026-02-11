---
type: standard
category: standards
keywords: [ai-documentation, searchability, completeness, structure, standards, testing, geo, generative-engine-optimization]
ai_summary: Standards for creating AI-discoverable documentation in Dialtone monorepo with internal and external optimization
---

# AI Documentation Standards for Dialtone

> **Standards for making Dialtone documentation discoverable and usable by AI assistants**

## Purpose

These standards ensure AI assistants (Claude Code, GitHub Copilot, Cursor, Windsurf) working in the Dialtone repository can discover and understand documentation efficiently through text search, file existence checks, and structured metadata.

**Two complementary strategies:**
- **Internal AI Standards** (below): For AI assistants working in this repository
- **External GEO** (see [External GEO Reference](#external-geo-reference)): For public documentation meant to be discovered by external AI search engines

---

## Part 1: Internal AI Standards

These principles apply to documentation in the `docs/` directory for AI assistants working on Dialtone code.

### Three Core Principles

#### 1. Searchability (Grep-able Content)

**What it means:** Content uses actual component names, package names, and technical terms

**Why it matters:** AI assistants use text search (grep) to find relevant documentation. Generic terms like "the component" or "this system" are not discoverable.

**Validated by:** `tests/docs-validation/specs/01-searchability.spec.js`

**Examples:**

✅ **Good - Searchable:**
```markdown
DtButton is a Vue 3 component from @dialpad/dialtone-vue package.
It integrates with dialtone-css utility classes and uses Dialtone design tokens.
Built with VuePress and deployed via GitHub Actions.
```

❌ **Bad - Not searchable:**
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
- Write naturally - AI uses full-text search, not just keyword matching

---

#### 2. Completeness (Documentation Exists)

**What it means:** Every major system, package, and workflow has corresponding documentation

**Why it matters:** AI assistants need context for all parts of the monorepo to understand the codebase structure and make correct changes.

**Validated by:** `tests/docs-validation/specs/02-completeness.spec.js`

**Examples:**

✅ **Good - Complete:**
```
docs/
├── architecture/
│   ├── MONOREPO_STRUCTURE.md ✓
│   ├── BUILD_SYSTEM.md ✓
│   └── PACKAGE_DEPENDENCIES.md ✓
├── development/
│   ├── COMPONENT_DEVELOPMENT.md ✓
│   ├── CSS_DEVELOPMENT.md ✓
│   └── TOKEN_DEVELOPMENT.md ✓
└── workflows/
    ├── RELEASE_PROCESS.md ✓
    └── PR_WORKFLOW.md ✓
```

❌ **Bad - Incomplete:**
```
docs/
├── architecture/
│   └── MONOREPO_STRUCTURE.md ✓
└── development/
    └── (no files) ✗
```

**How to apply:**
- Every package in `packages/` gets AI context doc (Phase 2)
- Every major system (build, release, docs) has a guide
- Every workflow (PR, deployment, publishing) is documented
- Use templates from `docs/templates/` for consistency

---

#### 3. Structure (Organized Metadata)

**What it means:** Standardized YAML frontmatter with required fields

**Why it matters:** AI assistants parse metadata for categorization, indexing, and discovery. Consistent structure enables automated validation and better search.

**Validated by:** `tests/docs-validation/specs/03-structure.spec.js`

**Examples:**

✅ **Good - Structured:**
```yaml
---
type: development
category: development
keywords: [vue-components, component-development, dialtone-vue, storybook]
ai_summary: Guide for developing Vue 3 components in Dialtone design system
---
```

❌ **Bad - Unstructured:**
```yaml
---
title: Component Development
tags: vue
---
```

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
| `last_updated` | string | YYYY-MM-DD format |
| `related_packages` | array | Package names this doc relates to |
| `related_docs` | array | Links to related documentation |

**How to apply:**
- Always include YAML frontmatter at the top of every `.md` file
- Use appropriate template from `docs/templates/`
- Choose keywords AI assistants would search for
- Keep ai_summary concise but descriptive

---

### Content Quality

**What it means:** Documentation is comprehensive, accurate, current, and substantive

**Why it matters:** High-quality content provides AI assistants with reliable information they can confidently use and recommend. Placeholder content or outdated information leads to incorrect assumptions and poor code changes.

**How to apply:**

#### Provide Complete Information
- Document all public APIs, components, and features
- Include usage examples with actual, runnable code
- Explain both "what" and "why" (not just "how")
- Document edge cases, gotchas, and common mistakes
- Include troubleshooting information

#### Keep Content Current
- Update docs when code changes
- Include "Last Updated" dates in frontmatter
- Mark deprecated features clearly with alternatives
- Remove obsolete documentation (don't leave outdated info)
- Review and update quarterly

#### Write Substantively
- **No placeholder content** ("TODO", "Coming soon", "TBD")
- **No empty sections** (remove section if not ready)
- **Provide context and background** (not just API lists)
- **Include real examples** (not pseudo-code or comments)
- **Explain decisions** (architecture choices, patterns used)

**Examples:**

✅ **Good - Substantive:**
```markdown
## Error Handling

DtButton handles errors through Vue's error boundary system. When a button
action throws an error, it bubbles up to the nearest error boundary for handling.

```typescript
<DtButton @click="async () => {
  try {
    await submitForm();
  } catch (error) {
    showNotification({ message: error.message, kind: 'error' });
  }
}">
  Submit
</DtButton>
```

**Common errors:**
- `ValidationError`: Form validation failed before submission
- `NetworkError`: API request failed or timed out
- `PermissionError`: User lacks permission for this action

**Best practice:** Always provide user feedback for async operations.
```

❌ **Bad - Placeholder:**
```markdown
## Error Handling

TODO: Document error handling patterns

See source code for implementation details.
```

---

## Directory Structure

```
docs/
├── AI_START_HERE.md           # Entry point for AI assistants
├── README.md                   # Human-friendly overview
│
├── architecture/               # System architecture
│   ├── INDEX.md
│   ├── MONOREPO_STRUCTURE.md
│   ├── BUILD_SYSTEM.md
│   ├── PACKAGE_DEPENDENCIES.md
│   └── DOCUMENTATION_SYSTEM.md
│
├── development/                # Development guides
│   ├── INDEX.md
│   ├── COMPONENT_DEVELOPMENT.md
│   ├── CSS_DEVELOPMENT.md
│   ├── TOKEN_DEVELOPMENT.md
│   ├── ICON_DEVELOPMENT.md
│   └── TESTING_GUIDELINES.md
│
├── workflows/                  # Process workflows
│   ├── INDEX.md
│   ├── RELEASE_PROCESS.md
│   ├── PR_WORKFLOW.md
│   ├── DEPLOYMENT.md
│   └── LOCAL_DEVELOPMENT.md
│
├── reference/                  # Technical reference
│   ├── INDEX.md
│   ├── DIALTONE_CSS_PATTERNS.md
│   ├── VUE_PATTERNS.md
│   ├── STORYBOOK_CONVENTIONS.md
│   └── ACCESSIBILITY_STANDARDS.md
│
├── standards/                  # Quality standards
│   ├── INDEX.md
│   ├── AI_DOCUMENTATION_STANDARDS.md  (this file)
│   ├── CODE_STANDARDS.md
│   └── TESTING_STANDARDS.md
│
└── templates/                  # Documentation templates
    ├── template-architecture.md
    ├── template-development.md
    ├── template-workflow.md
    ├── template-reference.md
    └── template-standard.md
```

---

## File Naming Conventions

All documentation files must use **kebab-case** naming with descriptive prefixes based on their category.

### Architecture Documentation
```
architecture/
├── architecture-monorepo-structure.md
├── architecture-build-system.md
├── architecture-documentation-system.md
└── architecture-package-dependencies.md
```

**Pattern:** `architecture-[descriptive-name].md`

### Development Guides
```
development/
├── development-component-workflow.md
├── development-css-utilities.md
├── development-design-tokens.md
├── development-icon-creation.md
└── development-testing-strategy.md
```

**Pattern:** `development-[feature-area].md`

### Workflow Documentation
```
workflows/
├── workflow-release-process.md
├── workflow-pr-review.md
├── workflow-deployment.md
└── workflow-local-setup.md
```

**Pattern:** `workflow-[process-name].md`

### Reference Documentation
```
reference/
├── reference-css-patterns.md
├── reference-vue-patterns.md
├── reference-api-conventions.md
└── reference-accessibility-checklist.md
```

**Pattern:** `reference-[topic-name].md`

### Standards Documentation
```
standards/
├── standard-ai-documentation.md
├── standard-code-quality.md
├── standard-testing.md
└── standard-accessibility.md
```

**Pattern:** `standard-[standard-name].md`

### Index Files
Each category directory should have an `INDEX.md` (uppercase) that:
- Lists all documents in that category
- Provides brief descriptions
- Suggests reading order if applicable

**Example:**
```markdown
---
type: reference
category: reference
keywords: [index, navigation, reference-docs]
ai_summary: Index of reference documentation for Dialtone patterns and conventions
---

# Reference Documentation Index

Technical reference documentation for Dialtone patterns and conventions.

## Available References

- [CSS Patterns](./reference-css-patterns.md) - Utility class patterns and naming
- [Vue Patterns](./reference-vue-patterns.md) - Component composition patterns
- [API Conventions](./reference-api-conventions.md) - API design standards
- [Accessibility Checklist](./reference-accessibility-checklist.md) - WCAG compliance checklist
```

### Why These Conventions?

1. **Searchable prefixes:** AI can filter by category (e.g., grep for `workflow-*`)
2. **No ambiguity:** `development-testing-strategy.md` vs `testing.md` is clearer
3. **Consistent length:** Predictable filename structure aids navigation
4. **Category visible:** Know document type from filename alone

---

## Test Suite

The documentation test suite validates these three principles:

| Test Suite | Validates | Command |
|------------|-----------|---------|
| `01-searchability.spec.js` | Content uses actual names | `npm run test:searchability` |
| `02-completeness.spec.js` | Required docs exist | `npm run test:completeness` |
| `03-structure.spec.js` | YAML frontmatter valid | `npm run test:structure` |

**Run all tests:**
```bash
cd tests/docs-validation
npm test
```

**Tests must pass at 100% before merging documentation changes.**

---

## Validation

Documentation quality is ensured through a combination of automated testing and manual review.

### Automated Checks

These checks run via the test suite and can be automated in CI/CD:

**YAML Frontmatter Validation:**
- Syntax is valid YAML
- All required fields present (`type`, `category`, `keywords`, `ai_summary`)
- `type` matches allowed values
- `keywords` is array with 3+ items
- `ai_summary` is ≤150 characters
- `category` matches directory name

**File Structure Validation:**
- Files use kebab-case naming
- Files in correct directory for their `category`
- No spaces or special characters in filenames
- INDEX.md files exist in each category directory

**Content Validation:**
- No placeholder content ("TODO", "TBD", "Coming soon")
- No empty sections (heading with no content)
- Minimum content length (>200 words for substantive docs)
- Code blocks have language specified

**Completeness Validation:**
- Major packages have documentation
- Critical workflows documented
- No broken internal links

**Example test output:**
```bash
✓ YAML frontmatter is valid
✓ All required fields present
✓ Keywords array has 5 items (minimum 3)
✓ ai_summary is 142 characters (maximum 150)
✓ Filename uses kebab-case
✓ No placeholder content found
✓ No empty sections
✓ All internal links valid

8 passing (12ms)
```

### Manual Review

These aspects require human judgment and should be checked during PR review:

**Content Accuracy:**
- Technical information is correct
- Code examples actually work
- Package versions are current
- Commands and APIs are accurate

**Code Example Quality:**
- Examples are complete and runnable
- Examples demonstrate best practices
- Examples include necessary imports/setup
- Examples have explanatory comments where helpful

**Cross-Reference Validity:**
- Links to related documentation make sense
- Referenced files exist and are relevant
- External links work and are authoritative

**Writing Quality:**
- Clear, concise language
- Proper grammar and spelling
- Consistent terminology
- Appropriate technical level for audience

**Searchability (Manual):**
- Uses actual component/package names consistently
- Includes relevant technical terms
- Natural language that AI can search effectively

### PR Review Checklist

When reviewing documentation PRs:

- [ ] Run automated tests: `npm test`
- [ ] Verify all tests pass
- [ ] Check code examples work (copy/paste and run)
- [ ] Verify technical accuracy
- [ ] Check links (internal and external)
- [ ] Ensure searchable language (actual names, not generic terms)
- [ ] Confirm content is substantive (no placeholders)
- [ ] Validate examples are complete
- [ ] Check grammar and clarity

---

## Quick Checklist

When creating or updating internal documentation:

**Searchability:**
- [ ] Uses actual package/component names (not generic terms like "the component")
- [ ] Uses technical terms (VuePress, pnpm, NX, vue-docgen-api, etc.)
- [ ] Includes searchable keywords in natural language

**Completeness:**
- [ ] Covers all aspects of the topic (no major gaps)
- [ ] Includes code examples that are complete and runnable
- [ ] Documents edge cases and common issues
- [ ] Links to related documentation

**Structure:**
- [ ] YAML frontmatter includes all required fields (type, category, keywords, ai_summary)
- [ ] Keywords array has minimum 3 items
- [ ] ai_summary is under 150 characters
- [ ] Filename uses kebab-case with category prefix

**Content Quality:**
- [ ] Content is substantial (no placeholders, TODOs, or "Coming soon")
- [ ] No empty sections (remove if not ready)
- [ ] Code examples are tested and work
- [ ] Technical information is accurate and current
- [ ] Writing is clear and concise

**Validation:**
- [ ] Tests pass: `npm test`
- [ ] No broken internal links
- [ ] External links work and are authoritative
- [ ] Spell check completed

---

## Part 2: External GEO Reference

### What is GEO (Generative Engine Optimization)?

**GEO** (Generative Engine Optimization) is the practice of optimizing content for external AI-powered search engines (ChatGPT, Perplexity, Google AI Overviews) to cite your content in generated responses.

**Key difference from internal standards:**
- **Internal AI Standards** (above): For AI assistants working in this repository
- **External GEO** (below): For public-facing documentation meant to be discovered by external AI search

---

### When to Apply External GEO

Apply GEO principles to:
- ✅ Public-facing documentation site (dialtone.dialpad.com)
- ✅ Component documentation pages
- ✅ Design guidelines and best practices
- ✅ Technical content meant to be cited by ChatGPT, Perplexity, etc.
- ✅ Blog posts, tutorials, and educational content

**Do NOT apply to:**
- ❌ Internal `docs/` directory documentation (use internal standards above)
- ❌ Private repository documentation
- ❌ Internal technical specs
- ❌ Planning and process documents

---

### Core GEO Principles

#### 1. Citations & Authority

**What:** Link to credible sources (.edu, .gov, peer-reviewed research, established industry publications)

**Why:** AI engines prioritize content that demonstrates research rigor and factual grounding. Content with citations gets cited more frequently.

**Example:**
```markdown
According to [Google's Web Fundamentals](https://developers.google.com/web/fundamentals/),
Core Web Vitals measure user experience through LCP, FID, and CLS metrics.

Based on [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/), interactive
elements must have a minimum touch target size of 24x24 CSS pixels.
```

**How to apply:**
- Link to W3C standards for web technologies
- Reference WCAG guidelines for accessibility
- Cite official Vue.js, CSS, and JavaScript documentation
- Link to peer-reviewed research for design claims
- Reference MDN Web Docs for web platform features

---

#### 2. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

**What:** Demonstrate expertise through author bios, consistent updates, and transparent sourcing

**Why:** AI engines evaluate content quality using E-E-A-T signals from SEO

**Example:**
```markdown
**Author:** Dialtone Team, Dialpad Design Systems (5+ years maintaining design system)
**Last Updated:** January 2026
**Version:** 9.157.0
**Sources:** Based on [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/)
and [Material Design Accessibility](https://m3.material.io/foundations/accessibility)
```

**How to apply:**
- Include "Dialtone Team" as collective author
- Add "Last Updated" dates to all public docs
- Link version numbers to changelog
- Cite authoritative sources (W3C, WCAG, official framework docs)
- Show consistent maintenance (regular updates)

---

#### 3. Fact Density

**What:** Include statistics, data points, and specific facts every 150-200 words

**Why:** Fact-dense content is perceived as more authoritative and informative

**Example:**
```markdown
Dialtone serves over 1,000 engineers across Dialpad products. The design system
includes 87 Vue components, 3,315 CSS utility classes, and 5,691 design tokens.
Components are tested against WCAG 2.2 Level AA standards with 100% coverage.

In production, Dialtone components are used in over 500 features across 4 major
products, serving 2 million users monthly.
```

**How to apply:**
- Include component counts (87 Vue components)
- Reference utility class counts (3,315 classes)
- Cite design token counts (5,691 tokens)
- Show adoption metrics when available
- Include version numbers and release cadence
- Reference test coverage percentages

---

#### 4. Direct Answers

**What:** Provide clear, concise answers in the first 40-60 words

**Why:** AI engines extract direct answers to include in generated responses

**Example:**
```markdown
## What is a Design Token?

Design tokens are design decisions stored as data (JSON, YAML) that define
visual properties like colors, spacing, and typography. They enable consistent
design across platforms by providing a single source of truth for design values.

Dialtone uses design tokens built with Style Dictionary, generating CSS variables,
JavaScript objects, and platform-specific formats from a central JSON source.
```

**How to apply:**
- Lead with direct definition (first 40-60 words)
- Follow with technical details
- Include code examples after the answer
- Use question headings (## What is...? ## How do I...?)

---

#### 5. Schema Markup

**What:** Implement structured data using JSON-LD or Schema.org vocabulary

**Why:** Helps AI engines parse and understand content structure

**Example:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Button Component - Dialtone Design System",
  "description": "Vue 3 button component with accessibility built-in",
  "author": {
    "@type": "Organization",
    "name": "Dialtone Team",
    "url": "https://dialtone.dialpad.com"
  },
  "datePublished": "2024-01-15",
  "dateModified": "2026-01-15",
  "publisher": {
    "@type": "Organization",
    "name": "Dialpad",
    "url": "https://dialpad.com"
  },
  "about": {
    "@type": "SoftwareSourceCode",
    "name": "@dialpad/dialtone-vue",
    "programmingLanguage": "Vue"
  }
}
</script>
```

**How to apply in VuePress:**
- Add schema markup to frontmatter or page components
- Use TechArticle type for component documentation
- Use SoftwareSourceCode for code examples
- Include datePublished and dateModified
- Reference organization (Dialpad/Dialtone Team)

---

#### 6. Semantic Coverage

**What:** Comprehensively cover topics with related concepts, FAQs, and examples

**Why:** AI engines favor complete, authoritative content over shallow material

**Example:** When documenting a component, include:
- ✅ Component overview and purpose
- ✅ Installation instructions
- ✅ Props/API reference (auto-generated from vue-docgen-api)
- ✅ Usage examples (multiple variants)
- ✅ Accessibility guidelines
- ✅ Common patterns and recipes
- ✅ Related components
- ✅ Migration guides (if replacing older component)
- ✅ Troubleshooting section
- ✅ FAQ section

**How to apply:**
- Use existing VuePress structure (already comprehensive)
- Ensure every component doc has all sections
- Add FAQ sections where helpful
- Include "Related Components" sections
- Cross-link between related documentation

---

### GEO Resources

**Learn more about external GEO:**
- [Frase.io: What is Generative Engine Optimization? Complete 2025 Guide](https://www.frase.io/blog/what-is-generative-engine-optimization-geo)
- [Walker Sands: Generative Engine Optimization - What to Know in 2025](https://www.walkersands.com/about/blog/generative-engine-optimization-geo-what-to-know-in-2025/)
- [Profound: 10-Step Framework for Generative Engine Optimization](https://www.tryprofound.com/guides/generative-engine-optimization-geo-guide-2025)
- [Strapi: Generative Engine Optimization Complete Guide 2025](https://strapi.io/blog/generative-engine-optimization-geo-guide)

---

## Summary

**For internal Dialtone documentation (`docs/` directory):**
- Follow the 3 core principles: Searchability, Completeness, Structure
- Optimize for AI assistants working in the repository (grep, file discovery, YAML parsing)
- Validated by automated tests
- Use Dialtone-specific package names and technical terms

**For external public documentation (dialtone.dialpad.com):**
- Apply GEO principles: Citations, E-E-A-T, Fact Density, Direct Answers, Schema, Semantic Coverage
- Optimize for external AI search engines (ChatGPT, Perplexity, Google AI)
- Measured by citation frequency and AI search visibility
- Add structured data and authoritative references

Choose the right approach based on your documentation's audience and purpose.

---

## Tools & Resources

### Writing Documentation

**Markdown Editors:**
- Use editors with YAML frontmatter support
- Enable Markdown linting (markdownlint)
- Preview while writing
- Syntax highlighting for code blocks

**Recommended VS Code Extensions:**
- **Markdown All in One** - Shortcuts, preview, TOC generation
- **markdownlint** - Style checking and formatting
- **Code Spell Checker** - Catch typos
- **YAML** - YAML syntax validation

**Validation Before Committing:**
```bash
# Run documentation tests
cd tests/docs-validation
npm test

# Check for broken links (if available)
npm run check-links

# Spell check
npm run spell-check
```

**Code Example Best Practices:**
- Test all code examples before committing
- Include necessary imports and setup
- Use realistic variable names (not `foo`, `bar`)
- Add comments for complex logic
- Show complete, working examples

### Finding Documentation (How AI Searches)

**AI assistants search documentation using:**

1. **Full-text search (grep/ripgrep):**
   ```bash
   # AI searches for actual names
   grep -r "DtButton" docs/
   grep -r "@dialpad/dialtone-vue" docs/
   grep -r "VuePress" docs/
   ```

2. **File system navigation:**
   ```bash
   # AI looks for relevant directories
   ls docs/development/
   ls docs/workflows/
   ```

3. **Keyword search in frontmatter:**
   ```bash
   # AI filters by keywords
   grep -r "keywords:.*vue-components" docs/
   grep -r "keywords:.*testing" docs/
   ```

4. **Category filtering:**
   ```bash
   # AI finds all docs of a type
   find docs/ -name "development-*.md"
   find docs/ -name "workflow-*.md"
   ```

**This is why we emphasize:**
- Actual component/package names (searchable)
- Consistent file naming (predictable paths)
- YAML frontmatter (structured metadata)
- Technical terms (what AI will grep for)

### Common Documentation Mistakes

**Mistake 1: Generic Terms**
```markdown
❌ "The button component uses our design system"
✅ "DtButton uses @dialpad/dialtone-vue with dialtone-css classes"
```

**Mistake 2: Incomplete Examples**
```markdown
❌
```vue
<DtButton>Click</DtButton>
```
(Missing imports, context, explanation)

✅
```vue
<template>
  <DtButton @click="handleSubmit" importance="primary">
    Submit Form
  </DtButton>
</template>

<script setup>
import { DtButton } from '@dialpad/dialtone-vue';

const handleSubmit = () => {
  // Handle form submission
  console.log('Form submitted');
};
</script>
```
(Complete, runnable, with context)
```

**Mistake 3: Placeholder Content**
```markdown
❌
## Testing
TODO: Add testing documentation
```

✅
## Testing
Test DtButton using Vitest and Testing Library:

```typescript
import { render, screen } from '@testing-library/vue';
import { DtButton } from '@dialpad/dialtone-vue';

describe('DtButton', () => {
  it('renders text content', () => {
    render(DtButton, {
      slots: { default: 'Click Me' }
    });
    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });
});
```
```

**Mistake 4: Broken or Missing Links**
```markdown
❌ See the [component guide](./components.md) (link doesn't exist)
❌ Related: button documentation (no link provided)

✅ See the [Component Development Guide](../development/development-component-workflow.md)
✅ Related: [DtButton Reference](../reference/reference-component-button.md)
```

---

## Templates

Use templates from `docs/templates/` directory:

- `template-architecture.md` - For system architecture docs
- `template-development.md` - For development guides
- `template-workflow.md` - For process workflows
- `template-reference.md` - For technical reference
- `template-standard.md` - For standards documents

---

## Related Documentation

- [AI Start Here](../AI_START_HERE.md) - Entry point for AI assistants
- [HOW_DOCS_WORK](../HOW_DOCS_WORK.md) - How documentation system works
- [BRAINSTORM_AI_GEO_DOCS](../BRAINSTORM_AI_GEO_DOCS.md) - Planning and decision-making

---

## Contributing

1. Choose appropriate template from `docs/templates/`
2. Fill in required frontmatter
3. Write content using actual names and technical terms
4. Run tests: `cd tests/docs-validation && npm test`
5. Fix any validation errors
6. Update relevant INDEX.md
7. Submit PR

---

**Last Updated:** February 6, 2026
**Maintainer:** Dialtone Team
