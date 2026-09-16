---
title: Row Start / End / Span
description: Utilities for controlling how elements are placed across grid rows.
keywords: ["css grid", "grid row", "row span", "row end"]
---

## Spanning Rows

Use `d-gr{#}` to span an element across multiple rows. This can be combined with `d-gc{#}` classes to span a set of columns.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols3 d-g-rows3 d-p-200 d-w100p d-hmn216 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-gc2 d-gr2 d-p-200 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-bold-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-gr2 d-p-200 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-gc2 d-p-200 d-bgc-bold-opaque d-bar-300">4</dt-stack>
</div>
```

## Setting the Starting and Ending Rows

Use `d-grs{#}` to set the starting point for an element. This can be combined with `d-gc{#}` classes to span a set of columns.

Use `d-gre{#}` to set an element's ending point. A reminder that CSS grid rows start at 1 and end at the number of rows + 1. For example in a 4-row grid, the starting line would be 1 and the ending line would be 5.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols3 d-g-rows4 d-p-200 d-w100p d-hmn216 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-gc2 d-grs1 d-gre3 d-p-200 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-bold-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-grs2 d-gre5 d-p-200 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-gc2 d-gr2 d-p-200 d-bgc-bold-opaque d-bar-300">4</dt-stack>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody v-for="g in ['start', 'end', 'span']">
      <tr v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="g === 'start'">.d-grs{{ i }}</span>
          <span v-else-if="g === 'end'">.d-gre{{ i }}</span>
          <span v-else>.d-gr{{ i }}</span>
        </th>
        <td class="d-code--sm">
          <span v-if="g === 'start'">
            grid-row-start: {{ i }}
          </span>
          <span v-else-if="g === 'end'">
            grid-row-end: {{ i }}
          </span>
          <span v-else>
            grid-row: span {{ i }} / span {{ i }}
          </span>
        </td>
      </tr>
      <tr v-if="g === 'span'">
        <th scope="row" class="d-code--sm d-docsite-code">.d-gr-full</th>
        <td class="d-code--sm">grid-row: 1 / -1 !important;</td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="g === 'start'">
            .d-grs-auto
          </span>
          <span v-else-if="g === 'end'">
            .d-gre-auto
          </span>
          <span v-else>
            .d-gr-auto
          </span>
        </th>
        <td class="d-code--sm">
          <span v-if="g === 'start'">
            grid-row-start: auto !important;
          </span>
          <span v-else-if="g === 'end'">
            grid-row-end: auto !important;
          </span>
          <span v-else>
            grid-row: auto !important;
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="g === 'start'">
            .d-grs-unset
          </span>
          <span v-else-if="g === 'end'">
            .d-gre-unset
          </span>
          <span v-else>
            .d-gr-unset
          </span>
        </th>
        <td class="d-code--sm">
          <span v-if="g === 'start'">
            grid-row-start: unset !important;
          </span>
          <span v-else-if="g === 'end'">
            grid-row-end: unset !important;
          </span>
          <span v-else>
            grid-row: unset !important;
          </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
