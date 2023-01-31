<template>
  <div
    class="d-fs-100 d-d-flex d-top-banner-info d-jc-space-between d-ai-center d-fc-primary"
    :class="bannerInfoClass"
    data-qa="banner-info"
  >
    <div class="d-top-banner-info__left">
      <slot name="left" />
    </div>

    <div class="d-top-banner-info__middle d-my4">
      <slot />
    </div>

    <div class="d-top-banner-info__right d-ta-right">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import { COLOR_CODES } from './top_banner_info_constants.js';

export default {
  name: 'DtRecipeTopBannerInfo',

  props: {
    /**
     * color of the banner background
     */
    colorCode: {
      type: String,
      default: 'green300',
      validator: function (kind) {
        return COLOR_CODES.includes(kind);
      },
    },
  },

  computed: {
    bannerInfoClass () {
      const bgColors = {
        // these are too specific, so for now I'm at least updating the resultant semantic value
        // TODO: breaking change: update to be more abstract
        green300: 'd-bgc-success',
        green100: 'd-bgc-success',
        red200: 'd-bgc-critical',
        red100: 'd-bgc-critical',
        gold200: 'd-bgc-warning',
        gold100: 'd-bgc-warning',
        black100: 'd-bgc-info',
        white: 'd-bgc-primary',
      };
      return [bgColors[this.colorCode]];
    },
  },
};
</script>

<style lang="less">
.d-top-banner-info {
   &__left {
     margin: var(--space-300) 0 var(--space-300) var(--space-400);
     min-width: 20%;
  }
  &__middle {
     display: flex;
     align-items: center;
     gap: var(--size-300);
  }
  &__right {
     display: flex;
     align-items: baseline;
     justify-content: flex-end;
     gap: var(--size-300);
     margin: var(--space-300) var(--space-500) var(--space-300) 0;
     min-width: 20%;
  }
}
</style>
