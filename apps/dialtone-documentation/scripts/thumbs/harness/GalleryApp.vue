<template>
  <dt-stack gap="300">
    <dt-stack direction="row" gap="200" align="center" justify="space-between">
      <dt-box inline-size="500">
        <dt-text as="h1" kind="headline" size="600">
          Component Thumbs
        </dt-text>
      </dt-box>
      <dt-box>
        <dt-segmented-control
          :model-value="mode"
          aria-label="Color mode"
          size="300"
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
      </dt-box>
      <dt-box inline-size="500">
        <dt-stack direction="row" gap="200" align="center" justify="end">
          <dt-text v-if="modifiedSlugs.size > 0" kind="body" size="200" tone="info">
            {{ modifiedSlugs.size }} modified
          </dt-text>
          <dt-split-button
            :disabled="regenerating"
            :start-disabled="!dirty"
            :start-loading="regenerating"
            @start-clicked="onRegenerate(false)"
          >
            Regenerate thumbs
            <template #dropdownList="{ close }">
              <dt-list-item
                role="menuitem"
                navigation-type="arrow-keys"
                @click="close(); onRegenerate(true)"
              >
                Regenerate all {{ slugCount }} thumbs
              </dt-list-item>
            </template>
          </dt-split-button>
        </dt-stack>
      </dt-box>
    </dt-stack>
    <div class="thumb-gallery">
      <dt-link
        v-for="cell in cells"
        :key="cell.slug"
        :href="cell.href"
        :underline="false"
        class="d-d-block h:d-td-none"
        @click.prevent.exact="openSlug = cell.slug"
      >
        <dt-stack gap="100">
          <dt-box
            :border-color="modifiedSlugs.has(cell.slug) ? 'focus' : 'subtle'"
            :border-width="modifiedSlugs.has(cell.slug) ? '300' : '100'"
            surface="secondary"
            class="h:d-bc-default"
          >
            <img class="d-d-block d-w100p" :src="`${cell.src}?v=${cacheBust}`" :alt="cell.slug" loading="lazy">
          </dt-box>
          <dt-stack direction="row" gap="100" justify="space-between" align="baseline">
            <dt-text as="p" kind="label" size="400" tone="tertiary">
              {{ cell.slug }}
            </dt-text>
            <dt-badge v-if="cell.hasOverride" text="override" />
          </dt-stack>
        </dt-stack>
      </dt-link>
    </div>
    <dt-modal
      :open="openSlug !== null"
      @update:open="(v) => { if (!v) openSlug = null }"
    >
      <template #header>
        <dt-stack direction="row" gap="100" align="baseline" justify="space-between">
          {{ openSlug || '' }}
          <dt-badge v-if="openSlug && modifiedSlugs.has(openSlug)" text="Modified" type="info" />
        </dt-stack>
      </template>
      <dt-box padding-block="400">
        <iframe
          v-if="modalCell"
          class="d-d-block d-baw0 d-mx-auto"
          :src="modalCell.href"
          :title="modalCell.slug"
          width="400"
          height="225"
        />
      </dt-box>
    </dt-modal>
    <dt-modal
      :open="progress.open"
      :show-close="progressSettled"
      :close-on-click="progressSettled"
      header-text="Regenerating thumbnails"
      @update:open="(v) => { if (!v && !progressSettled) return; progress.open = v }"
    >
      <dt-box padding="300">
        <dt-stack gap="200" align="center">
          <dt-icon-check-circle
            v-if="progress.complete"
            size="600"
            class="d-fc-positive"
          />
          <dt-icon v-else-if="progress.failed" name="alert-circle" size="600" class="d-fc-critical" />
          <dt-loader
            v-else
            aria-label="Regenerating thumbnails"
            size="600"
          />
          <dt-text v-if="!progressSettled && progress.total > 0" as="p" numeric>
            {{ progress.current }} of {{ progress.total }}
          </dt-text>
          <dt-text v-if="progress.complete" as="p">
            {{ progress.total }} components processed, check your git status to see what changed.
          </dt-text>
          <dt-text v-if="progress.failed" as="p" tone="critical">
            Regen failed — check the dev server terminal for details.
          </dt-text>
        </dt-stack>
      </dt-box>
    </dt-modal>
  </dt-stack>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useModifiedSlugs, useRegenProgress } from './composables.js';

const props = defineProps({
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

const { modifiedSlugs, dirty } = useModifiedSlugs();
const { progress, settled: progressSettled, openProgress } = useRegenProgress();

const openSlug = ref(null);
const modalCell = computed(() =>
  openSlug.value ? props.cells.find(c => c.slug === openSlug.value) : null,
);

async function onRegenerate (all = false) {
  if (all) openProgress();
  regenerating.value = true;
  try {
    const res = await fetch(`/__regenerate${all ? '?all=1' : ''}`, { method: 'POST' });
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
