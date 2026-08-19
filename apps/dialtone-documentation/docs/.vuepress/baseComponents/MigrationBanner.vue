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
    Dialtone v10+ includes breaking changes.
    View the
    <dt-link to="/guides/migration/" tone="muted">
      Migration Guide
    </dt-link>.
    <template #action>
      <dt-button
        kind="muted"
        importance="outlined"
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['update:visible']);

const STORAGE_KEY = 'dt-migration-banner-dismissed';
const route = useRoute();
const dismissed = ref(false);
const permanentlyDismissed = ref(false);

const isOnMigrationGuide = computed(() => {
  return route.path.startsWith('/guides/migration/');
});

const shouldShow = computed(() => {
  return props.visible &&
    !dismissed.value &&
    !permanentlyDismissed.value &&
    !isOnMigrationGuide.value;
});

watch(shouldShow, (visible) => {
  emit('update:visible', visible);
}, { immediate: true });

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
