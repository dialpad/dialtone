<template>
  <!--
    We can bind the data that the user entered into the storybook controls to props by using a property of the same name
    as the storybook control defined in the corresponding `.story.js` file.
  -->
  <div class="d-stack8">
    <dt-recipe-top-banner-info
      class=""
      color-code="gold200"
    >
      <template #left>
        <span class="d-fw-bold"> Active Call </span> 3:21
      </template>
      <dt-button
        importance="clear"
        icon-position="right"
        size="xs"
        kind="muted"
        class="d-px4 d-py0"
      >
        Show 2 calls on hold
        <template #icon>
          <dt-icon
            name="arrow-up"
            size="200"
          />
        </template>
      </dt-button>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      class=""
      color-code="red200"
    >
      <template #left>
        <span class="d-fw-bold"> Active Call </span> 3:21
      </template>
      <span>
        <span class="d-fw-medium">Caller ID: </span>
        Aerolabs Support (415) 583-3482
      </span>
      <template #right>
        <span class="d-fw-bold"> Admin is listening in </span> 0:21
      </template>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      class=""
      color-code="black100"
    >
      <template #left>
        <span class="d-fw-bold"> Connecting Call </span>
      </template>
      <span>
        <span class="d-fw-medium">Your caller ID: </span>
        (415) 555-1234
      </span>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      class=""
      color-code="green100"
    >
      <template #left>
        <span class="d-fw-bold"> Ringing... </span>
      </template>
      <span>
        <span class="d-fw-medium">Your caller ID:</span>
        (415) 555-1234
      </span>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      color-code="gold100"
    >
      <template #left>
        <span class="d-fw-bold">Joseph Lumaban</span>
        <div class="d-fc-critical-strong d-fw-semibold">
          On hold
          <span class="d-fw-normal">00:08</span>
        </div>
      </template>
      <div>
        <dt-button
          importance="clear"
          kind="muted"
        >
          <template #icon>
            <dt-icon
              name="park"
              size="300"
            />
          </template>
          Park
        </dt-button>
        <dt-button
          importance="clear"
          kind="muted"
        >
          <template #icon>
            <dt-icon
              name="transfer"
              size="300"
            />
          </template>
          Transfer
        </dt-button>
        <dt-button
          importance="clear"
          kind="danger"
          class="d-fc-critical-strong"
        >
          <template #icon>
            <dt-icon
              name="phone-hang-up"
              size="300"
            />
          </template>
          End Call
        </dt-button>
      </div>
      <template #right>
        <dt-button
          importance="clear"
          icon-position="right"
          size="xs"
          kind="muted"
          class="d-fc-primary d-p0 d-fw-bold"
        >
          Click to answer
        </dt-button>
        and put the active call on hold
      </template>
    </dt-recipe-top-banner-info>
  </div>
</template>

<script>
import DtRecipeTopBannerInfo from './top_banner_info.vue';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeTopBannerInfoVariants',
  components: {
    DtButton,
    DtRecipeTopBannerInfo,
    DtIcon,
  },
};
</script>
