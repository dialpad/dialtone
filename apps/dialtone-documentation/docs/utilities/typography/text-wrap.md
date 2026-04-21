---
title: Text Wrap
description: Utilities for controlling how text wraps within an element.
---

## Nowrap

Use `d-tw-nowrap` to prevent text from wrapping.

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-500 d-of-hidden">
  <p class="d-tw-nowrap">Lorem ipsum dolor sit amet consectetur gemini.</p>
</div>
```

## Wrap

Use `d-tw-wrap` to allow text to wrap normally at soft wrap opportunities.

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-500">
  <p class="d-tw-wrap">Lorem ipsum dolor sit amet consectetur gemini.</p>
</div>
```

## Balance

Use `d-tw-balance` to balance the length of each line of text, distributing content more evenly across lines.

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-500">
  <p class="d-tw-balance">Lorem ipsum dolor sit amet consectetur gemini.</p>
</div>
```

## Pretty

Use `d-tw-pretty` to optimize text wrapping for better typography, avoiding orphaned words on the last line.

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-500">
  <p class="d-tw-pretty">Lorem ipsum dolor sit amet consectetur gemini.</p>
</div>
```

## Unset

Use `d-tw-unset` to reset the text wrap property to its default value.

```vue demo
<div class="d-bgc-moderate d-py-100 d-px-200 d-bar-400 d-w-500">
  <p class="d-tw-unset">Lorem ipsum dolor sit amet consectetur gemini.</p>
</div>
```

## Classes

<new-utility-class-table :classes="textWrap"></new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const textWrap = extractUtilityClasses(utilityClassDocs, 'd-tw-');
</script>
