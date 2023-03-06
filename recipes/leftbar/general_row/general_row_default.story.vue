<template>
  <dt-recipe-general-row
    :type="type"
    :color="color"
    :description="description"
    :unread-count="unreadCount"
    :has-unreads="hasUnreads"
    :selected="selected"
    :muted="muted"
    :active-voice-chat="activeVoiceChat"
    :dnd-text="dndText"
    @click="onClick"
    @call="onCall"
  />
</template>

<script>
import DtRecipeGeneralRow from './general_row';

export default {
  name: 'DtRecipeGeneralRowDefault',
  components: { DtRecipeGeneralRow },
};
</script>
