<template>
  <dt-stack gap="300">
    <dt-stack gap="100">
      <dt-stack direction="row" gap="200" align="center">
        <dt-text as="h1" kind="headline" size="500">
          Thumb Gallery
        </dt-text>
        <dt-segmented-control
          :model-value="mode"
          aria-label="Color mode"
          @update:model-value="onModeChange"
        >
          <dt-segmented-control-item value="light">
            Light
            <template #startIcon="{ iconSize }">
              <dt-icon name="sun" :size="iconSize" />
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item value="dark">
            Dark
            <template #startIcon="{ iconSize }">
              <dt-icon name="moon" :size="iconSize" />
            </template>
          </dt-segmented-control-item>
        </dt-segmented-control>
        <dt-button
          importance="outlined"
          :loading="regenerating"
          @click="onRegenerate"
        >
          Regenerate
        </dt-button>
      </dt-stack>
      <dt-text as="p" kind="body" size="200">
        {{ slugCount }} components
      </dt-text>
    </dt-stack>
    <div class="thumb-gallery">
      <dt-link
        v-for="cell in cells"
        :key="cell.slug"
        :href="cell.href"
        :underline="false"
        class="d-d-block h:d-td-none"
      >
        <dt-stack gap="100">
          <dt-box
            border-width="100"
            border-color="subtle"
            surface="secondary"
            class="h:d-bc-default"
          >
            <img class="d-d-block d-w100p" :src="`${cell.src}?v=${cacheBust}`" :alt="cell.slug" loading="lazy">
          </dt-box>
          <dt-stack direction="row" gap="100" justify="space-between" align="baseline">
            <dt-text as="p" kind="label" size="400" tone="tertiary">
              {{ cell.slug }}
            </dt-text>
            <dt-badge v-if="cell.hasOverride" text="override" type="info" />
          </dt-stack>
        </dt-stack>
      </dt-link>
    </div>
  </dt-stack>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  cells: { type: Array, required: true },
  mode: { type: String, required: true },
  slugCount: { type: Number, required: true },
});

const emit = defineEmits(['update:mode']);

function onModeChange (newMode) {
  emit('update:mode', newMode);
}

// Bumped after a successful regen to bust the browser cache for image srcs
// (same URL, new bytes on disk) so the gallery shows the freshly written PNGs.
const cacheBust = ref(0);
const regenerating = ref(false);

async function onRegenerate () {
  regenerating.value = true;
  try {
    const res = await fetch('/__regenerate', { method: 'POST' });
    if (res.ok) cacheBust.value++;
  } finally {
    regenerating.value = false;
  }
}
</script>

<style scoped>
.thumb-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(264px, 1fr));
  gap: var(--dt-spacing-300);
}
</style>
