---
title: Lists
description: Utilities for controlling list styling.
---

## Resetting a list

Use `d-ls-reset` to reset the margin, padding, and list-style-type of a list. Reseting a list applies to the parent `ol` or `ul`, any child `li` elements, and any child `ol` or `ul` elements.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <ul class="d-ls-reset">
    <li>An unordered list item</li>
    <li>
      An unordered list item
      <ol>
        <li>A nested ordered list item</li>
        <li>A nested ordered list item</li>
      </ol>
    </li>
    <li>An unordered list item</li>
    <li>
      An unordered list item
      <ul>
        <li>A nested unordered list item</li>
        <li>A nested unordered list item</li>
      </ul>
    </li>
  </ul>
</code-well-header>

```html
<ul class="d-ls-reset">
  <li>An unordered list item</li>
  <li>
    An unordered list item
    <ol>
      <li>A nested ordered list item</li>
      <li>A nested ordered list item</li>
    </ol>
  </li>
  <li>An unordered list item</li>
  <li>
    An unordered list item
    <ul>
      <li>A nested unordered list item</li>
      <li>A nested unordered list item</li>
    </ul>
  </li>
</ul>
```

## Changing the list style type

Use `d-lst-{none|disc|circle|decimal|content|none}` to change a list item's bullet styling.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <ul class="d-pl16">
    <li class="d-lst-none"><strong>none</strong> list item</li>
    <li class="d-lst-disc"><strong>disc</strong> list item</li>
    <li class="d-lst-circle"><strong>circle</strong> list item</li>
    <li class="d-lst-decimal"><strong>decimal</strong> list item</li>
    <li class="d-lst-content" style="--ls-content: '🫠'"><strong>content</strong> list item</li>
    <li class="d-lst-disc">
      An unordered list item
      <ul class="d-pl16">
        <li class="d-lst-circle">A nested unordered list item</li>
        <li class="d-lst-circle">A nested unordered list item</li>
      </ul>
    </li>
    <li class="d-lst-disc">
      An unordered list item
      <ul class="d-pl16">
        <li class="d-pl8 d-lst-content" style="--ls-content: '✅'">A nested unordered list item</li>
        <li class="d-pl8 d-lst-content" style="--ls-content: '❌'">A nested unordered list item</li>
      </ul>
    </li>
  </ul>
</code-well-header>

```html
<ul class="d-pl16">
  <li class="d-lst-none"><strong>none</strong> list item</li>
  <li class="d-lst-disc"><strong>disc</strong> list item</li>
  <li class="d-lst-circle"><strong>circle</strong> list item</li>
  <li class="d-lst-decimal"><strong>decimal</strong> list item</li>
  <li class="d-lst-content" style="--ls-content: '🫠'"><strong>content</strong> list item</li>
  <li class="d-lst-disc">
    An unordered list item
    <ul class="d-pl16">
      <li class="d-lst-circle">A nested unordered list item</li>
      <li class="d-lst-circle">A nested unordered list item</li>
    </ul>
  </li>
  <li class="d-lst-disc">
    An unordered list item
    <ul class="d-pl16">
      <li class="d-pl8 d-lst-content" style="--ls-content: '✅'">A nested unordered list item</li>
      <li class="d-pl8 d-lst-content" style="--ls-content: '❌'">A nested unordered list item</li>
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
        <th scope="row" class="d-code--sm d-fc-purple-400">.d-ls-reset</th>
        <td class="d-code--sm">
          margin: 0;<br/>
          padding: 0;<br/>
          list-style: none !important;
        </td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-fc-purple-400">.d-ls-none</th>
        <td class="d-code--sm">list-style: none !important;</td>
      </tr>
      <tr v-for="i in lists">
        <th scope="row" class="d-code--sm d-fc-purple-400">.d-lst-{{ i }}</th>
        <td class="d-code--sm">
          <span v-if="i === 'content'">list-style-type: var(--ls-content) !important;</span>
          <span v-else>list-style-type: {{ i }} !important;</span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
