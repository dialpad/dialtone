---
title: Theme and Mode
description: How to use Dialtone's theming system to customize appearance and support light/dark modes.
---

## Overview

Dialtone provides a flexible theming system that allows you to:

- **Switch between light and dark modes** for user preference
- **Apply different brand themes** (51+ available themes)
- **Enable high contrast mode** for accessibility
- **Support Shadow DOM** for web components and micro-frontends

The system uses a layered architecture that loads core tokens once and applies brand-specific overrides, resulting in better performance and smaller bundle sizes compared to legacy approaches.

## Quick Start

Install the required packages:

```shell
npm install @dialpad/dialtone @dialpad/dialtone-tokens
```

Initialize theming in your main.js or App.vue:

```js
import { initDialtoneTheme } from '@dialpad/dialtone/themes/config';
import Dp from '@dialpad/dialtone-tokens/themes/dp';

initDialtoneTheme(Dp, 'light');
```

Done. Your app now has theming with light mode and the Dialpad base theme.

## Understanding Themes vs Modes

**Mode** controls the light/dark appearance of your interface:

- `light` - Standard light background with dark text
- `dark` - Dark background with light text

**Theme** (brand) controls the color palette and brand identity:

- Base themes: `dp` (Dialpad), `tmo` (T-Mobile)
- Named themes: `aegean`, `botany`, `buttercream`, `melon`, `plum`, etc.
- Accessibility themes: `prota-deuter`, `trita`
- Experimental themes: `101` through `137`

**Contrast** provides additional accessibility support:

- `high-contrast` - Enhanced contrast ratios for WCAG AAA compliance

[See all themes visually →](/design/colors/themes/)

## Basic Usage

### Toggle Light/Dark Mode

```js
import { setMode } from '@dialpad/dialtone/themes/config';

setMode('dark');  // Switch to dark mode
setMode('light'); // Switch to light mode
```

### Switch Themes Dynamically

```js
import { setBrand } from '@dialpad/dialtone/themes/config';
import Melon from '@dialpad/dialtone-tokens/themes/melon';
import Tmo from '@dialpad/dialtone-tokens/themes/tmo';

setBrand(Melon); // Switch to Melon theme
setBrand(Tmo);   // Switch to T-Mobile theme
```

### Enable High Contrast

```js
import { setContrast } from '@dialpad/dialtone/themes/config';
import HighContrast from '@dialpad/dialtone-tokens/themes/high-contrast';

setContrast(HighContrast); // Enable high contrast
setContrast(null);          // Disable high contrast
```

## Available Themes

Dialtone provides 51+ themes. Import any theme from `@dialpad/dialtone-tokens/themes/{theme-name}`:

**Standard themes:**

- `dp` - Dialpad (base theme)
- `tmo` - T-Mobile
- `aegean`, `botany`, `buttercream`, `high-desert`, `melon`, `plum`, `sunflower`, `verdant-haze`

**Accessibility themes:**

- `prota-deuter` - Optimized for protanopia/deuteranopia color blindness
- `trita` - Optimized for tritanopia color blindness

**Experimental themes:**

- `101` through `137` - Themes awaiting final names

**Contrast:**

- `high-contrast` - Enhanced contrast for accessibility

**Import pattern:**

```js
import ThemeName from '@dialpad/dialtone-tokens/themes/{theme-name}';
// Examples:
import Dp from '@dialpad/dialtone-tokens/themes/dp';
import Melon from '@dialpad/dialtone-tokens/themes/melon';
import ProtaDeuter from '@dialpad/dialtone-tokens/themes/prota-deuter';
```

[Browse all themes with visual examples →](/design/colors/themes/)

## Advanced Usage

### Web Components and Shadow DOM

When using Dialtone in web components, pass the host element as the third parameter. The function will automatically access the shadowRoot.

**Common mistake:**

```js
// ❌ WRONG - Styles inject into document.documentElement!
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    initDialtoneTheme(Dp, 'light'); // Missing rootNode parameter
  }
}
```

**Correct approach:**

```js
// ✅ CORRECT - Pass host element, function accesses shadowRoot
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    initDialtoneTheme(Dp, 'light', this); // Pass host element
  }

  toggleMode() {
    setMode('dark', this); // Also pass to setter functions
  }
}
```

**Important:** Pass the host element (the custom element itself), not `this.shadowRoot`. The theme functions handle shadowRoot access internally.

### CSS-Only Approach (No JavaScript)

For environments where JavaScript module imports aren't available, use CSS imports:

```css
@import "@dialpad/dialtone-tokens/layered/tokens-core.css";
@import "@dialpad/dialtone-tokens/layered/tokens-base-colors.css";
@import "@dialpad/dialtone-tokens/layered/tokens-dp-colors.css";
```

Then set data attributes manually:

```html
<html data-dt-mode="light" data-dt-brand="dp" data-dt-contrast="default">
```

Switch themes by changing the brand CSS import and updating the `data-dt-brand` attribute.

### Mode Sections

You can create sections with different modes using the [Mode Island component](/components/mode-island.html). This is useful for:

- Dark mode previews within light mode pages
- Code examples showing both modes
- Mixed-mode UI sections

### Multiple Root Nodes (Micro-frontends)

The theme system supports multiple independent root nodes using per-rootNode tracking:

```js
// Parent app
initDialtoneTheme(Dp, 'light', document.documentElement);

// Embedded micro-frontend (different theme/mode)
const microFrontendContainer = document.querySelector('#micro-frontend');
initDialtoneTheme(Melon, 'dark', microFrontendContainer);
```

Each root node maintains independent theme state without conflicts.

## Migrating from Legacy System

### What's the Difference?

**Legacy system:**

- Complete token files per theme (~1256KB each)
- Imports like `DpLight`, `DpDark`, `TmoLight`, `TmoDark`
- Single function: `setTheme(DpLight)`

**Layered system (current):**

- Core tokens loaded once, brand overrides applied
- Smaller bundle sizes, better performance
- Separate functions: `initDialtoneTheme()`, `setMode()`, `setBrand()`

### Migration Example

**Before (legacy):**

```js
import { setTheme } from '@dialpad/dialtone/themes/config';
import DpLight from '@dialpad/dialtone/themes/dp-light';
import DpDark from '@dialpad/dialtone/themes/dp-dark';

setTheme(DpLight);
// Later:
setTheme(DpDark);
```

**After (layered):**

```js
import { initDialtoneTheme, setMode } from '@dialpad/dialtone/themes/config';
import Dp from '@dialpad/dialtone-tokens/themes/dp';

initDialtoneTheme(Dp, 'light');
// Later:
setMode('dark');
```

### Should You Migrate?

**Migrate if:**

- Building a new project
- Need better performance
- Want smaller bundle sizes
- Plan to offer multiple theme choices

**Stay on legacy if:**

- Existing project working fine
- Migration effort not justified
- Only need simple light/dark switching

**Note:** Both systems are fully supported and work identically with Shadow DOM.

## Troubleshooting

### Themes Not Applying in Web Components

**Problem:** Initialized theme but styles don't apply inside custom element.

**Solution:** Pass the host element as third parameter:

```js
initDialtoneTheme(Dp, 'light', this);
```

**Why:** Without the rootNode parameter, styles inject into `document.documentElement` instead of your component's shadowRoot.

### Multiple Init Warnings

**Problem:** Console warns about multiple calls to `initDialtoneTheme()` on same element.

**Solution:** Only call `initDialtoneTheme()` once per root node. Use `setMode()`, `setBrand()`, or `setContrast()` for dynamic updates:

```js
// ✅ Correct
initDialtoneTheme(Dp, 'light');
setMode('dark'); // Later

// ❌ Incorrect
initDialtoneTheme(Dp, 'light');
initDialtoneTheme(Dp, 'dark'); // Don't re-init!
```

### Embedded App Overwriting Parent Theme

**Problem:** Micro-frontend overwrites parent application's theme.

**Solution:** Pass container element to embedded app's `initDialtoneTheme()`:

```js
// In micro-frontend
const myContainer = document.querySelector('#my-app');
initDialtoneTheme(Melon, 'dark', myContainer);
```

**Why:** Default parameter is `document.documentElement`, which affects the entire page.

### Invalid Mode Error

**Problem:** TypeError about invalid mode value.

**Solution:** Mode must be exactly `'light'` or `'dark'` (lowercase strings):

```js
// ✅ Correct
setMode('light');
setMode('dark');

// ❌ Incorrect
setMode('Light');  // Wrong capitalization
setMode(true);     // Wrong type
```

### Performance Issues with Frequent Switching

**Problem:** Theme switching feels slow or causes layout shifts.

**Solution:** The system optimizes by skipping DOM updates when content unchanged. If switching feels slow:

1. Ensure you're using the layered system (not legacy)
2. Only switch what changed (use `setMode()` instead of re-initializing)
3. Consider debouncing rapid theme switches in your UI

## Complete Example

Vue 3 app with theme switching:

```vue
<template>
  <div>
    <button @click="toggleMode">
      Switch to {{ isDark ? 'Light' : 'Dark' }} Mode
    </button>
    <select @click="changeTheme">
      <option value="dp">Dialpad</option>
      <option value="melon">Melon</option>
      <option value="tmo">T-Mobile</option>
    </select>
    <label>
      <input type="checkbox" v-model="highContrast" @change="toggleContrast">
      High Contrast
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { initDialtoneTheme, setMode, setBrand, setContrast } from '@dialpad/dialtone/themes/config';
import Dp from '@dialpad/dialtone-tokens/themes/dp';
import Melon from '@dialpad/dialtone-tokens/themes/melon';
import Tmo from '@dialpad/dialtone-tokens/themes/tmo';
import HighContrast from '@dialpad/dialtone-tokens/themes/high-contrast';

const isDark = ref(false);
const highContrast = ref(false);
const themes = { dp: Dp, melon: Melon, tmo: Tmo };

onMounted(() => {
  initDialtoneTheme(Dp, 'light');
});

function toggleMode() {
  isDark.value = !isDark.value;
  setMode(isDark.value ? 'dark' : 'light');
}

function changeTheme(event) {
  const themeName = event.target.value;
  setBrand(themes[themeName]);
}

function toggleContrast() {
  setContrast(highContrast.value ? HighContrast : null);
}
</script>
```

## Related

- [Design: Colors and Themes](/design/colors/themes/) - Visual examples of all themes
- [Component: Mode Island](/components/mode-island.html) - Create mode sections within pages
- [Getting Started](/guides/getting-started/) - Initial Dialtone setup
- [Design Tokens](/tokens/) - Complete token catalog
