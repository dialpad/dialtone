---
title: Overflow
description: Utilities for controlling how an element handles content that is too large for the container.
---

## Examples

<code-well-header>
    <div class="d-d-grid d-g-cols4 d-g16">
        <div v-for="{ class: className } in overflow" class="d-h216 d-p12 d-bar4 d-bgc-moderate" :class="`d-of-${className}`">
            <code>.d-of-{{ className }}</code>
            <p class="d-w216">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.
            </p>
        </div>
    </div>
</code-well-header>

```html
<p class="d-of-auto">…</p>
<p class="d-of-x-auto">…</p>
<p class="d-of-y-auto">…</p>
<p class="d-of-hidden">…</p>
<p class="d-of-x-hidden">…</p>
<p class="d-of-y-hidden">…</p>
<p class="d-of-scroll">…</p>
<p class="d-of-x-scroll">…</p>
<p class="d-of-y-scroll">…</p>
<p class="d-of-visible">…</p>
<p class="d-of-x-visible">…</p>
<p class="d-of-y-visible">…</p>
<p class="d-of-unset">…</p>
```

<script setup>
    import overflow from '@data/overflow.json';
</script>

## Classes

The `overflow` CSS shorthand property sets the desired behavior for how content is handled when it exceeds the wrapper's bounds in both directions (x-axis and then y-axis).

<div v-dt-scrollbar class="d-hmx464 d-bar8 d-ba d-bc-subtle">
  <div>
    <table class="d-table dialtone-doc-table">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
            <tr>
                <th scope="col" class="d-p0 d-bbw0 d-w20p"><div class="d-p16 d-bb d-bc-default d-bbw1">Class</div></th>
                <th scope="col" class="d-p0 d-bbw0 d-w20p"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
                <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Description</div></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="{ class: className, output, description } in overflow">
                <th scope="row" class="d-code--sm d-docsite-code">.d-of-{{ className }}</th>
                <td class="d-code--sm">{{ output }};</td>
                <td>{{ description }}</td>
            </tr>
        </tbody>
    </table>
  </div>
</div>
