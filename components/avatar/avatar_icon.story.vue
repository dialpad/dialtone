<template>
  <dt-avatar
    :id="id"
    :size="size"
    :presence="presence"
    :color="color"
    :seed="seed"
    :overlay-icon="overlayIcon"
    :overlay-text="overlayText"
    :overlay-class="overlayClass"
  >
    <dt-icon
      v-show="iconSize"
      :name="defaultSlot"
      :size="iconSize"
    />
  </dt-avatar>
</template>

<script>
import DtAvatar from './avatar.vue';
import { DtIcon } from '@/components/icon';
import { AVATAR_ICON_SIZES } from './avatar_constants';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar, DtIcon },
  computed: {
    iconSize () {
      return AVATAR_ICON_SIZES[this.size ?? 'md'];
    },
  },
};
</script>
