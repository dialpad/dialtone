<template>
  <dt-avatar
    :id="id"
    :size="size"
    :color="color"
  >
    <dt-icon
      :name="defaultSlot"
      :size="iconSize"
    />
  </dt-avatar>
</template>

<script>
import DtAvatar from './avatar';
import { DtIcon } from '@/components/icon';
import { AVATAR_ICON_SIZES } from './avatar_constants';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar, DtIcon },
  computed: {
    iconSize () {
      return AVATAR_ICON_SIZES[this.size];
    },
  },
};
</script>
