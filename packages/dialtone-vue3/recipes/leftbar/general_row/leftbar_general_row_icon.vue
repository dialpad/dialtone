<template>
  <component
    :is="getIconName"
    v-if="isIconType"
    :size="iconSize"
  />
  <div
    v-else-if="isContactCenterType"
    :class="contactCenterIconClasses"
  />
  <div
    v-else-if="isDialbotType"
    class="d-recipe-leftbar-general-row__icon"
    data-qa="general-row-dialbot"
  >
    <dt-icon-dialbot
      size="500"
    />
  </div>
</template>

<script>
import {
  DtIconDialbot,
  DtIconInbox,
  DtIconContacts,
  DtIconHash,
  DtIconThread,
  DtIconLayoutTemplate,
  DtIconLock,
  DtIconSparkle,
  DtIconUsers,
  DtIconExternalLink,
  DtIconLockFilled,
  DtIconHashBold,
  DtIconAtSign,
  DtIconLaptop2,
  DtIconCalendarClock,
} from '@dialpad/dialtone-icons/vue3';
import {
  LEFTBAR_GENERAL_ROW_TYPES as TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS as COLORS,
} from '@/recipes/leftbar/general_row/general_row_constants';

const typeToIcon = new Map([
  [TYPES.INBOX, DtIconInbox],
  [TYPES.CONTACTS, DtIconContacts],
  [TYPES.CHANNELS, DtIconHash],
  [TYPES.THREADS, DtIconThread],
  [TYPES.LAUNCHPAD, DtIconLayoutTemplate],
  [TYPES.LOCKED_CHANNEL, DtIconLock],
  [TYPES.QUICK_START, DtIconSparkle],
  [TYPES.COACHING_GROUP, DtIconUsers],
  [TYPES.COACHING_CENTER, DtIconExternalLink],
  ['locked channel unread', DtIconLockFilled],
  ['channel unread', DtIconHashBold],
  [TYPES.ASSIGNED, DtIconAtSign],
  [TYPES.DIGITAL, DtIconLaptop2],
  [TYPES.SCHEDULED, DtIconCalendarClock],
]);

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeLeftbarGeneralRowIcon',
  components: {
    DtIconDialbot,
    DtIconInbox,
    DtIconContacts,
    DtIconHash,
    DtIconThread,
    DtIconLayoutTemplate,
    DtIconLock,
    DtIconSparkle,
    DtIconUsers,
    DtIconExternalLink,
    DtIconLockFilled,
    DtIconHashBold,
    DtIconAtSign,
    DtIconLaptop2,
    DtIconCalendarClock,
  },

  props: {
    type: {
      type: String,
      default: null,
    },

    color: {
      type: String,
      default: null,
    },

    iconSize: {
      type: String,
      default: '300',
    },
  },

  computed: {
    isIconType () {
      return ![TYPES.DIALBOT, TYPES.CONTACT_CENTER].includes(this.type);
    },

    isContactCenterType () {
      return this.type === TYPES.CONTACT_CENTER;
    },

    isDialbotType () {
      return this.type === TYPES.DIALBOT;
    },

    getIconName () {
      return typeToIcon.get(this.type);
    },

    contactCenterIconClasses () {
      return [
        'd-recipe-leftbar-row__icon-cc',
        COLORS[this.color],
      ];
    },
  },
};
</script>
