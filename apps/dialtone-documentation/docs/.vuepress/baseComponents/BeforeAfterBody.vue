<template>
  <div>
    <div class="d-d-flex d-jc-space-between d-ai-center d-mbe-200 d-fw-wrap d-g-200">
      <dt-segmented-control
        :model-value="mode"
        aria-label="Comparison mode"
        @update:model-value="$emit('update:mode', $event)"
      >
        <dt-segmented-control-item value="side">
          Side by side
        </dt-segmented-control-item>
        <dt-segmented-control-item value="onion">
          Onion skin
        </dt-segmented-control-item>
      </dt-segmented-control>
      <slot name="actions" />
    </div>

    <div
      v-if="mode === 'side'"
      class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols2"
    >
      <figure class="d-m0">
        <figcaption class="d-fs-100 d-fw-semibold d-fc-secondary d-mbe-200">
          {{ beforeLabel }}
        </figcaption>
        <div class="d-bgc-secondary d-ba d-bc-subtle d-bar-400 d-p-300">
          <img
            :src="before"
            :alt="`${alt} — before migration`"
            class="d-d-block d-w100p"
            loading="lazy"
          >
        </div>
      </figure>
      <figure class="d-m0">
        <figcaption class="d-fs-100 d-fw-semibold d-fc-secondary d-mbe-200">
          {{ afterLabel }}
        </figcaption>
        <div class="d-bgc-secondary d-ba d-bc-subtle d-bar-400 d-p-300">
          <img
            :src="after"
            :alt="`${alt} — after migration`"
            class="d-d-block d-w100p"
            loading="lazy"
          >
        </div>
      </figure>
    </div>

    <div v-else>
      <div class="d-bgc-secondary d-ba d-bc-subtle d-bar-400 d-p-300">
        <div class="before-after-body__stack">
          <img
            :src="before"
            :alt="`${alt} — before migration`"
            loading="lazy"
          >
          <img
            :src="after"
            :alt="`${alt} — after migration`"
            :style="{ opacity: blend / 100 }"
            loading="lazy"
          >
        </div>
      </div>
      <div class="d-d-flex d-ai-center d-g-300 d-mbs-200">
        <span class="d-fs-100 d-fw-semibold d-fc-secondary">{{ beforeLabel }}</span>
        <input
          :value="blend"
          type="range"
          min="0"
          max="100"
          step="1"
          class="before-after-body__slider d-fl1"
          :aria-label="`Blend between before and after: ${blend}% after`"
          @input="$emit('update:blend', Number($event.target.value))"
        >
        <span class="d-fs-100 d-fw-semibold d-fc-secondary">{{ afterLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Presentational half of <before-after>: renders the comparison in
// side-by-side or onion-skin mode. Mode and blend live in the parent so they
// survive expanding into the fullscreen modal.
defineProps({
  before: {
    type: String,
    required: true,
  },
  after: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  beforeLabel: {
    type: String,
    required: true,
  },
  afterLabel: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  blend: {
    type: Number,
    required: true,
  },
});

defineEmits(['update:mode', 'update:blend']);
</script>

<style scoped>
/* Stack both renders in the same grid cell so the wrapper sizes to the
   taller image — no absolute positioning, no clipped overflow. */
.before-after-body__stack {
  display: grid;
}

.before-after-body__stack img {
  grid-area: 1 / 1;
  display: block;
  inline-size: 100%;
  align-self: start;
}

.before-after-body__slider {
  accent-color: var(--dt-color-foreground-primary);
}
</style>
