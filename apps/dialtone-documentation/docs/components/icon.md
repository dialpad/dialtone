---
title: Icon
description: An icon is used to visually communicate commands, meaning, status, feedback, or common actions.
status: ready
thumb: true
image: assets/images/components/icon.png
storybook: https://vue.dialpad.design/?path=/docs/components-icon--default
figma_url: https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT-Core%3A-Icons-7?node-id=1473%3A3757&viewport=-168%2C479%2C1&t=OhX4ilCDvb7Tqkx4-11
---

Check out our complete icon collection in the [Icon Catalog](/design/icons/#icon-catalog).

## Usage

### Changing the Icon

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

To change the icon, modify the 'name' prop to your desired icon. Explore the [Icon Catalog](/design/icons/#icon-catalog) for options.

<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-gg24 d-g-cols2 md:d-g-cols1 d-w100p">
    <div class="d-fl-center">
      <dt-icon :name="selectedIcon"/>
    </div>
    <dt-select-menu label="Name" :options="iconListOptions" @change="changeIcon" />
  </div>
</code-well-header>

```js
<dt-icon name="icon-name" size="500" />
```

</div>
</div>

### Changing the Size

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

Adjust the size using the `size` prop. Note that sizes 600, 700, and 800 are exclusively for devices.

<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-gg24 d-g-cols2 md:d-g-cols1 d-w100p">
    <div class="d-fl-center">
      <dt-icon name="settings" :size="selectedSize" />
    </div>
    <dt-select-menu label="Size" :options="sizeValues" @change="changeIconSize" />
  </div>
</code-well-header>

```js
<dt-icon name="settings" size="500" />
```

</div>
</div>

### Changing the Color

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

The icon's color inherits from the parent's foreground color.

<div class="d-gc2">
<code-well-header>
<div class="d-d-grid d-gg24 d-g-cols2 md:d-g-cols1 d-w100p">
  <div class="d-fl-center">
    <dt-stack :class="selectedColor" direction="row" as="div" gap="300">
      <dt-icon name="settings" size="300" />
      <p>Settings</p>
    </dt-stack>
  </div>
  <dt-select-menu label="Color" :options="iconColors" @change="changeIconColor" />
</div>
</code-well-header>

```js
<dt-stack class="d-fc-success">
  <dt-icon name="settings" size="300" />
  <p>Settings</p>
</dt-stack>
```

</div>
</div>

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

When setting the color of an icon take these into considaration:

<div class="d-gc1">
<div style="background: var(--dt-color-purple-100)" class="d-p16 d-hmn164 d-bar8 d-d-flex d-ai-center">
<dt-stack direction="row" as="section" gap="100" class="d-bgc-primary d-bc-default d-bar32 d-py8 d-px16 d-w100p">
<dt-stack direction="row" as="section" gap="300" class="d-fl1">
<dt-icon name="headphones" size="300" ariaLabel="Headphones icon" />
<p class="d-body-base d-truncate d-w100p d-wmx102">Ai Contact Center</p>
</dt-stack>
<dt-stack direction="row" as="section" gap="300">
<dt-icon class="d-fc-success" name="bell" size="200" ariaLabel="Bell Icon" />
<p class="d-fc-success d-body-small">Available</p>
</dt-stack>
</dt-stack>
</div>

- Match the icon color with the text color when pairing them.
- All icons are monochrome.

</div>

<div class="d-gc1">
<div class="d-bgc-critical-subtle-opaque d-p16 d-hmn164 d-bar8 d-d-flex d-ai-center">
<dt-stack direction="row" as="section" gap="100" class="d-bgc-primary d-bc-default d-bar32 d-py8 d-px16 d-w100p">
<dt-stack direction="row" as="section" gap="300" class="d-fl1">
<dt-icon name="headphones" size="300" ariaLabel="Headphones icon" />
<p class="d-body-base d-truncate d-w100p d-wmx102">Ai Contact Center</p>
</dt-stack>
<dt-stack direction="row" as="section" gap="300">
<dt-icon class="d-fc-critical" name="bell" size="200" ariaLabel="Bell Icon" />
<p class="d-fc-success d-body-small">Available</p>
</dt-stack>
</dt-stack>
</div>

- Don’t use different colors for text and icons.
- Don’t use more than one color within an icon.

</div>
</div>

### Icon and Text aligment

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

We encourage utilizing the [Stack component](/components/stack/) for aligning elements both horizontally and vertically.

<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-gg24 d-g-cols2 md:d-g-cols1 d-w100p">
    <div class="d-fl-center">
      <dt-stack :direction="selectedDirection" class="d-fl-center" gap="300">
      <dt-icon name="settings" size="300" />
      <p>Settings</p>
      </dt-stack>
    </div>
    <dt-select-menu label="Direction" :options="stackDirection" @change="changeDirection" />
  </div>
</code-well-header>

```js
<dt-stack direction="row" class="d-fl-center" gap="300">
  <dt-icon name="settings" size="300" />
  <p>Settings</p>
</dt-stack>
```

</div>
</div>

### Accessibility

- If the icon serves a purpose beyond its visual representation, provide a clear description in the `ariaLabel` prop. This ensures all users understand its function, regardless of how they interact with it, e.g: `<dt-icon name="settings" ariaLabel="Edit your profile" />`

- Icons contrast guidelines are the same as [Typography].

- Avoid using icons as clickable elements; instead, use the [Icon Button](/components/button.html#icon-only) for interactive actions.

## HTML

### Base Styles

<code-well-header>
    <dt-icon name="inbox" />
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

### Sizes

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
        <dt-icon name="inbox" :size="size" />
      </td>
      <td class="d-ff-mono d-fs-100">{{ width_height }}</td>
      <td class="d-ff-mono d-fs-100">.{{ className }}</td>
    </tr>
  </tbody>
</table>

<script setup>
  import { ref } from 'vue';
  import sizes from '@data/icons-sizes.json';
  
  const sizeValues = sizes.map(item => ({ value: item.size, label: item.size }));

  const iconListOptions = [
    { value: 'user-plus', label: 'User Plus' },
    { value: 'flame', label: 'Flame' },
    { value: 'heart', label: 'Heart' },
    { value: 'credit-card', label: 'Credit Card' }
  ];

  const iconColors = [
    { value: 'd-fc-success', label: 'd-fc-success' },
    { value: 'd-fc-error', label: 'd-fc-error' },
    { value: 'd-fc-primary', label: 'd-fc-primary' },
  ];

  const stackDirection = [
    { value: 'row', label: 'row' },
    { value: 'column', label: 'column'}
  ];

  const selectedIcon = ref('settings');
  const selectedSize = ref(500);
  const selectedColor = ref('d-fc-success');
  const selectedDirection = ref('row');

  const changeIcon = (newIcon) => {
    selectedIcon.value = newIcon;
  };

  const changeIconColor = (newColor) => {
    selectedColor.value = newColor;
  };

  const changeIconSize = (newSize) => {
    selectedSize.value = newSize;
  };

  const changeDirection = (newDirection) => {
    selectedDirection.value = newDirection;
  };
</script>
