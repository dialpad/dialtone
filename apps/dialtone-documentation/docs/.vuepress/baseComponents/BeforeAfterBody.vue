<template>
  <div>
    <dt-stack
      direction="row"
      gap="200"
      align="center"
      justify="space-between"
      class="d-mbe-200 d-fw-wrap"
    >
      <dt-segmented-control
        :model-value="mode"
        aria-label="Comparison mode"
        @update:model-value="$emit('update:mode', $event)"
      >
        <dt-segmented-control-item value="side">
          Side by side
        </dt-segmented-control-item>
        <dt-segmented-control-item value="split">
          Split
        </dt-segmented-control-item>
        <dt-segmented-control-item value="onion">
          Onion skin
        </dt-segmented-control-item>
      </dt-segmented-control>
      <slot name="actions" />
    </dt-stack>

    <div
      v-if="mode === 'side'"
      class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols2"
    >
      <dt-box
        as="figure"
        class="d-m0"
      >
        <figcaption class="d-fs-100 d-fw-semibold d-fc-secondary d-mbe-200">
          {{ beforeLabel }}
        </figcaption>
        <dt-box
          surface="primary"
          border-width="100"
          border-color="subtle"
          border-radius="400"
          padding="300"
        >
          <img
            :src="withBase(before)"
            :alt="`${alt} — before migration`"
            class="d-d-block d-w100p"
            loading="lazy"
          >
        </dt-box>
      </dt-box>
      <dt-box
        as="figure"
        class="d-m0"
      >
        <figcaption class="d-fs-100 d-fw-semibold d-fc-secondary d-mbe-200">
          {{ afterLabel }}
        </figcaption>
        <dt-box
          surface="primary"
          border-width="100"
          border-color="subtle"
          border-radius="400"
          padding="300"
        >
          <img
            :src="withBase(after)"
            :alt="`${alt} — after migration`"
            class="d-d-block d-w100p"
            loading="lazy"
          >
        </dt-box>
      </dt-box>
    </div>

    <div v-else-if="mode === 'split'">
      <dt-box
        surface="primary"
        border-width="100"
        border-color="subtle"
        border-radius="400"
        padding="300"
      >
        <dt-box position="relative">
          <div class="before-after-body__stack">
            <img
              :src="withBase(before)"
              :alt="`${alt} — before migration`"
              loading="lazy"
            >
            <img
              :src="withBase(after)"
              :alt="`${alt} — after migration`"
              :style="{ clipPath: `inset(0 0 0 ${split}%)` }"
              loading="lazy"
            >
          </div>
          <div
            class="before-after-body__divider"
            :style="{ insetInlineStart: `${split}%` }"
            aria-hidden="true"
          >
            <span class="before-after-body__grip">
              <dt-icon
                name="grip-vertical"
                size="200"
              />
            </span>
          </div>
          <input
            :value="split"
            type="range"
            min="0"
            max="100"
            step="1"
            class="before-after-body__wipe-input"
            :aria-label="`Split position: before shows left of ${split}%, after to the right`"
            @input="$emit('update:split', Number($event.target.value))"
          >
        </dt-box>
      </dt-box>
      <dt-stack
        direction="row"
        justify="space-between"
        class="d-mbs-200"
      >
        <span class="d-fs-100 d-fw-semibold d-fc-secondary">{{ beforeLabel }}</span>
        <span class="d-fs-100 d-fw-semibold d-fc-secondary">{{ afterLabel }}</span>
      </dt-stack>
    </div>

    <div v-else>
      <dt-box
        surface="primary"
        border-width="100"
        border-color="subtle"
        border-radius="400"
        padding="300"
      >
        <div class="before-after-body__stack">
          <img
            :src="withBase(before)"
            :alt="`${alt} — before migration`"
            loading="lazy"
          >
          <img
            :src="withBase(after)"
            :alt="`${alt} — after migration`"
            :style="{ opacity: blend / 100 }"
            loading="lazy"
          >
        </div>
      </dt-box>
      <dt-stack
        direction="row"
        gap="300"
        align="center"
        class="d-mbs-200"
      >
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
      </dt-stack>
    </div>
  </div>
</template>

<script setup>
import { withBase } from 'vuepress/client';

// Presentational half of <before-after>: renders the comparison side-by-side,
// as a split wipe (draggable divider — before left, after right), or as an
// onion-skin blend. Mode, split, and blend live in the parent so they survive
// expanding into the fullscreen modal.
// Image srcs are passed through withBase(): the site deploys under a
// subpath (VUEPRESS_BASE_URL, e.g. /next/ and deploy previews), and VuePress
// only auto-rewrites markdown ![]() images — not component props.
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
  split: {
    type: Number,
    required: true,
  },
});

defineEmits(['update:mode', 'update:blend', 'update:split']);
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

.before-after-body__divider {
  position: absolute;
  inset-block: 0;
  inline-size: 2px;
  margin-inline-start: -1px;
  background: var(--dt-color-surface-primary);
  box-shadow: 0 0 0 1px var(--dt-color-border-subtle);
}

.before-after-body__grip {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 28px;
  block-size: 36px;
  border-radius: 8px;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  color: var(--dt-color-foreground-secondary);
}

/* Invisible full-area range input: native drag/tap/keyboard drives the wipe. */
.before-after-body__wipe-input {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  opacity: 0;
  cursor: ew-resize;
}
</style>
