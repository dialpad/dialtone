<template>
  <dt-avatar
    :id="$attrs.id"
    :size="$attrs.size"
    :presence="$attrs.presence"
    :avatar-class="$attrs.avatarClass"
    :canvas-class="$attrs.canvasClass"
    :initials="$attrs.initials"
    :seed="$attrs.seed"
    :gradient="$attrs.gradient"
    :group="$attrs.group"
    :overlay-icon="$attrs.overlayIcon"
    :overlay-text="$attrs.overlayText"
    :overlay-class="$attrs.overlayClass"
  >
    <v-html :html="defaultSlot" />
  </dt-avatar>
</template>

<script>
import DtAvatar from './avatar.vue';
import VHtml from '@/common/v_html';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar, VHtml },
};
</script>
