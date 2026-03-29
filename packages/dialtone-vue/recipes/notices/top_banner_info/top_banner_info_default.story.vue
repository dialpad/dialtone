<template>
  <!--
    We can bind the data that the user entered into the storybook controls to props by using a property of the same name
    as the storybook control defined in the corresponding `.story.js` file.
  -->
  <dt-recipe-top-banner-info
    :color-code="$attrs.colorCode"
  >
    <template
      v-if="$attrs.start"
      #start
    >
      <span v-html="$attrs.start" />
    </template>
    <template
      v-else
      #start
    >
      <dt-text strength="bold">
        Active Call
      </dt-text>
    </template>
    <template v-if="defaultSlot">
      <span v-html="defaultSlot" />
    </template>
    <dt-text v-else>
      <dt-text strength="medium">
        Caller ID:
      </dt-text>
      Aerolabs Support (415) 583-3482
    </dt-text>
    <template
      v-if="$attrs.end"
      #end
    >
      <span v-html="$attrs.end" />
    </template>
    <template
      v-else
      #end
    >
      <dt-text strength="bold">
        Recording ON
      </dt-text>
    </template>
  </dt-recipe-top-banner-info>
</template>

<script>
import DtRecipeTopBannerInfo from './top_banner_info.vue';
import { DtText } from '@/components/text';

export default {
  name: 'DtRecipeTopBannerInfoDefault',
  components: { DtRecipeTopBannerInfo, DtText },
};
</script>
