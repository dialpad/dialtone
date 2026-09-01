---
title: Justify Self
description: Utilities for controlling how a grid item is aligned along its inline axis.
keywords: ["css grid", "inline axis", "justify start", "justify end", "justify left", "justify right", "inline start", "inline end"]
---

## Auto

Use `d-js-auto` to justify an item automatically along its inline axis. This is the default value.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols3 d-w100p d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-js-auto d-p-200 d-wmn-100 d-bgc-bold-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
</div>
```

## Start

Use `d-js-start` to justify an item to the start of its inline axis.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols3 d-w100p d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-js-start d-p-200 d-wmn-100 d-bgc-bold-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
</div>
```

## End

Use `d-js-end` to justify an item to the end of its inline axis.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols3 d-w100p d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-js-end d-p-200 d-wmn-100 d-bgc-bold-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
</div>
```

## Center

Use `d-js-center` to justify an item to the center of its inline axis.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols3 d-w100p d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-js-center d-p-200 d-wmn-100 d-bgc-bold-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: cls, deprecated } in [
        { class: 'center' },
        { class: 'end' },
        { class: 'start' },
        { class: 'left', deprecated: true },
        { class: 'right', deprecated: true },
        { class: 'baseline' },
        { class: 'first-baseline' },
        { class: 'last-baseline' },
        { class: 'stretch' },
        { class: 'safe' },
        { class: 'unsafe' },
        { class: 'normal' },
        { class: 'legacy' },
        { class: 'auto' },
        { class: 'unset' },
      ]">
        <th scope="row" class="d-code--sm d-docsite-code">.d-js-{{ cls }} <dt-badge v-if="deprecated" type="critical" class="d-ff-sans">Deprecated</dt-badge></th>
        <td class="d-code--sm">justify-self: {{ cls }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
