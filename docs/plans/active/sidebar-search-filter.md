# Sidebar Search/Filter Feature

## Overview

**Status:** In Progress
**Created:** 2025-11-13
**Last Updated:** 2025-11-13

Implement real-time search functionality for the left sidebar navigation that filters all items recursively across all nesting levels. When a search term is entered, only matching items and their parent paths are shown, with all parent items automatically expanded to reveal matches. The search input has already been added to Sidebar.vue.

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

[Will be added as phases complete]

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

- [x] Should search clear when user navigates to a new page? → Yes, add route watcher (Step 7)
- [x] Should we add keyboard navigation? → Yes, Phase 4
- [ ] Should keyboard focus style match existing active link style or be distinct?
- [ ] Should Enter key on focused item also close search or keep it active?
- [ ] Should Tab key also navigate through filtered results or maintain default behavior?
- [ ] Future: Add debouncing for search input (unlikely needed with 182 items)?
- [ ] Future: Add search highlighting within matched text?
- [ ] Future: Search by URL path in addition to item text?

## References

- **Sidebar.vue**: `/apps/dialtone-documentation/docs/.vuepress/theme/components/Sidebar.vue`
- **SidebarItem.vue**: `/apps/dialtone-documentation/docs/.vuepress/theme/components/SidebarItem.vue`
- **useSidebarItems.js**: `/apps/dialtone-documentation/docs/.vuepress/theme/composables/useSidebarItems.js`
- **Research findings**: Detailed technical analysis completed via Plan subagent (2025-11-13)
