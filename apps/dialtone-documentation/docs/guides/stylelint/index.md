---
title: Dialtone Stylelint plugin
description: Check stylesheets for deprecated Dialtone tokens and CSS patterns.
keywords:
  [
    "stylelint",
    "linting",
    "css",
    "less",
    "design tokens",
    "logical properties",
    "deprecated",
  ]
---

`@dialpad/stylelint-plugin-dialtone` checks stylesheets for deprecated Dialtone tokens and CSS patterns that work against the design system.

The plugin does not provide a recommended preset. Enable each rule explicitly so the configuration reflects what your project intends to enforce.

## Installation

Install the plugin alongside Stylelint:

```bash
npm install --save-dev stylelint @dialpad/stylelint-plugin-dialtone
```

## Configuration

Add the plugin to `stylelint.config.mjs`, then configure its rules:

```js
export default {
  plugins: ["@dialpad/stylelint-plugin-dialtone"],
  rules: {
    "@dialpad/stylelint-plugin-dialtone/no-deprecated-size-tokens": true,
    "@dialpad/stylelint-plugin-dialtone/no-deprecated-success-tokens": true,
    "@dialpad/stylelint-plugin-dialtone/no-base-color-tokens": true,
  },
};
```

Use `null` to turn off a rule inherited from a shared configuration.

## Rules

<!-- GENERATED:stylelint-rules:start -->
<!-- Do not edit this section manually. Run `pnpm nx run dialtone-documentation:generate-tooling-docs` to update it. -->

| Rule                                                                                                                                                           | What it checks                                                                     | Autofix |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------- |
| [no-base-color-tokens](https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/no-base-color-tokens.md)                 | Detects raw base-color tokens that should use a semantic color token.              | No      |
| [no-deprecated-size-tokens](https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/lib/rules/no-deprecated-size-tokens.js)        | Detects deprecated size and space tokens that should use layout or spacing tokens. | No      |
| [no-deprecated-space-tokens](https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/no-deprecated-space-tokens.md)     | Detects legacy space tokens that use the older space-to-size migration path.       | No      |
| [no-deprecated-success-tokens](https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/no-deprecated-success-tokens.md) | Detects success color tokens that have been renamed to positive.                   | No      |
| [no-mixins](https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/no-mixins.md)                                       | Detects Less mixins.                                                               | No      |
| [recommend-font-style-tokens](https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/recommend-font-style-tokens.md)   | Detects separate font declarations that should use a composed font token.          | No      |
| [use-dialtone-tokens](https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/use-dialtone-tokens.md)                   | Detects pixel and rem values that should use Dialtone tokens.                      | No      |

<!-- GENERATED:stylelint-rules:end -->

Do not enable `no-deprecated-space-tokens` and `no-deprecated-size-tokens` together. Both report `--dt-space-*`, but the older space rule points to the intermediate `--dt-size-*` tokens. Use `no-deprecated-size-tokens` for the current migration to `--dt-spacing-*` and `--dt-layout-*`.

## Logical properties

The package also includes [`stylelint-use-logical`](https://www.npmjs.com/package/stylelint-use-logical). Its `csstools/use-logical` rule reports physical properties and values that have logical equivalents.

Enable it from the same Stylelint configuration:

```js
export default {
  plugins: ["@dialpad/stylelint-plugin-dialtone"],
  rules: {
    "csstools/use-logical": true,
  },
};
```

It is an upstream rule bundled by the package, not a Dialtone-specific rule. Refer to the upstream documentation for its options and reported patterns.

## Run Stylelint

Run Stylelint against the stylesheet types used by your project:

```bash
npx stylelint "**/*.{css,less,vue}"
```

Projects that lint Less or Vue style blocks may need a compatible Stylelint custom syntax. Keep that setup in the consuming project's Stylelint configuration.
