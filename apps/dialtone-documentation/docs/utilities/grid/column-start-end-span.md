---
title: Column Start / End / Span
description: Utilities for controlling how elements are placed across grid columns.
keywords: ["css grid","layout","columns","rows"]
---

## Spanning Columns

Use `d-gc{#}` to span an element across multiple columns. This can be combined with `d-gc{#}` classes to span a set of columns. Use `d-gce{#}` to set an element's ending point. A reminder that CSS grid columns start at 1 and end at the number of columns + 1. For example in a 3-column grid, the starting line would be 1 and the ending line would be 4.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols4 d-w100p d-hmn216 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-gc2 d-p-200 d-bgc-bold-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-gc2 d-p-200 d-bgc-bold-opaque d-bar-300">4</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300">5</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300">6</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300">7</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-gc3 d-p-200 d-bgc-bold-opaque d-bar-300">8</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-gc-full d-p-200 d-bgc-bold-opaque d-bar-300">9</dt-stack>
</div>
```

## Setting the Starting and Ending Column

Use `d-gcs{#}` to set the starting point for an element. This can be combined with `d-gc{#}` classes to span a set of columns.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols6 d-w100p d-hmn216 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300"></dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-gcs2 d-gce6 d-p-200 d-bgc-bold-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300"></dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-gcs1 d-gce5 d-p-200 d-bgc-bold-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300"></dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300"></dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-gcs1 d-gce7 d-p-200 d-bgc-bold-opaque d-bar-300">3</dt-stack>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody v-for="g in ['start', 'end', 'span']">
      <tr v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="g === 'start'">.d-gcs{{ i }}</span>
          <span v-else-if="g === 'end'">.d-gce{{ i }}</span>
          <span v-else>.d-gc{{ i }}</span>
        </th>
        <td class="d-code--sm">
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-gc-full</th>
          <td class="d-code--sm">grid-column: 1 / -1 !important;</td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">
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
        <td class="d-code--sm">
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
        <th scope="row" class="d-code--sm d-docsite-code">
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
        <td class="d-code--sm">
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
