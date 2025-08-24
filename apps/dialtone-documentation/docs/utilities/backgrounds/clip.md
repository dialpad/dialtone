---
title: Background Clip
description: Utilities for controlling whether an element's background extends underneath its border, padding, or content box.
---

## Usage

Use `d-bgc-{name}` to control which box an element's background is clipped by.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <div class="d-bgc-border-box d-p16 d-bgc-moderate d-ba d-baw4 d-bas-dashed d-bar8">border-box</div>
    <div class="d-bgc-padding-box d-p16 d-bgc-moderate d-ba d-baw4 d-bas-dashed d-bar8">padding-box</div>
    <div class="d-bgc-content-box d-p16 d-bgc-moderate d-ba d-baw4 d-bas-dashed d-bar8">content-box</div>
  </dt-stack>
</code-well-header>

```html

<div class="d-bgc-border-box">...</div>
<div class="d-bgc-padding-box">...</div>
<div class="d-bgc-content-box">...</div>
```

## Clipping Text

Use `d-bgc-text` to clip the background color(s) within the foreground text.

<code-well-header>
  <div class="d-ba d-bgc-text d-bgg-to-r d-bgg-from-magenta-400 d-bgg-to-purple-400 d-headline--xl">Magic stuff happens.</div>
</code-well-header>

```html
<div class="d-ba d-bgc-text d-bgg-to-r d-bgg-from-magenta-400 d-bgg-to-purple-400 d-headline--xl">...</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
        <tr v-for="i in ['unset', 'border-box', 'padding-box', 'content-box', 'text']">
          <th scope="row" class="d-code--sm d-docsite-code">.d-bgc-{{ i }}</th>
          <td class="d-code--sm">background-clip: {{ i }} !important;</td>
        </tr>
    </tbody>
  </template>
</utility-class-table>
