<template>
  <dt-recipe-group-row
    :avatar-initials="$attrs.avatarInitials"
    :group-count="$attrs.groupCount"
    :names="$attrs.names"
    :avatar-src="$attrs.avatarSrc"
    :unread-count="$attrs.unreadCount"
    :selected="$attrs.selected"
    @click="$attrs.onClick"
  />
</template>

<script>
import DtRecipeGroupRow from './group_row';

export default {
  name: 'DtRecipeGroupRowDefault',
  components: { DtRecipeGroupRow },
};
</script>
