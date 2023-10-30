---
title: Background size
description: Utilities for controlling an element's background size.
---

## Usage

Use `d-bgs-{n}` to control the size of element's background image.

<code-well-header class="d-fl-col4 d-fw-wrap d-flg12 d-p12 d-bgc-black-200 d-bgo50" custom>
  <div class="d-d-flex d-fd-column d-ai-center d-stack4" v-for="i in sizes">
      <div
        class="d-fl-center d-w128 d-h128 d-bgc-magenta-200 d-bar8 d-bc-purple-200 d-of-hidden d-bgr-none"
        style="background-image: url('https://4.bp.blogspot.com/-EVbXg5iW6qY/ULcKZEC-bnI/AAAAAAAACCI/kZDtjeKwQlo/s1600/puffin1.jpg');"
        :style="i === 'var' ? '--bgg-size: 65% 65%;' : ''"
        :class="[{'d-bgp-center': i === 'auto'}, `d-bgs-${i}`]"
      >
      </div>
      <code>.d-bgs-{{ i }}</code>
  </div>
</code-well-header>

```html
<div class="d-bgr-none d-bgs-contain" style="background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-cover" style="background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-auto d-bgp-center" style="background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-unset" style="background-image: url(...);">...</div>
```

<script setup>
  const sizes = ['contain', 'cover', 'var', 'auto', 'unset'];
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in sizes">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-bgp-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">
          background-size:
            <span v-if="i === 'var'"> var(--bgg-size, 100% 100%); </span>
            <span v-else >{{ i }} !important; </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
