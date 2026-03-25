---
title: Table
status: ready
thumb: true
image: assets/images/components/table.png
description: A table is a pattern for organizing data sets. While data visualization helps quickly summarize a data set, a table allows users to compare and analyze individual data rows.
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=5544-21729
keywords: ["data table", "grid", "rows", "d-table", "DtTable", "dt-table", "datagrid", "data list"]
---

<!-- <component-combinator component-name="DtTable" /> -->

## Variants and Examples

### Base Style

<code-example bgclass="d-bgc-primary" class="d-d-block">
  <table class="d-table dialtone-doc-table">
    <caption class="d-table__caption">Office List</caption>
    <thead>
      <tr>
        <th scope="col">Office</th>
        <th scope="col">Country</th>
        <th scope="col" width="10%">Employees</th>
        <th scope="col">Contact</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in examples">
        <th scope="row">{{ i.office }}</th>
        <td>{{ i.country }}</td>
        <td>{{ i.size }}</td>
        <td>{{ i.contact }}</td>
      </tr>
    </tbody>
  </table>
</code-example>

### Inverted Style

<dt-notice title="Deprecated" kind="info" class="d-wmx100p d-my-200" hide-close>
  The <code>d-table--inverted</code> modifier has been deprecated. Use the <dt-link to="mode-island.html#inverting">v-dt-mode directive</dt-link> instead.
</dt-notice>

### Striped

<code-example bgclass="d-bgc-primary" class="d-d-block">
  <table class="d-table dialtone-doc-table d-table--striped">
    <caption class="d-table__caption">Office List</caption>
    <thead>
      <tr>
        <th scope="col">Office</th>
        <th scope="col">Country</th>
        <th scope="col" width="10%">Employees</th>
        <th scope="col">Contact</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in examples">
        <th scope="row">{{ i.office }}</th>
        <td>{{ i.country }}</td>
        <td>{{ i.size }}</td>
        <td>{{ i.contact }}</td>
      </tr>
    </tbody>
  </table>
</code-example>

## Classes

<component-class-table component-name="table" />

## Accessibility

Use the `caption` element to describe a table in the same way you would use a heading. A caption helps users find, navigate and understand tables.

We provide `.d-table__caption` for a basic caption style, but you can also use utility classes to apply custom styles as needed.

<script setup>
  import { examples } from '@data/table.json';
</script>
