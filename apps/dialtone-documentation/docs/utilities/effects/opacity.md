---
title: Opacity
description: Utility classes for changing an element's opacity.
---

## Usage

Use `d-o{n}` to change the opacity of your element.

<code-well-header class="d-fl-col5 d-flg8 d-fw-wrap d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p16 d-bar8 d-bgc-magenta-100 d-fc-magenta-400 d-fs-200 d-fw-bold d-o100">.d-o100</div>
  <div class="d-fl-center d-p16 d-bar8 d-bgc-magenta-100 d-fc-magenta-400 d-fs-200 d-fw-bold d-o75">.d-o75</div>
  <div class="d-fl-center d-p16 d-bar8 d-bgc-magenta-100 d-fc-magenta-400 d-fs-200 d-fw-bold d-o50">.d-o50</div>
  <div class="d-fl-center d-p16 d-bar8 d-bgc-magenta-100 d-fc-magenta-400 d-fs-200 d-fw-bold d-o25">.d-o25</div>
  <div class="d-fl-center d-p16 d-bar8 d-bgc-magenta-100 d-fc-magenta-400 d-fs-200 d-fw-bold d-o0">.d-o0</div>
</code-well-header>

```html
<div class="d-o100">...</div>
<div class="d-o75">...</div>
<div class="d-o50">...</div>
<div class="d-o25">...</div>
<div class="d-o0">...</div>
```

<script setup>
  const opacities = [
    {className: 0, value: 0},
    {className: 5, value: 0.05},
    {className: 10, value: 0.1},
    {className: 20, value: 0.2},
    {className: 25, value: 0.25},
    {className: 30, value: 0.3},
    {className: 40, value: 0.4},
    {className: 50, value: 0.5},
    {className: 60, value: 0.6},
    {className: 70, value: 0.7},
    {className: 75, value: 0.75},
    {className: 80, value: 0.8},
    {className: 90, value: 0.9},
    {className: 100, value: 1},
    {className: '-unset', value: 'unset'}
  ];
</script>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <tr v-for="{className, value} in opacities">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-o{{className}}</th>
          <td class="d-ff-mono d-fs-100">opacity: {{value}} !important;</td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
