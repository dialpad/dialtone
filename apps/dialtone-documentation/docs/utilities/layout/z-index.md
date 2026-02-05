---
title: Z-Index
description: Utility classes for setting an element's z-index level.
---

## Classes

Set an element's z-index by using a class (`.d-zi-{level}`>). These classes match up with the variables names listed above. The table below lists the available z-index levels, class names, and the CSS output.

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ name, output } in zIndex">
        <th scope="row" class="d-code--sm d-docsite-code">.d-zi-{{ name }}</th>
        <td class="d-code--sm">z-index: {{ output }};</td>
      </tr>
    </tbody>
   </template>
</utility-class-table>

<script setup>
  import zIndex from '@data/z-index.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>

## Variables

When writing Less, you can set an element's z-index by using a variable (`var(--zi-{name})`). The table below lists the available variables, output, and a description for when they should be used.

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w25p"><div class="d-p16 d-bb d-bbw1">Variable</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bbw1">Output</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bbw1">Description</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ name, description, output } in zIndex">
          <th scope="row" class="d-code--sm d-docsite-code d-fw-normal">var(--zi-{{ name }})</th>
          <td class="d-code--sm">{{ output }}</td>
          <td class="dialtone-table--sans">{{ description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
