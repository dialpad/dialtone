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
      class="dt-recipe-attachment-carousel__progress-bar"
      :style="cssVars"
    >
      <circle
        ref="progressbarCircle"
        r="8"
        cx="12"
        cy="12"
        class="dt-recipe-attachment-carousel__progress-bar__circle"
      />
      <circle
        r="8"
        cx="12"
        cy="12"
        class="dt-recipe-attachment-carousel__progress-bar__circle"
      />
    </svg>
  </div>
</template>
