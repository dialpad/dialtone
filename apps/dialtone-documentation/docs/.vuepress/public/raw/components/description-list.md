# Description List

Description lists are a way to group and clarify associated ideas. They are notably useful when outlining and explaining terms, like those in a glossary.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-description-list--default
- **Keywords**: definition list, key value, dl, d-description-list, DtDescriptionList, dt-description-list, metadata list, property list

## Variants and Examples

### Default

```vue
<dt-description-list
  ref="descriptionList"
  gap="400"
  :items="items"
  direction="row"
/>
```

### Column Direction

```vue
<dt-description-list
  gap="400"
  :items="items"
  direction="column"
/>
```

### Long Text

```vue
<dt-description-list
  gap="400"
  :items="longTextItems"
  direction="row"
/>
```

### With Term and Description Styles

```vue
<dt-description-list
  ref="exampleWithStyles"
  gap="400"
  :items="items"
  direction="row"
  :termClass="[`d-fc-critical`, `d-fw-bold`]"
  :descriptionClass="[`d-fc-success`]"
/>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `direction` | The direction for the list | `string` | `'row'` |
| `items` | A list of items that represent the term and the description | `array` | `[]` |
| `gap` | Set the space between the elements | `string` | `'400'` |
| `termClass` | Used to customize the term element | `string\|array\|object` | `''` |
| `descriptionClass` | Used to customize the description element | `string\|array\|object` | `''` |
