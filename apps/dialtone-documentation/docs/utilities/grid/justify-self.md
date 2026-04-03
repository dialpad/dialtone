---
title: Justify Self
description: Utilities for controlling how a grid item is aligned along its inline axis.
keywords: ["css grid", "inline axis"]
---

## Auto

Use `d-js-auto` to justify an item automatically along its inline axis. This is the default value.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols3 d-w100p d-bar8 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-js-auto d-p-200 d-wmn-100 d-bgc-bold-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar4">3</dt-stack>
</div>
```

## Start

Use `d-js-start` to justify an item to the start of its inline axis.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols3 d-w100p d-bar8 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-js-start d-p-200 d-wmn-100 d-bgc-bold-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar4">3</dt-stack>
</div>
```

## End

Use `d-js-end` to justify an item to the end of its inline axis.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols3 d-w100p d-bar8 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-js-end d-p-200 d-wmn-100 d-bgc-bold-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar4">3</dt-stack>
</div>
```

## Center

Use `d-js-center` to justify an item to the center of its inline axis.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols3 d-w100p d-bar8 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-js-center d-p-200 d-wmn-100 d-bgc-bold-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar4">3</dt-stack>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['center', 'end', 'start', 'left', 'right', 'baseline', 'first-baseline', 'last-baseline', 'stretch', 'safe', 'unsafe', 'normal', 'legacy', 'auto', 'unset']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-js-{{ i }}</th>
        <td class="d-code--sm">justify-self: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
