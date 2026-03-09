---
type: standard
category: standards
keywords: [geo, generative-engine-optimization, seo, citations, schema-markup, e-e-a-t, external-documentation, dialtone-documentation]
ai_summary: GEO principles for optimizing Dialtone's public documentation to be cited by external AI search engines like ChatGPT and Perplexity.
last_updated: 2026-03-09
---

# External GEO (Generative Engine Optimization)

> **Principles for optimizing public-facing Dialtone documentation for external AI search engines**

**GEO** (Generative Engine Optimization) is the practice of optimizing content for external AI-powered search engines (ChatGPT, Perplexity, Google AI Overviews) to cite your content in generated responses.

**Key difference from internal AI standards:**
- **Internal AI Standards** (`standard-ai-documentation.md`): For AI assistants working in this repository
- **External GEO** (this file): For public-facing documentation meant to be discovered by external AI search

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
- Include component counts (87 Vue components)
- Reference utility class counts (3,315 classes)
- Cite design token counts (5,691 tokens)
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

## GEO Resources

- [Frase.io: What is Generative Engine Optimization? Complete 2025 Guide](https://www.frase.io/blog/what-is-generative-engine-optimization-geo)
- [Walker Sands: Generative Engine Optimization - What to Know in 2025](https://www.walkersands.com/about/blog/generative-engine-optimization-geo-what-to-know-in-2025/)
- [Profound: 10-Step Framework for Generative Engine Optimization](https://www.tryprofound.com/guides/generative-engine-optimization-geo-guide-2025)
- [Strapi: Generative Engine Optimization Complete Guide 2025](https://strapi.io/blog/generative-engine-optimization-geo-guide)
