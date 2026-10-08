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
| `searchDocumentation(query, documentation)` | `DocumentationRecord[]` | Search reference sections; explicit directive identifiers scope results to named directives and component comparisons |

Directive identifiers such as `v-dt-tooltip` or `DtTooltipDirective` return no component results, with a note directing callers to documentation search. Use `searchDocumentation` for their contracts.

### Format Functions

| Function | Description |
|----------|-------------|
| `formatResults(results, query)` | Format utility class results as markdown |
| `formatTokenResults(results, query)` | Format token results as markdown |
| `formatComponentResults(results, query)` | Format component results as markdown |
| `formatIconResults(results, query)` | Format icon results as markdown |
| `formatDocumentationResults(results, query)` | Format reference excerpts and links as markdown; directive records include source package/version and an installed-compatibility qualifier |

### Data Exports

Pre-loaded design system data, bundled at build time:

| Export | Type | Source |
|--------|------|--------|
| `utilityClasses` | `UtilityClassesData` | `@dialpad/dialtone-css` |
| `tokens` | `TokensData` | `@dialpad/dialtone-css` |
| `components` | `Component[]` | `@dialpad/dialtone-vue` |
| `icons` | `IconsData` | `@dialpad/dialtone-icons` |
| `documentation` | `DocumentationRecord[]` | `@dialpad/dialtone-docs` |

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

`Component` has optional `schemaVersion?: number` and `identity?: ComponentIdentity` fields, preserving compatibility with older metadata arrays. Normalized version 2 records include a canonical name, lookup aliases, a `public`, `internal`, or `unknown` classification, optional source information, and verified import routes. Older records without version 2 identity remain `unknown` unless installed export evidence is provided.

`ComponentImport` records the export name, import route, root or subpath kind, exact package/version, and `source-export` or `installed-export` verification. Only these verified routes authorize import guidance; aliases and the schema version alone do not. Export verification does not certify runtime or peer dependency compatibility.
