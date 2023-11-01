---
title: Box sizing
description: Utilities for controlling how the browser should calculate an element's total size.
---

## Examples

All examples below have a 128px height and width. You can see how `.d-box-border` elements includes the padding and border into the overall box's height and width.

<code-well-header  class="d-fl-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216 d-flow16" custom>
  <div class="d-fl-center d-h128 d-w128 d-p8 d-ba d-baw4 d-bas-dashed d-bar4 d-bc-purple-300 d-bgc-purple-200 d-box-border"><div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-purple-300 d-bar2 d-ff-mono d-fs-100">d-box-border</div></div>
  <div class="d-fl-center d-h128 d-w128 d-p8 d-ba d-baw4 d-bas-dashed d-bar4 d-bc-purple-300 d-bgc-purple-200 d-box-content"><div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-purple-300 d-bar2 d-ff-mono d-fs-100">d-box-content</div></div>
  <div class="d-fl-center d-h128 d-w128 d-p8 d-ba d-baw4 d-bas-dashed d-bar4 d-bc-purple-300 d-bgc-purple-200 d-box-unset"><div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-purple-300 d-bar2 d-ff-mono d-fs-100">d-box-unset</div></div>
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
        <th class="d-ff-mono d-fc-purple-400 d-fs-100 d-fw-normal">d-box-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">box-sizing: {{ i }}-box;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
