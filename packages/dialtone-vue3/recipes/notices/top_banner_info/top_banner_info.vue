<template>
  <div
    class="d-recipe-top-banner-info"
    :class="bannerInfoClass"
    data-qa="banner-info"
  >
    <div class="d-recipe-top-banner-info__left">
      <slot name="left" />
    </div>

    <div
      class="d-recipe-top-banner-info__middle"
      data-qa="banner-info--middle"
    >
      <slot />
    </div>

    <div class="d-recipe-top-banner-info__right">
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
        green100: 'd-recipe-top-banner-info--success',
        green300: 'd-recipe-top-banner-info--success',
        red100: 'd-recipe-top-banner-info--critical',
        red200: 'd-recipe-top-banner-info--critical',
        gold100: 'd-recipe-top-banner-info--warning',
        gold200: 'd-recipe-top-banner-info--warning',
        black100: 'd-recipe-top-banner-info--info',
        white: 'd-recipe-top-banner-info--primary',
      };
      return [bgColors[this.colorCode]];
    },
  },
};
</script>
