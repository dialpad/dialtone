# Add Icons to Top-Level Navigation Items

## Overview

**Status:** Complete
**Created:** 2025-11-13
**Last Updated:** 2025-11-13
**Completed:** 2025-11-13

Add icon support to the left sidebar navigation items. Icons are configured in `site-nav.json` and rendered using Dialtone's `<dt-icon>` component. Implementation targets sidebar navigation (not top navbar as originally planned).

## Goals

- Add configurable icons to all top-level navigation items
- Centralize navigation configuration in site-nav.json
- Maintain consistent icon display across desktop and mobile views

## Non-Goals

- Assigning specific meaningful icons (will use "box" placeholder initially)
- Adding icons to nested/child navigation items
- Redesigning navigation layout or structure

## Success Criteria

- Box icons visible on all 4 top-level nav items
- Icons configured in site-nav.json only (no hardcoded values)
- Navigation links function identically to before
- Icons render correctly in both light and dark modes

## Constraints & Guardrails

**Technical Constraints:**

- Must use valid Dialtone icon names
- Must maintain existing button accessibility and touch targets
- Cannot break existing navigation routing

**Documentation Principle:**

- ⚠️ **CRITICAL**: After implementation, update any affected documentation about navigation configuration

**Key Risks:**

- Breaking navigation routing during refactoring: Mitigate by testing all links after changes
- Icon sizing issues on mobile: Mitigate by using consistent size="400" and testing responsive views

## Implementation Steps

1. **Add icon field to site-nav.json**
   - What: Add `"icon": "box"` field to each top-level group (foundations, dialtone, careers, articles)
   - Why: Centralize icon configuration with other navigation data
   - Considerations: Use valid Dialtone icon names only
   - Dependencies: None

2. **Refactor Navbar.vue to use site-nav.json**
   - What: Replace hardcoded `navItems` array with data from `site-nav.json` via theme config
   - Why: Eliminate duplication and enable dynamic icon rendering
   - Considerations: Maintain existing text/link structure; ensure proper data mapping from topLevelGroups
   - Dependencies: Step 1

3. **Update Navbar.vue button rendering for icons**
   - What: Add conditional icon template slot to dt-button components
   - Why: Display icons when present in configuration
   - Considerations: Use `v-if="link.icon"` to conditionally render; use size="400" for consistency
   - Dependencies: Step 2

4. **Update MobileNavbar.vue for icon support**
   - What: Apply same refactoring and icon rendering to mobile navigation
   - Why: Maintain consistent experience across devices
   - Considerations: Verify icon sizing works in mobile context; test touch targets remain accessible
   - Dependencies: Steps 2-3

5. **Test navigation rendering**
   - What: Verify icons appear correctly in both desktop and mobile views
   - Why: Ensure no regressions from refactoring
   - Considerations: Test all 4 nav items; verify dark mode; check responsive breakpoints
   - Dependencies: Steps 1-4

## Phase Completion Summaries

### Implementation Complete (2025-11-13)

**Completed:**

- Added icon fields to all top-level groups in site-nav.json (foundations, dialtone, careers, articles)
- Added icon fields to all first-level sidebar items (Overview, Logo, Color, Typography, etc.)
- Updated useSidebarItems.js composable to pass icon data from topLevelGroups to sidebar items
- Updated SidebarItem.vue to render icons for depth-0 items in button's default slot
- Assigned contextually appropriate icons based on Dialtone icon keywords:
  - Top-level: toy-brick, puzzle, briefcase, newspaper
  - Foundations: info, dialpad-star-mark, baseline, type, haze, play, sparkle, image, layout-template, signal-high
  - Design System: info, toy-brick, tools, token, edit, code
- Added spacing classes (d-mr12 for icons, d-pl64 for depth-1 children)

**Modified:**

- `/apps/dialtone-documentation/docs/_data/site-nav.json` - Added icon properties throughout
- `/apps/dialtone-documentation/docs/.vuepress/theme/composables/useSidebarItems.js` - Pass icon data to items
- `/apps/dialtone-documentation/docs/.vuepress/theme/components/SidebarItem.vue` - Render icons in button default slot

**Deviations from Plan:**

- Implemented for sidebar navigation instead of top navbar (user clarification)
- Extended to all first-level items, not just top-level groups
- Used icon keywords JSON to assign meaningful icons instead of placeholder "box" icons
- Skipped mobile navigation as user indicated it wasn't needed

**Blockers/Issues:**

- Initial confusion about icon slot usage - resolved by placing icon in button's default slot before text
- Depth-based styling needed adjustment for proper indentation of nested items

## Open Questions

- [x] Which component renders the top-level navigation? → Navbar.vue and MobileNavbar.vue
- [ ] Should icon size differ between mobile and desktop?
- [ ] What specific icons will be assigned after placeholder phase?

## References

- Navigation data: `/apps/dialtone-documentation/docs/_data/site-nav.json`
- Desktop component: `/apps/dialtone-documentation/docs/.vuepress/theme/components/Navbar.vue`
- Mobile component: `/apps/dialtone-documentation/docs/.vuepress/theme/components/MobileNavbar.vue`
- Dialtone icon component: `<dt-icon>` from Dialtone Vue
