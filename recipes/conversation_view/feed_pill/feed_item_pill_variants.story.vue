<template>
  <div>
    <div>
      <h2>Call pill</h2>
      <h3 class="d-mt8 d-mb4">
        With call recap
      </h3>
      <dt-recipe-feed-item-pill
        default-toggled
        title="Ben called you"
        icon-name="phone-outgoing"
        wrapper-class="d-w628"
        border-color="ai"
      >
        <template #subtitle>
          Lasted 8 min • Ended at 11:56 AM
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
          <div class="d-p16">
            <p>
              The agent from Dialpad called to follow up on a support ticket
              that Jeff was handling for them regarding Dialpad CTI. They apologized
              for calling outside of the requested time and expressed that they had
              asked the team to look into the issue and would email them after the call.
            </p>
            <p class="d-fs-100 d-mt12">
              <strong>Actions items</strong>
            </p>
            <p class="d-d-flex">
              <strong class="d-mr4">1. </strong>
              The agent needs to inform the team to check on Vijay's request or ticket regarding Dialpad CTI.
            </p>
          </div>
        </template>
      </dt-recipe-feed-item-pill>

      <h3 class="d-mt16 d-mb4">
        Missed
      </h3>
      <dt-recipe-feed-item-pill
        title="Missed call from Ben"
        border-color="critical"
        icon-name="phone-missed"
        wrapper-class="d-w628"
        :toggleable="false"
      >
        <template #right>
          <div class="d-pr16">
            <dt-button
              aria-label="Call Ben"
              kind="muted"
              importance="clear"
              :circle="true"
              @click.stop=""
            >
              <template #icon>
                <dt-icon
                  name="phone"
                  size="300"
                />
              </template>
            </dt-button>
          </div>
        </template>
      </dt-recipe-feed-item-pill>

      <h3 class="d-mt16 d-mb4">
        Voicemail
      </h3>
      <dt-recipe-feed-item-pill
        icon-name="voicemail"
        title="Voicemail"
        wrapper-class="d-w628"
        :toggleable="false"
      >
        <template #subtitle>
          From (800)504-9978
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
      </dt-recipe-feed-item-pill>

      <h3 class="d-mt16 d-mb4">
        Generating AI summary
      </h3>
      <dt-recipe-feed-item-pill
        border-color="ai"
        title="Ben called you"
        icon-name="phone-incoming"
        wrapper-class="d-w628"
        :toggleable="false"
      >
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
      </dt-recipe-feed-item-pill>
    </div>
    <div>
      <h2 class="d-mt16">
        Meeting pill
      </h2>

      <h3 class="d-mt8 d-mb4">
        With call recap
      </h3>
      <dt-recipe-feed-item-pill
        title="Ben started a meeting"
        icon-name="video"
        button-class="d-bar24"
        wrapper-class="d-w628"
        border-color="ai"
        :default-toggled="true"
      >
        <template #subtitle>
          Started 10 minutes ago
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
          <div class="d-p16">
            <p>
              The agent from Dialpad called to follow up on a support ticket
              that Jeff was handling for them regarding Dialpad CTI. They apologized
              for calling outside of the requested time and expressed that they had
              asked the team to look into the issue and would email them after the call.
            </p>
            <p class="d-fs-100 d-mt12">
              <strong>Actions items</strong>
            </p>
            <p class="d-d-flex">
              <strong class="d-mr4">1. </strong>
              The agent needs to inform the team to check on Vijay's request or ticket regarding Dialpad CTI.
            </p>
          </div>
        </template>
      </dt-recipe-feed-item-pill>

      <h3 class="d-mt16 d-mb4">
        Generating AI summary
      </h3>
      <dt-recipe-feed-item-pill
        title="Ben started a meeting"
        icon-name="video"
        border-color="ai"
        button-class="d-bar24"
        wrapper-class="d-w628"
        :toggleable="false"
      >
        <template #subtitle>
          Started 10 minutes ago
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
      </dt-recipe-feed-item-pill>
    </div>
  </div>
</template>

<script>
import DtRecipeFeedItemPill from './feed_item_pill.vue';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';

export default {
  name: 'DtRecipeFeedItemPillVariants',

  components: {
    DtRecipeFeedItemPill,
    DtButton,
    DtIcon,
  },
};
</script>
