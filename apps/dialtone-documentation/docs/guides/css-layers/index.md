---
title: CSS Cascade Layers
description: Understanding and working with Dialtone's CSS cascade layer architecture.
---

Dialtone uses CSS Cascade Layers (`@layer`) to organize all styles into a predictable hierarchy. This ensures utilities always override components, eliminates specificity wars, and makes it easy to integrate custom styles.

## Understanding Dialtone's Layers

Dialtone defines four cascade layers in priority order:

```css
@layer dialtone.reset, dialtone.base, dialtone.components, dialtone.utilities;
```

### Layer Priority

#### For normal (non-`!important`) declarations:

1. `dialtone.utilities` - Highest priority (utility classes)
2. `dialtone.components` - Component styles
3. `dialtone.base` - Base styles (tokens, fonts, themes)
4. `dialtone.reset` - Lowest priority (resets)

#### For `!important` declarations, **the order reverses**:

1. `dialtone.reset !important` - Highest priority
2. `dialtone.base !important`
3. `dialtone.components !important`
4. `dialtone.utilities !important` - Lowest priority

<dt-notice
  title="Note"
  kind="info"
  hide-close
  class="d-wmx100p d-mt16"
>
  Since Dialtone utilities use <code>!important</code> and are in the last layer (top-most), they effectively have the highest priority for overriding component styles while staying organized.
</dt-notice>

### What's in Each Layer

- `dialtone.reset`: CSS resets, e.g. (`normalize.css`), element resets (`h1`, `h2`)
- `dialtone.base`: Design Tokens (CSS Variables), `@font-face`, themes, global `html`/`body` rules
- `dialtone.components`: Component styles (buttons, inputs, modals), recipes, typography classes
- `dialtone.utilities`: Utility classes with `!important`, generated utilities, responsive utilities

### How Layers Affect the Cascade

**Within the same layer**, traditional CSS specificity applies:

```css
@layer dialtone.utilities {
  .d-p16 { prop: value !important; }      /* specificity: 0-1-0 */
  div.d-p16 { prop: value !important; }   /* specificity: 0-1-1 - WINS */
}
```

Reference: [Specificity Calculator](https://specificity.keegan.st/)

**Across different layers**, layer order wins (specificity is ignored):

```css
@layer dialtone.components {
  div.d-card.d-card--active { prop: value; } /* specificity: 0-3-1 */
}

@layer dialtone.utilities {
  .d-fc-primary { prop: value !important; }   /* specificity: 0-1-0 - WINS */
}
```

## For Dialtone Consumers

### Writing Overrides

#### Option 1: Use Utility Classes (Recommended)

Dialtone utility classes are designed to override component styles:

```html
<!-- Utility classes override component defaults -->
<button class="d-foo d-p24 d-bgc-critical">
  Custom Button
</button>
```

#### Option 2: Application Layer

For app-specific styles, create your own layer **after** Dialtone's utilities:

```css
/* In your app's CSS file */
@layer dialtone.reset, dialtone.base, dialtone.components, dialtone.utilities, app;

@layer app {
  .my-custom-button {
    prop: value;
  }
}
```

#### Option 3: Unlayered Overrides (Use Sparingly)

Styles outside any `@layer` have the highest priority:

```css
/* These override ALL layered styles (including Dialtone utilities) */
.my-critical-override {
  color: red !important;
}
```

<dt-notice
  title="Warning"
  kind="warning"
  hide-close
  class="d-wmx100p d-mt24"
>
  Use unlayered styles sparingly. They defeat the purpose of cascade layers and make styles harder to maintain.
</dt-notice>

### Common Patterns

#### Override Dialtone Component Styles

Create an app layer after utilities:

```css
@layer dialtone.reset, dialtone.base, dialtone.components, dialtone.utilities, app.overrides;

@layer app.overrides {
  .d-foo--custom {
    prop: value;
  }
}
```

#### Third-Party CSS Integration

If using third-party libraries, wrap them in a layer between components and utilities:

```css
@layer dialtone.reset, dialtone.base, dialtone.components, third-party, dialtone.utilities;

@layer third-party {
  @import 'some-library/styles.css';
}
```

This ensures:

- Third-party styles don't override Dialtone components unexpectedly
- Dialtone utilities can still override third-party styles

### What Happens Without Layers?

Styles **not in a layer** have higher priority than **all layered styles** for normal declarations:

```css
/* Layered (lower priority) */
@layer dialtone.utilities {
  .d-fc-primary { color: blue !important; }
}

/* Unlayered (higher priority) */
.some-class { color: red; } /* WINS over layered utilities */
```

However, `!important` reverses this: layered `!important` beats unlayered `!important`.

### Best Practices for Consumers

<dialtone-usage>
<template #do>

- Use Dialtone utility classes when possible
- Create app layers after `dialtone.utilities` for custom styles
- Wrap third-party CSS in layers
- Keep unlayered styles to a minimum

</template>
<template #dont>

- Add unlayered styles unless absolutely necessary
- Create layers that conflict with Dialtone's layer names
- Mix layered and unlayered styles in the same file without good reason

</template>
</dialtone-usage>

## For Contributors

### What Goes in Each Layer

#### `dialtone.reset`

- CSS resets (normalize.css)
- Typography resets (`h1`, `h2`, etc.)
- Global element resets

**Files**: `lib/build/less/dialtone-reset.less`, typography reset section in `utilities/typography.less`

#### `dialtone.base`

- Design tokens (CSS custom properties)
- `@font-face` declarations
- Theme styles
- Global `html`/`body` rules
- Vue transition classes

**Files**: Token CSS (via `dialtone-tokens.cjs`), `dialtone-globals.less`, `dialtone-transitions.less`, `themes/default.less`

#### `dialtone.components`

- Component styles (buttons, inputs, modals, etc.)
- Recipe styles (complex compositions)
- Typography component classes, i.e. [DtText](../../components/text.html)
- Layout compositions

**Files**: `components/*.less` (49 files), `recipes/*.less` (21 files), component sections in utility files

#### `dialtone.utilities`

- Utility classes with `!important`
- Generated utilities (colors, spacing, sizing, etc.)
- Responsive utilities (`.lg:d-d-block`, etc.)
- Hand-written utility classes

**Files**: `utilities/*.less` (10 files), generated by `postcss/dialtone-generators.cjs` and `postcss-responsive-variations` plugin

### Adding New Styles

#### Adding a New Component

Wrap your component styles in `@layer dialtone.components`:

```less
// lib/build/less/components/my-component.less
@layer dialtone.components {
  .d-my-component {
    property: value;

    &__header {
      property: value;
    }
  }
}
```

**Import in `dialtone.less`**:

```less
@import 'components/my-component';
```

#### Adding New Utilities

Wrap utility classes in `@layer dialtone.utilities`:

```less
// lib/build/less/utilities/my-utilities.less
@layer dialtone.utilities {
  .d-my-util { property: value !important; }
}
```

### Parametric Mixins for Cross-Layer Access

<dt-notice
  title="Warning"
  kind="warning"
  hide-close
  class="d-mb16 d-wmx100p"
>
  LESS mixins should rarely be used. Please consult with the team before using them.
</dt-notice>

If you need to share styles between files or layers, extract parametric mixins **outside** `@layer` blocks:

```less
// Define OUTSIDE @layer for cross-file access
._my-mixin() {
  display: flex;
  align-items: center;
}

@layer dialtone.components {
  .d-component {
    ._my-mixin(); // ✅ Works
  }
}
```

**Why**: LESS treats `@layer` as a scope boundary. Mixins inside one layer cannot be accessed from another layer or file.

### Don't Break the Layers

<dialtone-usage>
<template #dont>

Avoid adding styles outside `@layer` blocks:

```less
// BAD - unlayered styles override everything
.d-my-class {
  property: value;
}
```

</template>
</dialtone-usage>

<dialtone-usage>
<template #dont>

Don't put utilities in the components layer:

```less
@layer dialtone.components {
  // BAD - utilities belong in dialtone.utilities
  .d-mt16 { property: value !important; }
}
```

</template>
</dialtone-usage>

<dialtone-usage>
<template #dont>

Don't call mixins from inside different `@layer` blocks:

```less
@layer dialtone.components {
  .d-foo() { /* ... */ }
}

@layer dialtone.utilities {
  .d-bar {
    .d-foo(); // ❌ BREAKS - mixin not accessible from `dialtone.components`
  }
}
```

</template>
</dialtone-usage>

### Testing Your Changes

After adding or modifying layered styles:

1. **Build**
2. **Verify layers**: Check `lib/dist/dialtone.css` for proper `@layer` wrapping
3. **Lint**: `pnpm run lint` - catches layer violations
4. **Test**: Ensure utilities still override components in your browser

## Resources

- [What's New: CSS Updated to Use @layer](../../dialtone/whats-new/posts/2026-2-23.html)
- [MDN: CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer)
- [CSS Cascade Layers Explainer](https://css.oddbird.net/layers/explainer/)
