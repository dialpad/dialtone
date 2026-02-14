---
title: Icon Usage
description: Guidance on using icons in Figma and Vue, with best practices for icon selection and sizing.
figma_url: https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT-Core%3A-Icons-7?node-id=1473%3A3757&viewport=-168%2C479%2C1&t=OhX4ilCDvb7Tqkx4-11
keywords: ["how to use icons","icon guidelines"]
---

## In Figma

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

Find a list of available icons in [DT Core: Icons](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library), or search the icons in the search library within your Figma file.

<dt-stack class="d-gc2" direction="column" gap="500">
<img alt="Figma Search Icon" src="/assets/images/figma-search-icon.gif" style="border-radius: var(--dt-size-radius-400)">
<p class="d-body--md d-fc-tertiary">Swap instances in Figma by holding ⌘ + ⌥ on Mac, or Ctrl + Alt on Windows.</p>
</dt-stack>
</div>

## In Vue

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

For detailed instructions on using the icons, check the [DtIcon component](/components/icon.md).

<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3 d-w100p">
    <div class="d-fl-center">
      <dt-icon :name="selectedIcon" :size="selectedSize" />
    </div>
    <dt-select-menu label="Name" :options="iconListOptions" @change="changeIcon" />
    <dt-select-menu label="Size" :options="sizeValues" @change="changeIconSize" />
  </div>
</code-well-header>
</div>
</div>

### Vue 2

```js
import { DtIconCreditCard } from '@dialpad/dialtone-icons/vue2';
<dt-icon-credit-card size="500" aria-label="Description" />
```

### Vue 3

```js
import { DtIconCreditCard } from '@dialpad/dialtone-icons/vue3';
<dt-icon-credit-card size="500" aria-label="Description" />
```

## Choosing the Right Icon

Some icons are linked to specific actions, like the Settings gear <dt-icon name="settings" size="200" /> or the Edit pencil <dt-icon name="edit" size="200" />. For actions without a dedicated icon, avoid reusing icons that are already associated with other actions, this helps prevent confusion and ensures clear understanding. Instead, select an existing icon from the Icon Catalog without a specific action meaning or consider [creating a new one](/foundations/icons/crafting-an-icon/) that clearly represents the intended action.

## Sizing

<div>

<div>

The icon size is defined based on the context and text size next to it. These are the only available size options and no overrides should be needed to properly size the icons.
</div>

<dt-stack direction="row" gap="500" class="d-gc1 d-bgc-secondary d-p16 d-px32 d-bar16 d-ai-flex-start d-jc-space-between">
  <dt-stack gap="500" class="d-ai-center">
    <code>200</code>
    <dt-icon name="food" size="200" />
  </dt-stack>
  <dt-stack gap="500" class="d-ai-center">
    <code>300</code>
    <dt-icon name="food" size="300" />
  </dt-stack>
  <dt-stack gap="500" class="d-ai-center">
    <code>400</code>
    <dt-icon name="food" size="400" />
  </dt-stack>
  <dt-stack gap="500" class="d-ai-center">
    <code>500</code>
    <dt-icon name="food" size="500" />
  </dt-stack>
  <dt-stack gap="500" class="d-ai-center">
    <code>600</code>
    <dt-icon name="food" size="600" />
  </dt-stack>
  <dt-stack gap="500" class="d-ai-center">
    <code>700</code>
    <dt-icon name="food" size="700" />
  </dt-stack>
  <dt-stack gap="500" class="d-ai-center">
    <code>800</code>
    <dt-icon name="food" size="800" />
  </dt-stack>
</dt-stack>
</div>

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

const selectedIcon = ref('settings');
const selectedSize = ref('500');

const changeIcon = (newIcon) => {
  selectedIcon.value = newIcon;
};

const changeIconSize = (newSize) => {
  selectedSize.value = newSize;
};

</script>
