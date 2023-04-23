<template>
  <dt-skeleton
    :key="key"
    :paragraph-option="paragraphOption"
    :list-item-option="listItemOption"
    :text-option="textOption"
    :shape-option="shapeOption"
    :animation-duration="animationDuration"
    :aria-label="ariaLabel"
    :animate="animate"
    :offset="offset"
  />
</template>

<script>
import DtSkeleton from './skeleton.vue';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'DtSkeletonDefault',
  components: { DtSkeleton },
  data: () => ({
    key: '',
  }),

  watch: {
    $props: {
      deep: true,
      handler: 'updateKey',
    },
  },

  methods: {
    updateKey () {
      this.key = getUniqueString('skeleton-default');
    },
  },
};
</script>
