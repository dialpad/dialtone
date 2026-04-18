---
title: Justify Items
description: Utilities for controlling how grid items align along their inline axis.
keywords: ["css grid", "inline axis"]
---

## Auto

Use `d-ji-auto` to justify grid items automatically along their inline axis. This is the default value.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols2 d-ji-auto d-w100p d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">4</dt-stack>
</div>
```

## Start

Use `d-ji-start` to justify items against the start of their inline axis. Note that this does not work on flexed objects, only grid objects.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols2 d-ji-start d-w100p d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">4</dt-stack>
</div>
```

## End

Use `d-ji-end` to justify items against the end of their inline axis. Note that this does not work on flexed objects, only grid objects.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols2 d-ji-end d-w100p d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">4</dt-stack>
</div>
```

## Center

Use `d-ji-center` to justify items to the center of their inline axis.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols2 d-ji-center d-w100p d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-wmn-100 d-bgc-moderate-opaque d-bar-300">4</dt-stack>
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
        <th scope="row" class="d-code--sm d-docsite-code">.d-ji-{{ cls }} <dt-badge v-if="deprecated" type="critical" class="d-ff-sans">Deprecated</dt-badge></th>
        <td class="d-code--sm">justify-items: {{ cls }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
