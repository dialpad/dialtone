# ESLint Fix & Refactor Raw Markdown Scripts

## Status: Complete

## Summary

Fixed 3 ESLint errors and 8 complexity warnings across the raw markdown generation scripts by refactoring the monolithic parser into smaller modules with a handler registry pattern, extracting shared helpers, and reducing function complexity across all transform files. Output is byte-identical to pre-refactor — purely structural.

## Context

The pre-commit hook was failing on `eslint --fix` with 3 errors (unused imports/vars) and 8 warnings (cyclomatic complexity, file length). The errors blocked commits. The warnings indicated `parse-source-markdown.mjs` had grown to 589 lines (max 300) with complexity 122 (max 8), and several transform files exceeded the complexity limit of 8.

## Changes Made

### 1. `scripts/generate-raw-markdown.mjs` — fix errors, reduce complexity

**Errors fixed:**
- Removed unused `existsSync` import
- Removed unused `PUBLIC_RAW` constant
- Removed unused `slug` variable

**Complexity reduction** (28 → ~7):
- Extracted `loadAllDataSources()` — consolidates 7 loadJson + setter calls
- Extracted `generateFlatIndex()` — flat-section index generation
- Extracted `appendSiblingLinks()` — non-flat sibling link logic
- Extracted `appendOverviewLinks()` + `buildOverviewLink()` — overview section links
- Added `buildLinkFromFile()` and `listMdFiles()` shared helpers

### 2. `scripts/lib/component-handlers.mjs` — NEW file (~170 lines)

Created handler registry module containing:
- `INLINE_HANDLERS` — array of 12 `{ match, handle, closingTags }` entries replacing 12 sequential if-blocks in the parser
- `consumeUntilClose(lines, i, trimmed, ...closingTags)` — replaces 11 copy-pasted while-loops
- `parseFrontmatterField(trimmed, field)` — replaces 5 identical regex-then-strip-quotes blocks

Registered handlers: `component-vue-api`, `component-class-table`, `component-accessible-table`, `DesignColorTable`, `ThemeColorTable`, `ColorsCatalog`, `FlexStackNotice`, `FontUtilitiesNotice`, `ButtonVariantsTable`, `all-tokens`, `icon-catalog`, `icons illustration`

### 3. `scripts/lib/parse-source-markdown.mjs` — major refactor (589 → 375 lines, complexity 122 → 4)

- Replaced inline handler blocks with `INLINE_HANDLERS` registry loop
- Converted state machine from giant if-chain to `STATE_HANDLERS` dispatch table + `NORMAL_DETECTORS` array
- Extracted per-state handler functions: `handleFencedCode`, `handleFrontmatter`, `handleSkipUntilClose`, `handleUtilityClassTableState`, `handleCodeExampleTabsState`, `handleDialtoneUsageState`, `handleHtmlTableState`
- Extracted NORMAL-state detectors: `tryDetectFencedCode`, `tryDetectFrontmatterStart`, `tryDetectComment`, `tryDetectScriptOrStyle`, `tryDetectCodeWellHeader`, `tryDetectUtilityClassTable`, `tryDetectCodeExampleTabs`, `tryDetectDialtoneUsage`, `tryDetectHtmlTable`, `tryInlineHandlers`
- Extracted helpers: `extractScriptSetup`, `extractFrontmatterFields`, `emitFrontmatter`, `emitUtilityTable`, `isVueClosingTag`, `convertRouterLinks`

### 4. `scripts/lib/utils.mjs` — added shared `capitalize()`

```js
export function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

### 5. `scripts/lib/transform-tokens.mjs` — deduplicate + reduce complexity (13 → 8)

- Removed local `capitalize()` and `escapeCell()`, imported from `utils.mjs`
- Extracted `groupTokensByCategory(theme)` from nested loop

### 6. `scripts/lib/transform-icon-catalog.mjs` — deduplicate

- Removed local `capitalize()` and `escapeCell()`, imported `capitalize` and `escapeTableCell` from `utils.mjs`

### 7. `scripts/lib/transform-class-table.mjs` — reduce complexity (9 → 6)

- Extracted `loadComponentData(componentName, dataDir, label)` shared by `transformClassTable` and `transformAccessibleTable`

### 8. `scripts/lib/transform-html-table.mjs` — reduce complexity (10 → 6)

- Extracted `extractRows(html)` from `transformHtmlTable`, isolating the `<tr>` depth-tracking logic

### 9. `scripts/lib/transform-usage.mjs` — reduce complexity (11 → 5)

- Extracted `categorizeUsageLine(trimmed)` for slot transition detection
- Extracted `emitSection(label, contentLines, output)` for Do/Don't output

### 10. `scripts/lib/transform-vue-api.mjs` — reduce complexity (20 → 7)

- Extracted `buildApiTable(heading, items, headers, formatRow)` replacing 3 near-identical props/slots/events table blocks
- Fixed quote style errors (double → single quotes on `formatDefault`)

## Files Modified

| File | Action |
|------|--------|
| `scripts/generate-raw-markdown.mjs` | Fix 3 errors, extract helpers from `main()` |
| `scripts/lib/parse-source-markdown.mjs` | Dispatch table + handler registry refactor |
| `scripts/lib/component-handlers.mjs` | **NEW** — handler registry, consumeUntilClose, parseFrontmatterField |
| `scripts/lib/utils.mjs` | Add shared `capitalize()` |
| `scripts/lib/transform-tokens.mjs` | Use shared helpers, extract `groupTokensByCategory` |
| `scripts/lib/transform-icon-catalog.mjs` | Use shared helpers |
| `scripts/lib/transform-class-table.mjs` | Extract `loadComponentData` |
| `scripts/lib/transform-html-table.mjs` | Extract `extractRows` |
| `scripts/lib/transform-usage.mjs` | Extract `categorizeUsageLine` + `emitSection` |
| `scripts/lib/transform-vue-api.mjs` | Extract `buildApiTable`, fix quote errors |

## Verification

- ✅ `node scripts/generate-raw-markdown.mjs` — 205 files generated, 0 errors
- ✅ `npx eslint scripts/**/*.mjs` — 0 errors, 0 warnings on all 10 affected files
- ✅ Output byte-identical to pre-refactor (verified via full-directory MD5 checksums)
- ✅ Spot-checked modal.md, button.md, color.md, tokens/index.md — all identical
