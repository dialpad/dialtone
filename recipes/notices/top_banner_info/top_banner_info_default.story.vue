<template>
  <!--
    We can bind the data that the user entered into the storybook controls to props by using a property of the same name
    as the storybook control defined in the corresponding `.story.js` file.
  -->
  <dt-recipe-top-banner-info
    :color-code="$attrs.colorCode"
  >
    <template
      v-if="$attrs.left"
      slot="left"
    >
      <span v-html="$attrs.left" />
    </template>
    <template
      v-else
      slot="left"
    >
      <span class="d-fw-bold"> Active Call </span>
    </template>
    <template v-if="$attrs.default">
      <span v-html="$attrs.default" />
    </template>
    <span v-else>
      <span class="d-fw-medium">Caller ID: </span>
      Aerolabs Support (415) 583-3482
    </span>
    <template
      v-if="$attrs.right"
      slot="right"
    >
      <span v-html="$attrs.right" />
    </template>
    <template
      v-else
      slot="right"
    >
      <span class="d-fw-bold"> Recording ON </span>
    </template>
  </dt-recipe-top-banner-info>
</template>

<script>
import DtRecipeTopBannerInfo from './top_banner_info.vue';

export default {
  name: 'DtRecipeTopBannerInfoDefault',
  components: { DtRecipeTopBannerInfo },
};
</script>
