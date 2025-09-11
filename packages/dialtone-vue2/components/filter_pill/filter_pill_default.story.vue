<template>
  <dt-filter-pill
    :active.sync="isActive"
    :active-filter-count="$attrs.activeFilterCount"
    :alpha-tooltip-text="$attrs.alphaTooltipText"
    :append-to="$attrs.appendTo"
    :show-clear="$attrs.showClear"
    :disabled="$attrs.disabled"
    :fallback-placements="$attrs.fallbackPlacements"
    :label="$attrs.label"
    :loading="$attrs.loading"
    :max-height="$attrs.maxHeight"
    :max-width="$attrs.maxWidth"
    :omega-tooltip-text="$attrs.omegaTooltipText"
    :padding="$attrs.padding"
    :placement="$attrs.placement"
    :size="$attrs.size"
    @clear="$attrs.onClear"
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
  data () {
    return {
      isActive: this.$attrs.active,
    }
  },

  watch: {
    $attrs: {
      deep: true,
      immediate: true,
      handler: function (attrs) {
        this.isActive = attrs.active;
      },
    },
  },
};
</script>
