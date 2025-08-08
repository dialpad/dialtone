---
title: Themes
description: Create diverse themes for projects using our simplified theming infrastructure.
no_preview: true
---

<div class="d-m32"></div>

## Overview

Dialtone's theming system is a flexible foundation for creating consistent visual experiences. It lets you adapt the user interface to different contexts, preferences, and product variations. Our approach uses semantic color tokens to easily switch between themes and modes.

Currently, the only themeable part of the application is the shell, which consists of the top and left navigation.

### Mode

A mode defines a visual style that applies across all themes. It determines the overall luminosity and contrast of the interface.

- Light: The default mode, with a light background and dark text.

- Dark: A dark background with light text, ideal for low-light environments.

### Theme

A theme represents a specific brand or product identity. It applies a unique set of colors to the shell, and it works in conjunction with a mode.

- dp: The default Dialpad theme.

- tmo: A custom theme for T-Mobile.

- sunflower: A custom theme for the Sunflower brand.

<div class="d-m32"></div>

## Interactive Theme Preview

Use the dropdowns below to explore how different themes and modes affect the visual appearance:

<themes-demo />

<div class="d-m32"></div>

## Video Overview

<div class="d-m16"></div>

<video controls width="100%" style="max-width: 800px; border-radius: 8px;">
  <source src="/path/to/your/video.mp4" type="video/mp4">
  <source src="/path/to/your/video.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

<div class="d-m32"></div>

<div class="d-bgc-brand d-bar8"><svg-loader class="d-fl1" name="default-themes" /></div>

<div class="d-m32"></div>

### Overriding in Dark Mode

Sometimes, when customizing themes, you might want a different accent color in light mode compared to dark mode. By changing base colors specifically within dark mode (or vice versa), you can create a diverse set of styles for your themes across both modes.

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

<script setup>
import ThemesDemo from '@baseComponents/ThemesDemo.vue';
</script>
