---
title: Position
description: Utility classes to change an element’s position type.
keywords: ["relative", "absolute", "fixed", "sticky", "static"]
---

> [!WARNING] Use DtBox over CSS Utilities
> Reach for [DtBox's](/components/box.html#positioning) `position` prop before considering positioning utilities.

## Examples

```vue demo
<div class="d-ps-relative d-w100p">
  <code class="d-bgc-transparent">Relative Parent</code>
  <div class="d-ps-static d-bgc-moderate-opaque d-p-200 d-h-700 d-bar-400">
    <code class="d-bgc-transparent">Static Parent</code>
    <dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-ibs-0 d-iie-150 d-size-200 d-p-100 d-bar-400 d-bgc-moderate-opaque d-code--sm">.d-ps-absolute<br>.d-ibs-0<br>.d-iie-150</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-ibe-0 d-iie-n150 d-size-200 d-p-100 d-bar-400 d-bgc-moderate-opaque d-code--sm">.d-ps-absolute<br>.d-ibe-0<br>.d-iie-n150</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-ps-sticky d-ibs-0 d-size-200 d-p-100 d-bar-400 d-bgc-moderate-opaque d-code--sm">.d-ps-sticky<br>.d-ibs-0</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-ps-relative d-ibs-400 d-iis-800 d-size-200 d-p-100 d-bar-400 d-bgc-moderate-opaque d-code--sm">.d-ps-relative<br>.d-ibs-400<br>.d-iis-800</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-ps-fixed d-t50p d-l50p d-size-200 d-p-100 d-bar-400 d-bgc-moderate-opaque d-code--sm">.d-ps-fixed<br>.d-t50p<br>.d-l50p</dt-stack>
  </div>
</div>
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
