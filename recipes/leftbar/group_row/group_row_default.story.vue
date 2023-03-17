<template>
  <dt-recipe-group-row
    :avatar-initials="$attrs.avatarInitials"
    :group-count="$attrs.groupCount"
    :group-count-text="$attrs.groupCountText"
    :names="$attrs.names"
    :avatar-src="$attrs.avatarSrc"
    :avatar-seed="$attrs.avatarSeed"
    :unread-count="$attrs.unreadCount"
    :unread-count-tooltip="$attrs.unreadCountTooltip"
    :has-unreads="$attrs.hasUnreads"
    :selected="$attrs.selected"
    :is-typing="$attrs.isTyping"
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
