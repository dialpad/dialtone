---
title: Position
description: Utility classes to change an element’s position type.
---

## Examples

<code-well-header class="d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216 d-of-y-auto" custom>
  <div class="d-ps-relative">
    Relative Parent
    <div class="d-ps-static d-bgc-purple-100 d-mt24 d-p24 d-h464 d-bar8">
      Static Parent
      <div class="d-ps-absolute d-t0 d-r12 d-fl-center d-h128 d-w128 d-p8 d-bar8 d-bgc-purple-300 d-ff-mono d-fs-100">.d-ps-absolute<br>.d-t0<br>.d-r12</div>
      <div class="d-ps-absolute d-b0 d-rn12 d-fl-center d-h128 d-w128 d-p8 d-bar8 d-bgc-purple-300 d-ff-mono d-fs-100">.d-ps-absolute<br>.d-b0<br>.d-rn12</div>
      <div class="d-ps-sticky d-t0 d-fl-center d-h128 d-w128 d-p8 d-bar8 d-bgc-purple-300 d-ff-mono d-fs-100">.d-ps-sticky<br>.d-t0</div>
      <div class="d-ps-relative d-t32 d-l64 d-fl-center d-h128 d-w128 d-p8 d-bar8 d-bgc-purple-300 d-ff-mono d-fs-100">.d-ps-relative<br>.d-t32<br>.d-l64</div>
      <div class="d-ps-fixed d-t50p d-l50p d-fl-center d-h128 d-w128 d-p8 d-bar8 d-bgc-purple-300 d-ff-mono d-fs-100">.d-ps-fixed<br>.d-t50p<br>.d-l50p</div>
    </div>
  </div>
</code-well-header>

```html
<div class="d-ps-static">…</div>
<div class="d-ps-relative">…</div>
<div class="d-ps-absolute">…</div>
<div class="d-ps-fixed">…</div>
<div class="d-ps-sticky">…</div>
```

## Classes

Set an element’s position by using the position classes listed in the table below. Starting in v5.8.0, Dialtone began providing immutable type classes, meaning they include an <span class="code-example--inline">!important</span> to override CSS specificity.

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['static', 'relative', 'absolute', 'fixed', 'sticky', 'unset']">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-ps-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">position: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
