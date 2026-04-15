<template>
  <div
    data-qa="dt-recipe-grouped-chip"
    class="d-recipe-grouped-chip"
  >
    <dt-chip
      :show-close="false"
      :interactive="false"
      :size="100"
      :grouped-chip="true"
      class="d-recipe-grouped-chip__content d-recipe-grouped-chip__content-left"
    >
      <template
        v-if="hasSlotContent($slots.startIcon) || hasSlotContent($slots.leftIcon)"
        #icon
      >
        <div
          v-if="hasSlotContent($slots.startIcon) || hasSlotContent($slots.leftIcon)"
          data-qa="left-grouped-chip-icon"
        >
          <!-- @slot Slot for start chip icon information -->
          <slot
            v-if="$slots.startIcon"
            name="startIcon"
          />
          <!-- @slot @deprecated Use startIcon -->
          <slot
            v-else
            name="leftIcon"
          />
        </div>
      </template>
      <template #default>
        <div
          v-if="hasSlotContent($slots.startContent) || hasSlotContent($slots.leftContent)"
          data-qa="left-grouped-chip-content"
        >
          <!-- @slot Slot for start chip content information -->
          <slot
            v-if="$slots.startContent"
            name="startContent"
          />
          <!-- @slot @deprecated Use startContent -->
          <slot
            v-else
            name="leftContent"
          />
        </div>
      </template>
    </dt-chip>

    <!-- End side split chip -->
    <dt-chip
      :show-close="false"
      :interactive="false"
      :size="100"
      :grouped-chip="true"
      class="d-recipe-grouped-chip__content d-recipe-grouped-chip__content-right"
    >
      <template #icon>
        <div
          v-if="hasSlotContent($slots.endIcon) || hasSlotContent($slots.rightIcon)"
          data-qa="right-grouped-chip-icon"
        >
          <!-- @slot Slot for end chip icon information -->
          <slot
            v-if="$slots.endIcon"
            name="endIcon"
          />
          <!-- @slot @deprecated Use endIcon -->
          <slot
            v-else
            name="rightIcon"
          />
        </div>
      </template>
      <template #default>
        <div
          v-if="hasSlotContent($slots.endContent) || hasSlotContent($slots.rightContent)"
          data-qa="right-grouped-chip-content"
        >
          <!-- @slot Slot for end chip content information -->
          <slot
            v-if="$slots.endContent"
            name="endContent"
          />
          <!-- @slot @deprecated Use endContent -->
          <slot
            v-else
            name="rightContent"
          />
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
