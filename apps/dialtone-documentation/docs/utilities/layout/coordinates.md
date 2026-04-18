---
title: Coordinates
description: Utility classes to assign an element’s top, right, bottom, or left position.
keywords: ["top","right","bottom","left","inset","position offset","inset inline start","inset inline end","inset block start","inset block end"]
---

## Positive Coordinates

### Examples

Use `d-t-{stop}`, `d-r-{stop}`, `d-b-{stop}`, `d-l-{stop}`, `d-x-{stop}`, `d-y-{stop}`, `d-all-{stop}` to absolutely position elements. Logical property aliases are also available: `d-ibs-{stop}` (inset-block-start), `d-iie-{stop}` (inset-inline-end), `d-ibe-{stop}` (inset-block-end), `d-iis-{stop}` (inset-inline-start).

```vue demo
<!-- @wrapper -->
<div class="d-w100p d-hmn216 d-d-grid d-g-cols4 d-g-200 d-pi-center">
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-x-0 d-ibs-0 d-bgc-moderate-opaque d-bar-300 d-h50p">1</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-y-0 d-iie-0 d-bgc-moderate-opaque d-bar-300 d-w50p">2</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-x-0 d-ibe-0 d-bgc-moderate-opaque d-bar-300 d-h50p">3</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-y-0 d-iis-0 d-bgc-moderate-opaque d-bar-300 d-w50p">4</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-all-0 d-bgc-moderate-opaque d-bar-300">5</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iis-0 d-ibs-0 d-bgc-moderate-opaque d-bar-300 d-size-50p">6</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iie-0 d-ibs-0 d-bgc-moderate-opaque d-bar-300 d-size-50p">7</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iie-0 d-ibe-0 d-bgc-moderate-opaque d-bar-300 d-size-50p">8</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iis-0 d-ibe-0 d-bgc-moderate-opaque d-bar-300 d-size-50p">9</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-all-100 d-bgc-moderate-opaque d-bar-300">10</dt-stack></div>
</div>
```

### Classes

<div class="d-bar-400 d-ba d-bc-subtle">
  <div class="d-w100p d-of-auto">
    <table class="d-table dialtone-doc-table">
      <thead>
        <tr>
          <th scope="col">Value</th>
          <th v-for="{ direction: dir, directionPhysical: dirPhysical } in coordinateDirections" scope="col"  v-dt-tooltip="{ message: dirPhysical, delay: false }" class="d-c-default">
            {{ dir }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{coordinate, suffix, combo, value } in coordinates">
          <th scope="row">
            <dt-text kind="code" size="xs" strength="bold">
              <dt-text v-if="value.endsWith('rem')">
                {{ value }}
                <br>
                <dt-text strength="normal">{{ parseFloat(value) * 10 }}px</dt-text>
              </dt-text>
              <dt-text v-else>{{ value }}</dt-text>
            </dt-text>
          </th>
          <template v-for="{direction: dir, prefix: pre, percent} in coordinateDirections">
            <td v-if="percent === 'no' && combo === 'no'" class="d-fc-muted d-fs-100 d-ta-center">
              N/A
            </td>
            <td v-else class="d-code--sm d-docsite-code">
              <dt-text v-if="/^\d+$/.test(coordinate)">d-{{ pre }}-{{ coordinate }}</dt-text>
              <dt-text v-else>d-{{ pre }}{{ coordinate }}</dt-text>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Negative Coordinates

### Examples

Use `d-t-{stop}`, `d-r-{stop}`, `d-b-{stop}`, `d-l-{stop}`, `d-x-{stop}`, `d-y-{stop}`, `d-all-{stop}` to absolutely position elements. Logical property aliases are also available: `d-ibs-{stop}` (inset-block-start), `d-iie-{stop}` (inset-inline-end), `d-ibe-{stop}` (inset-block-end), `d-iis-{stop}` (inset-inline-start).

```vue demo
<!-- @wrapper -->
<div class="d-w100p d-hmn216 d-d-grid d-g-cols4 d-g-200 d-pi-center">
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-x-n25 d-ibs-n25 d-bgc-moderate-opaque d-bar-400 d-h50p">1</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-y-n25 d-iie-n25 d-bgc-moderate-opaque d-bar-400 d-w50p">2</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-x-n25 d-ibe-n25 d-bgc-moderate-opaque d-bar-400 d-h50p">3</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-y-n25 d-iis-n25 d-bgc-moderate-opaque d-bar-400 d-w50p">4</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-all-n25 d-bgc-moderate-opaque d-bar-400">5</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iis-n50 d-ibs-n50 d-bgc-moderate-opaque d-bar-400 d-size-50p">6</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iie-n100 d-ibs-n100 d-bgc-moderate-opaque d-bar-400 d-size-50p">7</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iie-n100 d-ibe-n100 d-bgc-moderate-opaque d-bar-400 d-size-50p">8</dt-stack></div>
  <div class="d-ps-relative d-h-200 d-bar-400 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iis-n50 d-ibe-n50 d-bgc-moderate-opaque d-bar-400 d-size-50p">9</dt-stack></div>
</div>
```

<script setup>
  import { coordinateDirections, coordinates } from '@data/spacing.json';
</script>

### Classes

<div class="d-bar-400 d-ba d-bc-subtle">
  <div class="d-w100p d-of-auto">
    <table class="d-table dialtone-doc-table">
      <thead>
        <tr>
          <th scope="col">Value</th>
          <th v-for="{ direction: dir, directionPhysical: dirPhysical } in coordinateDirections" scope="col"  v-dt-tooltip="{ message: dirPhysical, delay: false }" class="d-c-default">
            {{ dir }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{coordinate, suffix, combo, negative, value } in coordinates">
          <th v-if="negative === 'yes'" scope="row">
            <dt-text kind="code" size="xs" strength="bold">
              <dt-text v-if="value.endsWith('rem')">
                {{ value }}
                <br>
                <dt-text strength="normal">{{ parseFloat(value) * 10 }}px</dt-text>
              </dt-text>
              <dt-text v-else>{{ value }}</dt-text>
            </dt-text>
          </th>
          <template v-if="negative === 'yes'" v-for="{direction: dir, prefix: pre, percent} in coordinateDirections">
            <td v-if="percent === 'no' && combo === 'no'" class="d-fc-muted d-fs-100 d-ta-center">
              N/A
            </td>
            <td v-else class="d-code--sm d-docsite-code">
              <dt-text v-if="/^\d+$/.test(coordinate)">d-{{ pre }}-n{{ coordinate }}</dt-text>
              <dt-text v-else>d-{{ pre }}n{{ coordinate }}</dt-text>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</div>
