---
title: Table
status: ready
thumb: true
image: assets/images/components/table.png
description: A table is a pattern for organizing data sets. While data visualization helps quickly summarize a data set, a table allows users to compare and analyze individual data rows.
figma: wip
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8921%3A20948&viewport=-788%2C209%2C0.86&t=xHutRjwo1o5zMTgT-11
---
<code-well-header bgclass="d-bgc-primary">
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
</code-well-header>

[//]: # (## Usage)
[//]: # (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa ante, tempus vitae lacus id, luctus tristique lorem. Mauris feugiat massa ex, id aliquet mi tempor non. Curabitur non tristique lectus. Fusce ut nisl non diam dignissim viverra. In posuere dui arcu, sed eleifend massa faucibus sed. Phasellus quis leo vitae erat pellentesque venenatis id vitae lectus. Suspendisse convallis, metus a congue tincidunt, velit sem tincidunt dui, eget auctor ipsum ipsum in ex. Nullam lobortis, mauris vel vestibulum rutrum, lorem elit vehicula est, nec viverra ante erat nec dolor. Proin at placerat tortor. Nam ullamcorper metus et eros porta, at lacinia leo scelerisque. Curabitur finibus sollicitudin odio tempor finibus. Donec lobortis metus vitae mollis gravida.)

## Variants and examples

### Base Style

<code-well-header bgclass="d-bgc-primary">
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
</code-well-header>

```html
<table class="d-table">
  <caption class="d-table__caption">...</caption>
  <thead>
    <tr>
      <th scope="col">...</th>
      <th scope="col">...</th>
      <th scope="col">...</th>
      <th scope="col">...</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
  </tbody>
</table>
```

### Inverted Style

Used when you want to display a data table on a darker background.

<code-well-header bgclass="d-bgc-contrast">
  <table class="d-table dialtone-doc-table d-table--inverted">
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
</code-well-header>

```html
<table class="d-table d-table--inverted">
  <caption class="d-table__caption">...</caption>
  <thead>
    <tr>
      <th scope="col">...</th>
      <th scope="col">...</th>
      <th scope="col">...</th>
      <th scope="col">...</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
  </tbody>
</table>
```

### Striped

<code-well-header bgclass="d-bgc-primary">
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
</code-well-header>

```html
<table class="d-table d-table--striped">
  <caption class="d-table__caption">...</caption>
  <thead>
    <tr>
      <th scope="col">...</th>
      <th scope="col">...</th>
      <th scope="col">...</th>
      <th scope="col">...</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
  </tbody>
</table>
```

<code-well-header bgclass="d-bgc-contrast">
  <table class="d-table dialtone-doc-table d-table--inverted d-table--striped">
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
</code-well-header>

```html
<table class="d-table d-table--inverted d-table--striped">
  <caption class="d-table__caption">...</caption>
  <thead>
    <tr>
      <th scope="col">...</th>
      <th scope="col">...</th>
      <th scope="col">...</th>
      <th scope="col">...</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
  </tbody>
</table>
```

## Classes

<component-class-table component-name="table" />

## Accessibility

Use the `caption` element to describe a table in the same way you would use a heading. A caption helps users find, navigate and understand tables.

We provide `.d-table__caption` for a basic caption style, but you can also use utility classes to apply custom styles as needed.

<script setup>
  import { examples } from '@data/table.json';
</script>
