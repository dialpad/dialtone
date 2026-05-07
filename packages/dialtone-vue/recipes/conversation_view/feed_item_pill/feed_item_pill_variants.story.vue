<template>
  <div>
    <div>
      <h2>Call pill</h2>
      <h3 class="d-mbs-100 d-mbe-50">
        With call recap
      </h3>
      <dt-recipe-feed-item-pill
        default-toggled
        title="Ben called you"
        class="d-w-950"
        border-color="ai"
      >
        <template
          #startIcon="{ iconSize }"
        >
          <dt-icon-phone-outgoing
            :size="iconSize"
          />
        </template>
        <template #subtitle>
          Lasted 8 min • Ended at 11:56 AM
        </template>
        <template #end>
          <div>
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
          <div class="d-p-200">
            <p>
              The agent from Dialpad called to follow up on a support ticket
              that Jeff was handling for them regarding Dialpad CTI. They apologized
              for calling outside of the requested time and expressed that they had
              asked the team to look into the issue and would email them after the call.
            </p>
            <p class="d-fs-100 d-mbs-150">
              <strong>Actions items</strong>
            </p>
            <dt-stack
              as="p"
              direction="row"
            >
              <strong class="d-mie-50">1. </strong>
              The agent needs to inform the team to check on Vijay's request or ticket regarding Dialpad CTI.
            </dt-stack>
          </div>
        </template>
      </dt-recipe-feed-item-pill>

      <h3 class="d-mbs-200 d-mbe-50">
        Missed
      </h3>
      <dt-recipe-feed-item-pill
        title="Missed call from Ben"
        border-color="critical"
        class="d-w-950"
        :toggleable="false"
      >
        <template
          #startIcon="{ iconSize }"
        >
          <dt-icon-phone-missed
            :size="iconSize"
          />
        </template>
        <template #end>
          <div>
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

      <h3 class="d-mbs-200 d-mbe-50">
        Voicemail
      </h3>
      <dt-recipe-feed-item-pill
        title="Voicemail"
        class="d-w-950"
        :toggleable="false"
      >
        <template
          #startIcon="{ iconSize }"
        >
          <dt-icon-voicemail
            :size="iconSize"
          />
        </template>
        <template #subtitle>
          From (800)504-9978
        </template>
        <template #end>
          <div>
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

      <h3 class="d-mbs-200 d-mbe-50">
        Generating AI summary
      </h3>
      <dt-recipe-feed-item-pill
        border-color="ai"
        title="Ben called you"
        class="d-w-950"
        :toggleable="false"
      >
        <template
          #startIcon="{ iconSize }"
        >
          <dt-icon-phone-incoming
            :size="iconSize"
          />
        </template>
        <template #end>
          <div>
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
      <h2 class="d-mbs-200">
        Meeting pill
      </h2>

      <h3 class="d-mbs-100 d-mbe-50">
        With call recap
      </h3>
      <dt-recipe-feed-item-pill
        title="Ben started a meeting"
        button-class="d-bar-550"
        class="d-w-950"
        border-color="ai"
        :default-toggled="true"
      >
        <template
          #startIcon="{ iconSize }"
        >
          <dt-icon-video
            :size="iconSize"
          />
        </template>
        <template #subtitle>
          Started 10 minutes ago
        </template>
        <template #blockEnd>
          <span class="d-fc-tertiary d-fs-100">8 people joined</span>
        </template>
        <template #end>
          <div>
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
          <div class="d-p-200">
            <p>
              The agent from Dialpad called to follow up on a support ticket
              that Jeff was handling for them regarding Dialpad CTI. They apologized
              for calling outside of the requested time and expressed that they had
              asked the team to look into the issue and would email them after the call.
            </p>
            <p class="d-fs-100 d-mbs-150">
              <strong>Actions items</strong>
            </p>
            <dt-stack
              as="p"
              direction="row"
            >
              <strong class="d-mie-50">1. </strong>
              The agent needs to inform the team to check on Vijay's request or ticket regarding Dialpad CTI.
            </dt-stack>
          </div>
        </template>
      </dt-recipe-feed-item-pill>

      <h3 class="d-mbs-200 d-mbe-50">
        Generating AI summary
      </h3>
      <dt-recipe-feed-item-pill
        title="Ben started a meeting"
        border-color="ai"
        button-class="d-bar-550"
        class="d-w-950"
        :toggleable="false"
      >
        <template
          #startIcon="{ iconSize }"
        >
          <dt-icon-video
            :size="iconSize"
          />
        </template>
        <template #subtitle>
          Started 10 minutes ago
        </template>
        <template #blockEnd>
          <span class="d-fc-tertiary d-fs-100">8 people joined</span>
        </template>
        <template #end>
          <div>
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
import { DtIcon } from '@/components/Icon';
import { DtButton } from '@/components/Button';
import { DtStack } from '@/components/Stack';

import {
  DtIconPhoneOutgoing,
  DtIconPhoneMissed,
  DtIconPhoneIncoming,
  DtIconVideo,
  DtIconVoicemail,
} from '@dialpad/dialtone-icons/vue';
export default {
  name: 'DtRecipeFeedItemPillVariants',

  components: {
    DtRecipeFeedItemPill,
    DtButton,
    DtStack,
    DtIcon,
    DtIconPhoneOutgoing,
    DtIconPhoneMissed,
    DtIconVoicemail,
    DtIconPhoneIncoming,
    DtIconVideo,
  },
};
</script>
