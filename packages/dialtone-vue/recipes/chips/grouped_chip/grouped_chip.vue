<template>
  <div
    data-qa="dt-recipe-grouped-chip"
    class="d-recipe-grouped-chip"
  >
    <dt-chip
      :hide-close="true"
      :interactive="false"
      size="xs"
      :grouped-chip="true"
      class="d-recipe-grouped-chip__content d-recipe-grouped-chip__content-left"
    >
      <template
        v-if="hasSlotContent($slots.startIcon) || hasSlotContent($slots.leftIcon)"
        #icon
      >
        <!-- @slot Slot for start chip icon information -->
        <div
          v-if="hasSlotContent($slots.startIcon) || hasSlotContent($slots.leftIcon)"
          data-qa="left-grouped-chip-icon"
        >
          <slot name="startIcon">
            <!-- @slot @deprecated Use startIcon -->
            <slot name="leftIcon" />
          </slot>
        </div>
      </template>
      <template #default>
        <div
          v-if="hasSlotContent($slots.startContent) || hasSlotContent($slots.leftContent)"
          data-qa="left-grouped-chip-content"
        >
          <!-- @slot Slot for start chip content information -->
          <slot name="startContent">
            <!-- @slot @deprecated Use startContent -->
            <slot name="leftContent" />
          </slot>
        </div>
      </template>
    </dt-chip>

    <!-- End side split chip -->
    <dt-chip
      :hide-close="true"
      :interactive="false"
      size="xs"
      :grouped-chip="true"
      class="d-recipe-grouped-chip__content d-recipe-grouped-chip__content-right"
    >
      <template #icon>
        <div
          v-if="hasSlotContent($slots.endIcon) || hasSlotContent($slots.rightIcon)"
          data-qa="right-grouped-chip-icon"
        >
          <!-- @slot Slot for end chip icon information -->
          <slot name="endIcon">
            <!-- @slot @deprecated Use endIcon -->
            <slot name="rightIcon" />
          </slot>
        </div>
      </template>
      <template #default>
        <div
          v-if="hasSlotContent($slots.endContent) || hasSlotContent($slots.rightContent)"
          data-qa="right-grouped-chip-content"
        >
          <!-- @slot Slot for end chip content information -->
          <slot name="endContent">
            <!-- @slot @deprecated Use endContent -->
            <slot name="rightContent" />
          </slot>
        </div>
      </template>
    </dt-chip>
  </div>
</template>

<script>
import { DtChip } from '@/components/chip';
import { hasSlotContent } from '@/common/utils';

export default {
  compatConfig: { MODE: 3 },
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
