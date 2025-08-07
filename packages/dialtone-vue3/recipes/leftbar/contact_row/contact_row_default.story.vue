<template>
  <dt-recipe-contact-row
    :name="$attrs.name"
    :avatar-src="$attrs.avatarSrc"
    :avatar-presence="$attrs.avatarPresence"
    :avatar-seed="$attrs.avatarSeed"
    :avatar-color="$attrs.avatarColor"
    :presence-text="$attrs.presenceText"
    :unread-count="$attrs.unreadCount"
    :user-status="$attrs.userStatus"
    :has-unreads="$attrs.hasUnreads"
    :muted="$attrs.muted"
    :selected="$attrs.selected"
    :no-initials="$attrs.noInitials"
    :is-typing="$attrs.isTyping"
    :has-call-button="$attrs.hasCallButton"
    @click="$attrs.onClick"
    @call="$attrs.onCall"
  />
</template>

<script>
import DtRecipeContactRow from './contact_row.vue';

export default {
  name: 'DtRecipeContactRowDefault',
  components: { DtRecipeContactRow },
};
</script>
