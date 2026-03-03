<template>
  <dt-stack
    direction="row"
    gap="500"
    align="center"
  >
    <dt-stack
      v-for="v in [0, 25, 50, 75, 100]"
      :key="v"
      gap="200"
      align="center"
    >
      <span class="d-fs-100">{{ v }}%</span>
      <dt-progress
        :progress="v"
        :aria-label="`${v}% complete`"
      />
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtProgress from './progress.vue';
import { DtStack } from '@/components/stack';
export default { name: 'DtProgressVariants', components: { DtProgress, DtStack } };
</script>
