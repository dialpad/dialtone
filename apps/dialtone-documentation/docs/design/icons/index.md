---
title: Icons
shortTitle: icons
description: An icon style for visually communicating commands, status, and more.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-icon--default
figma_url: https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT-Core%3A-Icons-7?node-id=1473%3A3757&viewport=-168%2C479%2C1&t=OhX4ilCDvb7Tqkx4-11
---

<icon-catalog></icon-catalog>

## Usage

### In Figma

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

Find a list of available icons in [DT Core: Icons](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library), or search the icons in the search library within your Figma file.

<dt-stack class="d-gc2" direction="column" gap="500">
<img alt="Figma Search Icon" src="/assets/images/figma-search-icon.gif" style="border-radius: var(--dt-size-radius-400)">

<dt-text kind="body" tone="tertiary">Swap instances in Figma by holding ⌘ + ⌥ on Mac, or Ctrl + Alt on Windows.</dt-text>

</dt-stack>
</div>

### In Vue

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

For detailed instructions on using the icons, check the [Icon component](/components/icon.md).

<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3 d-w100p">
    <dt-stack direction="row" align="center" justify="center">
      <dt-icon :name="selectedIcon" :size="selectedSize" />
    </dt-stack>
    <dt-select-menu label="Name" :options="iconListOptions" v-model="selectedIcon" />
    <dt-select-menu label="Size" :options="sizeValues" v-model="selectedSize" />
  </div>
</code-well-header>

```js
import { DtIconCreditCard } from '@dialpad/dialtone-icons/vue3';
<dt-icon-credit-card size="500" aria-label="Description" />
```

</div>
</div>

### Choosing the Right Icon

Some icons are linked to specific actions, like the Settings gear <dt-icon name="settings" size="200" /> or the Edit pencil <dt-icon name="edit" size="200" />. For actions without a dedicated icon, avoid reusing icons that are already associated with other actions, this helps prevent confusion and ensures clear understanding. Instead, select an existing icon from the Icon Catalog without a specific action meaning or consider [creating a new one](#crafting-an-icon) that clearly represents the intended action.

### Sizing

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

The icon size is defined based on the context and text size next to it. These are the only available size options and no overrides should be needed to properly size the icons.

<dt-stack direction="row" justify="between" gap="400" class="d-gc2 d-bgc-secondary d-p24 d-bar16">
  <dt-stack gap="400" align="center">
    <dt-icon name="food" size="100" />
    <dt-text as="code" kind="code" size="sm">100</dt-text>
  </dt-stack>
  <dt-stack gap="400" align="center">
    <dt-icon name="food" size="200" />
    <dt-text as="code" kind="code" size="sm">200</dt-text>
  </dt-stack>
  <dt-stack gap="400" align="center">
    <dt-icon name="food" size="300" />
    <dt-text as="code" kind="code" size="sm">300</dt-text>
  </dt-stack>
  <dt-stack gap="400" align="center">
    <dt-icon name="food" size="400" />
    <dt-text as="code" kind="code" size="sm">400</dt-text>
  </dt-stack>
  <dt-stack gap="400" align="center">
    <dt-icon name="food" size="500" />
    <dt-text as="code" kind="code" size="sm">500</dt-text>
  </dt-stack>
  <dt-stack gap="400" align="center">
    <dt-icon name="food" size="600" />
    <dt-text as="code" kind="code" size="sm">600</dt-text>
  </dt-stack>
  <dt-stack gap="400" align="center">
    <dt-icon name="food" size="700" />
    <dt-text as="code" kind="code" size="sm">700</dt-text>
  </dt-stack>
  <dt-stack gap="400" align="center">
    <dt-icon name="food" size="800" />
    <dt-text as="code" kind="code" size="sm">800</dt-text>
  </dt-stack>
</dt-stack>
</div>

#### Sample Pairings

<dt-stack align="center" class="d-gc2 d-bgc-secondary d-p24 d-bar16">
  <dt-stack gap="400">
    <dt-stack direction="row" gap="300" align="center">
      <dt-icon name="food" size="100" />
      <dt-text kind="body" size="xs">100 with XS body</dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="300" align="center">
      <dt-icon name="food" size="200" />
      <dt-text kind="body" size="sm">200 with SM body</dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="300" align="center">
      <dt-icon name="food" size="300" />
      <dt-text kind="body" size="md">300 with MD body</dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="300" align="center">
      <dt-icon name="food" size="400" />
      <dt-text kind="headline" size="lg">400 with LG headline</dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="300" align="center">
      <dt-icon name="food" size="500" />
      <dt-text kind="headline" size="xl">500 with XL headline</dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="300" align="center">
      <dt-icon name="food" size="600" />
      <dt-text kind="headline" size="2xl">600 with 2XL headline</dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="300" align="center">
      <dt-icon name="food" size="700" />
      <dt-text kind="headline" size="3xl">700 with 3XL headline</dt-text>
    </dt-stack>
  </dt-stack>
</dt-stack>

## Crafting an Icon

Our icons are designed for easy recognition and understanding. They are a visual support, helping people navigate the experience more effectively.

### On Figma

Go to the [Icon Builder page](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library?type=design&node-id=12057-3505&mode=design&t=CNADHg9I1bsKDPiB-4) in Figma and follow the instructions. Remember to work on a branch and send a review when the icons are ready.

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

<div>

- Use simple lines and shapes. Avoid creating overly literal, complex icons.
- Utilize the icon grid while maintaining the style of each icon.
- The icon's content should remain within the 2px padding (on size 500/24px); no part of the icon should extend beyond this area.
- Both exterior and interior corners should be 2px (on size 500/24px).
- The stroke style should be `solid`, end points `round`, and join `round`.

</div>
<div class="d-gc2">
<iframe style="border: 0px; border-radius: var(--dt-size-radius-400)" width="100%" height="306" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=44-1450&viewport=-3223%2C-6%2C0.78&t=ma5fyi8Din3K3CgW-8&scaling=min-zoom&starting-point-node-id=44%3A1450&hotspot-hints=0&hide-ui=1" allowfullscreen></iframe>
</div>
</div>

### Exporting

1. [Create a new branch](https://github.com/dialpad/dialtone/tree/staging/packages/dialtone-css/.github/CONTRIBUTING.md#making-a-pull-request) in [dialtone](https://github.com/dialpad/dialtone/tree/staging) repo starting with "dlt-xxxx-" in the name.
2. Place the exported SVG file(s) in the appropriate folder category inside `./src/svg/`, files names should be in kebab-case.
3. Run `nx run dialtone-icons:build`
4. Add keywords related to the icon(s) in the `packages/dialtone-icons/src/keywords-icons.json` file.
5. [Commit](https://github.com/dialpad/dialtone/tree/staging/.github/COMMIT_CONVENTION.md) and push your branch to [dialtone](https://github.com/dialpad/dialtone/tree/staging).
6. Open a pull request, once approved it can be merged into main and will go out in the next [dialtone](https://github.com/dialpad/dialtone/tree/staging) release.

<script setup>
import { ref } from 'vue';
import IconCatalog from "@views/IconCatalog.vue";
import sizes from '@data/icons-sizes.json';

const sizeValues = sizes.map(item => ({ value: item.size, label: item.size }));

const iconListOptions = [
  { value: 'user-plus', label: 'User Plus' },
  { value: 'flame', label: 'Flame' },
  { value: 'heart', label: 'Heart' },
  { value: 'credit-card', label: 'Credit Card' }
];

const selectedIcon = ref('user-plus');
const selectedSize = ref('500');

</script>
