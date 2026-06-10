---
type: architecture
category: architecture
keywords: [design-tokens, style-dictionary, figma, dialtone-tokens, css-custom-properties, less, themes, token-pipeline, rem, runtime-theming]
ai_summary: How Dialtone tokens flow from Figma through Style Dictionary into CSS, LESS, JS, and Vue across 50+ brands with a four-dimension layered runtime API.
last_updated: 2026-05-09
related_packages: [dialtone-tokens, dialtone-css, dialtone-vue]
---

# Design Token Pipeline

Design tokens are the single source of truth for all visual decisions in Dialtone — colors, spacing, typography, shadows, and radii. They live in `packages/dialtone-tokens/` and flow through a build pipeline that produces outputs for web, Android, and iOS from the same source.

## Overview

```
Figma (Tokens Studio)
  ↓
figma_tokens/*.json        — raw sync format from Figma
  ↓
tokens/*.json              — organized source files (base / theme / components)
  ↓
Style Dictionary build     — transforms + multi-platform output
  ↓
dist/                      — CSS, LESS, JSON, JS, Android, iOS
  ↓
dialtone-css               — consumes CSS/LESS, compiles component styles
  ↓
dialtone-vue               — applies compiled CSS classes + runtime theme switching
```

## Stage 1 — Figma Sync

The `figma_tokens/` directory holds exports from the **Tokens Studio** Figma plugin:

```
figma_tokens/
├── base.global.json      # Spacing, color palette, typography base
├── root.value.json       # Calculation references and root values
└── components.global.json # Component-specific token overrides
```

These files use Tokens Studio's format with `$` prefixed fields and Figma-specific metadata including multi-platform code syntax hints:

```json
{
  "space": {
    "100": {
      "$type": "number",
      "$value": "{100}",
      "$extensions": {
        "com.figma": {
          "codeSyntax": {
            "WEB": "var(--dt-space-100)",
            "ANDROID": "dtSpace100",
            "iOS": "dtSpace100"
          }
        }
      }
    }
  }
}
```

Two sync scripts in `sync-scripts/` handle the Figma ↔ repo exchange:
- `sync_figma_to_tokens.ts` — pulls updated tokens from Figma into the repo
- `sync_tokens_to_figma.ts` — pushes repo changes back to Figma

## Stage 2 — Token Source Files

`tokens/` contains the organized, human-readable source files that Style Dictionary actually builds from. They are structured in three layers:

```
tokens/
├── root.json              # Root font size: 10px (used for rem conversion)
├── base/
│   ├── default.json       # Raw color palette (light mode)
│   └── dark.json          # Dark mode color overrides
├── theme/
│   ├── dp/                # Dialpad brand (default)
│   ├── deca/
│   ├── tmo/
│   ├── sunflower/
│   ├── melon/
│   ├── aegean/
│   └── ... (50+ brand themes total)
├── components/
│   ├── avatar/
│   ├── badge/
│   ├── button/
│   └── ... (component-specific token overrides)
├── $metadata.json         # Defines token set resolution order
└── $themes.json           # Theme configurations (light/dark per brand)
```

### Token Reference System

Tokens reference other tokens using `{path.to.token}` syntax. Style Dictionary resolves these at build time following the order defined in `$metadata.json`:

```json
// tokens/theme/dp/default.json
{
  "color": {
    "foreground": {
      "primary":  { "value": "{color.black.900}", "type": "color" },
      "secondary": { "value": "{color.black.700}", "type": "color" },
      "critical":  { "value": "{color.red.450}",   "type": "color" }
    }
  }
}
```

The resolution cascade is: `root` → `base/default` → `base/dark` → `theme/{brand}/default` → `theme/{brand}/dark` → `components/**`. Lower layers override higher ones, so a brand theme can override a base palette value without touching the base files.

### Semantic vs Raw Tokens

The token system has two tiers:

**Raw palette** — literal values, not intended for direct use in components:
```
color.black.900 = #1C1C1C
color.red.450 = #E8543A
```

**Semantic tokens** — reference raw tokens, describe intent:
```
color.foreground.primary → {color.black.900}
color.foreground.critical → {color.red.450}
```

Components and CSS classes reference **semantic tokens only**. This is what enables theme switching — changing `color.foreground.primary` in a brand theme automatically updates everything that references it.

## Stage 3 — Style Dictionary Build

`build.js` orchestrates the full build pipeline:

1. `build-sd-transforms.js` — Style Dictionary processing
2. `runPostCss()` — PostCSS transformations on the output
3. `writeDocs()` — documentation generation
4. `generateThemeFiles()` — JavaScript theme bundle generation
5. `vite build` — bundles JS theme exports

### Custom Transforms

`dialtone-transforms.js` registers two key transforms:

**`dt/size/pxToRem`** — converts pixel values to rem using a **10px base font size** (set in `tokens/root.json`). This makes the math intentional and predictable:

```
8px  → 0.8rem
16px → 1.6rem
24px → 2.4rem
```

The 10px base is a deliberate decision — it makes converting any pixel value to rem mental arithmetic rather than requiring a calculator.

**`dt/fonts/transformToStack`** — appends system font fallbacks to font family tokens:

```
SF Pro → "SF Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, ..."
```

### Output Platforms

Style Dictionary builds 7 output formats simultaneously:

| Format | Output | Naming | Location |
|--------|--------|--------|----------|
| CSS custom properties | `--dt-color-foreground-primary` | kebab-case | `dist/css/` |
| LESS variables | `@dt-color-foreground-primary` | kebab-case | `dist/less/` |
| Flat JSON | `{ "dtColorForegroundPrimary": "#1C1C1C" }` | camelCase | `dist/` |
| JS theme bundles | Per-brand/contrast modules consumed by the runtime API | — | `dist/themes/` |
| Android XML | `<color name="dtColorForegroundPrimary">` | — | `dist/android/res/` |
| Android Kotlin | `object DialtoneTokens { val colorForegroundPrimary }` | — | `dist/android/java/` |
| iOS Swift | `enum DialtoneTokens { static let colorForegroundPrimary }` | — | `dist/ios/` |

All CSS and LESS outputs are prefixed with `--dt` to avoid collisions with other CSS variables in the consuming application.

~120 CSS files and the equivalent LESS files are generated — one per brand × mode combination plus the layered per-dimension overrides (e.g., `tokens-dp-light.css`, `tokens-dp-dark.css`, `tokens-aegean-light.css`).

## Stage 4 — dialtone-css Consumption

`packages/dialtone-css/` uses Gulp to import token outputs and compile the full CSS library:

1. Gulp copies token CSS files from `packages/dialtone-tokens/dist/css/` into `packages/dialtone-css/lib/dist/tokens/`
2. LESS source files import token LESS variables via `@import`
3. Component and utility styles reference `--dt-*` CSS custom properties throughout
4. Gulp compiles the full LESS tree into `lib/dist/dialtone.min.css`

Component LESS files reference semantic tokens directly:

```less
// packages/dialtone-css — button component
.d-btn--primary {
  background-color: var(--dt-color-brand-primary);
  color: var(--dt-color-foreground-inverted);
  border-radius: var(--dt-size-radius-md);
}
```

## Stage 5 — Vue Components

Vue components in `packages/dialtone-vue/` apply Dialtone CSS utility classes and component classes — they do not reference token variables directly. The CSS layer handles that.

```vue
<template>
  <button class="d-btn d-btn--primary">
    <slot />
  </button>
</template>
```

The `d-btn--primary` class resolves to `background-color: var(--dt-color-brand-primary)`, which resolves to the current theme's brand primary color.

### Runtime Theme Switching

The `dist/themes/` JavaScript entrypoints back the layered runtime API in `@dialpad/dialtone/themes/config`. Apps initialize once on startup and switch any of the four theming dimensions (mode, brand, contrast, material) at runtime without a page reload.

```javascript
import {
  initDialtoneTheme,
  setMode,
  setBrand,
  setContrast,
  setMaterial,
} from '@dialpad/dialtone/themes/config';
import Dp from '@dialpad/dialtone/themes/dp';
import Tmo from '@dialpad/dialtone/themes/tmo';
import HighContrast from '@dialpad/dialtone/themes/high-contrast';

initDialtoneTheme(Dp, 'light');  // load core, base, dp brand, light mode
setMode('dark');                 // toggle data-dt-mode attribute
setBrand(Tmo);                   // inject Tmo brand CSS, set data-dt-brand
setContrast(HighContrast);       // inject contrast CSS, set data-dt-contrast
setMaterial('steel');            // toggle data-dt-material attribute
```

The four dimensions split along two switching mechanisms:

- **Mode and material** are attribute-driven. The runtime sets `data-dt-mode` / `data-dt-material` on the root; pre-bundled CSS (loaded once at app startup) applies via `[data-dt-mode="..."]` / `[data-dt-material="..."][data-dt-mode="..."]` attribute selectors.
- **Brand and contrast** are injection-driven. The runtime injects per-theme override `<style>` tags keyed by id (`dialtone-css-brand-colors`, `dialtone-css-contrast`); brand and contrast each ship one small CSS payload per option.

Brands can pair to a locked material via the `shell.base.material` token in their source JSON. When `setBrand` is called for a locked brand, `data-dt-material` toggles automatically alongside `data-dt-brand` in the same paint frame.

For the full API surface (including `getBrandMaterial` / `hasBrandMaterialLock` getters, the brand-locked-material order-of-operations, and Web Components / Shadow DOM support), see the [Theme and Mode guide](https://dialtone.dialpad.com/guides/theme-and-mode/).

## All Token Outputs at a Glance

```
packages/dialtone-tokens/dist/
├── css/                    # ~120 CSS files (--dt-* custom properties)
├── less/                   # ~120 LESS files (@dt-* variables)
├── themes/                 # ~55 JS bundles for the runtime API
│   └── chunks/             # Shared CSS chunks (Vite code splitting)
├── postcss/                # PostCSS plugins
│   ├── debug-mode.js       # Highlights token-driven values in orange
│   ├── rem-to-px.js        # Fallback conversion for px-required contexts
│   └── root-to-host.js     # :root → :host for web components
├── types/                  # TypeScript declarations
├── android/                # Android XML + Kotlin
├── ios/                    # Swift enums
└── tokens-*.json           # 35 flat JSON files
```

## Naming Convention

All token output names follow the same hierarchy: `dt-{category}-{semantic-name}`:

```
--dt-color-foreground-primary     # color → foreground (intent) → primary
--dt-color-surface-primary        # color → surface (container) → primary
--dt-font-size-200                # font-size scale
--dt-space-400                    # spacing scale
--dt-size-radius-md               # border radius
--dt-shadow-card-3-color          # shadow system
```

Categories: `color`, `font-size`, `font-family`, `font-weight`, `space`, `size`, `shadow`, `typography` (composites).
