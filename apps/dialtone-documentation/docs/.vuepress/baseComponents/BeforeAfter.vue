<template>
  <div class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols2 d-my-500">
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
</template>

<script setup>
// Neutral before/after image pair for the visual migration guide. Unlike
// DialtoneUsage this carries no do/don't semantics — both panels are equally
// valid renders of the same scene against two Dialtone versions.
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
    default: 'Before — current Dialtone',
  },
  afterLabel: {
    type: String,
    default: 'After — Dialtone Next',
  },
});
</script>
