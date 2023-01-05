<template>
  <li
    aria-hidden="true"
    class="dt-list-separator d-bgc-black-300 d-my4 d-mxn4"
  />
</template>

<script>
export default {
  name: 'DtDropdownSeparator',
};
</script>

<style lang="less">
.dt-list-item[role="menuitem"] {
  border-radius: var(--size-300);
}
.dt-list-separator {
  height: var(--size-100);
  list-style: none;
}
</style>
