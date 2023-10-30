---
title: Divide color
description: Utilities for controlling the border color between an element's child items.
---

## Vertical dividers

Use `d-divide-y{n}` to create a divider between an element's child items.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-w100p d-d-flex d-fd-column d-divide-y d-divide-green-300">
    <div class="d-fl-center d-w100p d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-w100p d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-w100p d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-divide-y d-divide-purple-400">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Horizontal dividers

Use `d-divide-x{n}` to create a divider between an element's child items.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-w100p d-fl-col3 d-divide-x d-divide-purple-400">
    <div class="d-fl-center d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-divide-x d-divide-purple-400">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Changing opacities

Use `d-dco{n}` to change a divider opacity value.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-w100p d-d-flex d-fd-column d-divide-y d-divide-magenta-200 d-dco75">
    <div class="d-fl-center d-p16 d-fc-magenta-400 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-fc-magenta-400 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-fc-magenta-400 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-divide-y1 d-divide-magenta-200 d-dco75">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

<script setup>
  import { base as baseColors} from '@data/colors.json';
</script>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody v-for="{ color: c, stops } in baseColors">
        <tr v-for="{ stop, copy } in stops">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-divide-{{ c }}-{{ stop }}</th>
          <td>
            <div class="d-d-flex d-jc-space-between d-ai-center">
              <div class="d-fl-grow1 d-ff-mono d-fs-100">
                --dco: 100%;<br/>
                border-color: hsla(var(--{{ c }}-{{ stop }}-h) var(--{{ c }}-{{ stop }}-s) var(--{{ c }}-{{ stop }}-l) / var(--dco)) !important;
              </div>
              <div class="d-fl-shrink0 d-fl-center d-m4 d-ml16 d-h64 d-w64">
                <div
                  class="d-w100p d-h0 d-bt d-btw2"
                  :class="`d-bc-${c}-${stop}`"
                >
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
