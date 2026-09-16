---
title: Place Items
description: Utilities for controlling how grid items are aligned along their block and inline axis directions.
keywords: ["css grid", "align", "justify"]
---

## Stretch

Use `d-pli-stretch{-n}` to stretch grid items along their block and inline axis.

```vue demo
<div class="d-d-grid d-g-cols2 d-pli-stretch d-g-200 d-w100p d-hmn-350 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar-300">4</dt-stack>
</div>
```

## Start

Use `d-pli-start{-n}` to align grid items along the start of their block and/or inline axis.

```vue demo
<div class="d-d-grid d-g-cols2 d-pli-start d-g-200 d-w100p d-h-350 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">4</dt-stack>
</div>
```

## End

Use `d-pli-end{-n}` to align grid items along the end of their block and/or inline axis.

```vue demo
<div class="d-d-grid d-g-cols2 d-pli-end d-g-200 d-w100p d-h-350 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">4</dt-stack>
</div>
```

## Center

Use `d-pli-center{-n}` to align grid items along the center of their block and/or inline axis.

```vue demo
<div class="d-d-grid d-g-cols2 d-pli-center d-g-200 d-w100p d-h-350 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">4</dt-stack>
</div>
```

<script setup>
  const alignments = ['center', 'end', 'start', 'stretch'];
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <template v-for="c in alignments">
        <tr v-for="i in alignments">
          <th scope="row" class="d-code--sm d-docsite-code">
            <span v-if="i !== c">.d-pli-{{ c }}-{{ i }}</span>
            <span v-else>.d-pli-{{ c }}</span>
          </th>
          <td class="d-code--sm">
            <span v-if="i !== c">place-items: {{ c }} {{ i }} !important;</span>
            <span v-else>place-items: {{ c }} !important;</span>
          </td>
        </tr>
      </template>
    </tbody>
  </template>
</utility-class-table>
