---
title: Icons
status: in progress
shortTitle: icons
description: Glyphs with clean lines and consistent styles for clear context and easy understanding.
---

## Usage

### In Figma

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

Find a list of available icons in [DT Core: Icons]([https://](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library)), or search the icons in the search library within your Figma file.

<dt-stack class="d-gc2" direction="column" gap="500">
<img alt="Figma Search Icon" src="/assets/images/figma-search-icon.gif" style="border-radius: 8px">
<p class="d-body-base d-fc-tertiary">Swap instances in Figma by holding ⌘ + ⌥ on Mac, or Ctrl + Alt on Windows.</p>
</dt-stack>
</div>

### In VUE

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

For detailed instructions on using the icons and full library of icons, check the [Icon component](/components/icon.html).

<div class="d-gc2">
<code-well-header>
<dt-stack direction="row" as="section" gap="600">
    <dt-icon :name="selectedIcon" :size="selectedSize" />
    <dt-select-menu label="Name" :options="iconListOptions" @change="changeIcon" />
    <dt-select-menu label="Size" :options="iconSizeOptions" @change="changeIconSize" />
</dt-stack>
</code-well-header>

```js
import { DtIcon } from '@dialpad/dialtone-vue';
<dt-icon name="icon-name" size="500" ariaLabel="Description" />
```

</div>
</div>

### Choosing the right icon

Some icons are linked to specific actions, like the Settings gear <dt-icon name="settings" size="200" /> or the Edit pencil <dt-icon name="edit" size="200" />. For actions without a dedicated icon, avoid reusing icons that are already associated with other actions, this helps prevent confusion and ensures clear understanding. Instead, select an existing icon from the [Icon Library](/components/icon.html) without a specific action meaning or consider [creating a new one](#crafting-an-icon) that clearly represents the intended action.

### Sizing

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

The icon size is defined based on the context and text size next to it. Note that sizes 600, 700, and 800 are exclusive to devices. Below are some examples:

<div class="d-gc2">
<p class="d-body-small"><dt-icon name="food" size="200" /> 200 when body small</p>
<p class="d-body-base"><dt-icon name="food" size="300" /> 300 when body base</p>
<p class="d-headline-large"><dt-icon name="food" size="400" /> 400 when headline medium</p>
<p class="d-headline-extra-large"><dt-icon name="food" size="500" /> 500  when headline large</p>
<p class="d-fs-300-tv"><dt-icon name="food" size="600" /> 600 when device 300</p>
<p class="d-fs-400-tv"><dt-icon name="food" size="700" /> 700 when device 400</p>
<!-- <p class="d-fs-500-tv"><dt-icon name="food" size="800" /> 800 when device 500</p> -->

</div>
</div>

### Colors

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

When setting the color of an icon take these into considaration:

<div class="d-gc1">
<div style="background: var(--dt-color-purple-100)" class="d-p16 d-hmn164 d-bar8 d-d-flex d-ai-center">
<dt-stack direction="row" as="section" gap="600" class="d-bgc-primary d-bc-default d-bar32 d-py8 d-px16 d-w100p">
<dt-stack direction="row" as="section" gap="300" class="d-fl1">
<dt-icon name="headphones" size="300" ariaLabel="Headphones icon" />
<p class="d-body-base">Ai Contact C...</p>
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
<dt-stack direction="row" as="section" gap="600" class="d-bgc-primary d-bc-default d-bar32 d-py8 d-px16 d-w100p">
<dt-stack direction="row" as="section" gap="300" class="d-fl1">
<dt-icon name="headphones" size="300" ariaLabel="Headphones icon" />
<p class="d-body-base">Ai Contact C...</p>
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

### Accessibility

If the icon serves a purpose beyond its visual representation, provide a clear description in the `ariaLabel` prop. This ensures all users understand its function, regardless of how they interact with it, e.g: `<dt-icon name="settings" ariaLabel="Edit your profile" />`

Icons contrast guidelines are the same as [Typography].

## Crafting an icon

Our icons are designed for easy recognition and understanding. They are a visual support, helping people navigate the experience more effectively.

### On Figma

Go to the [Icon Builder page]([https://](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library?type=design&node-id=12057-3505&mode=design&t=CNADHg9I1bsKDPiB-4)) in Figma and follow the instructions. Remember to work on a branch and send a review when the icons are ready.

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

<div>

- Use simple lines and shapes. Avoid creating overly literal, complex icons.
- Utilize the icon grid while maintaining the style of each icon.
- The icon's content should remain within the 2px padding (on size 500/24px); no part of the icon should extend beyond this area.
- Both exterior and interior corners should be 2px (on size 500/24px).
- The stroke style it's `solid`, end points `round`, and join `round`.

</div>
<div class="d-gc2">
<iframe style="border: 0px; border-radius: 8px" width="100%" height="306" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=44-1450&viewport=-3223%2C-6%2C0.78&t=ma5fyi8Din3K3CgW-8&scaling=min-zoom&starting-point-node-id=44%3A1450&hotspot-hints=0&hide-ui=1" allowfullscreen></iframe>
</div>
</div>

### Exporting

1. [Create a new branch](https://github.com/dialpad/dialtone/blob/staging/packages/dialtone-css/.github/CONTRIBUTING.md#making-a-pull-request) in [dialtone](https://github.com/dialpad/dialtone/tree/b66ad612cfa0768712ce6427b806d432ad27b394) repo starting with "dlt-xxxx-" in the name.
2. Place the exported SVG file(s) in the appropriate folder category inside `./src/svg/`, files names should be on kebab-case.
3. Run `pnpm run build`
4. Add keywords related to the icon(s) in the `./src/icons.json` file.
5. [Commit](https://github.com/dialpad/dialtone/blob/b66ad612cfa0768712ce6427b806d432ad27b394/.github/COMMIT_CONVENTION.md) and push your branch to [dialtone](https://github.com/dialpad/dialtone/tree/b66ad612cfa0768712ce6427b806d432ad27b394).
6. Open a pull request, once approved it can be merged into main and will go out in the next [dialtone](https://github.com/dialpad/dialtone/tree/b66ad612cfa0768712ce6427b806d432ad27b394) release.

<script setup>
import { ref } from 'vue';

const iconListOptions = [
  { value: 'user-plus', label: 'User Plus' },
  { value: 'flame', label: 'Flame' },
  { value: 'heart', label: 'Heart' },
  { value: 'credit-card', label: 'Credit Card' }
];

const iconSizeOptions = [
  { value: '600', label: '600' },
  { value: '500', label: '500' },
  { value: '400', label: '400' },
  { value: '300', label: '300' }
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
