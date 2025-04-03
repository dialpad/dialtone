<!-- Use this template story to allow the user control the component's props and slots -->
<template>
  <!--
    We can bind the data that the user entered into the storybook controls to props by using a property of the same name
    as the storybook control defined in the corresponding `.story.js` file.
  -->
  <div>
    <dt-recipe-attachment-carousel
      :media-list="$attrs.mediaList"
      :close-aria-label="$attrs.closeAriaLabel"
      :click-to-open-aria-label="$attrs.clickToOpenAriaLabel"
      :progressbar-aria-label="$attrs.progressbarAriaLabel"
      :left-arrow-aria-label="$attrs.leftArrowAriaLabel"
      :right-arrow-aria-label="$attrs.rightArrowAriaLabel"
      @remove-media="removeMedia"
    />

    {{ $t('close') }}

    <button @click="changeLocale">
      Change locale
    </button>
  </div>
</template>

<script>
import DtRecipeAttachmentCarousel from './attachment_carousel.vue';
import { useI18N } from '@dialpad/i18n-vue2';
const { $t, setI18N, currentLocale } = useI18N();

export default {
  name: 'DtRecipeAttachmentCarouselDefault',
  components: { DtRecipeAttachmentCarousel },
  methods: {
    $t,
    removeMedia (index) {
      this.$attrs.mediaList.splice(index, 1);
      this.$attrs.onRemoveMedia(index);
    },

    async changeLocale () {
      // console.log(currentLocale, currentLocale === 'dp-DP');
      await setI18N({ preferredLocale: currentLocale === 'dp-DP' ? 'en-US' : 'dp-DP' });
    },
  },
};
</script>
