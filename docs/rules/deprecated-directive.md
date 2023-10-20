# Finds deprecated directives that should be replaced by Dialtone Vue directives

## Rule Details

This informs developers of deprecated product side directives that should be replaced by Dialtone Vue directives. It will suggest a replacement directive.

Currently the directives with the below attribute names are considered deprecated:

- v-tooltip

This rule specifically targets components in ubervoice. If you are using Dialtone Vue outside of ubervoice you may want to disable this rule.

Examples of **incorrect** code for this rule:

**usage of a deprecated directive**:

```html
<template>
  <button v-tooltip="tooltipText">Hover</button>
</template>
```

Examples of **correct** code for this rule:

**usage of the correct replacement directive**:

```html
<template>
  <button v-dt-tooltip="tooltipText">Hover</button>
</template>
```
