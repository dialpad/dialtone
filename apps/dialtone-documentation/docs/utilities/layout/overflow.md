---
title: Overflow
description: Utilities for controlling how an element handles content that is too large for the container.
---

## Examples

<code-well-header  class="d-d-flex d-fd-row d-fw-wrap d-p24 d-pb48 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216" custom>
    <div v-for="{ class: className } in overflow" class="d-w216 d-h216 d-m6 d-p12 d-bar4 d-bgc-purple-200 d-bgo75" :class="`d-of-${className}`">
        <code>.d-of-{{ className }}</code>
        <p class="d-w216">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.
        </p>
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

<table class="d-table dialtone-doc-table">
    <thead>
        <tr>
            <th scope="col" class="d-w20p">Class</th>
            <th scope="col" class="d-w20p">Output</th>
            <th scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="{ class: className, output, description } in overflow">
            <th scope="row" class="d-ff-mono d-fc-purple-400 d-fs-100 d-fw-normal">.d-of-{{ className }}</th>
            <td class="d-ff-mono d-fs-100">{{ output }};</td>
            <td>{{ description }}</td>
        </tr>
    </tbody>
</table>
