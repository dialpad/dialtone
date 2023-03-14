<template>
  <dt-avatar
    :id="$attrs.id"
    :size="$attrs.size"
    :presence="$attrs.presence"
    :avatar-class="$attrs.avatarClass"
    :initials="$attrs.initials"
    :seed="$attrs.seed"
    :gradient="$attrs.gradient"
    :group="$attrs.group"
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
