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
      class="d-blr-pill d-bgc-black-200 d-w100p d-wmx64"
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
      class="d-brr-pill d-bgc-purple-200 d-w100p d-wmx64"
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
          class="d-wmx50p"
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
</style>
