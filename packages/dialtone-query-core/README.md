# Dialtone Query Core

Core search and query engine for the [Dialtone Design System](https://dialtone.dialpad.com). Provides type-safe search functions for components, design tokens, CSS utility classes, and icons.

This package is the shared foundation used by both [`@dialpad/dialtone-mcp-server`](../dialtone-mcp-server) and [`@dialpad/dialtone-cli`](../dialtone-cli).

## Usage

```typescript
import {
  searchComponents, searchTokens, searchUtilityClasses, searchIcons,
  components, componentDocumentation, tokens, utilityClasses, icons,
} from '@dialpad/dialtone-query-core';

// Search components; the optional page catalog adds curated keyword discovery
const { results, notes } = searchComponents('spinner', components, componentDocumentation);

// Search tokens (HSL decomposition tokens filtered by default)
const tokenResults = searchTokens('color foreground', tokens);

// Include HSL tokens
const allTokens = searchTokens('color foreground', tokens, { includeHsl: true });

// Search utility classes
const classResults = searchUtilityClasses('padding 8px', utilityClasses);

// Search icons
const iconResults = searchIcons('notification', icons);
```

## API

### Search Functions

All search functions return `{ results: SearchResult[]; notes: string[] }`. `searchComponents` also returns `exactMatch: boolean` and `warning: string | null`, the deprecation or discouragement note for the component the query names (also included in `notes`).

| Function | Data Parameter | Description |
| ---------- | --------------- | ------------- |
| `searchComponents(query, components, catalog?, options?)` | `Component[]`, optional `ComponentDocCatalog` | Complete name/keyword matches lead; complete description, prop, event and slot matches precede partial contextual candidates. Exact-name candidates are preserved. Within each discovery tier, one complete phrase determines coverage; regular plurals are discovery only. `{ includePartialContext: false }` keeps complete matches for broad CLI value ordering. Text notes identify retained evidence. Keywords require a catalog and reach only public API components present in `components`. |
| `searchTokens(query, tokens, options?)` | `TokensData` | Token search with optional `{ includeHsl: boolean }` |
| `searchUtilityClasses(query, utilityClasses)` | `UtilityClassesData` | CSS class search with automatic px/rem conversion |
| `searchIcons(query, icons)` | `IconsData` | Icon search by name, category, and keywords |
| `searchDocumentation(query, documentation)` | `DocumentationRecord[]` | Search reference sections; preserve exact-title, whole-query keyword and title priority. Named API subjects retain source ranking; contextual keywords help discover other pages, whose strongest source section is selected. Contextual coverage ties use the strongest single authored phrase. Explicit directive identifiers retain scoped section ranking. |

Directive identifiers such as `v-dt-tooltip` or `DtTooltipDirective` return no component results, with a note directing callers to documentation search. Use `searchDocumentation` for their contracts.

### Format Functions

| Function | Description |
| ---------- | ------------- |
| `formatResults(results, query, page?: SearchPage)` | Format utility class results as markdown |
| `formatTokenResults(results, query, page?: SearchPage)` | Format token results as markdown |
| `formatComponentResults(results, query, page?: SearchPage)` | Format component results as markdown |
| `formatIconResults(results, query, page?: SearchPage)` | Format icon results as markdown |
| `formatDocumentationResults(results, query)` | Format reference excerpts and links as markdown; directive records include source package/version and an installed-compatibility qualifier |

`SearchPage` is `{ offset: number; total: number }`. Pass it to show total counts and the page range; numbered result lists continue from the offset. Omit it to retain the existing summary format.

### Selected Detail and Provenance

These functions select source records; they do not resolve a consuming project's installed packages. Missing source fields remain unknown.

| Export | Description |
| --- | --- |
| `getComponentDetail(args, components, installedExports?)` | Select a canonical component or unique alias, then project `all`, `props`, `events`, `slots`, `methods` or `expose`. `args.component` is required; `projection` and a selected `field` are optional. Returns complete available contracts, alternatives, missing-field information and a missing-component `reason`. |
| `getDocumentationDetail(args, documentation)` | Select an exact record `id`, including selected examples; optional `textOffset` and `textLimit` page its content by Unicode code points. Returns content counts and the next text page. |
| `getDocumentationExampleIds(subject, documentation)` | Return exact example IDs for a source section, source page, authored component-page subject or related directive. Assembly imports alone do not establish relevance. Adapters render fetch syntax. |
| `getValueDetail(name, tokens)` | Select an exact token name and retain every named theme record and available metadata. |
| `formatTokenThemes(name, metadata, page)` | Render a selected page of token theme records as Markdown. |
| `getComponentDocumentation(identity, componentDocumentation)` | Join verified public identity to authored page associations; qualify missing or ambiguous links and latest-documentation scope. |
| `paginate(items, { offset, limit })` | Return `{ page, total, nextOffset }` using native array slicing. Callers validate inputs; `nextOffset` is `null` when no records remain. |
| `createRetrievalEnvelope(options, bundledProvenance)` | Package selected records with match state, source, counts, omissions, a budget and continuation. Records remain intact; an oversized atomic record reports unavailable. |
| `formatRetrievalEnvelope(envelope)` | Render qualification text and the envelope JSON with the same facts as structured detail output. |

`COMPONENT_DETAIL_LIMIT` is the shared default of 20 selected records. `COMPONENT_SECTIONS` lists component projections. `MATCH_STATES` lists `exact`, `candidate`, `no-match`, `unavailable` and `unverified`. `RETRIEVAL_BUDGETS` defines envelope budgets using an estimate of UTF-8 JSON bytes divided by four, rounded up. MCP applies the detail budget only to its new detail tools; its five existing searches remain text-only and preserve their result limits. See the [MCP retrieval contract](../dialtone-mcp-server/RETRIEVAL.md) for adapter validation, defaults and continuation.

`DocumentationRecord.example` optionally identifies a selected source-derived example, assembly component imports, a pinned profile, payload validation and manual-review status. `searchDocumentation` excludes these complete records; retrieve their exact IDs with `getDocumentationDetail` and follow its continuation to obtain all files. Selected documentation fences, static utility examples and Combinator presets do not imply full source coverage or installed-version compatibility.

For `getComponentDetail`, omit `installedExports` for ordinary record selection. Pass verified export names as `readonly string[]`, or `null` when export evidence is unavailable. Its `reason` is `null` unless that evidence qualifies a missing record. `MissingComponentReason` has three values:

- `not-exported`: a known bundled public component is absent from the verified installed exports; the match is `unavailable`.
- `exported-without-metadata`: the entry exports the name but no component record describes it; the match is `unverified`. The name may be a helper, constant or another non-component export.
- `export-unverified`: export evidence is unavailable; the missing record is `unverified`.

Directive identifiers retain documentation routing; unrecognized names retain the ordinary `no-match` result. Installed exports never substitute bundled API records.

### Node-only Data Resolution

Import filesystem-based resolution from `@dialpad/dialtone-query-core/node`. The root entry remains free of the Node filesystem resolver.

| Export | Description |
| --- | --- |
| `resolveData(forceBundled?, cwd?)` | Apply the CLI's existing installed-data policy from `cwd` (default: `process.cwd()`), or use bundled data when `forceBundled` is true. |
| `resolveProjectData(projectRoot?, lookupRoot?)` | Select MCP startup data within explicit absolute project/lookup roots. Returns `data`, per-domain `provenance`, static `componentExports` and `configured`; missing or invalid configuration reports a bundled fallback reason. Documentation remains bundled. |

Failed MCP selection preserves bundled discovery and source-verified imports, with explicit fallback warnings; it never claims installed verification. Normal bundled documentation/links carry no fallback reason. An explicit lookup boundary also authorizes the nearest ancestor Dialtone declaration, without crossing a Git boundary or combining app declarations.

These policies differ deliberately. Reading export names verifies neither runtime importability nor peer dependency compatibility. See the [MCP guide](../../apps/dialtone-documentation/docs/guides/mcp-server/index.md) for root configuration and fallback limits.

### Data Exports

Pre-loaded design system data, bundled at build time:

| Export | Type | Source |
| -------- | ------ | -------- |
| `utilityClasses` | `UtilityClassesData` | `@dialpad/dialtone-css` |
| `tokens` | `TokensData` | `@dialpad/dialtone-css` |
| `components` | `Component[]` | `@dialpad/dialtone-vue` |
| `icons` | `IconsData` | `@dialpad/dialtone-icons` |
| `documentation` | `DocumentationRecord[]` | Generated public reference sections and selected complete examples in `@dialpad/dialtone-docs` |
| `componentDocumentation` | `ComponentDocCatalog` | Generated associations between public identities and authored documentation pages |
| `bundledProvenance` | `BundledProvenance` | Build-time package/schema versions and exact-artifact/canonical-content hashes for bundled domains |

Bundled provenance identifies the data supplied to the adapters. It does not establish installed compatibility, runtime importability or factual correctness.

### Utilities

| Export | Description |
| -------- | ------------- |
| `applySmartFilter(results, data)` | Remove deprecated items, swap discouraged with alternatives |
| `buildCompoundPropertiesSet(data)` | Build compound CSS property index for query parsing |
| `extractKeywords(query, compoundProperties)` | Parse query into keywords with compound property detection |
| `normalizeComponents(records, installed?)` | Add canonical identity to component records without inventing missing API fields. Optional installed export evidence qualifies public import routes. |
| `normalizeComponentName(name)` | Normalize case and separators for canonical/alias comparisons, accepting an optional `Dt` prefix |
| `componentNames(component)` | Return the component's display name and recorded aliases |
| `componentImportStatement(identity?, preferredFrom?)` | Return a verified public import statement, or `null`. A preferred route never creates an unsupported import. |
| `componentImportNote(identity?)` | Explain an unavailable or unverified import |
| `parseComponentExports(source)` | Read the bounded import/export-only grammar of a published Vue entry without executing it. Returns exported names, or `null` for unsupported or malformed source. Available from the root entry. |

`InstalledComponentExports` describes the optional installed evidence passed to `normalizeComponents`: the exact `package`, `version`, import route `from`, and exported `names` (`readonly string[]` or `null` when unverified).

## Types

Exported interfaces include `SearchResult`, `SearchPage`, `Component`, `ComponentProp`, `ComponentEvent`, `ComponentSlot`, `ComponentImport`, `ComponentIdentity`, `InstalledComponentExports`, `UtilityClassesData`, `ClassData`, `ValueObject`, `TokensData`, `TokenData`, `ThemeData`, `Metadata`, `Icon`, `IconsData`.

Detail exports also include `ComponentDetailArgs`, `ComponentSection`, `MissingComponentReason`, `TokenThemeRecord`, `DocumentationFrontmatter`, `DocumentationRecord`, `ComponentDocCatalog` and `ComponentDocPage`. Retrieval types are `BundledProvenance`, `DomainStamp`, `MatchState`, `Continuation` and `RetrievalEnvelope`. The Node entry exports `Domain`, `DomainSource`, `ResolvedData` and `ProjectData`.

`Component` has optional `schemaVersion?: number` and `identity?: ComponentIdentity` fields, preserving compatibility with older metadata arrays. Normalized version 2 records include a canonical name, lookup aliases, a `public`, `internal`, or `unknown` classification, optional source information, and verified import routes. Older records without version 2 identity remain `unknown` unless installed export evidence is provided.

`ComponentImport` records the export name, import route, root or subpath kind, exact package/version, and `source-export` or `installed-export` verification. Only these verified routes authorize import guidance; aliases and the schema version alone do not. Export verification does not certify runtime or peer dependency compatibility.
