<template>
  <div
    class="d-fs11 d-d-flex d-top-banner-info d-jc-space-between d-ai-center"
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
      default: 'green400',
      validator: function (kind) {
        return COLOR_CODES.includes(kind);
      },
    },
  },

  computed: {
    bannerInfoClass () {
      const bgColors = {
        green400: 'd-bgc-green-400',
        green200: 'd-bgc-green-200',
        red200: 'd-bgc-red-200',
        red100: 'd-bgc-red-100',
        yellow400: 'd-bgc-yellow-400',
        yellow200: 'd-bgc-yellow-200',
        black100: 'd-bgc-black-100',
        white: 'd-bgc-white',
      };
      return [bgColors[this.colorCode]];
    },
  },
};
</script>

<style lang="less">
.d-top-banner-info {
   &__left {
     margin: var(--su4) 0 var(--su4) var(--su8);
     min-width: 20%;
  }
  &__right {
     margin: var(--su4) var(--su12) var(--su4) 0;
     min-width: 20%;
  }
}
</style>
