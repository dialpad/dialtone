<template>
  <div class="dialtone-header dialtone-header--home d-bgc-primary d-bgo90 d-m-auto">
    <router-link
      class="d-pl8"
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
.dialtone-header {
  &--home {
    --position-top: 16px;

    max-width: 1400px;
    box-shadow: var(--dt-shadow-card);
    box-shadow: 0 255.043px 71.487px 0 rgba(0, 0, 0, 0.00), 0 163.131px 65.306px 0 rgba(0, 0, 0, 0.01), 0 91.912px 55.094px 0 rgba(0, 0, 0, 0.03), 0 40.85px 40.85px 0 rgba(0, 0, 0, 0.05), 0 10.212px 22.306px 0 rgba(0, 0, 0, 0.05);

    border-radius: var(--dt-size-radius-450);
    position: fixed;
    inset: var(--position-top) 16px;
    inset-block-end: auto;

    z-index: 1;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);

    transition: inset cubic-bezier(0.4, 0, 0.2, 1) 0.66s;
    will-change: inset;
  }
  &--off-canvas {
    --position-top: -105%;
  }
}
</style>
