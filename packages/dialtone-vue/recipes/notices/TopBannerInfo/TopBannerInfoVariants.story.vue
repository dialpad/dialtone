<template>
  <!--
    We can bind the data that the user entered into the storybook controls to props by using a property of the same name
    as the storybook control defined in the corresponding `.story.js` file.
  -->
  <dt-stack gap="100">
    <dt-recipe-top-banner-info
      class=""
      color-code="gold200"
    >
      <template #start>
        <dt-text strength="bold">
          Active Call
        </dt-text> <dt-text numeric>
          3:21
        </dt-text>
      </template>
      <dt-button
        importance="clear"
        :size="100"
        kind="muted"
        class="d-px-50 d-py-0"
      >
        Show 2 calls on hold
        <template #endIcon>
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
      <template #start>
        <dt-text strength="bold">
          Active Call
        </dt-text> <dt-text numeric>
          3:21
        </dt-text>
      </template>
      <dt-text>
        <dt-text strength="medium">
          Caller ID:
        </dt-text>
        Aerolabs Support (415) 583-3482
      </dt-text>
      <template #end>
        <dt-text strength="bold">
          Admin is listening in
        </dt-text> <dt-text numeric>
          0:21
        </dt-text>
      </template>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      class=""
      color-code="black100"
    >
      <template #start>
        <dt-text strength="bold">
          Connecting Call
        </dt-text>
      </template>
      <dt-text>
        <dt-text strength="medium">
          Your caller ID:
        </dt-text>
        (415) 555-1234
      </dt-text>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      class=""
      color-code="green100"
    >
      <template #start>
        <dt-text strength="bold">
          Ringing...
        </dt-text>
      </template>
      <dt-text>
        <dt-text strength="medium">
          Your caller ID:
        </dt-text>
        (415) 555-1234
      </dt-text>
    </dt-recipe-top-banner-info>
    <dt-recipe-top-banner-info
      color-code="gold100"
    >
      <template #start>
        <dt-text strength="bold">
          Joseph Lumaban
        </dt-text>
        <dt-text
          tone="critical"
          strength="semibold"
        >
          On hold
          <dt-text
            strength="normal"
            numeric
          >
            00:08
          </dt-text>
        </dt-text>
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
          kind="critical"
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
      <template #end>
        <dt-button
          importance="clear"
          :size="100"
          kind="muted"
          class="d-fc-primary d-p-0"
        >
          <dt-text strength="bold">
            Click to answer
          </dt-text>
        </dt-button>
        and put the active call on hold
      </template>
    </dt-recipe-top-banner-info>
  </dt-stack>
</template>

<script>
import DtRecipeTopBannerInfo from './TopBannerInfo.vue';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
import { DtStack } from '@/components/stack';
import { DtText } from '@/components/text';

export default {
  name: 'DtRecipeTopBannerInfoVariants',
  components: {
    DtButton,
    DtRecipeTopBannerInfo,
    DtIcon,
    DtStack,
    DtText,
  },
};
</script>
