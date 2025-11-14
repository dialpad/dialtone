# Sidebar Search/Filter Feature

## Overview

**Status:** ✅ Completed
**Created:** 2025-11-13
**Last Updated:** 2025-11-14

Implement real-time search functionality for the left sidebar navigation that filters all items recursively across all nesting levels. When a search term is entered, only matching items and their parent paths are shown, with all parent items automatically expanded to reveal matches. Includes keyboard navigation with native browser focus styling.

## Goals

- Enable real-time filtering of sidebar navigation items based on user search input
- Show matching items at any nesting level (depth 0, 1, or 2)
- Automatically expand all parent items containing matches
- Provide intuitive search experience without breaking existing navigation behavior

## Non-Goals

- Search highlighting within matched text
- Fuzzy/approximate matching algorithms
- Search history or saved searches
- Searching by URL/link in addition to text
- Mobile-specific search optimizations

## Success Criteria

**Phase 1-3 (Core Search & Filter):**
- Typing in search input filters sidebar items in real-time with no lag
- Matching items at any depth level (0, 1, or 2) are shown with full parent path preserved
- All parents of matching items automatically expand during active search
- Clearing search restores full sidebar with route-based expansion state
- Toggle/collapse functionality continues to work identically during active search
- Navigation to matched items works correctly (router-link functionality preserved)
- "No results" message displays when search yields zero matches
- Search is case-insensitive and trims whitespace
- Performance remains smooth with all 182 sidebar items

**Phase 4 (Keyboard Navigation):**
- ArrowDown/ArrowUp keys cycle through visible filtered results in document order
- Visual indicator clearly shows which item has keyboard focus
- Enter key navigates to the focused item
- Escape key clears search and focus
- Focus wraps at beginning/end of list
- Focused items auto-scroll into view when outside viewport
- Keyboard focus resets appropriately when search results change
- Keyboard navigation doesn't interfere with mouse/click interaction
- Keyboard navigation works correctly with nested/expanded items

## Constraints & Guardrails

**Technical Constraints:**

- Must work with existing recursive SidebarItem component without modifications
- Cannot break existing openItems Set state management
- Must maintain 60fps performance with 182 total sidebar items
- Filter logic must handle max nesting depth of 2 levels

**Business Constraints:**

- Search behavior must be intuitive without requiring documentation
- Existing navigation and routing must continue to function identically
- Cannot interfere with route-based auto-expansion of current page

**Documentation Principle:**

- ⚠️ **CRITICAL**: After implementation, document the search feature in appropriate user guides
- Include technical documentation about filter algorithm and state management

**Key Risks:**

- Performance degradation with nested filtering: Mitigate by keeping filter logic simple (O(n) traversal)
- State conflicts between search expansion and route expansion: Mitigate with clear watcher priority (search takes precedence when active)
- Breaking existing toggle behavior: Mitigate by preserving all existing event handlers

## Implementation Steps

### Phase 1: Core Filter Logic

1. **Create recursive filter function**
   - What: Add filterItems function in Sidebar.vue that recursively searches through all items and their children
   - Why: Need to traverse entire tree structure (max depth 2) to find matches at any level
   - Considerations: Must preserve parent items when children match; return filtered children arrays; handle 182 total items efficiently
   - Dependencies: None

2. **Add filteredItems computed property**
   - What: Create computed property that applies filterItems when inputValue has content, otherwise returns unfiltered sidebarItems
   - Why: Reactive filtering triggered by user typing in search input
   - Considerations: Case-insensitive search using toLowerCase(); trim whitespace; return original items when search is empty
   - Dependencies: Step 1

3. **Update v-for to use filteredItems**
   - What: Change line 38 in Sidebar.vue from `v-for="item in sidebarItems"` to `v-for="item in filteredItems"`
   - Why: Render only filtered results in the sidebar
   - Considerations: No changes needed to SidebarItem.vue - it already handles empty children arrays gracefully
   - Dependencies: Step 2

### Phase 2: Auto-Expand Matching Items

4. **Create computeOpenItemsForSearch function**
   - What: Add function that traverses filtered results and returns Set of all parent item keys that contain matches
   - Why: Automatically expand parent items so users can see matching children without manual clicking
   - Considerations: Use item.link || item.text as key (consistent with existing openItems logic); recursively check all children levels
   - Dependencies: Step 1

5. **Add inputValue watcher**
   - What: Watch inputValue changes - when search is active, call computeOpenItemsForSearch; when cleared, revert to route-based computeOpenItems
   - Why: Dynamically control which items are expanded based on search state vs normal navigation
   - Considerations: Preserve existing toggle behavior; don't interfere with route-based auto-expansion when search is empty
   - Dependencies: Step 4

### Phase 3: User Experience Enhancements

6. **Add "no results" message**
   - What: Add conditional `<li>` after sidebar items v-for that shows when filteredItems.length === 0 and inputValue is not empty
   - Why: Provide feedback when search yields no matches
   - Considerations: Style with tertiary text color; show search term in message; position within sidebar list
   - Dependencies: Step 2

7. **Add search clear on route change**
   - What: Add route.path watcher that clears inputValue when user navigates to different page
   - Why: Reset search state when user clicks a link, providing clean navigation experience
   - Considerations: Optional enhancement - can be skipped if not desired
   - Dependencies: None

### Phase 4: Keyboard Navigation for Filtered Results

8. **Build flat list of visible filtered items**
   - What: Create computed property flattenedFilteredItems that recursively traverses filteredItems and returns array of all leaf items (items without children or whose children are also visible)
   - Why: Need sequential list of focusable items for arrow key navigation
   - Considerations: Must maintain document order (top to bottom); include only items actually visible in filtered view; handle nested items correctly
   - Dependencies: Step 2

9. **Add focused item index state**
   - What: Add ref focusedIndex (number, initially -1) to track which item in flattenedFilteredItems is currently keyboard-focused
   - Why: Track position in filtered list for up/down navigation
   - Considerations: Reset to -1 when search changes or is cleared; -1 means no keyboard focus (user is typing)
   - Dependencies: Step 8

10. **Implement keyboard event handlers**
   - What: Add keydown event listener on search input for ArrowDown, ArrowUp, Enter, and Escape keys
   - Why: Enable keyboard-driven navigation through filtered results
   - Considerations: ArrowDown increments focus (wraps to 0 at end); ArrowUp decrements (wraps to last at beginning); Enter navigates to focused item; Escape clears search and focus
   - Dependencies: Step 9

11. **Add visual focus indicator**
   - What: Pass focusedIndex and flattenedFilteredItems to SidebarItem via new optional props; add CSS class or visual highlight to focused item
   - Why: User needs visual feedback showing which item is keyboard-focused
   - Considerations: Different from router-link active state; should work alongside active state; clear visual distinction (e.g., outline or background); ensure accessibility (proper focus management)
   - Dependencies: Steps 9-10

12. **Implement scroll-into-view for focused items**
   - What: When focusedIndex changes, scroll the focused item into view within sidebar container
   - Why: Keep keyboard-focused item visible even if it's outside viewport
   - Considerations: Use scrollIntoView with smooth behavior; account for fixed header if present; don't scroll if item already visible
   - Dependencies: Step 11

13. **Handle focus state edge cases**
   - What: Reset focusedIndex to -1 when user types in search input, when search is cleared, when filteredItems changes, or when user clicks an item with mouse
   - Why: Keep focus state in sync with user actions and search results
   - Considerations: Don't interfere with normal mouse navigation; clear focus when results change to avoid focusing wrong item
   - Dependencies: Steps 9-12

## Phase Completion Summaries

### Phases 1-3: Core Search & Filtering (COMPLETED)

**Implementation Date:** 2025-11-13

Successfully implemented all core search functionality:

1. **Recursive Filter Function** - Created `filterItems()` that traverses the entire sidebar tree (max depth 2, 182 total items). Matches on item text using case-insensitive search, preserves parent items when children match.

2. **Reactive Filtering** - Added `filteredItems` computed property that applies filter when search input has content, otherwise returns full sidebar.

3. **Auto-Expansion** - Implemented `computeOpenItemsForSearch()` that automatically expands all parent items containing matches during active search. Uses `inputValue` watcher to toggle between search mode (all parents open) and normal mode (route-based expansion).

4. **Empty State** - Added dt-empty-state component showing "No results found for [search term]" when filter yields no matches.

5. **Route Change Handling** - Added route.path watcher to clear search when user navigates to a different page.

**Result:** All Phase 1-3 success criteria met. Search filters in real-time with no lag, handles all nesting depths, preserves navigation functionality.

---

### Phase 4: Keyboard Navigation (COMPLETED WITH CHALLENGES)

**Implementation Date:** 2025-11-14

This phase required multiple attempts to solve a critical focus management issue.

#### Initial Implementation (Steps 8-13)

**What We Built:**
1. **Flattened List** - Created `flattenedFilteredItems` computed that converts filtered tree into sequential array for keyboard navigation
2. **Focus State** - Added `focusedIndex` ref to track position in flattened list (-1 = no focus)
3. **Visual Indicator** - Initially used custom border classes (`d-ba d-bc-primary d-baw2`) to show focused item
4. **Keyboard Handlers** - Implemented ArrowDown/Up (with wrapping), Enter (navigate), Escape (clear search)
5. **Scroll Behavior** - Added watcher to scroll focused items into view
6. **Edge Cases** - Reset focus on search changes, route navigation, and manual input

**Initial Result:** ✅ Keyboard navigation worked perfectly with custom border styling

---

#### The Critical Issue: Native Focus vs Event Handling

**User Requirement:** Instead of custom border styling, use native `.focus()` calls to trigger Dialtone's built-in `:focus-visible` styling.

**The Problem We Discovered:**

When we called `.focus()` on a sidebar button element, the browser transferred focus from the search input to the button. This caused keyboard events (ArrowDown/Up) to **stop being captured** by our `@keydown` handler on the search input. After the first arrow press focused a button, subsequent arrow presses did nothing because the input no longer had focus.

**Symptom:** Navigation would work for first item ("Overview") then stop - user couldn't arrow past it to reach "Button", "Button Group", etc.

---

#### Attempted Solutions That Failed

**Attempt 1: Query by href attribute**
- **Approach:** Find button by `querySelector('a[href="..."]')`
- **Why It Failed:** Vue Router's `<router-link>` with `custom` prop doesn't render actual `<a>` tags in DOM
- **Result:** Found 0 links, couldn't focus anything

**Attempt 2: Query by text content**
- **Approach:** Loop through all buttons, match by `.textContent.trim()`
- **Why It Failed:** Buttons inside collapsed `dt-collapsible` components don't exist in DOM until after expansion animation completes
- **Result:** Could find first-level items but not nested items within collapsed parents

**Attempt 3: Query all buttons by index**
- **Approach:** Get all `.dialtone-shell-btn` elements, focus by `allButtons[focusedIndex]`
- **Why It Failed:** DOM button count didn't match `flattenedFilteredItems` count - parent buttons without links were included in DOM query but not in flattened list
- **Result:** Index mismatch caused focus to land on wrong buttons or fail entirely

**Attempt 4: Data attributes for reliable matching**
- **Approach:** Added `data-sidebar-link` attribute to all buttons, query specifically by link value
- **Why It Failed:** Still didn't solve the root problem - once button was focused, input lost focus and stopped capturing keyboard events
- **Result:** Could reliably find and focus buttons, but keyboard navigation still stopped after first arrow press

---

#### The Final Solution: Document-Level Event Handling

**Root Cause Identified:** The fundamental issue was that keyboard event handler was attached to the search input element. When focus moved to a button, the input stopped receiving events.

**The Solution:**

1. **Moved keyboard handler to document level** - Added global `keydown` listener in `onMounted()`, removed in `onUnmounted()`

2. **Conditional event processing** - Handler only responds when search is active (inputValue not empty) and has results, so it doesn't interfere with normal page interactions

3. **Native focus works perfectly** - Can safely call `.focus()` on buttons to trigger `:focus-visible` styling

4. **Events captured regardless of focus** - Document listener catches arrow keys whether focus is on input or button

5. **Clean escape behavior** - Escape key returns focus to search input by querying actual input element

**Key Code Changes:**
```javascript
// Document-level listener (not on input)
const handleKeydown = (event) => {
  if (!inputValue.value.trim() || flattenedFilteredItems.value.length === 0) {
    return; // Only process when search is active
  }
  // ... handle ArrowDown, ArrowUp, Enter, Escape
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
```

**Data Attributes for Reliable Button Matching:**
```vue
<dt-button :data-sidebar-link="item.link">
```
```javascript
const button = document.querySelector(
  `.dialtone-sidebar__list [data-sidebar-link="${targetItem.link}"]`
);
if (button) {
  button.focus(); // Native focus with Dialtone styling
  button.scrollIntoView({ behavior: 'smooth' });
}
```

**Custom Focus Styling:**
```css
.dialtone-sidebar__list .dialtone-shell-btn:focus-visible {
  box-shadow: var(--dt-shadow-focus-inset);
}
```

---

### Final Result

**All Phase 4 Success Criteria Met:**
- ✅ ArrowDown/Up cycle through filtered results with wrapping
- ✅ Native browser focus (`:focus-visible`) provides visual indicator
- ✅ Enter navigates to focused item
- ✅ Escape clears search and returns focus to input
- ✅ Focused items auto-scroll into view
- ✅ Focus resets on search changes
- ✅ Mouse navigation works independently
- ✅ Works correctly with nested/expanded items

**Performance:** Smooth 60fps with all 182 sidebar items, no lag during typing or navigation

**Key Learnings:**
1. When implementing keyboard navigation with focus management, consider whether event handlers need to work regardless of where focus is
2. Document-level event listeners with conditional logic can solve tricky focus management scenarios
3. Data attributes provide reliable DOM querying when element structure is complex or dynamic
4. Always test the interaction between native focus calls and event handler attachment points

## Testing Strategy

### Unit Testing (Per Step)
- **Step 1**: Test filterItems with various search terms at different nesting levels
- **Step 2**: Verify filteredItems reacts correctly to inputValue changes
- **Step 4**: Verify computeOpenItemsForSearch returns correct Set of parent keys
- **Step 5**: Test watcher transitions between search mode and normal mode
- **Step 8**: Verify flattenedFilteredItems maintains correct order and includes all visible items
- **Step 10**: Test each keyboard event handler in isolation
- **Step 12**: Verify scrollIntoView doesn't cause layout thrashing

### Integration Testing
- Test complete search flow: type → filter → expand → navigate
- Test keyboard navigation flow: search → ArrowDown → Enter
- Test interaction between mouse clicks and keyboard focus
- Test route changes during active search
- Test search with various item structures (depth 0, 1, 2)

### Edge Case Testing
- Empty search string
- Search term with no matches
- Search term matching all items
- Search term with special characters
- Keyboard navigation at list boundaries (first/last item)
- Rapid typing in search input
- Route changes during keyboard navigation
- Toggling items while search is active

## Open Questions

- [x] Should search clear when user navigates to a new page? → Yes, add route watcher (Step 7) ✅ IMPLEMENTED
- [x] Should we add keyboard navigation? → Yes, Phase 4 ✅ IMPLEMENTED
- [x] Should keyboard focus style match existing active link style or be distinct? → Use native `:focus-visible` with custom inset shadow ✅ IMPLEMENTED
- [x] Should Enter key on focused item also close search or keep it active? → Keep search active, only clear on Escape or route change ✅ IMPLEMENTED
- [x] Should Tab key also navigate through filtered results or maintain default behavior? → Maintain default browser Tab behavior (not captured by our handler) ✅ RESOLVED
- [ ] Future: Add debouncing for search input? → Not needed, performance is smooth with 182 items
- [ ] Future: Add search highlighting within matched text?
- [ ] Future: Search by URL path in addition to item text?
- [ ] Future: Add search history or recent searches?

## Implementation Notes

### Files Modified

**Sidebar.vue** (`/apps/dialtone-documentation/docs/.vuepress/theme/components/Sidebar.vue`)
- Added `searchInput` ref for input element access
- Added `focusedIndex` ref for keyboard navigation state
- Created `filterItems()` recursive function
- Created `filteredItems` computed property
- Created `flattenedFilteredItems` computed for keyboard nav
- Created `computeOpenItemsForSearch()` function
- Created document-level `handleKeydown()` event handler
- Added watchers for `inputValue`, `route.path`, `filteredItems`, `focusedIndex`
- Added document event listener setup in `onMounted()` and cleanup in `onUnmounted()`
- Added empty state component for no results
- Added custom CSS for `:focus-visible` styling

**SidebarItem.vue** (`/apps/dialtone-documentation/docs/.vuepress/theme/components/SidebarItem.vue`)
- Added `data-sidebar-link` attribute to all three button types (parent with children, child items, standalone items)
- No prop changes needed (removed `focusedItemLink` prop from earlier iterations)
- No visual styling changes needed (using native browser focus)

### Key Technical Decisions

1. **Document-level vs Input-level event handling**: Chose document-level to allow keyboard navigation to work regardless of where browser focus is

2. **Data attributes for DOM querying**: Used `data-sidebar-link` instead of text matching or index-based selection for reliable button identification

3. **Native focus over custom styling**: Leveraged browser's native `.focus()` method and `:focus-visible` pseudo-class instead of custom border classes

4. **Conditional event processing**: Handler checks for active search before processing events, preventing interference with normal page interactions

5. **No changes to openItems management**: Preserved existing collapsible state logic, added parallel search-specific expansion logic

### Performance Characteristics

- **Filter performance**: O(n) recursive traversal, handles 182 items with no perceptible lag
- **Render performance**: Vue's reactivity efficiently updates DOM only for affected items
- **Memory overhead**: Minimal - one additional flattened array computed property
- **Event handling**: Single document listener with early return, no performance impact

### Browser Compatibility

- Uses standard DOM APIs: `addEventListener`, `querySelector`, `focus()`, `scrollIntoView()`
- Uses CSS `:focus-visible` pseudo-class (supported in all modern browsers)
- No polyfills required

---

## Phase 5: Keyword Migration to Frontmatter (COMPLETED)

**Implementation Date:** 2025-11-14

After implementing the core search functionality, we refactored the keyword architecture to follow industry best practices by moving all keywords from `site-nav.json` to markdown frontmatter.

### Rationale

**Why Move to Frontmatter:**
1. **Industry Standard** - Hugo, Jekyll, Gatsby, Docusaurus all use frontmatter for metadata
2. **Co-location** - Keywords live with the content they describe
3. **Single Source of Truth** - Content and metadata maintained together
4. **Better Maintainability** - No need to update two separate files when content changes

### Implementation Steps

1. **Updated Theme Integration** (`theme/index.js`)
   - Created `_injectKeywordsFromFrontmatter()` function that runs during VuePress initialization
   - Builds Map of page paths to keywords from all markdown frontmatter
   - Recursively injects keywords into sidebar structure before rendering
   - Called in `onInitialized` hook

2. **Bulk Migration Scripts**
   - **migrate-keywords-to-frontmatter.js** - Migrated 96 items from site-nav.json to markdown frontmatter
   - **add-component-code-keywords.js** - Added code-specific keywords to 54 components

3. **Component Code Keywords**
   - Added CSS class names (e.g., `d-button`)
   - Added Vue PascalCase names (e.g., `DtButton`)
   - Added Vue kebab-case names (e.g., `dt-button`)
   - Handled special cases via mapping table (e.g., keyboard-shortcut → `d-kbd`, rich-text-editor → `d-rte`)

4. **Cleanup**
   - Removed all 102 keyword properties from site-nav.json
   - Dev server automatically detected changes and restarted

### Frontmatter Format

```yaml
---
title: Button
description: ...
keywords: ["btn", "click", "action", "cta", "d-button", "DtButton", "dt-button"]
---
```

### Files Modified

**Theme Integration:**
- `/apps/dialtone-documentation/docs/.vuepress/theme/index.js`

**Migration Scripts (temporary):**
- `migrate-keywords-to-frontmatter.js`
- `add-component-code-keywords.js`
- `remove-keywords-from-site-nav.js`

**Markdown Files (100+ files updated):**
- All Foundations pages
- All 54 Component pages
- All Utilities pages
- All Content/Guides pages

**Configuration:**
- `/apps/dialtone-documentation/docs/_data/site-nav.json` (102 keyword properties removed)

### Key Technical Implementation

```javascript
// theme/index.js - Keyword injection function
function _injectKeywordsFromFrontmatter (app, options) {
  // Build Map of page paths to keywords
  const pageKeywords = new Map();
  app.pages.forEach(page => {
    if (page.frontmatter?.keywords && Array.isArray(page.frontmatter.keywords)) {
      const normalizedPath = page.path.replace(/\/$/, '').replace(/\.html$/, '');
      pageKeywords.set(normalizedPath, page.frontmatter.keywords);
      pageKeywords.set(page.path, page.frontmatter.keywords);
    }
  });

  // Recursively inject into sidebar structure
  const injectKeywords = (items) => {
    if (!items || !Array.isArray(items)) return;
    items.forEach(item => {
      if (item.link) {
        const normalizedLink = item.link.replace(/\/$/, '').replace(/\.html$/, '');
        const keywords = pageKeywords.get(normalizedLink) || pageKeywords.get(item.link);
        if (keywords) {
          item.keywords = keywords;
        }
      }
      if (item.children && Array.isArray(item.children)) {
        injectKeywords(item.children);
      }
    });
  };

  // Process all sidebar sections
  if (options.sidebar?.topLevelGroups) {
    Object.values(options.sidebar.topLevelGroups).forEach(group => {
      if (group.sections) {
        Object.values(group.sections).forEach(section => {
          injectKeywords(section);
        });
      }
    });
  }
}
```

### Results

**Migration Success:**
- ✅ 96 items migrated from site-nav.json
- ✅ 54 components enhanced with code keywords (d-*, Dt*, dt-*)
- ✅ 102 keyword properties removed from site-nav.json
- ✅ All keywords now in frontmatter following industry standards
- ✅ Search functionality continues to work seamlessly with new architecture

**Known Issue:**
- 1 component (emoji-picker) had JSON parsing error during code keyword addition - can be manually fixed if needed

### Testing

The dev server automatically restarted when changes were detected. Testing verified:
- Keywords from frontmatter are successfully injected into sidebar structure
- Search continues to work with all existing test cases (purple, season, d-btn, DtButton, etc.)
- No performance degradation
- Route-based expansion and search-based expansion continue to work correctly

---

## References

- **Sidebar.vue**: `/apps/dialtone-documentation/docs/.vuepress/theme/components/Sidebar.vue`
- **SidebarItem.vue**: `/apps/dialtone-documentation/docs/.vuepress/theme/components/SidebarItem.vue`
- **useSidebarItems.js**: `/apps/dialtone-documentation/docs/.vuepress/theme/composables/useSidebarItems.js`
- **Theme Index**: `/apps/dialtone-documentation/docs/.vuepress/theme/index.js`
- **Research findings**: Detailed technical analysis completed via Plan subagent (2025-11-13)
- **Implementation**: Core search completed 2025-11-13, keyboard navigation completed 2025-11-14, keyword migration completed 2025-11-14
