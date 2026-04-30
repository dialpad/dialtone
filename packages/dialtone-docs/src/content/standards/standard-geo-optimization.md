---
type: standard
category: standards
keywords: [geo, generative-engine-optimization, seo, citations, schema-markup, e-e-a-t, external-documentation, dialtone-documentation, llms-txt, content-freshness]
ai_summary: GEO principles for optimizing Dialtone's public documentation to be cited by external AI search engines like ChatGPT and Perplexity.
last_updated: 2026-04-27
last_verified: 2026-04-27
---

# External GEO (Generative Engine Optimization)

> **Principles for optimizing public-facing Dialtone documentation for external AI search engines**

**GEO** (Generative Engine Optimization) is the practice of optimizing content for external AI-powered search engines (ChatGPT, Perplexity, Google AI Overviews) to cite your content in generated responses.

**Key difference from internal AI standards:**
- **Internal AI Standards** (`standard-ai-documentation.md`): For AI assistants working in this repository
- **External GEO** (this file): For public-facing documentation meant to be discovered by external AI search

> **Platforms differ.** ChatGPT and Perplexity share only ~11% of cited domains — they pick sources via different signals. ChatGPT leans on training-baked brand entity strength and Wikipedia (~48% of its top cites). Perplexity favors community sources (90%+ of answers) and easily-extractable pages. The principles in this standard are general; platform-specific tactics change too fast to embed here. See the [Averi B2B SaaS Citation Benchmarks Report 2026](https://www.averi.ai/how-to/chatgpt-vs.-perplexity-vs.-google-ai-mode-the-b2b-saas-citation-benchmarks-report-(2026)) for current per-platform data.

---

## When to Apply

Apply GEO principles to:
- Public-facing documentation site (dialtone.dialpad.com)
- Component documentation pages
- Design guidelines and best practices
- Technical content meant to be cited by ChatGPT, Perplexity, etc.
- Blog posts, tutorials, and educational content

**Do NOT apply to:**
- Internal `docs/` directory documentation (use internal standards)
- Private repository documentation
- Internal technical specs
- Planning and process documents

---

## Core GEO Principles

### 1. Citations & Authority

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

### 2. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

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

### 3. Fact Density

**What:** Include statistics, data points, and specific facts every 150-200 words

**Why:** Fact-dense content is perceived as more authoritative and informative

**How to apply:**
- Include component counts (58 Vue components)
- Reference utility class counts (3,336 classes)
- Cite design token counts (6,019 tokens)
- Show adoption metrics when available
- Include version numbers and release cadence
- Reference test coverage percentages

---

### 4. Direct Answers

**What:** Provide clear, concise answers in the first 40-60 words

**Why:** AI engines extract direct answers to include in generated responses

**How to apply:**
- Lead with direct definition (first 40-60 words)
- Follow with technical details
- Include code examples after the answer
- Use question headings (## What is...? ## How do I...?)

---

### 5. Schema Markup

**What:** Implement structured data using JSON-LD or Schema.org vocabulary

**Why:** Helps AI engines parse and understand content structure

**Example for VuePress component pages:**
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

Bump `dateModified` only on substantive content updates — not on formatting, typo fixes, or `last_verified` bumps that don't change reader-facing content. AI engines detect date manipulation ([Search Engine Land, byline dates guide](https://searchengineland.com/guide/byline-dates)).

---

### 6. Semantic Coverage

**What:** Comprehensively cover topics with related concepts, FAQs, and examples

**Why:** AI engines favor complete, authoritative content over shallow material

When documenting a component, include:
- Component overview and purpose
- Installation instructions
- Props/API reference (auto-generated from vue-docgen-api)
- Usage examples (multiple variants)
- Accessibility guidelines
- Common patterns and recipes
- Related components
- Migration guides (if replacing older component)
- Troubleshooting and FAQ sections

---

## 7. llms.txt and llms-full.txt

**What:** Publish a machine-readable site index at `/llms.txt` (curated table of contents) and `/llms-full.txt` (full content dump) at the site root.

**Why:** AI tools increasingly use `llms.txt` as a discovery endpoint before crawling. Navigation tools (Claude, ChatGPT) fetch the lite version to understand site structure; coding tools (Cursor, GitHub Copilot) fetch the full version for context-window-friendly ingestion. `dialtone.dialpad.com` publishes both via `@vuepress/plugin-llms`.

**llms.txt vs llms-full.txt:**

| File | Size | Who uses it | Content |
|------|------|-------------|---------|
| `/llms.txt` | Small | Navigation tools, general AI assistants | Curated table of contents — project title, description, and one-line per page with URL |
| `/llms-full.txt` | Large | Coding tools needing full context | Full prose content of curated pages, token-friendly |

**How to apply:**
- Curate `/llms.txt` to include: foundations, section indexes, key guides. Exclude changelogs and deep auto-generated API tables (those are discoverable from the indexes).
- Update the curation list when major new sections are added to the site.
- `llms.txt` complements `sitemap.xml` — sitemap tells crawlers everything exists; `llms.txt` tells AI tools what's worth reading first.
- Reference: [llmstxt.org](https://llmstxt.org/)

---

## 8. Content Freshness

**What:** Keep documentation verifiably current — not just edited, but re-read and confirmed.

**Why:** AI citations decay in approximately 13 weeks ([Markterior GEO 2026](https://www.markterior.com/generative-engine-optimization-geo-2026/)). 76.4% of ChatGPT's top-cited pages were updated within the last 30 days ([Quattr, content freshness research](https://www.quattr.com/blog/content-freshness)). Stale docs lose citation share regardless of their original quality.

**The `last_verified` field:** Each standards document carries a `last_verified` date in its frontmatter (distinct from `last_updated`):

- `last_updated` = "the file was edited" (can be a typo fix)
- `last_verified` = "a human re-read this and confirmed it is still accurate"

Bump `last_verified` only after substantive review. Never bump it as housekeeping. Per [John Mueller / Search Engine Land](https://searchengineland.com/guide/byline-dates): "Changing dates without doing anything else is just noise and useless for rankings or citations."

**Cadence:** Re-verify standards every 90 days. This aligns with the 13-week citation decay window — quarterly review keeps content within the active citation range.

**Automation:** A GitHub Actions workflow (`standards-freshness.yml`) posts a PR comment listing any standard with `last_verified` older than 90 days when a PR touches the `packages/dialtone-docs/src/content/standards/` directory. Non-blocking — it surfaces drift without gatekeeping merges.

---

## GEO Resources

### 2025 foundations

- [Frase.io: What is Generative Engine Optimization? Complete 2025 Guide](https://www.frase.io/blog/what-is-generative-engine-optimization-geo)
- [Walker Sands: Generative Engine Optimization - What to Know in 2025](https://www.walkersands.com/about/blog/generative-engine-optimization-geo-what-to-know-in-2025/)
- [Profound: 10-Step Framework for Generative Engine Optimization](https://www.tryprofound.com/guides/generative-engine-optimization-geo-guide-2025)
- [Strapi: Generative Engine Optimization Complete Guide 2025](https://strapi.io/blog/generative-engine-optimization-geo-guide)

### 2026 updates

- [State of llms.txt 2026 — aeo.press](https://www.aeo.press/ai/the-state-of-llms-txt-in-2026)
- [Do You Need Both llms.txt and llms-full.txt?](https://llms-txt.io/blog/llms-txt-and-llms-full-txt)
- [GEO 2026 best practices — GenOptima](https://www.gen-optima.com/geo/generative-engine-optimization-best-practices-2026/)
- [GEO: Definitive Guide 2026 — Geoptie](https://geoptie.com/blog/generative-engine-optimization)
- [Content freshness and AI citations — Quattr](https://www.quattr.com/blog/content-freshness)
- [AI platform citation patterns — Profound](https://www.tryprofound.com/blog/ai-platform-citation-patterns)
- [ChatGPT vs Perplexity vs Google AI Mode: B2B SaaS citation benchmarks 2026 — Averi](https://www.averi.ai/how-to/chatgpt-vs.-perplexity-vs.-google-ai-mode-the-b2b-saas-citation-benchmarks-report-(2026))
