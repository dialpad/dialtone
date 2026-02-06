<template>
  <div class="dialpad-layout">
    <dt-root-layout
      class="d-h100p d-hmn-auto"
      sidebar-class="dialpad-leftbar"
    >
      <template #sidebar>
        <slot name="leftbar" />
      </template>
    </dt-root-layout>
  </div>
</template>

<script setup>
import { DtRootLayout } from '@/components/root_layout';
</script>

<style lang="less">
:root {
  --dialpad-sidebar-width: 284px;
  --dialpad-sidebar-background-color: #F9F9F9;
}
.dialpad-layout {
  height: calc(100vh - 2rem);
  padding: var(--dt-space-500);
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-border-radius-sm);
}

.dialpad-leftbar {
  padding: var(--dt-space-400);
  width: var(--dialpad-sidebar-width);
  background: var(--dt-color-surface-primary);
}
</style>
