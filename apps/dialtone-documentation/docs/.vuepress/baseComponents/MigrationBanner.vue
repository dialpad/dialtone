<template>
  <dt-banner
    v-if="shouldShow"
    kind="info"
    :important="false"
    title="Dialtone Next: Migration Guide Available"
    @close="sessionDismiss"
  >
    <template #icon>
      <dt-icon name="rocket" />
    </template>
    <dt-stack direction="row" gap="200" align="center">
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
      <button
        class="d-link d-link--muted d-fw-semibold d-ws-nowrap"
        @click="permanentDismiss"
      >
        Don't show again
      </button>
    </dt-stack>
  </dt-banner>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const STORAGE_KEY = 'dt-migration-banner-dismissed';
const route = useRoute();
const dismissed = ref(false);
const permanentlyDismissed = ref(false);

const isOnMigrationGuide = computed(() => {
  return route.path.startsWith('/guides/migration/');
});

const shouldShow = computed(() => {
  return !dismissed.value && !permanentlyDismissed.value && !isOnMigrationGuide.value;
});

onMounted(() => {
  try {
    permanentlyDismissed.value = localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    // localStorage unavailable
  }
});

function sessionDismiss () {
  dismissed.value = true;
}

function permanentDismiss () {
  permanentlyDismissed.value = true;
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // localStorage unavailable
  }
}
</script>
