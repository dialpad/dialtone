# Dialtone Query Core

Core search and query engine for the [Dialtone Design System](https://dialtone.dialpad.com). Provides type-safe search functions for components, design tokens, CSS utility classes, and icons.

This package is the shared foundation used by both [`@dialpad/dialtone-mcp-server`](../dialtone-mcp-server) and [`@dialpad/dialtone-cli`](../dialtone-cli).

## Usage

```typescript
import {
  searchComponents, searchTokens, searchUtilityClasses, searchIcons,
  components, tokens, utilityClasses, icons,
} from '@dialpad/dialtone-query-core';

// Search components
const { results, notes } = searchComponents('button', components);

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
|----------|---------------|-------------|
| `searchComponents(query, components)` | `Component[]` | 5-bucket priority search (name, description, props, events, slots). An exact name match comes first. |
| `searchTokens(query, tokens, options?)` | `TokensData` | Token search with optional `{ includeHsl: boolean }` |
| `searchUtilityClasses(query, utilityClasses)` | `UtilityClassesData` | CSS class search with automatic px/rem conversion |
| `searchIcons(query, icons)` | `IconsData` | Icon search by name, category, and keywords |

### Format Functions

| Function | Description |
|----------|-------------|
| `formatResults(results, query)` | Format utility class results as markdown |
| `formatTokenResults(results, query)` | Format token results as markdown |
| `formatComponentResults(results, query)` | Format component results as markdown |
| `formatIconResults(results, query)` | Format icon results as markdown |

### Selected Detail and Provenance

These functions select source records; they do not resolve a consuming project's installed packages. Missing source fields remain unknown.

| Export | Description |
| --- | --- |
| `getComponentDetail(args, components)` | Select a canonical component or unique alias, then project `all`, `props`, `events`, `slots`, `methods` or `expose`. `args.component` is required; `projection` and a selected `field` are optional. Returns complete available contracts, alternatives and missing-field information. |
| `getDocumentationDetail(args, documentation)` | Select an exact section `id`; optional `textOffset` and `textLimit` page its prose by Unicode code points. Returns content counts and the next text page. |
| `getValueDetail(name, tokens)` | Select an exact token name and retain every named theme record and available metadata. |
| `formatTokenThemes(name, metadata, page)` | Render a selected page of token theme records as Markdown. |
| `getComponentDocumentation(identity, componentDocumentation)` | Join verified public identity to authored page associations; qualify missing or ambiguous links and latest-documentation scope. |
| `createRetrievalEnvelope(options, bundledProvenance)` | Package selected records with match state, source, counts, omissions, a budget and continuation. Records remain intact; an oversized atomic record reports unavailable. |
| `formatRetrievalEnvelope(envelope)` | Render qualification text and the envelope JSON with the same facts as structured detail output. |

`COMPONENT_SECTIONS` lists component projections. `MATCH_STATES` lists `exact`, `candidate`, `no-match`, `unavailable` and `unverified`. `RETRIEVAL_BUDGETS` defines envelope budgets using an estimate of UTF-8 JSON bytes divided by four, rounded up. MCP applies the detail budget only to its new detail tools; its five existing searches remain text-only and preserve their result limits. See the [MCP retrieval contract](../dialtone-mcp-server/RETRIEVAL.md) for adapter validation, defaults and continuation.

### Data Exports

Pre-loaded design system data, bundled at build time:

| Export | Type | Source |
|--------|------|--------|
| `utilityClasses` | `UtilityClassesData` | `@dialpad/dialtone-css` |
| `tokens` | `TokensData` | `@dialpad/dialtone-css` |
| `components` | `Component[]` | `@dialpad/dialtone-vue` |
| `icons` | `IconsData` | `@dialpad/dialtone-icons` |
| `documentation` | `DocumentationRecord[]` | Generated public prose in `@dialpad/dialtone-docs` |
| `componentDocumentation` | `ComponentDocCatalog` | Generated associations between public identities and authored documentation pages |
| `bundledProvenance` | `BundledProvenance` | Build-time package/schema versions and exact-artifact/canonical-content hashes for bundled domains |

Bundled provenance identifies the data supplied to the adapters. It does not establish installed compatibility, runtime importability or factual correctness.

### Utilities

| Export | Description |
|--------|-------------|
| `applySmartFilter(results, data)` | Remove deprecated items, swap discouraged with alternatives |
| `buildCompoundPropertiesSet(data)` | Build compound CSS property index for query parsing |
| `extractKeywords(query, compoundProperties)` | Parse query into keywords with compound property detection |
| `normalizeComponents(records, installed?)` | Add canonical identity to component records without inventing missing API fields. Optional installed export evidence qualifies public import routes. |
| `normalizeComponentName(name)` | Normalize case and separators for canonical/alias comparisons, accepting an optional `Dt` prefix |
| `componentNames(component)` | Return the component's display name and recorded aliases |
| `componentImportStatement(identity?, preferredFrom?)` | Return a verified public import statement, or `null`. A preferred route never creates an unsupported import. |
| `componentImportNote(identity?)` | Explain an unavailable or unverified import |

`InstalledComponentExports` describes the optional installed evidence passed to `normalizeComponents`: the exact `package`, `version`, import route `from`, and exported `names` (`readonly string[]` or `null` when unverified).

## Types

Exported interfaces include `SearchResult`, `Component`, `ComponentProp`, `ComponentEvent`, `ComponentSlot`, `ComponentImport`, `ComponentIdentity`, `InstalledComponentExports`, `UtilityClassesData`, `ClassData`, `ValueObject`, `TokensData`, `TokenData`, `ThemeData`, `Metadata`, `Icon`, `IconsData`.

Detail exports also include `ComponentDetailArgs`, `ComponentSection`, `TokenThemeRecord`, `DocumentationFrontmatter`, `DocumentationRecord`, `ComponentDocCatalog` and `ComponentDocPage`. Retrieval types are `BundledProvenance`, `DomainStamp`, `MatchState`, `Continuation` and `RetrievalEnvelope`.

`Component` has optional `schemaVersion?: number` and `identity?: ComponentIdentity` fields, preserving compatibility with older metadata arrays. Normalized version 2 records include a canonical name, lookup aliases, a `public`, `internal`, or `unknown` classification, optional source information, and verified import routes. Older records without version 2 identity remain `unknown` unless installed export evidence is provided.

`ComponentImport` records the export name, import route, root or subpath kind, exact package/version, and `source-export` or `installed-export` verification. Only these verified routes authorize import guidance; aliases and the schema version alone do not. Export verification does not certify runtime or peer dependency compatibility.
