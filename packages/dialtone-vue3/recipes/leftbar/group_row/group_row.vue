<template>
  <dt-recipe-general-row
    :description="names"
    :aria-label="ariaLabel"
    :unread-count="unreadCount"
    :has-unreads="hasUnreads"
    :unread-mention-count="unreadMentionCount"
    :unread-count-tooltip="unreadCountTooltip"
    :selected="selected"
    :is-typing="isTyping"
    v-bind="$attrs"
    v-on="contactRowListeners"
  >
    <template #left>
      <dt-icon-users
        size="300"
      />
    </template>
  </dt-recipe-general-row>
</template>

<script>
import { DtRecipeGeneralRow } from '@/recipes/leftbar/general_row';
import { DtIconUsers } from '@dialpad/dialtone-icons/vue3';
import { safeConcatStrings, extractVueListeners } from '@/common/utils';
import { DialtoneLocalization } from '@/localization';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeGroupRow',

  components: {
    DtIconUsers,
    DtRecipeGeneralRow,
  },

  inheritAttrs: false,

  props: {

    /**
     * Names of the group members
     */
    names: {
      type: String,
      required: true,
    },

    /**
     * Number of unread messages
     */
    unreadCount: {
      type: String,
      default: null,
    },

    /**
     * Number of unread mention messages
     */
    unreadMentionCount: {
      type: String,
      default: null,
    },

    /**
     * Styles the row with an increased font weight to convey it has unreads. This must be true to see
     * the unread count badge.
     */
    hasUnreads: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines if the row is selected
     */
    selected: {
      type: Boolean,
      default: false,
    },

    /**
     * Shows an "is typing" animation over the avatar when true.
     */
    isTyping: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    groupCount () {
      return this.names.split(',').length;
    },

    messageCount () {
      return isNaN(this.unreadCount)
        ? this.unreadCount
        : Number(this.unreadCount);
    },

    mentionCount () {
      return isNaN(this.unreadMentionCount)
        ? this.unreadMentionCount
        : Number(this.unreadMentionCount);
    },

    unreadCountTooltip () {
      return safeConcatStrings([
        this.unreadCount && this.i18n.$t('DIALTONE_UNREAD_MESSAGE_COUNT_TEXT', { unreadCount: this.messageCount }),
        this.unreadMentionCount && this.i18n.$t('DIALTONE_UNREAD_MENTION_COUNT_TEXT', { unreadCount: this.mentionCount }),
      ]);
    },

    typingTooltip () {
      return this.isTyping && this.i18n.$t('DIALTONE_TYPING_TEXT');
    },

    ariaLabel () {
      return safeConcatStrings([
        this.typingTooltip,
        this.i18n.$t('DIALTONE_GROUP_ROW_GROUP_COUNT_TEXT', { count: this.groupCount }),
        this.names,
        this.unreadCountTooltip,
      ]);
    },

    contactRowListeners () {
      return extractVueListeners(this.$attrs);
    },
  },
};
</script>
