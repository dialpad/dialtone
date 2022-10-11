<template>
  <dt-recipe-grouped-chip>
    <!-- Left hand Chip -->
    <template
      v-if="leftIcon"
      slot="leftIcon"
    >
      <component :is="leftIcon" />
    </template>
    <template #leftContent>
      <span v-html="leftContent" />
    </template>
    <!-- Right hand Chip -->
    <template
      v-if="rightIcon"
      slot="rightIcon"
    >
      <component :is="rightIcon" />
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
import DtRecipeGroupedChip from './grouped_chip';
import icon from '@/common/mixins/icon';

export default {
  name: 'DtRecipeGroupedChipDefault',
  components: {
    DtRecipeGroupedChip,
  },

  mixins: [icon],
};
</script>
