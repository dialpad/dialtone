# Split Icons Page into Multiple Pages

## Overview

**Status:** In Progress
**Created:** 2025-01-12
**Last Updated:** 2025-01-12

Split the `/foundations/icons/index.md` page into three separate pages to improve content organization and navigation: a main Icons page with the icon catalog, a Usage page with implementation guidance, and a Crafting page with icon creation instructions.

## Goals

- Improve content discoverability by separating different use cases
- Make the icon catalog the primary focus of the main page
- Provide dedicated pages for usage guidance and icon creation
- Follow existing patterns from the Colors foundation section

## Non-Goals

- Changing the icon catalog component functionality
- Modifying the IconCatalog.vue component itself
- Restructuring content within the sections (just moving sections as-is)

## Success Criteria

- Main Icons page loads with icon catalog as primary content
- Usage page accessible at `/foundations/icons/usage/` with all usage guidance
- Crafting page accessible at `/foundations/icons/crafting-an-icon/` with creation instructions
- Navigation shows Icons with two child pages: "Usage" and "Crafting an Icon"
- All internal references updated and working
- No broken links from external pages

## Constraints & Guardrails

**Technical Constraints:**

- Must maintain existing URL structure for main icons page (`/foundations/icons/`)
- Vue script components must move with their corresponding content
- Image references must continue to work (relative paths)
- Embedded Figma prototype must remain functional

**Business Constraints:**

- Icon catalog must remain easily accessible (primary user flow)
- External links to `/foundations/icons/` should not break
- Search functionality on icon catalog must continue to work

**Documentation Principle:**

- After implementation, update this plan with Phase Completion Summary
- Document any content adjustments made during the split

**Key Risks:**

- Vue script dependencies might break if not moved correctly - Mitigation: Move entire `<script setup>` block with Usage section
- Internal anchor links might break - Mitigation: Update all references to use full paths
- External pages linking to specific sections - Mitigation: Verify and update the one known reference in components/icon.md

## Implementation Steps

### Phase 1: Create New Directory Structure

1. **Create Usage directory and file**
   - What: Create `/foundations/icons/usage/` directory with `index.md`
   - Why: Houses the usage guidance content
   - Considerations: Use kebab-case naming convention

2. **Create Crafting directory and file**
   - What: Create `/foundations/icons/crafting-an-icon/` directory with `index.md`
   - Why: Houses the icon creation content
   - Considerations: Use kebab-case naming convention following existing patterns

### Phase 2: Move Content to New Pages

3. **Create Usage page content**
   - What: Copy entire "## Usage" section (lines 11-135) from icons/index.md to usage/index.md
   - Why: Separate implementation guidance from catalog
   - Includes: In Figma, In Vue, Choosing the Right Icon, Sizing subsections
   - Includes: Vue `<script setup>` block (lines 138-163) for interactive examples
   - Add frontmatter: title, description, figma_url (copy from parent)

4. **Create Crafting page content**
   - What: Copy entire "## Crafting an Icon" section from icons/index.md to crafting-an-icon/index.md
   - Why: Separate creation guidance for contributors
   - Includes: On Figma, Exporting subsections
   - Includes: Embedded Figma prototype iframe
   - Add frontmatter: title, description, figma_url (copy from parent)

5. **Update main Icons page**
   - What: Remove "## Usage" and "## Crafting an Icon" sections from icons/index.md
   - Why: Keep only the icon catalog as primary content
   - Keep: Frontmatter, Icon Catalog component, brief intro if needed
   - Remove: Vue script block (moved to Usage page)

### Phase 3: Update Navigation

6. **Update site-nav.json**
   - What: Add children array to Icons entry (around line 38-41)
   - Why: Show new pages in sidebar navigation
   - Structure:
     ```json
     {
       "text": "Icons",
       "link": "/foundations/icons/",
       "children": [
         {
           "text": "Usage",
           "link": "/foundations/icons/usage/"
         },
         {
           "text": "Crafting an Icon",
           "link": "/foundations/icons/crafting-an-icon/"
         }
       ]
     }
     ```
   - Considerations: Keep parent link pointing to main page (not first child, unlike Colors pattern)

### Phase 4: Update Cross-References

7. **Update internal self-reference**
   - What: Find and update reference to `#crafting-an-icon` anchor in icons/index.md (line 62)
   - Why: Anchor link will break when section moves to new page
   - Update to: `/foundations/icons/crafting-an-icon/` or `../crafting-an-icon/`

8. **Verify external references**
   - What: Check and verify links from other pages still work
   - Known references:
     - `/components/icon.md` line 15: Links to icon catalog (should still work)
     - `/foundations/brand/index.md` line 15: Links with search param (should still work)
   - Why: Ensure no broken links from external pages

### Phase 5: Testing

9. **Test main Icons page**
   - What: Navigate to `/foundations/icons/` and verify icon catalog displays
   - Why: Ensure primary user flow works
   - Verify: Icon search works, catalog component loads correctly

10. **Test Usage page**
    - What: Navigate to `/foundations/icons/usage/` and verify all content displays
    - Why: Ensure moved content renders correctly
    - Verify: Figma GIF loads, Vue interactive examples work, all subsections visible

11. **Test Crafting page**
    - What: Navigate to `/foundations/icons/crafting-an-icon/` and verify all content displays
    - Why: Ensure moved content renders correctly
    - Verify: Figma prototype iframe loads, all subsections visible

12. **Test navigation**
    - What: Verify Icons shows children in sidebar, clicking navigates correctly
    - Why: Ensure navigation structure works as expected
    - Verify: Parent and children show in sidebar, active states work correctly

13. **Test cross-references**
    - What: Click all updated links to verify they navigate correctly
    - Why: Ensure no broken links
    - Verify: Internal and external references all work

## Phase Completion Summaries

[Will be added as phases complete]

## Open Questions

- [ ] Should we add a brief introduction/overview on the main Icons page above the catalog?
- [ ] Should we add navigation hints or "Next steps" links between the three pages?
- [ ] Do we want to follow the Colors pattern (parent link to first child) or keep it pointing to main page?

## References

- Current Icons page: `/foundations/icons/index.md`
- Colors multi-page example: `/foundations/colors/` (usage, palette, chart-colors, themes)
- Navigation config: `/_data/site-nav.json`
- IconCatalog component: `/docs/.vuepress/views/IconCatalog.vue`
