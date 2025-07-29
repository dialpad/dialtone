---
title: Themes
description: Comprehensive theming system that enables consistent visual experiences across different contexts and user preferences within Dialpad products.
no_preview: true
---

<div class="d-m32"></div>

## Overview

Dialtone's theming system provides a flexible foundation for creating consistent visual experiences across different contexts, user preferences, and product variations. Our theming approach leverages semantic color tokens to enable seamless switching between light, dark, and custom brand themes while maintaining accessibility and design consistency.

What we prioritize is **contextual adaptability**, ensuring themes can be applied systematically across components while preserving semantic meaning and visual hierarchy throughout the user experience.

<div class="d-m32"></div>

<div class="d-bgc-brand d-bar8">
 <svg-loader name="themes-overview" />
</div>

## Default Themes for Dialpad

Dialpad products ship with carefully crafted default themes that serve different use cases and user preferences. Each theme maintains our core design principles while adapting to specific contexts.

<div class="d-bgc-brand d-bar8"><svg-loader class="d-fl1" name="default-themes" /></div>

<div class="d-m32"></div>

### Light Theme

The primary theme optimized for daytime use and well-lit environments. Features high contrast ratios and clear visual hierarchy using our standard color palette.

### Dark Theme  

Designed for low-light environments and extended use sessions. Reduces eye strain while maintaining accessibility standards and visual clarity.

### High Contrast Theme

Enhanced accessibility theme with increased contrast ratios for users with visual impairments or challenging viewing conditions.

<div class="d-bgc-brand d-bar8"><svg-loader class="d-fl1" name="theme-variations" /></div>

## Theming Token Structure

Our theming system is built on a hierarchical token structure that separates **base colors** from **semantic tokens** from **theme-specific implementations**. This approach ensures consistency while enabling flexibility.

<div class="d-bgc-brand d-bar8"><svg-loader class="d-fl1" name="token-structure" /></div>

<div class="d-m32"></div>

The token hierarchy follows this pattern:

- **Base Palette Tokens**: Core color values (e.g., `--dt-color-purple-500`)
- **Semantic Tokens**: Purpose-driven mappings (e.g., `--dt-color-foreground-primary`)  
- **Theme Tokens**: Context-specific implementations (e.g., `--dt-theme-light-foreground-primary`)

### Token Naming Convention

Theme tokens follow a consistent naming pattern:

```css
--dt-theme-{theme-name}-{semantic-role}-{variant}
```

Examples:

- `--dt-theme-light-surface-primary`
- `--dt-theme-dark-foreground-secondary`
- `--dt-theme-brand-accent-default`

## Applying Tokens

When implementing themes in your components, always use semantic tokens rather than base color values. This ensures your components automatically adapt when themes are switched.

<dialtone-usage class="d-d-grid d-g24 d-g-cols2">
  <template #do>
    <div class="d-bgc-brand d-bar8">
      <svg-loader class="d-fl1" name="theme-tokens-do" />
    </div>
    <h4>Use semantic theme tokens</h4>
    Reference theme-aware semantic tokens that automatically adapt to the active theme context.
  </template>
  <template #dont>
    <div class="d-bgc-brand d-bar8">
      <svg-loader class="d-fl1" name="theme-tokens-dont" />
    </div>
    <h4>Don't use base color tokens directly</h4>
    Avoid referencing base palette tokens directly as they won't respond to theme changes.
  </template>
</dialtone-usage>

<div class="d-m32"></div>

### CSS Implementation

```css
/* ✅ Correct - Uses theme-aware semantic tokens */
.my-component {
  background-color: var(--dt-theme-surface-primary);
  color: var(--dt-theme-foreground-primary);
  border-color: var(--dt-theme-border-default);
}

/* ❌ Incorrect - Uses base tokens that don't adapt to themes */
.my-component {
  background-color: var(--dt-color-black-100);
  color: var(--dt-color-black-900);
  border-color: var(--dt-color-black-300);
}
```

## Customize Theming

For advanced use cases, you can create custom themes by defining your own token mappings while maintaining the semantic structure.

<div class="d-bgc-brand d-bar8"><svg-loader class="d-fl1" name="custom-themes" /></div>

<div class="d-m32"></div>

### Creating Custom Themes

1. **Define your color palette**: Start with base color tokens that align with your brand
2. **Map semantic meanings**: Assign base colors to semantic roles (primary, secondary, etc.)
3. **Test accessibility**: Ensure contrast ratios meet WCAG guidelines
4. **Validate consistency**: Check that your theme works across all component states

### Custom Theme Example

```css
/* Custom brand theme */
:root[data-theme="custom-brand"] {
  --dt-theme-surface-primary: var(--dt-color-blue-50);
  --dt-theme-surface-secondary: var(--dt-color-blue-100);
  --dt-theme-foreground-primary: var(--dt-color-blue-900);
  --dt-theme-foreground-secondary: var(--dt-color-blue-700);
  --dt-theme-accent-default: var(--dt-color-gold-500);
  --dt-theme-accent-hover: var(--dt-color-gold-600);
}
```

## Apply Themes

Themes are applied at the application level using data attributes or CSS classes, allowing for dynamic switching and scoped theme application.

<div class="d-bgc-brand d-bar8"><svg-loader class="d-fl1" name="apply-themes" /></div>

<div class="d-m32"></div>

### Theme Application Methods

#### Data Attribute Method (Recommended)

```html
<html data-theme="dark">
  <!-- All child elements inherit dark theme -->
</html>
```

#### CSS Class Method

```html
<div class="dt-theme-light">
  <!-- Scoped light theme application -->
</div>
```

### JavaScript Theme Switching

```javascript
// Switch to dark theme
document.documentElement.setAttribute('data-theme', 'dark');

// Switch to light theme  
document.documentElement.setAttribute('data-theme', 'light');

// Switch to custom theme
document.documentElement.setAttribute('data-theme', 'custom-brand');
```

### Responsive Theme Application

Themes can be applied responsively based on user preferences or system settings:

```css
/* Respect user's system preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Apply dark theme tokens */
  }
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    /* Apply light theme tokens */
  }
}
```

<div class="d-m32"></div>

## Best Practices

- **Always use semantic tokens** when building components to ensure theme compatibility
- **Test themes across all component states** including hover, focus, and disabled states  
- **Maintain accessibility standards** by verifying contrast ratios in all theme variations
- **Document custom themes** with clear usage guidelines and token mappings
- **Consider user preferences** by supporting system-level theme detection where appropriate

Embrace our theming system to create adaptable, accessible, and consistent experiences that can evolve with user needs and brand requirements.
