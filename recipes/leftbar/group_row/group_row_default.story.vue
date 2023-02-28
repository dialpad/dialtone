<template>
  <dt-recipe-group-row
    :avatar-initials="avatarInitials"
    :group-count="groupCount"
    :names="names"
    :avatar-src="avatarSrc"
    :unread-count="unreadCount"
    :selected="selected"
    @click="onClick"
  />
</template>

<script>
import DtRecipeGroupRow from './group_row';

export default {
  name: 'DtRecipeGroupRowDefault',
  components: { DtRecipeGroupRow },
};
</script>
