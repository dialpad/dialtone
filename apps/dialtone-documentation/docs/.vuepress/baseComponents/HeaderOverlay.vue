<template>
  <div class="dialtone-header dialtone-header--home d-bgc-primary d-bgo90 d-m-auto">
    <router-link
      class="d-pis-100"
      title="Dialtone homepage"
      to="/"
    >
      <dt-stack>
        <dt-illustration name="dialpad-logo" />
      </dt-stack>
    </router-link>
    <navbar />
  </div>
</template>

<script setup>
import Navbar from '../theme/components/Navbar.vue';
</script>

<style lang="less">
</style>
