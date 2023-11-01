---
title: Whitespace
description: Utilities for controlling an element's whitespace.
---

## Normal

Use `d-ws-normal` to collapse an element's text whitespaces sequences and newline characters are treated like whitespace. Lines are broken as needed to fill boxes.

<code-well-header class="d-fl-center d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-green-200 d-py8 d-px16 d-bar8 d-w216">
    <p class="lg:d-fs-200 d-fs-200 d-ws-normal">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>Blanditiisitaquequodpraesentium Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-ws-normal">...</p>
```

## No wrap

Use `d-ws-nowrap` to collapse an element's text whitespaces sequences, but line breaks are not honored. This keeps text from wrapping.

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-purple-200 d-py8 d-px16 d-bar8 d-w216">
    <p class="lg:d-fs-200 d-fs-200 d-ws-nowrap d-of-hidden">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-ws-nowrap">...</p>
```

## Pre

Use `d-ws-pre` to preserve an element's whitespaces sequences. Lines are only broken at new line characters and `<br/>` elements.

<code-well-header class="d-fl-center d-p24 d-bgc-blue-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-blue-200 d-py8 d-px16 d-bar8 d-w216">
    <p class="lg:d-fs-200 d-fs-200 d-ws-pre d-of-hidden">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>       Blanditiisitaquequodpraesentiumexplicaboincidunt?       Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-ws-pre">...</p>
```

## Pre line

Use `d-ws-pre-line` to collapse an element's whitespaces sequences. Lines are broken at new line characters, `<br/>` elements, or as needed to fill boxes.

<code-well-header class="d-fl-center d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-magenta-100 d-py8 d-px16 d-bar8 d-w216">
    <p class="lg:d-fs-200 d-fs-200 d-ws-pre-line d-of-hidden">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-ws-pre-line">...</p>
```

## Pre wrap

Use `d-ws-pre-wrap` to preserve an element's whitespaces sequences. Lines are broken at new line characters, `<br/>` elements, or as needed to fill boxes.

<code-well-header class="d-fl-center d-p24 d-bgc-gold-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-gold-100 d-py8 d-px16 d-bar8 d-w216">
    <p class="lg:d-fs-200 d-fs-200 d-ws-pre-wrap d-of-hidden">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>      Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-ws-pre-wrap">...</p>
```

## Break spaces

Use `d-ws-break-spaces` to have an element act like `pre-wrap` except that any sequence of preserved whitespace always takes up space, a line breaking opportunity exists after every preserved whitespace character, and preserved spaces take up space and do not hang which affects the element's intrinisic size (`min-content` and `max-content` sizes).

<code-well-header class="d-fl-center d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-red-100 d-py8 d-px16 d-bar8 d-w216">
    <p class="lg:d-fs-200 d-fs-200 d-ws-break-spaces d-of-hidden">Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br/>Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-ws-break-spaces">...</p>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces', 'unset']">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-ws-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">white-space: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
