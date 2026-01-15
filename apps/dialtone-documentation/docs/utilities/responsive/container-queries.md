---
title: Container Queries
description: Container queries allow you to apply styles based on the size of a parent container, not the viewport. Using our plugin @dialpad/postcss-container-variations, you can create container-responsive variations of utility classes that adapt to their parent's dimensions.
---

## Overview

Container queries enable component-based responsive design. Instead of changing styles based on viewport width (media queries), styles change based on the parent container's width. This makes components truly modular and reusable in different contexts.

### When to Use Container Queries vs Media Queries

**Use Container Queries when:**

- A component needs to adapt to its container's size (e.g., a card in a sidebar vs main content)
- Building reusable components that appear in different layout contexts
- The same component needs different layouts depending on where it's placed

**Use Media Queries when:**

- Adapting to viewport/device characteristics (screen size, orientation)
- Global layout changes (navigation, page structure)
- The component should always respond to screen size

## How Container Query Variations Work

The `@dialpad/postcss-container-variations` plugin generates container-responsive versions of your CSS classes by:

1. **Taking the base classes** (like `.d-p-8`, `.d-fc-primary`)
2. **Creating prefixed versions** with `c-` prefix (like `.c-sm:d-p8`, `.c-md:d-fc-primary`)
3. **Wrapping them in `@container` queries** based on breakpoint configuration

### What the Plugin Does

**Input CSS:**

```css
.d-p-8 {
  padding: var(--dt-space-400);
}
```

**Generated Output:**

```css
.d-p-8 {
  padding: var(--dt-space-400);
}

@container (min-width: 320px) {
  .c-xs\:d-p-8 {
    padding: var(--dt-space-400);
  }
}

@container (min-width: 480px) {
  .c-sm\:d-p-8 {
    padding: var(--dt-space-400);
  }
}

@container (min-width: 640px) {
  .c-md\:d-p-8 {
    padding: var(--dt-space-400);
  }
}

@container (min-width: 960px) {
  .c-lg\:d-p-8 {
    padding: var(--dt-space-400);
  }
}
```

## Container Type Classes

Before using container query utilities, you must designate a container element using one of these classes:

<div class="d-d-flex d-fd-column d-g8 d-mb16">
  <div class="d-p16 d-bgc-secondary d-bar8">
    <code class="d-fc-purple-400 d-fw-bold">.d-container-inline</code>
    <p class="d-mt8">Sets <code>container-type: inline-size</code>. Queries based on container's inline dimension (width in horizontal writing modes). <strong>Most common use case.</strong></p>
  </div>
  <div class="d-p16 d-bgc-secondary d-bar8">
    <code class="d-fc-purple-400 d-fw-bold">.d-container-size</code>
    <p class="d-mt8">Sets <code>container-type: size</code>. Queries both inline and block dimensions. Note: This prevents intrinsic sizing of the container.</p>
  </div>
  <div class="d-p16 d-bgc-secondary d-bar8">
    <code class="d-fc-purple-400 d-fw-bold">.d-container-normal</code>
    <p class="d-mt8">Sets <code>container-type: normal</code>. Disables container queries (useful for opt-out scenarios).</p>
  </div>
</div>

## Breakpoints

Container query breakpoints are smaller than media query breakpoints since containers are typically narrower than viewports:

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w25p"><div class="d-p16 d-bb d-bbw1">Class Prefix</div></th>
          <th scope="col" class="d-p0 d-bbw0 d-w25p"><div class="d-p16 d-bb d-bbw1">Container Query</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bbw1">Description</div></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.c-xs:{class}</th>
          <td class="d-code--sm">min-width: 320px</td>
          <td class="d-code--sm">Applied when container is 320px or wider. Good for mobile content areas and narrow sidebars.</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.c-sm:{class}</th>
          <td class="d-code--sm">min-width: 480px</td>
          <td class="d-code--sm">Applied when container is 480px or wider. Good for tablet sidebars and card containers.</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.c-md:{class}</th>
          <td class="d-code--sm">min-width: 640px</td>
          <td class="d-code--sm">Applied when container is 640px or wider. Good for main content areas.</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.c-lg:{class}</th>
          <td class="d-code--sm">min-width: 960px</td>
          <td class="d-code--sm">Applied when container is 960px or wider. Good for wide layouts and full-width sections.</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.c-xl:{class}</th>
          <td class="d-code--sm">min-width: 1264px</td>
          <td class="d-code--sm">Applied when container is 1264px or wider. Good for extra-wide layouts and full-page containers.</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

### Comparison: Container vs Media Query Breakpoints

| Size | Container Query | Media Query | Use Case                                                       |
|------|-----------------|-------------|----------------------------------------------------------------|
| xs   | 320px           | -           | Container: Narrow mobile areas                                 |
| sm   | 480px           | 480px       | Container: Sidebars / Media: Small screens                     |
| md   | 640px           | 640px       | Container: Cards / Media: Tablets                              |
| lg   | 960px           | 980px       | Container: Wide areas / Media: Desktops                        |
| xl   | 1264px          | 1264px      | Container & Media: Extra-large layouts and full-page width     |

## Usage Examples

### Basic Example: Responsive Card

<code-well-header>
  <div class="d-container-inline" style="resize: horizontal; overflow: auto; border: 2px dashed var(--dt-color-border-moderate); padding: var(--dt-space-400); min-width: 200px; max-width: 100%; width: 500px;">
    <div class="d-p8 c-sm:d-p16 c-md:d-p24 c-lg:d-p32 d-bgc-secondary d-bar8">
      <h3 class="d-fs-200 c-md:d-fs-300 c-lg:d-fs-400">Responsive Card</h3>
      <p class="d-mt8">Resize this container by dragging the bottom-right corner. The card's padding and heading size adapt to the container width, not the viewport width.</p>
    </div>
  </div>
</code-well-header>

```html
<div class="d-container-inline">
  <div class="d-p8 c-sm:d-p16 c-md:d-p24 c-lg:d-p32">
    <h3 class="d-fs-200 c-md:d-fs-300 c-lg:d-fs-400">Responsive Card</h3>
    <p>Content adapts to container size</p>
  </div>
</div>
```

### Responsive Grid Columns

<code-well-header>
  <div class="d-container-inline" style="resize: horizontal; overflow: auto; border: 2px dashed var(--dt-color-border-moderate); padding: var(--dt-space-400); min-width: 250px; max-width: 100%; width: 600px;">
    <div class="d-d-flex d-fd-column c-sm:d-fd-row d-g8 c-md:d-g16">
      <div class="d-w100p c-sm:d-w50p d-p16 d-bgc-moderate d-bar8 d-ta-center">Column 1</div>
      <div class="d-w100p c-sm:d-w50p d-p16 d-bgc-moderate d-bar8 d-ta-center">Column 2</div>
    </div>
  </div>
  <p class="d-mt8 d-fs-100 d-fc-secondary">Resize to see columns switch from vertical (narrow) to horizontal (at 480px+) with increased gap (at 640px+).</p>
</code-well-header>

```html
<div class="d-container-inline">
  <div class="d-d-flex d-fd-column c-sm:d-fd-row d-g8 c-md:d-g16">
    <div class="d-w100p c-sm:d-w50p">Column 1</div>
    <div class="d-w100p c-sm:d-w50p">Column 2</div>
  </div>
</div>
```

### Same Component, Different Contexts

This demonstrates the power of container queries: the same component markup adapts differently based on where it's placed.

<div class="d-mb16">
  <p class="d-fw-bold d-mb8">Wide Container (100%, max 800px):</p>
  <div class="d-container-inline d-bgc-surface-secondary d-p8 d-bar8" style="width: 100%; max-width: 800px;">
    <div class="d-p4 c-sm:d-p8 c-md:d-p16 d-bgc-moderate d-bar4">
      <div class="d-fw-bold">Product Card</div>
      <div class="d-mt4">Container is wide enough for c-md padding (640px+)</div>
    </div>
  </div>
</div>

<div class="d-mb16">
  <p class="d-fw-bold d-mb8">Narrow Container (100%, max 400px):</p>
  <div class="d-container-inline d-bgc-surface-secondary d-p8 d-bar8" style="width: 100%; max-width: 400px;">
    <div class="d-p4 c-sm:d-p8 c-md:d-p16 d-bgc-moderate d-bar4">
      <div class="d-fw-bold">Product Card</div>
      <div class="d-mt4">Container too narrow for c-md, uses c-sm padding</div>
    </div>
  </div>
</div>

```html
<!-- Same component markup, different containers -->
<div class="d-container-inline" style="width: 800px;">
  <div class="d-p4 c-sm:d-p8 c-md:d-p16">
    <div>Product Card</div>
  </div>
</div>

<div class="d-container-inline" style="width: 400px;">
  <div class="d-p4 c-sm:d-p8 c-md:d-p16">
    <div>Product Card</div>
  </div>
</div>
```

### Combining Container and Media Queries

You can use both container queries and media queries together for fine-grained control:

```html
<div class="d-container-inline">
  <!-- Base: small padding -->
  <!-- Container ≥ 480px: medium padding -->
  <!-- Viewport ≥ 640px: larger gap -->
  <!-- Container ≥ 640px AND Viewport ≥ 640px: large padding -->
  <div class="d-p8 c-sm:d-p16 md:d-g-16 c-md:d-p24">
    Content adapts to both container and viewport
  </div>
</div>
```

## Available Utility Classes

Container query variants are generated for all Dialtone utility classes including:

- **Spacing**: `c-xs:d-p8`, `c-sm:d-m16`, `c-md:d-g24`
- **Sizing**: `c-sm:d-w32`, `c-md:d-h64`, `c-lg:d-wmn96`
- **Layout**: `c-md:d-t16`, `c-lg:d-r24`
- **Colors**: `c-sm:d-fc-primary`, `c-md:d-bgc-secondary`
- **Opacity**: `c-md:d-fco75`, `c-lg:d-bgo90`
- **Borders**: `c-sm:d-bar8`, `c-md:d-bar16`
- **Flexbox**: `c-md:d-fc6-gap16` (flex columns)
- **Grid**: Container variants for grid utilities

## Setup & Configuration

### For Dialtone Users

Container query utilities are **opt-in** to keep the default bundle size small. To enable them:

1. **Enable the plugin** in your build configuration (see below)
2. **Configure which utilities** you want container variants for
3. **Add container classes** to your HTML

Container query utilities are not included by default because they significantly increase CSS bundle size. Only enable the utilities you actually need.

### Enabling in Dialtone CSS Build

If you're building Dialtone CSS from source, edit `packages/dialtone-css/gulpfile.cjs`:

1. **Uncomment the plugin import** (line 41):

```js
const postCSSContainerVariations = settings.styles ? require('@dialpad/postcss-container-variations') : null;
```

1. **Uncomment and configure the plugin** in the PostCSS pipeline (lines 191-207):

```js
postCSSContainerVariations({
  breakpoints: [
    { prefix: 'c-xs\\:', query: '(min-width: 320px)' },
    { prefix: 'c-sm\\:', query: '(min-width: 480px)' },
    { prefix: 'c-md\\:', query: '(min-width: 640px)' },
    { prefix: 'c-lg\\:', query: '(min-width: 960px)' },
    { prefix: 'c-xl\\:', query: '(min-width: 1264px)' },
  ],
  classes: [
    // Add only the utilities you need:
    /^\.d-p(t|r|b|l|x|y)?\d+$/,    // Padding
    /^\.d-m(t|r|b|l|x|y)?n?\d+$/,  // Margin
    /^\.d-d-(flex|block|none)$/,   // Display
    // See full list in gulpfile.cjs
  ],
}),
```

1. **Rebuild CSS**: Run `npx gulp` in the `packages/dialtone-css` directory

### For Custom Implementations

To use the plugin in your own project:

#### Step 1: Install the Plugin

```bash
npm install @dialpad/postcss-container-variations
```

#### Step 2: Configure PostCSS

```js
import postcssContainerVariations from '@dialpad/postcss-container-variations';

export default {
  plugins: [
    postcssContainerVariations({
      breakpoints: [
        { prefix: 'c-xs\\:', query: '(min-width: 320px)' },
        { prefix: 'c-sm\\:', query: '(min-width: 480px)' },
        { prefix: 'c-md\\:', query: '(min-width: 640px)' },
        { prefix: 'c-lg\\:', query: '(min-width: 960px)' },
        { prefix: 'c-xl\\:', query: '(min-width: 1264px)' },
      ],
      classes: [
        /^\.d-p\d+$/,     // Padding utilities
        /^\.d-m\d+$/,     // Margin utilities
        /^\.d-w\d+$/,     // Width utilities
        // Add more patterns as needed
      ],
    }),
  ],
};
```

#### Custom Breakpoints

You can define custom breakpoints for specific needs:

```js
postcssContainerVariations({
  breakpoints: [
    { prefix: 'c-xs\\:', query: '(min-width: 300px)' },
    { prefix: 'c-sm\\:', query: '(min-width: 500px)' },
    { prefix: 'c-xl\\:', query: '(min-width: 1200px)' },  // Add custom breakpoint
  ],
  classes: [/* ... */],
})
```

## Browser Support

Container queries are supported in all modern browsers:

- Chrome 105+ (September 2022)
- Firefox 110+ (February 2023)
- Safari 16+ (September 2022)
- Edge 105+ (September 2022)

No polyfill is required for modern applications. For legacy browser support, consider using media queries as a fallback.

## Best Practices

### ✅ Do

- Use `.d-container-inline` for most use cases (queries on width only)
- Apply container classes to layout wrappers, not deeply nested elements
- Combine with media queries when appropriate
- Use container queries for reusable components

### ❌ Don't

- Overuse `.d-container-size` (it prevents intrinsic sizing)
- Nest containers too deeply (can cause confusion)
- Use container queries when media queries would be simpler
- Apply container classes to inline elements

## Performance Considerations

Container queries are **more performant** than JavaScript-based approaches like ResizeObserver because:

- They're handled natively by the browser's layout engine
- No JavaScript execution overhead
- No event listener management
- Automatic optimization by the browser

### Bundle Size Impact

**When enabled for all utilities** (not recommended):

- Uncompressed: ~2.3x increase (20,552 → 46,712 lines)
- Minified: ~2x increase (786KB → 1.6MB)

**Best practice**: Only generate container variants for the utilities you actually use. This is why the feature is opt-in by default. Enable only what you need to minimize bundle size impact.

## Troubleshooting

### Container queries not applying

1. **Check container class**: Ensure parent has `.d-container-inline`, `.d-container-size`, or `.d-container-normal`
2. **Check browser support**: Container queries require modern browsers (2022+)
3. **Check breakpoint**: Verify container width meets the breakpoint threshold
4. **Check specificity**: Container query classes use `!important` like other utilities

### Unexpected behavior with nested containers

Container queries apply to the **nearest ancestor** with a `container-type`. Be mindful of container nesting:

```html
<!-- ✅ Clear hierarchy -->
<div class="d-container-inline">
  <div class="c-sm:d-p16">
    <div>Content</div>
  </div>
</div>

<!-- ⚠️ Nested containers can be confusing -->
<div class="d-container-inline">
  <div class="d-container-inline c-sm:d-p16">
    <!-- Which container does c-sm refer to? -->
  </div>
</div>
```

## Related

- [Responsive Breakpoints (Media Queries)](./breakpoints.md) - Viewport-based responsive design
- [Layout Utilities](../layout/display.md) - Display and layout classes
- [Spacing Utilities](../spacing/padding.md) - Padding and margin classes

<script setup>
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>
