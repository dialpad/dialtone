# Finds deprecated base color utility classes that should be replaced with semantic color utility classes

## Rule Details

Currently, the base color utility classes are considered deprecated and shouldn't be used anymore.

Examples of **incorrect** code for this rule:

**Usage of a deprecated classes**:

```html
<template>
  <button class="d-bgc-red-300">Hover</button>
</template>
```

Examples of **correct** code for this rule:

**Usage of the correct semantic utility class replacement**:

```html
<template>
  <button class="d-bgc-critical">Hover</button>
</template>
```
