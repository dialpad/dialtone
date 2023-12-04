<template>
  <div
    data-qa="grouped-chip"
    class="dt-grouped-chip"
  >
    <dt-chip
      :hide-close="true"
      :interactive="false"
      content-class="d-fs100"
      size="xs"
      :grouped-chip="true"
      class="dt-chip-content dt-chip-content--left"
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
      class="dt-chip-content dt-chip-content--right"
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

<style lang="less">
.dt-grouped-chip {
  display: inline-flex;
  white-space: nowrap;
  background-color: unset;
  background-image: unset;
}

.dt-chip-content {
  font-variant-numeric: tabular-nums;

  &--left {
    border-top-left-radius: var(--dt-size-radius-pill);
    border-bottom-left-radius: var(--dt-size-radius-pill);
    background-color: var(--dt-color-surface-moderate-opaque);
    max-width: var(--dt-size-730);
  }

  &--right {
    border-top-right-radius: var(--dt-size-radius-pill);
    border-bottom-right-radius: var(--dt-size-radius-pill);
    background-color: var(--dt-color-purple-200);
    max-width: var(--dt-size-730);
  }
}
</style>
