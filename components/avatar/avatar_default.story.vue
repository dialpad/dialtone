<template>
  <dt-avatar
    :id="id"
    :size="size"
    :presence="presence"
    :avatar-class="avatarClass"
    :canvas-class="canvasClass"
    :initials="initials"
    :seed="seed"
    :gradient="gradient"
    :group="group"
    :overlay-icon="overlayIcon"
    :overlay-text="overlayText"
    :overlay-class="overlayClass"
  >
    <html-fragment
      :html="defaultSlot"
    />
  </dt-avatar>
</template>

<script>
import { htmlFragment } from '@/common/utils';
import DtAvatar from './avatar.vue';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar, htmlFragment },
};
</script>
