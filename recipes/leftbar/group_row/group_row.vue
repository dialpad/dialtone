<template>
  <dt-recipe-general-row
    :description="names"
    :unread-count="unreadCount"
    :selected="selected"
  >
    <template #left>
      <dt-avatar
        :initials="avatarInitials"
        :group="groupCount"
      >
        <img
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
     * Number displayed in avatar to count group members
     */
    groupCount: {
      type: Number,
      required: true,
    },

    /**
     * Names of the group members
     */
    names: {
      type: String,
      default: '',
    },

    /**
     * Number of unread messages
     */
    unreadCount: {
      type: String,
      default: null,
    },

    /**
     * Determines if the row is selected
     */
    selected: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
