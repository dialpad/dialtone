<script>
export default {
  name: 'DtProgressBar',
  props: {
    progressbarAriaLabel: {
      type: String,
      required: true,
    },

    progress: {
      type: Number,
      default: 20,
    },
  },

  data: () => ({
    circleCircumference: 50,
  }),

  computed: {
    cssVars () {
      return {
        '--stroke-dashoffset':
          (this.circleCircumference - (this.circleCircumference * this.progress / 100)),

        '--stroke-dasharray': this.circleCircumference,
      };
    },
  },

  mounted () {
    this.circleCircumference = this.$refs.progressbarCircle.getTotalLength();
  },
};
</script>

<template>
  <div
    role="progressbar"
    :aria-label="progressbarAriaLabel"
    tabindex="-1"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <svg
      class="progress-bar"
      :style="cssVars"
    >
      <circle
        ref="progressbarCircle"
        r="8"
        cx="12"
        cy="12"
        class="progress-bar__circle"
      />
      <circle
        r="8"
        cx="12"
        cy="12"
        class="progress-bar__circle"
      />
    </svg>
  </div>
</template>

<style lang="less">
.progress-bar {
  width: var(--dt-size-550);
  height: var(--dt-size-550);
}

.progress-bar__circle {
  fill: none;
  stroke-width: 2;
  stroke-dasharray: var(--stroke-dasharray);
}

.progress-bar__circle:nth-child(1) {
  stroke-dashoffset: 0;
  stroke: var(--dt-color-black-100);
}

.progress-bar__circle:nth-child(2) {
  stroke-dashoffset: var(--stroke-dashoffset);
  stroke: var(--dt-color-purple-500);
  transition: stroke-dashoffset 500ms linear;
}
</style>
