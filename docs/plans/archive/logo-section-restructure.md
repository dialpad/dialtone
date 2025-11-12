# Restructure Logo Section with Child Pages

## Overview

**Status:** Complete
**Created:** 2025-01-12
**Last Updated:** 2025-01-12

Split the Logo page (`/foundations/brand/`) into a parent overview with 4 child pages: "Using our Logo", "Our Icon", "Sub-brands and Co-branding", and "Samples".

## Goals

- Organize logo-related content into focused, separate pages
- Create clear information architecture for brand guidelines
- Follow established patterns from Colors and Icons foundations
- Enable scalable expansion of brand documentation

## Non-Goals

- Populating content for stub pages (Our Icon, Sub-brands, Samples)
- Creating actual brand guidelines content
- Changing URL structure for external compatibility

## Success Criteria

- Logo parent page shows TBD placeholder
- 4 child pages accessible and listed in navigation
- Using our Logo contains all original usage content
- Navigation shows Logo with 4 children
- Overview page exceptions prevent children from appearing in Foundations overview

## Implementation Summary

### Phase 1: Create Directory Structure
Created 4 new directories under `/foundations/brand/`:
- `using-our-logo/` with `index.md` - Contains original logo usage content
- `our-icon/` with `index.md` - TBD stub
- `sub-brands-and-co-branding/` with `index.md` - TBD stub
- `samples/` with `index.md` - TBD stub

### Phase 2: Content Migration
- Moved all content from `/foundations/brand/index.md` to `using-our-logo/index.md`
- Updated title to "Using our Logo"
- Content includes: logo color variants, wordmark options, monochrome options, usage guidelines

### Phase 3: Update Parent Page
Replaced `/foundations/brand/index.md` with TBD placeholder:
- Title: "Logo"
- Empty state component with "TBD" message
- Added `no_preview: true` frontmatter
- Follows same pattern as Colors foundation

### Phase 4: Navigation Updates
Updated `site-nav.json` (lines 12-33):
- Parent link: `/foundations/brand/`
- Added 4 children:
  1. Using our Logo
  2. Our Icon
  3. Sub-brands and Co-branding
  4. Samples

### Phase 5: Build Configuration
Updated `index.js` line 232:
- Added 4 brand child paths to exceptions array
- Prevents child pages from appearing in Foundations overview
- Maintains clean overview page structure

## Phase Completion Summary

**All phases completed successfully.**

**Files Created:**
- `/foundations/brand/using-our-logo/index.md`
- `/foundations/brand/our-icon/index.md`
- `/foundations/brand/sub-brands-and-co-branding/index.md`
- `/foundations/brand/samples/index.md`

**Files Modified:**
- `/foundations/brand/index.md` - Converted to TBD placeholder
- `/_data/site-nav.json` - Added children structure
- `/.vuepress/theme/index.js` - Added exceptions

**Final Structure:**
```
Logo (TBD page)
├── Using our Logo (full content)
├── Our Icon (TBD)
├── Sub-brands and Co-branding (TBD)
└── Samples (TBD)
```

## Open Questions

- [x] Should Logo parent be TBD or redirect? → TBD placeholder chosen
- [x] Should Using our Logo be in children list? → Yes, listed as first child
- [ ] What content should populate the 3 stub pages?
- [ ] Should we add overview page for brand children?

## References

- Icons page split pattern: `/docs/plans/archive/icons-page-split.md`
- Colors foundation structure: `/foundations/colors/` (parent with children)
- Navigation config: `/_data/site-nav.json`
- Build configuration: `/.vuepress/theme/index.js`
