---
type: development
category: development
keywords: [icons, svg, dialtone-icons, gulp, vue-components, keywords, categories, accessibility, naming]
ai_summary: How to add SVG icons to dialtone-icons — SVG requirements, categories, keywords, Gulp pipeline, and generated Vue components.
last_updated: 2026-03-04
related_packages: [dialtone-icons, dialtone-vue]
---

# Icon Development

Icons in Dialtone are SVG files that live in `packages/dialtone-icons/src/svg/icons/`. A Gulp pipeline transforms them into Vue 3 components and updates all exports automatically.

## Source Directory Structure

```
packages/dialtone-icons/src/
├── svg/
│   ├── icons/
│   │   ├── alerts/
│   │   ├── arrows/
│   │   ├── brand/
│   │   ├── brand-full-color/
│   │   ├── communication/
│   │   ├── controls/
│   │   ├── data/
│   │   ├── devices/
│   │   ├── editing/
│   │   ├── general/
│   │   ├── os/
│   │   ├── people/
│   │   ├── places/
│   │   ├── time/
│   │   └── weather/
│   └── illustrations/
├── icons/              # Generated Vue components (do not edit)
├── keywords-icons.json # Searchable keyword index (hand-maintained)
└── IconTemplate.vue    # Template used by the Gulp transform
```

15 icon categories. Illustrations follow the same layout under `illustrations/`.

## How to Add a New Icon

### Step 1 — Place the SVG

Save the file as kebab-case in the appropriate category:

```
src/svg/icons/{category}/{icon-name}.svg
```

Example: `src/svg/icons/general/my-new-icon.svg`

**SVG requirements:**
- Use `fill` attributes on paths — the build replaces all fill colors (`#000`, `#000000`, `black`, `#0D0C0F`, `#222`, `#222222`) with `fill="currentColor"`. This is what allows icons to inherit the text color from CSS.
- Do not use hardcoded `id` attributes in clip-paths or gradient elements — the build generates unique IDs at component creation time via `uniqueID` to prevent collisions when multiple instances of the same icon appear on a page.
- `width` and `height` attributes on the root `<svg>` will be stripped. Use `viewBox` to preserve proportions.
- For `brand-full-color` icons: fill colors are preserved (not replaced with `currentColor`) since full-color brand marks are intended to retain their original colors.

### Step 2 — Add Keywords

Open `src/keywords-icons.json` and add the icon under its category:

```json
{
  "categories": {
    "general": {
      "my-new-icon": ["keyword1", "search-term", "alias"]
    }
  }
}
```

Keywords power the icon search in the Dialtone documentation site and in any icon picker built on top of `keywords-icons.json`. Use descriptive synonyms a designer or developer would search for.

### Step 3 — Run the Build

```bash
cd packages/dialtone-icons
pnpm run gulp
```

Or from the monorepo root:

```bash
pnpm nx run dialtone-icons:build
```

### Step 4 — Commit Generated Files

The build modifies several generated files. Commit all of them:

- `src/icons/my-new-icon.vue` — generated Vue component
- `dist/svg/icons/my-new-icon.svg` — processed SVG output
- `dist/icons.js` — updated icon name list
- `dist/keywords-icons.json` — updated keyword index
- `index.js` — updated exports file

## What the Build Does

The Gulp pipeline transforms each SVG through several stages:

1. **Process SVG** — Strips `width`/`height`, replaces fill colors with `currentColor`, adds accessibility attributes (`aria-hidden="true"`, `focusable="false"`, `role="img"`), adds `class="d-icon d-icon--{name}"` and `data-name="{Title}"`, minifies with svgmin.

2. **Transform to Vue** — The `transformSVGtoVue.cjs` script injects the processed SVG into `IconTemplate.vue`, replacing placeholders with the SVG content and the PascalCase component name. The template also adds reactive props (`size`, `ariaLabel`) and a `uniqueID` for any clip-paths or gradients.

3. **Update keyword index** — Any icons found in `src/svg/icons/` that are not yet in `keywords-icons.json` are added with an empty keywords array. Existing entries are preserved.

4. **Regenerate `index.js`** — All icon names are collected, sorted, and exported as both individual named exports and a glob-based `icons` object.

## Generated Component

For `src/svg/icons/general/my-new-icon.svg`, the build produces `DtIconMyNewIcon`:

```javascript
// Auto-generated — do not edit
export default {
  name: 'DtIconMyNewIcon',
  props: {
    size: {
      type: String,
      default: '500',
      validator: (s) => Object.keys(ICON_SIZE_MODIFIERS).includes(s),
    },
    ariaLabel: { type: String, default: undefined },
  },
  computed: {
    iconSizeClass () { return ICON_SIZE_MODIFIERS[this.size]; },
    ariaHidden () { return !this.ariaLabel ? 'true' : 'false'; },
  },
};
```

Generated component names are always `DtIcon{PascalCase}`. The conversion is automatic — `alert-circle` becomes `DtIconAlertCircle`, `brand-logo-dialpad` becomes `DtIconBrandLogoDialpad`.

## Icon Sizes

Icons support 8 sizes via the `size` prop:

| Value | CSS class | Approximate size |
|-------|-----------|-----------------|
| `100` | `d-icon--size-100` | 10px |
| `200` | `d-icon--size-200` | 12px |
| `300` | `d-icon--size-300` | 14px |
| `400` | `d-icon--size-400` | 16px |
| `500` | `d-icon--size-500` | 20px (default) |
| `600` | `d-icon--size-600` | 24px |
| `700` | `d-icon--size-700` | 32px |
| `800` | `d-icon--size-800` | 48px |

```vue
<dt-icon-my-new-icon size="600" aria-label="My new icon" />
```

When `aria-label` is provided, `aria-hidden` is set to `false`. When omitted, it defaults to `true` (decorative icon, hidden from screen readers).

## Exports and Consumption

Icons are exported from `@dialpad/dialtone-icons` under the `vue3` sub-path:

```javascript
// Named import (preferred for Vite/ESM)
import { DtIconAlertCircle } from '@dialpad/dialtone-icons/vue3';

// Default import (preferred for Webpack)
import DtIconAlertCircle from '@dialpad/dialtone-icons/vue3/alert-circle';

// Import all as glob object (tree-shakeable)
import { icons } from '@dialpad/dialtone-icons/vue3';

// Keyword data for search UIs
import keywords from '@dialpad/dialtone-icons/keywords-icons.json';

// Flat list of icon names
import iconsList from '@dialpad/dialtone-icons/icons.js';

// Raw SVG file
import alertSvg from '@dialpad/dialtone-icons/svg/icons/alerts/alert-circle.svg';
```

`dialtone-vue` imports icons using the named export pattern. When a Dialtone Vue component renders an icon slot, it accepts any `DtIcon*` component from `@dialpad/dialtone-icons/vue3`.

## Illustrations

Illustrations follow the same workflow as icons but live in `src/svg/illustrations/`. Key differences:
- Fill colors are **not** replaced (illustrations keep their full-color fills)
- Component names use `DtIllustration` prefix: `DtIllustrationEmptyState`
- No `size` prop variants — illustrations use CSS sizing
- Exported from `@dialpad/dialtone-icons` as `illustrations` glob, not `icons`
- Keyword metadata in `src/keywords-illustrations.json`
