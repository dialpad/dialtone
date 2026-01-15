# Container Query Support for Dialtone Utility Classes

## Overview

Add CSS container query variants to Dialtone's utility class system with the syntax `c-xs:d-p-8`, `c-sm:d-p-8`, etc. This allows utility classes to respond to container size rather than viewport size.

## User Requirements

1. **Syntax**: `c-xs:`, `c-sm:`, `c-md:`, `c-lg:` prefixes (e.g., `c-sm:d-p-8`)
2. **Breakpoints**:
   - Default: xs(320px), sm(480px), md(640px), lg(960px) - smaller than media queries
   - Configurable: Support custom breakpoints via build-time configuration
3. **Container Classes**: `.d-container-inline`, `.d-container-size`, `.d-container-normal`
4. **Utility Coverage**: Generate container variants for ALL utilities

## Architecture Decision

Create a new PostCSS plugin `@dialpad/postcss-container-variations` that mirrors the existing `postcss-responsive-variations` plugin structure but generates `@container` queries instead of `@media` queries.

**Rationale**: Separate plugin allows independent configuration, cleaner implementation, and follows the monorepo pattern of focused packages.

## Implementation Steps

### 1. Create PostCSS Container Variations Plugin

**Location**: `/packages/postcss-container-variations/`

**Files**:
- `index.js` - Main plugin implementation
- `package.json` - Package configuration
- `README.md` - Documentation

**Plugin Logic** (based on `postcss-responsive-variations`):
```javascript
// Core implementation mirrors postcss-responsive-variations/index.js
// but uses @container instead of @media

const defaultBreakpoints = [
  { prefix: 'c-xs\\:', query: '(min-width: 320px)' },
  { prefix: 'c-sm\\:', query: '(min-width: 480px)' },
  { prefix: 'c-md\\:', query: '(min-width: 640px)' },
  { prefix: 'c-lg\\:', query: '(min-width: 960px)' },
];

// Walk CSS rules, create @container at-rules, clone utility classes with c-* prefix
```

**Key Differences from Media Queries**:
- Uses `@container` instead of `@media` at-rule
- Different prefix (`c-xs:` vs `sm:`)
- Smaller default breakpoints

### 2. Add Container Type Utility Classes

**File**: `/packages/dialtone-css/lib/build/less/utilities/layout.less`

**Add to end of file**:
```less
//  ============================================================================
//  $   CONTAINER QUERIES
//  ----------------------------------------------------------------------------

.d-container-inline {
  container-type: inline-size !important;
}

.d-container-size {
  container-type: size !important;
}

.d-container-normal {
  container-type: normal !important;
}
```

### 3. Update Constants

**File**: `/packages/dialtone-css/postcss/constants.cjs`

**Add**:
```javascript
CONTAINER_BREAKPOINTS: {
  xs: '320',
  sm: '480',
  md: '640',
  lg: '960',
},
```

### 4. Configure Build Pipeline

**File**: `/packages/dialtone-css/gulpfile.cjs` (line ~188)

**Modify `libStyles` function PostCSS pipeline**:
```javascript
const postCSSContainerVariations = settings.styles
  ? require('@dialpad/postcss-container-variations')
  : null;

// In libStyles function (line 188):
.pipe(postCSS([
  postCSSDialtoneGenerator,
  postCSSContainerVariations({
    breakpoints: [
      { prefix: 'c-xs\\:', query: '(min-width: 320px)' },
      { prefix: 'c-sm\\:', query: '(min-width: 480px)' },
      { prefix: 'c-md\\:', query: '(min-width: 640px)' },
      { prefix: 'c-lg\\:', query: '(min-width: 960px)' },
    ],
    classes: [
      // Match all generated utility classes
      /^\\.d-m(t|r|b|l|x|y|all)?(-|n)?\d+$/,  // Margin
      /^\\.d-p(t|r|b|l|x|y|all)?\d+$/,        // Padding
      /^\\.d-w(mn|mx)?\d+$/,                   // Width
      /^\\.d-h(mn|mx)?\d+$/,                   // Height
      /^\\.d-(t|r|b|l|x|y|all)(-|n)?\d+$/,    // Position
      /^\\.d-g(c|r)?\d+$/,                     // Gap
      /^\\.d-(fc|bgc|bc|dc)-[\\w-]+$/,        // Colors
      /^\\.d-(fco|bgo|bco|dco)\\d+$/,         // Opacity
      /^\\.d-bar\\d+$/,                        // Border radius
      /^\\.d-fc\\d+-[\\w-]+$/,                // Flex columns
      /^\\.d-of\\d+-[\\w-]+$/,                // Grid
    ],
  }),
  autoprefixer()
]))
```

**Also update `libStylesDev` function** (line ~195) with same changes for development builds.

**File**: `/packages/dialtone-css/package.json`

**Add dependency**:
```json
"devDependencies": {
  "@dialpad/postcss-container-variations": "workspace:*"
}
```

### 5. Define Utility Class Patterns

The plugin needs regex patterns to match generated utility classes. Based on `dialtone-generators.cjs`, these categories are generated:

**Generated Utilities** (from `dialtone-generators.cjs` line 30-95):
- Font colors (`.d-fc-*`, `.d-fco*`)
- Border colors (`.d-bc-*`, `.d-bco*`)
- Background colors (`.d-bgc-*`, `.d-bgo*`)
- Divider colors (`.d-dc-*`, `.d-dco*`)
- Background gradients (`.d-bggfc-*`, `.d-bggtc-*`)
- Flex columns (`.d-fc*-*`)
- Border radius (`.d-bar*`)
- Gap utilities (`.d-g*`, `.d-gr*`, `.d-gc*`)
- Grid utilities (`.d-of*-*`)
- Position utilities (`.d-t*`, `.d-r*`, `.d-b*`, `.d-l*`, `.d-x*`, `.d-y*`, `.d-all*`)
- Height/Width (`.d-h*`, `.d-w*`, `.d-hmn*`, `.d-hmx*`, `.d-wmn*`, `.d-wmx*`)
- Margin (`.d-m*`, `.d-mt*`, `.d-mr*`, `.d-mb*`, `.d-ml*`, `.d-mx*`, `.d-my*`)
- Padding (`.d-p*`, `.d-pt*`, `.d-pr*`, `.d-pb*`, `.d-pl*`, `.d-px*`, `.d-py*`)

### 6. Expected CSS Output

**Input CSS** (from generators):
```css
.d-p-8 { padding: var(--dt-space-400) !important; }
.d-fc-primary { color: oklch(from var(--dt-color-foreground-primary) l c h / var(--fco)) !important; }
```

**Output CSS** (after container-variations plugin):
```css
/* Original classes */
.d-p-8 { padding: var(--dt-space-400) !important; }
.d-fc-primary { color: oklch(from var(--dt-color-foreground-primary) l c h / var(--fco)) !important; }

/* Container query variants */
@container (min-width: 320px) {
  .c-xs\:d-p-8 { padding: var(--dt-space-400) !important; }
  .c-xs\:d-fc-primary { color: oklch(from var(--dt-color-foreground-primary) l c h / var(--fco)) !important; }
}

@container (min-width: 480px) {
  .c-sm\:d-p-8 { padding: var(--dt-space-400) !important; }
  .c-sm\:d-fc-primary { color: oklch(from var(--dt-color-foreground-primary) l c h / var(--fco)) !important; }
}

/* ... c-md and c-lg variants ... */
```

## Usage Example

```html
<!-- Container element with inline-size query type -->
<div class="d-container-inline">
  <!-- Child adapts to container width, not viewport -->
  <div class="d-p-4 c-sm:d-p-8 c-md:d-p-16 c-lg:d-p-24">
    <h2 class="d-fs-200 c-md:d-fs-300 c-lg:d-fs-400">Responsive Heading</h2>
    <p class="d-w100p c-sm:d-w50p">Content that responds to container size</p>
  </div>
</div>
```

## Implementation Order

1. **Plugin Development** - Create `postcss-container-variations` package
2. **Container Classes** - Add `.d-container-*` utilities to layout.less
3. **Constants** - Add container breakpoints to constants.cjs
4. **Build Integration** - Configure plugin in gulpfile.cjs
5. **Documentation** - Copy this plan file to docs for reference
6. **Testing** - Build and verify output

## Critical Files

- [postcss-responsive-variations/index.js](../packages/postcss-responsive-variations/index.js) - Template for new plugin
- [dialtone-css/postcss/dialtone-generators.cjs](../packages/dialtone-css/postcss/dialtone-generators.cjs) - Utility class generator
- [dialtone-css/gulpfile.cjs](../packages/dialtone-css/gulpfile.cjs) - Build pipeline (line 188)
- [dialtone-css/postcss/constants.cjs](../packages/dialtone-css/postcss/constants.cjs) - Configuration constants
- [dialtone-css/lib/build/less/utilities/layout.less](../packages/dialtone-css/lib/build/less/utilities/layout.less) - Layout utilities

## Configuration Options

The plugin will support build-time configuration:

```javascript
postcssContainerVariations({
  // Custom breakpoints
  breakpoints: [
    { prefix: 'c-xs\\:', query: '(min-width: 400px)' },  // Override default
    { prefix: 'c-xxl\\:', query: '(min-width: 1200px)' }, // Add new breakpoint
  ],
  // Custom class patterns
  classes: [
    /^\\.d-p\\d+$/,  // Only padding utilities
  ],
})
```

## Browser Support

Container queries are supported in:
- Chrome 105+ (Sep 2022)
- Firefox 110+ (Feb 2023)
- Safari 16+ (Sep 2022)

No polyfill needed for Dialtone's target audience.

## Bundle Size Impact

- **Estimated increase**: +15-20% uncompressed CSS
- **After gzip**: ~5-10% increase
- **Mitigation**: Minification, gzip compression, future PurgeCSS integration

## Testing & Verification

### Build Verification
```bash
# Build CSS
pnpm --filter @dialpad/dialtone-css run build

# Verify @container rules exist
grep -n "@container" packages/dialtone-css/lib/dist/dialtone.css

# Check file size
ls -lh packages/dialtone-css/lib/dist/dialtone.min.css
```

### Manual Testing
Create test page with resizable container:
```html
<div class="d-container-inline" style="resize: horizontal; overflow: auto; width: 300px; border: 2px solid blue;">
  <div class="d-bgc-surface-secondary d-p-4 c-sm:d-p-8 c-md:d-p-16">
    Resize container to see padding change
  </div>
</div>
```

### Expected Behavior
- At < 320px: `d-p-4` (base padding)
- At 320-479px: `c-xs:d-p-8` applies
- At 480-639px: `c-sm:d-p-8` applies
- At 640-959px: `c-md:d-p-16` applies
- At 960px+: `c-lg:d-p-24` applies

## Future Enhancements

1. **Named Containers** - Add support for `container-name` via data attributes
2. **Container Query Units** - Add utilities using `cqw`, `cqh` units
3. **Style Queries** - Add support for `@container style()` when browser support improves
4. **PurgeCSS Integration** - Remove unused container variants
5. **Custom Properties** - Explore CSS variable-based breakpoint overrides (when spec supports it)

## Non-Breaking Changes

- Purely additive feature
- No changes to existing utility classes
- Requires explicit opt-in via `.d-container-*` classes
- Backwards compatible

## Success Criteria

- ✅ Plugin generates valid `@container` at-rules
- ✅ All utility classes have `c-xs:`, `c-sm:`, `c-md:`, `c-lg:` variants
- ✅ `.d-container-inline`, `.d-container-size`, `.d-container-normal` classes exist
- ✅ Build completes without errors
- ✅ CSS output validated in target browsers
- ✅ File size increase < 20%
- ✅ Plan file copied to documentation for reference

## Plan File Location

During implementation, this plan will be copied to a permanent location for reference:

- **Source**: `/Users/dialpadje/.claude/plans/elegant-pondering-boot.md`
- **Destination**: Suggest copying to `/docs/utilities/` or similar location in the documentation
- **Purpose**: Preserve implementation context and design decisions for future reference
