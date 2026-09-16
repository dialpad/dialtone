---
title: Dialtone ESLint plugin
description: Find deprecated Dialtone APIs, migration work, and accessibility issues in Vue templates.
keywords:
  ["eslint", "linting", "vue", "accessibility", "migration", "deprecated"]
---

`@dialpad/eslint-plugin-dialtone` checks Vue templates for deprecated Dialtone APIs, migration work, and a small set of accessibility requirements.

The plugin does not provide a recommended preset. Enable the rules that match the checks you want your project to enforce.

## Installation

Install the plugin and its parser alongside ESLint:

```bash
npm install --save-dev eslint vue-eslint-parser @dialpad/eslint-plugin-dialtone
```

If your project already uses ESLint and `vue-eslint-parser`, install only the Dialtone plugin.

## Flat config

Add the plugin to `eslint.config.mjs`, then configure its rules by name:

```js
import dialtone from "@dialpad/eslint-plugin-dialtone";
import vueParser from "vue-eslint-parser";

export default [
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
    },
    plugins: {
      "@dialpad/dialtone": dialtone,
    },
    rules: {
      "@dialpad/dialtone/deprecated-dialtone-component": "warn",
      "@dialpad/dialtone/focusgroup-requires-label": "error",
      "@dialpad/dialtone/focusgroup-requires-role": "error",
    },
  },
];
```

If another config already assigns `vue-eslint-parser` to Vue files, keep that parser configuration and add the `plugins` and `rules` entries.

## Legacy config

For an eslintrc configuration:

```json
{
  "parser": "vue-eslint-parser",
  "plugins": ["@dialpad/dialtone"],
  "rules": {
    "@dialpad/dialtone/deprecated-dialtone-component": "warn",
    "@dialpad/dialtone/focusgroup-requires-label": "error",
    "@dialpad/dialtone/focusgroup-requires-role": "error"
  }
}
```

## Rules

<!-- GENERATED:eslint-rules:start -->
<!-- Do not edit this section manually. Run `pnpm nx run dialtone-documentation:generate-tooling-docs` to update it. -->

| Rule                                                                                                                                                                    | What it checks                                                                                 | Autofix |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------- |
| [custom-implementation](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/custom-implementation.md)                           | Detects custom implementations of Dialtone icons.                                              | No      |
| [deprecated-base-color-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-base-color-classes.md)           | Detects usage of deprecated base-color utility classes.                                        | No      |
| [deprecated-class-props](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-class-props.md)                         | Detects usage of removed structural class props on Dialtone Vue components.                    | Yes     |
| [deprecated-component](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-component.md)                             | Detects usage of deprecated components that should be replaced with Dialtone Vue components.   | No      |
| [deprecated-dialtone-component](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-dialtone-component.md)           | Detects usage of deprecated Dialtone components that have newer alternatives.                  | No      |
| [deprecated-directive](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-directive.md)                             | Detects usage of deprecated Vue directives that have Dialtone replacements.                    | No      |
| [deprecated-flex-gap-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/lib/rules/deprecated-flex-gap-classes.js)                | Detects usage of deprecated `d-flg*` flex-gap utilities.                                       | No      |
| [deprecated-grid-gap-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/lib/rules/deprecated-grid-gap-classes.js)                | Detects usage of deprecated `d-gg*`, `d-grg*`, and `d-gcg*` grid-gap utilities.                | No      |
| [deprecated-headline-sizes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-headline-sizes.md)                   | Detects deprecated `xxl` and `xxxl` headline sizes.                                            | Yes     |
| [deprecated-icons](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-icons.md)                                     | Detects deprecated SVG and Vue icon imports.                                                   | No      |
| [deprecated-link-styling-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-link-styling-classes.md)       | Detects legacy link and button classes that should use `DtButton` or `DtLink` props.           | No      |
| [deprecated-list-styling-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-list-styling-classes.md)       | Detects legacy list utilities that should use `DtTextList`.                                    | No      |
| [deprecated-physical-naming](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-physical-naming.md)                 | Detects deprecated physical direction names in Dialtone slots, props, prop values, and events. | No      |
| [deprecated-pixel-utility-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-pixel-utility-classes.md)     | Detects deprecated pixel-named utilities that have token-stop equivalents.                     | Yes     |
| [deprecated-radius-utility-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-radius-utility-classes.md)   | Detects legacy border-radius utilities that have logical, token-stop names.                    | Yes     |
| [deprecated-stack-alignment-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-stack-alignment-classes.md) | Detects alignment utilities on `DtStack` that should be component props.                       | No      |
| [deprecated-stack-flow-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-stack-flow-classes.md)           | Detects sibling-margin utilities that should use the `DtStack` `gap` prop.                     | No      |
| [deprecated-success-color-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-success-color-classes.md)     | Detects deprecated success color utilities that have positive replacements.                    | No      |
| [deprecated-tshirt-sizes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-tshirt-sizes.md)                       | Detects deprecated T-shirt component sizes that have numeric or current typography values.     | Yes     |
| [focusgroup-requires-label](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/focusgroup-requires-label.md)                   | Detects `v-dt-focusgroup` elements without an accessible label.                                | No      |
| [focusgroup-requires-role](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/focusgroup-requires-role.md)                     | Detects `v-dt-focusgroup` elements without a role.                                             | No      |
| [prefer-stack-over-flex](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/prefer-stack-over-flex.md)                         | Detects flex utility layouts that should use `DtStack`.                                        | No      |
| [recommend-typography-style](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/recommend-typography-style.md)                 | Detects separate typography utilities that should use a composed typography utility.           | No      |

<!-- GENERATED:eslint-rules:end -->

Open a rule's link for its accepted patterns, reported failures, and migration examples.

## Apply available fixes

Rules marked **Yes** in the Autofix column provide automatic fixes.

Run ESLint with `--fix` to apply them:

```bash
npx eslint . --fix
```

Review the resulting diff. The remaining findings need a decision about the intended component, token, or layout.
