<template>
  <dt-avatar
    :id="$attrs.id"
    :full-name="$attrs.fullName"
    :icon-name="$attrs.iconName"
    :image-src="$attrs.imageSrc"
    :image-alt="$attrs.imageAlt"
    :icon-size="$attrs.iconSize"
    :size="$attrs.size"
    :presence="$attrs.presence"
    :avatar-class="$attrs.avatarClass"
    :canvas-class="$attrs.canvasClass"
    :seed="$attrs.seed"
    :group="$attrs.group"
    :color="$attrs.color"
    :overlay-icon="$attrs.overlayIcon"
    :overlay-text="$attrs.overlayText"
    :overlay-class="$attrs.overlayClass"
  />
</template>

<script>
import DtAvatar from './avatar.vue';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar },
};
</script>
