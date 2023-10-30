---
title: Icon
description: An icon is used to visually communicate commands, meaning, status, feedback, or common actions.
status: new
thumb: true
image: assets/images/components/icon.png
storybook: https://vue.dialpad.design/?path=/docs/components-icon--default
figma_url: https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT-Core%3A-Icons-7?node-id=1473%3A3757&viewport=-168%2C479%2C1&t=OhX4ilCDvb7Tqkx4-11
---

<code-well-header>
  <dt-stack gap="400" direction="row">
    <dt-icon name="lightning-bolt" size="100" />
    <dt-icon name="lightning-bolt" size="200" />
    <dt-icon name="lightning-bolt" size="300" />
    <dt-icon name="lightning-bolt" size="400" />
    <dt-icon name="lightning-bolt" size="500" />
    <dt-icon name="lightning-bolt" size="600" />
    <dt-icon name="lightning-bolt" size="700" />
    <dt-icon name="lightning-bolt" size="800" />
  </dt-stack>
</code-well-header>

## Icon catalog

<icon-catalog></icon-catalog>

## Variants and examples

### Base Styles

<code-well-header>
    <inbox-icon></inbox-icon>
</code-well-header>

```html
<svg
  aria-hidden="true"
  focusable="false"
  data-name="[ICON_NAME]"
  class="
    d-icon
    d-icon--size-[SIZE]
    d-icon--[ICON_NAME]
  "
  viewBox="0 0 12 12"
>
  ...
</svg>
```

## Sizes

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" colspan="2">Size</th>
      <th scope="col">Dimensions</th>
      <th scope="col">Class</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="{size, width_height, className } in sizes">
      <th scope="row">{{ size }}</th>
      <td class="d-ta-center">
        <inbox-icon :class="className" />
      </td>
      <td class="d-ff-mono d-fs-100">{{ width_height }}</td>
      <td class="d-ff-mono d-fs-100">.{{ className }}</td>
    </tr>
  </tbody>
</table>

<script setup>
    import IconCatalog from "@views/IconCatalog.vue";
    import InboxIcon from '@v7Icons/Inbox.vue';
    import IconInfo from '@v7Icons/Info.vue';
    import { v7 as sizes } from '@data/icons-sizes.json';
</script>
