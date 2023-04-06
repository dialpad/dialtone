<template>
  <div class="d-divide-y d-divide-purple-400">
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Unknown contact (phone number only) with attestation
      </p>
      <dt-recipe-contact-info>
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div class="d-fs-200 d-fw-bold d-mr4">
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
      <dt-recipe-contact-info>
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div class="d-fs-200 d-fw-bold d-mr4">
              +1 (415) 123-4567
            </div>
          </div>
        </template>
        <template #subtitle>
          <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
          <dt-link
            kind="danger"
            @click.stop="onMarkAsSpam"
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
        @click="onGroupContactClick"
      >
        <dt-recipe-contact-info>
          <template #header>
            <div class="d-d-flex d-ai-center d-mb2">
              <div class="d-fs-200 d-fw-bold d-mr4">
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
      <dt-recipe-contact-info>
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div class="d-fs-200 d-fw-bold d-mr4">
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
      <dt-recipe-contact-info :avatar-list="adminListenInAvatars">
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div class="d-fw-bold d-fs-200">
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
        :avatar-initials="avatarInitials"
        :avatar-color="avatarColor"
      >
        <template #header>
          <div class="d-fw-bold d-fs-200">
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
            @click.stop="onConnectToARecord"
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
      <dt-recipe-contact-info :avatar-list="groupCallAvatars">
        <template #header>
          <div class="d-d-flex d-ai-center d-mb2">
            <div class="d-fw-bold d-fs-200">
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
  </div>
</template>

<script>
import DtRecipeContactInfo from './contact_info';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
import { DtLink } from '@/components/link';

export default {
  name: 'DtRecipeContactInfoVariants',
  components: { DtButton, DtRecipeContactInfo, DtIcon, DtLink },
  data () {
    return {
      adminListenInAvatars: [
        { src: 'static/recipes/list_items/contact_info/avatar.png' },
        { src: 'static/recipes/list_items/contact_info/avatar2.png', icon: 'hear' },
      ],

      groupCallAvatars: [
        { initials: 'JL' },
        { src: 'static/recipes/list_items/contact_info/avatar.png' },
        { src: 'static/recipes/list_items/contact_info/avatar2.png', text: '+3' },
      ],
    };
  },
};
</script>
