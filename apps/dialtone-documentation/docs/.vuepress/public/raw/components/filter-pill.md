# Filter Pill

A Filter Pill offers a button paired with a popover to show and manage filtering options, the label and

- **Status**: beta
- **Keywords**: filter tag, filter chip, search filter, d-filter-pill, DtFilterPill, dt-filter-pill, removable tag, dismissible chip

## Variants

### Base

```vue
<dt-filter-pill v-model="[...]" label="..."/>
```

### Disabled

```vue
<dt-filter-pill v-model="[...]" label="..." disabled/>
```

### Active

```vue
<dt-filter-pill v-model="[...]" label="..."/>
```

### Clearable

You can handle the filter resetting, the button will show whenever an active filter is passed.
It will emit the `reset` event when clicked.

```vue
<dt-filter-pill label="..." v-model="[...]" />
```

### Non Clearable

Setting the `hide-clear` prop will hide the reset/clear button in case you don't want your filter be reset.

```vue
<dt-filter-pill label="..." v-model="[...]" hide-clear />
```

### Sizes

```vue
<dt-filter-pill label="..." size="sm" />
```

### With default slot

Using the "default" slot, you're able to override the `label` prop

```vue
<dt-filter-pill label="..." v-model="[...]">
  <template #default>
    With Default slot
  </template>
</dt-filter-pill>
```

### With content slot

Using the "content" slot, you're able to override the popover content, this enables you
to create custom filter pill.

```vue
<dt-filter-pill label="..." v-model="[...]">
  <template #content>
    Content slot example
  </template>
</dt-filter-pill>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `modelValue` | Array of filters to display in the popover, should be an array of objects with `name` and `active` properties | `array` | `[]` |
| `alphaTooltipText` | Text shown in tooltip when you hover the alpha button, required if no content is passed to default slot | `string` | `''` |
| `disabled` | HTML disabled attribute | `boolean` | `false` |
| `hideClear` | Toggles the clear button visibility | `boolean` | `false` |
| `label` | Label of the button | `string` | `''` |
| `omegaTooltipText` | Text shown in tooltip when you hover the omega button, required as it is an icon only button | `string` | `''` |
| `popoverAppendTo` | Sets the element to which the <a class="d-link" href="https://dialtone.dialpad.com/components/popover.html#vue-api" target="_blank">popover component</a> is going to append to | `HTMLElement\|string` | `'body'` |
| `popoverFallbackPlacements` | If the dropdown does not fit in the direction described by "popoverPlacement", it will attempt to change it's direction to the "popoverFallbackPlacements". | `array` | `['auto']` |
| `popoverMaxHeight` | Determines maximum height for the popover before overflow. Possible units rem\|px\|em | `string` | `''` |
| `popoverMaxWidth` | Determines maximum width for the popover before overflow. Possible units rem\|px\|%\|em | `string` | `''` |
| `popoverPadding` | Padding size class for the popover content. | `string` | `'large'` |
| `popoverPlacement` | The direction the popover displays relative to the anchor. <a class="d-link" href="https://atomiks.github.io/tippyjs/v6/all-props/#placement" target="_blank">Tippy.js docs</a> | `string` | `'bottom-start'` |
| `size` | The size of the button. | `string` | `'sm'` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Allows you to override the label behavior |
| `content` | Allows you to override the popover content, only use this if you need custom behavior |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `clear` | Emitted when clicking the clear button | `Boolean \| Array` |
| `open` | Emitted when popover is shown or hidden | `Boolean \| Array` |
| `update:modelValue` | Emitted when the active filters change | `Array` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-filter-pill` | N/A | Base filter pill style. |
| `d-filter-pill__wrapper` | N/A | Applies relative positioning. |
| `d-filter-pill__icon` | N/A | Applies the icon color. |
