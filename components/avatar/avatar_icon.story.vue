<template>
  <dt-avatar
    :id="$attrs.id"
    :size="$attrs.size"
    :color="$attrs.color"
  >
    <component
      :is="defaultSlot"
    />
  </dt-avatar>
</template>

<script>
import DtAvatar from './avatar';
import icon from '@/common/mixins/icon';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar },
  mixins: [icon],
};
</script>
