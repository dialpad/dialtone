---
title: Box Sizing
description: Utilities for controlling how the browser should calculate an element's total size.
---

## Examples

All examples below have a 128px height and width. You can see how `.d-box-border` elements includes the padding and border into the overall box's height and width.

<code-well-header>
  <div class="d-fl-center d-w100p d-flow16">
    <dt-stack direction="row" align="center" justify="center" class="d-h128 d-w128 d-p8 d-ba d-baw4 d-bas-dashed d-bar4 d-bc-default d-bgc-moderate d-box-border"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm">d-box-border</dt-stack></dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-h128 d-w128 d-p8 d-ba d-baw4 d-bas-dashed d-bar4 d-bc-default d-bgc-moderate d-box-content"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm">d-box-content</dt-stack></dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-h128 d-w128 d-p8 d-ba d-baw4 d-bas-dashed d-bar4 d-bc-default d-bgc-moderate d-box-unset"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm">d-box-unset</dt-stack></dt-stack>
  </div>
</code-well-header>

```html
<div class="d-box-border">…</div>
<div class="d-box-content">…</div>
<div class="d-box-unset">…</div>
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
