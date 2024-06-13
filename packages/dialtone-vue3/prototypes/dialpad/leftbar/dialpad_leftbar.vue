<template>
  <dt-stack gap="400">
    <dt-stack gap="200">
      <dt-recipe-general-row
        v-for="item in mainOptions"
        :key="item"
        :description="item.description"
        :has-unreads="item.hasUnreads"
        :unread-count="item.unreadCount"
        :unread-count-tooltip="`${item.unreadCount} unread messages`"
        :type="item.type"
      />
    </dt-stack>
    <dt-stack
      gap="200"
    >
      <dt-collapsible :open="isFavoritesOpen">
        <template #anchor="{ attrs }">
          <leftbar-section-header
            v-model="isFavoritesOpen"
            text="Favorites"
            v-bind="attrs"
            show-mark-as-read
          />
        </template>
        <template #content>
          <dt-stack gap="200">
            <dt-recipe-general-row
              v-for="channel in favoriteChannels"
              :key="channel.description"
              :description="channel.description"
              :has-call-button="channel.hasCallButton"
              :type="channel.type"
              :icon-size="channel.iconSize"
              :unread-count="channel.unreadCount"
              :unread-count-tooltip="`${channel.unreadCount} unread messages`"
              :has-unreads="channel.hasUnreads"
            />
            <dt-recipe-general-row
              v-for="group in favoriteGroups"
              :key="group.description"
              :description="group.description"
              :has-call-button="group.hasCallButton"
              :type="group.type"
              :icon-size="group.iconSize"
              :unread-count="group.unreadCount"
              :unread-count-tooltip="`${group.unreadCount} unread messages`"
              :has-unreads="group.hasUnreads"
            />
            <dt-recipe-contact-row
              v-for="item in favoriteContacts"
              :key="item.text"
              :name="item.name"
              :avatar-seed="item.name"
              :avatar-presence="item.avatarPresence"
              :call-button-tooltip="item.callButtonTooltip"
              :has-call-button="item.hasCallButton"
              :presence-text="item.presenceText"
              :has-unreads="item.hasUnreads"
              :unread-count="item.unreadCount"
            />
          </dt-stack>
        </template>
      </dt-collapsible>
      <dt-collapsible :open="isContactCentersOpen">
        <template #anchor="{ attrs }">
          <leftbar-section-header
            v-model="isContactCentersOpen"
            text="Contact centers"
            v-bind="attrs"
            show-contact-center-availability
          />
        </template>
        <template #content>
          <dt-stack gap="200">
            <dt-recipe-general-row
              v-for="contactCenter in contactCenters"
              :key="contactCenter.description"
              :description="contactCenter.description"
              :type="contactCenter.type"
              :color="contactCenter.color"
              :unread-count="contactCenter.unreadCount"
              :unread-count-tooltip="`${contactCenter.unreadCount} unread messages`"
              :has-unreads="contactCenter.hasUnreads"
            />
          </dt-stack>
        </template>
      </dt-collapsible>
      <dt-collapsible :open="isChannelsOpen">
        <template #anchor="{ attrs }">
          <leftbar-section-header
            v-model="isChannelsOpen"
            text="Channels"
            v-bind="attrs"
            :show-dropdown="true"
          />
        </template>
        <template #content>
          <dt-stack gap="200">
            <dt-recipe-general-row
              v-for="channel in channels"
              :key="channel.description"
              :description="channel.description"
              :type="channel.type"
              :icon-size="channel.iconSize"
              :unread-count="channel.unreadCount"
              :unread-count-tooltip="`${channel.unreadCount} unread messages`"
              :has-unreads="channel.hasUnreads"
            />
          </dt-stack>
        </template>
      </dt-collapsible>
      <dt-collapsible :open="isRecentsOpen">
        <template #anchor="{ attrs }">
          <leftbar-section-header
            v-model="isRecentsOpen"
            text="Recents"
            v-bind="attrs"
            :show-mark-as-read="true"
          />
        </template>
        <template #content>
          <dt-stack gap="200">
            <dt-recipe-general-row
              v-for="group in groups"
              :key="group.description"
              :description="group.description"
              :type="group.type"
              :unread-count="group.unreadCount"
              :unread-count-tooltip="`${group.unreadCount} unread messages`"
              :has-unreads="group.hasUnreads"
            />
            <dt-recipe-contact-row
              v-for="contact in contacts"
              :key="contact.name"
              :name="contact.name"
              :avatar-seed="contact.name"
              :avatar-presence="contact.avatarPresence"
              :call-button-tooltip="contact.callButtonTooltip"
              :has-call-button="contact.hasCallButton"
              :presence-text="contact.presenceText"
              :has-unreads="contact.hasUnreads"
              :unread-count="contact.unreadCount"
            />
          </dt-stack>
        </template>
      </dt-collapsible>
    </dt-stack>
  </dt-stack>
</template>

<script setup>
import LeftbarSectionHeader from './dialpad_leftbar_section_header.vue';
import { DtStack } from '@/components/stack';
import { DtCollapsible } from '@/components/collapsible';
import { DtRecipeGeneralRow } from '@/recipes/leftbar/general_row';
import { DtRecipeContactRow } from '@/recipes/leftbar/contact_row';
import { faker } from '@faker-js/faker';
import { ref, computed } from 'vue';

const isFavoritesOpen = ref(true);
const isContactCentersOpen = ref(true);
const isChannelsOpen = ref(true);
const isRecentsOpen = ref(true);

const mainOptions = ref([
  { description: 'Inbox', type: 'inbox', hasUnreads: true },
  { description: 'Contacts', type: 'contacts', hasUnreads: false },
  { description: 'All channels', type: 'channels', hasUnreads: false },
  { description: 'Threads', type: 'threads', hasUnreads: false },
]);
const channels = ref([
  {
    description: faker.word.sample({ strategy: 'longest' }),
    type: 'channels',
    iconSize: '200',
    unreadCount: faker.number.int({ min: 0, max: 9 }).toString(),
    hasUnreads: true,
  },
  {
    description: faker.word.sample(),
    type: 'channels',
    iconSize: '200',
  },
  {
    description: faker.word.sample({ strategy: 'longest' }),
    type: 'locked channel',
    iconSize: '200',
  },
]);
const contactCenters = ref([
  {
    description: faker.person.fullName(),
    type: 'contact center',
    color: 'magenta-200',
  },
  {
    description: faker.person.fullName(),
    type: 'contact center',
    color: 'gold-300',
    unreadCount: faker.number.int({ min: 0, max: 99 }).toString(),
    hasUnreads: true,
  },
  {
    description: faker.person.fullName(),
    type: 'contact center',
    color: 'purple-300',
  },
]);
const contacts = ref([
  {
    name: faker.person.fullName(),
    avatarPresence: 'active',
    callButtonTooltip: 'Call',
    presenceText: 'Work from home',
    hasUnreads: true,
    unreadCount: faker.number.int({ min: 0, max: 99 }).toString(),
  },
  {
    name: faker.person.fullName(),
    avatarPresence: 'away',
    callButtonTooltip: 'Call',
    presenceText: 'In a meeting',
  },
  {
    name: faker.person.fullName(),
    avatarPresence: 'busy',
    callButtonTooltip: 'Call',
    presenceText: 'DND',
  },
  {
    name: faker.person.fullName(),
    avatarPresence: 'offline',
    callButtonTooltip: 'Call',
    presenceText: 'DND',
  },
]);
const groups = ref([
  {
    description: faker.person.fullName(),
    type: 'coaching group',
    hasUnreads: true,
    unreadCount: faker.number.int({ min: 0, max: 99 }).toString(),
  },
]);

const favoriteChannels = computed(() => channels.value.slice(0, 1));
const favoriteContacts = computed(() => contacts.value.slice(0, 1));
const favoriteGroups = computed(() => groups.value.slice(0, 1));
</script>
