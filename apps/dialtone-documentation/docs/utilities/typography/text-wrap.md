---
title: Text Wrap
description: Utilities for controlling how text wraps within an element.
---

## Nowrap

Use `d-tw-nowrap` to prevent text from wrapping.

<code-well-header>
  <div class="d-bgc-moderate d-py-100 d-px-200 d-bar8 d-w-500 d-of-hidden">
    <p class="d-tw-nowrap">Lorem ipsum dolor sit amet consectetur gemini.</p>
  </div>
</code-well-header>

```html
<p class="d-tw-nowrap">...</p>
```

## Wrap

Use `d-tw-wrap` to allow text to wrap normally at soft wrap opportunities.

<code-well-header>
  <div class="d-bgc-moderate d-py-100 d-px-200 d-bar8 d-w-500">
    <p class="d-tw-wrap">Lorem ipsum dolor sit amet consectetur gemini.</p>
  </div>
</code-well-header>

```html
<p class="d-tw-wrap">...</p>
```

## Balance

Use `d-tw-balance` to balance the length of each line of text, distributing content more evenly across lines.

<code-well-header>
  <div class="d-bgc-moderate d-py-100 d-px-200 d-bar8 d-w-500">
    <p class="d-tw-balance">Lorem ipsum dolor sit amet consectetur gemini.</p>
  </div>
</code-well-header>

```html
<p class="d-tw-balance">...</p>
```

## Pretty

Use `d-tw-pretty` to optimize text wrapping for better typography, avoiding orphaned words on the last line.

<code-well-header>
  <div class="d-bgc-moderate d-py-100 d-px-200 d-bar8 d-w-500">
    <p class="d-tw-pretty">Lorem ipsum dolor sit amet consectetur gemini.</p>
  </div>
</code-well-header>

```html
<p class="d-tw-pretty">...</p>
```

## Unset

Use `d-tw-unset` to reset the text wrap property to its default value.

<code-well-header>
  <div class="d-bgc-moderate d-py-100 d-px-200 d-bar8 d-w-500">
    <p class="d-tw-unset">Lorem ipsum dolor sit amet consectetur gemini.</p>
  </div>
</code-well-header>

```html
<p class="d-tw-unset">...</p>
```

## Classes

<new-utility-class-table :classes="textWrap"></new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const textWrap = extractUtilityClasses(utilityClassDocs, 'd-tw-');
</script>
