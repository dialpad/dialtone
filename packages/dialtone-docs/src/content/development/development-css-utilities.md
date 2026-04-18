---
type: development
category: development
keywords: [css-utilities, less, postcss, gulp, responsive, utility-classes, dialtone-css, naming-convention, generators, breakpoints]
ai_summary: How CSS utility classes are structured and added in dialtone-css — static LESS files, PostCSS generators, naming conventions, and Gulp build.
last_updated: 2026-03-04
related_packages: [dialtone-css, dialtone-tokens, postcss-responsive-variations]
---

# CSS Utilities Development

CSS utility classes in Dialtone live in `packages/dialtone-css/`. They can be defined in two ways depending on whether the class follows a repeating pattern or is a one-off.

## Package Structure

```
packages/dialtone-css/
├── lib/
│   ├── build/
│   │   ├── less/
│   │   │   ├── utilities/       # Static utility class definitions
│   │   │   │   ├── spacing.less
│   │   │   │   ├── layout.less
│   │   │   │   ├── flex.less
│   │   │   │   ├── sizing.less
│   │   │   │   ├── colors.less
│   │   │   │   ├── typography.less
│   │   │   │   └── ...
│   │   │   ├── components/      # Component-specific styles
│   │   │   └── dialtone.less    # Root import — imports everything
│   │   └── js/
│   └── dist/                    # Compiled output (generated, do not edit)
│       ├── dialtone.css
│       ├── dialtone.min.css
│       └── tokens/              # Copied from dialtone-tokens/dist/css/
├── postcss/
│   ├── dialtone-generators.cjs  # Dynamic utility generator plugin
│   ├── constants.cjs            # Value mappings (size scale, etc.)
│   └── helpers.cjs              # Shared generator utilities
└── gulpfile.cjs                 # Build orchestration
```

## Naming Convention

All utility classes follow the pattern: `d-{category-abbreviation}{value}`

```
d-mt-100        margin-top with space-400 token (8 units)
d-fc-primary font-color foreground-primary
d-bgc-surface background-color surface
d-p-0         padding 0
d-h100       height 100%
d-t50p       top 50% (position)
```

Category abbreviations used:
- `m`, `mt`, `mr`, `mb`, `ml` — margin and directional
- `p`, `pt`, `pr`, `pb`, `pl` — padding and directional
- `fc` — font color
- `bgc` — background color
- `bc` — border color
- `h`, `w` — height, width
- `t`, `r`, `b`, `l` — top, right, bottom, left (position)
- `d` — display

The numeric value suffix maps to the spacing scale token: `0`, `1`, `2`, `4`, `6`, `8`, `12`, `16`, `24`, `32`, `48`, `64`, `128`. These short form numbers map to token IDs 100–800 in `postcss/constants.cjs`.

## Approach 1 — Static LESS Files

Use this for utility classes that don't follow a generated pattern, or are singletons like `d-m-auto`.

**Choose the right file** based on category:
- Spacing utilities → `lib/build/less/utilities/spacing.less`
- Layout (display, position, overflow, z-index) → `lib/build/less/utilities/layout.less`
- Sizing (width, height) → `lib/build/less/utilities/sizing.less`
- Flexbox → `lib/build/less/utilities/flex.less`
- Color → `lib/build/less/utilities/colors.less`

**Write the class** using a CSS custom property from `dialtone-tokens`:

```less
// spacing.less
.d-m-auto { margin: auto !important; }
.d-mx-auto { margin-left: auto !important; margin-right: auto !important; }

// Using a token variable
.d-mt8 { margin-top: var(--dt-space-400) !important; }
```

All utility classes use `!important` to ensure they override component styles when applied.

After adding the class, run the build and the class appears in `lib/dist/dialtone.css`.

## Approach 2 — PostCSS Generator

Use this when adding a whole category of classes that follow a repeating pattern (e.g., every spacing size for every side of a property).

The generator lives in `postcss/dialtone-generators.cjs`. It is a PostCSS plugin that runs after LESS compilation and appends generated rules.

**Step 1 — Add value mappings to `postcss/constants.cjs`:**

```javascript
// Maps the short suffix (used in class names) to the spacing token ID
module.exports = {
  MY_SIZES: {
    0: '0',
    1: '100',
    2: '200',
    4: '300',
    8: '400',
    16: '500',
  },
};
```

**Step 2 — Create a generator function in `postcss/dialtone-generators.cjs`:**

```javascript
function myPropertyUtilities (clonedSource, declaration) {
  Object.keys(MY_SIZES).forEach(size => {
    generatedRules.myProperty.push(new Rule({
      source: clonedSource,
      selector: `.d-my-${size}`,
      nodes: [
        declaration.clone({
          prop: 'my-property',
          value: `var(--dt-space-${MY_SIZES[size]}) !important`,
        }),
      ],
    }));
  });
}
```

**Step 3 — Register it in `_generateUtilities`:**

```javascript
function _generateUtilities (clonedSource, declaration) {
  colorUtilities(clonedSource, declaration);
  spacingUtilities(clonedSource, declaration);
  myPropertyUtilities(clonedSource, declaration);   // Add here
}
```

**Step 4 — Pre-declare in `generatedRules`** at the top of the file:

```javascript
const generatedRules = {
  myProperty: [],
  // ... existing categories
};
```

## Responsive Variants

Responsive variants are generated automatically by the `@dialpad/postcss-responsive-variations` package. For any utility class configured to have responsive variants, the plugin creates breakpoint-prefixed versions:

| Prefix | Media Query |
|--------|------------|
| `sm:` | `(min-width: 480px)` |
| `md:` | `(min-width: 640px)` |
| `lg:` | `(min-width: 960px)` |
| `xl:` | `(min-width: 1264px)` |

Example output:

```css
.d-mt8             { margin-top: var(--dt-space-400) !important; }
@media (min-width: 480px)  { .sm\:d-mt8 { margin-top: var(--dt-space-400) !important; } }
@media (min-width: 640px)  { .md\:d-mt8 { margin-top: var(--dt-space-400) !important; } }
@media (min-width: 960px)  { .lg\:d-mt8 { margin-top: var(--dt-space-400) !important; } }
@media (min-width: 1264px) { .xl\:d-mt8 { margin-top: var(--dt-space-400) !important; } }
```

## Hover and Focus Variants

The generator also appends hover, focus, and focus-visible variants for color-based utility classes:

```
h\:d-fc-primary   — applies on :hover
f\:d-fc-primary   — applies on :focus
fv\:d-fc-primary  — applies on :focus-visible
```

These are appended by `appendHoverFocusSelectors` inside `dialtone-generators.cjs`.

## Gulp Build Pipeline

The full build is orchestrated by `gulpfile.cjs`:

1. **Clean** — Deletes `lib/dist/`
2. **Tokens** — Copies `node_modules/@dialpad/dialtone-tokens/dist/css/*.css` into `lib/dist/tokens/`. Token CSS files are not compiled here — they are pre-built by `dialtone-tokens` and simply copied.
3. **Fonts** — Copies `.woff2` files to `lib/dist/fonts/`
4. **SVGs** — Processes spot illustration SVGs and system icon SVGs
5. **Styles** — The main compilation step:
   - Input: `lib/build/less/dialtone.less` (imports everything)
   - LESS compilation via `gulp-less`
   - PostCSS pipeline: `dialtone-generators` plugin (appends generated utility classes) → `autoprefixer`
   - Output: `lib/dist/dialtone.css`
   - Minification via `cssnano` → `lib/dist/dialtone.min.css`

```bash
# Full build
pnpm nx run dialtone-css:build

# Watch mode (skips minification, uses sourcemaps)
pnpm nx run dialtone-css:start
```

## Referencing Tokens in Styles

Component LESS files and utility classes reference tokens via CSS custom properties. Never use raw hex values — always reference a `--dt-*` variable:

```less
.d-btn--primary {
  background-color: var(--dt-color-brand-primary);
  color: var(--dt-color-foreground-inverted);
  border-radius: var(--dt-size-radius-md);
}
```

This is what enables runtime theme switching — changing `--dt-color-brand-primary` in the DOM updates every component and utility that references it.

## What Not to Edit

`lib/dist/` is fully generated. Do not edit files there directly — they will be overwritten on the next build. All source edits go in `lib/build/less/` (static) or `postcss/` (dynamic generators).
