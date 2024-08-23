<template>
  <dt-filter-pill
    :active="$attrs.active"
    :disabled="$attrs.disabled"
    :label="$attrs.label"
    :loading="$attrs.loading"
    :loading-skeleton-width="$attrs.loadingSkeletonWidth"
    :show-reset="$attrs.showReset"
    @reset="$attrs.onReset"
    @open="$attrs.onOpen"
  >
    <template #content>
      <span
        v-if="$attrs.content"
        v-html="$attrs.content"
      />
    </template>
  </dt-filter-pill>
</template>

<script>
import DtFilterPill from './filter_pill.vue';

export default {
  name: 'DtFilterPillDefault',
  components: { DtFilterPill },
};
</script>
