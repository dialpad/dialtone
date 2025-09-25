<template>
  <dt-filter-pill
    :value="$attrs.value"
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
    @update:value="$attrs.onUpdateValue"
  >
    <template v-if="$attrs.default">
      {{ $attrs.default }}
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
