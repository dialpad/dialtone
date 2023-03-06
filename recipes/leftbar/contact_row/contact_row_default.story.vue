<template>
  <dt-recipe-contact-row
    :name="name"
    :avatar-src="avatarSrc"
    :avatar-presence="avatarPresence"
    :avatar-seed="avatarSeed"
    :presence-text="presenceText"
    :unread-count="unreadCount"
    :user-status="userStatus"
    :has-unreads="hasUnreads"
    :muted="muted"
    :selected="selected"
    :no-initials="noInitials"
    @click="onClick"
    @call="onCall"
  />
</template>

<script>
import DtRecipeContactRow from './contact_row';

export default {
  name: 'DtRecipeContactRowDefault',
  components: { DtRecipeContactRow },
};
</script>
