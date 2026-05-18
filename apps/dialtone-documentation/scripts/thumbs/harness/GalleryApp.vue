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
            <template #dropdownList>
              <dt-list-item
                role="menuitem"
                navigation-type="arrow-keys"
                @click="onRegenerate(true)"
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
      :open="progressOpen"
      :show-close="progressSettled"
      :close-on-click="progressSettled"
      header-text="Regenerating thumbnails"
      @update:open="(v) => { if (!v && !progressSettled) return; progressOpen = v }"
    >
      <dt-box padding="300">
        <dt-stack gap="200" align="center">
          <dt-icon-check-circle
            v-if="progressComplete"
            size="600"
            class="d-fc-positive"
          />
          <dt-icon v-else-if="progressFailed" name="alert-circle" size="600" class="d-fc-critical" />
          <dt-loader
            v-else
            aria-label="Regenerating thumbnails"
            size="600"
          />
          <dt-text v-if="!progressSettled && progressTotal > 0" as="p" numeric>
            {{ progressCurrent }} of {{ progressTotal }}
          </dt-text>
          <dt-text v-if="progressComplete" as="p">
            {{ progressTotal }} components processed, check your git status to see what changed.
          </dt-text>
          <dt-text v-if="progressFailed" as="p" tone="critical">
            Regen failed — check the dev server terminal for details.
          </dt-text>
        </dt-stack>
      </dt-box>
    </dt-modal>
  </dt-stack>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';


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

// Progress modal state for "Regenerate all". Non-closeable during regen;
// becomes user-closeable on completion (progressComplete flips to true).
const progressOpen = ref(false);
const progressCurrent = ref(0);
const progressTotal = ref(0);
const progressComplete = ref(false);
const progressFailed = ref(false);
const progressSettled = computed(() => progressComplete.value || progressFailed.value);

const openSlug = ref(null);
const modalCell = computed(() =>
  openSlug.value ? props.cells.find(c => c.slug === openSlug.value) : null,
);

// Set of override slugs whose source file has changed since the last regen,
// as reported by the dev-server's `thumb-regen` plugin. Bootstrapped on mount
// (HMR-on listeners only fire for events received after subscription).
const modifiedSlugs = ref(new Set());
const dirty = computed(() => modifiedSlugs.value.size > 0);

onMounted(async () => {
  try {
    const res = await fetch('/__regen-status');
    if (res.ok) {
      const data = await res.json();
      modifiedSlugs.value = new Set(data.slugs || []);
    }
  } catch { /* dev-server-only feature; ignore in any other context */ }
});

if (import.meta.hot) {
  import.meta.hot.on('regen:dirty', (data) => {
    modifiedSlugs.value = new Set(data?.slugs || []);
  });
  import.meta.hot.on('regen:clean', () => {
    modifiedSlugs.value = new Set();
  });
  import.meta.hot.on('regen:progress', (data) => {
    progressCurrent.value = data?.current ?? 0;
    progressTotal.value = data?.total ?? 0;
  });
  import.meta.hot.on('regen:complete', (data) => {
    progressTotal.value = data?.total ?? 0;
    if (data?.ok === false) progressFailed.value = true;
    else progressComplete.value = true;
  });
}

async function onRegenerate (all = false) {
  if (all) {
    document.body.click(); // close the split-button dropdown
    progressCurrent.value = 0;
    progressTotal.value = 0;
    progressComplete.value = false;
    progressFailed.value = false;
    progressOpen.value = true;
  }
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
