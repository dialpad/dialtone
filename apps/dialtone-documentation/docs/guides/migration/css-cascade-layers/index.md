---
title: CSS Cascade Layers
description: Dialtone now uses CSS Cascade Layers to organize all styles into a predictable hierarchy, improving specificity control and making overrides more predictable.
keywords: ["css layers", "@layer", "specificity", "imports", "overrides"]
---

## TLDR

Dialtone now uses CSS Cascade Layers (`@layer`) to organize all styles into a predictable hierarchy. This improves specificity control, makes overrides more predictable, and eliminates the need for complex selector specificity hacks.

**For Consumers**: This is a breaking change. Any app CSS that isn't wrapped in a named `@layer` will now unconditionally win over all Dialtone styles, regardless of specificity. Apps upgrading from Dialtone ≤9 will likely need to either adopt layers or use the [no-layers build](#no-layers-build).

**For Contributors**: All new styles must be wrapped in the appropriate `@layer` block. See the [CSS Cascade Layers Guide](/guides/css-layers/) for details.

## What Changed

All Dialtone CSS is now organized into four cascade layers:

```css
@layer dialtone.reset, dialtone.base, dialtone.components, dialtone.utilities;
```

### Layer Hierarchy

1. **`dialtone.reset`** - CSS resets (normalize.css, typography resets)
2. **`dialtone.base`** - Design tokens, fonts, themes, global styles
3. **`dialtone.components`** - Component styles (buttons, inputs, modals, etc.)
4. **`dialtone.utilities`** - Utility classes (spacing, colors, layout)

## Why This Matters

### Before: Specificity Wars

Previously, ensuring utilities could override components required:

- Adding `!important` to every utility
- Carefully managing selector specificity
- Loading CSS files in the correct order
- Hoping third-party CSS didn't break things

### After: Predictable Cascade

With cascade layers:

- **Utilities always override components.** Layer order guarantees it.
- **No specificity hacks needed.** Layer priority beats specificity.
- **Clear organization.** Every style has a clear home.
- **Third-party CSS control.** Can layer external CSS between Dialtone layers.

## How Layers Work

### Normal Cascade (Highest to Lowest Priority)

1. **Unlayered styles** (highest)
2. `dialtone.utilities`
3. `dialtone.components`
4. `dialtone.base`
5. `dialtone.reset` (lowest)

### With `!important` (Order Reverses!)

1. **`dialtone.reset !important`** (highest)
2. `dialtone.base !important`
3. `dialtone.components !important`
4. `dialtone.utilities !important`
5. **Unlayered `!important`** (lowest)

> **Why utilities use `!important`**: Within the layered system, Dialtone utility `!important` declarations outrank all other layered `!important` declarations and — because of how layers reverse `!important` priority — also outrank your unlayered `!important`. This guarantees utilities always win over components, but means consumer `!important` overrides targeting the same properties will not work. Put overrides in a named layer declared after `dialtone.utilities` instead.

## For Consumers

### What breaks

Because all Dialtone styles are now inside named `@layer` blocks, **any unlayered CSS in your app automatically wins over Dialtone** — regardless of specificity or source order. This is how the cascade layer spec works, and it has two practical consequences:

**1. Your app styles may unexpectedly override Dialtone**

If your app has unlayered CSS targeting the same elements as Dialtone components, those rules now win even if they have lower specificity. You may see Dialtone component styles disappearing or being partially overridden where they previously showed correctly.

**2. Your `!important` overrides now lose to Dialtone's layered `!important`**

With layers, `!important` priority order reverses: Dialtone's `!important` utility classes are inside `@layer dialtone.utilities`, so your unlayered `!important` has *lower* priority than Dialtone's. Overrides that previously used `!important` to beat Dialtone may stop working.

### Recommended migration

Think about the *intent* of each piece of your app CSS before deciding where it belongs in the layer order:

- **Before Dialtone** — foundational styles that Dialtone should be able to override: app-level resets, base element defaults, design tokens your own system defines.
- **After Dialtone** — styles that must win over Dialtone: feature-specific layout rules, or customizations to a Dialtone component when the component's own props and tokens aren't sufficient. Prefer using component props, CSS custom properties, and Dialtone utility classes before reaching for overrides.

```css
@layer app.base, dialtone.reset, dialtone.base, dialtone.components, dialtone.utilities, app.overrides;

@layer app.base {
  /* Foundational styles Dialtone can override */
}

@layer app.overrides {
  /* Component and page styles that override Dialtone */
}
```

Specificity works as expected within each layer, so you don't need to increase selector specificity to win — layer order handles it.

If you cannot migrate your app CSS to use layers, use the [no-layers build](#no-layers-build) instead.

### No-Layers Build

If your project cannot use CSS Cascade Layers — older browser requirements, an existing specificity system, or a bundler that doesn't support `@layer` — import the no-layers variant instead:

```js
// @dialpad/dialtone-css
import '@dialpad/dialtone-css/no-layers';
import '@dialpad/dialtone-css/no-layers/default-theme'; // optional theme

// @dialpad/dialtone
import '@dialpad/dialtone/css/no-layers';
import '@dialpad/dialtone/css/no-layers/default-theme'; // optional theme
```

This build is identical in output — all the same classes — but no `@layer` wrappers are present.

> [!WARNING] `!important` behavior differs in the no-layers build
> In the layered build, Dialtone's `!important` utility declarations beat your unlayered `!important` (because `!important` priority reverses across layers). In the no-layers build, both sides are unlayered, so your `!important` can beat Dialtone's through normal cascade. However, your non-`!important` rules will lose to Dialtone utility `!important` — you will need `!important` in your own overrides to beat utilities.

### Third-Party CSS

If you're using third-party CSS that conflicts with Dialtone, wrap it in a layer:

```css
@layer dialtone.reset, dialtone.base, dialtone.components, third-party, dialtone.utilities;

@layer third-party {
  @import 'some-library/styles.css';
}
```

This ensures Dialtone utilities can still override third-party styles.

## For Contributors

### All Styles Must Be Layered

When adding new styles, wrap them in the appropriate layer:

**Components:**

```less
@layer dialtone.components {
  .d-my-component {
    /* styles */
  }
}
```

**Utilities:**

```less
@layer dialtone.utilities {
  .d-my-util { property: value !important; }
}
```

### Cross-Layer Mixins

To share styles between layers, extract parametric mixins **outside** `@layer` blocks:

```less
// Outside @layer for cross-file access
._my-mixin() {
  display: flex;
  align-items: center;
}

@layer dialtone.components {
  .d-component { ._my-mixin(); }
}
```

### Validation

The build pipeline now validates that all Dialtone classes are properly layered. Unlayered classes will fail CI.

See the [CSS Layers Contributor Guide](/guides/css-layers/) for complete documentation.

## Examples

### Utility Classes Override Components

```html
<!-- Component default: blue background -->
<button class="d-btn d-bgc-critical">
  <!-- Utility wins: red background -->
</button>
```

### Responsive Utilities

Responsive utilities are now in the same layer as base utilities, ensuring consistent behavior:

```html
<div class="d-d-none lg:d-d-block">
  <!-- Hidden by default, visible on large screens -->
</div>
```

### App Overrides

```css
@layer app.overrides {
  .d-btn--custom {
    border-radius: 999px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
}
```

## Browser Support

CSS Cascade Layers are supported in all modern browsers:

- Chrome 99+
- Firefox 97+
- Safari 15.4+
- Edge 99+

If you need to support older browsers, use the [no-layers build](#no-layers-build) instead of relying on undefined fallback behavior.

## Learn More

- [CSS Cascade Layers in Dialtone](/guides/css-layers/)
- [MDN: CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer)
- [CSS Cascade Layers Explainer](https://css.oddbird.net/layers/explainer/)

## Migration Path

### Option A — Adopt layers (recommended)

Declare named app layers and place your CSS based on intent — foundational styles before Dialtone, overrides after. This is the forward-compatible path and gives you the full benefits of the cascade layer system.

```css
@layer app.base, dialtone.reset, dialtone.base, dialtone.components, dialtone.utilities, app.overrides;

@layer app.base {
  /* Foundational styles: resets, base element defaults, your own tokens */
}

@layer app.overrides {
  /* Overrides: component customizations, feature-specific layout rules */
}
```

See [Using CSS Layers with Dialtone](/guides/css-layers/) for detailed guidance on layer ordering, third-party CSS, and per-component overrides.

### Option B — Use the no-layers build

If adopting layers is not feasible, switch to the no-layers CSS import. All Dialtone classes are present; `@layer` wrappers are stripped at build time. Specificity and cascade behave as they did in Dialtone ≤9.

```js
import '@dialpad/dialtone/css/no-layers';       // @dialpad/dialtone
import '@dialpad/dialtone-css/no-layers';        // @dialpad/dialtone-css
```

> [!WARNING] `!important` behavior in the no-layers build
> Dialtone utility `!important` declarations are fully unlayered, so they beat your non-`!important` rules. Use `!important` in your own overrides where needed.
