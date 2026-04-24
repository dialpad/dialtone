<template>
  <dt-banner
    v-if="isVisible"
    kind="info"
    :important="false"
    title="Dialtone Next: Migration Guide Available"
    @close="dismiss"
  >
    <template #icon>
      <dt-icon name="rocket" />
    </template>
    <dt-stack direction="row" gap="100" align="center">
      <dt-text :size="200">
        The next major version of Dialtone includes breaking changes.
        Review the migration guide for step-by-step instructions and automated tooling.
      </dt-text>
      <router-link
        to="/guides/migration/"
        class="d-link d-link--primary d-fw-semibold d-ws-nowrap"
      >
        View Migration Guide
      </router-link>
    </dt-stack>
  </dt-banner>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const STORAGE_KEY = 'dt-migration-banner-dismissed';
const isVisible = ref(false);

onMounted(() => {
  try {
    isVisible.value = localStorage.getItem(STORAGE_KEY) !== 'true';
  } catch {
    isVisible.value = true;
  }
});

function dismiss () {
  isVisible.value = false;
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // localStorage unavailable — banner stays dismissed for this session only
  }
}
</script>
