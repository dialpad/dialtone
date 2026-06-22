---
title: Theme and Mode
description: Dialtone system to customize appearance and support light/dark modes.
keywords: ["dark mode", "light mode"]
---

## Overview

Dialtone has four theming tiers (mode, brand, material, and contrast) overlaid on a core token bundle that loads once.

### Quick Start

Install the required packages:

```shell
npm install @dialpad/dialtone
```

Initialize theming in your main.js or App.vue:

```js
import { initDialtoneTheme } from '@dialpad/dialtone/themes/config';
import Dp from '@dialpad/dialtone/themes/dp';

initDialtoneTheme(Dp, 'light');
```

Done. Your app now has theming with light mode and the Dialpad base theme.

## Understanding the Theming System

### 1. Mode

Controls the light/dark appearance of your interface:

- `light` - Standard light background with dark text
- `dark` - Dark background with light text

### 2. Brand

Controls the color palette and identity layer applied on top of the base tokens:

- Base themes: `dp` (Dialpad), `tmo` (T-Mobile)
- Named themes: `aegean`, `botany`, `buttercream`, `melon`, `plum`, etc.
- Accessibility themes: `prota-deuter`, `trita`
- Experimental themes: `101` through `137`

### 3. Material

Retints the neutral (`--dt-color-black-*`) ramp. Choices are `sandstone` (default), `steel`, `graphite`, `iron`, `amethyst`, and `jade`. Brands can lock to a specific material via the `shell.base.material` token in their token JSON; brands that omit the field are free-choice. Free-choice brands today: `dp`, `tmo`, `prota-deuter`, `trita`.

### 4. Contrast

- `high-contrast` - Enhanced contrast between foreground and background colors, introduce borders selectively, along with stronger border contrast.

<!-- [See all themes visually →](/foundations/colors/themes/) -->

## API at a glance

All functions live at `@dialpad/dialtone/themes/config`. Theme modules live at `@dialpad/dialtone/themes/<name>`.

| Function | Purpose | Reset signal |
| --- | --- | --- |
| `initDialtoneTheme(brand, mode?, rootNode?)` | One-time setup. Loads core tokens and applies an initial brand and mode. | — |
| `setMode(mode, rootNode?)` | Switch between `'light'` and `'dark'`. | — |
| `setBrand(brandTheme \| null, rootNode?)` | Apply a brand overlay on top of the base. Pass `null` (or the same brand as the base) to clear. Auto-applies the brand's locked material if declared. | `null` |
| `setBaseBrand(brandTheme, rootNode?)` | Replace the base brand layer (the foundation `initDialtoneTheme` writes to). Prefer `setBrand` for dynamic switching; use this only when you need to reseat the foundation itself. | — |
| `setContrast(contrastTheme \| null, rootNode?)` | Apply or remove a contrast layer. | `null` |
| `setMaterial(name \| null, rootNode?)` | Apply or remove a material override. Accepts a string material name. | `null` |
| `getBrandMaterial(brandTheme)` | Returns the brand's locked material name, or `null` for free-choice brands. | — |
| `hasBrandMaterialLock(brandTheme)` | Boolean form of `getBrandMaterial` for picker logic. | — |
| `resetBrand(rootNode?)` | Remove all theme styles and attributes. Allows re-`init`. | — |

`rootNode` defaults to `document.documentElement`. In Web Components, pass the host element instead — see [Web Components and Shadow DOM](#web-components-and-shadow-dom).

The active state is reflected on the root element as data attributes:

| Attribute | Values |
| --- | --- |
| `data-dt-mode` | `light`, `dark` |
| `data-dt-brand` | `dp`, `tmo`, `melon`, `botany`, … (any [available brand](#available-themes)) |
| `data-dt-material` | `sandstone`, `steel`, `graphite`, `iron`, `amethyst`, `jade` |
| `data-dt-contrast` | `default`, `high` |

## Basic Usage

### Toggle Light/Dark Mode

```js
import { setMode } from '@dialpad/dialtone/themes/config';

setMode('dark');  // Switch to dark mode
setMode('light'); // Switch to light mode
```

### Switch Brand

```js
import { initDialtoneTheme, setBrand } from '@dialpad/dialtone/themes/config';
import Dp from '@dialpad/dialtone/themes/dp';
import Melon from '@dialpad/dialtone/themes/melon';
import Tmo from '@dialpad/dialtone/themes/tmo';

initDialtoneTheme(Dp, 'light'); // base brand = dp

setBrand(Tmo);   // overlay tmo on top of dp
setBrand(Melon); // switch overlay to melon
setBrand(null);  // clear overlay; back to dp
setBrand(Dp);    // same as null — dp IS the base, no diff needed
```

### Enable High Contrast

```js
import { setContrast } from '@dialpad/dialtone/themes/config';
import HighContrast from '@dialpad/dialtone/themes/high-contrast';

setContrast(HighContrast); // Enable high contrast
setContrast(null);          // Disable high contrast
```

### Switch Material

```js
import { setMaterial } from '@dialpad/dialtone/themes/config';

setMaterial('steel'); // Apply the steel material
setMaterial(null);    // Reset to sandstone (the default)
```

`setMaterial` toggles the `data-dt-material` attribute on the root, which selects the matching material override CSS already loaded in the bundle. It doesn't touch brand or mode. Pass any of the five non-default material names (`steel`, `graphite`, `iron`, `amethyst`, `jade`); pass `null` or `'sandstone'` to clear the override.

> [!INFO] Material is root-level by design
> Material applies at the document root only — there's no per-subtree override. Material is paired to brand for visual coherence (see [Brand-locked materials](#brand-locked-materials)), and mixing materials within a page would break that pairing. Mode (light/dark) is the only theming dimension with per-subtree override (via DtModeIsland and `v-dt-mode`).

## Available Themes

Dialtone provides 51+ themes. Import any theme from `@dialpad/dialtone/themes/{theme-name}`:

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

**Materials:**

- `sandstone` - Default warm-yellow neutral ramp (baked into base CSS — clearing the material returns here)
- `steel`, `graphite`, `iron`, `amethyst`, `jade` - Override ramps. All ship pre-bundled in the layered CSS; `setMaterial(name)` toggles the active one via `data-dt-material`.

Materials are passed to `setMaterial` by string name — there are no per-material modules to import.

Most brands declare a locked material in their token JSON. Switching to a locked brand auto-applies its material; the [Material picker in the navbar](#brand-locked-materials) disables on those brands. Free-choice brands (`dp`, `tmo`, `prota-deuter`, `trita`) keep the picker enabled.

**Brand import pattern:**

```js
import ThemeName from '@dialpad/dialtone/themes/{theme-name}';
// Examples:
import Dp from '@dialpad/dialtone/themes/dp';
import Melon from '@dialpad/dialtone/themes/melon';
import ProtaDeuter from '@dialpad/dialtone/themes/prota-deuter';
```

<!-- [Browse all themes with visual examples →](/foundations/colors/themes/) -->

## Advanced Usage

### Brand-locked materials

Brands can declare a locked material via the `shell.base.material` token in their token JSON. Switching to a locked brand auto-applies the matching material — no separate `setMaterial` call needed. Two getters help you build a picker UI around this:

```js
import { getBrandMaterial, hasBrandMaterialLock } from '@dialpad/dialtone/themes/config';
import Botany from '@dialpad/dialtone/themes/botany';
import Dp from '@dialpad/dialtone/themes/dp';

getBrandMaterial(Botany);     // 'sandstone'
getBrandMaterial(Dp);         // null (free-choice)

hasBrandMaterialLock(Botany); // true
hasBrandMaterialLock(Dp);     // false
```

Disable material options in your picker when `hasBrandMaterialLock(activeBrandTheme)` returns true.

**Side effect on `setBrand`:** for a locked brand, `setBrand` auto-applies the matching material (toggling `data-dt-material` alongside `data-dt-brand` in the same paint frame). This applies to both the overlay setter (`setBrand`) and the base setter (`setBaseBrand`):

```js
import { setBrand } from '@dialpad/dialtone/themes/config';
import Botany from '@dialpad/dialtone/themes/botany';

setBrand(Botany); // brand → botany; material → sandstone (botany's lock)
```

If a brand declares an unknown material name (typo in token JSON, removed material), `setBrand` falls back to sandstone and logs a `console.warn` so the issue surfaces in development without breaking paint.

> [!WARNING] Set brand first, then material
> Calling `setMaterial` and then `setBrand` for a locked brand discards your manual choice. `setBrand`'s side effect runs last and applies the brand's lock. If you need to override for a free-choice brand, call `setBrand` first, then `setMaterial`.

`setMaterial` itself is not lock-aware: it applies what you pass regardless of the active brand. The picker UI enforces the lock (via `hasBrandMaterialLock`); the runtime API does not. Direct overrides still work, which is useful for catalog previews.

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

For environments where JavaScript module imports aren't available, use CSS imports. The `layered/` CSS files are only published from `@dialpad/dialtone-tokens`, so add it as a direct dependency for this path:

```shell
npm install @dialpad/dialtone-tokens
```

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

Use the `v-dt-mode` directive to create sections with different modes within a page.
Apply it to any existing element — no wrapper needed:

```html
<section v-dt-mode:dark>
  Dark mode content
</section>
```

When no container element exists, the [Mode Island component](/components/mode-island.html)
creates one for you. See the [Mode Island page](/components/mode-island.html) for full
documentation on both approaches.

### Micro-frontends (Separate Bundles)

Each micro-frontend has its own JavaScript bundle with separate config.js instance:

```js
// Parent app (own bundle)
// Manages document.documentElement
initDialtoneTheme(Dp, 'light');

// Embedded micro-frontend (separate bundle, separate config.js instance)
// Manages its own container
const myContainer = document.querySelector('#my-app-container');
initDialtoneTheme(Dp, 'dark', myContainer);
```

Each app bundle manages exactly ONE rootNode. State is isolated by bundle boundaries, not by tracking within a single instance.

### Resetting (tests, teardown)

Use `resetBrand()` to remove all theme styles and attributes from a root node. After reset, `initDialtoneTheme()` can run again on the same node.

```js
import { resetBrand } from '@dialpad/dialtone/themes/config';

// Test cleanup
afterEach(() => resetBrand());

// Web Component teardown
disconnectedCallback() {
  resetBrand(this);
}
```

## Migrating from Legacy `setTheme`

`setTheme()` is kept as a deprecated alias for `setBrand()` — existing callers continue to work without changes. The legacy format ships complete per-theme bundles (e.g. `DpLight`, `DpDark`, `TmoLight`); `setBrand` auto-detects it via the presence of a `base` property. New code should use the layered API instead, which loads core tokens once and overlays smaller per-dimension overrides.

```js
// Legacy — still works, setTheme is a deprecated alias for setBrand
import { setTheme } from '@dialpad/dialtone/themes/config';
import DpLight from '@dialpad/dialtone/themes/dp-light';
setTheme(DpLight);

// Layered (preferred)
import { initDialtoneTheme, setMode } from '@dialpad/dialtone/themes/config';
import Dp from '@dialpad/dialtone/themes/dp';
initDialtoneTheme(Dp, 'light');
setMode('dark');
```

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

**Solution:** Only call `initDialtoneTheme()` once per root node. Use `setMode()`, `setBrand()`, or `setContrast()` for dynamic updates after init:

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
initDialtoneTheme(Dp, 'dark', myContainer);
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

### Why is the Material picker disabled when I switch brands?

**Problem:** Material options are unselectable after switching to a non-`dp`/non-`tmo` brand.

**Solution:** The brand declares a locked material in its token JSON, and the picker reflects that. To re-enable manual selection, switch back to `dp`, `tmo`, `prota-deuter`, or `trita` (the free-choice brands).

**Why:** Most brands declare a `shell.base.material` token that pairs the brand with a hue-aligned material. `setBrand` auto-applies the locked material, and `hasBrandMaterialLock` returns `true` so the picker disables. See [Brand-locked materials](#brand-locked-materials) for the full API.

## Complete Example

Vue 3 app with mode, brand, material, and contrast pickers. The Material picker disables when the active brand declares a lock.

```vue
<template>
  <dt-stack gap="100">
    <dt-button @click="toggleMode">
      Switch to {{ isDark ? 'Light' : 'Dark' }} Mode
    </dt-button>
    <dt-select-menu
      v-model="currentBrand"
      label="Brand"
      :options="brandOptions"
    />
    <dt-select-menu
      v-model="userMaterial"
      :model-value="displayedMaterial"
      label="Material"
      :options="materialOptions"
      :disabled="isMaterialLocked"
    />
    <dt-checkbox
      v-model="highContrast"
      label="High Contrast"
    />
  </dt-stack>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { DtButton, DtSelectMenu, DtCheckbox, DtStack } from '@dialpad/dialtone-vue';
import {
  initDialtoneTheme,
  setMode,
  setBrand,
  setContrast,
  setMaterial,
  getBrandMaterial,
  hasBrandMaterialLock,
} from '@dialpad/dialtone/themes/config';
import Dp from '@dialpad/dialtone/themes/dp';
import Melon from '@dialpad/dialtone/themes/melon'; // locked to iron
import Tmo from '@dialpad/dialtone/themes/tmo';
import HighContrast from '@dialpad/dialtone/themes/high-contrast';

const isDark = ref(false);
const highContrast = ref(false);
const currentBrand = ref('dp');
const userMaterial = ref('sandstone');

const brands = { dp: Dp, melon: Melon, tmo: Tmo };
const brandOptions = [
  { value: 'dp', label: 'Dialpad' },
  { value: 'melon', label: 'Melon (locked → iron)' },
  { value: 'tmo', label: 'T-Mobile' },
];

const materialOptions = [
  { value: 'sandstone', label: 'Sandstone' },
  { value: 'steel', label: 'Steel' },
  { value: 'graphite', label: 'Graphite' },
  { value: 'iron', label: 'Iron' },
  { value: 'amethyst', label: 'Amethyst' },
  { value: 'jade', label: 'Jade' },
];

const activeBrandTheme = computed(() => brands[currentBrand.value]);
const lockedMaterial = computed(() => getBrandMaterial(activeBrandTheme.value));
const isMaterialLocked = computed(() => hasBrandMaterialLock(activeBrandTheme.value));
const displayedMaterial = computed(() => lockedMaterial.value ?? userMaterial.value);

onMounted(() => initDialtoneTheme(Dp, 'light'));

function toggleMode() {
  isDark.value = !isDark.value;
  setMode(isDark.value ? 'dark' : 'light');
}

watch(currentBrand, (name) => setBrand(brands[name])); // auto-applies any locked material
watch(userMaterial, (name) => {
  if (!isMaterialLocked.value) setMaterial(name === 'sandstone' ? null : name);
});
watch(highContrast, (on) => setContrast(on ? HighContrast : null));
</script>
```

## Related

- [Design: Colors and Themes](/foundations/colors/themes/) - Visual examples of all themes
- [Component: Mode Island](/components/mode-island.html) - Create mode sections within pages
- [Getting Started](/guides/getting-started/) - Initial Dialtone setup
- [Design Tokens](/tokens/) - Complete token catalog
