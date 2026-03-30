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

All search functions return `{ results: SearchResult[]; notes: string[] }`.

| Function | Data Parameter | Description |
|----------|---------------|-------------|
| `searchComponents(query, components)` | `Component[]` | 5-bucket priority search (name, description, props, events, slots) |
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

### Data Exports

Pre-loaded design system data, bundled at build time:

| Export | Type | Source |
|--------|------|--------|
| `utilityClasses` | `UtilityClassesData` | `@dialpad/dialtone-css` |
| `tokens` | `TokensData` | `@dialpad/dialtone-css` |
| `components` | `Component[]` | `@dialpad/dialtone-vue` |
| `icons` | `IconsData` | `@dialpad/dialtone-icons` |

### Utilities

| Export | Description |
|--------|-------------|
| `applySmartFilter(results, data)` | Remove deprecated items, swap discouraged with alternatives |
| `buildCompoundPropertiesSet(data)` | Build compound CSS property index for query parsing |
| `extractKeywords(query, compoundProperties)` | Parse query into keywords with compound property detection |

## Types

All interfaces are exported: `SearchResult`, `Component`, `ComponentProp`, `ComponentEvent`, `ComponentSlot`, `UtilityClassesData`, `ClassData`, `ValueObject`, `TokensData`, `TokenData`, `ThemeData`, `Metadata`, `Icon`, `IconsData`.
