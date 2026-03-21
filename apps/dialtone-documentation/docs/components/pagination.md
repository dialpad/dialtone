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

<!-- <code-well-header>
  <dt-pagination
    :total-pages="25"
  />
</code-well-header> -->

<component-combinator component-name="DtPagination" />

<code-example-tabs
vueCode='
<dt-pagination
  :total-pages="25"
/>
'
/>

<!-- <component-combinator component-name="DtPagination" /> -->

## Variants

### With Active Page

<code-well-header>
  <dt-pagination
    ref="activePage"
    :total-pages="25"
    :active-page="5"
  />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.activePage'
vueCode='
<dt-pagination
  :total-pages="25"
  :active-page="5"
/>
'
/>

### With Max-Visible

<code-well-header>
  <dt-pagination
    ref="maxVisible"
    :total-pages="25"
    :max-visible="7"
  />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.maxVisible'
vueCode='
<dt-pagination
  :total-pages="25"
  :max-visible="7"
/>
'
/>

## Vue API

<component-vue-api component-name="pagination" />
