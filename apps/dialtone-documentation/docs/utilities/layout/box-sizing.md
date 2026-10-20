---
title: Box Sizing
description: Utilities for controlling how the browser should calculate an element's total size.
keywords: ["border box", "content box"]
---

## Examples

Each example sets its width and height to 128px. `.d-box-border` includes padding and border within that size. `.d-box-content` adds them outside it. Because `box-sizing` is not inherited, `.d-box-unset` resets to `content-box` and has the same outer size as `.d-box-content`.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200" class="d-fl-center d-w100p">
  <dt-stack direction="row" align="center" justify="center" class="d-box-border d-size-200 d-p-100 d-ba d-baw4 d-bas-dashed d-bar-300 d-bc-default d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p-100 d-bgc-moderate-opaque d-bar-200 d-code--sm">d-box-border</dt-stack></dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-box-content d-size-200 d-p-100 d-ba d-baw4 d-bas-dashed d-bar-300 d-bc-default d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p-100 d-bgc-moderate-opaque d-bar-200 d-code--sm">d-box-content</dt-stack></dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-box-unset d-size-200 d-p-100 d-ba d-baw4 d-bas-dashed d-bar-300 d-bc-default d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p-100 d-bgc-moderate-opaque d-bar-200 d-code--sm">d-box-unset</dt-stack></dt-stack>
</dt-stack>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">d-box-border</th>
        <td class="d-code--sm">box-sizing: border-box !important;</td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">d-box-content</th>
        <td class="d-code--sm">box-sizing: content-box !important;</td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">d-box-unset</th>
        <td class="d-code--sm">box-sizing: unset !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
