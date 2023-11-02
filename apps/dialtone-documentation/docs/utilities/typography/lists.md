---
title: Lists
description: Utilities for controlling list styling.
---

## Resetting a list

Use `d-ls-reset` to reset the margin, padding, and list-style-type of a list. Reseting a list applies to the parent `ol` or `ul`, any child `li` elements, and any child `ol` or `ul` elements.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <ul class="d-ls-reset d-fc-purple-400 d-fs-200">
    <li>An unordered list item</li>
    <li>
      <ol>
        <li>An ordered list item</li>
        <li>An ordered list item</li>
      </ol>
    </li>
    <li>An unordered list item</li>
  </ul>
</code-well-header>

```html
<ul class="d-ls-reset">
  <li>...</li>
  <li>
    <ol>
      <li>...</li>
      <li>...</li>
    </ol>
  </li>
  <li>...</li>
</ul>
```

## Changing the list style type

Use `d-ls-{disc|decimal}` to change an unordered list's bullet styling.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-green-100 d-w100p d-hmn102" custom>
  <ul class="d-lst-disc d-fs-200 d-fc-success">
    <li>An unordered list item</li>
    <li>
      <ul class="d-lst-circle">
        <li class="d-pl4">An unordered list item</li>
        <li class="d-pl4">An unordered list item</li>
      </ul>
    </li>
    <li>
      <ul>
        <li class="d-pl4 d-lst-content" style="--ls-content: '✅'">An unordered list item</li>
        <li class="d-pl4 d-lst-content" style="--ls-content: '❌'">An unordered list item</li>
      </ul>
    </li>
  </ul>
</code-well-header>

```html
<ul class="d-lst-disc">
  <li>...</li>
  <li>
    <ul class="d-lst-circle">
      <li>...</li>
      <li>...</li>
    </ul>
  </li>
  <li>
    <ul>
      <li class="d-lst-content" style="--ls-content: '✅'">...</li>
      <li class="d-lst-content" style="--ls-content: '❌'">...</li>
    </ul>
  </li>
</ul>
```

<script setup>
  import { lists } from '@data/type.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr>
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-ls-reset</th>
        <td class="d-ff-mono d-fs-100">
          margin: 0;<br/>
          padding: 0;<br/>
          list-style: none !important;
        </td>
      </tr>
      <tr>
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-ls-none</th>
        <td class="d-ff-mono d-fs-100">list-style: none !important;</td>
      </tr>
      <tr v-for="i in lists">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-lst-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">
          <span v-if="i === 'content'">list-style-type: var(--ls-content) !important;</span>
          <span v-else>list-style-type: {{ i }} !important;</span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
