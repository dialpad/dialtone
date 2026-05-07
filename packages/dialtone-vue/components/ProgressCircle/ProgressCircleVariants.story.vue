<template>
  <dt-stack
    direction="column"
    gap="200"
  >
    <dt-stack>
      <h4>Value</h4>
      <dt-stack
        direction="row"
        gap="200"
        align="center"
      >
        <dt-stack
          v-for="v in [0, 25, 50, 75, 100]"
          :key="v"
          gap="50"
          align="center"
        >
          <span class="d-code--sm">{{ v }}%</span>
          <dt-progress-circle
            :progress="v"
            :aria-label="`${v}% complete`"
          />
        </dt-stack>
      </dt-stack>
    </dt-stack>
    <dt-stack>
      <h4>Size</h4>
      <dt-stack
        direction="row"
        gap="200"
        align="start"
      >
        <dt-stack
          v-for="size in Object.keys(PROGRESS_CIRCLE_SIZES)"
          :key="size"
          gap="50"
          align="center"
        >
          <span class="d-code--sm">{{ size }}</span>
          <dt-progress-circle
            :size="size"
            :progress="66"
            :aria-label="`size ${size}`"
          />
        </dt-stack>
      </dt-stack>
    </dt-stack>
    <dt-stack>
      <h4>Kind</h4>
      <dt-stack
        direction="row"
        gap="200"
        align="center"
      >
        <dt-stack
          v-for="kind in Object.keys(PROGRESS_CIRCLE_KINDS)"
          :key="kind"
          gap="50"
          align="center"
        >
          <span class="d-code--sm">{{ kind }}</span>
          <dt-progress-circle
            :kind="kind"
            :progress="66"
            :aria-label="`kind ${kind}`"
          />
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtProgressCircle from './ProgressCircle.vue';
import { DtStack } from '@/components/Stack';
import { PROGRESS_CIRCLE_SIZES, PROGRESS_CIRCLE_KINDS } from './ProgressCircleConstants';
export default {
  name: 'DtProgressCircleVariants',
  components: { DtProgressCircle, DtStack },
  data: () => ({ PROGRESS_CIRCLE_SIZES, PROGRESS_CIRCLE_KINDS }),
};
</script>
