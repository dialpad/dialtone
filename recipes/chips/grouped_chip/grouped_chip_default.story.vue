<template>
  <dt-recipe-grouped-chip>
    <!-- Left hand Chip -->
    <template
      v-if="leftIcon"
      slot="leftIcon"
    >
      <dt-icon
        :name="leftIcon"
        size="200"
      />
    </template>
    <template #leftContent>
      <span v-html="leftContent" />
    </template>
    <!-- Right hand Chip -->
    <template
      v-if="rightIcon"
      slot="rightIcon"
    >
      <dt-icon
        :name="rightIcon"
        size="200"
      />
    </template>
    <template
      v-if="rightContent"
      #rightContent
    >
      <span v-html="rightContent" />
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
