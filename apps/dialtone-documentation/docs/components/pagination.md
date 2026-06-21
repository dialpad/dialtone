---
title: Pagination
description: Navigation for moving through large sets of paged content.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-pagination--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=10984-76640
keywords: ["pager", "page navigation", "page numbers", "d-pagination", "DtPagination", "dt-pagination", "paging", "page control"]
combinator: DtPagination
---

## Variants

### With Active Page

```vue demo
<dt-pagination
  :total-pages="25"
  :active-page="5"
/>
```

### With Max-Visible

```vue demo
<dt-pagination
  :total-pages="25"
  :max-visible="7"
/>
```

## Vue API

<component-vue-api component-name="pagination" />
