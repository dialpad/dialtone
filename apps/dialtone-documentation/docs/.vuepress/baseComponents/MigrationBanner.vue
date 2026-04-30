<template>
  <dt-banner
    v-if="shouldShow"
    kind="info"
    class="d-ps-relative d-zi-base"
    @close="sessionDismiss"
  >
    <template #icon>
      <dt-icon name="rocket" />
    </template>
    Dialtone's next major version includes breaking changes.
    The
    <dt-link to="/guides/migration/">
      Migration Guide
    </dt-link>
    includes step by step instructions and automated tooling.
    <template #action>
      <dt-button
        kind="muted"
        importance="clear"
        size="200"
        label-class="d-tw-nowrap"
        @click="permanentDismiss"
      >
        Don't show again
      </dt-button>
    </template>
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
