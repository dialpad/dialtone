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

## Phase 21: Add Overview Cards to Dialtone Landing Page

**Note**: This phase was superseded by Phase 22, which replaced the hardcoded pages array with build-time frontmatter injection.

### Goal

Replace the "TBD" placeholder on the `/dialtone/` landing page with overview cards linking to the main Design System sections.

### Problem

The `/dialtone/` landing page showed only a placeholder "TBD" message, providing no navigation to the major Design System sections (Foundations, Components, CSS Utilities, Design Tokens, Content Guidelines).

### Solution

Use the existing `<overview>` component with a custom `pages` array to display cards for each major section.

### Implementation

**File**: `docs/dialtone/index.md`

Replaced the TBD empty state with:
```vue
<overview :pages="pages" />

<script setup>
const pages = [
  {
    title: 'Foundations',
    description: 'The fundamental design principles and elements that form the basis of Dialpad\'s design system.',
    link: '/foundations/',
  },
  {
    title: 'Components',
    description: 'Reusable components solving common UI needs, designed and built to be assembled in countless combinations.',
    link: '/components/',
  },
  {
    title: 'CSS Utilities',
    description: 'A utility-first CSS framework for building user interfaces.',
    link: '/utilities/',
  },
  {
    title: 'Design Tokens',
    description: 'Multi-platform values that make up Dialtone\'s design language',
    link: '/tokens/',
  },
  {
    title: 'Content Guidelines',
    shortTitle: 'Content',
    description: 'Guidelines to unify the way we communicate with our users.',
    link: '/guides/content/',
  },
];
</script>
```

### Technical Details

**Two Approaches for Overview Cards:**

1. **Auto-populated** (used on `/foundations/`, `/components/`, etc.):
   - Uses `<overview :pages="$page.enhancedFrontmatter" />`
   - Automatically gets child pages from the current section
   - Configured in `theme/index.js` via `_extractFrontmatter()`

2. **Custom pages array** (used here for `/dialtone/`):
   - Uses `<overview :pages="pages" />` with manual `pages` array
   - Allows linking to arbitrary sections (not just children)
   - Full control over which cards appear, their order, and descriptions

**Why Custom Array for This Page:**
- `/dialtone/` Overview section has children "What's New", "Getting Started", "Release Notes"
- We want to display the OTHER top-level sections: Foundations, Components, Utilities, Tokens, Content
- These are siblings in the navigation, not children, so auto-population wouldn't find them

**Reusable Pattern:**
This same pattern can be used on any page that needs custom overview cards:
1. Add `<overview :pages="pages" />` to the markdown
2. Add `<script setup>` block with `pages` array
3. Each page object needs: `title`, `description`, `link`
4. Optional fields: `shortTitle`, `status`, `thumb`, `fileName`

### Files Modified
1. `docs/dialtone/index.md` - Replaced TBD placeholder with 5 overview cards

### Result

✅ Landing page displays 5 cards for major Design System sections
✅ Each card shows title, description, and links to the section
✅ Reusable pattern established for custom overview cards on any page
✅ No theme changes needed - uses existing `<overview>` component

---

## Phase 22: Use Build-Time Frontmatter Injection for Overview Cards

### Goal

Replace hardcoded page descriptions in overview cards with dynamically fetched frontmatter from destination pages, eliminating duplication and ensuring single source of truth.

### Problem

Phase 21 introduced hardcoded descriptions in the `/dialtone/index.md` file that duplicated the descriptions already defined in each destination page's frontmatter. This created maintenance burden and risk of inconsistency.

### Solution

Implement build-time frontmatter injection using the existing `onInitialized` pattern, matching how `/components/`, `/guides/`, and `/foundations/` already work.

### Implementation

**File**: `docs/.vuepress/theme/index.js`

Added new `_injectOverviewPages()` function (lines 41-64):
```javascript
function _injectOverviewPages (app) {
  const dialtoneIndexPage = app.pages.find(page => page.path === '/dialtone/');
  if (!dialtoneIndexPage) return;

  const pagePaths = [
    '/components/',
    '/utilities/',
    '/tokens/',
    '/guides/content/',
    '/functions-and-utilities/',
  ];

  dialtoneIndexPage.data.overviewPages = pagePaths.map(path => {
    const page = app.pages.find(p => p.path === path);
    if (!page) return null;

    return {
      title: page.frontmatter.title,
      shortTitle: page.frontmatter.shortTitle,
      description: page.frontmatter.description,
      link: path,
    };
  }).filter(Boolean);
}
```

Called in `onInitialized` hook (line 209):
```javascript
onInitialized (app) {
  _blogPostsFrontmatter(app);
  _injectOverviewPages(app);  // Added this line
  // ... rest of initialization
}
```

Added to `extendsPage` (lines 231-233):
```javascript
case '/dialtone/':
  page.data.overviewPages = [];
  break;
```

**File**: `docs/dialtone/index.md`

Simplified to use injected data:
```vue
---
title: Dialtone Design System
description: Dialpad's design system for building consistent, accessible product experiences
---

<overview :pages="$page.overviewPages" />
```

### Technical Details

**Build-Time Data Injection Pattern:**
1. `extendsPage` initializes empty `page.data.overviewPages = []` array
2. `onInitialized` runs `_injectOverviewPages(app)` which:
   - Finds the `/dialtone/` page
   - Queries each destination page by path
   - Extracts frontmatter (title, description, etc.)
   - Populates `page.data.overviewPages` array
3. Markdown template accesses via `$page.overviewPages`

**Why This Is Better:**
- **Single source of truth**: Descriptions live in destination page frontmatter only
- **Zero duplication**: No need to maintain descriptions in multiple places
- **Consistent with codebase**: Uses same pattern as `/components/`, `/guides/`, `/foundations/`
- **No runtime overhead**: Data computed at build time
- **Type-safe**: All pages guaranteed to have frontmatter structure

**Note on `/foundations/` Page:**
The `/foundations/` page already uses `$page.enhancedFrontmatter` which auto-populates from its child pages via `_extractFrontmatter()`. It did not need changes in this phase.

### Files Modified
1. `docs/.vuepress/theme/index.js` - Added `_injectOverviewPages()` function and calls
2. `docs/dialtone/index.md` - Removed hardcoded `<script setup>` block, now uses `$page.overviewPages`

### Result

✅ Overview cards now pull descriptions from source pages automatically
✅ Zero duplication between pages
✅ Follows existing build-time injection pattern
✅ Easy to add/remove/reorder cards by changing `pagePaths` array
✅ Consistent with how `/components/`, `/guides/`, `/foundations/` work

---

## Phase 23: Add Thumbnail Images to Dialtone Overview Cards

### Goal

Add thumbnail images to the 5 overview cards on `/dialtone/` page to match the visual style of component overview cards.

### Problem

The overview cards displayed only text (title + description) without visual thumbnails, making them less engaging and harder to scan compared to the component overview cards which include image thumbnails.

### Solution

1. Add `thumb: true` to frontmatter of each destination page
2. Update `_injectOverviewPages()` to extract `thumb` and compute `fileName` properties
3. Copy existing "home-*" SVG files as placeholders for each section

### Implementation

**File**: `docs/.vuepress/theme/index.js` (lines 57-65)

Updated `_injectOverviewPages()` to extract thumbnail properties:
```javascript
const fileName = page.frontmatter.title.toLowerCase().replaceAll(' ', '-');

return {
  title: page.frontmatter.title,
  shortTitle: page.frontmatter.shortTitle,
  description: page.frontmatter.description,
  thumb: page.frontmatter.thumb,        // Added
  fileName: fileName,                    // Added
  link: path,
};
```

**Files**: Added `thumb: true` to frontmatter of 5 pages:
1. `docs/components/index.md` - Added `thumb: true`
2. `docs/utilities/index.md` - Added `thumb: true`
3. `docs/tokens/index.md` - Added `thumb: true`
4. `docs/guides/content/index.md` - Added `thumb: true`
5. `docs/functions-and-utilities/index.md` - Added `thumb: true`

**Files**: Copied SVG placeholders to `docs/.vuepress/public/assets/images/`:
- `components.svg` ← copied from `home-components.svg`
- `css-utilities.svg` ← copied from `home-utilities.svg`
- `design-tokens.svg` ← copied from `home-design.svg`
- `content-guidelines.svg` ← copied from `home-guides.svg`
- `functions-and-utilities.svg` ← copied from `home-components.svg` (temporary placeholder)

### Technical Details

**How Thumbnail Display Works:**
1. Page frontmatter has `thumb: true`
2. `fileName` is computed from title: `"CSS Utilities"` → `"css-utilities"`
3. Overview component checks `page.thumb` and renders `<svg-loader :name="page.fileName" />`
4. SvgLoader tries these paths in order:
   - `assets/images/css-utilities.svg`
   - `assets/images/components/css-utilities.svg`
   - `assets/images/favicons/css-utilities.svg`

**Placeholder SVG Files:**
All SVGs are copies of existing "home-*" SVGs:
- **Components**: Geometric shapes representing UI components
- **CSS Utilities**: Globe with wrench icon
- **Design Tokens**: Abstract design/palette icon
- **Content Guidelines**: Document with lines icon
- **Functions and Utilities**: (Same as Components) - can be replaced with custom icon later

### Files Modified
1. `docs/.vuepress/theme/index.js` - Extract thumb/fileName in `_injectOverviewPages()`
2. `docs/components/index.md` - Added `thumb: true`
3. `docs/utilities/index.md` - Added `thumb: true`
4. `docs/tokens/index.md` - Added `thumb: true`
5. `docs/guides/content/index.md` - Added `thumb: true`
6. `docs/functions-and-utilities/index.md` - Added `thumb: true`

### Files Created
1. `docs/.vuepress/public/assets/images/components.svg`
2. `docs/.vuepress/public/assets/images/css-utilities.svg`
3. `docs/.vuepress/public/assets/images/design-tokens.svg`
4. `docs/.vuepress/public/assets/images/content-guidelines.svg`
5. `docs/.vuepress/public/assets/images/functions-and-utilities.svg`

### Result

✅ All 5 overview cards now display thumbnail images
✅ Visual consistency with component overview cards
✅ Better visual hierarchy and scannability
✅ Easy to replace placeholders with custom icons later
✅ Follows existing thumbnail pattern from components

---

## Final Result (All Phases Complete)

✅ Release Notes accessible at `/dialtone/release-notes/`
✅ Blog index accessible at `/dialtone/whats-new/`
✅ All 19 blog posts accessible at new paths
✅ Blog post navigation highlighting working
✅ Getting Started integrated into Overview section
✅ Collapsible group for Getting Started sub-pages
✅ Dialtone landing page displays 5 overview cards for major sections
✅ Overview cards use build-time frontmatter injection (single source of truth)
✅ Overview cards display thumbnail images
✅ Zero duplication between pages
✅ Reusable pattern for custom overview cards documented
✅ All navigation working correctly
✅ Navbar highlights correctly
✅ Improved information architecture
✅ Visual consistency across overview pages

## Related Plans

- [Foundations Landing Page](./01-foundations-landing-page.md) - Original project
- [Navigation Flattening](./02-navigation-flattening.md) - Navigation patterns
- [Bug Fixes and Stability](./04-bug-fixes-stability.md) - Foundation for this work
