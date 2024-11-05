<template>
  <dt-recipe-group-row
    :group-count-text="$attrs.groupCountText"
    :names="$attrs.names"
    :unread-count="$attrs.unreadCount"
    :unread-count-tooltip="$attrs.unreadCountTooltip"
    :has-unreads="$attrs.hasUnreads"
    :has-reply-button="$attrs.hasReplyButton"
    :reply-button-tooltip="$attrs.replyButtonTooltip"
    :selected="$attrs.selected"
    :is-typing="$attrs.isTyping"
    @click="$attrs.onClick"
    @reply="$attrs.onReply"
  />
</template>

<script>
import DtRecipeGroupRow from './group_row.vue';

export default {
  name: 'DtRecipeGroupRowDefault',
  components: { DtRecipeGroupRow },
};
</script>
