<template>
  <table class="d-table dialtone-doc-table d-fc-primary">
    <thead>
      <tr>
        <th class="d-w25p" scope="col">
          Class
        </th>
        <th scope="col">
          Output
        </th>
      </tr>
    </thead>
    <slot name="content" />
  </table>
</template>

<script>
export default {
  name: 'UtilityClassTable',
};
</script>
