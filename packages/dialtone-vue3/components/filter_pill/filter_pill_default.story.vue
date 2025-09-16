<template>
  <dt-filter-pill
    v-model:active="isActive"
    :active-filter-count="$attrs.activeFilterCount"
    :alpha-tooltip-text="$attrs.alphaTooltipText"
    :show-clear="$attrs.showClear"
    :disabled="$attrs.disabled"
    :label="$attrs.label"
    :loading="$attrs.loading"
    :omega-tooltip-text="$attrs.omegaTooltipText"
    :popover-append-to="$attrs.popoverAppendTo"
    :popover-fallback-placements="$attrs.popoverFallbackPlacements"
    :popover-max-height="$attrs.popoverMaxHeight"
    :popover-max-width="$attrs.popoverMaxWidth"
    :popover-padding="$attrs.popoverPadding"
    :popover-placement="$attrs.popoverPlacement"
    :size="$attrs.size"
    @clear="$attrs.onClear"
    @open="$attrs.onOpen"
  >
    <template v-if="defaultSlot">
      <span v-html="defaultSlot" />
    </template>
    <template
      v-if="$attrs.content"
      #content
    >
      <span v-html="$attrs.content" />
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
