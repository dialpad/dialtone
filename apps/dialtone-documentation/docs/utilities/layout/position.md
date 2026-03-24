---
title: Position
description: Utility classes to change an element’s position type.
keywords: ["relative", "absolute", "fixed", "sticky", "static"]
---

## Examples

<code-well-header>
  <div class="d-ps-relative d-w100p">
    <code class="d-bgc-transparent">Relative Parent</code>
    <div class="d-ps-static d-bgc-moderate-opaque d-p-200 d-h464 d-bar8">
      <code class="d-bgc-transparent">Static Parent</code>
      <dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-t-0 d-r-150 d-size-200 d-p-100 d-bar8 d-bgc-moderate-opaque d-code--sm">.d-ps-absolute<br>.d-t0<br>.d-r12</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-b-0 d-r-n150 d-size-200 d-p-100 d-bar8 d-bgc-moderate-opaque d-code--sm">.d-ps-absolute<br>.d-b0<br>.d-rn12</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ps-sticky d-t-0 d-size-200 d-p-100 d-bar8 d-bgc-moderate-opaque d-code--sm">.d-ps-sticky<br>.d-t0</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ps-relative d-t-400 d-l-800 d-size-200 d-p-100 d-bar8 d-bgc-moderate-opaque d-code--sm">.d-ps-relative<br>.d-t32<br>.d-l64</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ps-fixed d-t50p d-l50p d-size-200 d-p-100 d-bar8 d-bgc-moderate-opaque d-code--sm">.d-ps-fixed<br>.d-t50p<br>.d-l50p</dt-stack>
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
