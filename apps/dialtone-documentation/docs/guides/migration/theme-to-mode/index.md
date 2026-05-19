---
title: "Theme: setTheme deprecated, layered API replaces it"
description: "The legacy setTheme() function and data-dt-theme attribute have been deprecated in favor of the new layered API: initDialtoneTheme, setMode, setBrand, setContrast, and setMaterial."
---

## TLDR

> [!WARNING] Breaking change
> `setTheme()` is deprecated and `data-dt-theme` no longer set by default. Projects adopting `next` must migrate to the layered API. Run the migration script to automate the transition.

- `setTheme()` still works but is deprecated. Migrate to `initDialtoneTheme()` for startup, `setMode()` / `setBrand()` / `setContrast()` / `setMaterial()` for runtime switching.
- Root attributes: `data-dt-theme` is no longer set. New attributes are `data-dt-mode`, `data-dt-brand`, `data-dt-contrast`, and `data-dt-material`.
- Run `npx dialtone-migration-helper` and select **theme to mode** to automate most of this.

## Why

The old `setTheme()` model coupled three independent concerns — color mode (light/dark), brand (dp/tmo/melon), and contrast (default/high) — into a single monolithic theme object. Switching from light to dark required swapping the entire object, including brand tokens that hadn't changed.

The layered API separates these four orthogonal dimensions:

- **Mode** (`setMode`) — light or dark. Changes instantly with a single attribute toggle.
- **Brand** (`setBrand`) — which color palette overrides to apply (dp, tmo, melon, etc.).
- **Contrast** (`setContrast`) — default or high contrast, for WCAG AAA accessibility.
- **Material** (`setMaterial`) — surface texture layer (`sandstone` default, plus `steel`, `graphite`, `iron`, `amethyst`, `jade`). Applied independently of mode or brand; some brands lock their material — see [Brand-locked materials](/guides/theme-and-mode/#brand-locked-materials) for details.

You can now switch any dimension independently, which reduces bundle work, enables runtime contrast toggles without a full theme reload, and maps cleanly to user preferences (OS dark-mode + a brand choice + an accessibility setting + a material preference are four separate controls).

## What Changed

| | Before | After |
| --- | --- | --- |
| Startup call | `setTheme(DpLight)` | `initDialtoneTheme(Dp, 'light')` |
| Mode switching | `setTheme(DpDark)` | `setMode('dark')` |
| Brand switching | `setTheme(TmoLight)` | `setBrand(Tmo)` |
| Contrast | `setTheme(theme, root, HighContrast)` | `setContrast(HighContrast)` |
| Disable contrast | `setTheme(theme, root, null)` | `setContrast(null)` |
| Material | *(not available)* | `setMaterial('sandstone')` |
| Root attribute (mode) | `data-dt-theme="dp-light"` | `data-dt-mode="light"` |
| Root attribute (brand) | `data-dt-brand="dp"` *(already existed)* | `data-dt-brand="dp"` *(unchanged)* |
| Root attribute (contrast) | `data-dt-contrast="default"` *(already existed)* | `data-dt-contrast="default"` *(unchanged)* |
| Root attribute (material) | *(not available)* | `data-dt-material="sandstone"` |
| CSS selector | `[data-dt-theme="dp-light"]` | `[data-dt-mode="light"]` |

> [!INFO] setTheme still works
> `setTheme()` is not removed. It continues to work with both legacy theme objects and the new layered format. Deprecation means it will be removed in a future major release. The migration script handles the rewrite automatically.

## Quick Checklist

1. Run the migration script: `npx dialtone-migration-helper --cwd ./src` and select **theme to mode**.
2. Review any `data-dt-theme="invert"` patterns the script flagged — decide whether each should adopt `v-dt-mode` (see [Manual Review](#manual-review-for-v-dt-mode-candidates)).
3. Smoke-test your app: toggle light/dark, switch brand if applicable, toggle high contrast if used, apply a material if your app uses one.

## Migration

Run the migration helper from your project root:

```bash
npx dialtone-migration-helper --cwd ./src
```

Select **theme to mode** from the interactive menu. Add `--dry-run` to preview changes without writing files. Add `--yes` to apply without prompting.

The script handles the patterns below automatically. After it runs, also run `npx eslint --fix` to clean up the `setTheme` named import that becomes unused after the call-site rewrite.

### Startup call

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```js
setTheme(DpLight);
```

</div>
<div>

### After

```js
initDialtoneTheme(Dp, 'light');
```

</div>
</div>

Call `initDialtoneTheme()` once on startup. It loads core tokens, sets the initial mode and brand, and sets contrast to `'default'`.

### Runtime mode switching

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```js
setTheme(DpDark);
```

</div>
<div>

### After

```js
setMode('dark');
```

</div>
</div>

### Root attribute (HTML/CSS)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```html
<html data-dt-theme="dp-light">
```

```css
[data-dt-theme="dp-light"] .d-banner { ... }
```

</div>
<div>

### After

```html
<html data-dt-mode="light" data-dt-brand="dp" data-dt-contrast="default" data-dt-material="sandstone">
```

```css
[data-dt-mode="light"] .d-banner { ... }
```

</div>
</div>

If your code reads `getAttribute('data-dt-theme')` or sets it manually, the migration script rewrites `setAttribute`/`getAttribute` call first arguments and CSS `[data-dt-theme]` selectors automatically.

### Contrast

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```js
import HighContrast from '@dialpad/dialtone/themes/high-contrast';

// Enable on init
setTheme(DpLight, document.documentElement, HighContrast);

// Toggle on/off — required full re-init
setTheme(DpLight);
setTheme(DpLight, document.documentElement, HighContrast);
```

</div>
<div>

### After

```js
import HighContrast from '@dialpad/dialtone/themes/high-contrast';

// Enable
setContrast(HighContrast);

// Disable (return to default)
setContrast(null);
```

</div>
</div>

## Manual Review for v-dt-mode Candidates

The script flags `data-dt-theme="invert"` patterns with a comment rather than auto-rewriting them:

```html
<!-- TODO: review for v-dt-mode adoption — see /guides/migration/theme-to-mode/ -->
<section data-dt-theme="invert">...</section>
```

**Why not auto-rewrite?** The `v-dt-mode` directive resolves the inverted mode against the *live* parent mode using a MutationObserver — it stays reactive when the parent mode changes at runtime. A static `data-dt-mode="dark"` replacement would be wrong for any component sitting inside a dynamic parent. The correct rewrite depends on what the surrounding mode context is in your app.

For each flagged location, decide:

**Adopt `v-dt-mode` (recommended when the parent mode is dynamic):**

```html
<!-- Before: manually inverted region -->
<section data-dt-theme="invert">Dark island inside a light page</section>

<!-- After: reactive invert via directive -->
<section v-dt-mode>Dark island inside a light page</section>
```

```js
import { DtModeDirective } from '@dialpad/dialtone-vue';
app.use(DtModeDirective);
```

**Keep a static override (acceptable when the parent mode never changes):**

```html
<section data-dt-mode="dark">Always dark regardless of parent</section>
```

**Use `DtModeIsland` (when you need a styled container with background):**

```html
<dt-mode-island mode="invert">Inverted region with surface color</dt-mode-island>
```

For full directive documentation see the [v-dt-mode Storybook page](https://dialtone.dialpad.com/vue/next/?path=/docs/directives-mode--docs). For `DtModeIsland`, see the [Mode Island component page](/components/mode-island.html).

> [!INFO] Dynamic bindings and template literals
> The script only rewrites static `data-dt-theme="invert"` string literals. Vue dynamic bindings (`:data-dt-theme="expr"`) and JavaScript template literals are not covered. After running the script, grep your codebase for any remaining `data-dt-theme` references: `grep -r 'data-dt-theme' ./src`.

## Need Help?

If you have any troubles, please let us know in the **#dialtone** Dialpad channel.
