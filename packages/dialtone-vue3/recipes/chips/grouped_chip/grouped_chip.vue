<template>
  <div
    data-qa="grouped-chip"
    class="d-recipe-grouped-chip"
  >
    <dt-chip
      :hide-close="true"
      :interactive="false"
      content-class="d-fs100"
      size="xs"
      :grouped-chip="true"
      class="d-recipe-grouped-chip__content d-recipe-grouped-chip__content-left"
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
      class="d-recipe-grouped-chip__content d-recipe-grouped-chip__content-right"
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
