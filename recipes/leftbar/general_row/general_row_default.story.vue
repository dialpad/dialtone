<template>
  <dt-recipe-general-row
    :type="type"
    :color="color"
    :description="description"
    :unread-count="unreadCount"
    :has-unreads="hasUnreads"
    :aria-label="ariaLabel"
    :unread-count-tooltip="unreadCountTooltip"
    :selected="selected"
    :has-call-button="hasCallButton"
    :call-button-tooltip="callButtonTooltip"
    :muted="muted"
    :active-voice-chat="activeVoiceChat"
    :dnd-text="dndText"
    :dnd-text-tooltip="dndTextTooltip"
    :is-typing="isTyping"
    :icon-size="iconSize"
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
