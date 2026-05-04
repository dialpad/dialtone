<template>
  <dt-recipe-grouped-chip>
    <!-- Start hand Chip -->
    <template
      v-if="$attrs.startIcon"
      #startIcon
    >
      <dt-icon
        :name="$attrs.startIcon"
        size="200"
      />
    </template>
    <template #startContent>
      <span v-html="$attrs.startContent" />
    </template>
    <!-- End hand Chip -->
    <template
      v-if="$attrs.endIcon"
      #endIcon
    >
      <dt-icon
        :name="$attrs.endIcon"
        size="200"
      />
    </template>
    <template
      v-if="$attrs.endContent"
      #endContent
    >
      <span v-html="$attrs.endContent" />
    </template>
  </dt-recipe-grouped-chip>
</template>

<script>
import DtRecipeGroupedChip from './GroupedChip.vue';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeGroupedChipDefault',
  components: {
    DtRecipeGroupedChip,
    DtIcon,
  },
};
</script>
