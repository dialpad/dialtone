---
title: Migrating Success Tokens, Utility Classes, and Lint Rules to Positive
description: "\"Success\"-named design tokens and utility classes have been renamed to \"positive\". A migration helper, ESLint rule, and Stylelint rule are available. Non-breaking at the CSS / token layer."
---

> [!INFO] Non-breaking at the CSS / token layer
> Existing CSS / token references keep working unchanged. Legacy `var(--dt-color-*-success-*)` references resolve as deprecated aliases and the deprecated utility classes still emit. A future major release will remove the deprecated `success*` token entries entirely.

## TLDR

- Surface, border, and link `success*` design tokens are renamed to `positive*`. Foreground tokens were renamed in a previous pass; this completes the rename across every color role.
- Utility classes `d-bgc-success*`, `d-bc-success*`, and `d-fc-success*` are deprecated. Use `d-bgc-positive*`, `d-bc-positive*`, and `d-fc-positive*` instead.
- Run [`dialtone-migration-helper`](#migration-tool) (CSS variables + utility classes), the [ESLint rule](#eslint-rule) (utility-class detection), or the [Stylelint rule](#stylelint-rule) (CSS-variable detection) to find and fix usages.
- Component prop-value renames (`kind="success"`, `tone="success"`, `surface="success"`, etc.) live in the [Component Props & Events guide](../component-props/). Run `dialtone-migrate-props` to migrate those.

## What's affected

- **Components updated:** [DtBox](/components/box.html), [DtToast](/components/toast.html), [DtNotice](/components/notice.html), [DtModal](/components/modal.html), [DtProgressCircle](/components/progress-circle.html), [DtLink](/components/link.html), and any other component whose internal LESS referenced `var(--dt-color-{surface,border}-success-*)`.
- **Documentation refreshed:** [Background color](/utilities/backgrounds/color.html), [Border color](/utilities/borders/color.html), [Font color](/utilities/typography/font-color.html), and component pages whose examples used `success*` token names or utility classes.
- **New tooling:** A `success-to-positive` config for `dialtone-migration-helper`, a new `dialtone/deprecated-success-color-classes` ESLint rule, and a new `dialtone/no-deprecated-success-tokens` Stylelint rule.

## Token renames

Every renamed token is listed below. The old name still resolves and is marked `"$deprecated": "Use positive instead."` in the token source. The new name is canonical.

<dt-prose class="d-mbe-200">
<details>
<summary>View all before/after design token pairs</summary>

  | Old token | New token |
  | --- | --- |
  | `color.foreground.success` | `color.foreground.positive` |
  | `color.foreground.success-strong` | `color.foreground.positive-strong` |
  | `color.foreground.success-inverted` | `color.foreground.positive-inverted` |
  | `color.foreground.success-strong-inverted` | `color.foreground.positive-strong-inverted` |
  | `color.surface.success` | `color.surface.positive` |
  | `color.surface.success-subtle` | `color.surface.positive-subtle` |
  | `color.surface.success-strong` | `color.surface.positive-strong` |
  | `color.surface.success-opaque` | `color.surface.positive-opaque` |
  | `color.surface.success-subtle-opaque` | `color.surface.positive-subtle-opaque` |
  | `color.surface.success-inverted` | `color.surface.positive-inverted` |
  | `color.surface.success-subtle-inverted` | `color.surface.positive-subtle-inverted` |
  | `color.surface.success-strong-inverted` | `color.surface.positive-strong-inverted` |
  | `color.surface.success-opaque-inverted` | `color.surface.positive-opaque-inverted` |
  | `color.surface.success-subtle-opaque-inverted` | `color.surface.positive-subtle-opaque-inverted` |
  | `color.border.success` | `color.border.positive` |
  | `color.border.success-subtle` | `color.border.positive-subtle` |
  | `color.border.success-strong` | `color.border.positive-strong` |
  | `color.border.success-inverted` | `color.border.positive-inverted` |
  | `color.border.success-subtle-inverted` | `color.border.positive-subtle-inverted` |
  | `color.border.success-strong-inverted` | `color.border.positive-strong-inverted` |
  | `color.link.success` | `color.link.positive` |
  | `color.link.success-hover` | `color.link.positive-hover` |
  | `color.link.success-inverted` | `color.link.positive-inverted` |
  | `color.link.success-inverted-hover` | `color.link.positive-inverted-hover` |

</details>
</dt-prose>

The foreground rows are listed for completeness. Those tokens were renamed in a previous release; the rename across foreground / surface / border / link is now uniform.

## Examples: utility classes

Both old and new utility classes emit in the built CSS. Existing markup using `d-bgc-success*` / `d-bc-success*` / `d-fc-success*` continues to render the same color it did before.

### Foreground (`d-fc-*`)

The foreground rename happened in a previous release. The classes below are still in active use; the migration helper and ESLint rule cover them so any stragglers get cleaned up in this pass.

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```html
<p class="d-fc-success">Saved.</p>
<p class="d-fc-success-strong">Saved.</p>
<p class="d-fc-success-inverted">Saved.</p>
<p class="d-fc-success-strong-inverted">Saved.</p>
```

</div>
<div>

### After

```html
<p class="d-fc-positive">Saved.</p>
<p class="d-fc-positive-strong">Saved.</p>
<p class="d-fc-positive-inverted">Saved.</p>
<p class="d-fc-positive-strong-inverted">Saved.</p>
```

</div>
</div>

### Background (`d-bgc-*`)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```html
<div class="d-bgc-success">Saved.</div>
<div class="d-bgc-success-subtle">Saved.</div>
<div class="d-bgc-success-strong">Saved.</div>
<div class="d-bgc-success-opaque">Saved.</div>
<div class="d-bgc-success-subtle-opaque">Saved.</div>
<div class="d-bgc-success-inverted">Saved.</div>
<div class="d-bgc-success-subtle-inverted">Saved.</div>
<div class="d-bgc-success-strong-inverted">Saved.</div>
<div class="d-bgc-success-opaque-inverted">Saved.</div>
<div class="d-bgc-success-subtle-opaque-inverted">Saved.</div>
```

</div>
<div>

### After

```html
<div class="d-bgc-positive">Saved.</div>
<div class="d-bgc-positive-subtle">Saved.</div>
<div class="d-bgc-positive-strong">Saved.</div>
<div class="d-bgc-positive-opaque">Saved.</div>
<div class="d-bgc-positive-subtle-opaque">Saved.</div>
<div class="d-bgc-positive-inverted">Saved.</div>
<div class="d-bgc-positive-subtle-inverted">Saved.</div>
<div class="d-bgc-positive-strong-inverted">Saved.</div>
<div class="d-bgc-positive-opaque-inverted">Saved.</div>
<div class="d-bgc-positive-subtle-opaque-inverted">Saved.</div>
```

</div>
</div>

### Border (`d-bc-*`)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```html
<div class="d-bc-success">Saved.</div>
<div class="d-bc-success-subtle">Saved.</div>
<div class="d-bc-success-strong">Saved.</div>
<div class="d-bc-success-inverted">Saved.</div>
<div class="d-bc-success-subtle-inverted">Saved.</div>
<div class="d-bc-success-strong-inverted">Saved.</div>
```

</div>
<div>

### After

```html
<div class="d-bc-positive">Saved.</div>
<div class="d-bc-positive-subtle">Saved.</div>
<div class="d-bc-positive-strong">Saved.</div>
<div class="d-bc-positive-inverted">Saved.</div>
<div class="d-bc-positive-subtle-inverted">Saved.</div>
<div class="d-bc-positive-strong-inverted">Saved.</div>
```

</div>
</div>

## Examples: CSS variables

Each renamed token resolves to the same color value as its `success*` counterpart. Only the name changes.

### Surface

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```css
.foo {
  background-color: var(--dt-color-surface-success);
}

.foo--subtle {
  background-color: var(--dt-color-surface-success-subtle);
}

.foo--opaque {
  background-color: var(--dt-color-surface-success-opaque);
}

.foo--strong-inverted {
  background-color: var(--dt-color-surface-success-strong-inverted);
}
```

</div>
<div>

### After

```css
.foo {
  background-color: var(--dt-color-surface-positive);
}

.foo--subtle {
  background-color: var(--dt-color-surface-positive-subtle);
}

.foo--opaque {
  background-color: var(--dt-color-surface-positive-opaque);
}

.foo--strong-inverted {
  background-color: var(--dt-color-surface-positive-strong-inverted);
}
```

</div>
</div>

### Border

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```css
.foo {
  border-color: var(--dt-color-border-success);
}

.foo--subtle {
  border-color: var(--dt-color-border-success-subtle);
}

.foo--strong {
  border-color: var(--dt-color-border-success-strong);
}

.foo--strong-inverted {
  border-color: var(--dt-color-border-success-strong-inverted);
}
```

</div>
<div>

### After

```css
.foo {
  border-color: var(--dt-color-border-positive);
}

.foo--subtle {
  border-color: var(--dt-color-border-positive-subtle);
}

.foo--strong {
  border-color: var(--dt-color-border-positive-strong);
}

.foo--strong-inverted {
  border-color: var(--dt-color-border-positive-strong-inverted);
}
```

</div>
</div>

### Link

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```css
.foo-link {
  color: var(--dt-color-link-success);
}

.foo-link:hover {
  color: var(--dt-color-link-success-hover);
}

.foo-link--inverted {
  color: var(--dt-color-link-success-inverted);
}

.foo-link--inverted:hover {
  color: var(--dt-color-link-success-inverted-hover);
}
```

</div>
<div>

### After

```css
.foo-link {
  color: var(--dt-color-link-positive);
}

.foo-link:hover {
  color: var(--dt-color-link-positive-hover);
}

.foo-link--inverted {
  color: var(--dt-color-link-positive-inverted);
}

.foo-link--inverted:hover {
  color: var(--dt-color-link-positive-inverted-hover);
}
```

</div>
</div>

## Component prop values

Component prop-value renames (`kind="success"`, `type="success"`, `tone="success"`, `tone="success-strong"`, `validation-state="success"`, `banner-kind="success"`, `surface="success*"`, `bc="success*"`, `link-kind="success"`) are documented in [Migrating Component Props, Events, and Slots](../component-props/#severity-vocabulary). Run `dialtone-migrate-props` to update those.

## Backwards compatibility

The CSS / token layer is **non-breaking**. Component prop values were already a breaking change in a prior release; passing legacy values like `kind="success"` triggers a Vue prop validator warning. The migration script cleans these up.

| Surface | Status after this release |
| --- | --- |
| `var(--dt-color-foreground-success-*)` | Resolves. Marked `$deprecated`. |
| `var(--dt-color-surface-success-*)` | Resolves. Marked `$deprecated`. |
| `var(--dt-color-border-success-*)` | Resolves. Marked `$deprecated`. |
| `var(--dt-color-link-success-*)` | Resolves. Marked `$deprecated`. |
| `d-bgc-success*` / `d-bc-success*` / `d-fc-success*` | Emitted in the built CSS, applies the same color it did before. |
| `.d-box--surface-success*` / `.d-box--bc-success*` (hand-rolled markup) | Emitted in the built CSS alongside the new `positive*` modifier classes. |
| `<dt-box surface="success">` / `<dt-box bc="success">` (Vue prop) | Renders, but the prop validator warns; DtBox only declares `positive*` values. The migration script rewrites these. |
| `<dt-link kind="success">` / `<dt-link tone="success">` | Renders, but the prop validator warns. Migrate to `tone="positive"`. |
| `kind="success"` / `type="success"` / `tone="success"` / `validation-state="success"` / `banner-kind="success"` / `link-kind="success"` (other components) | Renders, but the prop validator warns on every component. Run the migration script to update. |

## ESLint rule

`dialtone/deprecated-success-color-classes` flags `d-bgc-success*`, `d-bc-success*`, and `d-fc-success*` in `class="..."` static attributes, `:class="..."` dynamic bindings (where the class name is a string literal), and class-name strings inside `.js` / `.ts` files.

Add it to your ESLint config:

```js
// eslint.config.js (flat config)
import dialtone from '@dialpad/eslint-plugin-dialtone';

export default [
  {
    plugins: { dialtone },
    rules: {
      'dialtone/deprecated-success-color-classes': 'warn',
    },
  },
];
```

Then run:

```bash
npx eslint "src/**/*.{vue,js,ts,jsx,tsx}"
```

The rule reports each occurrence with a per-role message pointing at the matching utility-class docs page and the `dialtone-migration-helper` command. It does not auto-fix; run the migration helper to apply the rename across your codebase.

## Stylelint rule

`dialtone/no-deprecated-success-tokens` flags `var(--dt-color-{foreground,surface,border,link}-success-*)` in any declaration value.

Add it to your Stylelint config:

```js
// stylelint.config.js
export default {
  plugins: ['@dialpad/stylelint-plugin-dialtone'],
  rules: {
    '@dialpad/stylelint-plugin-dialtone/no-deprecated-success-tokens': true,
  },
};
```

Then run:

```bash
npx stylelint "src/**/*.{css,less,scss,vue}"
```

The rule reports each occurrence with the exact token name to replace and the `dialtone-migration-helper` command. It does not auto-fix; run the migration helper to apply the rename.

## Migration tool

`dialtone-migration-helper` ships with a `success-to-positive` config that rewrites every `var(--dt-color-{foreground,surface,border,link}-success*)` reference and every `d-bgc-success*` / `d-bc-success*` / `d-fc-success*` class name across `.css`, `.less`, `.scss`, `.sass`, `.styl`, `.html`, `.vue`, `.md`, `.js`, `.ts`, `.jsx`, and `.tsx` files. Suffix matching is anchored, so words like `successful` and `successfully` are not touched.

**The tool migrates:**

- All `var(--dt-color-foreground-success*)`, `var(--dt-color-surface-success*)`, `var(--dt-color-border-success*)`, and `var(--dt-color-link-success*)` references.
- All `d-fc-success*`, `d-bgc-success*`, and `d-bc-success*` class names, in static `class="..."` attributes, in `:class="..."` dynamic bindings (string literals only), and inside template literals.
- Component-specific tokens missed by the original DLT-3331 sweep: `var(--dt-badge-color-background-success)` and `var(--dt-inputs-color-border-success)`.

### Usage

```bash
npx dialtone-migration-helper --cwd ./src
# Select "success-to-positive" from the config list
```

#### Apply All Changes

```bash
npx dialtone-migration-helper --cwd ./src --force
# Select "success-to-positive" from the config list
```

You can also pass the config name directly to skip the prompt:

```bash
npx dialtone-migration-helper --config success-to-positive --cwd ./src
```

### File Types Processed

- **Stylesheets:** `.css`, `.less`, `.scss`, `.sass`, `.styl`
- **Templates:** `.vue`, `.html`, `.md`
- **Scripts:** `.js`, `.ts`, `.jsx`, `.tsx`

## What requires manual review

The text-replacement script is conservative; the cases below are skipped and need a human pass.

- **Dynamic class bindings.** Computed class names like `:class="{ ['d-bgc-' + sentiment]: true }"` or `:class="['d-bgc-' + variant]"` cannot be rewritten by a static text replacement. Update the source data (e.g., a `sentiment` value of `'success'`) instead, or replace the binding with the explicit class name.
- **String concatenation.** Expressions like `'d-bgc-' + (ok ? 'positive' : 'critical')` are skipped. Make sure the data feeding the concatenation uses `positive` rather than `success`.
- **Validation-message data.** Messages passed to `<dt-input :validation-messages="...">` as `{ type: 'success', message: '...' }` are application data, not component markup, so the prop-value migration script doesn't rewrite them. Update the data source so the `type` field reads `positive`.
