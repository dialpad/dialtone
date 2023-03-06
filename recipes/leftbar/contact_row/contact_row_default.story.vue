<template>
  <dt-recipe-contact-row
    :name="$attrs.name"
    :avatar-src="$attrs.avatarSrc"
    :avatar-presence="$attrs.avatarPresence"
    :avatar-seed="$attrs.avatarSeed"
    :presence-text="$attrs.presenceText"
    :unread-count="$attrs.unreadCount"
    :user-status="$attrs.userStatus"
    :has-unreads="$attrs.hasUnreads"
    :muted="$attrs.muted"
    :selected="$attrs.selected"
    :no-initials="$attrs.noInitials"
    @click="$attrs.onClick"
    @call="$attrs.onCall"
  />
</template>

<script>
import DtRecipeContactRow from './contact_row';

export default {
  name: 'DtRecipeContactRowDefault',
  components: { DtRecipeContactRow },
};
</script>
