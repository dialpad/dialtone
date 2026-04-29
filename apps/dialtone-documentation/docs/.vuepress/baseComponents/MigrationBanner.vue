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
      <dt-box class="d-pie-100">
        <dt-button
          link
          link-kind="muted"
          @click="permanentDismiss"
        >
          <dt-text kind="body" size="100">
            Don't&nbsp;show&nbsp;again
          </dt-text>
        </dt-button>
      </dt-box>
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
