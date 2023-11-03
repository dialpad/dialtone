---
title: Column Start / End / Span
description: Utilities for controlling how elements are placed across grid columns.
---

## Spanning columns

Use `d-gc{#}` to span an element across multiple columns. This can be combined with `d-gc{#}` classes to span a set of columns. Use `d-gce{#}` to set an element's ending point. A reminder that CSS grid columns start at 1 and end at the number of columns + 1. For example in a 3-column grid, the starting line would be 1 and the ending line would be 4.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-d-grid d-gg16 d-g-cols4 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-o50">1</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-o50">2</div>
    <div class="d-gc2 d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-gc2 d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">4</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-o50">5</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-o50">6</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-o50">7</div>
    <div class="d-gc3 d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">8</div>
    <div class="d-gc-full d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">9</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-gg16 d-g-cols4">
  <div>1</div>
  <div>2</div>
  <div class="d-gc2">3</div>
  <div class="d-gc2">4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div class="d-gc3">8</div>
  <div class="d-gc-full">9</div>
</div>
```

## Setting the starting and ending column

Use `d-gcs{#}` to set the starting point for an element. This can be combined with `d-gc{#}` classes to span a set of columns.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-gold-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-d-grid d-gg16 d-g-cols6 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-gold-100">
    <div class="d-fl-center d-p16 d-bgc-gold-100 d-bar4"></div>
    <div class="d-gcs2 d-gce6 d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-gold-100 d-bar4"></div>
    <div class="d-gcs1 d-gce5 d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-gold-100 d-bar4"></div>
    <div class="d-fl-center d-p16 d-bgc-gold-100 d-bar4"></div>
    <div class="d-gcs1 d-gce7 d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-gg16 d-g-cols6">
  <div class="d-gcs2 d-gce6">1</div>
  <div class="d-gcs1 d-gce5">2</div>
  <div class="d-gcs1 d-gce7">3</div>
</div>
```

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody v-for="g in ['start', 'end', 'span']">
        <tr v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            <span v-if="g === 'start'">.d-gcs{{ i }}</span>
            <span v-else-if="g === 'end'">.d-gce{{ i }}</span>
            <span v-else>.d-gc{{ i }}</span>
          </th>
          <td class="d-ff-mono d-fs-100">
            <span v-if="g === 'start'">
              grid-column-start: {{ i }}
            </span>
            <span v-else-if="g === 'end'">
              grid-column-end: {{ i }}
            </span>
            <span v-else>
              grid-column: span {{ i }} / span {{ i }}
            </span>
          </td>
        </tr>
        <tr v-if="g === 'span'">
            <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-gc-full</th>
            <td class="d-ff-mono d-fs-100">grid-column: 1 / -1 !important;</td>
        </tr>
        <tr>
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            <span v-if="g === 'start'">
              .d-gcs-auto
            </span>
            <span v-else-if="g === 'end'">
              .d-gce-auto
            </span>
            <span v-else>
              .d-gc-auto
            </span>
          </th>
          <td class="d-ff-mono d-fs-100">
            <span v-if="g === 'start'">
              grid-column-start: auto !important;
            </span>
            <span v-else-if="g === 'end'">
              grid-column-end: auto !important;
            </span>
            <span v-else>
              grid-column: auto !important;
            </span>
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            <span v-if="g === 'start'">
              .d-gcs-unset
            </span>
            <span v-else-if="g === 'end'">
              .d-gce-unset
            </span>
            <span v-else>
              .d-gc-unset
            </span>
          </th>
          <td class="d-ff-mono d-fs-100">
            <span v-if="g === 'start'">
              grid-column-start: unset !important;
            </span>
            <span v-else-if="g === 'end'">
              grid-column-end: unset !important;
            </span>
            <span v-else>
              grid-column: unset !important;
            </span>
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
