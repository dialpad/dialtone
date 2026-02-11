# Brainstorming: AI-Friendly & GEO-Optimized Documentation for Dialtone

**Date:** February 6, 2026
**Context:** Planning phase 2 - Adding test and AI context docs with geo-friendly and AI-friendly patterns

## Understanding the Two Strategies

### Internal AI Standards (For AI Assistants Working IN This Repo)

**Who:** Claude Code, GitHub Copilot, Cursor, Windsurf working on Dialtone codebase
**Goal:** Help AI understand architecture, patterns, and make correct changes
**Validated by:** Automated tests (searchability, completeness, structure)

**Based on Design Studio Pattern:**
- ✅ **Searchability** - Use actual component names, technical terms (grep-able)
- ✅ **Completeness** - Every component has documentation
- ✅ **Structure** - Standardized YAML frontmatter for AI parsing

### External GEO (For Public Documentation Site)

**Who:** ChatGPT, Perplexity, Google AI Overviews discovering dialtone.dialpad.com
**Goal:** Get Dialtone cited when developers ask AI about design systems
**Measured by:** Citation frequency in AI responses

**GEO Principles:**
- 📚 **Citations** - Link to authoritative sources (.edu, .gov, peer-reviewed)
- 🏆 **E-E-A-T** - Demonstrate expertise, authoritativeness, trustworthiness
- 📊 **Fact Density** - Statistics every 150-200 words
- 🎯 **Direct Answers** - Clear answers in first 40-60 words
- 🔖 **Schema Markup** - Structured data (JSON-LD)
- 📖 **Semantic Coverage** - Comprehensive topic coverage

## Critical Questions to Resolve

### 1. Where Do These Strategies Apply in Dialtone?

| Location | Audience | Strategy | Rationale |
|----------|----------|----------|-----------|
| `docs/` (root AI context) | **Internal AI** | AI Standards | AI assistants working on code |
| `apps/dialtone-documentation/docs/` | **External humans + GEO** | GEO Principles | Public site indexed by AI search |
| Package READMEs | **External developers** | GEO Principles | NPM documentation |
| `.claude/` | **Claude Code only** | AI Standards | Claude-specific configuration |
| Storybook | **Designers + GEO** | Hybrid | Component playground + discoverability |

**Recommendation:**
- ✅ **Root `docs/` = Internal AI Standards** (for repository contributors)
- ✅ **Public docs site = GEO Principles** (for external discovery)
- ✅ **MCP Server = Internal AI Standards** (searchability for AI tools)

### 2. Should We Apply GEO to Component Documentation Pages?

**Current State:**
```
apps/dialtone-documentation/docs/components/button.md
```

**Options:**

**A) Full GEO Treatment (Recommended)**
- Add citations to accessibility standards (WCAG, ARIA)
- Include usage statistics ("Used in 500+ Dialpad interfaces")
- Add author/reviewer info
- Implement Schema.org TechArticle markup
- Add direct answer sections
- Link to research papers on button accessibility

**B) Light GEO (Minimal)**
- Just add schema markup
- Keep existing content structure
- Add ai_summary to frontmatter

**C) No GEO (Not Recommended)**
- Risk: Dialtone won't be discovered by AI search
- Competitors with better GEO will be cited instead

**Recommendation:** **Option A** - Full GEO treatment for competitive advantage

### 3. How Do We Structure Root-Level AI Context Docs?

**Design Studio Pattern:**
```
docs/
├── ai-start-here.md           ← Entry point
├── technical/                 ← Build system, architecture
├── workflows/                 ← GitHub Actions, deployment
├── reference/                 ← API specs, patterns
├── guides/                    ← How-to guides
└── standards/                 ← Documentation standards
```

**Adapted for Dialtone Monorepo:**
```
docs/
├── AI_START_HERE.md           ← Entry point for AI assistants
├── architecture/
│   ├── MONOREPO_STRUCTURE.md      ← Workspace layout, NX, pnpm
│   ├── BUILD_SYSTEM.md            ← How builds work
│   ├── PACKAGE_DEPENDENCIES.md    ← Dependency graph
│   └── DOCUMENTATION_SYSTEM.md    ← How docs are generated
├── development/
│   ├── COMPONENT_DEVELOPMENT.md   ← Creating Vue components
│   ├── CSS_DEVELOPMENT.md         ← CSS utility patterns
│   ├── TOKEN_DEVELOPMENT.md       ← Design token workflow
│   ├── ICON_DEVELOPMENT.md        ← Icon creation/updates
│   └── TESTING_GUIDELINES.md      ← Test patterns
├── workflows/
│   ├── RELEASE_PROCESS.md         ← Semantic release workflow
│   ├── PR_WORKFLOW.md             ← Pull request standards
│   ├── DEPLOYMENT.md              ← GitHub Actions, publishing
│   └── LOCAL_DEVELOPMENT.md       ← Dev environment setup
├── reference/
│   ├── DIALTONE_CSS_PATTERNS.md   ← CSS architecture
│   ├── VUE_PATTERNS.md            ← Vue component patterns
│   ├── STORYBOOK_CONVENTIONS.md   ← Story writing
│   └── ACCESSIBILITY_STANDARDS.md ← A11y requirements
└── standards/
    ├── AI_DOCUMENTATION_STANDARDS.md  ← This doc explains approach
    ├── CODE_STANDARDS.md              ← Coding conventions
    └── TESTING_STANDARDS.md           ← Test requirements
```

## Proposed Approach: Two-Track Documentation

### Track 1: Internal AI Context (Root `docs/`)

**Target:** AI assistants working on Dialtone codebase
**Strategy:** Searchability, Completeness, Structure
**Validation:** Automated tests

**Implementation:**

1. **Create Root AI Context Structure**
   ```bash
   mkdir -p docs/{architecture,development,workflows,reference,standards}
   ```

2. **Required Frontmatter for ALL docs:**
   ```yaml
   ---
   type: architecture | development | workflow | reference | standard
   category: [same as type]
   keywords: [min 3 searchable terms]
   ai_summary: [≤150 chars description]
   last_updated: YYYY-MM-DD
   ---
   ```

3. **Searchability Requirements:**
   - Use actual component names: `DtButton`, `DtModal`, not "button component"
   - Use technical terms: `vue-docgen-api`, `VuePress 2.0`, `pnpm workspace`
   - Use package names: `@dialpad/dialtone-vue`, `dialtone-css`
   - Make content grep-able by AI tools

4. **Completeness Requirements:**
   - Every package has AI context doc in `packages/[name]/.ai/PACKAGE_CONTEXT.md`
   - Every major system (build, release, docs generation) has a doc
   - Every workflow (PR, release, deployment) has a doc

5. **Structure Requirements:**
   - All docs have YAML frontmatter
   - Cross-references use relative paths
   - INDEX.md files in each directory
   - Breadcrumb navigation

### Track 2: External GEO (Public Docs Site)

**Target:** Developers searching via ChatGPT, Perplexity, Google AI
**Strategy:** Citations, E-E-A-T, Fact Density, Direct Answers, Schema, Semantic Coverage
**Validation:** Manual audits, citation monitoring

**Implementation:**

1. **Enhance Component Documentation** (`apps/dialtone-documentation/docs/components/*.md`)

   **Add to frontmatter:**
   ```yaml
   ---
   title: Button
   description: ...
   author: Brad Paugh, Senior Design Systems Engineer
   contributors: [Francis Rupert, Ignacio Ropolo]
   last_updated: 2026-02-06
   schema_type: TechArticle
   citations:
     - wcag: https://www.w3.org/WAI/WCAG22/Understanding/button
     - aria: https://www.w3.org/WAI/ARIA/apg/patterns/button/
   ---
   ```

   **Add sections:**
   - **Direct Answer Block** (first 40-60 words):
     ```markdown
     A button is an interactive UI element that triggers an action when activated.
     Dialtone provides the DtButton component with built-in accessibility,
     consistent styling across 5 importance levels, and support for icons,
     loading states, and custom sizes.
     ```

   - **Statistics Section:**
     ```markdown
     ## Usage Statistics
     - Used in 500+ Dialpad interfaces
     - 95% WCAG 2.2 AAA compliance
     - Average implementation time: 5 minutes
     - Reduces custom button code by 80%
     ```

   - **Citations:**
     ```markdown
     ## Standards & Research
     - Follows [WCAG 2.2 Button Guidelines](https://www.w3.org/WAI/WCAG22/)
     - Implements [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
     - Based on [Nielsen Norman Group Button Research](https://www.nngroup.com/articles/ok-cancel-or-cancel-ok/)
     ```

2. **Add Schema Markup** to VuePress Theme

   Create: `apps/dialtone-documentation/docs/.vuepress/theme/layouts/ComponentLayout.vue`
   ```vue
   <template>
     <div>
       <!-- Existing content -->
       <SchemaMarkup :frontmatter="$frontmatter" />
     </div>
   </template>
   ```

   Create: `apps/dialtone-documentation/docs/.vuepress/baseComponents/SchemaMarkup.vue`
   ```vue
   <script setup>
   import { computed } from 'vue';

   const props = defineProps(['frontmatter']);

   const schema = computed(() => ({
     "@context": "https://schema.org",
     "@type": "TechArticle",
     "headline": props.frontmatter.title,
     "description": props.frontmatter.description,
     "author": {
       "@type": "Person",
       "name": props.frontmatter.author || "Dialtone Team"
     },
     "datePublished": props.frontmatter.created_date,
     "dateModified": props.frontmatter.last_updated,
     "publisher": {
       "@type": "Organization",
       "name": "Dialpad",
       "url": "https://dialpad.com"
     }
   }));
   </script>

   <template>
     <script type="application/ld+json">
       {{ JSON.stringify(schema, null, 2) }}
     </script>
   </template>
   ```

3. **Enhance Design Guidelines** (`apps/dialtone-documentation/docs/design/`)

   Add research citations:
   - Color accessibility: Link to WCAG contrast guidelines
   - Typography: Link to typography research
   - Icons: Link to icon comprehension studies
   - Motion: Link to animation UX research

4. **Add FAQ Sections**

   Each major topic should have FAQ with direct answers:
   ```markdown
   ## Frequently Asked Questions

   ### What is Dialtone?
   Dialtone is Dialpad's design system, providing Vue components, CSS utilities,
   and design tokens for building consistent interfaces across all Dialpad products.

   ### How do I install Dialtone?
   Install via npm: `npm install @dialpad/dialtone`. Import CSS and components
   as documented in the [Getting Started guide](link).
   ```

## Test Suite Design

### Internal AI Standards Tests

**Location:** `tests/docs-validation/`

**Test Files:**

1. **`specs/01-searchability.spec.js`**
   ```javascript
   describe('AI Documentation: Searchability', () => {
     test('docs use actual component names', () => {
       const results = grepDocs('DtButton', 'docs/');
       expect(results.length).toBeGreaterThan(0);
     });

     test('docs use technical terms', () => {
       const terms = ['vue-docgen-api', 'VuePress', 'pnpm workspace', 'NX'];
       terms.forEach(term => {
         const results = grepDocs(term, 'docs/');
         expect(results.length).toBeGreaterThan(0);
       });
     });
   });
   ```

2. **`specs/02-completeness.spec.js`**
   ```javascript
   describe('AI Documentation: Completeness', () => {
     test('every package has AI context doc', () => {
       const packages = glob.sync('packages/*/package.json');
       packages.forEach(pkgPath => {
         const pkgName = path.dirname(pkgPath).split('/').pop();
         const aiContextPath = `packages/${pkgName}/.ai/PACKAGE_CONTEXT.md`;
         expect(fs.existsSync(aiContextPath)).toBe(true);
       });
     });

     test('all major systems have documentation', () => {
       const requiredDocs = [
         'docs/architecture/BUILD_SYSTEM.md',
         'docs/workflows/RELEASE_PROCESS.md',
         'docs/development/COMPONENT_DEVELOPMENT.md'
       ];
       requiredDocs.forEach(doc => {
         expect(fs.existsSync(doc)).toBe(true);
       });
     });
   });
   ```

3. **`specs/03-structure.spec.js`**
   ```javascript
   describe('AI Documentation: Structure', () => {
     const allDocs = getAllDocs('docs/');

     test('all docs have YAML frontmatter', () => {
       allDocs.forEach(file => {
         expect(hasFrontmatter(file)).toBe(true);
       });
     });

     test('all docs have required fields', () => {
       const required = ['type', 'category', 'keywords', 'ai_summary'];
       allDocs.forEach(file => {
         const fm = parseFrontmatter(file);
         required.forEach(field => {
           expect(fm).toHaveProperty(field);
         });
       });
     });

     test('keywords are arrays with min 3 items', () => {
       allDocs.forEach(file => {
         const { keywords } = parseFrontmatter(file);
         expect(Array.isArray(keywords)).toBe(true);
         expect(keywords.length).toBeGreaterThanOrEqual(3);
       });
     });
   });
   ```

### GEO Quality Tests (Manual Audits)

**Location:** `tests/geo-validation/`

**Checklist for Component Docs:**

```markdown
## GEO Quality Checklist - [Component Name]

### Citations & Authority
- [ ] Links to WCAG guidelines
- [ ] Links to WAI-ARIA patterns
- [ ] Links to design/UX research (Nielsen Norman, etc.)
- [ ] At least 2 authoritative sources cited

### E-E-A-T
- [ ] Author name in frontmatter
- [ ] Contributors listed
- [ ] Last updated date
- [ ] Clear expertise demonstration

### Fact Density
- [ ] Usage statistics included
- [ ] Performance metrics provided
- [ ] Adoption data mentioned
- [ ] At least 1 fact per 150-200 words

### Direct Answers
- [ ] Clear answer in first 40-60 words
- [ ] "What is X?" section with concise definition
- [ ] FAQ section with direct answers

### Schema Markup
- [ ] JSON-LD script tag present
- [ ] TechArticle schema type
- [ ] Author, datePublished, dateModified fields
- [ ] Validates on Schema.org validator

### Semantic Coverage
- [ ] API reference complete
- [ ] Multiple usage examples
- [ ] Common patterns documented
- [ ] Accessibility guidelines
- [ ] Related components linked
- [ ] Migration guides (if applicable)
```

## Phased Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Deliverables:**
1. Create root `docs/` structure
2. Write AI_START_HERE.md
3. Set up test infrastructure
4. Create documentation templates
5. Write standards documents

**Files to Create:**
- `docs/AI_START_HERE.md`
- `docs/standards/AI_DOCUMENTATION_STANDARDS.md`
- `docs/standards/GEO_STANDARDS.md`
- `tests/docs-validation/package.json`
- `tests/docs-validation/vitest.config.js`
- Templates for each doc type

### Phase 2: Internal AI Context (Week 3-4)

**Deliverables:**
1. Architecture docs (5 files)
2. Development docs (5 files)
3. Workflow docs (4 files)
4. Reference docs (4 files)
5. Package-level AI context (one per package)

**Validation:** Run internal AI standards tests, ensure 100% pass rate

### Phase 3: GEO Enhancement (Week 5-6)

**Deliverables:**
1. Enhanced component docs with GEO (10 priority components)
2. Schema markup implementation
3. Design guidelines with citations
4. FAQ sections
5. Statistics and facts

**Validation:** Manual GEO quality audits, test AI search visibility

### Phase 4: Remaining Components (Week 7-8)

**Deliverables:**
1. Apply GEO to all remaining components (47 more)
2. Enhance utility docs
3. Enhance token docs
4. Complete coverage

**Validation:** Final test suite, citation monitoring setup

## Open Questions & Decisions Needed

### 1. Authorship
**Q:** Who should be listed as authors on component docs?
**Options:**
- A) Original component creator
- B) Design systems team collectively
- C) Specific maintainers per component
- D) Organization name only

**Recommendation:** C) Specific maintainers - better for E-E-A-T

### 2. Statistics Collection
**Q:** How do we gather usage statistics for "Used in 500+ interfaces"?
**Options:**
- A) Manual surveys of product teams
- B) Automated telemetry (if exists)
- C) Estimate based on known products
- D) Skip statistics initially

**Recommendation:** C) Start with estimates, improve over time

### 3. Schema Markup Location
**Q:** Should schema be in each MD file or injected by theme?
**Options:**
- A) In frontmatter, theme generates JSON-LD
- B) In custom `<script>` blocks in MD
- C) Separate JSON files

**Recommendation:** A) Frontmatter approach - easier to maintain

### 4. Test Automation
**Q:** Should GEO tests be automated or remain manual?
**Options:**
- A) Fully automated (strict enforcement)
- B) Mix of automated checks + manual audits
- C) Purely manual (flexible)

**Recommendation:** B) Hybrid approach - automate structure, manual for quality

### 5. MCP Server Integration
**Q:** Should MCP server also search AI context docs?
**Current:** Searches utility classes, tokens, components, icons
**Proposal:** Add 5th search: General documentation search

**Recommendation:** YES - Add as separate tool in MCP server

## Success Metrics

### Internal AI Standards
- [ ] 100% docs have required frontmatter
- [ ] 100% packages have AI context
- [ ] 100% test pass rate
- [ ] AI assistants can find relevant docs in <5 searches

### External GEO
- [ ] Dialtone cited in ChatGPT responses (manual testing)
- [ ] Increased organic traffic from AI search
- [ ] Schema markup validates 100%
- [ ] All priority components have citations

## Related Resources

**Internal Standards:**
- Design Studio: `/Users/belumontoya/Desktop/design-studio/docs/standards/standard-ai-documentation.md`
- Design Studio Tests: `/Users/belumontoya/Desktop/design-studio/tests/docs-validation/`

**External GEO Research:**
- [Digital Applied: GEO Guide 2026](https://www.digitalapplied.com/blog/geo-guide-generative-engine-optimization-2026)
- [Discovered Labs: What is GEO?](https://discoveredlabs.com/blog/what-is-geo-generative-engine-optimization-explained-2026)
- [Ladybugz: SEO vs AEO vs GEO Guide](https://www.ladybugz.com/seo-aeo-geo-guide-2026/)
- [Medium: When design system documentation becomes AI-readable](https://medium.com/design-bootcamp/when-design-system-documentation-becomes-ai-readable-14f7a3180233)
- [Medium: How to build an AI design system with MCP](https://medium.com/design-bootcamp/how-to-build-an-ai-design-system-6d80d7aa200d)

## Next Steps

1. **Review this brainstorm with team**
2. **Make decisions on open questions**
3. **Create detailed implementation plan for Phase 1**
4. **Set up branch: `docs/ai-geo-implementation`**
5. **Begin Phase 1 development**

---

**Key Takeaway:** Dialtone needs BOTH internal AI standards (for contributors) AND external GEO (for discovery). They serve different audiences with different optimization strategies.
