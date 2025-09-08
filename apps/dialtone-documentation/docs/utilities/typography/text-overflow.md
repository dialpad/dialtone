---
title: Text Overflow
description: Utilities for controlling an element's text overflow.
---

## Truncate

Use `d-truncate` to truncate an element's text to a single line with an ellipsis (`...`) if needed. Note that while CSS Utilities are fundamentally a single CSS property, this utility combines three: `overflow`, `text-overflow`, and `white-space` to achieve the effect.

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 d-w332">
    <p class="d-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-truncate">...</p>
```

## Ellipsis

Use `d-to-ellipsis`, combined with `d-of-hidden` to truncate an element's overflowing text with an ellipsis (`...`) if needed.

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 d-w332">
    <p class="d-of-hidden d-to-ellipsis">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-of-hidden d-to-ellipsis">...</p>
```

## Clip

Use `d-to-clip` to clip an element's overflowing text if needed.

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 d-w332">
    <p class="d-of-hidden d-to-clip">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-of-hidden d-to-clip">...</p>
```

<!-- To add: Line Clamp -->

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-truncate</th>
        <td class="d-code--sm">
          overflow: hidden !important;<br/>
          text-overflow: ellipsis !important;<br/>
          white-space: nowrap !important;
        </td>
      </tr>
      <tr v-for="i in ['ellipsis', 'clip', 'unset']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-to-{{ i }}</th>
        <td class="d-code--sm">text-overflow: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
