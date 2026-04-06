---
title: Place Content
description: Utilities for controlling how grid items are aligned along both the block and inline axis directions.
keywords: ["css grid", "align", "justify"]
---

## Stretch

Use `d-plc-stretch{-n}` to stretch grid items along the block and inline axis.

```vue demo
<div class="d-d-grid d-g-cols2 d-plc-stretch d-g-200 d-w100p d-hmn-350 d-bar8 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
</div>
```

## Start

Use `d-plc-start{-n}` to align grid items along the start of the block and/or inline axis.

```vue demo
<div class="d-d-grid d-g-cols2 d-plc-start-center d-g-200 d-w100p d-h-350 d-bar8 d-bgc-moderate" style="--col-width: 6.4rem;">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
</div>
```

## End

Use `d-plc-end{-n}` to align grid items along the end of the block and/or inline axis.

```vue demo
<div class="d-d-grid d-g-cols2 d-plc-end-center d-g-200 d-w100p d-h-350 d-bar8 d-bgc-moderate" style="--col-width: 6.4rem;">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
</div>
```

## Center

Use `d-plc-center{-n}` to align grid items along the center of the block and/or inline axis.

```vue demo
<div class="d-d-grid d-g-cols2 d-plc-center d-g-200 d-w100p d-h-350 d-bar8 d-bgc-moderate" style="--col-width: 6.4rem;">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
</div>
```

## Space Evenly

Use `d-plc-space-evenly{-n}` to distribute grid items evenly along the block axis.

```vue demo
<div class="d-d-grid d-g-cols2 d-plc-space-evenly d-g-200 d-w100p d-h-350 d-bar8 d-bgc-moderate" style="--col-width: 6.4rem;">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
</div>
```

## Space Around

Use `d-plc-space-around{-n}` to distribute grid items so there is an equal amount of space around each row on the block axis.

```vue demo
<div class="d-d-grid d-g-cols2 d-plc-space-around d-g-200 d-w100p d-h-350 d-bar8 d-bgc-moderate" style="--col-width: 6.4rem;">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
</div>
```

## Space Between

Use `d-plc-space-between{-n}` to distribute grid items along the block axis so that there is an equal space between each row.

```vue demo
<div class="d-d-grid d-g-cols2 d-plc-space-between d-g-200 d-w100p d-h-350 d-bar8 d-bgc-moderate" style="--col-width: 6.4rem;">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
</div>
```

<script setup>
  const alignments = ['center', 'end', 'start', 'stretch', 'space-around', 'space-evenly', 'space-between'];
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <template v-for="c in alignments">
        <tr v-for="i in alignments">
          <th scope="row" class="d-code--sm d-docsite-code">
            <span v-if="i !== c">.d-plc-{{ c }}-{{ i }}</span>
            <span v-else>.d-plc-{{ c }}</span>
          </th>
          <td class="d-code--sm">
            <span v-if="i !== c">place-content: {{ c }} {{ i }} !important</span>
            <span v-else>place-content: {{ c }} !important</span>
          </td>
        </tr>
      </template>
    </tbody>
  </template>
</utility-class-table>
