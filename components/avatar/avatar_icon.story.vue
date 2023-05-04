<template>
  <dt-avatar
    :id="$attrs.id"
    :size="$attrs.size"
    :presence="$attrs.presence"
    :seed="$attrs.seed"
    :gradient="$attrs.gradient"
    :overlay-icon="$attrs.overlayIcon"
    :overlay-text="$attrs.overlayText"
    :overlay-class="$attrs.overlayClass"
  >
    <dt-icon
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
  name: 'DtAvatarDefaultIcon',
  components: { DtAvatar, DtIcon },
  computed: {
    iconSize () {
      return AVATAR_ICON_SIZES[this.$attrs.size];
    },
  },
};
</script>
