# Add Icons to Top-Level Navigation Items

## Overview

**Status:** In Progress
**Created:** 2025-11-13
**Last Updated:** 2025-11-13

Add icon support to the top-level navigation items ("Foundations", "Design System", "Careers", "Articles") in both desktop and mobile navigation. Icons will be configured in `site-nav.json` and rendered using Dialtone's `<dt-icon>` component.

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

[Will be added as implementation progresses]

## Open Questions

- [x] Which component renders the top-level navigation? → Navbar.vue and MobileNavbar.vue
- [ ] Should icon size differ between mobile and desktop?
- [ ] What specific icons will be assigned after placeholder phase?

## References

- Navigation data: `/apps/dialtone-documentation/docs/_data/site-nav.json`
- Desktop component: `/apps/dialtone-documentation/docs/.vuepress/theme/components/Navbar.vue`
- Mobile component: `/apps/dialtone-documentation/docs/.vuepress/theme/components/MobileNavbar.vue`
- Dialtone icon component: `<dt-icon>` from Dialtone Vue
