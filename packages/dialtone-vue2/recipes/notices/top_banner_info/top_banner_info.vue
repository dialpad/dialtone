<template>
  <div
    class="dt-top-banner-info"
    :class="bannerInfoClass"
    data-qa="banner-info"
  >
    <div class="dt-top-banner-info__left">
      <slot name="left" />
    </div>

    <div
      class="dt-top-banner-info__middle"
      data-qa="banner-info--middle"
    >
      <slot />
    </div>

    <div class="dt-top-banner-info__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import { COLOR_CODES } from './top_banner_info_constants';

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
.dt-top-banner-info {
  font-size: var(--dt-font-size-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--dt-color-foreground-primary);

   &__left {
     margin: var(--dt-space-300) 0 var(--dt-space-300) var(--dt-space-500);
     min-width: 20%;
  }
  &__middle {
     display: flex;
     align-items: center;
     gap: var(--dt-size-300);
     margin-top: var(--dt-space-300);
    margin-bottom: var(--dt-space-300);
  }
  &__right {
     display: flex;
     align-items: baseline;
     justify-content: flex-end;
     gap: var(--dt-size-300);
     margin: var(--dt-space-300) var(--dt-space-500) var(--dt-space-300) 0;
     min-width: 20%;
     text-align: right;
  }
}
</style>
