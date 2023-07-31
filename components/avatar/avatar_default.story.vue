<template>
  <dt-avatar
    :id="id"
    :full-name="fullName"
    :icon-name="iconName"
    :image-src="imageSrc"
    :image-alt="imageAlt"
    :icon-size="iconSize"
    :size="size"
    :presence="presence"
    :avatar-class="avatarClass"
    :canvas-class="canvasClass"
    :seed="seed"
    :group="group"
    :color="color"
    :overlay-icon="overlayIcon"
    :overlay-text="overlayText"
    :overlay-class="overlayClass"
  />
</template>

<script>
import DtAvatar from './avatar.vue';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar },
};
</script>
