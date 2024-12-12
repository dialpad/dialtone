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
        v-if="$slots.leftIcon"
        #icon
      >
        <!-- @slot Slot for left chip icon information -->
        <div
          v-if="$slots.leftIcon"
          data-qa="left-grouped-chip-icon"
        >
          <slot name="leftIcon" />
        </div>
      </template>
      <template #default>
        <div
          v-if="$slots.leftContent"
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
          v-if="$slots.rightIcon"
          data-qa="right-grouped-chip-icon"
        >
          <!-- @slot Slot for right chip content information -->
          <slot name="rightIcon" />
        </div>
      </template>
      <template #default>
        <div
          v-if="$slots.rightContent"
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

export default {
  name: 'DtRecipeGroupedChip',

  components: {
    DtChip,
  },

  computed: {},
};
</script>
