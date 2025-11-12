# Fix Sidebar Double-Active State for Grouping-Only Parents

## Overview

**Status:** Complete
**Created:** 2025-01-12
**Last Updated:** 2025-01-12

Fix the sidebar navigation issue where both parent and child items show as active when viewing a child page under a "grouping-only" parent (a parent that doesn't have its own page, but whose link points to its first child for navigation purposes).

## Goals

- Only child items should show active state when viewing grouping-only parent pages
- Parents with actual pages should continue to show active when viewing their page
- Maintain all existing navigation functionality (collapse/expand, keyboard nav, etc.)

## Non-Goals

- Changing the navigation data structure in site-nav.json
- Modifying how parent links work (still navigate to first child)
- Restructuring the controlled component pattern from Phase 12

## Success Criteria

- When viewing `/utilities/layout/box-sizing.html`, only "Box Sizing" shows active (not "Layout")
- All 11 utility subcategories exhibit correct behavior
- When viewing `/foundations/colors/usage/`, "Colors" parent shows active (has its own page)
- When viewing `/foundations/colors/palette/`, only "Color Palette" child shows active
- No regressions in collapse/expand, keyboard navigation, or mobile behavior

## Constraints & Guardrails

**Technical Constraints:**

- Must work within existing controlled component pattern (Sidebar.vue manages state, SidebarItem.vue is presentational)
- Cannot break Vue Router's isExactActive behavior for other navigation items
- Must support all 3 levels of sidebar nesting

**Business Constraints:**

- All 11 utility subcategories are affected (Backgrounds, Borders, Effects, Flex, Grid, Interactivity, Layout, Responsive, Sizing, Spacing, Typography)
- Must not break special cases like "What's New" blog post highlighting

**Documentation Principle:**

- After implementation, update this plan with Phase Completion Summary
- Document any deviations from original approach

**Key Risks:**

- False positives: Might incorrectly identify a real parent page as "grouping-only" - Mitigation: Test all navigation sections thoroughly
- Edge cases with identical parent/child URLs that are intentional - Mitigation: Manual review of all affected items before implementation

## Implementation Steps

### Phase 1: Update Active State Logic

1. **Modify isActiveLink() function in SidebarItem.vue**
   - What: Add detection for grouping-only parents (where parent link === first child link)
   - Why: These parents shouldn't show active state when viewing their children
   - Location: `/apps/dialtone-documentation/docs/.vuepress/theme/components/SidebarItem.vue` lines 185-194
   - Logic: If item has children AND item.link equals first child's link, return false for active state
   - Considerations: Preserve special case for blog posts; maintain isSinglePage hash-based logic

### Phase 2: Testing

2. **Test all 11 utility subcategories**
   - What: Navigate to first child of each utility subcategory, verify only child shows active
   - Why: These are the primary affected items
   - Test URLs: All pages matching pattern `/utilities/*/[first-child].html`
   - Expected: Parent collapsible button does NOT show active, only child link shows active

3. **Test parent pages with their own content**
   - What: Navigate to `/foundations/colors/usage/` and verify parent shows active
   - Why: Ensure parents with real pages still work correctly
   - Expected: "Colors" parent shows active when viewing usage page

4. **Test child pages under parents with real pages**
   - What: Navigate to `/foundations/colors/palette/` and verify only child shows active
   - Why: Ensure children of real parents work correctly
   - Expected: Only "Color Palette" child shows active, not "Colors" parent

5. **Test navigation functionality**
   - What: Verify clicking, keyboard nav, mobile nav, collapse/expand all still work
   - Why: Ensure no regressions in existing functionality
   - Tests: Click parent to navigate, Tab through items, expand/collapse sections, test on mobile viewport

6. **Test URL state restoration**
   - What: Refresh page while on affected URLs, verify correct active state
   - Why: Ensure server-side rendering and hydration work correctly
   - Expected: Same behavior as initial navigation

## Phase Completion Summaries

### Phase 1 Complete (2025-01-12)

**Completed:**

- Modified `isActiveLink()` function in SidebarItem.vue to detect grouping-only parents
- Added `isParentButton` parameter to distinguish parent button context from child button context
- Updated parent button call site (line 30) to pass `isParentButton=true`

**Implementation Details:**

- Initial approach checked `link === props.item.link` to identify parent context
- Issue discovered: When child link matches parent link (grouping-only case), both buttons reference same props.item, causing child to incorrectly return false
- Solution: Added explicit `isParentButton` parameter (default false) to function signature
- Check only applies when `isParentButton=true` AND parent link matches first child link
- Preserved all existing functionality: blog post highlighting, single-page hash navigation

**Files Modified:**

- `/apps/dialtone-documentation/docs/.vuepress/theme/components/SidebarItem.vue` (lines 185-204)

**Deviations from Plan:**

- Required two implementation attempts to handle parent/child button context correctly
- Final solution simpler than anticipated - single function parameter addition

**Testing Results:**

- ✅ All 11 utility subcategories now show only child as active (not parent)
- ✅ Layout > Box Sizing: Only "Box Sizing" shows active
- ✅ Grid > Columns: Only "Columns" shows active
- ✅ Effects & Transitions > Box Shadow: Only "Box Shadow" shows active
- ✅ No regressions in collapse/expand behavior
- ✅ No regressions in navigation functionality
- ✅ Parents with real pages (e.g., Colors) still show active correctly

**Blockers/Issues:**

- None

## Open Questions

- [x] Are there any intentional cases where parent link should equal first child AND both should show active?
  - **Resolved**: No intentional cases found. All 11 utility subcategories now work correctly with only child showing active.
- [ ] Should we document this pattern in site-nav.json with comments for future maintainers?
  - **Future consideration**: Could add comments to clarify grouping-only parent pattern for maintainability.
- [x] Do breadcrumbs or other navigation components rely on this active state behavior?
  - **Resolved**: No regressions detected. All navigation components continue to work correctly.

## References

- Original Navigation Restructure: `/docs/plans/archive/navigation-ia-restructure.md` (Phase 12 - Controlled Component Pattern)
- Navigation Flattening: `/docs/plans/archive/02-navigation-flattening.md`
- Component Files: `SidebarItem.vue` (lines 185-194), `Sidebar.vue` (lines 34-97)
- Navigation Data: `/docs/_data/site-nav.json`
