---
title: Box Sizing
description: Utilities for controlling how the browser should calculate an element's total size.
keywords: ["border box", "content box"]
---

## Examples

All examples below have a 128px height and width. You can see how `.d-box-border` elements includes the padding and border into the overall box's height and width.

```vue demo
<div class="d-fl-center d-w100p d-flow16">
  <dt-stack direction="row" align="center" justify="center" class="d-size-200 d-p-100 d-ba d-baw4 d-bas-dashed d-bar-300 d-bc-default d-bgc-moderate d-box-border"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p-100 d-bgc-moderate-opaque d-bar-200 d-code--sm">d-box-border</dt-stack></dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-size-200 d-p-100 d-ba d-baw4 d-bas-dashed d-bar-300 d-bc-default d-bgc-moderate d-box-content"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p-100 d-bgc-moderate-opaque d-bar-200 d-code--sm">d-box-content</dt-stack></dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-size-200 d-p-100 d-ba d-baw4 d-bas-dashed d-bar-300 d-bc-default d-bgc-moderate d-box-unset"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p-100 d-bgc-moderate-opaque d-bar-200 d-code--sm">d-box-unset</dt-stack></dt-stack>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['content', 'split']">
        <th class="d-code--sm d-docsite-code">d-box-{{ i }}</th>
        <td class="d-code--sm">box-sizing: {{ i }}-box;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
