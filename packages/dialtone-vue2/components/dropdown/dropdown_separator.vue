<template>
  <li
    aria-hidden="true"
    class="dt-list-separator"
  />
</template>

<script>
export default {
  name: 'DtDropdownSeparator',
};
</script>

<style lang="less">
.dt-list-item[role="menuitem"] {
  border-radius: var(--dt-size-300);
}
.dt-list-separator {
  border-top: var(--dt-size-100) solid var(--dt-color-border-default);
  list-style: none;
  margin: var(--dt-space-300) var(--dt-space-300-negative);
}
</style>
