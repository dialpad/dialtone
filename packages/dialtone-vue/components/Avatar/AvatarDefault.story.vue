<template>
  <dt-avatar
    :id="$attrs.id"
    :full-name="$attrs.fullName"
    :image-src="$attrs.imageSrc"
    :image-alt="$attrs.imageAlt"
    :size="$attrs.size"
    :presence="$attrs.presence"
    :avatar-class="$attrs.avatarClass"
    :canvas-class="$attrs.canvasClass"
    :icon-class="$attrs.iconClass"
    :seed="$attrs.seed"
    :group="$attrs.group"
    :color="$attrs.color"
    :overlay-text="$attrs.overlayText"
    :overlay-class="$attrs.overlayClass"
    :interactive="$attrs.interactive"
    @click="$attrs.onClick"
  >
    <template
      v-if="$attrs.iconName"
      #icon
    >
      <dt-icon
        :name="$attrs.iconName"
        :size="$attrs.iconSize"
      />
    </template>
    <template
      v-if="$attrs.overlayIcon"
      #overlayIcon
    >
      <dt-icon
        :name="$attrs.overlayIcon"
        size="300"
      />
    </template>
  </dt-avatar>
</template>

<script>
import DtAvatar from './Avatar.vue';
import { DtIcon } from '@/components/Icon';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar, DtIcon },
};
</script>
