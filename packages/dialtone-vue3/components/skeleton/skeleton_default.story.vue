<template>
  <dt-skeleton
    :key="key"
    :paragraph-option="$attrs.paragraphOption"
    :list-item-option="$attrs.listItemOption"
    :text-option="$attrs.textOption"
    :shape-option="$attrs.shapeOption"
    :animation-duration="$attrs.animationDuration"
    :aria-label="$attrs.ariaLabel"
    :animate="$attrs.animate"
    :offset="$attrs.offset"
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
