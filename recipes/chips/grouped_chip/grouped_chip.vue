<template>
  <div
    data-qa="grouped-chip"
    class="d-d-inline-flex d-ws-nowrap d-bgc-unset"
  >
    <dt-chip
      :hide-close="true"
      :interactive="false"
      content-class="d-fs100"
      size="xs"
      :grouped-chip="true"
      class="d-blr-pill d-bgc-moderate-opaque d-wmx84 dt-chip-content"
    >
      <template
        v-if="hasSlotContent($slots.leftIcon)"
        #icon
      >
        <!-- @slot Slot for left chip icon information -->
        <div
          v-if="hasSlotContent($slots.leftIcon)"
          data-qa="left-grouped-chip-icon"
        >
          <slot name="leftIcon" />
        </div>
      </template>
      <template #default>
        <div
          v-if="hasSlotContent($slots.leftContent)"
          data-qa="left-grouped-chip-content"
        >
          <!-- @slot Slot for left chip content information -->
          <slot name="leftContent" />
        </div>
      </template>
    </dt-chip>

    <!-- Right side split chip -->
    <dt-chip
      :hide-close="true"
      :interactive="false"
      content-class="d-fs100"
      size="xs"
      :grouped-chip="true"
      class="d-brr-pill d-bgc-purple-200 d-wmx84 dt-chip-content"
    >
      <template #icon>
        <div
          v-if="hasSlotContent($slots.rightIcon)"
          data-qa="right-grouped-chip-icon"
        >
          <!-- @slot Slot for right chip content information -->
          <slot name="rightIcon" />
        </div>
      </template>
      <template #default>
        <div
          v-if="hasSlotContent($slots.rightContent)"
          data-qa="right-grouped-chip-content"
        >
          <!-- @slot Slot for right chip content information -->
          <slot name="rightContent" />
        </div>
      </template>
    </dt-chip>
  </div>
</template>

<script>
import { DtChip } from '@/components/chip';
import { hasSlotContent } from '@/common/utils';

export default {
  name: 'DtRecipeGroupedChip',

  components: {
    DtChip,
  },

  data () {
    return {
      hasSlotContent,
    };
  },
};
</script>

<style lang="less">
.dt-chip-content {
  font-variant-numeric: tabular-nums;
}
</style>
