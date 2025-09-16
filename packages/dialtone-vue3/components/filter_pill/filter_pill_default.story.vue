<template>
  <dt-filter-pill
    :model-value="$attrs.filters"
    :alpha-tooltip-text="$attrs.alphaTooltipText"
    :disabled="$attrs.disabled"
    :label="$attrs.label"
    :omega-tooltip-text="$attrs.omegaTooltipText"
    :popover-append-to="$attrs.popoverAppendTo"
    :popover-fallback-placements="$attrs.popoverFallbackPlacements"
    :popover-max-height="$attrs.popoverMaxHeight"
    :popover-max-width="$attrs.popoverMaxWidth"
    :popover-padding="$attrs.popoverPadding"
    :popover-placement="$attrs.popoverPlacement"
    :hide-clear="$attrs.hideClear"
    :size="$attrs.size"
    @clear="$attrs.onClear"
    @open="$attrs.onOpen"
    @update:model-value="$attrs.onUpdateModelValue"
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
};
</script>
