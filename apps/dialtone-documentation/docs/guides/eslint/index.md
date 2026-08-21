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

| Rule | What it checks | Autofix |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------- |
| [custom-implementation](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/custom-implementation.md) | Custom implementations of Dialtone icons. | No |
| [deprecated-base-color-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-base-color-classes.md) | Deprecated base-color utility classes. | No |
| [deprecated-class-props](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-class-props.md) | Removed structural class props on Dialtone Vue components. | Yes |
| [deprecated-component](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-component.md) | Deprecated components that should be replaced with Dialtone Vue components. | No |
| [deprecated-dialtone-component](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-dialtone-component.md) | Deprecated Dialtone components that have newer alternatives. | No |
| [deprecated-directive](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-directive.md) | Deprecated Vue directives that have Dialtone replacements. | No |
| [deprecated-flex-gap-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/lib/rules/deprecated-flex-gap-classes.js) | Deprecated `d-flg*` flex-gap utilities. | No |
| [deprecated-grid-gap-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/lib/rules/deprecated-grid-gap-classes.js) | Deprecated `d-gg*`, `d-grg*`, and `d-gcg*` grid-gap utilities. | No |
| [deprecated-headline-sizes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-headline-sizes.md) | Headline sizes renamed from `xxl` and `xxxl` to `2xl` and `3xl`. | Yes |
| [deprecated-icons](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-icons.md) | Deprecated SVG and Vue icon imports. | No |
| [deprecated-link-styling-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-link-styling-classes.md) | Legacy link and button classes that should use `DtButton` or `DtLink` props. | No |
| [deprecated-list-styling-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-list-styling-classes.md) | Legacy list utilities that should use `DtTextList`. | No |
| [deprecated-physical-naming](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-physical-naming.md) | Physical direction names in Dialtone slots, props, prop values, and events. | No |
| [deprecated-pixel-utility-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-pixel-utility-classes.md) | Pixel-named utilities that have token-stop equivalents. | Yes |
| [deprecated-radius-utility-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-radius-utility-classes.md) | Legacy border-radius utilities that have logical, token-stop names. | Yes |
| [deprecated-stack-alignment-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-stack-alignment-classes.md) | Alignment utilities on `DtStack` that should be component props. | No |
| [deprecated-stack-flow-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-stack-flow-classes.md) | Sibling-margin utilities that should use the `DtStack` `gap` prop. | No |
| [deprecated-success-color-classes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-success-color-classes.md) | Success color utilities renamed to positive. | No |
| [deprecated-tshirt-sizes](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-tshirt-sizes.md) | T-shirt component sizes that have numeric or current typography values. | Yes |
| [focusgroup-requires-label](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/focusgroup-requires-label.md) | `v-dt-focusgroup` elements without an accessible label. | No |
| [focusgroup-requires-role](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/focusgroup-requires-role.md) | `v-dt-focusgroup` elements without a role. | No |
| [prefer-stack-over-flex](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/prefer-stack-over-flex.md) | Flex utility layouts that should use `DtStack`. | No |
| [recommend-typography-style](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/recommend-typography-style.md) | Separate typography utilities that should use a composed typography utility. | No |

Open a rule's link for its accepted patterns, reported failures, and migration examples.

## Apply available fixes

Five rules provide automatic fixes: `deprecated-class-props`, `deprecated-headline-sizes`, `deprecated-pixel-utility-classes`, `deprecated-radius-utility-classes`, and `deprecated-tshirt-sizes`.

Run ESLint with `--fix` to apply them:

```bash
npx eslint . --fix
```

Review the resulting diff. The remaining findings need a decision about the intended component, token, or layout.
