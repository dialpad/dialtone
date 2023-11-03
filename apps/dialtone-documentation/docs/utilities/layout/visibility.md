---
title: Visibility
description: Utilities for showing or hiding an element without changing the layout of a document.
---

## Usage

<code-well-header bgclass='d-bgc-purple-100'>
  <div class="d-w100p">
    <div class="d-d-inline-block d-m8 d-p16 d-bgc-purple-300 d-bar4 d-ff-mono d-fs-200 d-ta-center d-vi-visible">.d-vi-visible</div>
    <div class="d-d-inline-block d-m8 d-p16 d-bgc-purple-300 d-bar4 d-ff-mono d-fs-200 d-ta-center d-vi-visible-sr">.d-vi-visible-sr</div>
    <div class="d-d-inline-block d-m8 d-p16 d-bgc-purple-300 d-bar4 d-ff-mono d-fs-200 d-ta-center d-vi-hidden">.d-vi-hidden</div>
  </div>
</code-well-header>

```html
<div class="d-vi-visible">...</div>
<div class="d-vi-visible-sr">...</div>
<div class="d-vi-hidden">...</div>
```

## Accessibility

Bear in mind using a visibility value of `hidden` on an element will remove it from the accessibility tree. This will cause the element and all its descendant elements to no longer be announced by screen reading technology.

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr>
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-vi-visible</th>
        <td class="d-ff-mono d-fs-100">visibility: visible !important;</td>
      </tr>
      <tr>
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-vi-visible-sr</th>
        <td class="d-ff-mono d-fs-100">border: 0;
        clip: rect(1px,1px,1px,1px);
        clip-path: inset(50%);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
        word-wrap: normal;</td>
      </tr>
      <tr>
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-vi-hidden</th>
        <td class="d-ff-mono d-fs-100">visibility: hidden !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
