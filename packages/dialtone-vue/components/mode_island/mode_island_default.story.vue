<template>
  <dt-mode-island
    :as="$attrs.as"
    :mode="$attrs.mode"
    class="d-p-200 d-ba d-bc-subtle d-bar-400"
  >
    <dt-stack gap="200">
      <dt-stack
        gap="100"
        direction="row"
      >
        <span class="d-fc-primary">
          Primary Foreground
        </span>
        <span class="d-fc-tertiary">
          Tertiary Foreground
        </span>
        <span class="d-fc-positive">
          Positive Foreground
        </span>
        <span class="d-fc-critical">
          Critical Foreground
        </span>
      </dt-stack>
      <dt-stack
        gap="100"
        direction="row"
      >
        <div class="d-bgc-secondary d-p-200 d-py-100 d-ba d-bc-subtle">
          Secondary Surface
        </div>
        <div class="d-bgc-moderate d-p-200 d-py-100 d-ba d-bc-subtle">
          Moderate Surface
        </div>
        <div class="d-bgc-critical d-p-200 d-py-100 d-ba d-bc-subtle">
          Critical Surface
        </div>
        <div class="d-bgc-success d-p-200 d-py-100 d-ba d-bc-subtle">
          Success Surface
        </div>
      </dt-stack>
    </dt-stack>
  </dt-mode-island>
</template>

<script>
import DtModeIsland from './mode_island.vue';
import DtStack from '@/components/stack/stack.vue';

export default {
  name: 'ModeIslandDefaultStory',
  components: {
    DtModeIsland,
    DtStack,
  },

  data () {
    return {};
  },
};
</script>
