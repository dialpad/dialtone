# Dialtone Overview Section

**Date**: 2025-01-11
**Status**: ✅ Completed
**Related Branch**: `dialpad-design-hub`
**Part of**: Phases 16-18 following [Bug Fixes and Stability](./04-bug-fixes-stability.md)

## Overview

Create a new Overview section as the first item in the Design System navigation, representing the Dialtone design system itself. Initially created with placeholders, later populated with Release Notes and What's New blog content migrated from the `/about/` section.

## Phase 16: Create Overview Section with Placeholders

### Requirements

1. Add `/dialtone/` section above Components in site-nav.json
2. Include parent item with 2 placeholder children
3. Remove redirect from `/dialtone/` to `/guides/getting-started/`
4. Getting Started remains at bottom of Design System sections

### Implementation

**File**: `docs/_data/site-nav.json` (line 61, before Components):
```json
"/dialtone/": [
  {
    "text": "Overview",
    "link": "/dialtone/",
    "children": [
      {
        "text": "Placeholder 1",
        "link": "/dialtone/placeholder-1/"
      },
      {
        "text": "Placeholder 2",
        "link": "/dialtone/placeholder-2/"
      }
    ]
  }
],
```

**File**: `docs/.vuepress/theme/client.js` - Removed redirect logic

### Files Modified
1. `docs/_data/site-nav.json` - Added Overview section with placeholders
2. `docs/.vuepress/theme/client.js` - Removed `/dialtone/` redirect

---

## Phase 17: Fix Navbar Active State Highlighting

### Problem

"Design System" navbar item wasn't highlighting when navigating to `/dialtone/` or nested pages.

### Root Cause

The `isActiveLink` function in `Navbar.vue` was checking for link text ("design system") in the route path, which didn't match routes like `/dialtone/`, `/components/`, etc.

### Solution

Update `isActiveLink` function to check actual link paths:

**File**: `docs/.vuepress/theme/components/Navbar.vue`

**Template change** (line 14):
```vue
<!-- Before -->
:class="{ 'd-btn--active': isActiveLink(link.text) }"

<!-- After -->
:class="{ 'd-btn--active': isActiveLink(link.link) }"
```

**Function update** (lines 365-373):
```javascript
const isActiveLink = (link) => {
  // For Design System, check all related paths
  if (link === '/dialtone/') {
    const designSystemPaths = ['/components/', '/utilities/', '/tokens/', '/guides/', '/about/', '/dialtone/'];
    return designSystemPaths.some(p => route.path.includes(p));
  }
  // For other links, use simple path matching
  return route.path.startsWith(link);
};
```

### Result
✅ "Design System" highlights when on `/dialtone/`
✅ Also highlights on nested pages: `/components/`, `/utilities/`, `/tokens/`, `/guides/`, `/about/`

### Files Modified
1. `docs/.vuepress/theme/components/Navbar.vue` - Updated active link detection

---

## Phase 18: Migrate About Content to Overview Section

### Goals

1. Create Release Notes page from `/about/dialtone.md` content
2. Move entire What's New blog from `/about/whats-new/` to `/dialtone/whats-new/`
3. Update all hardcoded paths to preserve blog functionality
4. Update GitHub Actions workflow for new blog post location

User explicitly stated: "I don't care about breaking existing links for anything moved from `/about/` to `/dialtone/`"

### Implementation

**Step 1: Create Release Notes Page**
- Created `/docs/dialtone/release-notes.md` with content from `/about/dialtone.md`
- Preserved `<dialtone-changelog />` component and all formatting

**Step 2: Move Blog Directory**
- Moved `/docs/about/whats-new/` → `/docs/dialtone/whats-new/`
- Includes 19 blog posts from 2022-2025

**Step 3: Update Navigation**
- `docs/_data/site-nav.json`: Replaced placeholders with "What's New" (first) and "Release Notes" (second)

**Step 4: Update Blog Plugin Paths**
- `docs/.vuepress/theme/index.js` (3 locations):
  - Line 29: Blog index path
  - Line 31: Posts filter path
  - Line 205: extendsPage case

**Step 5: Update Vue Components**
- `BlogPostPreview.vue` (line 4): Post link generation
- `IconPopoverContent.vue` (line 95): Hardcoded blog link

**Step 6: Update Layout Navigation**
- `Layout.vue` (lines 182-184): Breadcrumb navigation paths

**Step 7: Update Cross-References**
- `2024-10-3.md` (line 11): Internal blog link
- `2024-5-15.md` (line 23): Absolute URL to blog post
- `breakpoints.md` (line 142): Absolute URL to blog post

**Step 8: Update GitHub Actions**
- `.github/workflows/send-blog-communications.yml`:
  - Lines 7, 31: Changed trigger paths
  - Lines 59, 150: sed commands automatically work (replace `apps/dialtone-documentation/docs/` prefix)

### Blog System Architecture Preserved

- **VuePress Plugin**: Automatically discovers posts in new location
- **BlogPostPreview**: Generates preview cards
- **Date-Based URLs**: Posts at `/dialtone/whats-new/posts/YYYY-M-D.html`
- **GitHub Actions**: Sends email and SMS notifications for new posts
- **Breadcrumb Navigation**: "Back to what's new" link from individual posts

### Additional User Refinements

After automated migration, user made improvements:
1. **Reordered children**: "What's New" first (more frequently updated), then "Release Notes"
2. **Additional navigation improvements**: Maintained consistency with new structure

### Files Modified in Phase 18

1. `docs/dialtone/release-notes.md` - NEW: Release Notes page
2. `docs/dialtone/whats-new/` - MOVED: Entire blog directory with 19 posts
3. `docs/_data/site-nav.json` - Updated with Release Notes and What's New
4. `docs/.vuepress/theme/index.js` - Updated blog plugin paths (3 locations)
5. `docs/.vuepress/baseComponents/BlogPostPreview.vue` - Updated link generation
6. `docs/.vuepress/baseComponents/IconPopoverContent.vue` - Updated hardcoded link
7. `docs/.vuepress/theme/layouts/Layout.vue` - Updated breadcrumbs
8. `docs/dialtone/whats-new/posts/2024-10-3.md` - Updated cross-reference
9. `docs/dialtone/whats-new/posts/2024-5-15.md` - Updated absolute URL
10. `docs/utilities/responsive/breakpoints.md` - Updated absolute URL
11. `.github/workflows/send-blog-communications.yml` - Updated trigger paths

## Result After Phase 18

✅ Release Notes accessible at `/dialtone/release-notes/`
✅ Blog index accessible at `/dialtone/whats-new/`
✅ All 19 blog posts accessible at new paths
✅ Blog previews display with proper links
✅ Breadcrumb navigation works from posts
✅ GitHub Actions triggers on new posts
✅ Navbar highlights correctly
✅ Dialtone Overview section complete with real content

---

## Phase 19: Move Getting Started to Overview Section

### Goal

Move "Getting Started" from the bottom of Design System sections to become a sibling of "What's New" and "Release Notes" inside the Overview section, creating a collapsible group for its sub-pages.

### Problem

Getting Started was located at the bottom of all Design System sections, separate from the Overview section where it logically belongs as introductory content.

### Solution

**Navigation-only change** - Keep files at `/guides/*` paths, only update site-nav.json structure.

### Implementation

**File**: `docs/_data/site-nav.json`

**Added Getting Started as third child under `/dialtone/` Overview section:**
```json
"/dialtone/": [
  {
    "text": "Overview",
    "link": "/dialtone/",
    "children": [
      {
        "text": "What's New",
        "link": "/dialtone/whats-new/"
      },
      {
        "text": "Release Notes",
        "link": "/dialtone/release-notes/"
      },
      {
        "text": "Getting Started",
        "link": "/guides/getting-started/",
        "children": [
          {
            "text": "Theme and Mode",
            "link": "/guides/theme-and-mode/"
          },
          {
            "text": "Contributing",
            "link": "/guides/contributing/"
          },
          {
            "text": "Accessibility",
            "link": "/guides/accessibility/"
          }
        ]
      }
    ]
  }
]
```

**Removed** the separate `/guides/` section entry (lines 737-756) that previously held Getting Started.

### Why This Approach?

- ✅ **Minimal risk**: Only 1 file changes
- ✅ **No broken links**: All URLs stay the same
- ✅ **No file moves**: Content stays at `/guides/*` paths
- ✅ **No theme updates needed**: `/guides/` directory still exists with other content
- ✅ **Collapsible groups work**: Theme already supports nested children pattern

### Files Modified
1. `docs/_data/site-nav.json` - Moved Getting Started structure to Overview section

### Result

✅ Getting Started appears under Overview in sidebar
✅ Creates collapsible group with 3 sub-items (Theme and Mode, Contributing, Accessibility)
✅ All existing URLs continue to work
✅ Navigation order: What's New → Release Notes → Getting Started
✅ Better information architecture with introductory content grouped together

---

## Phase 20: Highlight "What's New" When Viewing Blog Posts

### Goal

When viewing a blog post (e.g., `/dialtone/whats-new/posts/2025-8-22.html`), the "What's New" parent item should be highlighted in the sidebar navigation.

### Problem

Blog posts are dynamically generated and not listed in `site-nav.json`, so the existing navigation logic doesn't recognize them as children of "What's New". When viewing a blog post, no sidebar item is highlighted.

### Solution

Add path-prefix matching in both `Sidebar.vue` and `SidebarItem.vue` to recognize blog post URLs as children of "What's New".

### Implementation

**File**: `apps/dialtone-documentation/docs/.vuepress/theme/components/Sidebar.vue` (lines 46-49)

Added special case in `isRouteInTree()` function within the `checkChildren` helper:
```javascript
// Special case: Treat blog posts as children of What's New
if (child.link === '/dialtone/whats-new/' && routePath.startsWith('/dialtone/whats-new/posts/')) {
  return true;
}
```

**Key Implementation Detail**: The check must be inside the `checkChildren` recursive function to properly detect when a child item ("What's New") should be considered active, which then causes its parent ("Overview") to expand.

**File**: `apps/dialtone-documentation/docs/.vuepress/theme/components/SidebarItem.vue` (lines 186-189)

Added special case in `isActiveLink()` function:
```javascript
// Special case: Highlight What's New when viewing blog posts
if (link === '/dialtone/whats-new/' && route.path.startsWith('/dialtone/whats-new/posts/')) {
  return true;
}
```

### Technical Details

**Why Two Changes?**
1. **Sidebar.vue** - Controls which navigation sections expand (parent items)
2. **SidebarItem.vue** - Controls which specific links are highlighted (active state)

**Pattern Used**: Path-prefix matching similar to breadcrumb logic in `Layout.vue:182-184`

### Files Modified
1. `apps/dialtone-documentation/docs/.vuepress/theme/components/Sidebar.vue` - Added blog post expansion logic
2. `apps/dialtone-documentation/docs/.vuepress/theme/components/SidebarItem.vue` - Added blog post highlighting

### Result

✅ "What's New" highlights when viewing any blog post at `/dialtone/whats-new/posts/*`
✅ Overview section automatically expands when on blog post
✅ Consistent with other navigation behavior patterns

---

## Final Result (All Phases Complete)

✅ Release Notes accessible at `/dialtone/release-notes/`
✅ Blog index accessible at `/dialtone/whats-new/`
✅ All 19 blog posts accessible at new paths
✅ Blog post navigation highlighting working
✅ Getting Started integrated into Overview section
✅ Collapsible group for Getting Started sub-pages
✅ All navigation working correctly
✅ Navbar highlights correctly
✅ Improved information architecture

## Related Plans

- [Foundations Landing Page](./01-foundations-landing-page.md) - Original project
- [Navigation Flattening](./02-navigation-flattening.md) - Navigation patterns
- [Bug Fixes and Stability](./04-bug-fixes-stability.md) - Foundation for this work
