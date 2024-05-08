
## Dialtone CSS Coding guidelines

### Naming conventions

All Dialtone CSS classes available to users are prefixed with `d-`.

```less
.d-input {}
.d-stack8 {}
```

### Tokens

Tokens are the values that make up the design system. Colors, sizing, spacing and typography are valid tokens, and are output as variables in the Dialtone CSS. Tokens are defined in the dialtone-tokens package and are always prefixed with dt. Example: `var(--dt-color-black-100)`. See [Dialtone Tokens](../packages/dialtone-tokens/README.md) for more information.

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

### Immutable utility classes

All of our utility classes are set to `!important`. This is because they are designed to be immutable, and `!important` is the best way we have of achieving immutability in CSS. Utility classes should only be applied at the application level and not within Dialtone Vue components.

### CSS vars

We use CSS vars, also known as [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) in our CSS component classes for better reusability. We should use tokens to apply values to properties within our CSS classes unless a relevant token does not exist. For example, we should use `var(--dt-color-black-100)` instead of `#000000` or `var(--dt-space-400)` instead of `0.8rem`.

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

- [stylelint](https://stylelint.io).
- [lesshint](https://github.com/lesshint/lesshint).
- [eslint](https://eslint.org).
- [markdownlint](https://github.com/DavidAnson/markdownlint).

Configuration can be found in:

- [stylelint.config.cjs](../stylelint.config.cjs), [.stylelintignore](../.stylelintignore)
- [.lesshintrc.cjs](../.lesshintrc.cjs)
- [.eslintrc.cjs](../.eslintrc.cjs), [.eslintignore](../.eslintignore)
- [.markdownlintrc](apps/dialtone-documentation/.markdownlintrc), [.markdownlintignore](apps/dialtone-documentation/.markdownlintignore)

Your code will be linted (and fixed if possible) automatically on commit.

- **Lint manually:** `nx lint dialtone`
- **With autofix:** `nx lint:fix dialtone`

Note that we use lesshint only for the utilities folder and stylelint for everything else. Due to some unsupported syntax limitations we cannot use stylelint on our utilities folder.

## Folder structure

Here are some important directories to know within the Dialtone repository

- `lib/build`: All source code and assets for the Dialtone library.
- `lib/dist`: The compiled bundle will be output here upon `nx build dialtone-css`.
- `lib/build/fonts`: Fonts we wish to bundle with Dialtone (woff2 format).
- `lib/build/less`: LESS files defining our styles. they are processed and transpiled to CSS on build.

## Testing

Any changes you make to Dialtone CSS that is used in Dialtone Vue components will be tested in our percy visual tests when you create a pull request. Other than that please manually test your changes on the Dialtone documentation site as well.

### Building

[Gulp](https://gulpjs.com/) is the task runner we use to build Dialtone CSS. It's configuration can be found in `.gulpfile.js`. The following tasks are handled within the gulp build:

- Compilation, minification and output of LESS to CSS.
- Bundling and output of fonts.
- Caching for faster local build performance.
