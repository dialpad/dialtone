
## Dialtone CSS Coding guidelines

### Naming conventions

All Dialtone CSS classes available to users are prefixed with `d-`.

```less
.d-input {}
.d-stack8 {}
```

### Tokens

Tokens are the values that make up the design system. Colors, sizing, spacing and typography are valid tokens, and are output as variables in the Dialtone CSS. Tokens are defined in the dialtone-tokens package and are always prefixed with dt. Example: `var(--dt-color-black-100)`. See [Dialtone Tokens](../../dialtone-tokens/README.md) for more information.

#### Utility classes

Utility classes are named in the following format `d-[PROPERTY_ACRONYM]-[VALUE]`.

```less
.d-ai-center {} // align-items: center
.d-c-pointer {} // cursor: pointer
```

#### Component classes

Component class names use the [Block Element Modifier (BEM)](http://getbem.com/naming/) naming standard.

```less
.d-banner {} // Block
.d-banner__dialog {} // Element
.d-banner--success {} // Modifier
```

### Selector specificity

Keeping selector specificity low and predictable is critical for a design system. Consumers need to be able to override component styles without resorting to specificity escalation or `!important`.

#### Why BEM keeps specificity flat

Every BEM selector — block, element, or modifier — is a single class, which means a specificity of `(0,1,0)`. This is the target for all component selectors. When every rule has the same specificity, the cascade is determined by source order alone, which is predictable and easy to reason about.

#### Use CSS custom properties for modifier overrides

When a modifier needs to change a property, prefer overriding a CSS custom property rather than targeting a child with a higher-specificity selector:

```less
// Preferred — both selectors are (0,1,0)
.d-banner {
  --banner-color-background: var(--dt-color-surface-primary);
  background-color: var(--banner-color-background);
}

.d-banner--success {
  --banner-color-background: var(--dt-color-surface-success);
}

// Avoid — inflates to (0,2,0)
.d-banner--success .d-banner__icon {
  color: green;
}
```

#### Element-type descendants: wrap in `:where()`

Some components must style bare HTML elements (e.g., `th`, `td`, `a`, `button`, `option` inside a table, toast, or select). These add specificity that makes overrides harder. Wrap them in `:where()` to zero out their specificity contribution:

```less
// Correct — specificity stays at (0,1,0)
.d-table {
  :where(th, td) {
    padding: var(--dt-size-500);
  }
}

// Avoid — specificity is (0,1,1), harder to override
.d-table {
  th, td {
    padding: var(--dt-size-500);
  }
}
```

The same applies to structural pseudo-classes on element selectors:

```less
// Correct — (0,1,0)
.d-table :where(tbody tr:last-of-type) :where(td, th) {
  border-block-end-width: 0;
}

// Avoid — (0,2,3)
.d-table tbody tr:last-of-type td, th {
  border-block-end-width: 0;
}
```

Do **not** wrap the component class itself, BEM modifiers, or state pseudo-classes (`:hover`, `:disabled`, `:focus-visible`) in `:where()` — their specificity is intentional.

#### Quick reference

| Selector | Specificity | Verdict |
|----------|-------------|---------|
| `.d-banner` | (0,1,0) | Ideal |
| `.d-banner__dialog` | (0,1,0) | Ideal |
| `.d-banner--success` | (0,1,0) | Ideal |
| `.d-table :where(th)` | (0,1,0) | Correct — element wrapped |
| `.d-table th` | (0,1,1) | Avoid — bare element inflates specificity |
| `.d-tablist--inverted .d-tab` | (0,2,0) | Acceptable — parent modifier affecting child |
| `.d-notice.d-notice--truncate .d-notice__content .d-notice__title` | (0,4,0) | Avoid — refactor to use CSS custom properties |

### Immutable utility classes

All of our utility classes are set to `!important`. This is because they are designed to be immutable, and `!important` is the best way we have of achieving immutability in CSS. Utility classes should only be applied at the application level and not within Dialtone Vue components.

### CSS vars

We use CSS vars, also known as [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) in our CSS component classes for better reusability. We should use tokens to apply values to properties within our CSS classes unless a relevant token does not exist. For example, we should use `var(--dt-color-black-100)` instead of `#000000` or `var(--dt-size-400)` instead of `0.8rem`.

Here we set the `--avatar--size` CSS var to the `--dt-size-450` token, and set both the width and the height to reference this variable.

```less
.d-avatar {
    --avatar--size: var(--dt-size-450);
    width: var(--avatar--size);
    height: var(--avatar--size);
}
```

Now in variation `d-avatar--sm`, we just set `--avatar--size`. Width and height will be set for you.

```less
.d-avatar--sm {
  --avatar--size: var(--dt-size-400);
}
```

## Linting

Our code is linted by:

- [stylelint](https://stylelint.io)
- [eslint](https://eslint.org)
- [markdownlint](https://github.com/DavidAnson/markdownlint)

Configuration can be found in:

- [stylelint.config.cjs](../../../stylelint.config.cjs), [.stylelintignore](../../../.stylelintignore)
- [eslint.config.js](../../../eslint.config.js)
- [.markdownlint.json](../../../.markdownlint.json), [.markdownlintignore](../../../.markdownlintignore)

Your code will be linted automatically on commit.

- **Lint manually:** `nx run dialtone-css:lint`

## Folder structure

Here are some important directories to know within the Dialtone repository

- `lib/build`: All source code and assets for the Dialtone library.
- `lib/dist`: The compiled bundle will be output here upon `nx run dialtone-css:build`.
- `lib/build/fonts`: Fonts we wish to bundle with Dialtone (woff2 format).
- `lib/build/less`: LESS files defining our styles. they are processed and transpiled to CSS on build.

## Testing

Any changes you make to Dialtone CSS that is used in Dialtone Vue components will be tested in our percy visual tests when you create a pull request. Other than that please manually test your changes on the Dialtone documentation site as well.

### Building

[Gulp](https://gulpjs.com/) is the task runner we use to build Dialtone CSS. It's configuration can be found in `.gulpfile.js`. The following tasks are handled within the gulp build:

- Compilation, minification and output of LESS to CSS.
- Bundling and output of fonts.
- Caching for faster local build performance.
