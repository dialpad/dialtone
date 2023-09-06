<template>
  <dt-recipe-feed-item-pill
    :icon-name="$attrs.iconName"
    :title="$attrs.title"
    :wrapper-class="$attrs.wrapperClass"
    :button-class="$attrs.buttonClass"
    :border-color="$attrs.borderColor"
    :aria-label="$attrs.ariaLabel"
    :toggleable="$attrs.toggleable"
  >
    <template #subtitle>
      Last 43 minutes - Ended at 5:04pm
    </template>
    <template #bottom>
      <span class="d-fc-tertiary d-fs-100">8 people joined</span>
    </template>
    <template #right>
      <div class="d-pr16">
        <dt-button
          aria-label="Open external link"
          kind="muted"
          importance="clear"
          :circle="true"
          @click.stop=""
        >
          <template #icon>
            <dt-icon
              name="external-link"
              size="300"
            />
          </template>
        </dt-button>
      </div>
    </template>
    <template #content>
      <span class="d-p16">
        The agent from Dialpad called to follow up on a support ticket
        that Jeff was handling for them regarding Dialpad CTI. They apologized
        for calling outside of the requested time and expressed that they had
        asked the team to look into the issue and would email them after the call.
      </span>
    </template>
  </dt-recipe-feed-item-pill>
</template>

<script>
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';
import DtRecipeFeedItemPill from './feed_item_pill.vue';

export default {
  name: 'DtRecipeFeedItemPillDefault',
  components: { DtRecipeFeedItemPill, DtButton, DtIcon },
};
</script>
