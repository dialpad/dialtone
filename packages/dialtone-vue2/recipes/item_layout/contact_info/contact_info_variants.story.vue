<template>
  <div class="d-divide-y d-divide-purple-400">
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Unknown contact (phone number only) with attestation
      </p>
      <dt-recipe-contact-info
        avatar-labelled-by="contact-number1"
      >
        <template
          #avatarIcon="{ iconSize }"
        >
          <dt-icon
            v-if="$attrs.avatarIcon"
            :name="$attrs.avatarIcon"
            :size="iconSize"
          />
        </template>
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div
              id="contact-number1"
              class="d-fs-200 d-fw-bold d-mr4"
            >
              +1 (415) 123-4567
            </div>
            <dt-icon
              name="check-circle"
              size="200"
            />
          </div>
        </template>
        <template #subtitle>
          San Francisco, California
        </template>
      </dt-recipe-contact-info>
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Unknown contact with "marked as spam" button
      </p>
      <dt-recipe-contact-info
        avatar-labelled-by="contact-number2"
      >
        <template
          #avatarIcon="{ iconSize }"
        >
          <dt-icon
            v-if="$attrs.avatarIcon"
            :name="$attrs.avatarIcon"
            :size="iconSize"
          />
        </template>
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div
              id="contact-number2"
              class="d-fs-200 d-fw-bold d-mr4"
            >
              +1 (415) 123-4567
            </div>
          </div>
        </template>
        <template #subtitle>
          <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
          <dt-link
            kind="danger"
            @click.stop="$attrs.onMarkAsSpam"
          >
            Mark as spam
          </dt-link>
        </template>
      </dt-recipe-contact-info>
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Clickable Group contact
      </p>
      <dt-button
        importance="clear"
        kind="muted"
        aria-labelledby="contact-name1"
        @click="$attrs.onGroupContactClick"
      >
        <dt-recipe-contact-info
          avatar-labelled-by="contact-name1"
        >
          <template
            #avatarIcon="{ iconSize }"
          >
            <dt-icon
              v-if="$attrs.avatarIcon"
              :name="$attrs.avatarIcon"
              :size="iconSize"
            />
          </template>
          <template #header>
            <div class="d-d-flex d-ai-center d-mb2">
              <div
                id="contact-name1"
                class="d-fs-200 d-fw-bold d-mr4"
              >
                Joseph Lumaban
              </div>
            </div>
          </template>
          <template #subtitle>
            <div class="d-d-flex d-ai-center">
              <div class="d-fs-100 d-mt2 d-mr4">
                +1 (415) 123-4567
              </div>
              <dt-icon
                name="check-circle"
                size="200"
                class="d-va-text-bottom"
              />
            </div>
          </template>
          <template #bottom>
            <div class="d-d-flex d-ai-center d-mtn6">
              <div class="d-w8 d-h8 d-mr4 d-bgc-magenta-200">
                &nbsp;
              </div>
              <div class="d-fs-100 d-mr4">
                Aerolabs Support
              </div>
            </div>
          </template>
        </dt-recipe-contact-info>
      </dt-button>
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Group contact with transfer info
      </p>
      <dt-recipe-contact-info
        avatar-labelled-by="contact-name2"
      >
        <template
          #avatarIcon="{ iconSize }"
        >
          <dt-icon
            v-if="$attrs.avatarIcon"
            :name="$attrs.avatarIcon"
            :size="iconSize"
          />
        </template>
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div
              id="contact-name2"
              class="d-fs-200 d-fw-bold d-mr4"
            >
              Joseph Lumaban
            </div>
          </div>
        </template>
        <template #subtitle>
          <div class="d-d-flex d-ai-center">
            <div class="d-fs-100 d-mt2 d-mr4">
              +1 (415) 123-4567
            </div>
            <dt-icon
              name="check-circle"
              size="200"
              class="d-va-text-bottom"
            />
          </div>
        </template>
        <template #bottom>
          <div class="d-d-flex d-ai-center d-mtn6">
            <div class="d-w8 d-h8 d-mr4 d-bgc-magenta-200">
              &nbsp;
            </div>
            <div class="d-fs-100 d-mr4">
              Aerolabs Support
            </div>
            <div class="d-fw-bold d-fs-100">
              • Transfer from Billing Support
            </div>
          </div>
        </template>
      </dt-recipe-contact-info>
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Admin view / listening in
      </p>
      <dt-recipe-contact-info
        avatar-labelled-by="contact-names1"
        :avatar-list="adminListenInAvatars"
      >
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div
              id="contact-names1"
              class="d-fw-bold d-fs-200"
            >
              Joseph Lumaban & Justin H.
            </div>
            <div class="d-fs-200">
              (Agent)
            </div>
          </div>
        </template>
        <template #subtitle>
          <div class="d-d-flex d-ai-center">
            <div class="d-fs-100 d-mr4">
              +1 (415) 123-4567
            </div>
            <dt-icon
              name="check-circle"
              size="200"
              class="d-va-text-bottom"
            />
          </div>
        </template>
        <template #bottom>
          <div class="d-d-flex d-ai-center d-mtn4">
            <div class="d-w8 d-h8 d-mr4 d-bgc-magenta-200">
              &nbsp;
            </div>
            <div class="d-fs-100 d-mr4">
              Aerolabs Support
            </div>
          </div>
        </template>
      </dt-recipe-contact-info>
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Contact with items in right slot
      </p>
      <dt-recipe-contact-info
        :avatar-full-name="$attrs.avatarFullName"
        :avatar-seed="$attrs.avatarSeed"
        avatar-labelled-by="contact-name3"
      >
        <template #header>
          <div
            id="contact-name"
            class="d-fw-bold d-fs-200"
          >
            Natalie Woods
          </div>
        </template>
        <template #subtitle>
          +1 (415) 123-4567
        </template>
        <template #right>
          <div class="d-d-flex d-ai-center d-m8">
            <dt-button
              size="xs"
              :circle="true"
              importance="clear"
              aria-label="chat"
            >
              <template #icon>
                <dt-icon
                  size="400"
                  name="webchat"
                />
              </template>
            </dt-button>
            <dt-button
              size="xs"
              :circle="true"
              importance="clear"
              aria-label="more"
            >
              <template #icon>
                <dt-icon
                  size="400"
                  name="more-horizontal"
                />
              </template>
            </dt-button>
            <div class="d-m4">
              0:32
            </div>
          </div>
        </template>
        <template #bottom>
          2 matches found.
          <dt-button
            link
            @click.stop="$attrs.onConnectToARecord"
          >
            Connect to a record
          </dt-button>
        </template>
      </dt-recipe-contact-info>
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Group call
      </p>
      <dt-recipe-contact-info
        avatar-labelled-by="group-name"
        :avatar-list="groupCallAvatars"
      >
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div
              id="group-name"
              class="d-fw-bold d-fs-200"
            >
              Group Call
            </div>
          </div>
        </template>
        <template #subtitle>
          <div class="d-d-flex d-ai-center">
            <div class="d-fs-100 d-mr4">
              Manage participants
            </div>
          </div>
        </template>
      </dt-recipe-contact-info>
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Group call with icon
      </p>
      <dt-recipe-contact-info
        avatar-labelled-by="group-name"
        :avatar-list="groupCallAvatars"
      >
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div
              id="group-name"
              class="d-fw-bold d-fs-200"
            >
              Group Call
            </div>
          </div>
        </template>
        <template #avatarIcon="{ iconSize }">
          <dt-icon-user :size="iconSize" />
        </template>
        <template #subtitle>
          <div class="d-d-flex d-ai-center">
            <div class="d-fs-100 d-mr4">
              Manage participants
            </div>
          </div>
        </template>
      </dt-recipe-contact-info>
    </div>
  </div>
</template>

<script>
/* eslint-disable max-lines */
import DtRecipeContactInfo from './contact_info.vue';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
import { DtLink } from '@/components/link';

import avatar1 from '@/common/assets/avatar1.png';
import avatar2 from '@/common/assets/avatar2.png';
import { DtIconHear, DtIconUser } from '@dialpad/dialtone-icons/vue2';

export default {
  name: 'DtRecipeContactInfoVariants',
  components: { DtButton, DtRecipeContactInfo, DtIcon, DtLink, DtIconUser },

  data () {
    return {
      adminListenInAvatars: [
        { src: avatar1, fullName: 'Jaqueline Nackos', seed: 'JN' },
        { src: avatar2, fullName: 'Joseph Lumaban', icon: DtIconHear, seed: 'JL' },
      ],

      groupCallAvatars: [
        { fullName: 'Joseph Lumaban', seed: 'JL' },
        { src: avatar1, fullName: 'Jaqueline Nackos', seed: 'JN' },
        { src: avatar2, fullName: 'Natalie Woods', text: '+3', seed: 'NW' },
      ],

      avatarIcon: DtIconUser,
    };
  },
};
</script>
