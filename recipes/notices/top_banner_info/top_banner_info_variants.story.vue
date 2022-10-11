<template>
  <!--
    We can bind the data that the user entered into the storybook controls to props by using a property of the same name
    as the storybook control defined in the corresponding `.story.js` file.
  -->
  <div>
    <dt-recipe-top-banner-info
      class="d-mb6"
      color-code="gold200"
    >
      <template #left>
        <span class="d-fw-bold"> Active Call </span> 3:21
      </template>
      <div class="d-d-flex d-c-pointer">
        <span> Show 2 calls on hold </span> <icon-arrow-upward class="d-svg--size14" />
      </div>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      class="d-mb6"
      color-code="red200"
    >
      <template #left>
        <span class="d-fw-bold"> Active Call </span> 3:21
      </template>
      <span> Caller ID: Aerolabs Support (415) 583-3482 </span>
      <template #right>
        <span class="d-fw-bold"> Admin is listening in </span> 0:21
      </template>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      class="d-mb6"
      color-code="black100"
    >
      <template #left>
        <span class="d-fw-bold"> Connecting Call </span>
      </template>
      <span> Your caller ID: (415) 555-1234 </span>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      class="d-mb6"
      color-code="green100"
    >
      <template #left>
        <span class="d-fw-bold"> Ringing... </span>
      </template>
      <span> Your caller ID: (415) 555-1234 </span>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      color-code="gold100"
    >
      <template #left>
        <span class="d-fw-bold">Joseph Lumaban</span>
        <div class="d-fc-red-300 d-fw-bold">
          On hold 00:08
        </div>
      </template>
      <div>
        <dt-button
          importance="clear"
          kind="muted"
        >
          <template #icon>
            <icon-park />
          </template>
          Park
        </dt-button>
        <dt-button
          importance="clear"
          kind="muted"
        >
          <template #icon>
            <icon-phone-transfer />
          </template>
          Transfer
        </dt-button>
        <dt-button
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <icon-call-end-arrow />
          </template>
          End Call
        </dt-button>
      </div>
      <template #right>
        <span class="d-fw-bold d-c-pointer">Click to answer</span> and put the active call on hold
      </template>
    </dt-recipe-top-banner-info>
  </div>
</template>

<script>
import DtRecipeTopBannerInfo from './top_banner_info';
import { DtButton } from '@/components/button';
import IconCallEndArrow from '@dialpad/dialtone/lib/dist/vue/icons/IconCallEndArrow';
import IconPhoneTransfer from '@dialpad/dialtone/lib/dist/vue/icons/IconPhoneTransfer';
import IconArrowUpward from '@dialpad/dialtone/lib/dist/vue/icons/IconArrowUpward';
import IconPark from '@dialpad/dialtone/lib/dist/vue/icons/IconPark';

export default {
  name: 'DtRecipeTopBannerInfoVariants',
  components: {
    DtButton,
    DtRecipeTopBannerInfo,
    IconArrowUpward,
    IconCallEndArrow,
    IconPhoneTransfer,
    IconPark,
  },
};
</script>
