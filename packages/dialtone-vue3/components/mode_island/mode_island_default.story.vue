<template>
  <dt-stack gap="400">
    <h1 class="d-headline--lg">
      Mode Island default
    </h1>
    <dt-mode-island
      class="d-p16 d-ba d-bc-subtle d-bar8"
    >
      <dt-stack gap="500">
        <dt-stack
          gap="400"
          direction="row"
        >
          <span class="d-fc-primary">
            Primary Foreground
          </span>
          <span class="d-fc-tertiary">
            Tertiary Foreground
          </span>
          <span class="d-fc-success">
            Success Foreground
          </span>
          <span class="d-fc-critical">
            Critical Foreground
          </span>
        </dt-stack>
        <dt-stack
          gap="400"
          direction="row"
        >
          <div class="d-bgc-secondary d-p16 d-py8 d-ba d-bc-subtle">
            Secondary Surface
          </div>
          <div class="d-bgc-moderate d-p16 d-py8 d-ba d-bc-subtle">
            Moderate Surface
          </div>
          <div class="d-bgc-critical d-p16 d-py8 d-ba d-bc-subtle">
            Critical Surface
          </div>
          <div class="d-bgc-success d-p16 d-py8 d-ba d-bc-subtle">
            Success Surface
          </div>
        </dt-stack>
      </dt-stack>
    </dt-mode-island>
  </dt-stack>
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
