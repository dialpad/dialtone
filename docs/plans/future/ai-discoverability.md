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
- No additional runtime network dependency for documentation access (docs bundled at build time)

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

- Large doc pages exceeding tool output limits: Mitigate by returning an error with page size info for oversized pages; consider truncation only if this proves insufficient in practice
- Stale bundled docs after design system updates: Mitigate by tying the bundle step to the existing NX build pipeline
- Increased npm package size: Bundling ~1.8MB of markdown into the MCP server package will significantly increase download/install size; acceptable given the value, but worth monitoring
- Build pipeline ordering: MCP server's `project.json` currently depends on `dialtone-css:build` and `dialtone-vue:build` only — a new dependency on docs app build output must be added explicitly

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
   - What: Add a build step that generates a JSON map (`docs-corpus.json`) from the `md/` directory and `llms.txt`, keyed by relative path, with pre-extracted title and description per page
   - Why: The server must work offline without network access to the docs site
   - Approach options (decide before coding):
     - **Option A (recommended):** Build script in MCP server package generates JSON, imported via `with { type: 'json' }` like existing data sources in `data.ts`. Rollup's `@rollup/plugin-json` inlines it at build time.
     - **Option B:** Import directly from docs app package (`@dialpad/dialtone-documentation/public/md/...`). Cleaner dependency but requires cross-package import path.
     - **Option C:** Generate a `.ts` module with exported string literals. Avoids JSON parsing overhead at runtime.
   - Considerations: Must run after `generate-raw-markdown.mjs` in the NX dependency graph; keep the JSON map as a build artifact, not checked into source; `package.json` `"files": ["build"]` means output must end up in `build/`
   - Dependencies: None (raw markdown pipeline is complete)

2. **Add `list_docs` tool**
   - What: Returns the `llms.txt` content (285 lines, ~2-3K tokens) — section headings, page titles, one-line descriptions
   - Why: Gives the LLM a compact map of all 208 pages so it can decide what to fetch
   - Considerations: Small enough to fit in a single tool response; no pagination needed

3. **Add `search_docs` tool**
   - What: Full-text keyword search across all 208 markdown files, returns top N matches with surrounding context snippets
   - Why: Lets the LLM find relevant pages without knowing exact paths
   - Considerations: Case-insensitive substring matching (consistent with existing tools which use `.toLowerCase()`); search body content only (not frontmatter metadata); return path, title, and a ~200-word context snippet per match; default limit of 10 results (matches `search_components` default)
   - Snippet extraction: Find the first match position, expand to surrounding paragraph boundaries (or ±100 words), highlight the match context
   - Dependencies: Step 1 (corpus must be bundled)

4. **Add `get_doc_page` tool**
   - What: Returns the full markdown content of a single page by path (e.g., `components/button.md`)
   - Why: Lets the LLM read complete usage guidance, examples, and variant documentation
   - Considerations: Most pages are well under 25K tokens; for oversized pages, return an error with the page size so the LLM can use `search_docs` to target specific sections instead. Avoid offset-based pagination — splitting markdown breaks rendering context (examples reference earlier sections, code blocks span headings). Revisit pagination only if oversized pages prove to be a real problem in practice.
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
   - What: Add test cases covering search, fetch, edge cases (missing page, empty query, oversized page error)
   - Note: The current "test suite" is `test-search.js`, a standalone validation script (not a unit test framework like Vitest/Jest). Decision needed: extend the existing script (pragmatic, follows current pattern) or introduce a proper test runner (more robust, adds setup scope).
   - Dependencies: Steps 2-4

8. **Wire into NX build pipeline**
   - What: Add the corpus bundling step as a dependency of the MCP server's build target in `project.json`
   - Why: Ensures `npm run build` for the MCP server always picks up the latest docs
   - Concrete change: MCP server's `project.json` `dependsOn` currently lists `["dialtone-css:build", "dialtone-vue:build"]` — must add `"dialtone-documentation:generate-raw-markdown"` (or `"dialtone-documentation:build"`) to ensure markdown exists before bundling
   - Considerations: This introduces a new cross-package dependency; verify it doesn't create a circular dependency in the NX graph
   - Dependencies: Step 1

9. **Update MCP server documentation**
   - What: Update `packages/dialtone-mcp-server/README.md` with new tool descriptions and examples; fill in the placeholder guide at `docs/guides/mcp-server/index.md`
   - Dependencies: Steps 2-6

### Phase 3: Automated Tests for the Pipeline

**Test fixtures:** Create a `test/fixtures/` directory with minimal JSON mocks (`component-documentation.json`, `dialtone-docs.json`, `site-nav.json`) and small source doc files. Keep fixtures self-contained so tests don't depend on live data that changes with design system updates.

**Testing strategy:** Assert semantic properties (presence of headings, no HTML tags, valid GFM structure) rather than exact output strings—this reduces brittleness when formatting changes.

#### 3a — Core Pipeline (Priority: High)

1. **Unit tests for parseSourceMarkdown**
    - What: Test the core parser with fixtures containing frontmatter, `<code-example-tabs>`, `<dialtone-usage>`, `<component-vue-api>`, `<utility-class-table>`, `<table>` with nested Vue components
    - Why: These transforms are intricate; bugs show up as subtle doc regressions or broken LLM inputs
    - Considerations: Use small inline fixture strings, not full doc pages; test each transform in isolation
    - Include: State machine transitions (fenced code priority, nested states), quote tracking in `inSingleQuoteAttr` (edge case: `/>` inside quoted attribute values)

2. **Unit tests for HTML table transform**
    - What: Test `transformHtmlTable` with colspan, nested content, and rows containing only stripped Vue components
    - Why: HTML tables are the most complex transform, with multi-cell spans and empty-after-stripping rows

3. **Unit tests for link rewriting**
    - What: Test `rewriteAbsoluteLinks` / `resolveRawLink` with a matrix of paths (`/components/x.html#anchor`, `/guides/getting-started/`, `/assets/image.png`, cross-section links)
    - Why: Link rewriting has many edge cases (anchors, extensions, section boundaries)
    - Include: External links (pass through unchanged), asset paths (unchanged), cross-section links (components → utilities)

#### 3b — Inline Component Handlers (Priority: Medium)

4. **Unit tests for component handlers** (`component-handlers.mjs`)
    - What: Test the 14 inline handlers (`<component-vue-api>`, `<component-class-table>`, `<component-accessible-table>`, `<DesignColorTable>`, `<ThemeColorTable>`, `<ColorsCatalog>`, `<FlexStackNotice>`, `<FontUtilitiesNotice>`, `<ButtonVariantsTable>`, `<all-tokens>`, `<icon-catalog>`, etc.) with mock JSON data
    - Why: Each handler has complex attribute parsing and data lookups; currently untested
    - Include: Missing component graceful handling, malformed attributes

5. **Unit tests for cleanup/normalization functions**
    - What: Test `cleanupOutput` (collapse 3+ blank lines, trim trailing whitespace), `escapeTableCell` (escape pipes but not inside backticks), `stripHtmlTags`, `convertRouterLinks`
    - Why: Small utility functions with edge cases that are easy to cover and catch regressions early

#### 3c — Integration & Specialized Transforms (Priority: Medium-Low)

6. **Unit tests for typography post-processing**
    - What: Test `postProcessTypography` with mock `type.json` data; assert `{{ varName }}` / `{{ output }}` replacement and category table insertion at correct positions
    - Why: Regex-based transforms prone to subtle bugs, specific to one file but high-value output

7. **Unit tests for index generation logic**
    - What: Test `generateFlatIndex`, `appendSiblingLinks`, `appendNavLinks`, `appendOverviewLinks` with mock nav tree and filesystem
    - Why: Navigation tree walking has section-specific behavior (flat vs. recursive, nav-linked vs. filesystem-linked)

8. **Smoke test for the full generator**
    - What: Copy a small fixture subset of docs into a temp dir, run `generate-raw-markdown.mjs` against it, assert key output files and llms.txt look sane
    - Why: Catches regressions in filesystem assumptions, nav linking, and output structure without testing every transform
    - Considerations: Keep fixtures minimal (~5-10 files across 2-3 sections); include at least one file per section type; assert file count, presence of key headings, no HTML tags in output

#### 3d — Error Cases & Hardening (Priority: Low)

9. **Error case tests**
    - What: Malformed HTML tables (unclosed tags, mismatched nesting), missing data sources (`component-documentation.json` absent), invalid frontmatter (malformed YAML), broken Vue component attributes (missing closing quote in `vueCode='...'`)
    - Why: Ensures graceful degradation rather than silent corruption of output

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

## Peer Review (2026-02-07)

Feedback received post-Phase 1. Decisions and actions taken:

| Item | Severity | Action | Rationale |
| --- | --- | --- | --- |
| Monolithic `generate-raw-markdown.mjs` | major | Partial — extracted llms generation into `scripts/lib/generate-llms.mjs` | Transforms were already in 14 modules. Separate CLIs add build complexity for no gain at current scale. Llms generation is the one distinct concern worth splitting. |
| `.html` link bug in `appendNavChildLinks` | major | Fixed — added `navLinkToStem()` helper that strips `.html` before appending `.md` | Real bug: silently skipped all nav-driven page links for utilities. Impact was masked by filesystem-based linking covering the same pages. |
| `onCopyAsMarkdown` missing `res.ok` check | minor | Fixed — added early return on non-OK response | Prevented silently copying 404/500 HTML to clipboard. |
| Null guard on `rawMarkdownUrl` | minor | Declined | The `v-if` template guard is the correct pattern. Adding internal null checks for hypothetical future misuse is over-engineering. |
| `RAW_SECTIONS` duplicated in PageHeader.vue and utils.mjs | minor | Declined | Different data shapes (URL path prefixes vs. section name strings). Coupling a Vue component to a Node build script to save 2 lines that rarely change isn't worth it. |
| `.gitignore` comment outdated | nit | Fixed | Updated "component docs" to "raw markdown and LLM discovery files". |
| No automated tests | major | Planned — added as Phase 3 | Unit tests for transforms and a smoke test are the right next investment. Expanded from 4 to 9 test areas after review. |
| Repeated page-listing patterns | minor | Declined | Filesystem discovery, nav-driven categorization, and llms.txt hierarchy have different inputs and semantics. A shared abstraction would be more complex than the duplication. |

## Open Questions

**Resolved:**

- [x] Should `search_docs` use simple substring matching or a lightweight scoring algorithm (e.g., TF-IDF)? → **Substring matching.** Consistent with existing tools (`search_components`, `search_utility_classes` all use `.toLowerCase()` substring matching). TF-IDF is overkill for 208 files.
- [x] Should the corpus JSON map include pre-extracted titles/descriptions, or parse them at query time? → **Pre-extract.** `llms.txt` already has titles and descriptions; parsing frontmatter at query time is wasteful.
- [x] What is the right default result limit for `search_docs`? (10? 5?) → **10.** Matches `search_components` default. Doc snippets are longer than structured API data, so fewer results per query is appropriate.
- [x] Should `get_doc_page` support section-level retrieval (e.g., `components/button.md#variants`) or always return full pages? → **Full pages only, initially.** Heading-based splitting breaks context (examples reference earlier sections, code blocks span headings). If oversized pages prove problematic, revisit.
- [x] Version the corpus bundle separately from the MCP server, or release together? → **Release together.** `package.json` publishes `build/` as a single artifact; a separate package adds installation complexity for no practical gain.

**Still open:**

- [ ] Which bundling approach for Step 1? (Option A: generated JSON with `import ... with { type: 'json' }`, Option B: cross-package import, Option C: generated `.ts` module)
- [ ] Should Step 7 tests extend the existing `test-search.js` validation script or introduce a proper test runner (Vitest/Jest)?
- [ ] What is the acceptable npm package size increase? (Currently small; will grow by ~1.8MB)

## Rollback Strategy

If Phase 2 introduces regressions for existing MCP server consumers:

- New tools (`list_docs`, `search_docs`, `get_doc_page`) are additive — they can be removed without affecting existing tool schemas or behavior
- The corpus bundle is a separate data source from the four existing JSON imports — removing it has no side effects on existing tools
- `client-rules.json` changes are advisory only and don't affect tool execution
- Worst case: revert the MCP server to the pre-Phase 2 commit and publish a patch release

## Performance Considerations

- **Startup time:** A 1.8MB JSON corpus will be inlined into `build/index.js` by Rollup. JSON parse time for this size is typically <50ms — negligible for a server that starts once per session.
- **Search latency:** Substring search across 208 files (~500K tokens total) is a single-pass operation. Expect <100ms per query even without indexing.
- **Memory footprint:** The corpus will be held in memory for the server's lifetime. ~1.8MB of strings is well within acceptable limits for a long-running Node process.

## References

- Raw markdown pipeline: `apps/dialtone-documentation/scripts/generate-raw-markdown.mjs`
- LLM file generation: `apps/dialtone-documentation/scripts/lib/generate-llms.mjs`
- MCP server package: `packages/dialtone-mcp-server/`
- MCP server README: `packages/dialtone-mcp-server/README.md`
- llms.txt spec: <https://llmstxt.org/>
- LangChain mcpdoc (reference implementation): <https://github.com/langchain-ai/mcpdoc>
- MCP specification (resources vs. tools): <https://modelcontextprotocol.io/specification/2025-06-18/server/resources>
