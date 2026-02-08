# AI Discoverability — Raw Markdown to MCP Server Pipeline

## Overview

**Status:** In Progress (Phase 1 complete, Phase 2 planned)
**Created:** 2025-01-15
**Last Updated:** 2026-02-07

Extend the Dialtone MCP server to serve documentation content — usage guidance, writing rules, variant explanations, code examples, and design foundations — that the current JSON-only tools cannot provide. The raw markdown pipeline (Phase 1) produces the content; Phase 2 wires it into the existing MCP server as searchable, fetchable tools.

## Goals

- Give AI assistants access to the "how and when" of Dialtone, not just the "what"
- Serve documentation through MCP tools that the LLM can invoke autonomously
- Keep the existing search tools (utility classes, tokens, components, icons) unchanged

## Non-Goals

- Replacing the existing JSON-based MCP tools (they serve structured API data well)
- Semantic/vector search or embeddings (full-text keyword search is sufficient for 208 files)
- Serving docs as MCP resources (clients don't auto-read resources; tools are the working mechanism)
- Native llms.txt consumption by LLM providers (no provider has confirmed this)

## Success Criteria

- AI assistant can answer "when should I use a danger button?" (not possible today)
- AI assistant can answer "what's the voice and tone for error messages?" (not possible today)
- AI assistant can retrieve any of the 208 doc pages through a tool call
- Existing MCP server tests continue to pass
- No additional runtime network dependency (docs bundled at build time)

## Constraints & Guardrails

**Technical Constraints:**

- Raw markdown corpus is ~1.8MB / ~500K tokens — cannot load into context at once
- Claude Code tool output limit is 25K tokens per call (configurable via `MAX_MCP_OUTPUT_TOKENS`)
- Individual doc pages range from ~500 to ~15K tokens — most fit in a single tool response
- MCP server must remain a single self-contained CLI package (`dialtone-mcp-server`)

**Business Constraints:**

- Must not break existing MCP server consumers
- Markdown content regenerates on every docs build — bundling must use the latest output

**Key Risks:**

- Large doc pages exceeding tool output limits: Mitigate by truncating with a "continued" indicator and offset parameter
- Stale bundled docs after design system updates: Mitigate by tying the bundle step to the existing NX build pipeline

## Background: What Exists Today

### Phase 1: Raw Markdown Pipeline (Complete)

A build-time script (`scripts/generate-raw-markdown.mjs`) transforms 208 VuePress source files — which mix Vue components, HTML tables, and frontmatter — into clean GFM markdown. Output:

| Artifact | Location | Size | Purpose |
| --- | --- | --- | --- |
| 208 `.md` files | `docs/.vuepress/public/md/{section}/` | 1.8MB total | Individual doc pages, portable and AI-readable |
| `llms.txt` | `docs/.vuepress/public/llms.txt` | 285 lines | Structured index with titles, URLs, and one-line descriptions |
| `llms-full.txt` | `docs/.vuepress/public/llms-full.txt` | ~29K lines | Full concatenation of all pages (for manual context injection) |

Sections covered: components (56), utilities (78), foundations (24), dialtone (25), guides (16), tokens (3), ui-kits (4), plus index and status pages.

### Current MCP Server (`@dialpad/dialtone-mcp-server` v1.2.1)

Four search tools backed by JSON data sources:

| Tool | Data Source | What it knows |
| --- | --- | --- |
| `search_utility_classes` | `dialtone-docs.json` | Class names and CSS property/value outputs |
| `search_tokens` | `tokens-docs.json` | Token names and values across themes |
| `search_components` | `component-documentation.json` | Vue prop names, types, defaults, slots, events |
| `search_icons` | `keywords-icons.json` | Icon names and keyword tags |

Five MCP resources (utility classes, tokens, components, icons, client rules) are registered but rarely used — Claude Desktop never auto-reads resources, and Claude Code requires explicit `@` mentions.

### The Gap

The MCP server knows that `DtButton` has a `kind` prop of type `string`. It does not know:

- When to use a danger button vs. a positive button
- That button labels should "lead with a strong verb and use verb + noun structure"
- That there are five `kind` options with three levels of `importance`
- How to compose a button with an icon
- Voice and tone guidelines for writing UI text
- Spacing conventions for card layouts
- Accessibility guidance for any component

This is the gap between API reference and usage guidance. The raw markdown contains all of it.

### How MCP Documentation Tools Actually Work (Research Findings)

MCP tools (not resources) are the proven mechanism for serving documentation. The LLM autonomously invokes tools; resources require manual user attachment. Production MCP servers serving markdown documentation (LangChain's `mcpdoc`, `library-mcp`, `docs-mcp-server`, `MCPDocSearch`) all follow the same pattern:

1. **Index tool** — returns a compact list of available pages with descriptions
2. **Search tool** — keyword search, returns ranked matches with snippets
3. **Fetch tool** — returns full content of a single page on demand

The `llms.txt` file already serves as the index. Each raw markdown file is a self-contained page ready to serve. This is not a novel architecture — it is the standard approach.

## Implementation Steps

### Phase 2: Documentation Tools in MCP Server

1. **Bundle raw markdown into the MCP server package**
   - What: Add a build step that copies the generated `md/` directory and `llms.txt` into a JSON map (`docs-corpus.json`) keyed by relative path
   - Why: The server must work offline without network access to the docs site
   - Considerations: Must run after `generate-raw-markdown.mjs` in the NX dependency graph; keep the JSON map as a build artifact, not checked into source
   - Dependencies: None (raw markdown pipeline is complete)

2. **Add `list_docs` tool**
   - What: Returns the `llms.txt` content (285 lines, ~2-3K tokens) — section headings, page titles, one-line descriptions
   - Why: Gives the LLM a compact map of all 208 pages so it can decide what to fetch
   - Considerations: Small enough to fit in a single tool response; no pagination needed

3. **Add `search_docs` tool**
   - What: Full-text keyword search across all 208 markdown files, returns top N matches with surrounding context snippets
   - Why: Lets the LLM find relevant pages without knowing exact paths
   - Considerations: Simple substring/regex matching is sufficient for 208 files; return path, title, and a ~200-word snippet per match; default limit of 10 results
   - Dependencies: Step 1 (corpus must be bundled)

4. **Add `get_doc_page` tool**
   - What: Returns the full markdown content of a single page by path (e.g., `components/button.md`)
   - Why: Lets the LLM read complete usage guidance, examples, and variant documentation
   - Considerations: Most pages are well under 25K tokens; for oversized pages, truncate with a note and support an `offset` parameter for continuation
   - Dependencies: Step 1 (corpus must be bundled)

5. **Register tools with descriptive schemas**
   - What: Add tool definitions to the server's `ListToolsRequestSchema` handler with clear descriptions that help the LLM route queries correctly
   - Why: Tool descriptions are how the LLM decides which tool to call; poor descriptions mean the tools won't get used
   - Considerations: Distinguish from existing tools — e.g., `search_docs` is for usage guidance and design patterns, `search_components` is for API details (props/slots/events)

6. **Update client-rules.json**
   - What: Add guidance telling the AI when to use doc tools vs. existing search tools
   - Why: Without routing guidance, the LLM may call the wrong tool
   - Considerations: Example rule: "For how/when/why questions, use `search_docs` or `get_doc_page`; for what-is-the-prop-name questions, use `search_components`"

7. **Add tests for new tools**
   - What: Add test cases to the existing test suite (currently 77 tests) covering search, fetch, edge cases (missing page, empty query, large page truncation)
   - Dependencies: Steps 2-4

8. **Wire into NX build pipeline**
   - What: Add the corpus bundling step as a dependency of the MCP server's build target in `project.json`
   - Why: Ensures `npm run build` for the MCP server always picks up the latest docs
   - Considerations: The docs app's `generate-raw-markdown` must run before the MCP server's bundle step
   - Dependencies: Step 1

9. **Update MCP server documentation**
   - What: Update `packages/dialtone-mcp-server/README.md` with new tool descriptions and examples; fill in the placeholder guide at `docs/guides/mcp-server/index.md`
   - Dependencies: Steps 2-6

## Phase Completion Summaries

### Phase 1 Complete (2026-02-07)

**Completed:**

- Raw markdown generation pipeline (`scripts/generate-raw-markdown.mjs` + 14 lib modules)
- 208 clean GFM markdown files across 7 sections
- `llms.txt` structured index (285 lines, 207 page entries with descriptions)
- `llms-full.txt` full corpus concatenation (~29K lines)
- Integrated as pre-build step in both `build` and `start` NX targets
- "View as Markdown" action in PageHeader.vue for every doc page
- Component status page generation
- Cross-reference link rewriting (VuePress absolute paths to relative .md paths)
- Typography post-processing with data from type.json

**Modified:**

- `project.json` build targets now depend on raw markdown generation
- Reason: Ensures output is always fresh on build and dev server start

**Deviations from Plan:**

- Added `llms-full.txt` (not originally planned) for manual full-context use cases
- Added component status page generation as a bonus output
- Description extraction required iterative hardening (Vue attribute remnants, HTML tags, placeholder text)

**Blockers/Issues:**

- None

## Open Questions

- [ ] Should `search_docs` use simple substring matching or a lightweight scoring algorithm (e.g., TF-IDF)?
- [ ] Should the corpus JSON map include pre-extracted titles/descriptions, or parse them at query time?
- [ ] What is the right default result limit for `search_docs`? (10? 5?)
- [ ] Should `get_doc_page` support section-level retrieval (e.g., `components/button.md#variants`) or always return full pages?
- [ ] Version the corpus bundle separately from the MCP server, or release together?

## References

- Raw markdown pipeline: `apps/dialtone-documentation/scripts/generate-raw-markdown.mjs`
- MCP server package: `packages/dialtone-mcp-server/`
- MCP server README: `packages/dialtone-mcp-server/README.md`
- llms.txt spec: <https://llmstxt.org/>
- LangChain mcpdoc (reference implementation): <https://github.com/langchain-ai/mcpdoc>
- MCP specification (resources vs. tools): <https://modelcontextprotocol.io/specification/2025-06-18/server/resources>
