<template>
  <dt-filter-pill
    :model-value="$attrs.modelValue"
    :use-dropdown="$attrs.useDropdown"
    :start-tooltip-text="$attrs.startTooltipText"
    :disabled="$attrs.disabled"
    :label="$attrs.label"
    :end-tooltip-text="$attrs.endTooltipText"
    :popover-append-to="$attrs.popoverAppendTo"
    :popover-fallback-placements="$attrs.popoverFallbackPlacements"
    :popover-max-height="$attrs.popoverMaxHeight"
    :popover-max-width="$attrs.popoverMaxWidth"
    :popover-padding="$attrs.popoverPadding"
    :popover-placement="$attrs.popoverPlacement"
    :popover-content-class="$attrs.popoverContentClass"
    :popover-header-class="$attrs.popoverHeaderClass"
    :popover-footer-class="$attrs.popoverFooterClass"
    :popover-dialog-class="$attrs.popoverDialogClass"
    :dropdown-list-class="$attrs.dropdownListClass"
    :show-clear="$attrs.showClear"
    :defer-selection="$attrs.deferSelection"
    :read-only="$attrs.readOnly"
    :size="$attrs.size"
    @clear="$attrs.onClear"
    @open="$attrs.onOpen"
    @apply="$attrs.onApply"
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
