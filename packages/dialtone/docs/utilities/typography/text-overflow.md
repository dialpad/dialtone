---
title: Text overflow
description: Utilities for controlling an element's text overflow.
---

## Truncate

Use `d-truncate` to truncate an element's text.

<code-well-header class="d-fl-center d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-green-100 d-py8 d-px16 d-bar8 d-w332">
    <p class="d-fs-200 d-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-truncate">...</p>
```

## Ellipsis

Use `d-to-ellipsis` to truncate an element's overflowing text with an ellipsis (`...`) if needed.

<code-well-header class="d-fl-center d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-magenta-100 d-py8 d-px16 d-bar8 d-w332">
    <p class="d-fs-200 d-of-hidden d-to-ellipsis">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-of-hidden d-to-ellipsis">...</p>
```

## Clip

Use `d-to-clip` to clip an element's overflowing text if needed.

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-purple-200 d-py8 d-px16 d-bar8 d-w332">
    <p class="d-fs-200 d-of-hidden d-to-clip">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit dolor.</p>
  </div>
</code-well-header>

```html
<p class="d-of-hidden d-to-clip">...</p>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr>
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-truncate</th>
        <td class="d-ff-mono d-fs-100">
          overflow: hidden !important;<br/>
          text-overflow: ellipsis !important;<br/>
          white-space: nowrap !important;
        </td>
      </tr>
      <tr v-for="i in ['ellipsis', 'clip', 'unset']">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-to-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">text-overflow: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
