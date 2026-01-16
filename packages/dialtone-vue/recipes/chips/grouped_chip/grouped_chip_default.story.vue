<template>
  <dt-recipe-grouped-chip>
    <!-- Left hand Chip -->
    <template
      v-if="$attrs.leftIcon"
      #leftIcon
    >
      <dt-icon
        :name="$attrs.leftIcon"
        size="200"
      />
    </template>
    <template #leftContent>
      <span v-html="$attrs.leftContent" />
    </template>
    <!-- Right hand Chip -->
    <template
      v-if="$attrs.rightIcon"
      #rightIcon
    >
      <dt-icon
        :name="$attrs.rightIcon"
        size="200"
      />
    </template>
    <template
      v-if="$attrs.rightContent"
      #rightContent
    >
      <span v-html="$attrs.rightContent" />
    </template>
  </dt-recipe-grouped-chip>
</template>

<script>
import DtRecipeGroupedChip from './grouped_chip.vue';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeGroupedChipDefault',
  components: {
    DtRecipeGroupedChip,
    DtIcon,
  },
};
</script>
