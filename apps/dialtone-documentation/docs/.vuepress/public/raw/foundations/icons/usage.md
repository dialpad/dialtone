# Icon Usage

Guidance on using icons in Figma and Vue, with best practices for icon selection and sizing.

- **Keywords**: how to use icons,icon guidelines

## In Figma

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

Find a list of available icons in [DT Core: Icons](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library), or search the icons in the search library within your Figma file.

<img alt="Figma Search Icon" src="/assets/images/figma-search-icon.gif" style="border-radius: var(--dt-size-radius-400)">
<p class="d-body--md d-fc-tertiary">Swap instances in Figma by holding ⌘ + ⌥ on Mac, or Ctrl + Alt on Windows.</p>
</div>

## In Vue

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

For detailed instructions on using the icons, check the [DtIcon component](../../components/icon.md).

<div class="d-gc2">
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

Some icons are linked to specific actions, like the Settings gear <dt-icon name="settings" size="200" /> or the Edit pencil <dt-icon name="edit" size="200" />. For actions without a dedicated icon, avoid reusing icons that are already associated with other actions, this helps prevent confusion and ensures clear understanding. Instead, select an existing icon from the Icon Catalog without a specific action meaning or consider [creating a new one](./crafting-an-icon.md) that clearly represents the intended action.

## Sizing

<div>

<div>

The icon size is defined based on the context and text size next to it. These are the only available size options and no overrides should be needed to properly size the icons.
</div>

    <code>200</code>
    <code>300</code>
    <code>400</code>
    <code>500</code>
    <code>600</code>
    <code>700</code>
    <code>800</code>
</div>
