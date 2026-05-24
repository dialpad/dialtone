<template>
  <div class="dialtone-header dialtone-header--home d-bgc-default d-bgo90 d-m-auto">
    <router-link
      class="d-pis-100"
      title="Dialtone homepage"
      to="/"
    >
      <dt-stack>
        <dt-illustration name="dialpad-logo" />
      </dt-stack>
    </router-link>
    <navbar @search="handleSearch" />
  </div>
</template>

<script setup>
import Navbar from '../theme/components/Navbar.vue';

// Emit search event to parent
const emit = defineEmits(['search']);

const handleSearch = () => {
  emit('search');
};
</script>

<style lang="less">
</style>
