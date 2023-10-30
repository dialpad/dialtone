---
title: Pagination
description: Pagination allows you to divide large amounts of content into smaller chunks across multiple pages.
status: ready
thumb: true
image: assets/images/components/pagination.png
storybook: https://vue.dialpad.design/?path=/story/components-pagination--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=10984%3A76640
---

<code-well-header>
  <dt-pagination
    :total-pages="25"
    aria-label="Pagination"
    prev-aria-label="Previous page"
    next-aria-label="Next page"
    :page-number-aria-label="() => {}"
  />
</code-well-header>

## Vue API

<component-vue-api component-name="pagination" />
