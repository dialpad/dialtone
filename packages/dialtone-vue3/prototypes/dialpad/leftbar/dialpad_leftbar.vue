<template>
  <dt-stack gap="400">
    <dt-stack gap="200">
      <dt-recipe-general-row
        v-for="item in mainOptions"
        :key="item"
        v-bind="item"
      />
    </dt-stack>
    <dt-stack
      gap="200"
    >
      <leftbar-section title="Favorites">
        <template #items>
          <dt-stack gap="200">
            <dt-recipe-general-row
              v-for="channel in favoriteChannels"
              :key="channel.description"
              v-bind="channel"
            />
            <dt-recipe-general-row
              v-for="group in favoriteGroups"
              :key="group.description"
              v-bind="group"
            />
            <dt-recipe-contact-row
              v-for="contact in favoriteContacts"
              :key="contact.name"
              v-bind="contact"
            />
          </dt-stack>
        </template>
        <template #action>
          <mark-all-as-read-button />
        </template>
      </leftbar-section>

      <leftbar-section title="Contact centers Contact centers">
        <template #items>
          <dt-stack gap="200">
            <dt-recipe-general-row
              v-for="contactCenter in contactCenters"
              :key="contactCenter.description"
              v-bind="contactCenter"
            />
          </dt-stack>
        </template>
        <template #action>
          <dt-button
            class="d-fc-success d-bar-pill d-h24"
            kind="muted"
            importance="clear"
            size="xs"
          >
            <template #icon="{ iconSize }">
              <dt-icon
                name="bell-ring"
                :size="iconSize"
              />
            </template>
            <span>Available</span>
          </dt-button>
        </template>
      </leftbar-section>

      <leftbar-section title="Channels">
        <template #items>
          <dt-stack gap="200">
            <dt-recipe-general-row
              v-for="channel in channels"
              :key="channel.description"
              v-bind="channel"
            />
          </dt-stack>
        </template>
        <template #action>
          <options-dropdown />
        </template>
      </leftbar-section>

      <leftbar-section title="Recents">
        <template #items>
          <dt-stack gap="200">
            <dt-recipe-general-row
              v-for="group in groups"
              :key="group.description"
              v-bind="group"
            />
            <dt-recipe-contact-row
              v-for="contact in contacts"
              :key="contact.name"
              v-bind="contact"
            />
          </dt-stack>
        </template>
        <template #action>
          <mark-all-as-read-button />
        </template>
      </leftbar-section>
    </dt-stack>
  </dt-stack>
</template>

<script setup>
import LeftbarSection from './components/leftbar_section.vue';
import MarkAllAsReadButton from './components/mark_all_as_read_button.vue';
import OptionsDropdown from './components/options_dropdown.vue';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
import { DtStack } from '@/components/stack';
import { DtRecipeGeneralRow } from '@/recipes/leftbar/general_row';
import { DtRecipeContactRow } from '@/recipes/leftbar/contact_row';
import { faker } from '@faker-js/faker';
import { computed } from 'vue';

const mainOptions = [
  { description: 'Inbox', type: 'inbox' },
  { description: 'Contacts', type: 'contacts' },
  {
    description: 'All channels',
    type: 'channels',
    hasUnreads: true,
    unreadMentionCount: faker.number.int({ min: 1, max: 20 }).toString(),
    get unreadCountTooltip () {
      return unreadCountMessage({ mentions: this.unreadMentionCount });
    },
  },
  {
    description: 'Threads',
    type: 'threads',
    hasUnreads: true,
    unreadCount: faker.number.int({ min: 1, max: 20 }).toString(),
    unreadMentionCount: faker.number.int({ min: 1, max: 20 }).toString(),
    get unreadCountTooltip () {
      return unreadCountMessage({ messages: this.unreadCount, mentions: this.unreadMentionCount });
    },
  },
];
const channels = [
  {
    description: faker.word.sample({ strategy: 'longest' }),
    type: 'channels',
    iconSize: '200',
    unreadCount: faker.number.int({ min: 0, max: 9 }).toString(),
    hasUnreads: true,
    get unreadCountTooltip () {
      return unreadCountMessage({ messages: this.unreadCount });
    },
  },

  { description: faker.word.sample(), type: 'channels', iconSize: '200' },
  { description: faker.word.sample({ strategy: 'longest' }), type: 'locked channel', iconSize: '200' },
];
const contactCenters = [
  { description: faker.person.fullName(), type: 'contact center', color: 'magenta-200' },
  {
    description: faker.person.fullName(),
    type: 'contact center',
    color: 'gold-300',
    unreadCount: faker.number.int({ min: 0, max: 99 }).toString(),
    hasUnreads: true,
    get unreadCountTooltip () {
      return unreadCountMessage({ messages: this.unreadCount });
    },
  },

  { description: faker.person.fullName(), type: 'contact center', color: 'purple-300' },
];
const contacts = [
  {
    name: faker.person.fullName(),
    avatarPresence: 'active',
    callButtonTooltip: 'Call',
    presenceText: 'Work from home',
    hasUnreads: true,
    unreadCount: faker.number.int({ min: 0, max: 99 }).toString(),
    get unreadCountTooltip () {
      return unreadCountMessage({ messages: this.unreadCount });
    },
    get avatarSeed () {
      return this.name;
    },
  },
  {
    name: faker.person.fullName(),
    avatarPresence: 'away',
    callButtonTooltip: 'Call',
    presenceText: 'In a meeting',
    get avatarSeed () {
      return this.name;
    },
  },
  {
    name: faker.person.fullName(),
    avatarPresence: 'busy',
    callButtonTooltip: 'Call',
    presenceText: 'DND',
    muted: true,
    get avatarSeed () {
      return this.name;
    },
  },
  {
    name: faker.person.fullName(),
    avatarPresence: 'offline',
    callButtonTooltip: 'Call',
    presenceText: 'DND',
    muted: true,
    get avatarSeed () {
      return this.name;
    },
  },
];
const groups = [
  {
    description: faker.person.fullName(),
    type: 'coaching group',
    hasUnreads: true,
    unreadCount: faker.number.int({ min: 0, max: 99 }).toString(),
    get unreadCountTooltip () {
      return unreadCountMessage({ messages: this.unreadCount });
    },
  },
];

const unreadCountMessage = ({ messages, mentions }) => {
  const unreadMessages = messages && `${messages} unread messages`;
  const unreadMentions = mentions && `${mentions} unread mentions`;

  return [unreadMessages, unreadMentions].filter(item => !!item).join(' and ');
};

const favoriteChannels = computed(() => channels.slice(0, 1));
const favoriteContacts = computed(() => contacts.slice(0, 1));
const favoriteGroups = computed(() => groups.slice(0, 1));
</script>
