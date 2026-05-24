---
type: development
category: development
keywords: [design-tokens, style-dictionary, figma, tokens-json, semantic-tokens, raw-tokens, css-custom-properties, less, theme, build]
ai_summary: How to add design tokens to dialtone-tokens — file structure, reference syntax, semantic vs raw distinction, and build steps.
last_updated: 2026-03-04
related_packages: [dialtone-tokens, dialtone-css]
---

# Design Token Development

Design tokens are the source of truth for all visual values in Dialtone. They live in `packages/dialtone-tokens/tokens/` as JSON files and are compiled by Style Dictionary into CSS, LESS, JSON, and JavaScript outputs consumed by all other packages.

## Token File Structure

```
packages/dialtone-tokens/tokens/
├── root.json               # Root font size: 10px (drives rem conversion math)
├── base/
│   ├── default.json        # Raw color palette (light mode base)
│   └── dark.json           # Dark mode color overrides
├── theme/
│   ├── dp/                 # Dialpad brand (default theme)
│   │   ├── default.json    # Brand-specific semantic token overrides
│   │   └── dark.json
│   ├── aegean/
│   ├── deca/
│   ├── tmo/
│   ├── sunflower/
│   └── ... (14 brands total)
├── components/
│   ├── button/
│   ├── avatar/
│   └── ... (component-specific token overrides)
├── $metadata.json          # Defines token set resolution order
└── $themes.json            # Theme configurations (which sets combine per theme)
```

## Semantic vs Raw Tokens

The token system has two distinct tiers. Understanding this is critical before adding any token.

**Raw tokens** — Literal values in `base/default.json`. These are the palette:

```
color.black.900 = #1C1C1C
color.red.450 = #E8543A
color.indigo.200 = #C3D0F5
```

Raw tokens are **reference-only**. CSS and Vue components must never use them directly.

**Semantic tokens** — Named by intent, defined in `theme/*/default.json`. These reference raw tokens:

```
color.foreground.primary → {color.black.900}
color.foreground.critical → {color.red.450}
```

Components and CSS classes only reference semantic tokens. This is what makes theming work — a brand theme can override `color.foreground.primary` to point at a different raw palette value without touching any component code.

## Token Reference Syntax

Tokens reference other tokens with `{path.to.token}` syntax:

```json
{
  "color": {
    "foreground": {
      "primary": {
        "value": "{color.black.900}",
        "type": "color"
      }
    }
  }
}
```

The path uses dot notation matching the JSON object structure. Style Dictionary resolves references at build time following the order defined in `$metadata.json`.

**Resolution cascade** — lower files override higher ones:

```
root
  → base/default
    → base/dark (for dark mode)
      → theme/{brand}/default
        → theme/{brand}/dark
          → components/**
```

## Adding a New Color Token

### Raw Color (New Palette Entry)

Edit `tokens/base/default.json`:

```json
{
  "color": {
    "myColor": {
      "100": { "value": "#F0F4FF", "type": "color" },
      "200": { "value": "#C3D0F5", "type": "color" },
      "500": { "value": "#2D5BE3", "type": "color" },
      "900": { "value": "#0F1B4D", "type": "color" }
    }
  }
}
```

For dark mode overrides, add matching paths in `tokens/base/dark.json`.

### Semantic Color (Intent Mapping)

Edit the appropriate theme file in `tokens/theme/dp/default.json` (or another brand if brand-specific):

```json
{
  "color": {
    "foreground": {
      "myIntent": {
        "value": "{color.myColor.900}",
        "type": "color"
      }
    }
  }
}
```

Output CSS: `--dt-color-foreground-my-intent`

### Brand Theme Override

To override a color only for a specific brand, edit `tokens/theme/{brand}/default.json`:

```json
{
  "color": {
    "foreground": {
      "primary": {
        "value": "{color.myColor.500}",
        "type": "color"
      }
    }
  }
}
```

This overrides `color.foreground.primary` for that brand only. All other brands remain unaffected.

## Adding a New Spacing Token

Edit `tokens/base/default.json` in the `space` object:

```json
{
  "space": {
    "100": { "value": "8px",  "type": "spacing" },
    "200": { "value": "16px", "type": "spacing" },
    "350": { "value": "28px", "type": "spacing" },
    "400": { "value": "32px", "type": "spacing" }
  }
}
```

The `dt/size/pxToRem` transform converts pixel values using the 10px root font size set in `root.json`:

```
8px  → 0.8rem
16px → 1.6rem
32px → 3.2rem
```

This base is intentional — it makes mental arithmetic straightforward without a calculator.

Output CSS: `--dt-space-100`, `--dt-space-200`, `--dt-space-350`, `--dt-space-400`

## Token JSON Format

Every token entry needs `value` and `type`. `description` is optional but recommended for non-obvious tokens:

```json
{
  "color": {
    "foreground": {
      "primary": {
        "value": "{color.black.900}",
        "type": "color",
        "description": "Primary text color. Used for body copy and headings."
      }
    }
  }
}
```

Valid `type` values: `color`, `spacing`, `sizing`, `fontSizes`, `fontFamilies`, `fontWeights`, `lineHeights`, `borderRadius`, `boxShadow`, `opacity`, `number`.

## CSS Variable Naming

Output CSS variable names follow the token JSON path hierarchy, converted to kebab-case with `--dt-` prefix:

| JSON path | CSS variable |
|-----------|-------------|
| `color.foreground.primary` | `--dt-color-foreground-primary` |
| `spacing.400` | `--dt-spacing-400` |
| `layout.200` | `--dt-layout-200` |
| `size.radius.md` | `--dt-size-radius-md` |
| `shadow.raised.3.color` | `--dt-shadow-raised-3-color` |
| `typography.body.md` | `--dt-typography-body-md` |

LESS output uses `@` prefix instead: `@dt-color-foreground-primary`

## Build Steps After Adding Tokens

Run the token build from the `dialtone-tokens` package:

```bash
pnpm nx run dialtone-tokens:build
```

The build runs sequentially:

1. **`build-sd-transforms.js`** — Style Dictionary resolves references and applies custom transforms. Outputs 36 CSS files and 36 LESS files (one per theme × mode) into `dist/css/` and `dist/less/`
2. **PostCSS** — Composes shorthand typography and box-shadow tokens from their component parts
3. **`writeDocs()`** — Regenerates token documentation metadata
4. **`generateThemeFiles()`** — Generates JavaScript theme bundles
5. **Vite build** — Bundles the 59 JS theme files in `dist/themes/`

After the token build, rebuild `dialtone-css` to pick up the new CSS variables:

```bash
pnpm nx run dialtone-css:build
```

`dialtone-css` copies the token CSS files from `dialtone-tokens/dist/css/` into its own `lib/dist/tokens/` during its build.

## What Gets Regenerated

After a token change, the following outputs are regenerated:

```
dist/css/tokens-{theme}-{mode}.css   — 36 files (--dt-* custom properties)
dist/less/tokens-{theme}-{mode}.less — 36 files (@dt-* variables)
dist/themes/                          — 59 JS bundles for runtime switching
dist/tokens-*.json                    — 35 flat JSON files (camelCase)
dist/android/                         — Android XML + Kotlin
dist/ios/                             — Swift enums
```

## PostCSS Debug Mode

The token build also generates a debug mode CSS at `dist/postcss/debug-mode.js`. When applied, it turns all token-driven values bright orange, making it easy to identify which values on screen are controlled by the token system vs hardcoded values.

## Common Mistakes

**Adding raw tokens directly to component LESS** — Components must always reference `--dt-*` CSS custom properties, never hardcoded hex values. Hardcoded values break theming.

**Adding semantic tokens to `base/default.json`** — Base files hold raw palette values only. Semantic tokens (foreground, surface, border, etc.) belong in `theme/*/default.json`.

**Forgetting to rebuild dialtone-css after a token change** — The token CSS files are copied during the CSS build. Changing tokens and only rebuilding tokens means the CSS package still has the old values.

**Using the wrong token tier in components** — Using `--dt-color-black-900` directly instead of `--dt-color-foreground-primary` means the component will not respond to theme changes.
