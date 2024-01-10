---
title: Icons
status: in progress
shortTitle: icons
description: An icon style for visually communicating commands, status, and more.
storybook: https://vue.dialpad.design/?path=/docs/components-icon--default
figma_url: https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT-Core%3A-Icons-7?node-id=1473%3A3757&viewport=-168%2C479%2C1&t=OhX4ilCDvb7Tqkx4-11
---

## Icon catalog

<icon-catalog></icon-catalog>

## Usage

### In Figma

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

Find a list of available icons in [DT Core: Icons](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library), or search the icons in the search library within your Figma file.

<dt-stack class="d-gc2" direction="column" gap="500">
<img alt="Figma Search Icon" src="/assets/images/figma-search-icon.gif" style="border-radius: var(--dt-size-radius-400)">
<p class="d-body-base d-fc-tertiary">Swap instances in Figma by holding ⌘ + ⌥ on Mac, or Ctrl + Alt on Windows.</p>
</dt-stack>
</div>

### In Vue

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

For detailed instructions on using the icons, check the [Icon component](/components/icon.html).

<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1 d-w100p">
    <div class="d-fl-center">
      <dt-icon :name="selectedIcon" :size="selectedSize" />
    </div>
    <dt-select-menu label="Name" :options="iconListOptions" @change="changeIcon" />
    <dt-select-menu label="Size" :options="sizeValues" @change="changeIconSize" />
  </div>
</code-well-header>

```js
import { DtIcon } from '@dialpad/dialtone-vue';
<dt-icon name="icon-name" size="500" ariaLabel="Description" />
```

</div>
</div>

### Choosing the right icon

Some icons are linked to specific actions, like the Settings gear <dt-icon name="settings" size="200" /> or the Edit pencil <dt-icon name="edit" size="200" />. For actions without a dedicated icon, avoid reusing icons that are already associated with other actions, this helps prevent confusion and ensures clear understanding. Instead, select an existing icon from the [Icon Catalog](#icon-catalog) without a specific action meaning or consider [creating a new one](#crafting-an-icon) that clearly represents the intended action.

### Sizing

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

The icon size is defined based on the context and text size next to it. These are the only available size options and no overrides should be needed to properly size the icons.

<div class="d-gc2">
<p class="d-body-small"><dt-icon name="food" size="200" /> 200 when body small</p>
<p class="d-body-base"><dt-icon name="food" size="300" /> 300 when body base</p>
<p class="d-headline-large"><dt-icon name="food" size="400" /> 400 when headline large</p>
<p class="d-headline-extra-large"><dt-icon name="food" size="500" /> 500  when headline extra large</p>
<p class="d-fs-300-tv"><dt-icon name="food" size="600" /> 600 when device 300</p>
<p class="d-fs-400-tv"><dt-icon name="food" size="700" /> 700 when device 400</p>
<!-- <p class="d-fs-500-tv"><dt-icon name="food" size="800" /> 800 when device 500</p> -->

</div>
</div>

## Crafting an icon

Our icons are designed for easy recognition and understanding. They are a visual support, helping people navigate the experience more effectively.

### On Figma

Go to the [Icon Builder page](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library?type=design&node-id=12057-3505&mode=design&t=CNADHg9I1bsKDPiB-4) in Figma and follow the instructions. Remember to work on a branch and send a review when the icons are ready.

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

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
3. Run `pnpm run build`
4. Add keywords related to the icon(s) in the `./src/icons.json` file.
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

const selectedIcon = ref('settings');
const selectedSize = ref('500');

const changeIcon = (newIcon) => {
  selectedIcon.value = newIcon;
};

const changeIconSize = (newSize) => {
  selectedSize.value = newSize;
};
</script>
