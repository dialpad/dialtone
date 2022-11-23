<template>
  <dt-avatar
    :id="$attrs.id"
    :size="$attrs.size"
    :color="$attrs.color"
    :presence="$attrs.presence"
  >
    <v-html :html="defaultSlot" />
  </dt-avatar>
</template>

<script>
import DtAvatar from './avatar';
import VHtml from '@/common/v_html';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar, VHtml },
};
</script>
