<template>
  <dt-recipe-general-row
    :description="names"
    :aria-label="`${groupCountText} ${names}`"
    :unread-count="unreadCount"
    :has-unreads="hasUnreads"
    :unread-count-tooltip="unreadCountTooltip"
    :selected="selected"
    :is-typing="isTyping"
  >
    <template #left>
      <dt-avatar
        :initials="avatarInitials"
        :seed="avatarSeed"
        :group="groupCount"
      >
        <img
          v-if="avatarSrc"
          data-qa="dt-avatar-image"
          :src="avatarSrc"
          :alt="avatarInitials"
        >
      </dt-avatar>
    </template>
  </dt-recipe-general-row>
</template>

<script>
import { DtRecipeGeneralRow } from '@/recipes/leftbar/general_row';
import DtAvatar from '@/components/avatar/avatar.vue';

export default {
  name: 'DtRecipeGroupRow',

  components: {
    DtAvatar,
    DtRecipeGeneralRow,
  },

  props: {
    /**
     * Optional avatar image url.
     * if provided, it's also required to provide a value in the `avatarInitials` prop to use
     * in the alt attribute of the avatar.
     */
    avatarSrc: {
      type: String,
      default: '',
    },

    /**
     * Initials to display on the avatar if avatarSrc is not provided or
     * alt attr if avatarSrc is provided.
     */
    avatarInitials: {
      type: String,
      default: '',
      required: true,
    },

    /**
     * Avatar seed, set this to the user's ID to get the same avatar background gradient each time it is displayed.
     */
    avatarSeed: {
      type: String,
      default: null,
    },

    /**
     * Number displayed in avatar to count group members
     */
    groupCount: {
      type: Number,
      required: true,
    },

    /**
     * Screen reader will read out the number of users in the group using this text. Ex: "2 users"
     */
    groupCountText: {
      type: String,
      default: '',
    },

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
     * Text shown when the unread count is hovered.
     */
    unreadCountTooltip: {
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

  emits: [
    /**
     * Native click event on the row itself
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],
};
</script>
