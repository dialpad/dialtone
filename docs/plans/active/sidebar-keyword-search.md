# Sidebar Keyword Search Enhancement

## Overview

**Status:** In Progress
**Created:** 2025-11-14
**Last Updated:** 2025-11-14

Add keyword search functionality to the sidebar navigation filter to improve discoverability. Users will be able to find pages using alternative terms (e.g., searching "font" will return Type/Typography pages even though "font" doesn't appear in the page titles).

## Goals

- Enable keyword-based search in sidebar navigation
- Improve page discoverability through alternative search terms
- Maintain backward compatibility with existing navigation structure
- Preserve current performance and user experience

## Non-Goals

- Full-text search across page content (only sidebar navigation)
- Search result ranking or relevance scoring
- Search analytics or tracking
- Multi-language keyword support

## Success Criteria

- Searching "font" returns Type/Typography-related pages
- All 182 navigation items have relevant keywords (average 5 keywords per item)
- Filtering performance remains instantaneous (< 50ms response time)
- Existing functionality (keyboard navigation, auto-expansion, empty state) works unchanged
- Zero breaking changes for items without keywords

## Constraints & Guardrails

**Technical Constraints:**

- Must maintain backward compatibility with existing site-nav.json structure
- Keywords are optional; items without keywords must continue to work
- Cannot impact existing filter performance (currently smooth with 182 items)
- Must work with existing recursive filtering logic (max depth 2)

**User Experience Constraints:**

- Keyboard navigation must continue to work seamlessly
- Parent item auto-expansion must work when child keywords match
- Empty state must display when no keyword matches found
- No visual changes to sidebar appearance

**Documentation Principle:**

- ⚠️ **CRITICAL**: After implementation, update the existing sidebar-search-filter.md plan document to note the keyword enhancement
- Document keyword selection strategy for future maintainers adding new pages

**Key Risks:**

- Performance degradation with large keyword sets: Mitigate by keeping keywords focused (5-10 per item) and using efficient array methods
- Keyword maintenance burden: Mitigate by documenting keyword strategy and reviewing during page additions
- Irrelevant results from overly broad keywords: Mitigate by using specific, relevant keywords

## Implementation Steps

### Phase 1: Core Infrastructure

1. **Update sidebar filtering logic**
   - What: Modify `filterItems` function in Sidebar.vue (line 97) to search both text and keywords
   - Why: Enable keyword matching alongside existing text matching
   - Considerations: Use optional chaining and nullish coalescing to maintain backward compatibility
   - Dependencies: None

2. **Define keywords data structure**
   - What: Document and implement optional `keywords` array property in site-nav.json
   - Why: Store searchable keywords without changing page display names
   - Considerations: Use lowercase strings in array for consistency; keep arrays concise (5-10 keywords)
   - Dependencies: None

### Phase 2: Strategic Keyword Population

3. **Add keywords to Foundations pages**
   - What: Populate keywords for Type, Color, Icons, Logo, Motion, Gradient, Space, Size, Illustrations sections
   - Why: Foundation pages use design terminology that may be searched by alternative names
   - Considerations: Include common misspellings (e.g., "colour"), brand terms (e.g., "season" for Type), technical terms
   - Dependencies: Step 2 (data structure defined)

4. **Add keywords to Component pages**
   - What: Populate keywords for all 40+ components in site-nav.json
   - Why: Users often search components by alternative names, abbreviations, or use cases
   - Considerations: Include common abbreviations (btn, cta), alternative names (popup, dialog), use cases (notification, alert)
   - Dependencies: Step 2 (data structure defined)

5. **Add keywords to Utilities pages**
   - What: Populate keywords for CSS utility categories and specific utility pages
   - Why: Users search by CSS property names or layout concepts
   - Considerations: Include CSS property names, common aliases, layout terminology
   - Dependencies: Step 2 (data structure defined)

6. **Add keywords to Content/Guides pages**
   - What: Populate keywords for content guidelines and getting started documentation
   - Why: Help users find guidance on writing, setup, and contribution topics
   - Considerations: Include action-oriented keywords (setup, install, write, contribute)
   - Dependencies: Step 2 (data structure defined)

### Phase 3: Testing & Validation

7. **Test keyword search functionality**
   - What: Verify keyword searches return expected results and all existing features work
   - Why: Ensure keywords improve discoverability without breaking existing functionality
   - Considerations: Test cases include "font" → Type pages, "popup" → Modal, "colour" → Color, verify parent expansion and keyboard navigation
   - Dependencies: Steps 1-6 complete

8. **Validate performance**
   - What: Measure and confirm filtering remains performant with full keyword dataset
   - Why: Ensure no degradation to user experience with added keyword matching
   - Considerations: Test with 182 items and average 5 keywords each (~910 total keywords); should remain < 50ms
   - Dependencies: Steps 1-6 complete

## Phase Completion Summaries

[Will be added as phases complete]

## Open Questions

- [ ] Should we include common misspellings as keywords?
- [ ] How should we handle keyword maintenance when new pages are added?
- [ ] Should keywords be case-sensitive for non-English terms?

## References

- Related plan: `/docs/plans/active/sidebar-search-filter.md` (original sidebar search implementation)
- Sidebar component: `/apps/dialtone-documentation/docs/.vuepress/theme/components/Sidebar.vue`
- Navigation data: `/apps/dialtone-documentation/docs/_data/site-nav.json`
- Current implementation: Filters 182 items across max depth 2, with keyboard navigation and auto-expansion

## Implementation Notes

### Current Filtering Implementation

**Location:** `Sidebar.vue` lines 87-116

**Current Logic:**
```javascript
const itemMatches = item.text.toLowerCase().includes(term);
```

**Proposed Change:**
```javascript
const itemMatches = item.text.toLowerCase().includes(term) ||
  (item.keywords?.some(keyword =>
    keyword.toLowerCase().includes(term)
  ) ?? false);
```

**Why This Approach:**
- Maintains existing text matching behavior
- Adds keyword checking as secondary match condition
- Uses optional chaining (`?.`) for backward compatibility
- Uses nullish coalescing (`??`) to handle undefined keywords
- Performs case-insensitive matching consistent with existing behavior

### Keyword Selection Strategy

When adding keywords to navigation items, follow these principles:

1. **Alternative Names:** Include common alternative names (e.g., "btn" for Button, "popup" for Modal)
2. **Use Cases:** Include what users might search for when looking for this functionality (e.g., "notification" for Toast)
3. **Technical Terms:** Include relevant CSS properties or technical terminology (e.g., "flexbox" for Flex)
4. **Brand Terms:** Include Dialtone-specific terms (e.g., "season" for Type)
5. **Common Misspellings:** Consider including "colour" for Color pages
6. **Keep Focused:** Limit to 5-10 highly relevant keywords per item

### Example Keyword Additions

**Foundations - Type:**
```json
{
  "text": "Type",
  "link": "/foundations/type/",
  "icon": "type",
  "keywords": ["font", "typography", "typeface", "text", "season"],
  "children": [...]
}
```

**Components - Modal:**
```json
{
  "text": "Modal",
  "link": "/components/modal.html",
  "keywords": ["dialog", "popup", "overlay", "lightbox"]
}
```

**Utilities - Typography:**
```json
{
  "text": "Typography",
  "link": "/utilities/typography/styles.html",
  "keywords": ["font", "text", "type"],
  "children": [...]
}
```

### Performance Characteristics

**Current Performance:**
- 182 sidebar items
- Recursive filtering with max depth 2
- Performance described as "smooth" in original implementation

**Expected Impact:**
- Additional operation per item: `Array.some()` over ~5-10 keywords
- Worst case: 182 items × 10 keywords × string comparison = ~1,820 operations
- Modern browsers handle this efficiently (< 1ms)
- No observable performance degradation expected

**If Performance Issues Arise:**
Consider pre-normalizing keywords on mount:
```javascript
const normalizedItems = computed(() => {
  return sidebarItems.value.map(item => ({
    ...item,
    _normalizedKeywords: item.keywords?.map(k => k.toLowerCase())
  }));
});
```

## Key Learnings

[Will be documented after implementation completes]
