<template>
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th
          class="d-w25p d-fc-primary"
          scope="col"
        >
          Class
        </th>
        <th
          class="d-fc-primary"
          scope="col"
        >
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

<style scoped>

</style>
