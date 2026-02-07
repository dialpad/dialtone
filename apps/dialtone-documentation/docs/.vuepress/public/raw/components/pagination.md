# Pagination

Pagination allows you to divide large amounts of content into smaller chunks across multiple pages.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-pagination--default
- **Keywords**: pager, page navigation, page numbers, d-pagination, DtPagination, dt-pagination, paging, page control

```vue
<dt-pagination
  :total-pages="25"
/>
```

## Variants

### With Active Page

```vue
<dt-pagination
  :total-pages="25"
  :active-page="5"
/>
```

### With Max-Visible

```vue
<dt-pagination
  :total-pages="25"
  :max-visible="7"
/>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `ariaLabel` | Descriptive label for the pagination content. | `string` | `''` |
| `totalPages` | The total number of the pages | `number` | `''` |
| `activePage` | The active current page in the list of pages, defaults to the first page | `number` | `1` |
| `maxVisible` | Determines the max pages to be shown in the list. Using an odd number is recommended. If an even number is given, then it will be rounded down to the nearest odd number to always keep current page in the middle when current page is in the mid-range. | `number` | `5` |
| `hideEdges` | Sometimes you may need to hide start and end page number buttons when moving in between. This prop will be used to hide the first and last page buttons when not near the edges. This is useful when your backend does not support offset and you can only use cursor based pagination. | `boolean` | `false` |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `change` | Page change event | `Number` |
