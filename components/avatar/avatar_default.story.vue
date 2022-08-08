<template>
  <dt-avatar
    :id="id"
    :size="size"
    :color="color"
  >
    <html-fragment
      :html="defaultSlot"
    />
  </dt-avatar>
</template>

<script>
import DtAvatar from './avatar';
import { htmlFragment } from '@/common/utils';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar, htmlFragment },
};
</script>
