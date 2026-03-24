---
title: Pagination
description: Pagination allows you to divide large amounts of content into smaller chunks across multiple pages.
status: ready
thumb: true
image: assets/images/components/pagination.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-pagination--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=10984-76640
keywords: ["pager", "page navigation", "page numbers", "d-pagination", "DtPagination", "dt-pagination", "paging", "page control"]
---

<component-combinator component-name="DtPagination" />

## Variants

### With Active Page

<code-example>
  <dt-pagination
    :total-pages="25"
    :active-page="5"
  />
</code-example>

### With Max-Visible

<code-example>
  <dt-pagination
    :total-pages="25"
    :max-visible="7"
  />
</code-example>

## Vue API

<component-vue-api component-name="pagination" />
