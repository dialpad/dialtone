# Image Organization and Multi-Format Fallback System

## Overview

**Status:** Paused - Blocked by Vite Build Limitations
**Created:** 2025-01-12
**Last Updated:** 2025-01-12
**Stopped At:** Phase 2 - Component Updates

Reorganize all documentation images into a clear directory structure with proper namespacing, and add support for PNG/JPG/WebP fallback formats in addition to SVG for overview card thumbnails.

## Why This Plan Was Paused

This plan was paused due to a fundamental limitation with Vite's build system that prevents the implementation approach from working as designed.

### Critical Blocker: Vite Dynamic Import Limitations

**Problem:** Vite cannot analyze dynamic imports with runtime-determined paths from the `public` directory.

When attempting to use organized subdirectories like `/assets/images/overview/foundations/`, Vite throws these errors:
- "The above dynamic import cannot be analyzed by Vite"
- "Assets in public directory cannot be imported from JavaScript"
- Module script MIME type errors (expects JavaScript, receives SVG/HTML)

**Technical Detail:** The SvgLoader component uses Vite's `?component` query to convert SVGs into Vue components at build time. This requires static import paths that Vite can analyze during the build process. Dynamic paths computed from props (like `namespace`) cannot be analyzed, causing imports to fail.

**Attempted Workarounds:**
1. ✗ Computed paths with known directories - Vite still cannot analyze
2. ✗ Runtime fallback logic - Works for raster images but not SVG components
3. ✗ Maintaining duplicate files in both locations - Works but defeats the purpose of organization

### Where We Stopped

**Completed Work (Reverted):**
- ✅ Phase 1: Created organized directory structure and moved all files
- ✅ Phase 2 Step 6: Updated SvgLoader with namespace and fallback props
- ✅ Phase 2 Step 7: Updated Overview component to pass namespace
- ✅ Phase 2 Step 8: Updated theme frontmatter extraction with namespace logic

**What Didn't Work:**
The organized structure worked perfectly for file organization, but Vite's build system couldn't load the SVGs from the new paths without maintaining duplicate copies in the legacy root location.

## Goals

- Create scalable directory structure organized by feature context
- Support multiple image formats with fallback priority (SVG → PNG → JPG → WebP)
- Move all foundation detail images into organized subdirectories
- Improve maintainability and clarity of image organization
- Enable easier addition of new images and formats

## Non-Goals

- Converting existing SVG files to other formats (can be added incrementally)
- Changing image content or design
- Modifying other components beyond SvgLoader and Overview
- Performance optimization beyond basic lazy loading

## Success Criteria

- All overview card images organized in `/assets/images/overview/` subdirectories
- Foundation detail images organized in `/assets/images/foundations/{topic}/` subdirectories
- SvgLoader component supports namespace prop and multi-format fallback
- All 7 overview pages render correctly with new structure
- PNG/JPG/WebP fallback works when SVG unavailable
- No broken images or console errors
- Clear documentation for future image additions

## Constraints & Guardrails

**Technical Constraints:**

- Must maintain Vite's SVG component loading for existing SVGs
- Cannot break existing pages during migration
- Build-time imports have limitations (can't use arbitrary runtime strings)
- Vue component mode only works for SVG format
- **NEW:** Vite cannot analyze dynamic import paths from public directory

**Business Constraints:**

- Migration must be completed in single deployment
- No downtime or broken pages acceptable
- Must maintain backward compatibility during transition

**Documentation Principle:**

- After implementation, update documentation to explain new image organization
- Create guidelines for adding future images
- Document fallback behavior for contributors

**Key Risks:**

- ~~Vite build errors with dynamic imports~~ **CONFIRMED: This is a blocker**
- Missing images after migration: Mitigate by comprehensive testing of all pages
- Performance impact from multiple format attempts: Mitigate with smart fallback logic and caching

## Learnings & Recommendations for Future Attempts

### Technical Learnings

1. **Vite's Build-Time Import Analysis Limitation**
   - Vite uses static analysis to determine imports at build time
   - Dynamic paths constructed from props/variables cannot be analyzed
   - The `?component` query for SVG-to-Vue conversion only works with static paths
   - Public directory assets are meant for runtime reference, not build-time imports

2. **SVG Component Loading Pattern**
   - Current pattern: `import('../public/assets/images/${name}.svg?component')`
   - This works only when `name` is a static string known at build time
   - Cannot use computed/concatenated paths with variable subdirectories

3. **Workaround That Almost Worked**
   - Maintaining files in both organized + legacy locations works
   - But defeats the purpose of organization (duplicate files)
   - Adds maintenance burden (must update both locations)

### Alternative Approaches to Consider

#### Option 1: Move SVGs Out of Public Directory ✅ RECOMMENDED
**Approach:** Move SVG files from `docs/.vuepress/public/` to `docs/.vuepress/assets/`

**Rationale:**
- Files in source directories (not `public`) can use Vite's import.meta.glob
- Allows dynamic imports with pattern matching at build time
- Vite can properly analyze and bundle these imports

**Implementation:**
```javascript
// In SvgLoader.vue
const modules = import.meta.glob('../assets/images/**/*.svg?component')

// Then dynamically load
const path = `../assets/images/${namespace}${name}.svg?component`
const component = await modules[path]()
```

**Pros:**
- Works with Vite's build system
- True dynamic loading with organization
- No duplicate files needed

**Cons:**
- Requires moving ~100+ image files
- Changes asset path structure
- May affect other parts of documentation

#### Option 2: Build-Time SVG Sprite Generation ✅ VIABLE
**Approach:** Generate an SVG sprite sheet at build time combining all overview SVGs

**Implementation:**
- Add build step to concatenate SVGs into sprite sheet
- Update SvgLoader to use `<use>` references instead of dynamic imports
- Organize source SVGs however desired

**Pros:**
- Single HTTP request for all overview images
- Better performance
- Organization doesn't affect runtime

**Cons:**
- Requires build process changes
- Need to handle SVG ID conflicts
- Sprite sheet might be large

#### Option 3: Static Import Mapping ✅ VIABLE BUT LIMITED
**Approach:** Create static import map at build time for known subdirectories

**Implementation:**
```javascript
// svg-imports.js (generated or manual)
export const svgComponents = {
  'overview/foundations/logo': () => import('../public/assets/images/overview/foundations/logo.svg?component'),
  'overview/foundations/color': () => import('../public/assets/images/overview/foundations/color.svg?component'),
  // ... all other known images
}
```

**Pros:**
- Works within Vite's constraints
- Allows organized structure
- Type-safe with TypeScript

**Cons:**
- Manual maintenance of import map
- Adding new images requires code changes
- Doesn't scale well for large image sets

#### Option 4: Defer Organization, Focus on Multi-Format Fallback ✅ PRACTICAL
**Approach:** Keep current flat structure, only implement format fallback

**Implementation:**
- Don't move files, keep in root/components
- Only add PNG/JPG/WebP fallback capability
- Simplify implementation significantly

**Pros:**
- Solves user's original format support request
- No Vite build issues
- Simpler implementation

**Cons:**
- Doesn't improve organization
- Root directory remains cluttered
- Future maintenance still challenging

### Recommendation

**Best Path Forward: Option 1 (Move to Assets Directory)**

This is the most sustainable solution that achieves both goals:
1. Organized directory structure
2. Multi-format fallback support

**Implementation Steps:**
1. Move all SVGs from `docs/.vuepress/public/assets/images/` to `docs/.vuepress/assets/images/`
2. Update SvgLoader to use `import.meta.glob` for dynamic loading
3. Implement namespace-based path resolution
4. Add multi-format fallback for raster images (PNG/JPG/WebP)
5. Update all references throughout documentation

**Estimated Effort:** 2-3 days (larger scope but cleaner solution)

**Alternative: Option 4 (Just Add Format Support)**

If timeline is critical and organization can wait:
1. Keep existing file structure
2. Add PNG/JPG/WebP fallback logic only
3. Organize files in future when migration path is clearer

**Estimated Effort:** 4-6 hours (minimal changes, immediate value)

## Implementation Steps (Original Plan)

### Phase 1: Directory Structure (Complete - Reverted)

1. **Create new directory hierarchy**
   - What: Create `/overview/`, `/overview/foundations/`, `/overview/design-system/`, `/overview/components/`, `/foundations/logo/`, `/foundations/color/`, `/foundations/icons/`
   - Why: Organize images by context for better maintainability
   - Status: ✅ Complete (Reverted)

2. **Move overview card images**
   - What: Move foundation cards (logo, color, typography, icons, illustrations, space, size) to `/overview/foundations/`
   - Why: Clear separation of overview thumbnails from other assets
   - Status: ✅ Complete (Reverted)

3. **Move design system card images**
   - What: Move components, css-utilities, design-tokens, content-guidelines, functions-and-utilities to `/overview/design-system/`
   - Why: Namespace design system section cards separately
   - Status: ✅ Complete (Reverted)

4. **Move component card images**
   - What: Move `/components/` directory to `/overview/components/`
   - Why: Group all overview cards together under `/overview/`
   - Status: ✅ Complete (Reverted)

5. **Move foundation detail images**
   - What: Move all `logo--*`, `color--*`, `icon--*` files to respective `/foundations/{topic}/` subdirectories
   - Why: Organize detail images by topic, prevent root directory clutter
   - Status: ✅ Complete (Reverted)

### Phase 2: Component Updates (Blocked)

6. **Update SvgLoader component**
   - What: Add `namespace` and `fallbackFormats` props, implement multi-format fallback logic
   - Why: Enable organized paths and support non-SVG formats
   - Status: ✅ Complete (Reverted) - **BLOCKED by Vite**

7. **Update Overview component**
   - What: Pass `namespace` prop to SvgLoader based on page context
   - Status: ✅ Complete (Reverted) - **BLOCKED by Vite**

8. **Update theme frontmatter extraction**
   - What: Modify `_extractFrontmatter()` to include `namespace` field based on path
   - Status: ✅ Complete (Reverted) - **BLOCKED by Vite**

### Phase 3: Content Updates (Not Started)

9-10. **Update markdown files** - ⏳ Not Started

### Phase 4: Testing & Validation (Not Started)

11-13. **Testing** - ⏳ Not Started

### Phase 5: Cleanup & Documentation (Not Started)

14-15. **Cleanup** - ⏳ Not Started

## Expected Final Structure

```
/assets/images/
├── overview/                              # All overview card thumbnails
│   ├── foundations/                       # Foundation overview cards
│   │   ├── logo.svg
│   │   ├── color.svg (+ .png fallback if needed)
│   │   ├── typography.svg
│   │   ├── icons.svg
│   │   ├── illustrations.svg
│   │   ├── space.svg
│   │   └── size.svg
│   ├── design-system/                     # Design system section cards
│   │   ├── components.svg
│   │   ├── css-utilities.svg
│   │   ├── design-tokens.svg
│   │   ├── content-guidelines.svg (+ fallback formats)
│   │   └── functions-and-utilities.svg
│   └── components/                        # Component cards (96 files: SVG + PNG versions)
│       ├── avatar.svg / avatar.png
│       ├── button.svg / button.png
│       └── ... (48 components × 2 formats)
├── foundations/                           # Foundation detail images
│   ├── logo/                              # Logo detail images
│   │   ├── logo--alignment.svg
│   │   ├── logo--clear-space.svg
│   │   ├── logo--sample-01.jpg
│   │   └── ... (12 logo detail files)
│   ├── color/                             # Color detail images
│   │   ├── color--expanded.svg
│   │   ├── color--focused.svg
│   │   ├── color--sample-01.jpg
│   │   └── ... (5 color detail files)
│   └── icons/                             # Icon detail images
│       ├── icon--billboard.svg
│       ├── icon--in-product.svg
│       ├── icon--usage.svg
│       └── icon--versions.svg
├── content/                               # Content guideline images (unchanged)
├── favicons/                              # Browser icons (unchanged)
└── [other files remain in root]           # Misc/legacy images
```

## Technical Implementation Details

### SvgLoader Component Changes (Attempted)

**New Props:**
- `namespace` (String): Subdirectory path for organized images (e.g., 'overview/foundations/')
- `fallbackFormats` (Array): Format priority order (default: ['svg', 'png', 'jpg', 'webp'])

**Path Resolution Strategy (Didn't Work):**
1. Try SVG as Vue component (build-time import) in new structure paths ❌ Blocked by Vite
2. Fall back to legacy paths for backward compatibility ✅ Works
3. If all SVGs fail, try raster formats at runtime using Image() preloading ✅ Works

### Fallback Behavior

**Format Priority:** SVG → PNG → JPG → WebP

For each image request:
1. **SVG (Build-time)**: Try importing SVG as Vue component using Vite's `?component` query ❌ Can't work with dynamic paths
2. **PNG (Runtime)**: If SVG fails, preload PNG image using `new Image()` ✅ Works
3. **JPG (Runtime)**: If PNG fails, try JPG ✅ Works
4. **WebP (Runtime)**: If JPG fails, try WebP ✅ Works
5. **Silent Fail**: If all formats fail, show no image (current behavior)

## Open Questions

- [ ] Should we move forward with Option 1 (move to assets directory)?
- [ ] Or implement Option 4 (just add format fallback, defer organization)?
- [ ] Do we need WebP format support immediately or can it wait?
- [ ] Should we explore Option 2 (SVG sprite generation)?

## References

- SvgLoader component: `/apps/dialtone-documentation/docs/.vuepress/baseComponents/SvgLoader.vue`
- Overview component: `/apps/dialtone-documentation/docs/.vuepress/views/Overview.vue`
- Theme configuration: `/apps/dialtone-documentation/docs/.vuepress/theme/index.js`
- Colors navigation restructure: `/docs/plans/active/colors-navigation-restructure.md`
- Vite Dynamic Import Vars Limitations: https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
- Vite import.meta.glob documentation: https://vitejs.dev/guide/features.html#glob-import
