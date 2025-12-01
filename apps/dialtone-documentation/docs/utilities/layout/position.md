---
title: Position
description: Utility classes to change an element’s position type.
---

## Examples

<code-well-header>
  <div class="d-ps-relative d-w100p">
    <code class="d-bgc-transparent">Relative Parent</code>
    <div class="d-ps-static d-bgc-moderate-opaque d-p16 d-h464 d-bar8">
      <code class="d-bgc-transparent">Static Parent</code>
      <dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-t0 d-r12 d-h128 d-w128 d-p8 d-bar8 d-bgc-moderate-opaque d-code--sm">.d-ps-absolute<br>.d-t0<br>.d-r12</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-b0 d-rn12 d-h128 d-w128 d-p8 d-bar8 d-bgc-moderate-opaque d-code--sm">.d-ps-absolute<br>.d-b0<br>.d-rn12</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ps-sticky d-t0 d-h128 d-w128 d-p8 d-bar8 d-bgc-moderate-opaque d-code--sm">.d-ps-sticky<br>.d-t0</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ps-relative d-t32 d-l64 d-h128 d-w128 d-p8 d-bar8 d-bgc-moderate-opaque d-code--sm">.d-ps-relative<br>.d-t32<br>.d-l64</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ps-fixed d-t50p d-l50p d-h128 d-w128 d-p8 d-bar8 d-bgc-moderate-opaque d-code--sm">.d-ps-fixed<br>.d-t50p<br>.d-l50p</dt-stack>
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
        <th scope="row" class="d-code--sm d-docsite-code">.d-ps-{{ i }}</th>
        <td class="d-code--sm">position: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
