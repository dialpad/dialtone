# CSS Logical Properties Migration Plan for Dialtone

This document outlines the comprehensive strategy for migrating Dialtone's CSS and LESS files from physical directional properties to CSS Logical Properties, ensuring international accessibility and RTL support while maintaining backward compatibility.

## Overview

**Goal**: Migrate all physical directional properties to logical equivalents to improve internationalization support, particularly for RTL (right-to-left) languages.

**Scope**: All `.css` and `.less` files in the Dialtone design system, focusing on:

- Utility classes (`/utilities/`)
- Component styles (`/components/`)
- Base styles and resets
- Theme and variable files
- **PostCSS generators** (`/postcss/dialtone-generators.cjs`)

## CSS Logical Properties Reference

### Complete Property Mappings

#### Margin Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `margin-top` | `margin-block-start` | Start of block axis |
| `margin-bottom` | `margin-block-end` | End of block axis |
| `margin-left` | `margin-inline-start` | Start of inline axis |
| `margin-right` | `margin-inline-end` | End of inline axis |
| `margin: top right bottom left` | `margin: block-start inline-end block-end inline-start` | Shorthand order changes |

#### Padding Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `padding-top` | `padding-block-start` | Start of block axis |
| `padding-bottom` | `padding-block-end` | End of block axis |
| `padding-left` | `padding-inline-start` | Start of inline axis |
| `padding-right` | `padding-inline-end` | End of inline axis |
| `padding: top right bottom left` | `padding: block-start inline-end block-end inline-start` | Shorthand order changes |

#### Border Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `border-top` | `border-block-start` | Border at start of block |
| `border-bottom` | `border-block-end` | Border at end of block |
| `border-left` | `border-inline-start` | Border at start of inline |
| `border-right` | `border-inline-end` | Border at end of inline |
| `border-top-width` | `border-block-start-width` | Width only |
| `border-top-style` | `border-block-start-style` | Style only |
| `border-top-color` | `border-block-start-color` | Color only |

#### Border Radius Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `border-top-left-radius` | `border-start-start-radius` | Block-start + inline-start |
| `border-top-right-radius` | `border-start-end-radius` | Block-start + inline-end |
| `border-bottom-left-radius` | `border-end-start-radius` | Block-end + inline-start |
| `border-bottom-right-radius` | `border-end-end-radius` | Block-end + inline-end |

#### Positioning Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `top` | `inset-block-start` | Position from block start |
| `bottom` | `inset-block-end` | Position from block end |
| `left` | `inset-inline-start` | Position from inline start |
| `right` | `inset-inline-end` | Position from inline end |
| `top`, `right`, `bottom`, `left` | `inset: block-start inline-end block-end inline-start` | Shorthand |

#### Size Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `width` | `inline-size` | Size in inline direction |
| `height` | `block-size` | Size in block direction |
| `min-width` | `min-inline-size` | Minimum inline size |
| `max-width` | `max-inline-size` | Maximum inline size |
| `min-height` | `min-block-size` | Minimum block size |
| `max-height` | `max-block-size` | Maximum block size |

#### Text Alignment

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `text-align: left` | `text-align: start` | Align to text start |
| `text-align: right` | `text-align: end` | Align to text end |

#### Float Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `float: left` | `float: inline-start` | Float to inline start |
| `float: right` | `float: inline-end` | Float to inline end |
| `clear: left` | `clear: inline-start` | Clear inline start |
| `clear: right` | `clear: inline-end` | Clear inline end |

#### Overflow Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `overflow-x` | `overflow-inline` | Overflow in inline direction |
| `overflow-y` | `overflow-block` | Overflow in block direction |
| `overscroll-behavior-x` | `overscroll-behavior-inline` | Overscroll in inline direction |
| `overscroll-behavior-y` | `overscroll-behavior-block` | Overscroll in block direction |

#### Resize Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `resize: horizontal` | `resize: inline` | Resize in inline direction |
| `resize: vertical` | `resize: block` | Resize in block direction |

#### Scroll Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `scroll-margin-top` | `scroll-margin-block-start` | Scroll margin at block start |
| `scroll-margin-bottom` | `scroll-margin-block-end` | Scroll margin at block end |
| `scroll-margin-left` | `scroll-margin-inline-start` | Scroll margin at inline start |
| `scroll-margin-right` | `scroll-margin-inline-end` | Scroll margin at inline end |
| `scroll-padding-top` | `scroll-padding-block-start` | Scroll padding at block start |
| `scroll-padding-bottom` | `scroll-padding-block-end` | Scroll padding at block end |
| `scroll-padding-left` | `scroll-padding-inline-start` | Scroll padding at inline start |
| `scroll-padding-right` | `scroll-padding-inline-end` | Scroll padding at inline end |

#### Caption and Table Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `caption-side: left` | `caption-side: inline-start` | Caption at inline start |
| `caption-side: right` | `caption-side: inline-end` | Caption at inline end |

#### Contain Properties

| Physical Property | Logical Property | Notes |
|------------------|------------------|-------|
| `contain-intrinsic-width` | `contain-intrinsic-inline-size` | Intrinsic inline size containment |
| `contain-intrinsic-height` | `contain-intrinsic-block-size` | Intrinsic block size containment |

## Migration Tooling Strategy

### Automated Conversion Tools

#### 1. CSS/LESS Codemod Script

A custom Node.js script or codemod to automatically convert physical properties to logical equivalents:

**Proposed Implementation:**
- Use PostCSS AST parsing for accurate CSS manipulation
- Create mapping dictionary for all property conversions
- Support for LESS-specific syntax (variables, mixins, extends)
- Preserve comments and formatting
- Generate conversion report with statistics
- Support dry-run mode for preview
- Handle edge cases (calc(), var(), custom properties)

**Example usage:**
```bash
# Dry run to preview changes
node scripts/migrate-to-logical.js --dry-run --path="utilities/spacing.less"

# Apply changes with backup
node scripts/migrate-to-logical.js --path="utilities/" --backup

# Generate report only
node scripts/migrate-to-logical.js --report-only --path="components/"
```

#### 2. ESLint/Stylelint Rules

**Custom Stylelint Plugin (`stylelint-plugin-logical-properties`):**

**Rules to implement:**
- `prefer-logical-properties`: Warn when physical properties are used
- `no-physical-margins`: Error on margin-left/right/top/bottom
- `no-physical-padding`: Error on padding-left/right/top/bottom
- `no-physical-borders`: Error on border directional properties
- `no-physical-position`: Error on top/right/bottom/left
- `consistent-logical-notation`: Enforce consistent logical property syntax

**Configuration example:**
```json
{
  "plugins": ["logical-properties"],
  "rules": {
    "logical-properties/prefer-logical-properties": "warn",
    "logical-properties/no-physical-margins": "error",
    "logical-properties/no-physical-padding": "error"
  }
}
```

**Auto-fix capability:** Rules should support `--fix` flag to automatically convert properties

#### 3. Pre-commit Hooks

**Husky + lint-staged configuration:**

```json
// package.json
{
  "lint-staged": {
    "*.{css,less}": [
      "stylelint --fix --plugin=logical-properties",
      "node scripts/check-logical-properties.js"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:rtl"
    }
  }
}
```

**Pre-commit checks:**
- Prevent new physical properties from being added
- Auto-convert simple cases
- Generate warning report for complex cases requiring manual review
- Block commit if critical physical properties are detected

#### 4. Migration Progress Dashboard

**Web-based dashboard showing:**

**Metrics to track:**
- Total files: X / Y migrated
- Properties converted: X physical → Y logical
- Component migration status (traffic light system)
- RTL test coverage percentage
- Browser compatibility score
- Bundle size impact analysis

**Implementation approach:**
- Node.js script scanning codebase on build
- Generate JSON metrics file
- Simple HTML/CSS dashboard consuming metrics
- GitHub Actions integration for CI/CD reporting
- Slack/Teams notifications for milestones

**Dashboard features:**
- File-by-file migration checklist
- Property usage heatmap
- Before/after code comparisons
- Team member assignment tracking
- Timeline visualization with progress

### Additional Tooling Considerations

#### PostCSS Plugin for Build Process

**`postcss-dialtone-logical`:**
- Transforms physical to logical at build time
- Adds fallbacks for older browsers if needed
- Generates source maps for debugging
- Reports on transformation statistics

#### VS Code Extension

**Features:**
- Real-time property conversion suggestions
- Quick fixes for physical properties
- RTL preview toggle
- Property reference tooltip
- Migration checklist integration

#### Testing Utilities

**RTL Testing Helper:**
```javascript
// test-utils/rtl-helper.js
export function testBidiComponent(Component, options) {
  // Automatically test component in both LTR and RTL
  // Generate visual diffs
  // Assert logical property usage
  // Check for directional regressions
}
```

## Migration Strategy by File Type

### 1. Utility Files Priority Order

Based on current Dialtone structure, migrate in this order:

1. **`/postcss/dialtone-generators.cjs`** - **CRITICAL FIRST**: PostCSS plugin generating directional utilities
2. **`/utilities/spacing.less`** - High impact, contains margin/padding utilities
3. **`/utilities/borders.less`** - Contains border directional utilities
4. **`/utilities/layout.less`** - Contains positioning utilities
5. **`/utilities/typography.less`** - Contains text-align utilities
6. **`/utilities/sizing.less`** - Contains width/height utilities
7. **`/utilities/flex.less`** - May contain directional properties
8. **`/utilities/grid.less`** - May contain directional properties

### 2. Component Files Strategy

- Start with low-risk components with minimal directional properties
- Progress to complex components like buttons, modals, dropdowns
- Test thoroughly in both LTR and RTL contexts

### 3. Base Files Strategy

- **`dialtone-reset.less`** - Update reset styles
- **`dialtone-globals.less`** - Update global directional styles
- Variable and theme files - Update logical property variables

## Implementation Phases

### Phase 1: PostCSS Generator (Week 1)

**Critical First Step - Files to Update:**

- `/postcss/dialtone-generators.cjs`

**Key Changes:**

- Update `marginUtilities()` function: `margin-left` → `margin-inline-start`, `margin-right` → `margin-inline-end`
- Update `paddingUtilities()` function: `padding-left` → `padding-inline-start`, `padding-right` → `padding-inline-end`
- Update `borderUtilities()` function: `border-*-radius` properties to logical equivalents
- Update `layoutUtilities()` function: `left` → `inset-inline-start`, `right` → `inset-inline-end`, etc.
- Rebuild CSS after generator changes to update all generated utilities

### Phase 2: Foundation Files (Week 2)

**Files to Update:**

- `/utilities/spacing.less`
- `/utilities/borders.less`
- `/utilities/layout.less`

**Key Changes:**

- Update any remaining manually-written directional utilities
- Verify generated utilities are working correctly
- Update any static utility classes not covered by the generator

### Phase 3: Components (Week 3-4)

**Files to Update:**

- Low-complexity components first (badge, chip, avatar)
- Medium-complexity components (button, input, card)

**Key Changes:**

- Update component-specific directional styles to use logical properties
- Maintain existing class names - only update CSS properties
- Preserve all current class naming conventions

### Phase 4: Complex Components (Week 5-6)

**Files to Update:**

- High-complexity components (modal, dropdown, popover)
- Layout components (root-layout, item-layout)

### Phase 5: Finalization (Week 7-8)

**Files to Update:**

- Remaining component files
- Theme and variable updates
- Documentation updates

## Backward Compatibility Strategy

### Direct Migration Approach

Migrate directly to logical properties:

```less
// Current
.d-ml-4 {
  margin-left: var(--dt-space-400) !important;
}

// After migration - logical properties only
.d-ml-4 {
  margin-inline-start: var(--dt-space-400) !important;
}
```

### Existing Class Strategy

Keep existing class names and update their properties to logical equivalents:

```less
// Classes updated to use logical properties
.d-ml-4 { margin-inline-start: var(--dt-space-400) !important; }
```

## Utility Class Implementation Strategy

| Current Class | Current Property | Updated to Include |
|---------------|------------------|-------------------|
| `.d-ml-*` | `margin-left` | `margin-inline-start` |
| `.d-mr-*` | `margin-right` | `margin-inline-end` |
| `.d-mt-*` | `margin-top` | `margin-block-start` |
| `.d-mb-*` | `margin-bottom` | `margin-block-end` |
| `.d-pl-*` | `padding-left` | `padding-inline-start` |
| `.d-pr-*` | `padding-right` | `padding-inline-end` |
| `.d-pt-*` | `padding-top` | `padding-block-start` |
| `.d-pb-*` | `padding-bottom` | `padding-block-end` |
| `.d-bl` | `border-left` | `border-inline-start` |
| `.d-br` | `border-right` | `border-inline-end` |
| `.d-bt` | `border-top` | `border-block-start` |
| `.d-bb` | `border-bottom` | `border-block-end` |
| `.d-l*` | `left` | `inset-inline-start` |
| `.d-r*` | `right` | `inset-inline-end` |
| `.d-t*` | `top` | `inset-block-start` |
| `.d-b*` | `bottom` | `inset-block-end` |

### Implementation Example
```less
// Before
.d-ml-4 {
  margin-left: var(--dt-space-400) !important;
}

// After - logical properties only
.d-ml-4 {
  margin-inline-start: var(--dt-space-400) !important;
}
```

## Browser Support

### Support Matrix

- **Full Support**: Chrome 87+, Firefox 66+, Safari 12.1+
- **No Support**: IE 11 (not supported)
- **Strategy**: Logical properties only, no fallbacks

## LESS-Specific Considerations

### Variable Updates

Update LESS variables to support logical properties:

```less
// Current variables (to maintain)
@margin-left: margin-left;
@margin-right: margin-right;

// New logical variables
@margin-inline-start: margin-inline-start;
@margin-inline-end: margin-inline-end;
```

### Mixin Updates

Create logical property mixins:

```less
// Existing mixin
.margin-horizontal(@value) {
  margin-left: @value;
  margin-right: @value;
}

// New logical mixin
.margin-inline(@value) {
  margin-inline-start: @value;
  margin-inline-end: @value;
}
```

## Testing Strategy

### LTR/RTL Testing

1. **Set document direction**: `<html dir="rtl">`
2. **Test all migrated utilities** in both directions
3. **Visual regression testing** for component alignment
4. **Automated testing** for class name outputs

### Browser Testing

1. Test in all supported browsers
2. Verify logical properties work correctly
3. Test with browser developer tools to simulate RTL

### Component Testing

1. Test each component in isolation
2. Test component combinations
3. Test responsive behavior
4. Test theme variations

## Migration Checklist Template

For each file migration:

- [ ] **Identify** all physical directional properties
- [ ] **Map** to logical equivalents using reference table
- [ ] **Implement** logical properties directly
- [ ] **Update** existing classes to use logical properties
- [ ] **Test** in both LTR and RTL contexts
- [ ] **Verify** no visual regressions
- [ ] **Update** documentation/comments
- [ ] **Verify** logical properties work correctly

## Risk Assessment & Mitigation

### High Risk Areas

1. **Complex positioning** in modals, dropdowns
2. **Icon positioning** in buttons, inputs
3. **Responsive breakpoints** with directional properties
4. **Third-party integration** expecting physical properties

### Mitigation Strategies

1. **Gradual rollout** - one file at a time
2. **Comprehensive testing** at each step
3. **Rollback plan** - keep git history clean
4. **Documentation** - clear migration guides
5. **Team communication** - notify of changes

## PostCSS Generator Migration Details

### Critical Generator Functions to Update

The `/postcss/dialtone-generators.cjs` file contains several functions that generate utilities with physical directional properties:

| Function | Generated Properties | Logical Equivalent |
|----------|---------------------|-------------------|
| `marginUtilities()` | `margin-left`, `margin-right`, `margin-top`, `margin-bottom` | `margin-inline-start`, `margin-inline-end`, `margin-block-start`, `margin-block-end` |
| `paddingUtilities()` | `padding-left`, `padding-right`, `padding-top`, `padding-bottom` | `padding-inline-start`, `padding-inline-end`, `padding-block-start`, `padding-block-end` |
| `borderUtilities()` | `border-top-left-radius`, etc. | `border-start-start-radius`, etc. |
| `layoutUtilities()` | `left`, `right`, `top`, `bottom` | `inset-inline-start`, `inset-inline-end`, `inset-block-start`, `inset-block-end` |

### Generator Impact
- **Generated utilities**: `.d-ml-*`, `.d-mr-*`, `.d-pl-*`, `.d-pr-*`, `.d-l*`, `.d-r*`, etc.
- **Build process**: After updating generator, rebuild CSS to propagate changes
- **Testing**: Verify all generated utility classes work in RTL context

## Success Metrics

- [ ] **PostCSS generator** updated to use logical properties
- [ ] All **generated utility classes** use logical properties correctly
- [ ] All `.css` and `.less` files migrated to logical properties
- [ ] Backward compatibility maintained for existing class names
- [ ] RTL support working correctly across all components
- [ ] No visual regressions in LTR contexts
- [ ] Browser support maintained (modern browsers only)
- [ ] Performance impact is negligible
- [ ] Documentation updated with logical property examples

---

This plan provides a comprehensive roadmap for migrating Dialtone to CSS Logical Properties while maintaining stability and backward compatibility. Each file should be migrated individually following this plan, with thorough testing at each step.
